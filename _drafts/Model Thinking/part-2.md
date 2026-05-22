---
title: Quyết định và Sở thích cá nhân
date: 2026-03-31
excerpt: Phân tích cách con người ra quyết định và sự khác biệt trong sở thích cá nhân
category: LEARNING
---
## Giới thiệu

Bài này sẽ nói về cách đưa ra quyết định 1 cách khách quan dựa vào việc sử dụng mô hình và mô hình hóa các sở thích cá nhân.

## Cây quyết định

Mỗi khi chúng ta đưa ra quyết định, có nhiều yếu tố sẽ ảnh hưởng đến kết quả. Ngoài ra sẽ có nhiều yếu tố cần được xem xét. Để trực quan hóa các yếu tố, cũng như giảm độ bất định, giảm ảnh hưởng của cảm xúc đến lựa chọn, **Cây quyết định** (hay Decision Tree) là một công cụ phù hợp.

### Cấu trúc

Mô hình được đọc từ trái sang phải, bắt đầu từ nút gốc gọi là "nút quyết định", đại diện cho các phương án có thể lựa chọn. Từ nút đó tỏa ra các "nút cơ hội" thể hiện sự bất định, mỗi nhánh sẽ đi kèm với xác suất xảy ra. "Điểm cuối" của nhánh đại diện cho kết quả mang lại.

### Giá trị kì vọng

Để đưa ra lựa chọn, ta tính giá trị kì vọng bằng kết quả của nút nhân với xác suất xảy ra, rồi cộng kết quả của các nút cơ hội vào nút nhánh. Hoặc có thể đơn giản hơn, so sánh giá trị kì vọng của các "nút cơ hội", rồi đưa ra lựa chọn. Tùy vào tình huống có thể có tiêu chí khác nhau. Quyết định liên quan đến chi phí cần chọn giá trị kì vọng thấp; đối với lợi nhuận thì ngược lại.

### Rollback và Quyết định tuần tự

Thực tế, các quyết định kéo theo một chuỗi hệ quả và quyết định tiếp theo, hoặc các sự kiện bất định phụ thuộc lẫn nhau. Để giải quyết, chúng ta có thể tính ngược (Rollback), tức là tính toán giá trị kì vọng từ điểm cuối ngược dần nút gốc để tìm ra chiến lược tối ưu.

### Ví dụ

Một người bạn rủ bạn mua 1 vé trúng thưởng giá 50`$`. Có 1000 vé được bán và 1 vé sẽ trúng 20.000`$`. Nếu không trúng, người bạn đó hứa sẽ trả lại bạn 20`$`. Bạn có nên mua hay không?

Thường thì chúng ta sẽ dựa trên cảm tính, hoặc tự lựa chọn và cho rằng kết quả là may rủi. Nếu áp dụng cây quyết định, chúng ta sẽ có cơ sở khách quan hơn để lựa chọn:

![Cây quyết định](public/draw_2026-03-31.excalidraw.svg)

Từ cây quyết định này, có thể thấy nếu mua vé, trúng ta vẫn sẽ lỗ 10.02`$`. Quyết định không mua sẽ có chi phí thấp hơn.

## Ra quyết định đa tiêu chí

Nhiều tình huống trong cuộc sống có thể không chỉ mang tính định lượng mà còn là sự đánh đổi giữa các yếu tố khác nhau. Ví dụ như mua nhà, chúng ta nên quan tâm đến tuổi thọ, diện tích, số phòng, ... Mô hình quyết định đa tiêu chí có thể giúp chúng ta.

### Bảng tính và trọng số

Đưa các lựa chọn và các yếu tố vào 1 bảng. Điều này giúp chúng ta trực quan hóa, tránh quá tải não bộ khi phải giữ cùng lúc quá nhiều lập luận hoặc nhiều chiều không gian của lựa chọn. Ngoài ra, mỗi yếu tố được xem xét có thể có mức độ quan trọng khác nhau đối với người đưa ra lựa chọn. Việc đặt trọng số giúp chúng ta thể hiện điều đó. Và với 1 bảng tính trực quan, đưa ra lựa chọn không còn là vấn đề quá khó.

### Ví dụ

Bạn là sinh viên năm nhất đang tìm trọ trên Hà Nội. Quá nhiều bài đăng trên các trang mạng xã hội. Và việc xem trực quan có thể không thuận tiện vì bạn đang ở quê.

| **Tiêu chí** | **Trọ A** | **Trọ B** | **Trọng số** |
| ------------ | --------- | --------- | ------------ |
| Gần trường   | 1         | 0         | 1            |
| Có ban công  | 1         | 0         | 3            |
| Giá dưới 3tr | 0         | 1         | 2            |
| Trên 25m2    | 1         | 0         | 2            |
| Có bếp       | 1         | 1         | 1            |
| Chung chủ    | 0         | 1         | 3            |
| **Tổng**     | 7         | 6         |              |

Lập 1 bảng như trên và bạn có thể đưa ra quyết định phù hợp nhất với bản thân.

## Mô hình hóa Sở thích: Sở thích đa dạng (Diverse Preferences)

Mỗi người có một sở thích khác nhau - đó là lý do vì sao các nhà hàng tapas (phục vụ các đĩa thức ăn nhỏ, đa dạng) ra đời. Để phân tích và giảm thiểu các rắc rối do sự bất đồng trong đánh giá, chúng ta cần mô hình hóa sở thích.

### Sở thích cốt lõi vs. Sở thích công cụ

Việc phân biệt hai khái niệm này là rất quan trọng. _Sở thích cốt lõi (Fundamental preferences)_ là những mong muốn về kết quả cuối cùng (ví dụ: sức khỏe tốt, nền kinh tế tăng trưởng). _Sở thích công cụ (Instrumental preferences)_ là ưu tiên về cách thức hay hành động để đạt được kết quả đó (ví dụ: chế độ ăn kiêng, chính sách thuế). Hai người có thể chia sẻ cùng một Sở thích cốt lõi nhưng lại mâu thuẫn về Sở thích công cụ do họ có mô hình dự đoán khác nhau về thế giới.

### Tính hợp lý của Sở thích (Rational Preferences)

Sở thích cá nhân định hướng cho lựa chọn, và mô hình chuẩn thường giả định con người có "sở thích hợp lý", đòi hỏi 2 điều kiện:

1. **Đầy đủ (Complete):** Có khả năng so sánh bất kỳ hai lựa chọn A và B nào (thích A hơn B, B hơn A, hoặc bàng quan/thích ngang nhau).

2. **Bắc cầu (Transitive):** Không có tính chất vòng vòng. Nếu bạn thích A hơn B, và B hơn C, thì bạn bắt buộc phải thích A hơn C.

 Dù cấp độ cá nhân hiếm khi vi phạm tính Bắc cầu, nhưng khi gộp chung một nhóm người hợp lý, tập thể đó hoàn toàn có thể có một sở thích theo vòng luẩn quẩn (ví dụ: tập thể thích A hơn B, B hơn C, nhưng lại thích C hơn A). Đây là một vấn đề đau đầu trong lý thuyết bầu cử.

## Mô hình hóa Sở thích: Sở thích Không gian (Spatial Preferences)

Để cụ thể hóa và giúp các sở thích có thể đong đếm được, chúng ta xây dựng các **Sở thích không gian (Spatial Preferences)**. Ý tưởng là ánh xạ các lựa chọn thay thế lên một hoặc nhiều chiều không gian cụ thể.

Dọc theo một chiều không gian, sở thích của con người thường được chia thành ba loại:

1. **Sở thích tăng dần (Increasing preferences):** Càng nhiều càng tốt (more is always preferred to less). Ví dụ: tiền bạc, sức khỏe, tốc độ máy tính.

2. **Sở thích giảm dần (Decreasing preferences):** Càng ít càng tốt (less is always preferred to more). Ví dụ: sự ô nhiễm, thời gian phải làm việc mệt mỏi.

3. **Sở thích có một đỉnh (Single-peaked preferences):** Càng nhiều càng tốt nhưng chỉ đạt tới một giới hạn nhất định, đó gọi là **Điểm lý tưởng (Ideal point)**. Vượt qua điểm đó thì sự yêu thích lại giảm xuống. Ví dụ: số lượng đường trong ly cà phê, kích thước của que kem.

### Tác dụng của mô hình không gian

Việc biểu diễn sở thích lên không gian và giả định rằng "khoảng cách tới điểm lý tưởng quyết định mức độ yêu thích" (càng gần càng thích) giúp giới hạn đáng kể số lượng các trình tự ưu tiên (preference orderings) có thể xảy ra. Giả sử có 5 màu sắc đặt trên một trục thẳng, thay vì có 120 cách sắp xếp sở thích ngẫu nhiên nếu không có cấu trúc, mô hình điểm lý tưởng trên một đường thẳng chỉ cho phép một số lượng rất nhỏ các thứ tự (như 8 hoặc 15 trật tự) do quy luật gần-xa kiểm soát. Điều này loại trừ phần lớn các "sở thích phi lý" và giúp chúng ta dễ dàng phân tích, dự đoán, hoặc thiết kế chính sách trên một quang phổ ý thức hệ (ví dụ: trục Tả - Hữu trong chính trị).
