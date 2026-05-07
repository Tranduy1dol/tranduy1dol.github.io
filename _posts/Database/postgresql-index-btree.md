---
title: Mình không trả lời được câu hỏi phỏng vấn "Index trong Posgres hoạt động thế nào?"
date: 2026-05-07
excerpt: Biết index sẽ giúp đọc data nhanh thôi là chưa đủ. Mình cần tìm hiểu index giúp đọc data như thế nào
category: SYSTEMS
---

## Câu hỏi phỏng vấn tôi không trả lời được

Người phỏng vấn hỏi mình: "Index trong PostgreSQL hoạt động thế nào?".

Mình trả lời: "Nó giúp query nhanh hơn, giống như mục lục trong sách."

"Cụ thể hơn đi — tại sao nó nhanh hơn? Cấu trúc dữ liệu bên dưới là gì? Trade-off khi thêm index?"

Mình nín luôn. Và điều đáng nói là — trong project e-commerce, mình viết query như thế này:

```rust
// Tìm product theo category
product::Entity::find()
    .filter(product::Column::CategoryId.eq(category_id))
    .order_by_asc(product::Column::Name)
    .paginate(&self.db, page_size);

// Search product theo tên
product::Entity::find()
    .filter(product::Column::Name.contains(&query_string))
    .order_by_asc(product::Column::Name)
    .paginate(&self.db, page_size);
```

Nhưng migration của mình không tạo index nào ngoài primary key:

```rust
Table::create()
    .table(Product::Table)
    .col(
        ColumnDef::new(Product::Id)
            .big_integer()
            .primary_key()  // chỉ có index ở đây
            .auto_increment(),
    )
    .col(ColumnDef::new(Product::Name).string_len(255).not_null())
    .col(ColumnDef::new(Product::CategoryId).big_integer())
    // ...
```

Vậy khi filter theo `category_id` hoặc search theo `name` — chuyện gì thực sự xảy ra bên dưới?

## Không có index: full table scan

Khi Postgres nhận query `WHERE category_id = 42`, nếu không có index trên column `category_id`, nó chỉ có một cách: **đọc từng row một từ đầu đến cuối bảng**.

Đây gọi là sequential scan (hay full table scan). Với bảng 1000 products thì không sao. Với 1 triệu products — mỗi query phải đọc qua 1 triệu rows để tìm vài chục kết quả.

Độ phức tạp: O(n). Mỗi row thêm vào bảng làm mọi query chậm đi một chút.

Giải pháp hiển nhiên: sắp xếp data theo column cần tìm, rồi dùng binary search. Nhưng cách implement không đơn giản như bạn nghĩ.

## Tại sao không dùng Binary Search Tree?

Phản xạ đầu tiên: dùng BST (Binary Search Tree). Mỗi node chứa 1 key, tìm kiếm O(log n). Vấn đề giải quyết?

Không. Vì database không sống trên RAM — nó sống trên **disk**.

### Disk I/O tốn tài nguyên hơn RAM

- Đọc từ RAM: ~100 nanoseconds
- Đọc từ SSD: ~100 microseconds (chậm hơn 1000x)
- Đọc từ HDD: ~10 milliseconds (chậm hơn 100,000x)

Mỗi lần truy cập một node trong cây = một lần đọc disk. Với BST, tìm kiếm trong 1 triệu rows cần log₂(1,000,000) ≈ 20 lần đọc disk. Mỗi lần đọc mất ~100μs trên SSD → 2ms cho một query đơn giản. Nghe ít, nhưng nhân với hàng nghìn queries/giây thì không chấp nhận được.

### Disk đọc theo block, không theo byte

Khi bạn yêu cầu đọc 1 byte từ disk, OS thực tế đọc cả một **page** (thường 4KB hoặc 8KB). Đây là đơn vị nhỏ nhất mà disk có thể đọc.

Với BST: mỗi node chứa 1 key + 2 pointers ≈ vài chục bytes. Bạn đọc 4KB từ disk nhưng chỉ dùng vài chục bytes — lãng phí 99% bandwidth.

## B-tree: tận dụng mỗi lần đọc disk

B-tree giải quyết cả hai vấn đề trên bằng một ý tưởng đơn giản: **nhồi nhiều keys vào một node, sao cho mỗi node vừa đúng một disk page**.

Một page 8KB có thể chứa khoảng 100-200 keys (tùy kích thước key). Giả sử trung bình 128 keys/node:

- BST: mỗi node chứa 1 key → chiều cao log₂(1,000,000) ≈ **20**
- B-tree: mỗi node chứa 128 keys → chiều cao log₁₂₈(1,000,000) ≈ **3**

**20 lần đọc disk giảm xuống còn 3.** Đó là lý do B-tree thắng.

### Cấu trúc B-tree

```text
                    [30 | 60 | 90]              ← root node (1 page)
                   /    |     |    \
        [5|10|20]  [35|40|50]  [65|70|80]  [92|95|99]   ← internal nodes
        /  | | \    /  | | \    /  | | \    /  | | \
      [...] [...] [...] [...]  [...]  [...]  [...]       ← leaf nodes
```

- **Root node:** chứa các key phân chia range. Đọc 1 page → biết đi hướng nào
- **Internal nodes:** tiếp tục phân chia. Mỗi node = 1 page
- **Leaf nodes:** chứa actual key + pointer đến row trong bảng

Tìm `category_id = 42`:

1. Đọc root → 42 nằm giữa 30 và 60 → đi vào child thứ 2
2. Đọc internal node → tìm vị trí chính xác
3. Đọc leaf node → lấy pointer đến row

3 lần đọc disk. Cho 1 triệu rows. Đó là sức mạnh của B-tree.

### Node split: cách cây tự cân bằng

Khi insert một key mới vào node đã đầy (128 keys), B-tree thực hiện **node split**:

1. Node đầy được chia thành 2 nodes, mỗi node chứa ~64 keys
2. Key ở giữa (median) được đẩy lên parent node
3. Nếu parent cũng đầy → split tiếp (cascade lên trên)

Đây là cách B-tree giữ cân bằng mà không cần rotation phức tạp như AVL hay Red-Black tree. Chiều cao chỉ tăng khi root bị split — và điều đó hiếm khi xảy ra.

### Heap file và random I/O

B-tree index không chứa actual data — nó chỉ chứa key + pointer (gọi là TID — Tuple ID) trỏ đến vị trí row trong **heap file**.

Heap file là nơi Postgres lưu actual rows, và rows được lưu **không theo thứ tự nào cả**. Insert row mới → Postgres nhét vào chỗ trống đầu tiên tìm được.

Điều này có hệ quả quan trọng cho **range query**:

```sql
SELECT * FROM products WHERE category_id BETWEEN 10 AND 50;
```

B-tree tìm được tất cả TIDs thỏa mãn rất nhanh (leaf nodes liên tiếp nhau). Nhưng khi fetch actual rows từ heap file — mỗi row có thể nằm ở một page khác nhau trên disk. Đây là **random I/O** — tệ hơn nhiều so với sequential I/O.

Đó là lý do Postgres đôi khi chọn sequential scan thay vì index scan cho query trả về nhiều rows — đọc tuần tự toàn bộ bảng có thể nhanh hơn nhảy random khắp disk.

## Trade-off: index không miễn phí

Quay lại project của mình. Nếu mình thêm index cho `category_id` và `name`:

```sql
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_name ON products(name);
```

Query sẽ nhanh hơn. Nhưng cái giá là:

### Insert/Update chậm hơn

Mỗi lần insert product mới, Postgres phải:

- Ghi row vào heap file
- Cập nhật B-tree index trên `category_id` (có thể trigger node split)
- Cập nhật B-tree index trên `name` (có thể trigger node split)

2 index = 2 lần cập nhật B-tree thêm cho mỗi insert. 5 index = 5 lần. Trong code của mình:

```rust
async fn create_new(&self, name: String, ...) -> Result<product::Model, Error> {
    let active_model = product::ActiveModel {
        name: Set(name),
        category_id: Set(category_id),
        price: Set(price),
        stock_quantity: Set(stock_quantity),
        // ...
    };
    product::Entity::insert(active_model).exec_with_returning(&self.db).await
}
```

Mỗi lần gọi `create_new`, nếu có 3 indexes thì Postgres làm thêm 3 B-tree insertions ngầm.

### Disk space

Mỗi index là một B-tree riêng biệt, chiếm disk space riêng. Bảng 1 triệu rows với 5 indexes có thể tốn nhiều disk hơn chính data.

### Không phải query nào cũng dùng được index

```rust
// Dùng được index (equality check)
.filter(product::Column::CategoryId.eq(category_id))

// Khó dùng index hiệu quả (LIKE '%phone%' — pattern ở giữa)
.filter(product::Column::Name.contains(&query_string))
```

`contains` sinh ra `LIKE '%phone%'` — Postgres không thể dùng B-tree index cho pattern bắt đầu bằng wildcard. Muốn search text hiệu quả cần GIN index hoặc full-text search — một câu chuyện khác.

## Vậy project của nên thêm index nào?

Nhìn lại các query patterns:

| Query                               | Column        | Nên index?                                          |
| ----------------------------------- | ------------- | --------------------------------------------------- |
| `find_by_id(id)`                    | `id` (PK)     | Đã có sẵn                                           |
| `filter(CategoryId.eq(...))`        | `category_id` | **Nên** — equality lookup, high selectivity         |
| `filter(Name.contains(...))`        | `name`        | **Không** — B-tree không giúp LIKE '%...%'          |
| `order_by_asc(Name)`                | `name`        | **Có thể** — giúp sort không cần filesort           |
| `filter(CategoryId).order_by(Name)` | composite     | **Tốt nhất** — một index phục vụ cả filter lẫn sort |

Index tối ưu cho project này:

```sql
CREATE INDEX idx_product_category_name ON products(category_id, name);
```

Composite index: Postgres dùng `category_id` để filter, rồi data đã sẵn sorted theo `name` trong cùng index — không cần sort thêm.

## Bài học

1. **Index = B-tree = tối ưu cho disk I/O** — mỗi node vừa 1 page, giảm số lần đọc disk từ 20 xuống 3
2. **Không có index = full table scan** — chấp nhận được với bảng nhỏ, thảm họa với bảng lớn
3. **Index không miễn phí** — mỗi index thêm overhead cho write operations. Chỉ index columns thực sự cần filter/sort
4. **Composite index > nhiều single-column index** — một index phục vụ được cả WHERE lẫn ORDER BY
5. **B-tree không giải quyết mọi thứ** — LIKE '%...%', full-text search, JSON query cần index types khác (GIN, GiST)
