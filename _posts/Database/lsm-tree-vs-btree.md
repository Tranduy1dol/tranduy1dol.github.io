---
title: "LSM-tree vs B-tree: write nhanh hay read nhanh — chọn một"
date: 2026-05-12
excerpt: B-tree tối ưu cho đọc, nhưng write-heavy workload thì sao? LSM-tree giải quyết bằng cách tách write path và read path hoàn toàn.
category: SYSTEMS
---

## Tension cơ bản

[Bài trước](../Database/postgresql-index-btree) mình nói B-tree giảm disk I/O từ 20 lần xuống 3 lần cho mỗi read. Nhưng cuối bài cũng đã nói mặt trái: mỗi index thêm overhead cho write — node split, cập nhật nhiều pages, random I/O rải rác trên disk.

Với e-commerce product catalog — vài nghìn writes/ngày — không thành vấn đề. Nhưng với trading engine ghi hàng triệu events/giây, hoặc time-series database nhận metrics liên tục — random I/O trở thành bottleneck.

## LSM-tree: đổi read chậm hơn lấy write nhanh hơn

LSM-tree (Log-Structured Merge-tree) giải quyết bằng một ý tưởng đơn giản: **không bao giờ ghi random vào disk**. Mọi write đều là sequential — nối vào cuối file.

### Write path

```text
Client write
    │
    ▼
┌─────────┐
│   WAL   │  ← ghi sequential vào disk (durability)
└────┬────┘
     │
     ▼
┌──────────┐
│ MemTable │  ← sorted tree trong RAM (thường là Skip List)
└────┬─────┘
     │  (khi đầy, ~4MB)
     ▼
┌──────────┐
│ SSTable  │  ← flush ra disk thành file sorted, immutable
└──────────┘
```

Mỗi bước:

1. **WAL**: ghi command vào append-only log trước — giống trading journal của mình. Nếu crash trước khi flush MemTable, replay WAL để khôi phục.
2. **MemTable**: insert key vào sorted structure trong RAM. Thường dùng Skip List thay vì Red-Black tree — vì Skip List cho phép concurrent writes dễ hơn (không cần rotation khi nhiều threads ghi đồng thời). Write ở đây là O(log n) trong memory — nhanh hơn nhiều so với disk I/O.
3. **SSTable** (Sorted String Table): khi MemTable đầy, dump toàn bộ ra disk thành một file đã sorted. File này immutable — không bao giờ bị sửa sau khi tạo.

Write vào LSM-tree = 1 sequential write (WAL) + 1 memory insert. Không có random I/O. Không có node split. Đó là lý do write nhanh hơn B-tree.

### Read path — cái giá phải trả

Đọc từ LSM-tree phức tạp hơn B-tree:

```text
Read key = "order_12345"
    │
    ▼
┌──────────┐
│ MemTable │  ← tìm trong RAM trước
└────┬─────┘
     │ không có
     ▼
┌──────────┐
│ SSTable₃ │  ← file mới nhất trên disk
└────┬─────┘
     │ không có
     ▼
┌──────────┐
│ SSTable₂ │  ← file cũ hơn
└────┬─────┘
     │ không có
     ▼
┌──────────┐
│ SSTable₁ │  ← file cũ nhất
└──────────┘
```

Worst case: key không tồn tại → phải tìm qua **tất cả** SSTables. Với hàng trăm SSTables, đây là thảm họa.

### Bloom filter — tránh đọc thừa

Bloom filter là probabilistic data structure: cho biết một key **chắc chắn không có** hoặc **có thể có** trong SSTable.

Cơ chế: một mảng bit cố định + k hash functions. Insert key → hash k lần → bật k bits lên 1. Check key → hash k lần → nếu bất kỳ bit nào = 0 → chắc chắn không có. Nếu tất cả = 1 → có thể có (vì bits đó có thể do keys khác bật). False negative không thể xảy ra vì bits đã bật không tự tắt.

```text
Bloom filter cho SSTable₂: "order_12345 chắc chắn không ở đây"
→ skip, không cần đọc disk
```

False positive rate thường set ở 1%. Nghĩa là 99% trường hợp, Bloom filter giúp skip SSTable không cần đọc. Chỉ 1% phải đọc thừa.

Không có Bloom filter, đọc một key không tồn tại phải scan toàn bộ SSTables. Với Bloom filter, chỉ cần check vài bytes trong memory cho mỗi SSTable.

## Compaction — dọn rác và giữ read không quá chậm

SSTables chỉ tăng, không bao giờ giảm. Nếu update cùng một key 100 lần → 100 versions nằm rải rác trong 100 SSTables khác nhau. Delete một key cũng không thực sự xóa — chỉ ghi thêm một **tombstone** marker.

Compaction giải quyết ba vấn đề:

1. **Loại bỏ duplicate keys** — giữ version mới nhất, xóa các version cũ
2. **Xóa tombstones** — records đã bị delete được dọn sạch khỏi disk
3. **Giảm số SSTables** — merge nhiều files nhỏ thành ít files lớn hơn

```text
Trước compaction:
  SSTable₁: [a=1, c=3, e=5]
  SSTable₂: [a=2, b=4, c=tombstone]  ← a được update, c bị delete

Sau compaction:
  SSTable_merged: [a=2, b=4, e=5]    ← a giữ version mới, c biến mất
```

Nếu không có compaction: read ngày càng chậm vì phải tìm qua nhiều SSTables, và disk đầy dần vì data cũ không được dọn.

### Compaction strategies

Hai strategy phổ biến:

**Size-tiered** (Cassandra default): merge SSTables có kích thước tương đương. Đơn giản, write throughput cao, nhưng space amplification lớn — cần disk trống gấp đôi data size để chạy compaction.

**Leveled** (RocksDB, LevelDB): tổ chức SSTables thành levels. Level 0 chứa files mới flush từ MemTable. Khi level đầy, merge xuống level tiếp theo. Mỗi level lớn hơn level trước 10x.

```text
Level 0: [SST₁] [SST₂] [SST₃]     ← có thể overlap keys
Level 1: [SST_A] [SST_B] [SST_C]   ← không overlap, sorted
Level 2: [SST_X] [SST_Y] ... [SST_Z]  ← 10x lớn hơn Level 1
```

Leveled compaction giữ read nhanh hơn (ít files phải check) nhưng write amplification cao hơn — mỗi key có thể bị rewrite nhiều lần khi di chuyển qua các levels.

## Kết nối với projects đã build

### Trading engine — write-heavy, LSM-tree phù hợp

Trading engine của mình ghi hàng triệu events với latency 257ns. Journal hiện tại là append-only log đơn giản — chưa có indexing.

Nếu cần query lại historical orders (ví dụ: "tất cả lệnh của user X trong 24h qua"), LSM-tree là lựa chọn tự nhiên:

- Write path không block matching engine — sequential append
- Read historical data chấp nhận chậm hơn vài ms — không trên hot path
- Compaction chạy background, không ảnh hưởng latency

Thực tế, nhiều trading systems dùng RocksDB (LSM-tree) làm embedded storage cho order history.

### E-commerce — read-heavy, B-tree đúng lựa chọn

Shopping-cart và product catalog: users browse nhiều hơn write. Mỗi page load = nhiều reads (products, categories, cart items). Writes chỉ xảy ra khi add to cart hoặc checkout.

B-tree (PostgreSQL) đúng ở đây: read nhanh, predictable latency, không cần lo compaction ăn CPU.

## Trade-off tổng kết

|                        | B-tree                    | LSM-tree                         |
| ---------------------- | ------------------------- | -------------------------------- |
| **Write**              | Chậm hơn (random I/O)    | Nhanh hơn (sequential)           |
| **Read**               | Nhanh hơn (1 structure)   | Chậm hơn (nhiều SSTables)        |
| **Space amplification** | Thấp                     | Cao (trước compaction)           |
| **Write amplification** | Thấp-trung bình          | Cao (compaction rewrite)         |
| **Use case**           | OLTP, read-heavy          | Write-heavy, time-series, logs   |
| **Databases**          | PostgreSQL, MySQL, SQLite | Cassandra, RocksDB, LevelDB, ScyllaDB |

Không có storage engine nào tốt cho mọi workload. B-tree tối ưu cho read, LSM-tree tối ưu cho write. Biết workload của mình là gì → chọn đúng tool.

## Bài học

1. **Write nhanh = đọc chậm hơn.** Không có cách nào tối ưu cả hai cùng lúc. LSM-tree chọn write, B-tree chọn read. Trade-off này là fundamental — không phải limitation của implementation.

2. **Sequential I/O thắng random I/O.** LSM-tree nhanh hơn B-tree khi write vì cùng một lý do: append vào cuối file nhanh hơn nhảy random trên disk. Đây cũng là lý do WAL trong bài trước dùng append-only.

3. **Compaction là cái giá của immutability.** Không sửa file = write đơn giản. Nhưng garbage tích tụ → cần background process dọn dẹp. Đây là trade-off giữa write simplicity và operational complexity.

4. **Bloom filter biến O(n) thành O(1) cho negative lookups.** Một vài KB memory cho mỗi SSTable tiết kiệm hàng nghìn disk reads. Probabilistic data structures không chỉ là lý thuyết — chúng là production necessity.
