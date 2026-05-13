---
title: "Kafka durability: tại sao message không mất và tại sao nó nhanh"
date: 2026-05-12
excerpt: Kafka xử lý hàng triệu messages/giây mà không mất data. Cơ chế bên dưới khá quen thuộc.
category: SYSTEMS
---
## Mình đã build mini-Kafka mà không biết

Trading engine của mình có:

- **Journal** — append-only log ghi mọi command theo thứ tự
- **`client_seq`** — sequence number do client gán, dùng để detect duplicate
- **io_uring** — async I/O không block main thread

Kafka có:

- **Commit log** — append-only log ghi mọi message theo thứ tự
- **Idempotent producer** — sequence number do producer gán, broker detect duplicate
- **Zero-copy sendfile** — kernel gửi data thẳng từ disk đến network socket

Cùng pattern, khác scale. Bài này đi sâu vào cách Kafka đảm bảo durability ở từng layer.

## Producer: message đến broker thế nào

### `acks` — mức độ đảm bảo khi ghi

Khi producer gửi message đến broker, làm sao để producer biết message đã "an toàn"?

```text
acks=0:  Producer gửi xong → không chờ → tiếp tục
acks=1:  Leader ghi vào log → ack producer
acks=all: Leader + tất cả in-sync replicas ghi xong → ack producer
```

`acks=0`: nhanh nhất, mất data nếu broker crash trước khi ghi. Dùng cho metrics, logs — mất vài message không sao.

`acks=1`: leader ghi xong là ack. Nếu leader crash trước khi replicate → message mất. Đây là default cũ của Kafka.

`acks=all` (hay `acks=-1`): chỉ ack khi tất cả in-sync replicas đã ghi. Message chỉ mất khi **toàn bộ** replicas crash cùng lúc. Đây là setting cho data không được mất.

### Idempotent producer — không gửi trùng

Network không đáng tin. Producer gửi message, broker ghi thành công, nếu ack bị mất trên đường về, producer retry và broker nhận duplicate message.

Kafka giải quyết bằng idempotent producer (từ version 0.11):

```text
enable.idempotence=true
```

Mỗi producer được gán một Producer ID (PID). Mỗi message mang sequence number tăng dần. Broker track sequence per partition, nếu nhận message với sequence đã thấy, broker sẽ drop silently.

Trading engine của mình làm điều tương tự với `client_seq`:

```rust
pub struct NewOrderMsg {
    pub client_seq: u64,  // idempotent key — broker bỏ qua nếu đã thấy
    pub order_id:   u64,
    pub user_id:    u64,
    // ...
}
```

Ở đây client gán ID, và server sẽ detect được trùng lặp giống Kafka. Có điều Kafka config ở tầng infra (bên trong lõi) thay vì tầng application.

### Transactions — atomic writes across partitions

Cao hơn idempotent producer là Kafka transactions. Một producer có thể ghi messages vào nhiều partitions và commit atomically — tất cả hoặc không gì cả.

```text
producer.beginTransaction()
producer.send(topic_A, msg1)
producer.send(topic_B, msg2)
producer.commitTransaction()  // cả hai message visible cùng lúc
```

Nếu producer crash giữa chừng, message sẽ bị loại bỏ, consumer không thấy message nào. Cơ chế này giống database transaction, nhưng được cài đặt cho distributed log.

## Broker: commit log và replication

### Commit log — append-only, sequential write

Mỗi partition trong Kafka là một **commit log**, hoạt động như một file append-only trên disk. Message mới nối vào cuối, không bao giờ sửa hay xóa message cũ.

```text
Partition 0:
[offset 0][offset 1][offset 2][offset 3][offset 4]...
    │          │          │          │          │
   msg₀      msg₁      msg₂      msg₃      msg₄
```

Mỗi message có một **offset** tăng dần và không thể edit (immutable), được dùng để định vị message trong partition.

Tại sao sequential write nhanh? Cùng lý do với [LSM-tree](../Database/lsm-tree-vs-btree) và [trading journal](../Database/wal-trading-engine): append vào cuối file chỉ tốn 1 sequential I/O. Không seek, không random write. Trên modern SSD, sequential write đạt hàng GB/s.

### Replication — leader và followers

Mỗi partition có 1 leader và N-1 followers (replicas). Producer chỉ ghi vào leader. Followers pull data từ leader liên tục.

```text
                    Producer
                       │
                       ▼
┌─────────────────────────────────────┐
│           Leader (Broker 1)         │
│       [0][1][2][3][4][5][6][7]      │
└──────────┬──────────────┬───────────┘
           │              │
           ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│ Follower (Br 2) │  │ Follower (Br 3) │
│ [0][1][2][3][4] │  │ [0][1][2][3][4] │
└─────────────────┘  └─────────────────┘
```

**In-Sync Replicas (ISR)**: followers đã catch up với leader (lag dưới ngưỡng). Khi `acks=all`, leader chờ tất cả ISR ghi xong mới ack.

Nếu leader crash, một follower trong ISR được bầu làm leader mới. Không mất message vì ISR đã có đầy đủ data.

Nếu follower lag quá nhiều, nó sẽ bị loại khỏi ISR. Lúc này `acks=all` chỉ cần chờ các replicas còn lại trong ISR, không bị block bởi follower chậm.

Nhưng có một gotcha: nếu tất cả followers lag và ISR chỉ còn leader — `acks=all` vẫn ack với 1 replica, không khác gì `acks=1`. Config `min.insync.replicas` giải quyết điều này:

```text
min.insync.replicas=2
```

Broker sẽ **reject write** nếu ISR có ít hơn 2 replicas. Thà từ chối ghi còn hơn ghi mà không đảm bảo durability. Combo `acks=all` + `min.insync.replicas=2` + replication factor 3 là standard cho data critical.

## Consumer: offset và delivery semantics

### Offset tracking

Consumer đọc messages từ partition theo offset. Kafka lưu offset hiện tại của mỗi consumer group trong internal topic `__consumer_offsets`.

```text
Consumer Group "order-processor":
  partition 0 → committed offset: 42
  partition 1 → committed offset: 87
```

Consumer đọc message, xử lý xong, rồi commit offset. Nếu consumer crash trước khi commit, nó sẽ restart và đọc lại từ offset cũ.

Lưu ý: Kafka default là **auto commit** mỗi 5 giây (`enable.auto.commit=true`). Nên commitSync() thủ công sau khi handle message hoàn tất, giúp tránh duplicate processing.

### At-least-once vs exactly-once

**At-least-once** (default): consumer đọc message → xử lý → commit offset. Nếu crash sau xử lý nhưng trước commit → message được xử lý lại khi restart. Duplicate có thể xảy ra.

**Exactly-once** ở application level: consumer xử lý message + commit offset trong cùng một transaction. Hoặc đơn giản hơn, dùng **idempotent key**:

```text
Message: { order_id: "abc-123", action: "place_order" }

Consumer logic:
  if order_id already processed → skip
  else → process + mark as done
```

Kafka cung cấp exactly-once ở infrastructure level qua `read_committed` isolation + transactions. Nhưng trong practice, idempotent key ở application level đơn giản và dễ reason about hơn.

## Tại sao Kafka nhanh

### Sequential I/O

Đã nói ở trên — append-only log. Nhưng điểm quan trọng: Kafka **không index messages**. Không có B-tree, không có hash map. Consumer tìm message bằng offset, seek đến byte position trong file. O(1) lookup.

Đây là trade-off: không thể query "tìm message có order_id = X". Muốn làm điều đó phải build consumer riêng đọc toàn bộ topic. Kafka là commit log, không phải database.

### Zero-copy với sendfile

Khi consumer đọc message, flow thông thường:

```text
Disk → Kernel buffer → User space buffer → Kernel socket buffer → NIC
       (read)          (copy)               (write)
```

4 lần copy, 2 lần context switch. Kafka dùng `sendfile()` system call:

```text
Disk → Kernel buffer → NIC
       (sendfile — không qua user space)
```

Kernel gửi data thẳng từ page cache đến network socket. Không copy vào user space. Đây là **zero-copy**. Kết hợp sequential write + zero-copy read, Kafka đạt throughput hàng triệu messages/giây trên hardware commodity.

## Kết nối: trading engine là mini-Kafka

| Component     | Trading Engine               | Kafka                        |
| ------------- | ---------------------------- | ---------------------------- |
| **Log**       | Journal (append-only)        | Commit log (append-only)     |
| **Dedup**     | `client_seq` per client      | Producer sequence per PID    |
| **Async I/O** | io_uring                     | sendfile (zero-copy)         |
| **Ordering**  | `engine_seq` global          | Offset per partition         |
| **Replay**    | Read journal → rebuild state | Consumer reads from offset 0 |

Khác biệt lớn nhất: Kafka là **distributed** — replication, partition, consumer groups. Trading engine là single-node — đơn giản hơn, latency thấp hơn, nhưng không fault-tolerant ở infrastructure level.

## Bài học

1. **Durability có nhiều mức.** `acks=0` → fire-and-forget. `acks=1` → leader durability. `acks=all` → cluster durability. Chọn mức phù hợp với data value — metrics có thể mất, financial transactions thì không.

2. **Exactly-once là bài toán end-to-end.** Kafka idempotent producer giải quyết producer → broker. Nhưng broker → consumer vẫn cần idempotent key ở application level. Không có magic bullet.

3. **Sequential I/O + zero-copy = throughput cao.** Kafka nhanh không phải vì thuật toán phức tạp — mà vì tận dụng tối đa hardware: append-only write, page cache, sendfile. Đơn giản nhưng hiệu quả.

4. **Commit log là abstraction mạnh.** Cùng pattern xuất hiện ở WAL (Postgres), AOF (Redis), Journal (trading engine), và Kafka. Append events, replay khi cần. Đơn giản, deterministic, dễ reason about.
