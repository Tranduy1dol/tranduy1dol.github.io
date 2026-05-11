---
title: "Backend Go với Gin — những gì mình học được khi so sánh với Axum"
date: 2026-05-10
excerpt: Sau khi viết backend bằng Rust và Axum, mình build một project Go với Gin. Cùng bài toán, khác ngôn ngữ — và sự khác biệt thú vị hơn mình nghĩ.
category: CODING
---
## Cùng bài toán, khác ngôn ngữ

Bài về [shopping-cart](../Backend/e-commerce-backend) mình dùng Rust + Axum. Project lần này là **kotoba-press-core** — backend cho app học tiếng Nhật, có từ điển JMdict, test JLPT, và spaced repetition flashcard. Mình dùng Go + Gin.

Kiến trúc vẫn là Clean Architecture, vẫn có repository pattern, vẫn inject dependency từ `main`. Phần đó không có gì mới để nói. Cái thú vị là cách Gin và Axum giải quyết cùng một vấn đề theo hai hướng khác nhau.

## Gin hoạt động thế nào

Gin là HTTP framework cho Go. Nó wrap `net/http` của standard library và thêm routing, middleware, binding, và một số tiện ích khác.

Điểm khởi đầu:

```go
r := gin.Default()  // engine với Logger và Recovery middleware mặc định

r.GET("/health", func(ctx *gin.Context) {
    ctx.JSON(200, gin.H{"status": "ok"})
})

r.Run(":8080")
```

`gin.Context` là trung tâm của mọi thứ trong Gin. Nó chứa request, response writer, params, và một key-value store để truyền data giữa các middleware. Mọi handler đều nhận `*gin.Context` và không trả về gì cả.

### Routing và grouping

Gin dùng route group để tổ chức endpoint và gắn middleware theo nhóm:

```go
v1 := r.Group("/api/v1")
v1.Use(middleware.AuthMiddleware(jwtSvc))  // áp dụng cho toàn bộ /api/v1
{
    v1.GET("/words/:id", wordHandler.GetWord)
    v1.GET("/words/search", wordHandler.SearchWords)

    admin := v1.Group("/admin")
    admin.Use(middleware.AdminMiddleware())  // thêm một lớp nữa cho /admin
    {
        admin.POST("/words", adminHandler.CreateWord)
        admin.DELETE("/words/:id", adminHandler.DeleteWord)
    }
}
```

Middleware chain hoạt động theo thứ tự: request đến `/admin/words` sẽ đi qua `AuthMiddleware` → `AdminMiddleware` → handler. Nếu bất kỳ middleware nào gọi `ctx.Abort()`, chain dừng lại và handler không được gọi.

### Middleware: closure trả về HandlerFunc

Middleware trong Gin là một function trả về `gin.HandlerFunc`. Pattern phổ biến là dùng closure để inject dependency:

```go
func AuthMiddleware(jwtSvc *auth.JWTService) gin.HandlerFunc {
    return func(ctx *gin.Context) {
        authHeader := ctx.GetHeader("Authorization")
        if authHeader == "" {
            ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        claims, err := jwtSvc.ValidateToken(tokenString)
        if err != nil {
            ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
            return
        }

        ctx.Set("user_id", claims.UserID)
        ctx.Set("user_role", claims.Role)
        ctx.Next()  // tiếp tục chain
    }
}
```

`ctx.Set` / `ctx.GetString` là cách truyền data giữa middleware và handler — giống một map gắn vào request context. Handler sau đó lấy ra:

```go
func UserIDFromContext(ctx *gin.Context) (string, error) {
    userID := ctx.GetString("user_id")
    if userID == "" {
        return "", domain.ErrUnauthorized
    }
    return userID, nil
}
```

### Binding và validation

Gin có built-in binding cho JSON body, query params, và URI params — tất cả dùng struct tags:

```go
// URI param: /words/jlpt/:level
type JLPTLevelParam struct {
    Level int `uri:"level" binding:"required,min=1,max=5"`
}

// Query string: ?limit=20&offset=0
type PaginationQuery struct {
    Limit  int `form:"limit"  binding:"omitempty,min=1,max=1000"`
    Offset int `form:"offset" binding:"omitempty,min=0"`
}

// JSON body
type ReviewCardRequest struct {
    Quality int `json:"quality" binding:"required,min=0,max=5"`
}
```

Trong handler, gọi `ShouldBind*` để parse và validate cùng lúc:

```go
var param dto.JLPTLevelParam
if err := ctx.ShouldBindUri(&param); err != nil {
    apperror.Response(ctx, apperror.FromValidationError(err))
    return
}

var page dto.PaginationQuery
if err := ctx.ShouldBindQuery(&page); err != nil {
    apperror.Response(ctx, apperror.FromValidationError(err))
    return
}
```

`ShouldBind` không abort request khi fail — bạn tự quyết định làm gì với error. `MustBind` thì abort với 400 tự động, nhưng ít dùng vì mất control.

## Error handling

Gin không có built-in error handling. Mình tự build một layer nhỏ:

```go
// Domain errors → HTTP status codes
func Response(ctx *gin.Context, err error) {
    var appErr *AppError
    if errors.As(err, &appErr) {
        ctx.JSON(appErr.Code, appErr)
        return
    }

    // Map domain errors
    appErr = FromDomainError(err)
    if appErr.Code == 500 {
        log.Printf("[ERROR] %s %s: %v", ctx.Request.Method, ctx.Request.URL.Path, err)
    }
    ctx.JSON(appErr.Code, appErr)
}
```

Mọi handler đều gọi `apperror.Response(ctx, err)` thay vì tự viết `ctx.JSON`. Một chỗ duy nhất quyết định domain error nào map sang HTTP status nào.

## So sánh với Axum

Đây là điểm khác biệt rõ nhất giữa hai framework.

Axum dùng **type system** để extract data từ request. Handler khai báo những gì nó cần, compiler kiểm tra tại compile-time:

```rust
// Axum: compiler biết handler này cần State, JWT claims, và JSON body
pub async fn add_item(
    State(state): State<AppState>,
    JwtAuth(claims): JwtAuth,       // custom extractor, tự động verify JWT
    Json(dto): Json<AddCartItemDto>, // tự động parse + validate
) -> Result<Json<CartDto>, Error> {
    // nếu JwtAuth fail → 401 tự động, handler không được gọi
}
```

Gin dùng **runtime** để lấy data từ context:

```go
// Gin: lấy user_id từ map, có thể fail ở runtime
func (h *SRSHandler) ReviewCard(ctx *gin.Context) {
    userID, err := dto.UserIDFromContext(ctx)  // GetString("user_id")
    if err != nil {
        apperror.Response(ctx, err)
        return
    }

    var req dto.ReviewCardRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {  // parse + validate
        apperror.Response(ctx, apperror.FromValidationError(err))
        return
    }
    // ...
}
```

Hệ quả thực tế:

|                      | Axum                        | Gin                                      |
| -------------------- | --------------------------- | ---------------------------------------- |
| **Kiểm tra lỗi**     | Compile-time                | Runtime                                  |
| **Boilerplate**      | Ít hơn (extractor tự xử lý) | Nhiều hơn (`if err != nil` mỗi bước)     |
| **Đọc hiểu**         | Signature nói lên tất cả    | Phải đọc body để biết handler cần gì     |
| **Sai lầm phổ biến** | Khó sai hơn                 | Quên check error, lấy sai key từ context |

Axum an toàn hơn nhờ type system. Gin đơn giản hơn để học và viết nhanh.

Ngoài ra, Axum xử lý error response tự động thông qua `IntoResponse` — implement trait đó cho error type, Axum tự convert khi handler trả về `Err(...)`. Gin không có cơ chế đó, bạn phải gọi response function thủ công ở mỗi handler.

## Một tính năng thú vị: SRS và SM-2

Ngoài phần HTTP, project này có một domain logic thú vị: **Spaced Repetition System** dùng thuật toán SM-2.

Ý tưởng: ôn từ vựng đúng lúc sắp quên — không ôn quá sớm (lãng phí), không ôn quá muộn (đã quên). Mỗi lần ôn, user cho điểm từ 0-5. Điểm cao → ôn lại sau nhiều ngày hơn. Điểm thấp → reset về ngày mai.

```go
func CalculateSM2(quality int, card SRSCard) SRSCard {
    if quality < 3 {
        // Fail: reset về đầu
        card.Repetition = 0
        card.Interval = 1
    } else {
        // Pass: tăng interval
        switch card.Repetition {
        case 0: card.Interval = 1
        case 1: card.Interval = 6
        default:
            card.Interval = int(math.Round(float64(card.Interval) * card.EaseFactor))
        }
        card.Repetition++
    }

    // Ease factor điều chỉnh theo performance
    card.EaseFactor += 0.1 - float64(5-quality)*(0.08+float64(5-quality)*0.02)
    if card.EaseFactor < 1.3 {
        card.EaseFactor = 1.3
    }

    card.DueDate = time.Now().AddDate(0, 0, card.Interval)
    return card
}
```

Từ dễ (điểm 5 liên tục): interval tăng theo cấp số nhân — 1 → 6 → 15 → 35 → 80 ngày. Từ khó (điểm dưới 3): reset về 1 ngày. `EaseFactor` là hệ số nhân, tăng khi ôn tốt, giảm khi ôn kém, không bao giờ xuống dưới 1.3.

Query MongoDB để lấy cards cần ôn hôm nay:

```go
filter := bson.M{
    "user_id":  userID,
    "due_date": bson.M{"$lte": time.Now()},
}
```

Đơn giản. Toàn bộ logic phức tạp nằm trong `CalculateSM2`, không phải trong database query.

## Go vs Rust: khi nào dùng cái nào

Sau khi build cả hai, mình thấy sự khác biệt không phải ở performance — cả hai đều đủ nhanh cho web API. Sự khác biệt nằm ở **tốc độ phát triển** và **loại lỗi bạn muốn bắt**.

Go + Gin: viết nhanh, đọc dễ, lỗi xuất hiện ở runtime. Phù hợp khi cần iterate nhanh, team lớn, bài toán không đòi hỏi microsecond latency.

Rust + Axum: viết chậm hơn, compiler khó tính hơn, nhưng lỗi bị bắt ở compile-time. Phù hợp khi correctness quan trọng hơn tốc độ phát triển — trading engine, systems programming, latency-critical services.

kotoba-press là CRUD API cho app học tiếng Nhật. Go là lựa chọn đúng. Shopping-cart cũng là CRUD API — Rust ở đó để học, không phải vì bài toán đòi hỏi.

Source code ở [github.com/Tranduy1dol/kotoba-press-core](https://github.com/Tranduy1dol/kotoba-press-core) nếu muốn xem chi tiết hoặc đóng góp. App đang live tại [kotoba-press.vercel.app](https://kotoba-press.vercel.app) — còn nhiều thứ chưa hoàn thiện, mọi người hoan hỉ nhé.
