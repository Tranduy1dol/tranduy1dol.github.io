---
title: Kế hoạch học tập & viết blog — Software Engineering
date: 2026-05-22
excerpt: Learning plan và roadmap đọc sách cho Systems Engineering
category: PLANNING
---

# Kế hoạch học tập & viết blog — Software Engineering

## Bối cảnh & mục tiêu

**Profile:** Rust Developer tại Sotatek, năm 3 UET Hanoi. Đã làm trading engine (io_uring, WAL, zero-copy), e-commerce microservice, blockchain/ZKP.

**Hai mục tiêu, một plan:**

- Hệ thống kiến thức sâu + viết blog để ghi nhớ
- Tìm job junior + tự tin phỏng vấn về CV

→ **Kết luận: gộp thành một** — đọc sách từ góc độ "hiểu internals của công cụ mình đã dùng"

---

## Insight cốt lõi

### Gap thực sự
>
> Bạn không thiếu kiến thức nền — bạn đã tự implement WAL, bitmap indexing, io_uring, zero-copy. Vấn đề là **chưa kết nối được những gì đã làm với terminology và mental model chuẩn**.

Bằng chứng: chỉ qua Socratic dialogue, bạn tự suy luận ra AOF, log compaction, RDB, consumer offset, replication, B-tree node split — không cần giải thích từ đầu.

### Stock vs Flow

| Loại | Công cụ | Ưu tiên |
|---|---|---|
| **Stock** | Database, Redis, memory | Trước |
| **Flow** | Kafka, gRPC | Sau |

### Công thức blog

Thay vì _"tôi đọc sách học được X"_ → viết **"Tôi dùng X trong project, đây là những gì tôi không hiểu, và đây là những gì tôi tìm ra"**

---

## Kiến thức đã tự suy luận được

### Redis

- ✅ AOF — append-only file (giống WAL tự implement)
- ✅ Log compaction — compact file định kỳ tránh file quá lớn
- ✅ RDB snapshot — snapshot toàn bộ state theo chu kỳ

### Kafka

- ✅ Consumer offset — giữ ID message cuối đã commit, mất mạng không update
- ✅ Disk persistence — nền tảng cơ bản để không mất message
- ✅ Leader-replica replication — mỗi partition có leader + nhiều replica trên broker khác nhau
- ✅ Broker failover — leader chết, replica được bầu lên làm leader mới

### PostgreSQL Index / B-tree

- ✅ Full table scan O(n) khi không có index
- ✅ Tại sao không dùng BST — disk I/O tốn kém, fragmentation
- ✅ Page = disk block 4KB — đơn vị đọc của disk
- ✅ 128 keys/node vs 1 key/node của BST — tận dụng hết 1 lần đọc disk
- ✅ Chiều cao log₁₂₈ ≈ 3 vs log₂ ≈ 20 cho 1 triệu rows → giảm disk I/O đáng kể
- ✅ Node split khi đầy — cách cây tự cân bằng
- ✅ Heap file & random I/O — actual data nằm rải rác, tệ với range query
- ✅ Insert chậm hơn vì phải cập nhật B-tree index
- ✅ Nhiều index → insert càng chậm (5 index = 5 lần cập nhật B-tree)

---

## Roadmap đọc sách

### Phase 1 — Database internals *(Đang ở đây · 6–8 tuần)*

- 📖 **Database Internals** — Ch.1–5 (storage engines, B-tree, LSM-tree)
- 📖 **DDIA** — Ch.3 Storage & Retrieval, Ch.5 Replication

> Gắn với: PostgreSQL, Redis trong CV + câu hỏi phỏng vấn thực tế đã bị hỏi

### Phase 2 — Distributed systems & messaging *(8–10 tuần)*

- 📖 **DDIA** — Ch.8 Trouble with Distributed Systems, Ch.9 Consistency & Consensus, Ch.11 Stream Processing
- 📖 **Kafka: The Definitive Guide**
- 📄 **MapReduce paper** (đọc trong 1 buổi)

> Gắn với: Kafka, RabbitMQ trong CV

### Phase 3 — Infrastructure *(4–6 tuần)*

- 📖 **Docker Deep Dive**
- 📖 **Mastering Kubernetes**

> Gắn với: Docker, K8s trong CV

### Phase 4 — Foundation + Practices *(đọc song song suốt quá trình)*

- 📖 **CS:APP** — Ch.6 Memory Hierarchy, Ch.8 Exceptional Control Flow
- 📄 **"What devs should know about memory"** paper
- 📖 **Clean Code** — 1–2 chapter/tuần
- 📖 **Fundamentals of Software Engineering** — 1–2 chapter/tuần

> Mục tiêu: đặt tên chính xác cho những gì bạn đã tự implement (io_uring, WAL, zero-copy, bitmap indexing)

---

## Kế hoạch viết blog

### Công thức cho mỗi bài

1. Câu hỏi phỏng vấn / vấn đề thực tế
2. Tại sao cách đơn giản nhất không đủ
3. Suy luận từng bước đến giải pháp
4. Trade-off ← phần tạo ra sự khác biệt
5. Liên hệ lại với project thực tế của bạn

---

### Phase 1 — Database

**#1 · Redis persistence: từ "mất data khi restart" đến AOF và RDB**

- Nguồn: Redis docs + DDIA Ch.5
- Từ e-commerce project
- ⚡ Kiến thức đã có — viết được ngay

**#2 · PostgreSQL index hoạt động thế nào? Câu hỏi phỏng vấn tôi không trả lời được**

- Nguồn: Database Internals Ch.2
- ⚡ Kiến thức đã có — viết được ngay
- Outline:
  1. Mở bài — câu hỏi phỏng vấn tôi không trả lời được
  2. Không có index → full table scan O(n)
  3. Tại sao không dùng BST — disk I/O tốn kém, fragmentation
  4. B-tree giải quyết thế nào — page 4KB, 128 keys/node, chiều cao log₁₂₈
  5. Node split — cách cây tự cân bằng khi insert
  6. Heap file & random I/O — hạn chế với range query
  7. Trade-off — insert/update chậm hơn, nhiều index không phải lúc nào cũng tốt

**#3 · WAL: tôi đã tự implement nó trong trading engine mà không biết tên**

- Nguồn: CS:APP + DB Internals
- Sau khi đọc phase 1 + 4

**#4 · LSM-tree vs B-tree: khi nào database chọn cái nào?**

- Nguồn: Database Internals Ch.3–4
- Sau khi đọc phase 1

---

### Phase 2 — Distributed & Messaging

**#5 · Kafka durability: replication, offset và những gì xảy ra khi mất mạng**

- Nguồn: Kafka: The Definitive Guide
- Kiến thức hôm nay đã có nền, cần đọc thêm Kafka book

**#6 · Tại sao distributed systems khó: CAP theorem từ góc nhìn thực tế**

- Nguồn: DDIA Ch.8–9

**#7 · Replication: leader-follower và bài toán consistency**

- Nguồn: DDIA Ch.5

---

### Phase 3 — Infrastructure

**#8 · Namespace và cgroup: nền tảng kỹ thuật của Docker**

- Nguồn: Docker Deep Dive

**#9 · Tại sao cần Kubernetes khi đã có Docker?**

- Nguồn: Mastering Kubernetes

---

### Phase 4 — Foundation (kết nối với project)

**#10 · io_uring: tại sao trading engine của tôi dùng nó thay vì epoll**

- Nguồn: CS:APP + Linux kernel docs
- Bài này sẽ rất unique với CV của bạn

**#11 · Zero-copy: kỹ thuật đằng sau wire protocol của trading engine**

- Nguồn: CS:APP Ch.6 + Memory paper

---

## Ghi chú quan trọng

**Đừng tóm tắt sách** — hãy viết "điều mình hiểu được sau khi đọc" thay vì "nội dung cuốn sách".

**Câu hỏi tự hỏi trước khi viết:** *"Nếu một đồng nghiệp hỏi mình điều này trong buổi review code, mình sẽ giải thích thế nào?"*

**Kết nối các phase** là thứ tạo ra những bài hay nhất — ví dụ bài #3 kết nối WAL bạn đã tự implement với database internals, bài #5 kết nối Kafka với những gì bạn đã suy luận về replication.
