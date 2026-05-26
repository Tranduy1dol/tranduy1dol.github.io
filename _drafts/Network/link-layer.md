---
title: Tầng liên kết dữ liệu (Link Layer)
date: 2026-05-26
excerpt: Tìm hiểu về tầng liên kết dữ liệu (Link Layer) và các giao thức đa truy nhập.
category: LEARNING
---

## Tổng quan

- Các thiết bị chạy tầng này gọi là node
    - Node bao gồm host, router, switch, WAP
- Đường nối trực tiếp giữa 2 node gọi là link
- Đơn vị vận chuyển trong tầng này là link-layer frame

### Các service cung cấp bởi link layer

- Framing: Gói datagram từ network layer vào frame trước khi chuyển đi
- Link access: Sử dụng giao thức MAC (medium access control) để chuyển frame vào link
- Reliable delivery: Đảm bảo việc chuyển frame đi trong link không có lỗi
- Tự phát hiện lỗi và sửa lỗi

### Vị trí vật lý của link layer

![Vị trí vật lý của tầng liên kết dữ liệu trong Network Adapter (NIC)](public/network/link-layer/1.png)

- Link layer được cài đặt chủ yếu ở một chip gọi là Network Adapter hoặc NIC (network interface controller). Phần lớn các service được cài đặt trong phần cứng của adapter
- Một phần của link layer cũng được cài đặt ở phần mềm trong CPU của host. Phần này có tác dụng là gắn thông tin địa chỉ của link-layer và kích hoạt bộ điều khiển

## Quy tắc tìm và sửa lỗi

![Sơ đồ tổng quan về quá trình phát hiện và sửa lỗi tại tầng liên kết](public/network/link-layer/2.png)

- Dữ liệu $D$ được gắn thêm một số bit phục vụ mục đích phát hiện và sửa lỗi, gọi là $EDC$.
    - Phía nhận sẽ có nhiệm vụ kiểm tra xem dữ liệu nhận được $D'$ có giống $D$ không, khi chỉ biết $D'$ và $EDC'$.
- Có 3 cách kỹ thuật dùng để phát hiện lỗi: parity check, checksum và CRC (cyclic redundancy check)

### Parity check

- Cách đơn giản nhất để phát hiện lỗi là sử dụng thêm 1 parity bit:
    - Thêm một bit 0 hoặc 1 vào cuối $D$ sao cho số lượng bit 1 trong toàn bộ dữ liệu luôn chẵn (hoặc luôn lẻ)
    - Cách này sẽ phát hiện ra lỗi nếu có một số lượng lẻ các bit bị sai
- Ở link layer, ta chia dữ liệu $D$ thành $i$ hàng và $j$ cột. Với mỗi hàng và mỗi cột, ta dùng phương pháp trên để thêm một parity bit (hàng parity bit và cột parity bit cũng có 1 parity bit).
    - Số lượng parity bit là $i + j + 1$
    - Nếu có đúng 1 lỗi xảy ra, phương pháp này cho phép sửa lỗi bằng cách chỉ ra chính xác vị trí bị sai (hàng, cột không đúng tính chẵn lẻ) rồi flip bit tại vị trí đó
    - Phương pháp này cũng phát hiện được nhiều vị trí bị lỗi cùng một lúc với xác suất rất cao
- Phương pháp vừa phát hiện được lỗi vừa sủa được lỗi gọi là FEC (forward error correction)

### Checksum

- Chia gói tin thành các đoạn có độ dài cùng bằng $k$ và tính tổng bù 1 của phần này, lưu vào trường checksum trong header
    - Phương pháp này dùng trong các tầng trên tốt hơn vì ở tầng này có một công cụ mạnh hơn để chạy các thuật toán là network adapter

### Cyclic Redundancy Check (CRC)

![Nguyên lý hoạt động và tính toán mã kiểm lỗi CRC](public/network/link-layer/3.png)

- Được xây dựng dựa trên mã CRC.
- Cách xây dựng:
    - Xét một dãy $G$ có $|G| = r + 1$ (gọi là generator) được biết bởi cả bên gửi và bên nhận sao cho bit cao nhất của $G$ có giá trị là 1
    - Với mỗi dữ liệu $D$, bên gửi sinh thêm một đoạn $r$ bit là $R$, để được dãy bit là $(D \times 2^r) \oplus R$. Dãy $R$ được sinh phải thoả mãn số dư trong phép chia $(D \times 2^r) \oplus R$ cho $G$ là $0$:
        - Số $R$ được sinh bằng cách tìm số dư trong phép chia $\frac{D\times 2^r}{G}$
        - Tất cả các phép chia (kể cả phép chia sinh ra số $R$) là phép toán sau: Thực hiện phép chia như bình thường, tuy nhiên mọi phép cộng và phép trừ trong quá trình tính phép chia được chuyển thành phép xor.
        - Ví dụ, xét dữ liệu có $D = 101110, d = 6, G = 1001, r = 3$. Phép chia để tìm số $R$ sẽ có dạng như dưới hình. Ta tìm được $R = 011$
            
            

![Ví dụ minh họa phép toán chia nhị phân dùng XOR trong CRC](public/network/link-layer/4.png)

            
    - Bên gửi phát hiện lỗi bằng cách kiểm tra số dư trong phép chia trên. Nếu số dư khác $0$, chắc chắn đã xuất hiện lỗi.
- Có quy định chuẩn cho các giá trị $G$, với $r + 1 \in\{8, 16, 32\}$
    - Chẳng hạn, với 32 bit thì IEEE quy định  $G = 100000100110000010001110110110111$
- Nếu lấy giá trị $G$ theo đúng chuẩn, chắc chắn phát hiện được mọi lỗi với tối đa $r + 1$ bit.

## Multiple Access Links and Protocols

- Có 2 loại link:
    - Point-to-point link: một nút gửi và một nút nhận
        - Các giao thức có sẵn: PPP, HDLC
    - Broadcast link: nhiều nút gửi và nhiều nút nhận
        - Một số ví dụ về loại này là Ethernet và LAN
- Multiple access problem: làm sao để định hướng các nút gửi vào nhận vào một broadcast link
- Có thể xuất hiện tình trạng hai nút cùng gửi frame cùng một lúc, dẫn tới việc xảy ra “va chạm”, làm hai frame này bị rối lên và bị hỏng
- Các tính chất cần có của multiple access protocol qua broadcast link có transmission rate $R$:
    - Throughput khi có một nút tham gia truyền tin là $R$
    - Khi $M$ nút tham gia truyền tin, throughput của mỗi nút là $\frac{R}{M}$
    - Giao thức không được có một nút nào mà khi hỏng làm ảnh hưởng đến cả mạng
    - Giao thức phải đơn giản
- Multiple access protocol:
    - Giao thức chia kênh
    - Giao thức truy cập ngẫu nhiên
    - Giao thức lần lượt (taking-turn)

### Giao thức chia kênh

- Sử dụng TDM để chia thời gian thành các time frame bằng nhau, mỗi time frame lại được chia thành các time slot. Mỗi time slot này được gán cho một nút.
    - Các nút này chỉ được truyền tin trong time slot mà nó được cấp cho
    - Gây lãng phí tài nguyên
- Một cách chia khác là FDM, chia thành các tần số khác nhau để truyền tin
    - Vẫn gặp phải những vấn đề như TDM
- CDMA (code division multiple access): gán các mã khác nhau cho các nút. Các nút này dùng mã được cấp cho để mã hoá dữ liệu. Kết quả là dữ liệu có thể được chuyển đồng thời mà không bị rối loạn.

### Giao thức truy cập ngẫu nhiên

- Ý tưởng: Nếu xảy ra va chạm, mỗi nút gửi tin sẽ đợi một khoảng thời gian ngẫu nhiên trước khi gửi lại
- Giao thức ALOHA chia slot:
    
    

![Kịch bản xảy ra va chạm dữ liệu trong giao thức ALOHA chia slot (Slotted ALOHA)](public/network/link-layer/5.png)

    
    - Giả sử có:
        - Tất cả các frame chứa đúng $L$ bit
        - Thời gian được chia thành các slot có kích thước $\frac{L}{R}$ (giây)
        - Các nút sẽ bắt đầu gửi tin ngay lúc slot của mình bắt đầu
        - Các nút đều được biết lúc nào slot nào bắt đầu
        - Nếu có va chạm, tất cả các nút đều phát hiện ra va chạm trước khi hết slot lúc đó
    - Gọi $p$ là một số thực nằm giữa $0$ và $1$. Quy trình tại mỗi nút như sau:
        - Một nút vừa nhận được frame ở một slot sẽ không gửi ngay mà đợi đến lúc slot tiếp theo bắt đầu thì gửi
        - Nếu không có va chạm, không cần gửi lại frame nữa. Nút này chuẩn bị gửi đi frame tiếp theo
        - Nếu có va chạm, tất cả các node sẽ biết có va chạm xảy ra trước khi slot hiện tại kết thúc. Từ slot tiếp theo, các nút có frame bị va chạm sẽ gửi lại frame vào lúc bắt đầu slot đó với xác suất là $p$ cho đến khi gửi thành công cả 2.
    - Một số vấn đề: Vẫn có các slot bị va chạm thêm một lần, có những slot trống, …
    - Độ hiệu quả:
        - Là tỉ lệ thành công về lâu dài trong trường hợp có nhiều nút và nhiều thông tin được gửi
        - Xác suất để tất cả các nút nút thành công của ALOHA chia slot là $Np(1-p)^{N-1}$
        - Ở $p$ tốt nhất, giao thức này có độ hiệu quả là $\frac{1}{e}$ chỉ làm mạng hoạt động 37% thời gian
- Giao thức ALOHA (không chia slot):
    
    

![Kịch bản va chạm dữ liệu trong giao thức ALOHA thuần túy (Pure ALOHA)](public/network/link-layer/6.png)

    
    - Khi một nút nhận được frame, nó gửi ngay lập tức. Nếu có va chạm, nó gửi lại ngay lập tức với xác suất $p$ mỗi một khoảng thời gian bằng thời gian truyền tin
    - Xác suất để tất cả các nút thành công là $Np(1-p)^{2(N-1)}$. Độ hiệu quả là $\frac{1}{2e}$
- Giao thức CSMA/CD (Carrier Sense Multiple Access width Collide Detection)
    
    

![Cơ chế lắng nghe kênh truyền (Carrier Sense) và phát hiện va chạm (Collision Detection)](public/network/link-layer/7.png)

    
    - Các ý tưởng giải quyết vấn đề va chạm:
        - Một nút sẽ lắng nghe kênh truyền chuẩn bị dùng, đợi đến khi không có một hoạt động vận chuyển nào khác mới bắt đầu chuyển
        - Nếu phát hiện đang có tin được truyền đi trong thời điểm đó, ngừng truyền tin ngay lập tức và đợi một khoảng thời gian ngẫu nhiên rồi truyền tiếp
    - Quy trình truyền tin từ adapter theo giao thức CSMA/CD
        - Adapter nhận được datagram từ network layer. Nó đóng thành frame và đặt vào buffer
        - Nếu adapter biết được kênh truyền tin đang trống (không có tín hiệu đi từ kênh truyền tin vào adapter), nó bắt đầu truyền frame đi. Nếu nó biết kênh đang bận, nó đợi đến lúc không có tín hiệu nữa mới bắt đầu truyền
        - Adapter dùng broadcast channel để kiểm tra tín hiệu từ các adapter khác
        - Nếu không gặp tín hiệu nào, frame coi như được chuyển xong. Nếu có, nó lập tức dừng truyền frame
        - Nếu frame bị dừng truyền, adapter đợi một khoảng thời gian ngẫu nhiên rồi làm lại từ bước 2
    - Chọn khoảng thời gian ngẫu nhiên bằng thuật binary exponential backoff: Nếu có $n$ gói tin bị va chạm, khoảng thời gian được chọn ngẫu nhiên trong khoảng $[0, 2^n)$
    - Độ hiệu quả của giao thức này là
    
    $$
    \frac{1}{1 + \frac{5d_{prop}}{d_{trans}}}
    $$
    

### Giao thức lần lượt

- Polling protocol:
    - Một nút trong mạng được đưa lên làm master
    - Nút này poll các nút khác theo vòng tròn như sau:
        - Master gửi một tin cho nút 1, cho biết nó có thể gửi một lượng frame nào đó
        - Sau khi nút 1 xong, master làm tương tự với nút 2
        - Master poll lần lượt các nút trong mạng, đến khi hết sẽ quay lại nút 1
    - Tính chất:
        - Loại bỏ va chạm và các slot thời gian trống
        - Xuất hiện polling delay (thời gian master báo cho các nút là nó có thể chuyển được)
        - Nếu master node gặp lỗi thì toàn hệ thống sẽ gặp lỗi
- Token-passing protocol
    - Một frame đặc biệt gọi là token sẽ được trao đổi giữa các nút theo một thứ tự nhất định theo vòng tròn
    - Nếu một nút giữ token, nó truyền tin đến khi nào xong rồi đẩy sang nút tiếp theo
        - Nếu không cần truyền tin thì nó sẽ đẩy đi luôn
    - Tính chất:
        - Decentralized, hiệu suất cao
        - Một nút bị hỏng bất kỳ sẽ làm hỏng hệ thống
        - Thỉnh thoảng cần một cơ chế đặc biệt để một nút buộc phải nhả token cho nút khác

### Mạng có dây và DOCSIS

![Mô hình chia kênh và truyền dữ liệu trong tiêu chuẩn cáp DOCSIS](public/network/link-layer/8.png)

- DOCSIS (Data-Over-Cable Service Interface Specifications) là giao thức link layer của mạng có dây
- Sử dụng FDM để chia downstream (từ CMTS tới modem) và upstream của mạng (từ modem lên CMTS) thành cách dải tần số khác nhau
    - Với DOCSIS 3.1 thì downstream throughput cỡ 1.6 Gbps, upstream throughput cỡ 1 Gbps
- Ở chiều xuống, không xảy ra multiple access (vì chỉ có một CMTS). Ở chiều lên, va chạm có thể xảy ra, và được xử lý bằng cách chia thời gian thành các slot theo kiểu TDM
    - Theo cách này, khi đến một slot, CMTS cho phép một modem được truyền tin bằng cách gửi một control message MAP tới modem đó
    - Để được cấp slot, các modem sẽ gửi một frame yêu cầu cấp slot lên CMTS bằng giao thức truy cập ngẫu nhiên (binary exponential backoff)

## Mạng LAN

### Địa chỉ MAC

- Địa chỉ ở link layer được gọi là địa chỉ MAC
    - Địa chỉ MAC của host và router thực tế là địa chỉ MAC của adapter
    - Switch không có địa chỉ MAC gắn liền với các interface (vì nó vận chuyển datagram mà không động đến chúng)
- (Với hầu hết LAN) Địa chỉ MAC là một dãy 48 bit (6 byte), được viết dưới dạng 6 số hexadecimal ngăn cách bởi dấu -
- Địa chỉ MAC gần như là cố định với mỗi adapter, bất kể thiết bị được đặt ở vị trí nào
    - Mỗi interface của router có 1 adapter riêng, và ứng với mỗi adapter sẽ có 1 địa chỉ MAC
- Mọi adapter đều có địa chỉ MAC khác nhau (trừ khi bị sửa)
    - IEEE quy định mọi đơn vị sản xuất adapter phải dùng chung 24 bit đầu tiên của địa chỉ MAC
- Cấu trúc của địa chỉ MAC là “phẳng” (khác với IP có dạng phân cấp network part - host part)
- Khi một adapter muốn gửi frame đến một adapter khác, nó để địa chỉ MAC của đích vào frame
- Địa chỉ MAC dùng cho broadcast là FF-FF-FF-FF-FF-FF

### ARP

- Là giao thức dùng để phiên dịch giữa địa chỉ MAC và địa chỉ IP.
    - Giao thức này thực chất hoạt động ở cả network layer và link layer
- Cách hoạt động: Đưa vào một địa chỉ IP trong LAN, đưa ra địa chỉ MAC của adapter dùng IP đó
    - ARP chỉ hoạt động với các host và router trong cùng một subnet
- Các host và router lưu một bảng ARP trong bộ nhớ, gồm 3 cột: địa chỉ IP, địa chỉ MAC, TTL (TTL là thời gian một hàng tồn tại trong bộ nhớ). Nếu một địa chỉ IP đã tồn tại trong bảng ARP, ARP chỉ việc lấy địa chỉ MAC ra. Nếu không có, ARP lấy địa chỉ MAC của IP đó như sau:
    - Bên gửi tạo một packet đặc biệt gọi là ARP packet. Gói tin này có chứa địa chỉ IP và địa chỉ MAC của bên gửi và bên nhận (MAC bên nhận hiện tại là FF-FF-FF-FF-FF-FF)
    - Gói tin này được đóng thành frame rồi được broadcast (gửi vào FF-FF-FF-FF-FF-FF)
    - Tất cả các adapter nhận được gói tin này sẽ gửi lên ARP module của nó. ARP module sẽ kiểm tra xem địa chỉ IP của mình có khớp với địa chỉ IP của gói tin không
    - Nếu một host có địa chỉ IP khớp, nó sẽ gửi lại một gói tin ARP tới bên gửi với địa chỉ MAC được cập nhật. Bên nhận khi nhận được gói tin này sẽ cập nhật bảng ARP của mình
- Nếu phát hiện có host rời khỏi subnet, giá trị của nó trong bảng ARP sẽ bị xoá

### Gửi tin ra ngoài subnet

![Quy trình gửi gói tin IP đi xuyên qua các Subnet khác nhau](public/network/link-layer/9.png)

- Quy trình gửi như sau:
    - Gói tin có địa chỉ IP nguồn ở một subnet và địa chỉ đích ở subnet khác. Tuy nhiên, địa chỉ MAC khi gói tin được gửi đi từ bên gửi phải là địa chỉ MAC của edge router interface cùng subnet với nó.
    - Gói tin được chuyển như vậy sẽ đến được router. Tại router, nó được mở lên đến network layer để lấy địa chỉ IP, và địa chỉ IP này được dùng để lấy địa chỉ MAC của thiết bị tiếp theo bằng ARP
    - Sau vài lần di chuyển giữa các router theo đường đi đã định tuyến, gói tin sẽ đến được đích

### Ethernet

- Hub: thiết bị physical layer xử lý trên các bit, bằng cách tăng năng lượng cho một bit khi đến nó để đẩy nó sang thiết bị khác
- Switch: thiết bị hoạt động đến link layer
- Cấu trúc frame:
    
    

![Cấu trúc khung dữ liệu Ethernet Frame tiêu chuẩn](public/network/link-layer/10.png)

    
    - Data (46-1500B): chứa IP datagram. Ethernet chỉ cho phép phần này nặng tối đa 1500B (MTU = 1500). Nếu phần này nhỏ hơn 46B, nó sẽ được nhồi thêm vào cho đủ 46B (Phần thực tế có thể xác định bằng trường length trong datagram)
    - Destination address (6B): Địa chỉ MAC của đích
        - Nếu ở đích, gói tin nhận được có địa chỉ MAC không khớp với địa chỉ MAC của nó, nó sẽ huỷ bỏ gói tin
    - Source address (6B): Địa chỉ MAC của nguồn
    - Type (2B): Cho phép Ethernet multiplex một giao thức network layer (có thể không phải là IP). Giá trị của trường này phụ thuộc vào giao thức đó
    - CRC (4B): các bit được gắn thêm vào frame để phát hiện lỗi
    - Preamble (8B): Cấu trúc của phần này luôn là 10101010X10101011. 7 bit đầu tiên dùng để đồng bộ clock của adapter bên gửi với clock của adapter bên nhận. 2 bit cuối dùng để báo hiệu cho bên nhận rằng có thông tin quan trọng sắp được chuyển đến
- Dịch vụ công nghệ Ethernet cung cấp là không đáng tin cậy: Nếu frame không vượt qua CRC check nó sẽ đơn thuần bị huỷ bỏ ở adapter mà không thông báo lại gì
    - Ở bên nhận, nếu dùng UDP dữ liệu sẽ bị ngắt quãng, còn nếu dùng TCP nó sẽ báo lại cho bên nhận bằng các ACK
- Có nhiều chuẩn Ethernet khác nhau, được quy định bởi IEEE 802.3 CSMA/CD working group
    - Một số chuẩn:
        - 10BASE-2, 10BASE-5: cáp đồng trục (coaxial), tốc độ 10Mbps, giới hạn trong 500m
            - Dùng repeater để truyền được dài hơn
        - 100BASE-T: cáp xoắn đôi đồng, tốc độ 100Mbps (chuẩn Fast Ethernet), giới hạn trong 100m
        - 100BASE-FX, 100BASE-SX, 100BASE-BX: cáp quang, tốc độ 100Mbps (chuẩn Fast Ethernet), giới hạn trong vài km
        - 1000BASE-T, 10GBASE-T: các chuẩn Gigabit Ethernet
    - Số đầu trong chuẩn là tốc độ của chuẩn đó
    - BASE nghĩa là baseband ethernet
    - Số cuối là của physical media (loại cáp)
- Gigabit Ethernet:
    - Sử dụng frame format tương tự với các chuẩn Ethernet cũ hơn
    - Cho phép truyền tin giữa hai điểm và broadcast
    - Sử dụng CSMA/CD cho các kênh broadcast
    - Cho phép full duplex ở 40 Gbps

### Switch

- Switch có tính chất “trong suốt” đối với các host và router: các thiết bị trên không hề biết có switch nhận tin và chuyển tin đi
- Chức năng chuyển tiếp và lọc:
    - Lọc: switch kiểm tra xem một frame có nên được chuyển tiếp đi không hay phải bị huỷ
    - Chuyển tiếp: xác định interface mà frame này cần được chuyển tiếp đi và chuyển frame vào interface đó
    - Lọc và chuyển tiếp được tiến hành bằng bảng switch
        - Bảng switch gồm 3 cột: địa chỉ MAC, interface và thời gian hàng được ghi lại
        - Nếu một gói tin mang địa chỉ MAC chưa có trong bảng switch đến switch, nó sẽ broadcast frame này đi tiếp (nghĩa là chuyển tiếp một bản copy của frame hiện tại đến output buffer ứng với tất cả các adapter xung quanh trừ điểm đến)
        - Nếu một gói tin mang địa chỉ MAC đã có trong bảng switch đến switch, và giá trị này ứng với interface vừa gửi đến switch, gói tin sẽ bị lọc và huỷ bỏ.
        - Nếu một gói tin mang địa chỉ MAC đã có trong bảng switch đến switch, và giá trị này ứng với interface khác interface vừa gửi đến switch, gói tin sẽ được chuyển tiếp đến interface đó
- Chức năng tự học:
    - Switch điền các giá trị vào bảng switch như sau:
        - Ban đầu, bảng switch trống
        - Mỗi khi một frame đến switch, nó điền vào bảng địa chỉ MAC mà frame đó đến, interface nhận được frame này, và thời gian nó đến
        - Sau một thời gian dài không có frame đến từ một địa chỉ MAC, switch xoá hàng đó ra khỏi bảng
    - Switch là thiết bị plug and play, không cần sự can thiệp từ người dùng hoặc admin mạng
    - Mọi interface trong switch có thể vừa gửi vừa nhận cùng một lúc
- Tính chất của switch:
    - Loại bỏ va chạm: các frame được buffer và không bao giờ có 2 frame được gửi cùng 1 lúc
    - Các link được sử dụng nối với switch có thể dùng các công nghệ khác nhau với tốc độ khác nhau
    - Switch làm tăng tính bảo mật và hỗ trợ quản lý mạng tốt hơn: switch có thể biết máy hỏng và tự ngắt kết nối đến máy đó
- So sánh switch và router
    
    

![Bảng so sánh đặc điểm vận hành giữa Switch và Router](public/network/link-layer/11.png)

    
    - Switch:
        - Tốc độ lọc và chuyển tiếp rất nhanh (vì chỉ cần chuyển frame lên layer 2)
        - Topo của mạng dùng switch bị giới hạn dưới dạng cây khung (nếu có chu trình gói tin sẽ bị chuyển đi vô hạn)
        - Switch lớn sẽ làm các thiết bị cần nhiều giá trị trong bảng ARP hơn
        - Switch nhạy cảm với broadcast storm
    - Router:
        - Topo của mạng dùng router được phép có chu trình (vì cơ chế địa chỉ phân cấp của IP có thể xác định được điểm đến chính xác)
        - Mạng dùng router cho phép nhiều đường link hoạt động cùng 1 lúc giữa 2 địa điểm
        - Chống link layer broadcast storm
        - Router không có tính chất plug-and-play: việc gán địa chỉ IP là một công việc khác không tự động
        - Router xử lý trên packet lâu hơn là switch vì phải lên tới layer 3
        
        

![So sánh đường truyền dữ liệu qua Hub, Switch và Router](public/network/link-layer/12.png)

        

### VLAN

![Mạng LAN ảo (VLAN) giúp cô lập vùng quảng bá vật lý](public/network/link-layer/13.png)

- Một số vấn đề của LAN thường:
    - Các tin dạng broadcast chưa được cô lập (vẫn đi hết cả mạng)
    - Dùng switch chưa hiệu quả: cứ mỗi một nhóm nhỏ lại cần thêm một switch để hạn chế lộ thông tin
    - Khó quản lý người dùng: người dùng chuyển sang group khác thì cáp cũng phải chuyển theo
- LAN ảo (VLAN): cơ chế của switch cho phép nhiều mạng LAN ảo được tồn tại trong một mạng LAN vật lý
    - Hai người dùng có thể giao tiếp bằng VLAN nếu chỉ có họ được nối với switch
- Các interface VLAN được chia thành các nhóm bởi admin (dùng phần mềm quản lý switch)
    - Trong nhóm này, một tin nhắn broadcast từ một interface chỉ đến được các interface giới hạn trong nhóm
    - Switch cũng lưu lại một bảng ánh xạ interface với nhóm. Phần cứng của switch chỉ chuyển giữa hai phần này
- Để di chuyển giữa hai nhóm VLAN khác nhau, ta nối một interface của VLAN với một router rồi config để interface đó thuộc cả hai nhóm VLAN
- VLAN trunk: dành ra 2 cổng dùng để nối 2 VLAN switch khác nhau, 1 cổng nối ra, 1 cổng nối vào
    - Trong các frame di chuyển trong VLAN, trường VLAN tag sẽ được thêm vào để cho biết frame này xuất phát ở VLAN nào
        
        

![Cấu trúc khung tin Ethernet có chèn thêm trường VLAN Tagging (802.1Q)](public/network/link-layer/14.png)

        

## Ảo hoá mạng và MPLS (không học)

### MPLS (Multiprotocol Label Switching)

- Ý tưởng: tăng tốc IP forwarding bằng cách sử dụng fixed-length label
- Frame theo cơ chế này sẽ đặt thêm một header nhỏ giữa header của link layer và header của network layer
    
    

![Định dạng các trường nhãn trong MPLS Header](public/network/link-layer/15.png)

    
- Frame MPLS chỉ có thể truyền trong các router đặc biệt gọi là label-switched router
    - Router này chỉ cần dựa vào MPLS label là có thể chuyển đến output interface mà không cần biết địa chỉ IP
- MPLS cho phép truyền frame qua các đường đi mà bình thường dùng IP không thể đi qua được, bằng cách buộc một phần giao thông mạng phải đi theo một con đường, phần còn lại đi theo đường khác
- MPLS là cơ chế được sử dụng để tạo ra VPN
    - Khi cài đặt VPN, ISP sử dụng mạng có MPLS để kết nối nhiều mạng của khách hàng với nhau, và cô lập các tài nguyên, địa chỉ của khách hàng VPN tới những người khác

## Quá trình tạo ra web request

![Kịch bản tổng hợp: Từng bước gửi và xử lý một Web Request hoàn chỉnh](public/network/link-layer/16.png)

Tình huống: Một người dùng PC (có địa chỉ MAC là 00-16-D3-23-68-8A) nối với Ethernet switch của cơ quan để vào trang web www.google.com

### Khởi tạo DHCP, UDP, IP và Ethernet

1. Hệ điều hành của PC tạo một DHCP request, gói nó vào UDP segment, đưa vào IP datagram rồi gửi đến địa chỉ broadcast 255.255.255.255:67 từ địa chỉ 0.0.0.0:68 (do chưa có IP)
2. IP datagram trên được đưa vào một Ethernet frame, gửi tới địa chỉ FF-FF-FF-FF-FF-FF từ địa chỉ nguồn 00-16-D3-23-68-8A
3. Frame trên được gửi đến switch của cơ quan. Switch sẽ broadcast frame này đến tất cả các host khác đến với switch kể cả máy vừa gửi đến
4. Router nhận được frame vừa broadcast chứa DHCP request từ địa chỉ MAC 00-16-D3-23-68-8A. Router sẽ mở gói tin để lấy IP datagram. Router nhận thấy gói tin cần được xử lý ở giao thức tầng cao hơn ở nút này, nên dữ liệu trong IP datagram sẽ được demultiplex vào UDP, trong đó lấy ra được yêu cầu DHCP
5. Coi như router này có DHCP server và server này cung cấp địa chỉ IP được lấy trong một dải nào đó. Nó cung cấp cho máy gửi địa chỉ IP là 68.85.2.0/24. DHCP server trong router sẽ tạo ra tin DHCP ACK, bao gồm:
    - Địa chỉ IP nó tạo ra 68.85.2.101/24
    - Địa chỉ IP của DNS server 68.87.71.226 (Comcast)
    - Địa chỉ IP của default gateway router 68.85.2.1
    - Địa chỉ subnet 68.85.2.0/24.
    
    DHCP message này được đưa vào một gói tin UDP, gói vào một IP datagram, gói lần nữa vào Ethernet frame. Địa chỉ nguồn của frame là địa chỉ MAC của router 00-22-6B-45-1F-1B, địa chỉ đích của frame là địa chỉ MAC của PC 00-16-D3-23-68-8A
    
6. Ethernet frame này được gửi đến switch. Do địa chỉ MAC của PC đã nằm trong switch table của switch nên nó chỉ việc gửi thằng frame đến PC
7. PC nhận được tin DHCP ACK sẽ mở dần frame này ra để lấy nội dung của UDP segment. PC ghi lại các giá trị có trong segment này, ghi giá trị default gateway vào forwarding table. **Tất cả các gói tin có địa chỉ nằm ngoài subnet sẽ được gửi lên default gateway trước**.

### Khởi tạo DNS và ARP

1. PC tạo một DNS query message, trong đó chứa URL [www.google.com](http://www.google.com) ở trường question. Message được đặt vào đoạn tin UDP có port number là 53. Segment được đặt vào IP datagram với nguồn là địa chỉ IP của PC 68.85.2.101, đích là địa chỉ IP của DNS server 68.87.71.226. 
2. IP dataframe trên được đặt vào một Ethernet frame. Lúc này, PC hiện chưa biết địa chỉ MAC của gateway (68.85.2.1) nên sẽ phải gửi đi một frame ARP trước. 
3. PC tạo ra ARP query message, có địa chỉ IP là 68.85.2.1, đưa vào Ethernet frame với địa chỉ đích là địa chỉ broadcast. Frame này được gửi vào switch. Ở switch, do là địa chỉ broadcast nên nó sẽ gửi đến tất cả các thiết bị xung quanh
4. Gateway router nhận được frame chứa ARP query message. Nó tạo ARP reply message, chứa địa chỉ MAC của nó 00-22-6B-45-1F-1B. Gói tin này khi được gói vào IP frame sẽ có địa chỉ đích là địa chỉ MAC của PC 00-16-D3-23-68-8A
5. Frame trên đi qua switch, được forward trực tiếp về PC. PC nhận được frame này sẽ ghi lại địa chỉ MAC của router
6. Lúc này frame chứa DNS query message đã hoàn thiện. Nó được gửi đến switch, rồi trực tiếp forward sang gateway router. 

### Định tuyến đến DNS server

1. Gateway router nhận được frame, sẽ lấy địa chỉ IP từ datagram bên trong nó. Router sẽ tra cứu điểm đến của gói tin IP trên (68.87.71.226) trong bảng forwarding table của mình. Nó biết điểm đến là Comcast nên sẽ gửi frame (đóng từ gói tin vừa rồi) lên router của Comcast (giả sử có đường nối trực tiếp từ gateway router của cơ quan đến router của Comcast)
2. Router ngoài cùng của mạng Comcast nhận được frame này, lấy ra IP datagram, rồi dựa vào các thuật toán định tuyến để xác định đầu ra cho frame. Thuật toán định tuyến này thuộc loại intra-AS. (Nếu server thuộc về nhà cung cấp khác, sẽ phải dùng thêm BGP)
3.  Mỗi khi đi qua một router, bước 15 được lặp lại. Đến DNS server, nó lấy ra đến message rồi lấy URL cần yêu cầu ra. DNS server thực hiện truy vấn trong cơ sở dữ liệu DNS của mình, tìm ra IP của URL là 64.233.169.105. DNS server tạo DNS reply message, nó được đưa vào UDP segment, gói vào IP datagram với địa chỉ IP là địa chỉ IP của PC 68.85.2.101, và đi một con đường ngược lại với đường đến để trở về PC
4. PC nhận được DNS reply message, lấy ra địa chỉ IP của [www.google.com](http://www.google.com). Lúc này, có thể trao đổi thông tin với trang web.

### Khởi tạo TCP và HTTP

1. PC tạo socket ứng với port 80 để phục vụ cho HTTP request. PC khởi tạo kết nối TCP, nó tạo TCP SYN segment với port number 80, gói vào datagram với địa chỉ IP đích là địa chỉ IP của trang web 64.233.169.105. Datagram được đóng vào frame, địa chỉ MAC đích là địa chỉ MAC của gateway 00-22-6B-45-1F-1B. Frame được chuyển lên switch rồi gateway router
2. Từ gateway router, bằng các thuật toán định tuyến (các thuật intra-AS, BGP), gói tin này sẽ chạy qua từng router một đến server của trang web. 
3. Tại server của trang web, TCP SYN message được lấy ra từ frame rồi demultiplex vào đúng socket ở cổng 80. Server tạo TCP SYNACK message, đóng thành frame rồi gửi lại PC
4. Frame di chuyển theo đúng quãng đường trên, tới khi trở lại PC. Nó được demultiplex vào socket ứng với port 80 và thiết lập thành công kết nối TCP
5. Trình duyệt của PC tạo HTTP GET message. Nó được ghi vào socket, trở thành nội dung của TCP segment, rồi đóng thành frame. Sau đó nó di chuyển lên server trang web giống như các bước 18-20
6. HTTP server ở trang web đọc được HTTP GET message, nó tạo HTTP response message chứa nội dung trang web rồi gửi về TCP socket.
7. Sau khi di chuyển ngược lại như trên, message đến với PC. Browser lấy nội dung trang web từ HTTP response rồi hiển thị nó lên
