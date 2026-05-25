---
title: Go Concurrency — Tất cả những gì bạn cần biết để tự tin phỏng vấn
date: 2026-05-25
excerpt: Goroutine, Channel, sync package, select — từ concept đến câu hỏi phỏng vấn thường gặp
category: ""
---
## Goroutine & GMP Scheduler

Goroutine là lightweight thread do Go runtime quản lý, không phải OS. Stack khởi đầu chỉ ~2KB và tự grow theo nhu cầu, trong khi OS thread tốn 1–8MB cố định. Đây là lý do Go có thể spawn hàng triệu goroutine mà không hết RAM.

|                | Goroutine         | OS thread              |
| -------------- | ----------------- | ---------------------- |
| Stack size     | ~2KB (tự grow)    | 1–8MB cố định          |
| Quản lý bởi    | Go runtime        | OS kernel              |
| Context switch | User space, nhanh | Kernel space, chậm hơn |
| Tạo mới        | Rất rẻ            | Tốn syscall            |

### Mô hình GMP

Go scheduler dùng mô hình **GMP** — M:N threading, nhiều goroutine chạy trên ít OS thread hơn:

```text
// G = Goroutine  M = Machine (OS thread)  P = Processor (logical)

G  G  G  G  G  G  G   ← hàng triệu goroutine
      ↓    ↓    ↓
     [P]  [P]  [P]      ← GOMAXPROCS = số CPU core
      ↓    ↓    ↓
     [M]  [M]  [M]      ← OS threads thực sự
```

- Mỗi **P** có một local run queue chứa các G chờ chạy
- Nếu một G bị block (syscall, IO...), M tách ra, P tìm M khác để tiếp tục — không waste CPU

### Triết lý CSP

> "Do not communicate by sharing memory; instead, share memory by communicating."

Thay vì nhiều goroutine cùng access một biến chung rồi dùng lock, Go khuyến khích dùng **channel** để truyền data giữa các goroutine.

## Channel — giao tiếp giữa các goroutine

Channel là cơ chế giao tiếp chính giữa các goroutine trong Go. Có 3 loại:

```go
// Unbuffered — synchronous, sender block cho đến khi có receiver
ch := make(chan int)

// Buffered — async, block khi buffer đầy
ch := make(chan int, 3)

// Directional — giới hạn quyền trong function
func producer(out chan<- int) { out <- 1 }  // chỉ gửi
func consumer(in <-chan int)  { v := <-in } // chỉ nhận
```

### Behavior của channel ở các trạng thái khác nhau

| Thao tác | nil channel | open channel | closed channel        |
| -------- | ----------- | ------------ | --------------------- |
| Send     | block mãi   | bình thường  | **panic**             |
| Receive  | block mãi   | bình thường  | zero value + ok=false |
| Close    | **panic**   | bình thường  | **panic**             |

```go
// Phân biệt zero value thật vs channel đã đóng
val, ok := <-ch
if !ok {
    fmt.Println("channel đã closed")
}
```

### Buffered channel như semaphore

```go
// Giới hạn chỉ 3 goroutine chạy cùng lúc
sem := make(chan struct{}, 3)

for _, task := range tasks {
    sem <- struct{}{}
    go func(t Task) {
        defer func() { <-sem }()
        process(t)
    }(task)
}
```

> **Rule of thumb:** Cần đồng bộ (bên này chờ bên kia) → unbuffered. Cần tách biệt tốc độ producer/consumer hoặc giới hạn concurrency → buffered.

## sync package

Dùng khi cần share memory trực tiếp thay vì dùng channel.

### Mutex

Chỉ 1 goroutine access tại một thời điểm, dù đọc hay ghi:

```go
var mu sync.Mutex

func increment() {
    mu.Lock()
    defer mu.Unlock()
    count++
}
```

### RWMutex

Nhiều reader cùng lúc, nhưng writer thì độc quyền:

```go
var rw sync.RWMutex

func get(key string) string {
    rw.RLock()
    defer rw.RUnlock() // nhiều goroutine có thể RLock cùng lúc
    return cache[key]
}

func set(key, val string) {
    rw.Lock()
    defer rw.Unlock() // block tất cả, kể cả reader
    cache[key] = val
}
```

### WaitGroup

Chờ tất cả goroutine xong mới tiếp tục:

```go
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)          // ✅ Add TRƯỚC khi spawn goroutine
    go func(id int) {
        defer wg.Done()
        doWork(id)
    }(i)
}
wg.Wait()
```

**Bug phổ biến:** Gọi `Add()` bên trong goroutine thay vì trước khi spawn — `Wait()` có thể return trước khi goroutine kịp `Add()`.

```go
// ❌ SAI
for i := 0; i < 5; i++ {
    go func() {
        wg.Add(1) // quá muộn!
        defer wg.Done()
    }()
}

// ✅ ĐÚNG
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
    }()
}
```

### sync.Once

Đảm bảo một function chỉ được chạy đúng 1 lần duy nhất, dù bao nhiêu goroutine gọi đồng thời:

```go
var (
    instance *Database
    once     sync.Once
)

func GetDB() *Database {
    once.Do(func() {
        instance = connectDB() // chỉ connect 1 lần duy nhất
    })
    return instance
}
```

### Khi nào dùng gì?

| Tool      | Dùng khi           | Use case                        |
| --------- | ------------------ | ------------------------------- |
| Mutex     | Ghi nhiều          | Counter, state update           |
| RWMutex   | Đọc nhiều, ghi ít  | Cache, config, in-memory DB     |
| WaitGroup | Chờ nhóm goroutine | Parallel jobs, batch processing |
| Once      | Khởi tạo 1 lần     | Singleton, lazy init            |

## select statement

`select` giống `switch` nhưng dành cho channel — block cho đến khi có ít nhất một case sẵn sàng. Nếu nhiều case ready cùng lúc, Go chọn **ngẫu nhiên**.

```go
// Basic select — block cho đến khi một channel có data
select {
case msg := <-ch1:
    fmt.Println("from ch1:", msg)
case msg := <-ch2:
    fmt.Println("from ch2:", msg)
}

// Non-blocking với default
select {
case msg := <-ch:
    fmt.Println("nhận được:", msg)
default:
    fmt.Println("không có gì, tiếp tục luôn")
}

// Timeout pattern — rất phổ biến trong thực tế
select {
case result := <-ch:
    fmt.Println("got:", result)
case <-time.After(3 * time.Second):
    fmt.Println("timeout sau 3 giây")
}
```

> **select vs switch:** `switch` không block và chạy đơn luồng. `select` block và được thiết kế cho channel — đây là công cụ cốt lõi để implement timeout, cancellation, và fan-in pattern.

## Câu hỏi phỏng vấn thường gặp

**Q1: Goroutine khác OS thread như thế nào?**

Goroutine nhẹ hơn (~2KB stack, tự grow), được quản lý bởi Go runtime qua mô hình GMP. OS thread nặng hơn (1–8MB), do kernel quản lý. Go dùng M:N threading nên có thể spawn hàng triệu goroutine.

---

**Q2: Điều gì xảy ra khi send vào closed channel?**

Panic. Receive từ closed channel trả về zero value + `ok=false`, không block. Send/receive vào nil channel block mãi mãi.

---

**Q3: Buffered vs unbuffered channel, khi nào dùng cái nào?**

Unbuffered khi cần synchronization (bên này chờ bên kia confirm). Buffered khi cần tách biệt tốc độ producer/consumer, hoặc dùng như semaphore để giới hạn concurrency.

---

**Q4: Mutex vs RWMutex?**

Mutex cho phép 1 goroutine access tại một thời điểm. RWMutex cho phép nhiều reader đồng thời nhưng writer thì độc quyền. Dùng RWMutex khi read nhiều hơn write (cache, config).

---

**Q5: Bug phổ biến nhất với WaitGroup?**

Gọi `Add()` bên trong goroutine thay vì trước khi spawn. `Wait()` có thể return trước khi goroutine kịp `Add()`, dẫn đến không chờ đủ.

---

**Q6: select chọn case nào khi nhiều case ready cùng lúc?**

Ngẫu nhiên — Go runtime pick random để tránh starvation. Không phải theo thứ tự khai báo.

---

**Q7: Goroutine leak là gì?**

Khi process vẫn đang chạy nhưng goroutine bị block mãi mãi (chờ channel không ai gửi, lock không ai unlock...), gây tốn memory/CPU liên tục. Khác với goroutine bị kill khi main exit — cái đó không phải leak vì process đã chết.
