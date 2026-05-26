---
title: Tầng mạng - Data Plane (Network Layer - Data Plane)
date: 2026-05-26
excerpt: Chi tiết về Data Plane trong tầng mạng (Network Layer).
category: LEARNING
---
## Tổng quan về network layer

- Các service và protocol:
    - Segment được vận chuyển qua transport layer khi vào network layer sẽ chuyển thành datagram
    - Các protocol: host, router

### Forwarding và routing - Data plane và Control plane

- Forwarding: gói tin đến router theo một link sẽ được chuyển tiếp đến một output link phù hợp
- Routing: tìm đường đi tốt nhất từ bên gửi đến bên nhận
- Data plane và control plane
    - Data plane là tập hợp các chức năng liên quan đến forward gói tin
        - Data plane hoạt động nội bộ trong từng router
        - Quyết định datagram đến router input được chuyển đi router output thế nào
    - Control plane là tập hợp các chức năng liên quan đến định tuyến
        - Control plane hoạt động trên toàn mạng
        - Quyết định datagram đi đường nào để đi từ nguồn đến đích
        - Có 2 cách tiếp cận control plane: truyền thống và SDN
- Cách tiếp cận truyền thống (per-router control plane):
    - Chức năng control plane thực hiện trong các router. Từng bộ định tuyến trong tất cả các router router giao tiếp với nhau trong control plane
    - Sinh ra bảng định tuyến lưu ở data plane, sau đó control plane dùng bảng định tuyến để quyết định đường đi
    - Khó nâng cấp thuật toán định tuyến vì chúng được cài trong phần cứng → kéo lùi tốc độ phát triển
- Sofware-Defined Networking (SDN):
    - Chức năng của control plane được thực hiện ở một server khác. Các router chỉ forward theo thuật toán định tuyến được chúng tìm ra
    - Là công nghệ mới đang dần được nghiên cứu và áp dimgk

### Network service model

- Mỗi mạng có một network service model khác nhau. Mỗi mô hình có các tiêu chí được thoả mãn ở mức nhất định
- Một số service: guaranteed delivery, guaranteed delivery with bounded delay, in-order packet delivery, guaranted minimal bandwidth, security
- Internet: Best effort (không đảm bảo bất kỳ service nào trong số những cái trên)
    - Tuy vậy, thực tế thì chất lượng vẫn là chấp nhận được

## Router

![Cấu trúc phần cứng và các thành phần cốt lõi bên trong của một Router](public/network/network-layer-data-plane/1.png)

- Một router gồm:
    - Nhiều input port và nhiều output port (phần cứng)
    - Cơ chế chuyển mạch (swtching fabric) tốc độ cao (phần cứng)
    - Routing processor (phần mềm)
- Input port
    - Physical layer: thực hiện các chức năng Line termination như chuyển các tín hiệu dùng để truyền dẫn thành tín hiệu số
    - Link layer
    - Network layer: lookup, forwarding, queuing
        - Forwarding bằng bảng định tuyến
        - Forwarding dựa trên địa chỉ đích
- Switching fabrics:
    - Là cơ chế để chuyển từ cổng input sang cổng output
- Output port
    - Cấu trúc tương tự input port
- Routing processor
    - Thực hiện chức năng của control plane
    - Trong phương pháp truyền thống, nó chạy thuật định tuyến, lưu forwarding table và thông tin về trạng thái các link, và tính forwarding table
    - Trong SDN, nó lấy forwarding table từ bộ điều khiển

### Destination based forwarding

![Nguyên lý định tuyến dựa trên địa chỉ đích (Destination-based Forwarding)](public/network/network-layer-data-plane/2.png)

- Các địa chỉ được lưu theo dải (xác định bằng các địa chỉ có chung tiền tố). Địa chỉ đi vào thuộc về dải nào sẽ được forward theo interface tương ứng và đi vào output port đúng với interface này
    - Nếu không nằm trong dải nào, nó sẽ đi vào default interface
    - Sử dụng luật khớp tiền tố dài nhất

### Switching

- Switching fabric có một switching rate nhất định
- Có 3 kiểu chuyển:
    - Chuyển qua bộ nhớ
        - Có tốc độ chậm, phụ thuộc tốc độ RAM
        - Chỉ chuyển được một datagram một lần
        - Không sử dụng trong router hiện nay
        - ![Cơ chế chuyển mạch thông qua Bộ nhớ (Memory Switching)](public/network/network-layer-data-plane/3.png)
    - Chuyển qua bus
        - Chuyển datagram thông qua một bus
        - Có tốc độ phụ thuộc vào độ rộng của băng thông bus
        - Chỉ chuyển được một datagram một lần
        - Dùng trong hệ thống không cần tốc độ cao
        - ![Cơ chế chuyển mạch thông qua Bus chung (Bus Switching)](public/network/network-layer-data-plane/4.png)
    - Chuyển qua interconnection network
        - Dùng các loại mạng nối kiểu crossbar, clos, … cấu tạo từ nhiều bus
        - Tốc độ rất nhanh, nhưng đắt
        - ![Cơ chế chuyển mạch qua mạng kết nối chéo (Interconnection Network)](public/network/network-layer-data-plane/5.png)
### Output port processing

![Quy trình xử lý gói tin tại cổng đầu ra (Output Port Processing)](public/network/network-layer-data-plane/6.png)

- Đưa gói tin rời khỏi queue để chuyển đi chỗ khác
### Queuing

- Các gói tin sẽ đợi ở cả input port và output port
- Ở input port:
    - Các gói tin sẽ phải đợi đến lượt mới được fabric chuyển đi
        - Kể cả khi sử dụng interconnection network, gói tin vẫn phải đợi gói tin trước trên cùng đường dây của nó chuyển xong
- Ở output port:
    - Các gói tin sẽ đợi được chuyển đi nếu transmission rate của switch tốt hơn của link
    - Nếu queue quá dài, gói tin ở cuối sẽ bị mất
    - Các gói tin được chuyển đi theo cơ chế packet scheduling
- Lượng buffer cần thiết cho mỗi cổng là $$B = \frac{RTT\times C}{\sqrt{N}}$$
### Packet scheduling

- FIFO (first in first out)
- Priority Queuing: Các packet có độ ưu tiên cao hơn sẽ được đi trước
- WFQ (weighted fair queuing): Luân phiên giữa các mức ưu tiên khác nhau

## IP (Internet Protocol)

### Datagram format (IPv4)

![Cấu trúc định dạng gói tin IPv4 Datagram](public/network/network-layer-data-plane/7.png)

- IP Datagram = header + TCP/UDP segment
    - Tổng kích thước header là 40 bytes, (segment là 20 bytes)
- Header gồm:
    - Version: IPv4 hoặc IPv6 (4 bit)
    - Header length : kích thước header (ngoài options là 20 byte, options có thể có thêm)
    - Type of service (TOS): best effort, ECN, …
    - Datagram length: tổng kích thước datagram
    - Identifier, flag, frag offset: phục vụ phân mảnh
    - Time to live (TTL): số router còn lại mà datagram được phép đi qua
    - Upper layer protocol: TCP (6) hoặc UDP (17) (vẫn còn các số khác)
    - Header checksum: phát hiện lỗi
        - Cách tính: Ghép 2 bit liền nhau lại thành 1 số, rồi lấy tổng bù 1 của các số này
        - Nếu router phát hiện tổng + checksum có bit 0 thì bị lỗi
        - Cứ qua mỗi router lại phải tính lại một lần (vì có TTL thay đổi liên tục)
    - Source IP, destination IP
    - Các option
    - Data: packet từ transport layer

### Phân mảnh và ghép lại IP datagram

- Cần chia nhỏ gói tin vì các đường nối có MTU (max transfer size) có giới hạn nhất định
- Ghép lại các mảnh tại điểm đến
- VD: datagram 4000 bytes, MTU có 1500 bytes sẽ phải chia làm 3 gói tin với:
    - `length` là 1500, 1500 và 1040 (thực tế ta chia $3980 = 1480 + 1480 + 1020$, phần còn lại là header).
    - `16-bit identifier` là các số giống nhau
    - `offset`: 0, 185, 370 (các mảnh tin được ghép vào vị trí $0\times 8, 185\times 8, 370\times 8$
    - `fragflag`: 1, 1, 0 (nếu bằng 1 nghĩa là vẫn còn, 0 là ngược lại)

### Địa chỉ IPv4

- Địa chỉ IP
    - Là một dãy 32 bit gắn cho một interface của một host hoặc router.
        - Interface: kết nối giữa host/router và physical link
            - Interface là ranh giới giữa host và các link vật lý
            - Các interface kết nối với nhau qua switch
        - VD: trên máy, IP của wifi và IP của mạng có dây là khác nhau.
    - Địa chỉ IP có thể viết dưới dạng dãy nhị phân hoặc dạng các số thậm phân cách nhau bởi dấu .
    - IP addres của mọi thiết bị là khác nhau (trừ các thiết bị trong phạm vi NAT)

### Subnet

- Là tập hợp tất cả các interface có thể kết nối trực tiếp mà không cần qua router. Có thể chúng được kết nối qua một Ethernet switch hoặc WAP
- Địa chỉ IP của các interface trong cùng một subnet có các bit cao (bên trái) giống nhau. Phần giống nhau gọi là subnet part, phần kia gọi là host part
- Cách xác định subnet: Ngắt tất cả các đường nối giữa interface và router, các thành phần liên thông còn lại là các subnet
- Subnet mask: Số xác định độ dài subnet part của địa chỉ IP. VD: 223.1.1.0/24 có subnet mask là /24 hoặc 255.255.255.0
- Subnet address: Subnet part của địa chỉ IP của một interface. `subnet_mask & ip_address = subnet_ip_address`
- Cách đánh địa chỉ CIDR: `a.b.c.d/x`, với `x` là số bit trong phần subnet
- Lớp địa chỉ IP:
    - A: 1.0.0.0 đến 127.255.255.255 (bit cao nhất là 0)
    - B: 128.0.0.0 đến 191.255.255.255 (2 bit cao nhất là 10)
    - C: 192.0.0.0 đến 223.255.255.255 (3 bit cao nhất là 110)
    - D: 224.0.0.0 đến 240.255.255.255 (4 bit cao nhất là 1110)
    - E: các địa chỉ còn lại (4 bit cao nhất là 1111)
- Các địa chỉ IP đặc biệt:
    - Địa chỉ broadcast 255.255.255.255: Nếu một datagram có điểm đến là địa chỉ này, nó sẽ được gửi tới tất cả host trong cùng subnet
        - Router đôi khi cũng đẩy tin đến các subnet xung quanh
    - Địa chỉ “this host” 0.0.0.0
    - Địa chỉ loopback 127.0.0.1 (localhost)

### DHCP

- Một host có thể được cấp phát địa chỉ IP bằng cách hard-code (static) hoặc dùng giao thức DHCP (dynamic host configuration protocol)
- Default gateway: địa chỉ IP của router đầu tiên sau khi ra khỏi subnet
- Một số tính chất: plug-and-play, zeroconf
- DHCP là một giao thức client-server
- Server DHCP thường được tích hợp trong router với mạng quy mô nhỏ hoặc đặt trong một server riêng ở mạng lớn hơn
- Cơ chế hoạt động:
    - DHCP discover: Client broadcast bằng cách gửi tin (DHCP discovery message) bằng UDP vào 255.255.255.255:68 xem có server DHCP nào ở quanh không
    - DHCP offer: DHCP server sau khi nhận được tin sẽ broadcast lại DHCP offer message. Tin này chứa địa chỉ IP mà nó muốn cấp cho host
        - Ở bước này, có thể có nhiều DHCP server cùng trả lời một client và do đó sẽ có nhiều DHCP offer message
    - DHCP request: Client broadcast DHCP request message, chứa một địa chỉ IP mà DHCP server nào đó cấp cho nó
    - DHCP ACK: DHCP server broadcast DHCP ACK message để xác nhận đã hoàn thành cung cấp địa chỉ IP
    - ![Quy trình 4 bước cấp phát địa chỉ IP động qua giao thức DHCP](public/network/network-layer-data-plane/8.png)
- DHCP cung cấp thêm:
    - Địa chỉ IP của first-hop router (router đầu tiên cần đến để đi ra ngoài mạng)
    - Tên và địa chỉ IP của DNS server
    - Network mask (subnet mask)

### Cách lấy địa chỉ IP

- Các ISP cung cấp một dải địa chỉ IP (các địa chỉ IP chung tiền tố) cho các mạng, rồi các mạng lấy các địa chỉ IP trong dải đó phục vụ cho DHCP
    - Các ISP lấy địa chỉ IP từ ICANN
    - Hiện nay tất cả địa chỉ IPv4 đã được ICANN cấp phát hết
- Có 2 cách giải quyết tình trạng thiếu hụt địa chỉ IP là NAT và IPv6

### NAT (network address translation)

![Cơ chế biên dịch địa chỉ mạng NAT tại biên local network](public/network/network-layer-data-plane/9.png)

- Router có NAT chỉ có một địa chỉ IP thay vì là một subnet IP. Toàn bộ các thiết bị trong một local network sử dụng chung địa chỉ IP này để giao tiếp với bên ngoài
- Các máy bên trong vẫn có IP riêng, nhưng là private IP address. Khi một gói tin đi ra ngoài, nó luôn được đánh địa chỉ IP của mạng, với port number khác nhau phụ thuộc vào nguồn trong mạng
- Cách đánh địa chỉ: Địa chỉ private sử dụng một trong 3 địa chỉ sau: 10/8, 172.16/12, 192.168/16
- Mô phỏng quá trình gửi tin từ một máy trong local network:
    - Một host gửi tin từ địa chỉ a.b.c.d:p
    - Gói tin từ router đi ra dùng địa chỉ IP của mạng, port number lấy từ NAT translation table lưu trong router. Mỗi thiết bị ứng với một port number khác nhau
    - Quá trình nhận tin hoàn toàn tương tự
- Một số vấn đề:
    - Vi phạm nguyên tắc router chỉ được sử dụng đến network layer và nguyên tắc end-to-end, do port number chỉ được phép sử dụng ở transport layer để đánh cho các process
    - Máy bên ngoài local network dùng NAT không thể kết nối trực tiếp với các máy hoặc server bên trong

### IPv6

- Sử dụng 128 bit để đánh địa chỉ IP
- Luôn dùng 40 byte làm header
- Xử lý các datagram theo flow, là các loại tin mà host của nó yêu cầu được xử lý theo cách đặc biệt
- Datagram format: ![Cấu trúc định dạng gói tin IPv6 Datagram](public/network/network-layer-data-plane/10.png)
    - Version: số 6 (IPv6)
    - Traffic class: giống TOS ở IPv4 nhưng đặc trưng cho flow
    - Flow label: đánh loại flow
    - Payload length: kích thước packet được gửi trong datagram
    - Next header: giống protocol của IPv4
    - Hop limit: giống TTL IPv4
    - Source address, destination address: địa chỉ IPv6 128 bit
    - Data
- IPv6 lược bỏ:
    - Phân mảnh dữ liệu
        - Nếu router gặp dữ liệu quá lớn cho link tiếp theo, nó bỏ gói tin và gửi một thông báo lỗi về phía gửi
    - Header checksum: loại bỏ vì đã có checksum ở data link layer
    - Options

### Tunneling & encapsulation

![Cơ chế đường hầm IPv6 truyền tải qua hạ tầng mạng IPv4 (Tunneling)](public/network/network-layer-data-plane/11.png)

- Là cơ chế chuyển tin giữa các router hỗ trợ IPv6 thông qua các router IPv4
- Cách sử dụng: Trước khi đi vào đường hầm IPv4, router đóng gói toàn bộ gói tin IPv6 thành một gói tin IPv4. Khi ra khỏi đường hầm, router ở vị trí này lại lấy gói tin IPv6 ra
