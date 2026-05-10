---
title: Mình tự implement WAL mà không biết
date: 2026-05-10
excerpt: Implement trước rồi học sau để nhớ nó là gì
category: SYSTEMS
---

## Lần này là câu chuyện ngược

Trong 2 bài trước về Redis và B-tree, vấn đề của các dự án là chưa config, và sau đó mình mới tìm hiểu các kỹ thuật về persistence và index.

Bài này ngược lại.

Trong trading engine, mình có một component tên là `Journal`. Nó ghi lại mọi lệnh giao dịch vào file trước khi hệ thống shutdown, và đọc file đó để khôi phục state khi khởi động lại. Mình implement nó hoàn toàn tự nhiên vì đó là cách duy nhất giải quyết bài toán.

Sau khi đọc xong chương về WAL (Write-Ahead Log) trong sách Database Internals, mình nhận ra đây chính là thứ mình đã build.

### Bài toán: in-memory system không thể mất data

Trong trading engine, mình lưu trữ tất cả dữ liệu trong RAM - order book, lệnh mua/bán đang chờ khớp:

```rust
pub fn run(addr: &str, journal_path: &str) {
    let mut exchange = Exchange::new(1_000_000);
    let mut engine_seq = 0u64;
    // ...
}
```

`Exchange` là một struct chứa order book của tất cả assets. `engine_seq` là bộ đếm toàn cục đánh dấu thứ tự xử lý. Không có database, không có disk write trên hot path.

Lựa chọn này nhằm đảm bảo trading engine của mình có độ trễ thấp ở mức microsecond. Thông thường, một thao tác ghi trong database tốn đến vài milisecond, vô cùng nguy hiểm với một HFT (High Frequency Trading) system.

Nhưng RAM là volatile. Process crash, OOM kill, hay đơn giản là restart server — toàn bộ `Exchange` state biến mất. Và không giống cart trong e-commerce, lệnh của trader **không thể mất**. Đó là tiền thật.

Vậy làm thế nào để có cả hai — tốc độ của in-memory và durability của persistent storage?

### Giải pháp: ghi lệnh thay vì ghi state

Ý tưởng đơn giản: thay vì serialize toàn bộ `Exchange` ra disk sau mỗi lệnh (chậm, phức tạp), chỉ cần **ghi lại lệnh đó**.

Khi restart, đọc lại toàn bộ lệnh và replay từng cái một — `Exchange` state sẽ tự khôi phục về đúng điểm trước khi crash.

Đây là `Journal`:

```rust
pub struct Journal {
    pub fd: RawFd,
}

impl Journal {
    pub fn open<P: AsRef<Path>>(path: P) -> std::io::Result<Self> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)  // chỉ ghi nối vào cuối, không bao giờ ghi đè
            .read(true)
            .open(path)?;

        Ok(Self { fd: file.into_raw_fd() })
    }
}
```

`append(true)` là điểm then chốt. File journal chỉ có một chiều: ghi tiếp vào cuối. Không sửa, không xóa, không ghi đè. Đây gọi là append-only log.

### Binary frame — không phải JSON

Mỗi lệnh được ghi vào journal theo format binary, không phải JSON:

```rust
#[repr(C, packed)]
pub struct FrameHeader {
    pub len: u32,
    pub msg_type: u8,
}

#[repr(C, packed)]
pub struct NewOrderMsg {
    pub client_seq: u64,
    pub order_id:   u64,
    pub user_id:    u64,
    pub asset_id:   u64,
    pub price:      u64,
    pub quantity:   u64,
    pub side:       u8,
    pub order_type: u8,
}
```

`#[repr(C, packed)]`: không padding, layout y hệt trong memory. Ghi ra disk = copy raw bytes. Đọc vào = cast pointer trực tiếp.

```rust
let msg = unsafe { ptr::read_unaligned(payload.as_ptr() as *const NewOrderMsg) };
```

`NewOrderMsg` = 50 bytes cố định. JSON tương đương:

```json
{"client_seq":1,"order_id":100,"user_id":7,"asset_id":1,"price":10050,"quantity":500,"side":"buy","order_type":"gtc"}
```

Khoảng 110 bytes — hơn gấp đôi — cộng thêm parse overhead. Ở latency microsecond, không chấp nhận được.

## Ghi journal bằng `io_uring` — không block main thread

Đây là điểm khác biệt lớn nhất so với WAL truyền thống.

Sau khi xử lý xong một batch lệnh, reactor ghi journal **không đồng bộ** thông qua io_uring:

```rust
if !pending_journal_data.is_empty() {
    journal_write_id += 1;
    let id = journal_write_id;
    let ptr = pending_journal_data.as_ptr();
    let len = pending_journal_data.len() as u32;
    journal_writes.insert(id, pending_journal_data);

    let write = opcode::Write::new(types::Fd(journal_fd), ptr, len)
        .offset(0xFFFFFFFFFFFFFFFF)  // append — ghi vào cuối file
        .build()
        .user_data(encode_token(id as i32, OP_JOURNAL_WRITE));

    unsafe {
        ring.submission().push(&write).expect("sq full");
    }
}
```

`io_uring` submit write operation vào kernel queue rồi trả về ngay. Kernel xử lý I/O song song trong khi main thread tiếp tục nhận và xử lý lệnh tiếp theo. Không block, không chờ.

Khi kernel hoàn thành write, completion event xuất hiện trong ring buffer:

```rust
OP_JOURNAL_WRITE => {
    let id = fd as u64;
    journal_writes.remove(&id);  // cleanup bộ nhớ tạm
}
```

Và khi shutdown, hệ thống drain toàn bộ pending journal writes trước khi đóng — đảm bảo không mất lệnh nào:

```rust
while !journal_writes.is_empty() {
    ring.submit_and_wait(1).expect("submit_and_wait failed");
    // ...
}
unsafe { libc::fsync(journal_fd); }  // flush kernel buffer ra disk
```

### Replay khi khởi động

Phần replay là nơi toàn bộ thiết kế hội tụ:

```rust
println!("replay journal from {}", journal_path);
let frames = Journal::read_all_frames(journal_path).unwrap();
let mut replayed = 0;

for frame in frames {
    let msg_type = frame[4];
    let payload = &frame[5..];

    if let Some(cmd) = decode_command(msg_type, payload) {
        let _ = process(&mut exchange, &mut engine_seq, cmd);
        replayed += 1;
    }
}

println!("replayed {} commands. current engine_seq {}", replayed, engine_seq);
```

`read_all_frames` đọc file journal và parse từng frame theo format `[len:4][type:1][payload]`. Mỗi lệnh được decode và apply lại vào `Exchange` theo đúng thứ tự ban đầu. Kết thúc replay, `exchange` và `engine_seq` khôi phục về trạng thái trước crash.

Determinism ở đây là điều kiện tiên quyết: cùng sequence lệnh → cùng state cuối. Trading engine được thiết kế để đảm bảo điều này — không có random, không có side effect phụ thuộc thời gian trong matching logic.

## WAL trong Postgres — cùng pattern, khác trade-off

Khi đọc về Postgres WAL, mình nhận ra đây là cùng một ý tưởng, nhưng với trade-off khác.

Postgres cũng append-only log. Trước khi thay đổi bất kỳ data page nào, Postgres ghi thay đổi đó vào WAL. Sau đó mới ghi vào heap file. Khi crash, Postgres replay WAL từ checkpoint gần nhất để khôi phục.

Nhưng có một điểm khác biệt quan trọng: **thứ tự ghi**.

Postgres ghi WAL **trước** khi ack client. Client chỉ nhận được confirmation sau khi WAL đã được fsync ra disk. Đây là "Write-Ahead" — ghi trước, commit sau.

Trading journal của mình ghi **sau** khi process và gửi response cho client. Client nhận được ack trước khi journal hoàn thành.

|                        | Trading Journal         | Postgres WAL      |
| ---------------------- | ----------------------- | ----------------- |
| **Ghi gì**             | Binary command frames   | Data page changes |
| **Thứ tự**             | Process → Ack → Journal | WAL → Heap → Ack  |
| **fsync**              | Khi shutdown            | Mỗi transaction   |
| **Mất data khi crash** | Lệnh chưa journal kịp   | Không             |
| **Latency**            | Microsecond             | Millisecond       |

Trading journal chấp nhận một **window mất data nhỏ**: nếu process crash ngay sau khi gửi ack cho client nhưng trước khi `io_uring` write hoàn thành — lệnh đó sẽ mất. Với Postgres, điều này không xảy ra.

Đây là conscious trade-off. Trading engine ưu tiên latency tuyệt đối. Postgres ưu tiên durability tuyệt đối. Không cái nào đúng hay sai — tùy bài toán.

## Checkpoint — thứ trading journal của mình không có

Postgres không replay WAL từ đầu thời gian. Định kỳ nó thực hiện **checkpoint**: flush toàn bộ dirty pages ra disk, ghi vào WAL một marker "checkpoint tại đây". Khi crash, chỉ cần replay WAL từ checkpoint gần nhất — không phải từ ngày đầu.

Trading journal của mình không có checkpoint. Mỗi restart phải replay toàn bộ file từ đầu.

Với trading engine, đây là acceptable: restart hiếm, và log chỉ chứa commands (nhỏ hơn nhiều so với data pages). Nhưng nếu hệ thống chạy nhiều tháng không restart — file journal sẽ phình to, replay khi restart sẽ chậm dần. Checkpoint là giải pháp cho vấn đề đó.

AOF rewrite trong Redis giải quyết cùng vấn đề theo cách khác: thay vì replay log để rebuild state, định kỳ ghi state hiện tại ra file mới — file cũ bị thay thế. Cùng kết quả, khác approach.

## Bài học

1. **WAL là pattern, không phải công nghệ.** — Postgres WAL, Redis AOF, Kafka commit log, và trading journal của mình — tất cả đều là cùng một ý tưởng: append events thay vì mutate state. File log là nguồn sự thật, state là thứ được derive từ log.

2. **Trade-off nằm ở thứ tự ghi.** — Ghi log trước khi commit → durability tuyệt đối, latency cao hơn. Ghi log sau khi commit → latency thấp hơn, window mất data nhỏ. Không có giải pháp miễn phí.

3. **Determinism là điều kiện bắt buộc.** — Replay chỉ hoạt động nếu cùng input → cùng output. Bất kỳ non-determinism nào (random, system time, race condition) đều phá vỡ khả năng replay. Đây là lý do trading engine không có side effect trong matching logic.
