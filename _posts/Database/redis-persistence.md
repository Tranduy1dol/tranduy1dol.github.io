---
title: "Redis persistence: từ 'mất data khi restart' đến AOF và RDB"
date: 2026-05-07
excerpt: Mình dùng Redis làm cart storage trong e-commerce project. Nhanh thì nhanh thật, nhưng restart là mất hết. Và đây là những gì mình tìm hiểu được để không mất data.
category: SYSTEMS
---

## Đơn giản là vì Redis nhanh hơn

Trong project e-commerce của mình, cart là thứ bị ghi nhiều nhất. User thêm sản phẩm, xóa sản phẩm, thay đổi số lượng — mỗi thao tác là một write operation. Lưu cart vào Postgres nghĩa là mỗi lần user nhấn "Thêm vào giỏ" sẽ tạo ra một database write, kèm theo transaction overhead, disk I/O, và lock contention khi nhiều user thao tác cùng lúc.

Redis giải quyết gọn: in-memory, đọc ghi microsecond-level, không cần schema phức tạp. Cart của mỗi user chỉ là một JSON string lưu dưới key `cart:{user_id}`:

```rust
async fn save(&self, cart: CartDto) -> Result<(), Error> {
    let key = format!("cart:{}", cart.user_id);
    let json = serde_json::to_string(&cart)?;

    // Set with 24h expiration
    conn.set_ex(key, json, 24 * 60 * 60).await?;
    Ok(())
}
```

Đơn giản. Nhanh. Và mình set TTL 24 giờ — nếu user không quay lại trong 1 ngày thì cart tự biến mất, không cần cleanup.

Nhưng mình đã không nghĩ tới **nếu Redis chết giữa chừng thì sao**?

## Vấn đề: in-memory nghĩa là volatile

Redis lưu mọi thứ trên RAM. Đó là lý do nó nhanh — không có disk I/O trên critical path. Nhưng RAM sẽ mất sạch data nếu mất điện, process crash, hoặc đơn giản là restart server.

Trong context cart, điều này có nghĩa:

- User thêm 10 sản phẩm vào giỏ
- Redis restart (deploy mới, OOM kill, hardware issue)
- User quay lại → giỏ hàng trống

Với cart thì có thể chấp nhận được — user thêm lại không phải thảm họa. Nhưng nếu dùng Redis cho session, rate limiting, hoặc bất kỳ state nào quan trọng hơn — mất data là mất business logic.

## Redis persistence: hai cơ chế, hai triết lý

Theo mình tìm hiểu, Redis cung cấp hai cơ chế persistence, mỗi cái giải quyết vấn đề theo cách khác nhau.

### RDB — Snapshot định kỳ

RDB (Redis Database) hoạt động như chụp ảnh: cứ mỗi khoảng thời gian, Redis dump toàn bộ dataset ra một file `.rdb` trên disk.

**Cơ chế:**

1. Redis fork một child process
2. Child process ghi toàn bộ memory ra file (copy-on-write giúp parent không bị block)
3. Khi ghi xong, file mới thay thế file cũ

**Config mặc định:**

```ini
save 900 1      # snapshot nếu có ≥1 change trong 900 giây
save 300 10     # snapshot nếu có ≥10 changes trong 300 giây
save 60 10000   # snapshot nếu có ≥10000 changes trong 60 giây
```

**Ưu điểm:**

- File compact, dễ backup, dễ transfer sang server khác
- Restore nhanh — load file vào memory là xong
- Không ảnh hưởng performance của main process

**Nhược điểm:**

- Mất data giữa hai snapshot. Config `save 300 10` và Redis crash ở giây thứ 299 — mất 5 phút data
- Fork process tốn memory (worst case: gấp đôi memory usage trong thời gian ngắn)

RDB phù hợp khi bạn chấp nhận mất vài phút data để đổi lấy performance và simplicity.

### AOF — Ghi log mọi operation

AOF (Append-Only File) ghi lại **mọi write command** vào một file log. Khi Redis restart, nó replay toàn bộ file này để rebuild state.

WAL (Write-Ahead Log) - AOF có chung ý tưởng: ghi log trước, rebuild state từ log.

**Cơ chế:**

1. Mỗi write command (SET, DEL, EXPIRE...) được append vào file AOF
2. Khi restart, Redis đọc file từ đầu đến cuối, replay từng command

**3 chế độ fsync:**

| Mode       | Hành vi               | Data loss      | Performance   |
| ---------- | --------------------- | -------------- | ------------- |
| `always`   | fsync sau mỗi command | Gần như 0      | Chậm nhất     |
| `everysec` | fsync mỗi giây        | Tối đa ~1 giây | Trade-off tốt |
| `no`       | Để OS quyết định      | Không xác định | Nhanh nhất    |

`everysec` là default và là lựa chọn phổ biến nhất — mất tối đa 1 giây data, đổi lại performance gần như không bị ảnh hưởng.

### Vấn đề: file AOF phình to

Mỗi operation đều được ghi, kể cả những thứ redundant:

```text
SET cart:42 '{"items":[{"product_id":1,"quantity":1}]}'
SET cart:42 '{"items":[{"product_id":1,"quantity":2}]}'
SET cart:42 '{"items">[{"product_id":1,"quantity":3}]}'
```

3 commands, nhưng chỉ command cuối cùng là có ý nghĩa. Đây là lý do Redis có **AOF rewrite** (log compaction): định kỳ viết lại file AOF chỉ giữ state cuối cùng, loại bỏ commands thừa.

### Hybrid: RDB + AOF (Redis 4.0+)

Từ Redis 4.0, bạn có thể bật cả hai:

- AOF file bắt đầu bằng một RDB snapshot (restore nhanh)
- Phần sau snapshot là AOF log (durability cao)

Đây là config recommended cho production:

```ini
appendonly yes
aof-use-rdb-preamble yes
```

## Trade-off matrix

|                         | RDB only            | AOF everysec          | RDB + AOF            |
| ----------------------- | ------------------- | --------------------- | -------------------- |
| **Data loss khi crash** | Vài phút            | ~1 giây               | ~1 giây              |
| **Disk usage**          | Thấp                | Cao (trước rewrite)   | Trung bình           |
| **Restart speed**       | Nhanh               | Chậm hơn (replay log) | Nhanh (RDB preamble) |
| **CPU overhead**        | Spike khi fork      | Đều đặn               | Cả hai               |
| **Phù hợp cho**         | Backup, cache thuần | Data quan trọng       | Production           |

## Quay lại project: mình nên config thế nào?

Nhìn lại code cart:

```rust
// Set with 24h expiration
conn.set_ex(key, json, 24 * 60 * 60).await?;
```

Cart đã có TTL 24 giờ — nó vốn là ephemeral data. Mất cart không phải thảm họa, user thêm lại được. Vậy RDB mặc định có thể đủ cho use case này.

Nhưng nếu muốn an toàn hơn mà không sacrifice performance:

```ini
appendonly yes
appendfsync everysec
```

Mất tối đa 1 giây data. Với cart, điều đó có nghĩa user mất tối đa 1 thao tác cuối cùng — hoàn toàn chấp nhận được.

**Điểm quan trọng hơn** nằm ở checkout flow:

```rust
pub async fn checkout(&self, user_id: i64) -> Result<order::Model, Error> {
    let cart = self.cart_service.get_cart(user_id).await?;
    let order = self.checkout_repo.create_order(user_id, cart.items).await?;

    // Clear cart after successful checkout (best-effort)
    if let Err(e) = self.cart_service.clear_cart(user_id).await {
        tracing::warn!("Failed to clear cart for user {}: {:?}", user_id, e);
    }

    Ok(order)
}
```

Khi user checkout, cart data được chuyển sang Postgres (tạo order) — đây là điểm mà data chuyển từ volatile sang durable storage. Thiết kế này đúng: **dùng Redis cho speed ở giai đoạn browsing, persist vào database ở giai đoạn commit**. Không phải mọi data cần cùng mức durability.

## Bài học

1. **In-memory ≠ unsafe** — Redis có persistence, nhưng cần chủ động bật và config
2. **AOF ≈ WAL** — cùng pattern "ghi log trước, replay khi cần".
3. **Chọn durability theo giá trị data** — cart mất được, order thì không. Config persistence phải match với business requirement
4. **Hybrid RDB+AOF** là production default — nhanh khi restart (RDB), an toàn khi crash (AOF)
