---
title: Công nghệ phần mềm
date: 2026-05-26
excerpt: Công nghệ phần mềm
category: LEARNING
---

## Khái niệm cơ bản

**Phần mềm (Software)** là sản phẩm của quá trình kỹ nghệ phát triển phần mềm, bao gồm ba thành phần chính:
- **Chương trình máy tính (Computer Program)**: Tập hợp các câu lệnh dưới dạng mã nguồn (source code) và mã máy.
- **Cấu trúc dữ liệu (Data Structure)**: Phương thức tổ chức dữ liệu cả bên ngoài (cơ sở dữ liệu) và bên trong bộ nhớ (RAM).
- **Tài liệu (Document)**: Hệ thống tài liệu kỹ thuật (phục vụ lập trình viên) và tài liệu hướng dẫn sử dụng (phục vụ người dùng).

### Vai trò của phần mềm

- **Sự phụ thuộc kinh tế**: Nền kinh tế của các quốc gia hiện đại phụ thuộc cực kỳ lớn vào phần mềm (từ khâu thu chi, quản trị cho đến các hoạt động giao thương; tổn thất kinh tế khi phần mềm gặp sự cố là vô cùng khổng lồ).
- **Tạo lợi thế cạnh tranh**: Phần mềm giúp tạo ra sự đột phá trong tổ chức, thay đổi phong cách làm việc và nâng cao vượt trội năng suất lao động.
- **Sự gắn kết đời sống**: Con người ngày càng phụ thuộc sâu sắc vào các ứng dụng phần mềm trong mọi hoạt động thường nhật.
- **Xu hướng số hóa**: Tin học hóa và tự động hóa toàn diện tất cả các lĩnh vực hoạt động trong đời sống xã hội.

### Đặc trưng của phần mềm

- **Không hao mòn vật lý nhưng thoái hóa theo thời gian**: Không chịu tác động cơ học như phần cứng, nhưng chất lượng phần mềm bị suy giảm do việc phát sinh lỗi mới trong quá trình sửa đổi và do sự thay đổi của môi trường vận hành.
- **Không lắp ghép đơn thuần từ linh kiện sẵn có**: Hầu hết phần mềm được thiết kế và may đo riêng theo yêu cầu nghiệp vụ thực tế, ít khi lắp ráp đơn giản từ các mẫu có sẵn.
- **Phức tạp, vô hình và khó hiểu**: Có độ phức tạp logic cực kỳ cao, vô hình và khó trực quan hóa hoàn toàn.
- **Luôn luôn biến động**: Cần liên tục thay đổi để sửa lỗi, cập nhật theo môi trường phần cứng/hệ điều hành mới hoặc đáp ứng các thay đổi về mặt nghiệp vụ.
- **Phát triển theo đội nhóm**: Đòi hỏi sự cộng tác, phối hợp chặt chẽ giữa các thành viên trong tập thể.

### Phân loại phần mềm

- **Phần mềm hệ thống**: Các hệ điều hành, driver thiết bị, chương trình dịch...
- **Phần mềm nghiệp vụ**: Các ứng dụng phục vụ trực tiếp công tác quản lý, kinh doanh (như hệ thống ERP, CRM, phần mềm kế toán...).
- **Phần mềm công cụ (CASE Tools)**: Các phần mềm hỗ trợ kỹ sư phát triển phần mềm (như IDE, Git, công cụ vẽ thiết kế UML...).

---

## Tiêu chí đánh giá một phần mềm tốt

Một phần mềm chất lượng cần đáp ứng tốt các kỳ vọng từ các bên liên quan khác nhau:

- **Với Chủ đầu tư (Client / Sponsor)**:
  - Quan tâm nhất đến **kinh phí đầu tư** hợp lý và **tiến độ phát triển** đúng cam kết.
  - Phần mềm phải đáp ứng đúng đặc tả yêu cầu ban đầu.
  - Đặc biệt coi trọng **tính dễ bảo trì (Maintainability)**: Đây là yếu tố sống còn quyết định chi phí mở rộng, nâng cấp sản phẩm trong tương lai. Nếu phần mềm khó bảo trì, chi phí vận hành sẽ tăng phi mã, gây lãng phí đầu tư nghiêm trọng.

- **Với Người dùng cuối (End-user)**:
  - Yêu cầu hàng đầu là **tính đầy đủ của chức năng** so với nghiệp vụ thực tế của họ.
  - Quan tâm sâu sắc đến **tính dễ sử dụng (Usability)** nhằm tối ưu hóa hiệu năng và giảm thiểu thời gian học cách vận hành.
  - Đòi hỏi hệ thống có **tính an toàn (Safety/Security)** và **tính tin cậy cao (Reliability)**.

- **Với Nhà phát triển (Developer)**:
  - Tiêu chí cốt lõi là **tính dễ bảo trì**: Giúp giảm thiểu thời gian, nhân lực khi tiến hành sửa lỗi hoặc nâng cấp sản phẩm, từ đó duy trì vị thế cạnh tranh và uy tín trên thị trường.

---

### Thách thức từ sự thay đổi phần mềm

- Việc thay đổi liên tục dẫn đến nhiều phần việc đã thực hiện bị bỏ đi hoặc phải làm lại từ đầu $\rightarrow$ kéo dài thời gian và đội chi phí phát triển.
- Chi phí bảo trì trong giai đoạn vận hành rất lớn (theo các thống kê thực tế, chi phí bảo trì thường gấp nhiều lần chi phí phát triển ban đầu).
- Các thay đổi chắp vá dễ dẫn đến phá vỡ kiến trúc gốc và phát sinh các lỗi hệ thống nghiêm trọng.

### Thành phần của một Hệ thống thông tin

Một hệ thống thông tin hoàn chỉnh được cấu thành từ 6 yếu tố:
1. **Phần cứng** (Hardware)
2. **Truyền thông mạng** (Networking Communication)
3. **Phần mềm** (Software)
4. **Dữ liệu** (Data)
5. **Đào tạo con người** (People & Training)
6. **Quy trình nghiệp vụ** (Business Process)

### Kỹ nghệ phần mềm (Software Engineering - SE)

**Kỹ nghệ phần mềm** là một ngành kỹ thuật liên quan đến mọi khía cạnh của quá trình sản xuất phần mềm, từ giai đoạn khởi đầu đặc tả hệ thống cho đến việc bảo trì hệ thống sau khi đưa vào sử dụng thực tế.

#### Vòng đời phát triển phần mềm (SDLC)
Một vòng đời cơ bản thường trải qua 4 giai đoạn chính:
1. **Xác định yêu cầu (Requirements)**
2. **Triển khai phát triển (Implementation)**
3. **Kiểm thử sản phẩm (Testing)**
4. **Vận hành và bảo trì (Operation & Maintenance)**

---

## Các mô hình phát triển phần mềm

### Khái niệm
Mô hình phát triển phần mềm đặc tả trực quan các hoạt động cốt lõi của tiến trình sản xuất phần mềm:
- **Đặc tả (Specification)**: Xác định tính năng hệ thống và các ràng buộc.
- **Thiết kế & Cài đặt (Design & Implementation)**: Xây dựng kiến trúc hệ thống và lập trình.
- **Kiểm định (Validation)**: Đảm bảo phần mềm đáp ứng đúng mong muốn của khách hàng.
- **Cải tiến (Evolution)**: Phát triển và thay đổi phần mềm để đáp ứng các nhu cầu mới.

### 1. Mô hình thác nước (Waterfall Model)

![Mô hình thác nước](public/software-engineering/1.png)

- **Đặc điểm**: Quá trình phát triển diễn ra tuần tự từ trên xuống dưới qua các pha rõ rệt. Việc quay lại pha trước đó bị hạn chế nghiêm trọng; bắt buộc phải hoàn thành pha hiện tại trước khi chuyển sang pha tiếp theo.
- **Ưu điểm**:
  - Cấu trúc rõ ràng, dễ hiểu, dễ quản lý.
  - Phù hợp với các dự án có yêu cầu rõ ràng, cố định ngay từ đầu.
  - Sản phẩm đầu ra có chất lượng tài liệu thiết kế cao, giúp dễ bảo trì trong tương lai.
- **Nhược điểm**:
  - Thiếu linh hoạt khi khách hàng thay đổi yêu cầu giữa chừng.
  - Bàn giao sản phẩm muộn (chỉ có phiên bản chạy được ở cuối chu kỳ).
  - Chi phí khắc phục sai sót ở giai đoạn muộn là cực kỳ lớn.
- **Cải tiến**: Cho phép thực hiện các phản hồi ngược (feedback loops) linh hoạt hơn giữa các pha kế cận.

### 2. Phát triển tiến hóa (Evolutionary Development)

![Phát triển tiến hóa](public/software-engineering/2.png)

- **Đặc điểm**:
  - **Phát triển thăm dò (Exploratory Development)**: Bắt đầu từ những yêu cầu cơ bản đã biết, sau đó liên tục bổ sung tính năng dựa trên phản hồi của khách hàng.
  - **Xây dựng bản mẫu (Prototyping)**: Tập trung làm rõ các yêu cầu chưa rõ ràng của khách hàng.
- **Hạn chế**:
  - Tiến trình phát triển thiếu tính trực quan, khó theo dõi tiến độ.
  - Cấu trúc hệ thống dễ bị chắp vá và thoái hóa nhanh chóng.
  - Đòi hỏi kỹ sư có năng lực đặc tả tốt.

### 3. Phát triển tăng trưởng (Incremental Development)

![Phát triển tăng trưởng](public/software-engineering/3.png)

- **Đặc điểm**: Chia nhỏ hệ thống thành các phần tăng trưởng để phát triển và bàn giao dần.
- **Ưu điểm**:
  - Khách hàng có sản phẩm thực tế để sử dụng và đánh giá rất sớm.
  - Các phiên bản bàn giao sớm đóng vai trò là bản mẫu thực tế định hình yêu cầu tiếp theo.
  - Các yêu cầu cốt lõi (ưu tiên cao) được đưa vào các phần tăng trưởng đầu tiên nên sẽ được kiểm thử nhiều lần nhất.

### 4. Mô hình xoắn ốc (Spiral Model)

![Mô hình xoắn ốc](public/software-engineering/4.png)

- **Đặc điểm**: Tiến trình phát triển được biểu diễn bằng các vòng lặp xoắn ốc (mỗi vòng lặp gồm các hoạt động: xác định mục tiêu, đánh giá rủi ro, phát triển/kiểm thử, lập kế hoạch vòng tiếp theo).
- **Ưu điểm**:
  - Kết hợp linh hoạt giữa việc kiểm soát sự thay đổi và chấp nhận thay đổi.
  - Phân tích và quản lý rủi ro (risk analysis) chặt chẽ ở mỗi chu kỳ lặp.

---

## Quy trình RUP (Rational Unified Process)

RUP là quy trình phát triển phần mềm hướng đối tượng dựa trên cấu trúc ca sử dụng (use-case driven) và tập trung vào kiến trúc lặp.

### 4 Pha phát triển chính:
- **Inception (Khởi đầu)**: Định vị phạm vi dự án và ước tính chi phí.
- **Elaboration (Chi tiết)**: Thiết lập kế hoạch chi tiết, đặc tả kiến trúc cơ bản của hệ thống.
- **Construction (Xây dựng)**: Tiến hành lập trình, tích hợp các thành phần hệ thống.
- **Transition (Chuyển giao)**: Bàn giao sản phẩm hoàn chỉnh cho người dùng cuối (kiểm thử nghiệm thu, đào tạo).

### 6 Nguyên tắc cốt lõi của RUP:
1. **Phát triển lặp đi lặp lại**: Lập kế hoạch các chu kỳ lặp dựa trên độ ưu tiên của yêu cầu.
2. **Quản lý yêu cầu**: Lưu vết và đánh giá kỹ lưỡng tác động trước khi chấp nhận thay đổi yêu cầu.
3. **Kiến trúc dựa trên thành phần**: Tổ chức hệ thống thành các module/thành phần độc lập, dễ lắp ghép.
4. **Mô hình hóa trực quan**: Sử dụng ngôn ngữ UML để mô tả đầy đủ cấu trúc và hành vi hệ thống.
5. **Kiểm chứng chất lượng**: Đảm bảo sản phẩm đạt đầy đủ các tiêu chuẩn chất lượng cam kết.
6. **Kiểm soát sự thay đổi**: Áp dụng quy trình và công cụ quản lý cấu hình hệ thống chặt chẽ.

---

## Phương pháp Agile & Khung làm việc Scrum

### Tổng quan về Agile
**Agile** là một triết lý phát triển phần mềm linh hoạt. Các quy trình như **Scrum** hay **XP** được xây dựng dựa trên nền tảng triết lý này.

- **Đặc trưng**:
  - Các hoạt động đặc tả, thiết kế, cài đặt được thực hiện xen kẽ và lặp lại liên tục.
  - Tối giản hóa tài liệu thiết kế; khuyến khích phát sinh tự động bằng công cụ.
  - Yêu cầu được mô tả ngắn gọn dưới dạng câu chuyện người dùng (User Stories).
  - Khách hàng tham gia trực tiếp vào quá trình phát triển và đánh giá từng phiên bản.
- **4 Tuyên ngôn cốt lõi (Agile Manifesto)**:
  1. **Cá nhân và sự tương tác** quan trọng hơn quy trình và công cụ.
  2. **Phần mềm chạy tốt** quan trọng hơn tài liệu đầy đủ.
  3. **Cộng tác với khách hàng** quan trọng hơn thương lượng hợp đồng.
  4. **Phản hồi với sự thay đổi** quan trọng hơn việc bám sát kế hoạch.

### Khung làm việc Scrum

![Quy trình Scrum](public/software-engineering/5.png)

- **Các vai trò chính**:
  - **Product Owner (PO)**: Người định hình yêu cầu, quản lý danh sách tính năng và ưu tiên công việc.
  - **Scrum Master (SM)**: Người hướng dẫn quy trình Scrum và hỗ trợ đội ngũ giải quyết các vướng mắc.
  - **Development Team**: Đội ngũ phát triển liên chức năng, tự quản lý công việc.

- **Quy trình vận hành**:
  1. PO tạo và sắp xếp độ ưu tiên cho **Product Backlog** (danh sách yêu cầu sản phẩm).
  2. SM và Team chọn các yêu cầu từ Product Backlog đưa vào chu kỳ phát triển (**Sprint Backlog**), chia nhỏ thành các task.
  3. **Daily Scrum (Họp hằng ngày)**: Các thành viên trả lời ngắn gọn:
     - Hôm qua tôi đã làm gì?
     - Hôm nay tôi sẽ làm gì?
     - Tôi đang gặp khó khăn gì?
  4. **Sprint Review**: Trình bày phần tăng trưởng sản phẩm hoàn thiện sau Sprint.
  5. **Sprint Retrospective (Họp cải tiến)**: Đánh giá lại quy trình làm việc để cải tiến cho Sprint tiếp theo.

- **Đánh giá và ước lượng độ phức tạp**:
  - **User Story Point**: Điểm số biểu thị độ phức tạp của tính năng (không phản ánh trực tiếp thời gian thực hiện, nhưng thường được quy đổi tương đối để lập kế hoạch).
  - **Phương pháp Planning Poker**:
    1. **Chuẩn bị**: Mỗi thành viên có bộ thẻ đánh số theo dãy Fibonacci (1, 2, 3, 5, 8, 13...). SM điều phối.
    2. **Giải thích**: PO giải thích chi tiết User Story và giải đáp thắc mắc.
    3. **Ước lượng**: Các thành viên chọn thẻ điểm tương ứng và úp xuống. Sau khi tất cả đã chọn, cùng lúc lật thẻ lên.
    4. **Thảo luận**: Nếu điểm số khác biệt lớn, các thành viên chọn điểm cao nhất và thấp nhất sẽ trình bày lập luận của mình.
    5. **Ước lượng lại & Đồng thuận**: Cả nhóm thảo luận và chọn lại thẻ điểm để đạt được con số thống nhất chung.

---

## Quản lý yêu cầu phần mềm (Requirements Engineering)

### Khái niệm
**Yêu cầu phần mềm** là mô tả về các dịch vụ/tính năng hệ thống cung cấp và các ràng buộc đi kèm. Đây là cơ sở pháp lý để lập hợp đồng và đấu thầu dự án.

### Phân loại yêu cầu
- **Yêu cầu chức năng (Functional)**: Mô tả những gì hệ thống phải làm (hoặc không được làm) khi nhận các đầu vào cụ thể.
- **Yêu cầu phi chức năng (Non-Functional)**: Các ràng buộc về mặt vận hành (như bảo mật, hiệu năng, độ tin cậy...). Yêu cầu phi chức năng cần đảm bảo: **Tính chính xác**, **Tính đầy đủ & Nhất quán**, và **Tính đo lường được**.
- **Yêu cầu miền (Domain)**: Các yêu cầu đặc thù bắt nguồn từ lĩnh vực nghiệp vụ của hệ thống (ví dụ: công thức tính lãi suất ngân hàng).

### Tài liệu yêu cầu phần mềm
- **Tài liệu yêu cầu** (thường theo chuẩn IEEE 830) tổng hợp các phát biểu yêu cầu một cách chính xác, đầy đủ, thể hiện sự đồng thuận giữa các bên.
- Phân biệt rõ giữa **Yêu cầu người dùng (User Requirements)** (dễ hiểu đối với khách hàng) và **Yêu cầu hệ thống (System Requirements)** (chi tiết kỹ thuật cho lập trình viên).
- **Lưu ý**: Tài liệu yêu cầu tập trung làm rõ **hệ thống làm cái gì (What)** trong miền vấn đề. Tài liệu thiết kế mô tả **hệ thống làm như thế nào (How)** bằng giải pháp kỹ thuật cụ thể.

### Các dạng biểu diễn yêu cầu
1. **Ngôn ngữ tự nhiên**: Dễ dùng nhưng dễ gây hiểu lầm do tính đa nghĩa.
2. **Ngôn ngữ tự nhiên có cấu trúc**: Sử dụng các biểu mẫu, bảng biểu, sơ đồ UML.
3. **Đặc tả hình thức**: Sử dụng các công thức toán học và logic hình thức $\rightarrow$ đạt độ chính xác tối đa nhưng khó viết và khó đọc.

### Quy trình kỹ nghệ yêu cầu

![Quy trình kỹ nghệ yêu cầu](public/software-engineering/6.png)

![Chi tiết quy trình yêu cầu](public/software-engineering/7.png)

- **Các kỹ thuật thu thập yêu cầu phổ biến**:
  - **Phỏng vấn (Interviewing)**: Đặt câu hỏi trực tiếp cho người dùng nghiệp vụ để hiểu quy trình hiện tại và mong muốn.
  - **Xây dựng kịch bản (Scenarios)**: Mô tả các luồng tương tác thực tế giữa người dùng và hệ thống qua các tình huống cụ thể.
  - **Nghiên cứu nhân học (Ethnography)**: Nhà phân tích trực tiếp quan sát cách con người thực hiện công việc hằng ngày trong môi trường thực tế của họ.

---

## Mô hình hóa phần mềm (Software Modeling)

Mô hình hóa giúp đơn giản hóa hệ thống bằng cách tập trung vào các thuộc tính và tương tác cốt lõi của bài toán.

> **System As-Is** (Hệ thống hiện tại) $\rightarrow$ **System To-Be** (Hệ thống mong muốn phát triển)

### 4 Nguyên lý mô hình hóa:
1. Mô hình lựa chọn ảnh hưởng trực tiếp đến cách thức giải quyết vấn đề.
2. Mọi mô hình đều có thể được biểu diễn ở các mức độ chi tiết khác nhau.
3. Mô hình tốt nhất là mô hình gắn kết chặt chẽ với thực tế.
4. Một mô hình đơn lẻ không bao giờ là đủ; cần kết hợp nhiều góc nhìn để hiểu trọn vẹn hệ thống.

### Khung nhìn UML (Unified Modeling Language)
UML thường được biểu diễn qua **4 khung nhìn cốt lõi (4+1 View Model)**:
- **Logical View**: Cấu trúc logic của hệ thống (lớp, đối tượng).
- **Process View**: Luồng xử lý động, sự tương tác và đồng bộ giữa các tiến trình.
- **Development View**: Cách tổ chức mã nguồn và các module phần mềm.
- **Physical/Deployment View**: Cách phân bổ phần mềm lên cấu trúc phần cứng vật lý.
- **Use Case View** (+1): Đóng vai trò kết nối các khung nhìn trên thông qua các ca sử dụng thực tế.

### Mô hình ngữ cảnh và quy trình
- **Mô hình ngữ cảnh (Context Model)**: Thể hiện ranh giới hệ thống và mối quan hệ tương tác giữa hệ thống với các tác nhân/hệ thống bên ngoài.
- **Mô hình quy trình (Process Model)**: Bổ trợ cho mô hình ngữ cảnh, mô tả chi tiết các bước xử lý nghiệp vụ bên trong.

### Biểu đồ hoạt động (Activity Diagram)

Biểu đồ hoạt động mô tả luồng công việc (workflow) của hệ thống.

![Ví dụ biểu đồ hoạt động](public/software-engineering/8.png)

- **Action (Hành động)** (1): Biểu diễn một tác vụ được thực hiện bởi người dùng hoặc hệ thống.
- **Connectors (Đường liên kết)** (2): Kết nối chuỗi hoạt động tuần tự.
- **Decision Node (Nút quyết định)** (3): Nhánh rẽ dựa trên điều kiện kiểm tra.
- **Guards (Điều kiện bảo vệ)** (4): Điều kiện ràng buộc để quyết định luồng đi tiếp theo.
- **Merge Node (Nút hợp nhất)** (5): Gom các nhánh rẽ phụ trở lại luồng hoạt động chính.
- **Initial Node (Nút khởi đầu)** (6): Điểm xuất phát của luồng hoạt động.
- **Activity Final Node (Nút kết thúc)** (7): Điểm kết thúc luồng hoạt động.

![Tính năng nâng cao trong biểu đồ hoạt động](public/software-engineering/9.png)

- **Fork Node** (1): Chia luồng điều khiển thành hai hay nhiều luồng chạy song song. Khi hành động trước Fork Node kết thúc, tất cả các luồng đầu ra của nó đều được kích hoạt đồng thời.
- **Join Node** (2): Hợp nhất các luồng chạy song song. Hành động phía sau Join Node chỉ được bắt đầu khi tất cả các luồng đầu vào dẫn đến Join Node đã hoàn thành.
- **Send Signal Action** (3) & **Accept Event Action** (4): Biểu thị hoạt động gửi và nhận tín hiệu hoặc thông điệp từ các tiến trình bên ngoài hệ thống.

### Đặc tả ca sử dụng (Use Case Specification)
Một tài liệu đặc tả ca sử dụng chuẩn bao gồm:
- **Tên ca sử dụng (Use Case Name)**
- **Mô tả ngắn gọn (Description)**
- **Tác nhân kích hoạt (Actors)**
- **Luồng sự kiện (Flow of Events)**: Gồm luồng cơ bản (Basic Flow) và các luồng thay thế/ngoại lệ (Alternative/Exception Flows).
- **Tiền điều kiện (Pre-conditions)**
- **Hậu điều kiện (Post-conditions)**

---

## Kiến trúc phần mềm & Nguyên lý thiết kế

**Kiến trúc phần mềm** là bản thiết kế tổng thể cho việc xây dựng và tiến hóa hệ thống phần mềm, bao gồm các quyết định về: **Cấu trúc** (tổ chức các thành phần), **Hành vi** (cách các thành phần tương tác động), và **Tương tác** (giao thức truyền thông dữ liệu).

### Khung nhìn cấu trúc:
- **Mô-đun (Module View)**: Cách phân chia code thành các gói, thư viện.
- **Thành phần & Kết nối (Component-Connector View)**: Cách các thành phần chạy động tương tác với nhau.
- **Phân phối (Allocation View)**: Cách phần mềm được cài đặt lên hạ tầng máy chủ vật lý.

### Nguyên lý thiết kế hệ thống (SOLID Principles)

SOLID là 5 nguyên lý thiết kế cơ bản trong lập trình hướng đối tượng giúp hệ thống linh hoạt và dễ bảo trì:

#### 1. Single Responsibility Principle (SRP) - Nguyên lý đơn trách nhiệm
- **Nguyên tắc**: Mỗi lớp chỉ nên đảm nhận một nhiệm vụ duy nhất, đồng nghĩa với việc lớp đó chỉ có một lý do duy nhất để thay đổi.
- **Lợi ích**: Giảm sự phụ thuộc chéo (coupling), giúp code dễ đọc, dễ kiểm thử và dễ bảo trì hơn.

#### 2. Open/Closed Principle (OCP) - Nguyên lý Mở/Đóng
- **Nguyên tắc**: Các thực thể phần mềm (lớp, module, hàm...) nên được thiết kế mở cho việc mở rộng (extension) nhưng đóng đối với việc sửa đổi (modification).
- **Lợi ích**: Giúp dễ dàng thêm tính năng mới bằng cách viết code mới thay vì sửa đổi mã nguồn cũ, tránh phát sinh lỗi không mong muốn.

#### 3. Liskov Substitution Principle (LSP) - Nguyên lý thay thế Liskov
- **Nguyên tắc**: Các đối tượng thuộc lớp con phải có khả năng thay thế hoàn toàn các đối tượng thuộc lớp cha mà không làm thay đổi tính đúng đắn của chương trình.
- **Lợi ích**: Đảm bảo tính kế thừa được sử dụng một cách chính xác và không phá vỡ logic nghiệp vụ của hệ thống.

#### 4. Interface Segregation Principle (ISP) - Nguyên lý phân tách Interface
- **Nguyên tắc**: Không nên ép buộc một lớp phải triển khai các phương thức của một interface mà nó không sử dụng. Nên chia nhỏ các interface lớn thành nhiều interface nhỏ, chuyên biệt.
- **Lợi ích**: Tránh việc các lớp bị phụ thuộc vào các phương thức dư thừa, tăng tính độc lập giữa các thành phần.

#### 5. Dependency Inversion Principle (DIP) - Nguyên lý đảo ngược phụ thuộc
- **Nguyên tắc**:
  - Các module cấp cao không nên phụ thuộc trực tiếp vào các module cấp thấp. Cả hai nên phụ thuộc vào các lớp trừu tượng (abstraction).
  - Các lớp trừu tượng không nên phụ thuộc vào chi tiết cài đặt, mà chi tiết cài đặt phải phụ thuộc vào các lớp trừu tượng.
- **Lợi ích**: Giảm sự liên kết cứng giữa các tầng nghiệp vụ, giúp dễ dàng thay thế hoặc cắm/rút các thành phần.

---

## Thiết kế giao diện (UI/UX) và Thiết kế chi tiết

### Thiết kế giao diện
- **Đầu vào**: Tài liệu yêu cầu, kịch bản tương tác, log phản hồi hệ thống.
- **Đầu ra**: Kịch bản tương tác chi tiết, sơ đồ bố trí giao diện (wireframe/mockup). *(Lưu ý: Thiết kế tốt cần hạn chế tối đa các thao tác thừa của người dùng và tránh việc mở quá nhiều cửa sổ con không cần thiết).*
- **Nguyên tắc thiết kế**:
  - Thân thiện và hướng đến người dùng.
  - Nhất quán về mặt hiển thị và trải nghiệm.
  - Tránh gây bất ngờ hoặc bối rối cho người dùng trong quá trình thao tác.
  - Hỗ trợ tính năng phục hồi khi người dùng thao tác sai (Undo/Redo).

### Thiết kế chi tiết
Thiết kế chi tiết cụ thể hóa các quyết định kiến trúc thành giải pháp kỹ thuật trước khi lập trình. Gồm hai phần chính:
1. **Thiết kế xử lý (Process Design)**: Dựa trên việc phân tích và làm mịn biểu đồ luồng dữ liệu (DFD) đến mức chi tiết nhất có thể cài đặt được bằng mã nguồn.
2. **Thiết kế dữ liệu (Data Design)**:
   - Liệt kê chính xác hóa và lựa chọn thông tin cơ sở.
   - Xác định các thực thể và xác định thuộc tính định danh (khóa chính).
   - Thiết lập mối quan hệ giữa các thực thể (Entity-Relationship).
   - Vẽ biểu đồ dữ liệu (ERD) và thực hiện quá trình chuẩn hóa (Normalization) để loại bỏ trùng lặp dữ liệu.

---

## Kiểm thử phần mềm (Software Testing)

Một hoạt động then chốt trong kiểm thử là **V&V (Verification & Validation)**. Quá trình kiểm chứng (Verification) thường được thực hiện trước quá trình thẩm định (Validation).

### Phân biệt Verification và Validation

| Tiêu chí | Verification (Kiểm chứng) | Validation (Thẩm định) |
| :--- | :--- | :--- |
| **Câu hỏi cốt lõi** | *"Are we building the product right?"* (Chúng ta có đang xây dựng sản phẩm đúng cách?) | *"Are we building the right product?"* (Chúng ta có đang xây dựng đúng sản phẩm khách hàng cần?) |
| **Đầu vào (Input)** | Bản thiết kế hệ thống ($D$), mã nguồn cài đặt ($I$). | Tài liệu đặc tả yêu cầu phần mềm ($SRS$), mã nguồn cài đặt ($I$). |
| **Đầu ra (Output)** | Xác định xem mã nguồn cài đặt $I$ có tuân thủ đúng theo bản thiết kế $D$ hay không. | Xác định xem mã nguồn cài đặt $I$ có đáp ứng đúng các mong muốn trong đặc tả $SRS$ của khách hàng hay không. |
| **Mục tiêu chính** | Phát hiện các lỗi lập trình (coding bugs) so với bản thiết kế. | Phát hiện các lỗi phân tích thiết kế (design/requirements mismatches) so với yêu cầu thực tế. |

### V&V Tĩnh vs. V&V Động
- **V&V Tĩnh (Static V&V)**:
  - Tiến hành duyệt qua tài liệu yêu cầu, bản thiết kế, mã nguồn (Code Review/Static Analysis).
  - Không thực thi/chạy chương trình.
  - Có thể tiến hành sớm ở mọi giai đoạn của vòng đời phát triển phần mềm.
  - Nhược điểm: Khó đánh giá chính xác hiệu năng và các thuộc tính phi chức năng trong môi trường chạy thực tế.
- **V&V Động (Dynamic V&V - Kiểm thử chạy chương trình)**:
  - Bắt buộc phải chạy chương trình với các ca kiểm thử (Test Cases) cụ thể.
  - Là phương pháp duy nhất để kiểm tra các yêu cầu phi chức năng (tính tin cậy, thời gian phản hồi, khả năng chịu tải...).

---

### Chất lượng phần mềm (Software Quality)

- **Định nghĩa**: Chất lượng phần mềm là mức độ thỏa mãn của sản phẩm so với các đặc tả yêu cầu đã cam kết, hay còn được hiểu là "độ tốt, độ tuyệt hảo" của sản phẩm trong quá trình vận hành thực tế.
- **Các yếu tố cấu thành chất lượng phần mềm**:
  - **Tính đúng đắn (Correctness)**: Hoạt động đúng theo tài liệu đặc tả.
  - **Tính hiệu quả (Efficiency)**: Tối ưu hóa việc sử dụng tài nguyên phần cứng (RAM, CPU...).
  - **Độ tin cậy (Reliability)**: Hoạt động ổn định, không xảy ra sự cố đột ngột. *(Lưu ý: Độ tin cậy là một thước đo cực kỳ quan trọng nhưng chỉ là một trong các yếu tố cấu thành nên chất lượng tổng thể).*
  - **Khả năng kiểm thử (Testability)**: Cấu trúc code rõ ràng, dễ dàng viết các test case.
  - **Dễ học, dễ sử dụng (Usability)**: Giao diện thân thiện, tài liệu hướng dẫn rõ ràng.
  - **Dễ bảo trì (Maintainability)**: Dễ sửa lỗi và nâng cấp mà không phá vỡ các phần khác.

---

### Các chiến lược kiểm thử: Kiểm thử hộp trắng vs. Kiểm thử hộp đen

![Quy trình kiểm thử tổng quan](public/software-engineering/10.png)

![Kiểm thử hộp trắng](public/software-engineering/11.png)

![Kiểm thử hộp đen](public/software-engineering/12.png)

![Bảng so sánh hộp trắng và hộp đen](public/software-engineering/13.png)

#### 1. Kiểm thử hộp trắng (White-box Testing)
- **Đặc điểm**: Kiểm thử viên biết rõ cấu trúc mã nguồn bên trong của phần mềm.
- **Hạn chế**:
  - Đôi khi số lượng đường đi thực thi trong mã nguồn là vô hạn (ví dụ: vòng lặp không xác định).
  - Chỉ kiểm thử những gì đã được lập trình thực tế; không thể phát hiện những chức năng bị bỏ quên hoặc chưa được làm so với đặc tả yêu cầu ban đầu.
  - Việc thiết kế và sinh các ca kiểm thử (test cases) đòi hỏi trình độ lập trình cao và tốn nhiều thời gian hơn so với hộp đen.
- **Ứng dụng**: Thường được sử dụng chủ yếu trong **Kiểm thử đơn vị (Unit Testing)**.

#### 2. Kiểm thử hộp đen (Black-box Testing)
- **Đặc điểm**: Kiểm thử viên không biết cấu trúc code bên trong, chỉ quan tâm đến đầu vào (inputs) và đầu ra (outputs) của hệ thống dựa trên tài liệu yêu cầu.
- **Hạn chế**:
  - Số lượng ca kiểm thử có thể bùng nổ cực kỳ lớn khi tổ hợp tất cả các giá trị đầu vào có thể xảy ra.
  - Khó phát hiện các lỗi logic ẩn sâu bên trong cấu trúc code nếu đầu vào không chạm tới.
- **Ứng dụng**: Thích hợp cho tất cả các cấp độ kiểm thử bao gồm: **Kiểm thử đơn vị (Unit Testing)**, **Kiểm thử tích hợp (Integration Testing)**, **Kiểm thử hệ thống (System Testing)**, và **Kiểm thử chấp nhận (Acceptance Testing)**.

---

### Các kỹ thuật thiết kế ca kiểm thử hộp đen

#### 1. Phân tích giá trị biên (Boundary Value Analysis)

- **Mục đích**:
  - Phát hiện lỗi xảy ra tại vùng ranh giới (biên) của các tập giá trị đầu vào - nơi có xác suất lập trình viên viết sai cao nhất (ví dụ dùng sai dấu `<`, `<=`, `>`, `>=`).
  - Đảm bảo hệ thống xử lý chính xác ở mọi điểm nhạy cảm này.
- **Nguyên tắc cơ bản**:
  - Lựa chọn các giá trị kiểm thử ngay tại biên, sát trên biên và sát dưới biên.
  - *Ví dụ*: Nếu biến đầu vào $x$ có khoảng giá trị hợp lệ là $[a, b]$, các giá trị biên cần chọn để kiểm thử là: $a$, $a-1$, $a+1$, và $b$, $b-1$, $b+1$.

- **Các bước thực hiện**:
  1. **Xác định biên của phạm vi đầu vào**: Xác định giới hạn nhỏ nhất ($min$) và lớn nhất ($max$) mà biến có thể nhận.
  2. **Chọn giá trị kiểm thử**:
     - *Ví dụ*: Với khoảng giá trị hợp lệ từ $1$ đến $10$:
       - Giá trị tại biên: $1$ và $10$.
       - Giá trị ngay dưới biên (bên ngoài/sát biên): $0$ và $9$.
       - Giá trị ngay trên biên (bên ngoài/sát biên): $2$ và $11$.
  3. **Thiết kế ca kiểm thử**: Tạo các kịch bản kiểm thử cho cả giá trị hợp lệ ($1, 2, 9, 10$) và không hợp lệ ($0, 11$).

---

#### 2. Phân lớp tương đương (Equivalence Partitioning)

Phân lớp tương đương chia tập hợp các đầu vào thành các lớp dữ liệu mà hệ thống sẽ xử lý theo cách tương tự nhau. Việc kiểm thử trên một giá trị đại diện cho mỗi lớp được coi là đủ để đánh giá cho toàn bộ lớp đó.

##### A. Phân lớp tương đương yếu (Weak Equivalence Class Testing)
- **Định nghĩa**: Chỉ tập trung kiểm thử các lớp dữ liệu hợp lệ (valid classes) đại diện cho hệ thống mà không xem xét sâu các lớp dữ liệu không hợp lệ.
- **Ví dụ**: Hệ thống yêu cầu nhập số tuổi trong khoảng $[18, 65]$.
  - Lớp hợp lệ: $[18, 65]$.
  - Ca kiểm thử yếu: Chọn một giá trị bất kỳ trong khoảng hợp lệ, ví dụ: $30$.

##### B. Phân lớp tương đương mạnh (Strong Equivalence Class Testing)
- **Định nghĩa**: Kiểm thử bao phủ toàn diện cả các lớp dữ liệu hợp lệ và không hợp lệ (invalid classes). Kỹ thuật này đảm bảo hệ thống không chỉ xử lý đúng dữ liệu hợp lệ mà còn phản hồi hợp lý (báo lỗi, ngăn chặn) trước dữ liệu không hợp lệ.
- **Ví dụ**: Hệ thống yêu cầu nhập số tuổi trong khoảng $[18, 65]$.
  - Lớp hợp lệ: $[18, 65]$.
  - Lớp không hợp lệ 1 (nhỏ hơn 18): $x < 18$.
  - Lớp không hợp lệ 2 (lớn hơn 65): $x > 65$.
  - Ca kiểm thử mạnh cần chọn:
    - Giá trị hợp lệ: $30$.
    - Giá trị không hợp lệ nhỏ hơn biên dưới: $17$.
    - Giá trị không hợp lệ lớn hơn biên trên: $66$.

##### Lợi ích của phân lớp tương đương:
- **Tối ưu hóa số lượng ca kiểm thử**: Tránh việc kiểm thử trùng lặp các giá trị có cùng bản chất xử lý.
- **Tăng hiệu quả phát hiện lỗi**: Tập trung vào các lớp hành vi khác nhau của hệ thống.
- **Bao phủ toàn diện**: Đảm bảo cả luồng xử lý thành công (hợp lệ) và luồng xử lý lỗi (không hợp lệ) đều được kiểm tra kỹ càng.