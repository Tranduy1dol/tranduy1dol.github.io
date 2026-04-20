---
title: Giới thiệu về lập trình Backend bằng Rust
date: 2026-04-16
excerpt: Cách mình code một Backend E-Commerce bằng Rust để đưa vào CV
category: CODING
---
## Giới thiệu

Mình tiếp xúc với Rust đến nay cũng là hai năm rồi. Cách tiếp cận Rust của mình như thế này: xem người khác code như thế nào hoặc đọc sách, code theo, điều chỉnh lại thành ý tưởng của mình. Dù cách này khá hiệu quả thời gian đầu, mình không bị ngợp khi tiếp xúc code mới. Nhưng về lâu dài càng, mình sẽ bị tụt lại dần vì không chịu tìm hiểu các khái niệm, thư viện cũng như các lý thuyết.

Sau khi nhận được feedback từ một vài người phỏng vấn, mình nhận ra đa số các vấn đề họ hỏi, mình đã đều tiếp xúc khi code, vấn đề của mình là không thể nhớ cách dùng, cách hoạt động của các khái niệm, công cụ đó.

Bài này sẽ giải thích các công cụ mình dùng, cách mình triển khai chúng trong một dự án Backend phục vụ E-commerce.

## Kiến trúc hệ thống

Một hệ thống web hoàn chỉnh sẽ bao gồm rất nhiều thành phần: xử lý HTTP request, parse JSON, validate dữ liệu, logic nghiệp vụ, gọi Database, thao tác Cache... Nếu nhồi nhét tất cả vào một file `main.rs` hoặc không có sự phân chia ranh giới rõ ràng, code sẽ nhanh chóng trở thành một mớ "mì ý" (spaghetti code), cực kỳ khó để bảo trì, mở rộng hay viết Unit Test.

Để giải quyết bài toán này, mình áp dụng mô hình **Clean Architecture** kết hợp sức mạnh của **Cargo Workspace** có sẵn trong hệ sinh thái Rust.

### Clean Architecture và Cargo Workspace

Clean Architecture nhấn mạnh vào nguyên lý **Dependency Inversion** (Đảo ngược phụ thuộc). Tức là, thay vì logic cốt lõi (Domain/Business logic) phụ thuộc vào những thứ râu ria (Database, Framework, Third-party), thì mọi thứ râu ria phải phụ thuộc ngược lại vào logic cốt lõi.

Rust có một cơ chế để thuận tiện triển khai: **Cargo Workspace**. Hệ thống build của Rust sẽ kiểm tra các dependency giữa các cargo crate tại compile-time. Quy tắc là: crate `core` sẽ không import các crate tương tác với Database hay HTTP Web Server trong phần `[dependencies]`, và `core` sẽ khai báo các interface cho các crate khác. Làm vậy thì đảm bảo code có cấu trúc, người ngoài đọc sẽ dễ hiểu, và đảm bảo khả năng mở rộng khi muốn thay đổi công cụ.

Kiến trúc được mình triển khai như sau:

- **`crates/core`**: Đây là nơi chứa toàn bộ cốt lõi nghiệp vụ (Business logic): Services (User, Product, Cart), Authentication (JWT), Error Definition, và định nghĩa các **Ports** (các Traits/Interfaces cho các kho chứa dữ liệu). Crate này **KHÔNG** hề biết đến sự tồn tại của Postgres, Redis hay HTTP. Nó đảm bảo logic của hệ thống hoàn toàn cô lập, dễ debug và dễ test nhất.

- **`crates/infra`**: Là crate hạ tầng kỹ thuật. Crate này là cài đặt các interface được yêu cầu trong `core` sử dụng các thư viện cụ thể. Nơi đây chứa adapter kết nối Redis, code gọi SeaORM để thao tác dữ liệu. Nếu có thay đổi từ PostgresQL thành MongoDB, mình cũng sẽ cài đặt ở đây.

- **`crates/app`**: Là cửa sổ để hệ thống giao tiếp thông qua HTTP Transport. Ở đây tích hợp **Axum**, thiết lập Routing, quản lý AppState, nhận các DTO từ người dùng và inject các implementation từ `infra` vào biến khởi tạo của `core` trong file `main.rs`.

- **`crates/entities` & `crates/migration` (Schema Base)**: Hai crate này đi liền với sự hỗ trợ từ hệ sinh thái `SeaORM`. Crate `entities` đóng vai trò như một thư viện Type definition cho các table PostgreSQL, trong khi đó `migration` thiết lập công cụ giúp team quản lý được versioning của database.

## Web Server & Routing (Giao tiếp HTTP)

Khi xây dựng một hệ thống E-commerce, tầng HTTP là "cổng trước" tiếp nhận mọi request từ client. Mình dùng Axum vì:

1. **Hiệu suất cao** — Xử lý hàng ngàn request đồng thời mà không block thread.
2. **Type-safe** — Tận dụng hệ thống type của Rust để bắt lỗi tại compile-time thay vì runtime.
3. **Quản lý routing rõ ràng** — Dễ dàng gom nhóm, versioning API, gắn middleware cho từng nhóm route.
4. Axum dễ cài đặt hơn các framework khác (Actix, Rocket).

### Cấu trúc Routing: Versioning & Module hóa

Trong thực tế, API thường được nhóm theo version (`/api/v1/...`) để dễ nâng cấp mà không break client cũ. Routing trong file `crates/app/src/router.rs` được tổ chức như sau:

```rust
// crates/app/src/router.rs

use axum::Router;
use super::{handlers, state::AppState};

pub fn create_router(state: AppState) -> Router {
    Router::new().nest("/api/v1", api_routes(state))
}

fn api_routes(state: AppState) -> Router {
    Router::new()
        .nest("/users", handlers::user::routes(state.clone()))
        .nest("/products", handlers::product::routes(state.clone()))
        .nest("/cart", handlers::cart::routes(state.clone()))
        .nest("/checkout", handlers::checkout::routes(state))
}
```

Có hai điều đáng chú ý ở đây:

1. **`.nest()` tạo cây routing phân cấp.** Khi gọi `.nest("/api/v1", api_routes(state))`, mọi route bên trong `api_routes` sẽ tự động có prefix `/api/v1`. Kết quả là ta có các endpoint như `/api/v1/users/register`, `/api/v1/products/all`, `/api/v1/cart/items`... mà không cần lặp lại prefix ở từng handler.

2. **`state.clone()` không tốn kém** — Vì `AppState` chứa toàn `Arc<Service>`, việc clone chỉ tăng reference count (atomic increment), không copy dữ liệu thực.

Mỗi module handler (ví dụ `handlers::cart`) tự định nghĩa route nội bộ của mình, giữ cho `router.rs` gọn gàng:

```rust
// crates/app/src/handlers/cart.rs

pub fn routes(state: AppState) -> Router {
    Router::new()
        .route("/", get(get_cart))
        .route("/items", post(add_item))
        .route("/items/{product_id}", delete(remove_item))
        .with_state(state)
}
```

### AppState: Chia sẻ tài nguyên

Một vấn đề quan trọng: **làm sao các handler truy cập được Database Pool, Redis Client, hay các Service?** Câu trả lời là `AppState` — một struct được truyền vào toàn bộ router và mọi handler đều có thể extract ra.

```rust
// crates/app/src/state.rs

use std::sync::Arc;
use app_core::service::{
    auth_service::AuthService, cart_service::CartService,
    checkout_service::CheckoutService, product_service::ProductService,
    user_service::UserService,
};

#[derive(Clone)]
pub struct AppState {
    pub auth_service: Arc<AuthService>,
    pub user_service: Arc<UserService>,
    pub product_service: Arc<ProductService>,
    pub cart_service: Arc<CartService>,
    pub checkout_service: Arc<CheckoutService>,
}
```

Tại sao dùng `Arc<T>` mà không phải `T` trực tiếp? Vì Axum cần `AppState` implement `Clone` để chia sẻ giữa nhiều task async chạy đồng thời. Nếu mỗi Service chứa connection pool bên trong, ta không muốn clone cả pool — `Arc` cho phép nhiều handler **trỏ tới cùng một instance** của Service, và từ đó cùng một connection pool.

Mình đặt tất cả mọi thứ trong `main.rs` như sau:

```rust
// crates/app/src/main.rs (rút gọn)

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = Config::new()?;

    let db_pool = create_connection_pool(&config.database.url).await?;
    let redis_pool = infra::cache::create_connection_pool(&config.redis.url).await?;

    // Khởi tạo các repository adapter (tầng infra)
    let user_repo = Arc::new(SeaOrmUserRepo::new(db_pool.clone()));
    let product_repo = Arc::new(SeaOrmProductRepo::new(db_pool.clone()));
    let cart_repo = Arc::new(RedisCartRepository::new(redis_pool));
    let checkout_repo = Arc::new(SeaOrmCheckoutRepo::new(db_pool.clone()));

    // Khởi tạo các service (tầng core), inject repository vào
    let user_service = Arc::new(UserService::new(user_repo, config.jwt.secret.clone(), event_sender));
    let auth_service = Arc::new(AuthService::new(config.jwt.secret));
    let product_service = Arc::new(ProductService::new(product_repo));
    let cart_service = Arc::new(CartService::new(cart_repo));
    let checkout_service = Arc::new(CheckoutService::new(cart_service.clone(), checkout_repo));

    // Gói tất cả vào AppState
    let app_state = state::AppState {
        auth_service, user_service, product_service,
        cart_service, checkout_service,
    };

    let app = router::create_router(app_state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await?;
    Ok(())
}
```

Dòng chảy rất rõ ràng: **Config → Pool → Repository → Service → AppState → Router → Server**. Mỗi tầng chỉ biết tầng ngay bên dưới, đúng nguyên tắc Clean Architecture.

### Extractors

Extractor là cách Axum cho phép handler khai báo "tôi cần gì" từ một HTTP request. Compiler sẽ tự động gọi logic extract tương ứng. Nhìn vào handler `add_item`:

```rust
pub async fn add_item(
    State(state): State<AppState>,    // Extract AppState
    JwtAuth(claims): JwtAuth,          // Extract & verify JWT token
    Json(dto): Json<AddCartItemDto>,   // Extract & deserialize JSON body
) -> Result<Json<CartDto>, Error> {
    dto.validate()?;
    let cart = state.cart_service
        .add_item(claims.sub, dto.product_id, dto.quantity)
        .await?;
    Ok(Json(cart))
}
```

Trong một dòng khai báo parameter, Axum tự động thực hiện:

1. **`State(state)`** — Lấy `AppState` đã được gắn vào router.
2. **`JwtAuth(claims)`** — Đọc header `Authorization: Bearer <token>`, verify JWT, trả về `TokenClaims` chứa user ID. Nếu thiếu token hoặc token không hợp lệ → trả về `401 Unauthorized` **ngay lập tức**, handler không bao giờ được gọi.
3. **`Json(dto)`** — Parse request body thành `AddCartItemDto`. Nếu body không hợp lệ → trả về `400 Bad Request`.

Thứ tự extract rất quan trọng: Axum xử lý từ trái qua phải. Nếu `JwtAuth` thất bại, `Json` sẽ không được gọi. Điều này tạo thành một "pipeline guard" tự nhiên.

### Custom Extractor: JwtAuth

Để tạo extractor riêng, mình implement trait `FromRequestParts` cho struct `JwtAuth`:

```rust
// crates/app/src/extractors/auth.rs

pub struct JwtAuth(pub TokenClaims);

impl<S> FromRequestParts<S> for JwtAuth
where
    S: Send + Sync,
    AppState: FromRef<S>,
{
    type Rejection = (StatusCode, Json<ErrorResponse>);

    async fn from_request_parts(
        parts: &mut Parts, state: &S
    ) -> Result<Self, Self::Rejection> {
        let app_state = AppState::from_ref(state);

        // Bước 1: Lấy Bearer token từ header
        let TypedHeader(Authorization(bearer)) =
            TypedHeader::<Authorization<Bearer>>::from_request_parts(parts, state)
                .await
                .map_err(|_| (StatusCode::UNAUTHORIZED, Json(ErrorResponse {
                    status: "fail".to_string(),
                    message: "Authorization header missing".to_string(),
                })))?;

        // Bước 2: Verify token bằng AuthService
        let claims = app_state.auth_service
            .verify_token(bearer.token())
            .map_err(|e| (StatusCode::UNAUTHORIZED, Json(ErrorResponse {
                status: "fail".to_string(),
                message: format!("Invalid JWT token: {}", e),
            })))?;

        Ok(JwtAuth(claims))
    }
}
```

Ở đây `JwtAuth` sử dụng `AppState::from_ref(state)` để lấy `AuthService` — nghĩa là logic verify token nằm hoàn toàn ở tầng `core`, không bị ràng buộc với HTTP framework. Nếu mai sau mình đổi sang framework khác, logic xác thực không cần viết lại.

Khi muốn bảo vệ một route, chỉ cần thêm `JwtAuth(claims): JwtAuth` vào tham số handler — không cần cấu hình middleware riêng, không cần decorator.

## Tương tác Cơ sở dữ liệu & Caching (Data Persistence)

### Tương tác với PostgreSQL

Khi xây dựng một ứng dụng back-end, tương tác với Database là việc bắt buộc. Nhưng để hệ thống sống sót trên môi trường Production, mình phải đảm bảo:

- **An toàn:** Tránh các lỗi liên quan đến SQL Injection.
- **Tiện lợi:** Map được dữ liệu từ các table của SQL về các Struct (Object) của Rust.
- **Dễ bảo trì:** Quản lý được phiên bản database schema (Migrations) để làm việc với các thành viên khác trong team hoặc deploy lên server.

Để tránh việc viết raw query có thể có lỗi, mình đã quyết định [SeaORM](https://www.sea-ql.org/SeaORM/). Đây là một async ORM hỗ trợ hoàn hảo cho hệ sinh thái của `tokio`.

#### Quản lý database schema bằng Migrations

Trong `shopping-cart`, mình tách biệt thư mục `crates/migration` để chịu trách nhiệm chuyên biệt cho việc lên schema. Mỗi khi muốn thêm bảng, mình chỉ cần dùng SeaORM CLI để tạo ra một file migration.

Ví dụ việc tạo bảng `Product`:

```rust
// crates/migration/src/m20250918_025202_create_table_product.rs

use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_table(
            Table::create()
                .table(Product::Table)
                .if_not_exists()
                .col(ColumnDef::new(Product::Id).big_integer().primary_key().auto_increment())
                .col(ColumnDef::new(Product::Name).string_len(255).not_null())
                .col(ColumnDef::new(Product::Price).decimal_len(10, 2).check(Expr::col(Product::Price).gte(0)))
                // ... các cột khác được lược bỏ cho gọn
                .to_owned()
        ).await
    }
    
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Product::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum Product {
    Table,
    Id,
    Name,
    Price,
}
```

Function `up()` được chạy khi update DB, và `down()` được chạy nếu muốn rollback.

#### CRUD dữ liệu với Repository Pattern

Việc tương tác dữ liệu mình cài đặt nó trong `crates/infra/src/database/`. Ví dụ với hàm lấy danh sách bảng `Product` có hỗ trợ phân trang (Pagination):

```rust
// crates/infra/src/database/product_repo.rs

impl ProductRepository for SeaOrmProductRepo {
    async fn get_all(
        &self,
        page: u64,
        page_size: u64,
    ) -> Result<(Vec<product::Model>, u64), Error> {
        
        let paginator = product::Entity::find()
            .order_by_asc(product::Column::Name)
            .paginate(&self.db, page_size);

        let num_pages = paginator.num_pages().await.map_err(Error::from)?;
        let products = paginator.fetch_page(page - 1).await.map_err(Error::from)?;

        Ok((products, num_pages))
    }
}
```

SeaORM cung cấp sẵn API `.paginate()`, vì thế mình không cần viết câu lệnh `LIMIT` / `OFFSET` bằng tay và không cần tự `COUNT()` tổng số kết quả, giảm được code lặp lại (boilerplate) đáng kể.

### Sử dụng Redis làm Caching Layer cho Cart

Trong domain của E-Commerce, Giỏ hàng (Cart) của User thay đổi liên tục. Cho đến khi thực sự thanh toán, user sẽ thực hiện nhiều thao tác thêm, sửa, xóa sản phẩm khỏi giỏ. Lượng lớn thao tác này khi xuống đến PostgesQL sẽ dễ dẫn đến quá tải.

Thay vì lưu Cart vào PostgreSQL, mình chọn dùng **Redis**. Redis lưu dữ liệu trực tiếp trên RAM của server nên mang lại tốc độ Read/Write gần như tức thời và làm giảm tải cực lớn cho database chính.

Trong project, mình cài đặt tại `crates/infra/src/cache/cart_repo.rs`, sử dụng crate `redis`:

```rust
// crates/infra/src/cache/cart_repo.rs

use redis::AsyncCommands;

impl CartRepository for RedisCartRepository {
    async fn save(&self, cart: CartDto) -> Result<(), Error> {
        let key = format!("cart:{}", cart.user_id);
        let mut conn = self.pool.clone();

        // Object giỏ hàng được Serialize lại thành chuỗi JSON
        let json = serde_json::to_string(&cart)
            .map_err(|_| Error::internal("Serialization failed".to_string()))?;

        // Lưu thông tin vào Redis, thiết lập thời gian hết hạn là 24 giờ
        let _: () = conn.set_ex(key, json, 24 * 60 * 60)
            .await
            .map_err(|_| Error::internal("Cache error".to_string()))?;

        Ok(())
    }
    
    async fn get_by_user_id(&self, user_id: i64) -> Result<Option<CartDto>, Error> {
        let key = format!("cart:{}", user_id);
        let mut conn = self.pool.clone();

        let data: Option<String> = conn.get(key)
            .await
            .map_err(|_| Error::internal("Cache error".to_string()))?;

        match data {
            // Lấy ra và Deserialize JSON ngược lại thành Struct CartDto của Rust
            Some(json) => serde_json::from_str(&json)
                .map_err(|_| Error::internal("Data corruption".to_string())),
            None => Ok(None),
        }
    }
}
```

Lợi ích của việc này:

1. **TTL (Time-To-Live):** Cùng với lệnh lưu `.set_ex()`, mình setup dữ liệu giỏ hàng sẽ tự động bị phân huỷ trong `24 * 60 * 60` giây (tức 24 giờ). Nếu User hôm nay tạo giỏ mà lại không mua, khối dữ liệu đó sẽ tự động bốc hơi, giải phóng bộ nhớ đáng quý của RAM (tránh lãng phí).
2. **Serialization (Serde):** Nhờ cơ chế Serde `Serialize / Deserialize`, mình dễ dàng dùng `serde_json::to_string` để "đóng gói" toàn bộ cái Array giỏ hàng của Client thành 1 chuỗi json string duy nhất để lưu vào Redis, và lúc cần thiết thì lại dùng `serde_json::from_str` để parse lại thành một Struct Rust hoàn chỉnh.

## Ràng buộc Dữ liệu & Tính đúng đắn (Validation & Business Logic)

Một hệ thống đáng tin cậy phải chặn đứng dữ liệu rác (hoặc mang tính phá hoại) ngay từ "ngoài cửa". Đồng thời, logic hệ thống phải xử lý khôn khéo các rủi ro trong quá trình giao dịch (hết hàng, lỗi mạng, duplicate order).

Rút ra kinh nghiệm, mình gói gọn quy tắc thành: **Lọc dữ liệu tĩnh tại tầng DTO (vòng ngoài), và xử lý Domain Logic tại tầng Service (vòng trong)**.

### Ràng buộc ở vòng ngoài bằng crate `validator`

Để tránh viết nhiều hàm kiểm tra không cần thiết, mình dùng DTO (Data Transfer Object) và gắn các rule kiểm tra trực tiếp lên Struct thông qua crate `validator`.

Xem một đoạn code ở file `crates/core/src/dto/user_dto.rs`:

```rust
// crates/core/src/dto/user_dto.rs

use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::validator::validate_password_strength;

#[derive(Debug, Deserialize, Serialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct RegisterUserDto {
    #[validate(length(min = 3, max = 50, message = "Username must be between 3 and 50 characters"))]
    pub user_name: String,
    
    #[validate(email(message = "Email format is invalid"))]
    pub email: String,
    
    #[validate(
        length(min = 8, max = 128),
        custom(function = "validate_password_strength", message = "Password must contain at least 1 number and 1 uppercase letter")
    )]
    pub password: String,
    
    #[validate(must_match(other = "password", message = "Passwords do not match"))]
    pub confirm_password: String,
}
```

Axum sẽ ưu tiên gọi middleware và check trait `Validate` ngay khi parse JSON. Nếu người dùng nhập sai format email, chuỗi quá dài hay hai dòng password không giống nhau, server sẽ từ chối request và trả về lỗi `400 Bad Request` trước cả khi thực hiện business logic bên dưới.

### Xử lý Logic Nghiệp Vụ tại vòng trong (Service)

Các logic nghiệp vụ được cài đặt tại `core/src/service` mà không liên quan đến lớp HTTP và Database. Ví dụ như thao tác Checkout. Bài toán lúc này như sau: khi Client gửi yêu cầu Checkout, sau khi tạo đơn hàng (Order) thành công, ta lập tức phải xoá sạch giỏ hàng (Cart lưu ở Redis) của họ. Nhưng điều gì sẽ xảy ra nếu lệnh xoá Redis bị timeout hoặc mạng ở server gặp trục trặc?

 Checkout được cài đặt trong file `crates/core/src/service/checkout_service.rs`:

```rust
// crates/core/src/service/checkout_service.rs

impl CheckoutService {
    pub async fn checkout(&self, user_id: i64) -> Result<order::Model, Error> {
        let cart = self.cart_service.get_cart(user_id).await?;

        if cart.items.is_empty() {
            return Err(Error::bad_request("Cart is empty".to_string()));
        }

        // Tạo Order từ danh sách sản phẩm trong giỏ, insert xuống Postgres!
        let order = self.checkout_repo.create_order(user_id, cart.items).await?;

        // Chú ý: Cố gắng xoá giỏ hàng ở Redis sau khi tạo đơn thành công (best-effort)
        // Không truyền lỗi ra ngoài để tránh việc Client bắt được lỗi, tưởng chưa đặt hàng xong
        // và bấm "thanh toán" một lần nữa -> sinh ra một đơn hàng ảo (Duplicate order).
        if let Err(e) = self.cart_service.clear_cart(user_id).await {
            tracing::warn!(
                "Failed to clear cart for user {} after creating order {}: {:?}",
                user_id, order.id, e
            );
        }

        Ok(order)
    }
}
```

Đoạn mã "best-effort clear cart" trên giải quyết một **edge case** nguy hiểm. Bằng cách dùng lệnh `if let Err(e)`, hệ thống bắt được exception của hàm dọn dẹp và chỉ cảnh báo ra màn hình (`tracing::warn!`). Hành động này giúp luồng xử lý không bị đứt gãy, hệ thống vẫn trả HTTP 201 cho đơn hàng về phía Client, hy sinh một khoảng RAM ở Redis để ưu tiên việc bảo vệ tính duy nhất của đơn đặt hàng (tránh Duplicate order) - một thứ tối kỵ trong ngành E-commerce.

## Xử lý Lỗi (Error Handling)

Trong Rust web, việc lạm dụng `.unwrap()` là một điều tối kỵ, vì nó có thể làm toàn bộ server bị crash (panic) khi bất ngờ gặp lỗi. Thay vào đó, chúng ta phải bắt và xử lý lỗi triệt để thông qua kiểu `Result<T, E>`. Tuy nhiên, ứng dụng mình đang làm có nhiều thành phần có thể sinh ra lỗi (lỗi validate user input, hay lỗi truy vấn SQL từ SeaORM). Để có thể gom và thống nhất các loại lỗi về một mối và và trả về cho Client bằng JSON và HTTP Status Code thì làm thế nào?

Tại tầng `core`, mình thiết kế file `crates/core/src/error.rs` và dùng crate `thiserror` để định nghĩa một Enum tập hợp toàn bộ các lỗi có thể xảy ra:

```rust
// crates/core/src/error.rs

use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};
use sea_orm::DbErr;
use serde_json::json;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("Internal Server Error")]
    Internal(#[from] Internal),

    #[error("Not Found: {0}")]
    NotFound(#[from] NotFound),

    // Sử dụng #[from] để tự động convert lỗi của thư viện bên ngoài thành lỗi của nội bộ
    #[error("Database Error: {0}")]
    Database(#[from] DbErr),

    #[error("Validation Error: {0}")]
    Validation(#[from] validator::ValidationErrors),
}

#[derive(thiserror::Error, Debug)]
#[error("Not found: {message}")]
pub struct NotFound {
    pub message: String,
}
```

Từ nay tại các Endpoint, thay vì dùng `map_err` liên tục để ép kiểu lỗi, việc kết hợp `thiserror` và thẻ `#[from]` cho phép mình dùng `?` để Rust tự động ép kiểu của thư viện ngoài thành lỗi được định nghĩa trong Enum `Error`.

Tiếp theo, mình cài đặt trait `IntoResponse` của Axum để tự động chuyển lỗi trong Enum `Error` thành dạng JSON và trả về cho client:

```rust
// crates/core/src/error.rs

impl Error {
    // Phép biến hình lỗi nội bộ sang chuẩn HTTP Status Code
    fn get_codes(&self) -> (StatusCode, u16) {
        match self {
            Error::NotFound(_) => (StatusCode::NOT_FOUND, 10004),
            Error::Database(_) => (StatusCode::INTERNAL_SERVER_ERROR, 10006),
            Error::Validation(_) => (StatusCode::BAD_REQUEST, 10008),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, 10001),
        }
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let (status_code, _) = self.get_codes();
        
        // Trả về JSON chuẩn nhất quán cho mọi loại lỗi có thể xảy ra
        let body = Json(json!({ 
            "success": false, 
            "message": self.to_string() 
        }));

        (status_code, body).into_response()
    }
}
```

Giờ đây ở các tầng Handler của web server, code được clean hơn:

```rust
pub async fn get_user_by_id(...) -> Result<Json<UserDto>, Error> {
    let user = service.get_user(id).await?; // Dấu ? ngắn gọn và tinh tế
    Ok(Json(user)) // Khi thành công
}
```

Nếu hàm `get_user` phía Database trả về "Không tìm thấy phần tử", `?` sẽ tự trả ra lỗi `Error::NotFound`, HTTP Response `{ "success": false, "message": "Not found: id xyz" }` với status `404 Not Found` thông qua `into_reponse()`.

## Testing & CI/CD

Mặc dù Rust nổi tiếng vì trình biên dịch tĩnh siêu chặt chẽ ở giai đoạn Compile-time, nhưng nó vẫn không thể bảo vệ hệ thống khỏi những sai sót hổng logic nghiệp vụ (Business Logic). Nếu thiếu tests, refactor hoặc update dependences có thể mang lại rủi ro gặp lỗi. Hơn nữa, code đẩy lên Github có thể không đảm bảo chất lượng (format, hoặc performance) hoặc làm sập hệ thống khi deploy.

Nhờ việc tuân thủ triệt để nguyên lý Dependency Inversion của Clean Architecture, toàn bộ các thành phần của `shopping-cart` đều giao tiếp với nhau qua các "cổng" Trait (Ports). Điều này giúp việc thiết kế các **Integration Test** dễ hơn, mình có thể dùng mock repository thay vì setup một database thật.

Axum cung cấp `.oneshot()` để giả lập việc gọi HTTP. Mình dùng hàm này để gọi vào endpoint test của hệ thống mà không cần mở TCP chạy ngầm:

```rust
// crates/app/tests/checkout_test.rs

use axum::http::{Method, Request, StatusCode};
use tower::ServiceExt; // Nơi chứa hàm oneshot

#[tokio::test]
async fn test_checkout_success() {
    // 1. Dựng một Mock AppState (Dữ liệu giả lập lữu đệm Ram)
    let mock_state = AppState::new_mock(); 
    
    // 2. Load API Router của phiên bản test
    let app = create_router(mock_state);

    // 3. Giả lập một HTTP Request POST hoàn chỉnh gửi vào Endpoint
    let request = Request::builder()
        .method(Method::POST)
        .uri("/api/v1/checkout")
        .header("Authorization", "Bearer MOCK_TOKEN")
        .body(Body::from(r#"{"cart_id": "cart_123"}"#))
        .unwrap();

    // 4. One-shot: Gửi luồng bay thẳng xuống Axum không vòng qua cổng mạng ảo HTTP
    let response = app.oneshot(request).await.unwrap();

    // 5. Kiểm định kết quả có đúng kỳ vọng không
    assert_eq!(response.status(), StatusCode::CREATED);
}
```

Thay vì phụ thuộc vào sự tự giác của từng người trong team để chạy lệnh kiểm tra, mình uỷ thác hoàn toàn cho con bot của Github làm "Giám đốc chất lượng (QA)". Trong file `.github/workflows/ci.yml`, mình cấu hình CI Pipeline để chặn đứng các dòng code lỗi từ trứng nước:

Ngoài ra, mình viết thêm một CI pipeline để đảm bảo chất lượng code trong `.github/workflows/ci.yml` để tự động kiểm tra code, chạy test khi push code/merge pull request vào nhánh `main`:

```yaml
# .github/workflows/ci.yml
name: Rust CI

on:
  push:
    branches: [ "develop", "main" ]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Toolchain Rust
        uses: dtolnay/rust-toolchain@stable
      
      - name: 1. Check Định dạng Code
        run: cargo fmt --all -- --check
        
      - name: 2. Clippy Code Linter (Phát hiện Code dở và Dừng build ngay lập tức nếu có warning)
        run: cargo clippy --all-targets --all-features -- -D warnings
        
      - name: 3. Chạy Integration Tests
        run: cargo test --all-features
```

Bất kì dòng code nào format không đúng, bị clippy cảnh bảo hoặc chạy test fail, Github Action sẽ failed và không thể merge pull request.

## Kết luận

Nhin chung, viết backend bằng Rust chậm hơn so với Node.js hay Python, vì mình cần xây dựng các thành phần từ đầu. Đổi lại, kết quả là mình có một hệ thống khá an toàn và hiệu suất cao. Ngoài ra, việc thiết kế kiến trúc ban đầu và follow theo kiến trúc đó đến khi hoàn thiện rất quan trọng, có thể tránh việc xóa đi viết lại code chỉ vì framework không hợp lý hoặc kiến trúc có lỗ hổng trong quá trình phát triển.

Đây là [github](https://github.com/Tranduy1dol/shopping-cart) của dự án. Mọi người có thể thoải mái thêm issue nếu có vấn đề hoặc contribute nếu muốn. Cảm ơn.
