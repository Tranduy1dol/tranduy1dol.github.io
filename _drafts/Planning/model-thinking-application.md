---
title: Tổng hợp kế hoạch viết blog — Model Thinking & Systems Engineering
date: 2026-05-22
excerpt: Kế hoạch viết blog gắn Model Thinking với các vấn đề kỹ thuật thực tế
category: PLANNING
---

## 1. Xuất phát điểm

Vừa hoàn thành khóa **Model Thinking** trên Coursera. Đã viết 7 bài blog tóm tắt nội dung khóa học. Feedback nhận được: bài viết khó hiểu và có cảm giác "AI viết".

**Background kỹ thuật:** Rust, Go, C/C++. Các hệ thống đã làm: backend, HFT, search engine. Đang học và định hướng theo hướng **systems engineering**.

**Mục tiêu:**

- Giữ lại kiến thức cho bản thân
- Positioning bản thân như engineer hiểu system design ở mức sâu — không chỉ biết code mà articulate được lý do đằng sau các quyết định kỹ thuật
- Chia sẻ với developers khác

---

## 2. Vấn đề với các bài hiện tại

Cấu trúc đang đi theo kiểu *lecture notes*:

> định nghĩa → công thức → ví dụ → kết luận

Đọc xong biết *cái gì* nhưng không biết *tại sao quan trọng với mình*. Đây là lý do bài đọc như tóm tắt giáo trình thay vì một góc nhìn cá nhân.

---

## 3. Insight quan trọng

Đang làm kỹ thuật theo kiểu **tacit knowledge** — biết cách làm nhưng chưa có ngôn ngữ để mô tả *tại sao*. Model Thinking cung cấp ngôn ngữ đó.

**Ví dụ cụ thể:** Khi thiết kế producer-consumer pattern cho activity logger, quyết định được đưa ra hoàn toàn tự nhiên — nhưng thực chất đang áp dụng stocks/flows/feedback loop mà không có tên gọi cho chúng.

---

## 4. Hướng viết mới

**Nguyên tắc cốt lõi:** Không viết về mô hình — viết về quyết định.

> Mỗi bài là một **vấn đề kỹ thuật thực tế**. Lý thuyết xuất hiện để giải thích, không phải để được trình bày.

**Công thức cho mỗi bài:**

```
Vấn đề thực tế → Phân tích bằng mô hình → Trade-off → Quyết định → Bài học
```

**Đừng tóm tắt sách.** Câu hỏi nên tự hỏi trước khi viết:
> *"Nếu một đồng nghiệp hỏi mình điều này, mình sẽ giải thích thế nào?"*

---

## 5. Danh sách bài viết — Model Thinking × Engineering

| # | Vấn đề kỹ thuật | Mô hình | Ghi chú |
|---|---|---|---|
| 1 | Activity logger — tại sao không save thẳng vào DB | Stocks/Flows, Feedback Loops | **Bài đầu tiên, đã có đủ nguyên liệu** |
| 2 | Retry logic và state machine design | Markov Chain | |
| 3 | Tại sao Raft/Paxos đảm bảo convergence | Lyapunov Function | |
| 4 | Technical debt và architectural lock-in | Path Dependence | |
| 5 | Capacity planning và performance tuning | Linear Models | |
| 6 | Resource allocation trong distributed systems | Colonel Blotto | HFT context |

**Tạm gác:** Standing ovation, peer effect, sorting — khó gắn tự nhiên vào engineering context.

---

## 6. Bước tiếp theo

Bài 1 đã có đủ nguyên liệu từ câu chuyện thực tế:

**Angle:** *"Tôi build một activity logger, tưởng đơn giản, rồi nhận ra mình đang thiết kế một hệ thống có thể tự crash chính nó — và tại sao mọi distributed system đều có vấn đề này."*

**Outline sơ bộ:**

1. Bài toán ban đầu: log activity của user
2. Quyết định đầu tiên: save thẳng vào DB → vấn đề gì?
3. Giải pháp: producer-consumer pattern
4. Vấn đề ẩn: queue overflow khi traffic tăng đột biến
5. Phân tích bằng Stocks/Flows: queue là stock, producer là inflow, consumer là outflow
6. Các giải pháp và trade-off: backpressure, rate limiting, scale consumer
7. Bài học: mọi system design đều là bài toán cân bằng flows

**Ưu tiên:** Publish bài A1 trước khi làm thêm bất kỳ plan nào khác.
