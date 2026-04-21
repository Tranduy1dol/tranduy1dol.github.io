---
title: Mình làm thêm project HFT vì mình thất nghiệp
date: 2026-04-21
excerpt: Cách mình code thêm một trading system để đưa vào cv
category: CODING
---
## Giới thiệu

Với các hệ thống Web thông thường, mình thường làm CRUD, thiết kế Database Schema và làm HTTP Restful API. Nhưng để tận dụng khả năng của Rust là ngôn ngữ lập trình hiệu suất cao và an toàn, mình cần tìm kiếm các bài toán có thể tận dụng triệt để các ưu điểm đó. Hệ thống giao dịch là một trong những bài toán đó. Khác với Web, hệ thống giao dịch cần tốc độ xử lý vô cùng nhanh (micro-giây), và cần lưu dữ liệu trong RAM vì IO của ổ cứng chậm hơn tốc độ cần.

Bài này sẽ trình bày cách mình triển khai hệ thống giao dịch này.

## Kiến trúc hệ thống

Ở bài viết trước về [Shopping Cart](/blog/Rust/e-commerce-backend), mình đã trình bày chi tiết về **Clean Architecture** và cách nó giúp tách biệt rõ ràng các tầng trong một ứng dụng Web. Trong dự án Trading Engine này, mình vẫn giữ nguyên tắc đó ở cấp độ crate, nhưng điểm nhấn kiến trúc lần này nằm ở một pattern hoàn toàn khác biệt: **LMAX Disruptor**.

### LMAX Disruptor

LMAX Disruptor là kiến trúc được sinh ra từ sàn giao dịch LMAX Exchange (London). Kiến trúc này hoạt động **"Mechanical Sympathy"** — viết phần mềm thuận theo cơ chế hoạt động của phần cứng.

- **Lock-free & Memory Barrier:** Loại bỏ việc dùng lock (Mutex/RwLock) để tránh làm hệ thống bị nghẽn.
- **Cache Line Padding:** Dữ liệu được thiết kế để nằm gọn trong cache L1/L2 của CPU.
- **Ring Buffer:** Cấu trúc dữ liệu trung tâm được khởi tạo với kích thước cố định. Các ô nhớ được cấp phát sẵn khi khởi tạo. Khi hệ thống không tạo mới hay cần xóa object nó sẽ ghi đè vào ô nhớ có sẵn.
- **Sequencer:** Một bộ đếm toàn cục (`engine_seq`) tăng đơn điệu đánh dấu thứ tự xử lý từng lệnh, đảm bảo tính xác định (determinism) tuyệt đối.

### Thread-per-Core

Để tối ưu hơn, mình cài đặt mô hình thread-per-core và sử dụng `io_uring`, nghĩa là mình gộp Network I/O và matching engine vào chung một thread và ghim nó vào một nhân CPU. Về cơ bản, cài đặt LMAX sẽ cần chạy một thread, hoạt động như consumer của một message queue với message là lệnh; ngoài nó thì thêm một hoặc nhiều thread gateway nhận kết nối TCP và handle network I/O. Tuy nhiên làm vậy sẽ bị chậm khi CPU mất thêm thời gian cho context switch. Matching engine mình cài đặt đủ nhanh và lock-free nên không lo vấn đề có nhiều lệnh đến cùng lúc.

### Triển khai

Giống như dự án Shopping Cart, mình dùng Cargo Workspace và triển khai Clean Architechture như sau:

- `crates/domain`: Crate này cài đặt các logic khớp lệnh tốc độ cao.
- `crates/application`: Crate này cài đặt bộ đếm toàn cục, đánh dấu thứ tự xử lý lệnh, đồng thời định tuyến Command ↔ Response.
- `crate/gateway`: Crate cài đặt TCP, sử dụng `io_uring` để cài đặt batch async I/O, dịch byte, và cài đặt WAL để có thể replay.

## Core Domain: Thiết kế In-Memory Order Book

- **Vấn đề:** Làm sao để tìm kiếm và khớp lệnh Mua (Bid) và lệnh Bán (Ask) nhanh nhất có thể theo nguyên tắc "Ưu tiên Giá, rồi đến Thời gian" (Price-Time Priority).
- **Cách triển khai trong Code:**
  - Giới thiệu các components trong thư mục `domain`: `order.rs`, `price_level.rs`, `order_queue.rs`.
  - Phân tích cấu trúc dữ liệu: Tại sao sổ lệnh (`order_book.rs`) thường dùng cấu trúc dạng Cây (như `BTreeMap` của Rust) để sắp xếp các mức giá (Price Levels) một cách tự động, và dùng danh sách liên kết (`LinkedList` hoặc `VecDeque`) bên trong mỗi mức giá để giữ thứ tự FIFO của các lệnh đặt.

## Gateway & Networking

- **Vấn đề:** HTTP/JSON có overhead (dữ liệu rác) quá lớn cho các hệ thống Trading.
- **Giải pháp:**
  - Xây dựng tầng mạng riêng (`gateway/src/reactor.rs`, `session.rs`) sử dụng TCP (hoặc UDP) thuần.
  - Giải thích file `protocol.rs` và `codec.rs`: Thay vì parse JSON chậm chạp, hệ thống sử dụng Custom Binary Codec để serialize/deserialize dữ liệu trực tiếp thành các bit/byte, giúp tiết kiệm tối đa băng thông và thời gian xử lý CPU.

## Event Journaling

- **Câu hỏi hóc búa:** Nếu mọi thứ chạy trên RAM (In-memory), lỡ server bị sập (crash) hoặc cúp điện thì sao? Dữ liệu lệnh đặt của khách hàng mất hết à?
- **Giải pháp:** Giới thiệu cơ chế ở file `gateway/src/journal.rs`.
  - Áp dụng pattern **Write-Ahead Logging (WAL)** hoặc **Event Sourcing**. Mỗi lệnh trước khi đưa vào bộ nhớ sẽ được "ghi nối" (append) cực nhanh vào một file nhật ký dạng nhị phân (Journal). Khi khởi động lại hệ thống, engine chỉ cần đọc lại file Journal này để "replay" (phục hồi) lại toàn bộ trạng thái của Order Book.

## Benchmarking

- Khác với Web app thường test bằng Postman/k6, Trading Engine phải đo lường ở mức độ code nội bộ.
- file test:
  - `domain/benches/orderbook_bench.rs`: Đo xem OrderBook có thể khớp được bao nhiêu triệu lệnh trên một giây (Throughput).
  - `gateway/benches/latency_bench.rs`: Đo độ trễ (Latency) từ lúc Gateway nhận byte đầu tiên đến khi xuất ra byte trả lời (thường tính bằng micro-second hoặc nano-second).

## Kết luận
