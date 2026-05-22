---
title: Hệ thống thích ứng phức hợp. Phần 2
date: 2026-04-18
excerpt: Nghiên cứu cách các quy tắc đơn giản ở cấp độ vi mô tạo ra những hành vi phức tạp ở cấp độ vĩ mô.
category: LEARNING
---
## Giới thiệu

Tiếp nối [Bài 6](part-6), bài này sẽ nói về chức năng của các mô hình: Chuỗi Markrov, Mô hình phụ thuộc quỹ đạo và Hàm Lyapunov.

## Chuỗi Markrov

Chuỗi Markrov (hay Quá trình Markrov) là một mô hình phi tuyến tính dùng để mô thar cách các hệ thống chuyển đổi qua thời gian. Mô hình này giúp chúng ta thoát khỏi cạm bẫy của việc ngoại suy tuyến tính (linear extrapolation) - ví dụ như việc lầm tưởng xu hướng hiện tại tiến tới dân chủ, nên cuối cùng toàn bộ thế giới sẽ trở thành các quốc gia dân chủ.

### Cấu trúc

Một chuỗi Markrov được hình thành từ hai yếu tỗ tĩnh:

- Tập hợp hữu hạn các trạng thái: Ví dụ, một quốc gia có thể ở trạng thái "tự do", "bán tự do" hoặc "không tự do"; hoặc tâm trạng một người có thể "vui vẻ", "buồn bã", "chán nản".
- Các xác suất chuyển đổi: Đây là tỷ lệ cố định xác suất khả năng hệ thống di chuyển từ trạng thái này sang trạng thái khác. Ví dụ, một người đang vui hôm nay có 90% ngày mai vẫn vui và 10% ngày mai sẽ buồn.

Điểm đặc biệt của Chuỗi Markrov là trạng thái tương lại của hệ thống chỉ phụ thuộc vào trạng thái hiện tại, hoàn thoàn không bị ảnh hưởng bởi những gì xảy ra trước đó.

### Định lý Hội tụ Ergodic (The Ergodic Theorem)

Định lý này phát biểu rằng hệ thống sẽ chắc chắn hội tụ về một trạng thái cân bằng thống kê duy nhất nếu thỏa mãn 4 điều kiện:

1. Trạng thái của hệ thống thuộc một tập hợp hữu hạn các khả năng.
2. Xác suất chuyển đổi giữa các trạng thái là cố định và chỉ phụ thuộc vào trạng thái hiện tại.
3. Từ bất kỳ trạng thái nào, hệ thống đều có thể đi đến bất kỳ trạng thái khác (thông qua một chuỗi các bước chuyển đổi).
4. Hệ thống không tạo ra các chu kỳ tất định đơn giản (ví dụ không lặp lại bật - tắt - bật mãi mãi).

Kết quả của định lý này là: Trong dài hạn, hệ thống sẽ hội tụ về trạng thái tĩnh gọi là cân bằng về mặt thống kê, bất kể điều kiện ban đầu của hệ thông là gì hay những biến cố nào đã xảy ra trong quá trình hệ thống phát triển.

### Sự can thiệp và Tính phụ thuộc vào lịch sử

Từ mô hình Markrov, chúng ta rút ra được bài học về việc thay đổi một hệ thống:

- Can thiệp vào "Trạng thái" chỉ mang tính tạm thời: Sự nỗ lực kéo hệ thống ra khỏi trạng thái hiện tại chỉ đem đến một thay đổi ngắn hạn. Dưới tác động của xác suất chuyển đổi cố định, hệ thống cuối cùng sẽ bị kéo ngược về trạng thái cân bằng thống kê.
- Can thiệp vào "Xác suất chuyển đổi" mới tạo ra thay đổi cốt lõi: Để tạo ra sự thay đổi cơ bản và dài hạn, bắt buộc phải thay đổi cách hệ thống vận hành (tức là thay đổi xác suất chuyển đổi).
- Nếu một hệ thống hoạt động theo quy luật của Chuỗi Markrov, lịch sử của hệ thống không có ý nghĩa trong dài hạn. Do đó, nếu ta tin rằng lịch sử thực sự quan trong trong đời sống xã hội, ta phải chứng minh hệ thống đó đã vi phạm các giả định của Markrov - phổ biens nhất là việc xác suất chuyển đổi không hề cố định mà bị thay đổi bởi chính những sự kiện trong quá khứ.

## Sự phụ thuộc vào quỹ đạo (Path Dependence)

Sự phụ thuộc vào quỹ đạo xảy ra khi các trạng thái, hành động hoặc quyết định ở hiện tại và tương lai phụ thuộc vào kết quả của các sự kiện trong quá khứ. Tuy nhiên có nhiều cấp độ phụ thuộc khác nhau và nguồn gốc xảy ra của chúng.

### Phân loại

- Phụ thuộc kết quả (Outcome dependenc) vs. Phụ thuộc cân bằng (Equilibrium dependence): Phụ thuộc kết quả có nghĩa là những gì xảy ra ngay lúc này bị ảnh hưởng bởi quá khứ, nhưng trong dài hạn, hệ thống vẫn có thể hội tụ về một trạng thái cân bằng thống kê duy nhất, tức là lịch sự không định hình vĩnh viễn hệ thống. Trong khi đó, phụ thuộc cân bằng xảy ra khi chính phân phối dài hạn của các kết quả cũng bị thay đổi bởi quỹ đạo trong quá khữ, điều này đòi hỏi hệ thống bắt buộc phải có nhiều hơn một trạng thái cân bằng.
- Phụ thuộc Tập hợp (Phat dependence) vs. Phụ thuộc Quỹ đạo (Path dependence): Phat dependence xảy ra khi kết quả vĩ mô chỉ phụ thuộc vào tập hợp các biến cố xảy ra trong quá khứ mà không quan tâm đến thứ tự của chúng (ví dụ như quá trình Polya - lấy bóng ngẫu nhiên từ bình). Ngược lại Path dependence xảy ra khi thứ tự của các biến cố đó đóng vai trò quyết định. Khắt khe hơn là Phụ thuộc quỹ đạo manh (Strong path dependence), nơi bất kỳ hai lịch sử khác biệt nào cũng sẽ dẫn đến xác suất kết quả hoàn toàn khác nhau.
- Phụ thuộc giai đoạn đầu (Early path dependence) vs. Phụ thuộc gần đây (Recent path dependence): Phụ thuộc giai đoạn đầu xảy ra khi chỉ có những quyết định ở giai đoạn khởi thủy mới định hình toàn bộ tương lai (ví dụ như Hiệu ứng thác đổ thông tin - Infomation Cascades, hoặc nguyên tắc tiền tệ trong luật pháp). Ngược lại, phụ thuộc gần đây là khi kết quả hiện tại chịu ảnh hưởng chủ yếu bởi những sự kiện mới xảy ra trong quá khứ.

### Lợi suất tăng dần (Increasing Return)

Một lầm tưởng phổ biến trong giới học thuật là cho rằng sự phụ thuộc quỹ đạo luôn được sinh ra bởi "lợi suất tăng dần" hoặc "phản hồi tích cực" - tức là một lựa chọn càng được thực hiện nhiều thì lợi ích nó mang lại càng lớn. Tuy nhiên, các bằng chứng toán học chứng minh rằng lợi suất tăng dần không phải điều kiện cần, cũng không phải điều kiện đủ để tạo ra sự phụ thuộc vào quỹ đạo cân bằng. Lợi suất tăng dần (ngoại ứng tích cực - Positive Externalities) chỉ có vai trò phóng đại, tạo ra sự thiên lệch lớn hỗ trợ một lựa chọn, chứ không phải là nguyên nhân tự thân tạo ra sự phụ thuộc vào quỹ đạo.

### Ngoại ứng tiêu cực (Negative Externalities) và Các ràng buộc (Constraints)

Nguyên nhân mạnh mẽ dẫn đến sự phụ thuộc quỹ đạo chính là các ngoại ứng tiêu cực:

- Bản chất của ràng buộc: Các ngoại ứng tiêu cực thường xuất phát từ những ràng buộc về không gian, thời gian, ngân sách, quyền lực hoặc giới hạn nhận thức. Bất kỳ một dự án lớn, một công nghệ hay một quyết sách nào khi được triển khai đều chiếm dụng tài nguyên và loại bỏ cơ hội khác. Việc chọn làm A sẽ khiến việc làm B trở lên khó khăn hơn trong tương lai.
- Ví dụ: Bàn phím QWERTY được sử dụng nhiều. Người ta tin đây là kết quả của lợi suất tăng dần, càng nhiều người dùng thì nó càng có giá trị vì dễ kiếm thợ đánh máy. Tuy nhiên, nguyên nhân sâu xa tạo ra sự phụ thuộc là ngoại ứng tiêu cực liên cá nhân (interpersonal negative externalities). Khi càng nhiều người dùng bàn phím QWERTY, giá trị của việc học bàn phím khác trong cộng đồng sẽ giảm xuống. Chính các ngoại ứng tiêu cực áp đặt lên các lựa chọn thay thế này mới là thứ hình thành quỹ đạo.

### Sự tích lũy theo thời gian

Nếu quy mô hoặc số lượng của các ngoại ứng gắn liền với một quyết định không thay đổi theo thời gian, hệ thống sẽ chỉ đạt đến mức độ Phat dependence. Để tạo ra Path dependece đúng nghĩa, các ngoại ứng đó bắt buộc phải được tích lũy/suy giảm theo thời gian. Biểu hiện thực tế của sự tích lũy này là việc bồi đắp dần các cấu trúc nhận thức, thói quen, hành vi hoặc các thể chế bổ trợ xung quanh một lựa chọn ban đầu, khiến việc đảo ngược quyết định càng về sau càng bất khả thi.

## Hàm Lyapunov

Hàm lyapunov là một công cụ toán học giúp ta xác định chắc chắn liệu một hệ thống phức hợp có đi đến trạng thái cân bằng (equilibrium) hay không, thậm chí có thể tính được hệ thống sẽ mất bao lâu để tiến tới trạng thái cân bằng.

### Cơ chế hoạt động

Có 3 điều kiện để cấu thành hàm Lyapunov cho bất kỳ hệ thống nào:

1. Có một giới hạn tuyệt đối (Finiteness): Hệ thống phải có một nguồn tài nguyên/giá trị hữu hạn, nghĩa là tồn tại một mức sàn (tối thiểu) hoặc mức trần (tối đa).
2. Di chuyển theo một hướng (Directionality): Ở mỗi bước thời gian, nếu hệ thống chưa ở trạng thái cân bằng, giá trị của nó bắt buộc phải tiến gần về giới hạn (luôn giảm hoặc luôn tăng).
3. Mức thay đổi tối thiểu (Minimum Step): Mức tăng/giảm ở mỗi bước phải ít nhất bằng một hằng số $k>0$. Điều này giúp hệ thống tránh khỏi "Nghịch lý Zeno". Và bằng cách biết được khoảng cách đến giới hạn và mức độ thay đổi tối thiểu, ta có thể tính được số bước tối đa hệ thống cần để hội tụ.

### Hạn chế

Dù hàm Lyapunov khẳng định hệ thống sẽ hội tụ ở trạng thái cân bằng, nó vẫn có hai hạn chế đáng lưu ý:

- Cân bằng đạt được không nhất thiết là tối ưu: Hàm Lyapunov chỉ đảm bảo hệ thống sẽ dừng lại, chứ không có nghĩa là nó dừng ở trạng thái tốt nhất.
- Sự phá bĩnh của Ngoại ứng tiêu cực (Negative Externalities): Việc không tìm được hàm Lyapunov không có nghĩa là hệ thống không thể tiến tới trạng thái cân bằng, nhưng nó cho thấy hệ thống có thể liên tục dao động. Điều này thường xảy ra khi có các ngoại ứng tiêu cực.
