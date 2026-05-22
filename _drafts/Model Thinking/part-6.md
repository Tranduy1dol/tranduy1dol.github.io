---
title: Hệ thống thích ứng phức hợp
date: 2026-04-17
excerpt: Nghiên cứu cách các quy tắc đơn giản ở cấp độ vi mô tạo ra những hành vi phức tạp ở cấp độ vĩ mô.
category: LEARNING
---
## Giới thiệu

Hệ thống thích ứng phức hợp là sự kết hợp của các phần tử cơ bản, có khả năng tự tổ chức, tiến hóa mà không cần sự kiểm soát, quy hoạch nào. Bài này sẽ giới thiệu cách các mô hình đó hoạt động.

## Mạng lưới

[Bài 4](part-4) đề cập về mô hình SIS, với giả định rằng hai người sẽ gặp nhau một cách ngẫu nhiên và lây bệnh. Trên thực tế, tình huống này khá khó xảy ra. Một người có thể chỉ gặp những người họ quen biết. Để mô hình hóa mối quan hệ này, dùng mạng lưới là cách tổng quát nhất.

Một mạng lưới gồm 2 thành phần cơ bản: Đỉnh (Nodes) đại diện cho người, máy tính, .. và Cạnh (Edges) đại diện cho mối quan hệ giữa 2 đỉnh. Để đo lường được các thông tin mạng lưới cung cấp, chúng ta có thể nhìn vào các thông tin:

- Bậc (Degree): Số lượng cạnh nối vào một đỉnh.
- Đường đi ngắn nhất (Shortest Path) giữa hai đỉnh.
- Hệ số cụm (Clustering Coefficient): Xác suất mà 3 điểm nối nhau tạo thành tam giác trong mạng lưới.

### Kiến trúc mạng lưới

#### Mạng lưới đều (Regular Network)

Đây là cấu trúc có trật tự, trong đó tất cả các đỉnh đều có cùng một số lượng kết nối như nhau. Các đồ thị đều điển hình bao gồm chu kỳ (cycles), mạng tinh thể không gian (spatial lattices) và đồ thị đều ngẫu nhiên (random regular graphs).

Về mặt hành vi, mạng lưới này có hệ số cụm cao nhưng trung bình khoảng cách đường đi giữa hai đỉnh thường khá dài. Cấu trúc này thường được dùng làm nền tảng trong các mô hình như Tự động hóa tế bào (Cellular Automata) hoặc mô hình thẩm thấu.

#### Mạng lưới ngẫu nhiên (Random Network)

Là một dạng đồ thị không đều (non-regular graph), các liên kết trong mạng được tạo ra một cách hoàn toàn ngẫu nhiên. Về mặt hành vi, mạng lưới dạng này có trung bình độ dài đường đi giữa hai điểm ngắn nhưng hệ số cụm lại thấp.

#### Mạng lưới Thế giới nhỏ (Small-World Network)

Đây là mô hinh lai, kết hợp sự ưu việt của cả mạng lưới đều và mạng lưới ngẫu nhiên. Mạng này duy trì đặc tính có hệ số cụm cao (các đỉnh thường tập hợp lại thành cụm) nhưng đan xen thêm một số ít các kết nối ngẫu nhiên đóng vai trò "bắc cầu" giữa các cụm. Cấu trúc này lí giải cho việc thông tin, dịch bệnh hoặc mạng lưới giới thiệu cơ hội việc làm trên diện rộng chỉ qua một số ít các bước trung gian.

#### Mạng lưới không theo tỷ lệ (Scale-Free Network)

Mô hình đồ thị không đều này hình thành theo quy tắc "bám rễ ưu tiên" hay hiệu ứng "người giàu càng giàu thêm". Các thành phần mới gia nhập mạng lưới sẽ có xu hướng ưu tiên kết nối với các đỉnh đã có nhiều liên kết. Quá trình gia nhập của các đỉnh mới tạo ra một hệ thống tuân theo phân phối lũy thừa, trong đó đại đa số các đỉnh có rất ít kết nối, nhưng lại tồn tại số ít các đỉnh có lượng kết nối khổng lồ đóng vai trò làm trạm chung chuyển.

Kiến trúc Scale-Free rất vững chắc trước các hỏng hóc hoặc sự cố ngẫu nhiên (một vài đỉnh nhỏ mất kết nối không khiến cho hệ thống sụp đổ) nhưng lại rất mong manh nếu có kẻ tấn công có chủ đích nhắm vào trạm chung chuyển.

### Động lực học mạng lưới - Mô hình thẩm thấu

Bắt nguồn từ lĩnh vực vật lý, ban đầu được thiết kế để trả lời câu hỏi liệu một nguồn tài nguyên (nước, chất lỏng) có thể chảy xuyên qua một khối chất rắn hay một mạng lưới hay không. Khi mô phỏng, người ta thường đặt mô hình vào một mạng lưới dạng lưới các ô vuông. Khi một chất lỏng tới một ô, nó có xác suất $p$ lan sang các ô khác. Hệ thống được coi là thẩm thấu thành công nếu tồn tại một đường đi liên tục từ đỉnh xuống đáy mạng lưới.

#### Ngưỡng bùng phát

Điểm thú vị và quan trọng nhất của mô hình thẩm thấu là khả năng minh họa sự xuất hiện của các điểm bùng phát theo bối cảnh (contextual tipping points). Khác với sự phát triển tuyến tính, tính chất mạng lưới sẽ thay đổi khi vượt qua một ngưỡng giới hạn:

- Nếu $p=0$, không thể có sự thẩm thấu, nếu $p=1$ dòng chảy sẽ di chuyển một cách dễ dàng.
- Nghiên cứu cho thấy ngưỡng bùng phát của hệ là $59,27\%$. Nghĩa là nếu xác suất thẩm thấu của các ô chỉ khoảng $58\%$, dòng chảy chắc chắn sẽ bị đứt đoạn và tắc nghẽn giữa đường. Nhưng chỉ cần tăng nhẹ xác suất lên $60\%$, hệ thống sẽ thay đồi hoàn toàn, và chắc chắn sẽ có dòng chảy xuyên suốt mạng lưới.

#### Ứng dụng

Dù xuất phát từ vật lý, đây là một mô hình vô cùng linh hoạt, có thể giải thích được các hệ thống phức hợp. Ví dụ như giải thích cháy rừng. Coi một cây là một ô vuông, xác suất thẩm thấu ở đây sẽ là số lượng cây trong một đơn vị diện tích nhất định, hay mật độ. Ngoài ra, có thể ứng dụng mô hình thẩm thấu vào các vấn đề như sự lan truyền thông tin (coi xác suất thẩm thấu là độ hấp dẫn của lời đồn), hay sự sụp đổ của hệ thống ngân hàng, sự bùng nổ đột phá của khoa học.

## Cellular Automata

Tự động hóa tế bào (Cellular Automata) là một mô hình toán học đơn giản nhưng tinh tế để nghiên cứu cách các hệ thống thích ứng phức tạp tạo ra trật tự từ những quy tắc vi mô. Mô hình này thường được mô phỏng trên một không gian một chiều, đơn giản nhất là một hàng ngang những ô vuông và vận hành như sau:

- Trạng thái nhị phân: Một ô vuông tại một thời điểm chỉ có thể ở một trong hai trạng thái: Bật (1) hoặc Tắt (0).
- Quy tắc tương tác cục bộ: Ở mỗi bước, trạng thái tiếp theo của một ô được tự động quyết định dựa trên trạng thái của chính ô đó và hai ô hàng xóm liền kề (trái và phải).
- Không gian quy tắc: Vì có 3 ô và mỗi ô có 2 trạng thái, nên có tổng cộng $2^3=8$ tình huống kết hợp. Để chỉ định kết quả cho 8 tình huống, ta có chính xác $2^8=256$ quy tắc khác biệt.

### Bốn lớp hành vi của Stephen Wolfram

Stephen Wolfram đã nghiên cứu và phân tích hệ thống 256 quy tắc này và phát hiện ra rằng mọi hành vi vĩ mô đều rơi vào 4 lớp cốt lõi:

- Cố định (Fixed): Hệ thống nhanh chóng tiến vào một trạng thái đồng nhất và độc nhất.
- Chu kỳ (Periodic): Hệ thống tạo ra các nhóm cấu trúc đơn giản, ổn định hoặc lặp đi lặp lại có tính chu kỳ.
- Hỗn loạn (Chaotic): Hệ thống sinh ra các mẫu hình dường như ngẫu nhiên và hỗn loạn, trong đó một thay đổi nhỏ có thể lan rộng ra toàn hệ thống.
- Phức tạp (Complex): Đây là lớp đặc biệt nhất, nơi hệ thống tạo ra các cấu trúc có trật tự nhưng liên tục tiến hóa với thời gian chuyển tiếp rất dài. Những quy tắc này được giả định có khả năng tính toán vạn năng.

### Ranh giới của sự hỗn loạn và Tham số $\lambda$

Khái niệm "Ranh giới của sự hỗn loạn" do Christopher Langton đề xuất cố gắng lý giải tại sao sự phức tạp lại xuất hiện. Ổng sử dụng tham số $\lambda$ để đo lường tỉ lệ các tình huống trong một bảng quy tắc dẫn đến trạng thái "Tắt":

- Nếu $\lambda$ gần 0 hoặc 1, hệ thống có xu hướng nhanh chóng "đóng băng" vào trạng thái tĩnh lặng (Lớp 1, Lớp 2).
- Nếu $\lambda$ tiến gần đến mức $\frac{1}{2}$, sự phụ thuộc lẫn nhau tăng lên, mỗi ô có xác suất bật tắt bằng nhau, khiến hỗn loạn (Lớp 3) chiếm ưu thế.
- Tính phức tạp (Lớp 4) thường xuất hiện ở những mức độ phụ thuộc trung bình, tức là điểm giao thoa giữa trật tự và hỗn loạn. Thực tế cho thấy, các quy tắc phức tạp có giá trị $\lambda \approx 0,46$.
