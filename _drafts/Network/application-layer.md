---
title: Tầng ứng dụng (Application Layer)
date: 2026-05-26
excerpt: Tìm hiểu về tầng ứng dụng (Application Layer) trong mô hình mạng.
category: LEARNING
---

## Các nguyên lý của ứng dụng mạng

### Ứng dụng mạng

- Ứng dụng chạy được trên nhiều end system khác nhau và trao đổi TT dc
- Không cần viết chương trình cho core network
    - Network core không sử dụng layer này

### Các mô hình ứng dụng (application architecture)

- Mô hình client-server
    - Server:
        - Luôn bật
        - Có IP cố định
        - Đặt ở các trung tâm dữ liệu (data center)
    - Client:
        - Trao đổi thông tin với server
        - Không có IP cố định
        - Không trao đổi một cách trực tiếp với các client khác
    - VD: HTTP, Web, FTP, Telnet, email
- Mô hình P2P
    - Hoạt động dựa trên các kết nối trực tiếp giữa hai host (gọi là peer)
    - Không cần bật thường xuyên
    - Yêu cầu và nhận kết quả dịch vụ từ chỗ khác
    - Có tính chất self-scalability
    - VD: P2P file sharing như BitTorrent

### Process communicating

- Process: chương trình chạy trong một host
- Hai process trong một host trao đổi thông tin bằng inter-process comminucation
- Hai process khác host nhau trao đổi thông tin thông qua message
- Trong các mô hình ứng dụng, ta chia ra client process và server process
    - Client process là process bắt đầu giao tiếp trước
    - Server process là process đợi để được kết nối
    - Cách chia này áp dụng cho cả mô hình P2P

### Process/Network interface

- Socket
    - Là một software interface đóng vai trò là cửa nhận và gửi thông tin, nằm ở điểm giao giữa application layer và transport layer

![Giao diện lập trình ứng dụng Socket giữa tầng ứng dụng và tầng giao vận](public/network/application-layer/1.png)

- Socket đóng vai trò là API (application programming interface) giữa application layer và mạng
- Địa chỉ của process
    - Process có một identifier là địa chỉ IP và port number
        - Port number gắn với process (nó là đặc trưng của application layer)
    - Một số port phổ biến:
        - **20, 21**: FTP
            - 20: bắt đầu kết nối FTP
            - 21: dùng trong quá trình kết nối
        - **25**: SMTP (587 với SMTPS)
        - **67, 68**: DHCP
            - 67: client
            - 68: server
        - **80**: HTTP
        - **143**: IMAP/POP3

### Các tiêu chí đánh giá service

- Data integrity (bảo toàn dữ liệu): Tuỳ vào loại app mà cần thông tin đầy đủ  và chính xác tuyệt đối (reliable data transfer) hoặc tương đối (loss-tolerant data transfer)
- Timing: Một số ứng dụng yêu cầu độ trễ cực thấp (như điện thoại Internet VoIP, trò chơi trực tuyến).
- Throughput: Một số app cần throughput rất cao mới hoạt động được (bandwidth-sensitive) như các dịch vụ phát media, gọi và stream, một số khác thì không cần (elastic) như thư điện tử, truyền file và Web transfer
- Security

### Một số service của Internet

- TCP: reliable transport (đảm bảo không mất mát), flow control (không tràn tin), congestion control, connection-oriented. Không đảm bảo timing, throughput và security
    - Một số service sử dụng: SMTP (gửi thư), telnet (điều khiển từ xa), HTTP (web), FTP (file transfer), các dịch vụ stream, gọi điện qua internet
- UDP: unreliable data transfer, không đảm bảo bất kỳ một service nào khác
    - Một số service sử dụng: các ứng dụng gọi điện qua internet

### Application layer protocol

- Giao thức này quy định các process chạy thế nào trên các host khác nhau
- Các giao thức gồm:
    - loại message: request, response
    - message syntax: trong đó có các trường nào
    - message semantics: ý nghĩa thông tin trong các trường
    - quy tắc để lúc nào nhận, lúc nào trả lời tin
- Open protocol: protocol có thể được sử dụng bởi mọi đối tượng, như HTTP, SMTP
    - Proprietary protocol: các giao thức trao đổi thông tin không công khai

## HTTP và Web

### Tổng quan

- Web
    - Web chứa các object (file HTML, ảnh JPEG, applet Java, …) lưu trong các web server khác nhau
    - Web chứa các file HTML chứa các object
        - Bản thân file HTML này cũng là một object
    - Tất cả object trên các web đều có một địa chỉ là URL
        - URL chứa hostname và object path name
    - Web browser: đại diện cho phía client của web
    - Web server: chứa các web object và các URL
- HTTP (hypertext transfer protocol):
    - Là application layer protocol của web
    - Dùng mô hình client-server với client là trình duyệt và server là server của web
    - Dùng TCP
    - Trao đổi message qua request và response
        - Các message được gửi và nhận thông qua socket
        - Request: dùng ASCII, gồm method (POST, GET, HEAD, PUT), header. data
        - Response: dùng ASCII, gồm status line (chứa status code), header, data
            - Status code: 200 OK, 301 Moved Permanently, 400 Bad Request, 404 Not Found, 500 Internal Server Error, 505 HTTP Version Not Supported
    - Là stateless protocol: khi gửi 2 request giống nhau cùng một lúc, nó sẽ gửi lại 2 respond giống nhau cho 2 cái đó

### Trao đổi thông tin qua HTTP

- Với kết nối không cố định (non-persistent connection):
    - Phía client bắt đầu một kết nối TCP ở cổng 80 với server. Kết nối sau khi được thiết lập sẽ có cổng ở cả 2 phía client và server
    - Client gửi server một request message qua socket của nó
    - Server nhận được request message sẽ lấy object trong bộ nhớ của nó, đưa vào response message rồi gửi trở lại qua socket
    - Server yêu cầu ngừng kết nối TCP
    - Phía client nhận được response message và dừng kết nối TCP
    - Khi muốn gửi một tin khác, quá trình trên được bắt đầu lại từ đầu
- RTT: thời gian nhận được tin kể từ khi gửi tin đi
    - Trong điều kiện kết nối lý tưởng, một lần giao tiếp dùng hết $2RTT$ thời gian
- Với kết nối cố định (có từ HTTP 1.1 +): server sẽ không yêu cầu đóng kết nối TCP sau khi gửi file và TCP chỉ đóng khi không có yêu cầu sau một khoảng thời gian

### Message Format

- Request: ![Định dạng gói tin yêu cầu HTTP Request Message](public/network/application-layer/2.png)

- Response: ![Định dạng gói tin phản hồi HTTP Response Message](public/network/application-layer/3.png)

### Cookies

- Lưu giữ trạng thái hiện tại của người dùng
- Gồm 4 thành phần
    - Cookie header line nằm trong HTTP response message
    - Cookie header line nằm trong HTTP request message
    - Cookie file đặt trong hệ thống của host, quản lý bởi web browser
    - Backend database ở web server
- Sau khi nhận yêu cầu kết nối TCP, server sẽ gắn cho client một cookie id mới dưới dạng header `Set-cookie: x` của response message. Sau đó, mỗi lần client muốn gửi request message lên server, browser sẽ tìm trong các cookie để thấy trang hiện tại, rồi gửi kèm lên request message dưới dạng header `Cookie: x`.

### Web cache (proxy server)

- Dùng một cache giảm thời gian request đến trang đích bằng cách tạo một bản copy của trang đích và lưu tại proxy server

![Mô hình hoạt động của Web Cache (Proxy Server)](public/network/application-layer/4.png)

- Thông tin lưu trên cache không được cập nhật
    - Giải quyết bằng conditional GET: gửi một request lên server chứa `If-modified-since: <time>`, chờ response nếu có thay đổi thì nhận được response chứa status `200 OK`, nếu không có gì thay đổi thì nhận status`304 Not Modified`

## Email, SMTP và IMAP

- Các thành phần chính của email:
    - User agent
    - Mail server:
        - Mailbox: chứa thư chưa nhận trước khi đẩy vào user agent
        - Message queue: chứa thư gửi đi trước khi được gửi qua SMTP
    - GIao thức SMTP (Simple Mail Transfer Protocol)

![Quy trình gửi nhận thư điện tử qua giao thức SMTP](public/network/application-layer/5.png)

### SMTP

- Dùng TCP để chuyển tin giữa các người dùng (port 25)
- Quá trình gửi thư:
    - User agent hướng dẫn người dùng viết email, soạn tin, gửi tin
    - User agent đẩy thư lên server. Nó sẽ nằm tại message queue
    - SMTP server của bên client (bên gửi) thiết lập kết nối TCP tới SMTP server của bên server (bên nhận)
    - Tiến hành SMTP handshake. Sau đó, SMTP server bên client sẽ gửi thư cho SMTP server bên server
    - Thư được lưu vào hộp thư SMTP server
    - Bên nhận dùng user agent để đọc thư trong hộp thư
- Kết nối TCP của SMTP là trực tiếp, không qua bất kỳ thành phần trung gian nào
- Nội dung của message trong giao thức SMTP gồm `HELO, MAIL FROM, RCPT TO, DATA, QUIT`
    - Nội dung của thư được đặt giữa hai phần `DATA` và `QUIT`
- Sử dụng command/response interation như HTTP
- **Chú ý**: SMTP là giao thức đẩy mail theo một chiều. User agent bên nhận không thể sử dụng SMTP để lấy thư về từ mail server

### IMAP

![Quy trình truy xuất thư từ Mail Server qua giao thức IMAP](public/network/application-layer/6.png)

- Là một giao thức dùng để nhận thư từ mail server

## DNS (domain name system)

- DNS:
    - Là một CSDL phân tán để ánh xạ tên miền vào địa chỉ IP
    - Là một giao thức trong application layer cho phép các host truy vấn trên CSDL này
- Quy trình:
    - Một thiết bị đóng vai trò là client
    - Trình duyệt tách hostname từ URL cần tìm kiếm, và đưa nó đến phía client của ứng dụng DNS
    - DNS thực hiện truy vấn hostname này trên CSDL ở DNS server (sử dụng UDP, port 53)
    - DNS client nhận được một phản hồi chứa IP của hostname
    - Lúc này, trình duyệt mới có thể yêu cầu kết nối TCP khi đã có địa chỉ IP
- Các dịch vụ của DNS:
    - Chuyển từ hostname → IP
    - Host aliasing (redirect)
    - Mail server aliasing
    - Load distribution

### Mô hình phân cấp DNS

- Root DNS Server
    - Contact-of-last-resort by name server that cannot resolve name
    - Rất quan trọng, buộc phải có để internet hoạt động
        - DNSSEC cung cấp ảo mật
    - ICANN quản lý
- Top Level Doman (.com, .org, .edu, …)
    - .com đang được quản lý bởi Verisign
- Authoritative (.vnu.edu.vn, …)
- Local DNS name server
    - Nơi nhận yêu cầu truy vấn DNS
    - Được cung cấp bởi các ISP cấp thấp
    - Thực hiện caching để tăng tốc độ tìm, nếu không tìm được sẽ hỏi lên trên

### DNS record

- RR format: `(name, value, type, ttl)`
    - `type = A`: `name` là hostname, `value` là IP
    - `type = NS`: `name` là domain, `value` là hostname của authoritative DNS biết được host của domain này là gì
    - `type = CNAME`: `name` là alias, `value` là tên thật của domain
    - `type = MX`: dùng cho SMTP, `name` là alias của mail server, `value` là tên thật của mail server
    - `ttl`: thời gian để record tồn tại trong cache (sau đó sẽ bị xoá)
- Cấu trúc của query và reply DNS

![Cấu trúc gói tin truy vấn và phản hồi của DNS](public/network/application-layer/7.png)

- Thành lập tên miền
    - Đăng ký tên miền từ một nhà cung cấp DV tên miền (registrar)
- Vấn đề bảo mật
    - DDoS
    - Spoofing

## P2P File Distribution

![So sánh thời gian phân phối file giữa mô hình Client-Server và P2P](public/network/application-layer/8.png)

- Là quá trình phân phối một file từ server cho nhiều host khác
- Thời gian phân phối tối thiểu:
    
    $$
    D\geq \max\left\{\frac{F}{u_s}, \frac{F}{d_{min}},\frac{NF}{u_s+\sum\limits_{i=1}^Nu_i}\right\}
    $$
    
    - $F$: kích thước của file
    - $u_s$: tốc độ upload của server
    - $d_{min}$: tốc độ download nhỏ nhất của các máy
- BitTorrent hoạt động trên cơ sở tracker: Khi có một máy tham gia vào mạng, nó sẽ định kỳ gửi thông tin đến tracker là nó vẫn ở trong mạng. Tracker sẽ kiểm soát các máy tham gia mạng

## Video streaming

### Video

- Video là tập hợp các hình ảnh được hiển thị với một tốc độ nào đó
- Bit rate (bps)

### Stream video

- HTTP: Dùng một request `GET` để lấy các khung hình từ server, giải nén chúng rồi hiển thị trên màn hình
    - Được sử dụng bởi YouTube
    - Tất cả client sẽ cùng nhận được một bản encoding của video, bất kể với bandwidth nào
- DASH (Dynamic Adaptive Streaming over HTTP): Video được encode thành nhiều bit rate khác nhau với chất lượng khác nhau
    - Client sẽ lựa chọn bản có chất lượng phù hợp nhất với bandwidth của họ
    - Các phiên bản này được lưu trong HTTP server dưới dạng manifest file
    - Dễ dàng chuyển đổi linh hoạt giữa các phiên bản khác nhau

### CDN (Content Provider Network)

- Là mạng quản lý các server ở nhiều khu vực địa lý khác nhau, trong đó lưu trữ nhiều bản lưu của các video, các nội dung web khác trong server
- CDN hướng người dùng đến khu vực có chất lượng tốt nhất
- Các CDN hoạt động theo nguyên lý: enter deep và bring home
- CDN có thể là private hoặc thuộc về một bên thứ ba
