---
title: Khái niệm cơ bản về mạng máy tính
date: 2026-05-26
excerpt: Tổng quan và các khái niệm cơ bản về mạng máy tính.
category: LEARNING
---
## Internet

- Là mạng gồm hàng tỷ các thiết bị kết nối với nhau
- Bao gồm:
    - Host/end system: chạy các network apps
    - Package switch (switch/router): Thiết bị vận chuyển các gói tin
    - Communication link: Đường kết nối các package switch
        - Transmission rate (bits/s)
- Internet là tập các host, router, link được quản lý bởi một tổ chức
- Internet là mạng của các mạng, gồm các ISP (internet Service Provider)
- Internet theo góc nhìn service bao gồm: infrastructure, programming interface

#### Protocol

- Là bộ quy tắc giúp trao đổi thông tin trên mạng
    - Cụ thể hơn, protocol là quy định định dạng, thứ tự gửi, nhận và các hoạt động trung gian trong giao tiếp giữa hai thực thể nào đó, đồng thời cả các hoạt động diễn ra trong quá trình gửi và nhận message hoặc sự kiện khác

![Mô hình hoạt động của Giao thức (Protocol)](public/network/basic-concepts/1.png)

## Network Edge

#### Các thành phần

- Host/end system
    - Được chia thành client và server
- Data center

#### Access network

- Là các mạng nối với edge router (router đầu tiên sau end system)
- Home network:
    - DSL (digital subscriber line): loại công nghệ giúp truyền internet qua đường dây điện thoại có sẵn: ![Mô hình kết nối Internet qua đường dây thuê bao số DSL](public/network/basic-concepts/2.png)
	  - ISP của đường dây điện thoại cũng là ISP của mạng
	- Các modem của khách hàng trao đổi thông tin qua đường dây này với DSLAM (DSL access multiplexer) đặt ở trụ sở (CO) nhà mạng
	- Đường dây mang các tín hiệu khác nhau ở các tần số khác nhau, gồm band upstream (nhanh), band downstream (vừa), band điện thoại (chậm). Vì vậy các công việc vẫn được tiến hành độc lập
    - Cable Internet access: loại công nghệ giúp truyền internet qua đường cáp truyền hình có sẵn. ![Mô hình kết nối Internet qua mạng cáp truyền hình](public/network/basic-concepts/3.png)
        - Internet access có chung nhà cung cấp với cáp
        - Một ví dụ cho loại này là HFC (hybrid fiber coax, trên hình)
        - Cần dùng các modem đặc trưng (cable modem)
    - Các công nghệ khác: FITH, 5G
#### Enterprise network

- Ethernet
    - Sử dụng Ethernet switch
- Kết hợp các công nghệ có và không dây
- Wireless Access Network
    - Wifi
        - Hiệu lực trong vài chục m
    - Wide-area cellular access network
        - Hiệu lực xa hơn, trong vài chục km
        - Được cung cấp bởi các dịch vụ di động
        - Các công nghệ: 4G, LTE 4G, 5G

#### Host

- Nhận tin, chia làm các gói độ dài $L$ bit
- Gửi gói qua mạng, tốc độ (transmission rate) $R$ (bps)
    - Dung lượng của link là bandwidth
- Thời gian đẩy toàn bộ $L$ bit của gói qua link (Packet trasmission delay): $\frac{L}{R}$ (s)

#### Link:

- Bit: đơn vị thông tin
- Link: đường nối 2 tb
    - guided media: liên kết có dây
    - unguided media: liên kết 0 dây

## Network core

#### Tổng quan

- Gồm các router nối nhau
- Dùng trung chuyển gói tin (packet-switching)
    - Là chuyển gói tin liên tục qua các router đi qua từng link một, từ nguồn đến đích

#### Chức năng

- Forwarding
    - Thực hiện ở tất cả các router trong nội bộ (local action)
    - Quyết định điểm đến tiếp theo dựa trên thông tin đến đã tra cứu qua forwarding table
- Routing
    - Tìm đường đi tối ưu dựa trên thông tin ở các router trong mạng (Global action)
    - Sử dụng thuật toán định tuyến để tìm đường đi
- Package switching
    - Cơ chế store-and-forward
        - Gói tin chỉ được forward đi khi router đã nhận đầy đủ gói tin
        - Ở thời điểm $0$, gói tin bắt đầu được chuyển từ nguồn. Ở thời điểm $\frac{L}{R}$, gói tin được chuyển đến router, tại đây nó được lưu lại rồi mới chuyển tiếp đi. Ở thời điểm $\frac{2L}{R}$, gói tin được chuyển đến đích
            - Tổng delay cho trường hợp 1 switch là $\frac{2L}{R}$.
            - Nếu không lưu lại ở switch thì chỉ mất $\frac{L}{R}$.
            - Nếu gửi thêm $m-1$ gói tin nữa thì sẽ có delay là $\frac{(n+1)L}{R}$
        - Trường hợp có $N$ link cùng rate giữa nguồn và đích, và cần gửi $M$ gói tin thì delay cho một gói tin và tổng delay là
	        - $$ d=N\frac{L}{R} $$
	        - $$ D=(M+1)N\frac{L}{R} $$
			- ![Cơ chế lưu trữ và chuyển tiếp (Store-and-Forward)](public/network/basic-concepts/4.png)
	 
	 - Cơ chế queueing
        - Gói tin chờ xử lý ở RAM của router nếu tốc độ nó đến quá nhanh so với tốc độ của link
            - Nếu RAM của router hiện tại đã đầy, gói tin truyền đến router sẽ bị mất
            - ![Hiện tượng hàng đợi (Queueing) và mất gói tin tại router](public/network/basic-concepts/5.png)
    
    - Cơ chế packet switching là đặc thù cho internet
- Circuit switching
    - Phân bổ tài nguyên để một cặp host có một đường nối dùng riêng, thông tin từ các đường khác không vào được
        - Các kết nối là end-to-end
        - Transmission rate được chia đều cho mỗi đường truyền
    - Có chất lượng tốt, nhưng gây lãng phí tài nguyên
    - Thường sử dụng trong đường dây điện thoại bàn

![Cơ chế chuyển mạch kênh (Circuit Switching)](public/network/basic-concepts/6.png)

- ISP
    - Các host kết nối đến mạng qua ISP (nhà CCDV)
    - Các access network kết nối với nhau thông qua các ISP vùng
        - Các ISP vùng kết nối với nhau bằng IXP (internet exchange point)
    - Content provider network
        - Có vai trò ngang hàng với các ISP tier1
        - Kết nối riêng tới khách hàng không cần qua các ISP vùng

![Mô hình phân cấp cấu trúc mạng Internet toàn cầu](public/network/basic-concepts/7.png)

## Delay, loss và throughput

#### Delay

- Gồm các loại:
    - Processing delay: thời gian router cần để kiểm tra header của packet và tìm điểm đến cho nó
    - Queuing delay: thời gian đợi trong router để được chuyển đi tiếp
        - Nếu các packet độ dài $L$ đến router theo tần suất $a$ gói/giây, với transmission rate là $R$ thì ta có độ tắc nghẽn (traffic intensity) là $\frac{La}{R}$
        - Thông thường, $\frac{La}{R}\leq 1$. Khi đó, giả sử có $N$ gói tin cùng đến router một lúc. Như vậy, thời gian queuing delay của gói tin thứ $i$ là $\frac{(i-1)L}{R}$.
        - Nếu $\frac{La}{R}>1$, sẽ xảy ra tình trạng mất tin
    - Transmission delay: thời gian chuyển gói tin qua link từ nguồn đến đích, tính bằng $\frac{L}{R}$
    - Propagation delay: thời gian xung tín hiệu di chuyển trên link, thường không đáng kể
        - Tính bằng $\frac{\mathcal{l}}{v}$, với  $l$ là độ dài link và $v$ là vận tốc của xung tín hiệu
- Thời gian delay trong một router tính bằng $$ d_{nodal}=d_{proc}+d_{queue}+d_{trans}+d_{prop} $$
- Thời gian delay trong kết nối end-to-end tính bằng $$ d_{e-e}=N(d_{proc}+d_{trans}+d_{prop}) $$
#### Throughput

- Throughput tức thời trong một thời điểm là tốc độ nhận gói tin của bên đích lúc đó
- Throughput trung bình là tốc độ nhận gói tin trung bình trong cả quá trình chuyển tin
- Throughput của một mạng nối bằng $N$ link có transmission rate là $R_1, …, R_N$ là $\min\{R_1, …, R_N\}$
    - Nếu trong quãng đường di chuyển có một đoạn link được dùng chung bởi nhiều host khác nhau, tranmission rate cũng sẽ bị chia nhỏ và ảnh hưởng đến throughput

### An ninh mạng

- Internet vốn không được thiết kế để đảm bảo an ninh
- Các phương pháp tấn công:
    - Package sniffing: Lấy gói tin để đọc trộm
    - IP spoofing: sửa địa chỉ đích của tin được gửi
    - DDoS
- Các phương pháp phòng chống:
    - Authentication
    - Confidentiality: mã hoá thông tin khi gửi đi
    - Integrity check: Chữ ký số
    - Firewall

## Protocol layers và services layer

#### Layer

- Thực hiện các chức năng này thông qua các hoạt động bên trong và dựa trên các dịch vụ của layer dưới nữa
- Giúp hệ thống hoạt động độc lập, khi bảo trì hệ thống sẽ không bị ảnh hưởng tổng thể

#### Mô hình ISO/OSI

![Mô hình tham chiếu ISO/OSI 7 tầng](public/network/basic-concepts/8.png)

- Application: Cung cấp giao diện nói chung (chat của Zalo)
- Presentation: Giải mã, mã hoá các thông tin (các emoji của Zalo)
- Session: Kiểm soát trao đổi thông tin và đồng bộ (chat nhóm Zalo)
- Transport: Chuyển thông tin từ ứng dụng này sang ứng dụng khác (Process to process delivery)
- Network: Mang từng gói tin từ phía gửi đến phía nhận (source to destination delivery)
    - Data link: Vận chuyển thông tin giữa hai router trong network core (host to host delivery)
- Data link: Vận chuyển thông tin giữa hai router trong network core (host to host delivery)
- Physical: Biến thông tin dạng bit thành tín hiệu điện (hoặc sóng AS, … tuỳ môi trường truyền dẫn)

#### Layered Internet protocol stack

- Giống mô hình trên, tuy nhiên gộp Application, Presentation, Session thành một layer chung là Application
- Protocol:
    - Quy định các dịch vụ được cung cấp như thế nào
- Encapsulation:
    - Message $M$
    - Segment ($H_t + M$) tại transport layer
    - Datagram ($H_n + H_t + M$) tại network layer
    - Frame ($H_d + H_n + H_t + M$) tại data link layer
    - Biến thành tín hiệu ở physical layer
    - Tới người nhận, lại giải mã từ đầu

![Quá trình đóng gói dữ liệu (Encapsulation) qua các tầng giao thức](public/network/basic-concepts/9.png)
