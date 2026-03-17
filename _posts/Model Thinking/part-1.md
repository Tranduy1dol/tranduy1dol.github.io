---
title: Mở đầu
date: 2026-03-17
excerpt: Giới thiệu về tư duy mô hình
category: LEARNING
---
## Giới thiệu

Mình tìm được khóa học qua Gemini. Có nhiều lý do để không học hoặc không tìm hiểu. Nhưng khi mình nhận ra vấn đề bản thân là thiếu khả năng tư duy logic, mình đã xuống tiền để được học. Khóa học này có leak trên youtube nhưng phần bài kiểm tra mới là cái quan trọng, nó giúp mình hiểu được bài. Mọi người có thể tra trên youtube nếu muốn free.

> "Tất cả mô hình đều sai, nhưng một số lại hữu ích" - George Box

Bất kỳ mô hình nào cũng phải cắt bỏ đi những chi tiết phức tạp của đời thực để giữ lại bộ khung cốt lõi. Do đó, về mặt kỹ thuật, không có mô hình nào phản ánh đúng 100% thực tế (mọi mô hình đều sai). Nhưng chính sự đơn giản hóa đó lại giúp chúng ta nhìn thấu vấn đề và đưa ra quyết định tốt hơn (chúng hữu ích). Đây sẽ là bài đầu tiên trong số 7 bài cung cấp những gì cơ bản nhất về tư duy mô hình, cũng là cách để mình ghi nhớ nội dung được học.

## Tại sao lại cần tư duy mô hình

Có 4 lý do chính mình được học:

1. Mô hình giúp chúng ta trở thành công dân thông minh

Lý do đơn giản là mô hình tốt hơn. Việc sử dụng mô hình giúp suy nghĩ của chúng ta trở lên logic. Khi đối mặt với một vấn đề, vô vàn ý tưởng sẽ chạy lung tung trong đầu. Một mô hình tốt sẽ đóng vai trò như chiếc xương sống, giúp ta phân loại và sắp xếp những luồng suy nghĩ đó một cách rành mạch. Nhưng khi có mô hình làm xương sống, việc sắp xếp suy nghĩ trở nên đơn giản hơn. Ngoài ra, mô hình cũng làm chúng ta khiếm tốn hơn.

2. Mô hình giúp chúng ta suy nghĩ rõ ràng

Giống như đã nói, có xương sống thì suy nghĩ được sắp xếp. Không chỉ thế, khi sử dụng mô hình, chúng ta sẽ cần suy nghĩ đến các thành phần của mô hình đó. Việc này giúp ta xác định được quan hệ và ranh giới logic giữa chúng.

3. Mô hình giúp ta hiểu dữ liệu

Hiểu ở đây không chỉ nói đến việc dự đoán 1 cách gần như chính xác, mà còn giúp giải thích các hiện tượng, hiểu độ tốt của các mô hình, và lấy những tri thức từ việc nhìn và đọc dữ liệu.

4. Mô hình giúp ta đưa ra quyết định, thiết kế, chính sách tốt hơn

Từ việc hiểu dữ liệu, chúng ta có thể tự đánh giá các quyết định. Từ đó, ta có cơ sở khách quan để cân nhắc và so sánh xem lựa chọn nào mang lại lợi ích tối ưu nhất.

## Các mô hình Phân loại (Categorical Models)

Mô hình phân loại là dạng mô hình dự đoán cơ bản nhất, trong đó chúng ta gom nhóm thực tại thành các danh mục (lump to live) để dễ dàng hiểu thế giới. Việc tạo ra các hộp/danh mục giúp chúng ta phân loại dữ liệu và đưa ra dự đoán về tập hợp con đó nhanh chóng hơn.

Để đánh giá một mô hình phân loại có tốt hay không, chúng ta sử dụng toán học để tính toán **Phương sai (Variance)** và $R^2$.

- **Phương sai:** Đo lường mức độ khác biệt của dữ liệu so với giá trị trung bình (tính bằng trung bình của bình phương các độ lệch).
- **$R^2$**: Là tỷ lệ phương sai của dữ liệu đã được mô hình giải thích. Công thức là $R^2$ = Phương sai được giải thích / Tổng phương sai.

Ví dụ, nếu bạn có một danh sách các loại thực phẩm với lượng calo dao động rất lớn, phương sai tổng sẽ rất cao. Nhưng nếu bạn phân loại chúng thành "Trái cây" và "Đồ tráng miệng" (bánh, kẹo), bạn sẽ thấy trái cây có lượng calo trung bình thấp hơn và đồ tráng miệng cao hơn. Bằng cách phân loại này, bạn có thể giải thích được phần lớn sự biến thiên của calo trong tập dữ liệu. Nếu $R^2$ càng gần 1 (hoặc 100%), mô hình phân loại càng xuất sắc; nếu gần 0, cách phân loại đó không có giá trị. Tuy nhiên, cần lưu ý nguyên tắc: Tương quan không đồng nghĩa với quan hệ nhân quả (Correlation is not causation).
## Mô hình Tuyến tính (Linear Models)

Mô hình tuyến tính nâng cao hơn một bước so với mô hình phân loại, biểu diễn dạng toán học cơ bản nhất mà chúng ta học từ cấp 2: $y=mx+b$. Trong đó, $y$ (biến phụ thuộc) thay đổi dưới tác động của $x$ (biến độc lập). Mô hình này giúp chúng ta đánh giá hai yếu tố cực kỳ quan trọng đối với dữ liệu:

1. **Dấu (Sign):** Xác định biến $x$ có tác động tích cực (+) hay tiêu cực (-) lên biến y.
2. **Độ lớn (Magnitude):** Xác định sự thay đổi của $y$ là bao nhiêu khi $x$ tăng lên 1 đơn vị.

Trong thực tế, một kết quả $(y)$ thường bị ảnh hưởng bởi nhiều nguyên nhân $(x_1,x_2,…)$, tạo thành mô hình tuyến tính đa biến: $y=\beta_0+\beta_1 x_1+\beta_2 x_2 + \ldots$. Việc chạy mô hình tuyến tính giúp chúng ta xác định được **Hệ số lớn (Big Coefficient)**. Ví dụ, trong giáo dục, $y$ là điểm số, $x_1$ là sĩ số lớp và $x_2$ là chất lượng giáo viên. Dữ liệu hồi quy có thể cho thấy hệ số của "chất lượng giáo viên" lớn hơn rất nhiều so với "sĩ số lớp". Dựa vào tư duy hệ số lớn, các nhà hoạch định chính sách hoặc doanh nghiệp biết chính xác nên dồn nguồn lực (đầu tư tiền bạc, thời gian) vào đâu để thu được kết quả tốt nhất ("bang for the buck").

Một lý do khiến mô hình tuyến tính hữu ích một cách đáng kinh ngạc trong một thế giới phi tuyến tính là vì "mọi thứ đều tuyến tính, ít nhất là trong một khoảng thời gian ngắn". Bất kỳ một đường cong phức tạp nào cũng có thể được xấp xỉ bằng một loạt các đoạn thẳng ngắn, giống như một bức tường gạch uốn lượn thực chất được xếp từ những viên gạch thẳng. Tuy nhiên, hạn chế lớn của việc dựa vào "Hệ số lớn" trong mô hình tuyến tính là nó chỉ chính xác trong phạm vi dữ liệu hiện có. Nếu muốn vượt ra ngoài, tạo ra những đổi mới đột phá hoặc những "thực tại mới" (new realities), chúng ta không thể chỉ ngoại suy tuyến tính một cách mù quáng, mà cần suy nghĩ vượt ra ngoài khuôn khổ dữ liệu bằng các mô hình phức tạp hơn.