---
title: "Lý thuyết trò chơi: Chiến lược, hợp tác và cạnh tranh"
date: 2026-04-16
excerpt: Phân tích các tương tác chiến lược giữa những cá nhân có lý trí.
category: LEARNING
---
## Giới thiệu

Trong các hệ thống xã hội, con người hiếm khi đưa ra quyết định trong môi trường cô lập. Thay vào đó, chúng ta tương tác với nhau, nơi kết quả không phụ thuộc vào lựa chọn của chính mình mà còn phụ thuộc vào hành động của người khác. Lý thuyết trò chơi (Game Theory) cung cấp các mô hình toán học và logic để phân tích những tương tác chiến lược giữa các cá nhân có lý trí.

## Thế tiến thoái lưỡng nan của tù nhân (Prisoner's Dilemma)

Đây là mô hình nổi tiếng nhất trong lý thuyết trò chơi, minh họa sự mâu thuẫn giữa lợi ích cá nhân và lợi ích tập thể. Cấu trúc cơ bản của mô hình này gồm hai người chơi, mỗi người có 2 lựa chọn: **Hợp tác (Cooperate - $C$)** hoặc **Phản bội (Defect - $D$)**. Phần thưởng được sắp xếp theo thứ tự: **$T$ (Cám dỗ, khi một người phản bội mà người còn lại chọn hợp tác)** $>$ **$R$ (Phần thưởng khi cùng hợp tác)** $>$ **$P$ (Hình phạt khi cả hai cùng phản bội)** $>$ **$S$ (Người bị phản bội sẽ không nhận được gì)**.

Bởi vì $T>R$ và $P>S$, đối với cá nhân, việc chọn "Phản bội" sẽ luôn mang lại kết quả tốt dù đối phương chọn gì. Tuy nhiên, bi kịch nằm ở chỗ nếu cả hai theo đuổi lý trí cá nhân và chọn "Phản bội", họ sẽ nhận được $P$ vốn ít hơn kết quả $R$ nếu cả hai chọn "Hợp tác".

### Làm thế nào để tồn tại sự hợp tác?

Dù về mặt toán học, "Phản bội" luôn là lựa chọn tối ưu cho cá nhân, trong thực tế xã hội và sinh học, sự hợp tác vẫn tồn tại, dựa trên 5 cơ chế tiến hóa duy trì hợp tác đã được nghiên cứu:

1. **Chọn lọc dòng dõi (Kin Selection)**: Con người và động vật có xu hướng hợp tác với những cá thể có chung huyết thống. Sự hợp tác này xảy ra khi hệ số quan hệ di truyền $r$ lớn hơn tỷ lệ giữa chi phí $c$ và lợi ích $b$: $r>c/b$.
2. **Có qua có lại trực tiếp (Direct Reciprocity)**: Xảy ra trong các trò chơi lặp đi lặp lại. Các chiến lược như Tit-for-Tat (hợp tác ở bước đầu, sau đó bắt chước hành động trước đó của đối phương) hoặc Win-Stay, Lose-Shift (nếu đang được điểm cao thì giữ nguyên chiến lược, thay đổi khi bị điểm thấp) sẽ phát huy tác dụng trừng phạt kẻ "Phản bội" và thiết lập sự hợp tác lâu dài. Điều kiện là xác suất gặp lại nhau $w$ lớn hơn $c/b$.
3. **Có qua có lại gián tiếp (Indirect Reciprocity)**: Dựa trên danh tiếng (reputation) trong cộng đồng. Tôi giúp bạn không phải để bạn phải giúp lại tôi, mà vì hành động đó tạo cho tôi danh tiếng tốt, khiến người thứ ba sẽ giúp tôi sau này. Sự hợp tác này tiến hóa cùng với sự phát triển của ngôn ngữ và tin đồn.
4. **Chọn lọc qua mạng lưới không gian (Graph Selection/Network Reciprocity)**: Khi dân số không hòa trộn hoàn toàn mà tương tác qua các mạng lưới hoặc cụm không gian, những người hợp tác có thể tập hợp lại thành các nhóm nhỏ, hỗ trợ nhau và bảo vệ bản thân khỏi những kẻ phản bội.
5. **Chọn lọc nhóm (Group Selection)**: Dù trong một nhóm, cá nhân ích kỷ có thể thắng cá nhân hợp tác, nhưng nhóm gồm nhiều người hợp tác sẽ chiến thắng một nhóm gồm toàn kẻ ích kỷ.

## Trò chơi phối hợp (Coordination Games)

Trái ngược với Prisoner's Dilemma nơi cá nhân có động cơ để phản bội, **Trò chơi phối hợp** xảy ra khi các cá nhân nhận được lợi ích khi họ **lựa chọn cùng một hành động giống nhau**.

- **Phối hợp thuần túy (Pure Coordination)**: Ví dụ việc hai người gặp nhau trên phố và phải quyết định chào bằng cách "ôm" hoặc "cúi chào". Dù chọn hành động nào, miễn là họ hành động giống nhau, họ sẽ nhận lại lợi ích bằng 1, nếu khác nhau, lợi ích cả hai nhận lại bằng 0.
- **Cấu trúc đa cân bằng (Multiple Equilibria)**: Mô hình Săn hươu hay bài toán Maui-Des Moines minh họa rõ điều này. Nếu cả hai người đi nghỉ ở Maui, họ cùng nhận được 10 điểm; nếu họ đi Des Moines, họ nhận 1 điểm; đi ngược hướng nhau họ được 0 điểm. Trò chơi có hai điểm cân bằng ổn định. Tuy nhiên, nếu một người tin rằng người kia sẽ đi Des Moines (dù đây là phương án kém hơn), hành động tối ưu nhất là họ cũng nên đi Des Moines.

### Tác động văn hóa và Sự kém hiệu quả

Mô hình Phối hợp giải thích lý do tại sao các nền văn hóa lại hình thành những chuẩn mực khác biệt và duy trì tính nhất quán. Người phương Đông thích cúi chào, còn người phương Tây thích bắt tay - cả hai đều là những điểm cân bằng phối hợp địa phương. Đáng chú ý, trò chơi này giải thích hiện tượng **Phối hợp kém hiệu quả (Inefficient Coordination)**. Hãy tưởng tượng việc bắt tay làm lây lan dịch bệnh, khiến giá trị của việc bắt tay giảm xuống rất thấp. Dù mọi người biết việc cúi chào lúc này an toàn và tốt hơn, nhưng vì tất cả những người xung quanh vẫn đang bắt tay, một cá nhân không thể tự mình thay đổi hành động mà không đối mặt với phản ứng tiêu cực của xã hội hoặc sự lạc lõng. Do đó, xã hội có thể bị mắc kẹt ở một điểm cân bằng tồi.

## Colonel Blotto và Sự phân bổ nguồn lực

### Trò chơi Colonel Blotto

Mô hình này tập trung vào một bài toán cạnh tranh có tổng bằng 0 (zero-sum game): Hai người chơi có một nguồn lực (quân lính, ngân sách) giới hạn và phải phân bổ chúng qua nhiều "mặt trận" khác nhau. Người nào phân bổ nhiều nguồn lực tại tại một mặt trận sẽ giành chiến thắng tại mặt trận đó, và sẽ thắng cả trò chơi nếu thắng nhiều hơn một nửa số lượng mặt trận.

### Cạnh tranh sai lệch chiến lược (Strategic Mismatch)

Mục tiêu cốt lõi của trò chơi này không phải là mạnh hơn đối thủ trên mọi mặt trận, mà tạo ra **sự sai lệch chiến lược**: cố gắng thắng đối thủ với cách biệt nhỏ nhất ở nhiều mặt trận nhất có thể, và chấp nhận thua lớn ở vài mặt trận khác.

### Không có chiến lược hoàn hảo

Colonel Blotto chứng minh rằng trong nhiều bối cảnh, mọi chiến lược đều có thể bị đánh bại, hay **không tồn tại một chiến lược "vô địch tuyệt đối"**. Bất kỳ sự phân bổ nguồn lực nào cũng có thể bị đánh bại bởi một chiến lược phân bổ khác.

Ví dụ: Bạn có 10 quân, và 5 mặt trận được mở ra. Chiến lược phân bổ đều (2, 2, 2, 2, 2) của bạn sẽ bị đánh bại bởi chiến lược chỉ tập trung vào 3 mặt trận đầu và bỏ mặc 2 mặt trận còn lại (3, 3, 3, 1, 0). Một người chơi khác có thể đánh bại chiến lược trên với phân bổ (0, 4, 4, 2, 0).

Sự thiếu vắng tính chất bắc cầu trong trò chơi (A thắng B, B thắng C, nhưng C lại thắng A) giống như trò chơi Kéo-Búa-Bao. Điều này giúp chúng ta hiểu rằng, việc tìm ra người giỏi nhất trong các giải đấu thể thao hoặc trong kinh doanh đôi khi là vô nghĩa, vì kết quả phụ thuộc lớn vào đối thủ được bắt cặp để thi đấu cùng.

Thực tế, hai bên có thể có nguồn lực bất tương xứng, nghĩa là đối thủ của bạn có thể có nhiều nguồn lực hơn. Trong trường hợp này, việc tốt nhất bạn nên làm là cố gắng mở ra càng nhiều mặt trận nhất có thể. Vì vốn dĩ, bạn có thể chiến thắng cả trò chơi nếu bạn thắng phân nửa số lượng mặt trận. Đối thủ, bên có thể có thể không có đầy đủ thông tin về nguồn lực hoặc chiến lược của bạn, sẽ chọn phương pháp tối ưu là chia đều nguồn lực trên các mặt trận được mở ra.

### Ứng dụng

Ngoài được dùng để mô phỏng chiến tranh, Mô hình Colonel Blotto có thể được mở rộng ra các bối cảnh đa dạng hơn:

- **Chính trị (Politics)**: Các đảng phái chính trị phân bổ ngân sách, thời gian, hoặc cử người có danh tiếng đi tranh cử tại các khu vực bỏ phiếu.
- **Kinh doanh (Business)**: Hai công ty dược phẩm cạnh tranh bằng cách phân bổ ngân sách R&D và Marketing vào hai loại thuốc khác nhau để tranh giành bằng sáng chế.
- **Thể thao (Sports)**: Các đội bòng hay võ sĩ có ưu điểm/chiến thuật riêng. Một tay đấm bốc có thể bị hạ nốc ao bởi đối thủ A, nhưng có thể là khắc tinh của đối thủ B.
- **Hệ thống pháp luật (Law)**: Luật sư phân bổ thời gian/tiền bạc để mời nhân chứng chuyên gia đối đầu với các luận điểm trên nhiều mặt trận cáo buộc khác nhau tại tòa án.