---
title: Tầng giao vận (Transport Layer)
date: 2026-05-26
excerpt: Tìm hiểu về tầng giao vận (Transport Layer), các giao thức TCP và UDP.
category: LEARNING
---
## Tổng quan

### Quan hệ với Network Layer

- Khác biệt với network layer:
	- Transport layer vận chuyển thông tin giữa các process chạy trên các host khác nhau
	- Network layer vận chuyển thông tin giữa các host khác nhau
### Protocol và service của transport layer

- Transport protocol: TCP, UDP
- Transport service: Chia app message thành segment, chuyển qua network layer ở bên gửi; ghép các đoạn lại thành message rồi chuyển qua app. layer ở bên nhận
- Đơn vị vận chuyển của tầng này là packet

## Multiplex và demultiplex

![Quá trình ghép kênh (Multiplexing) và phân kênh (Demultiplexing)](public/network/transport-layer/1.png)

- Transport layer xử lý thông tin từ các đoạn tin nhận được từ network layer
- Các thông tin đi vào đều phải qua các socket
- Sender multiplex: Transport layer bên gửi tập hợp dữ liệu từ các socket khác nhau, gắn header (phục vụ cho demultiplex) rồi chia ra thành các segment cho network layer (ghép kênh)
- Receiver demultiplex: Transport layer bên nhận chuyển dữ liệu bị phân mảnh vào đúng socket khi nhận được các segment (phân kênh)
- Một segment gồm hearer và data. Trong header có source port và destination port, đã được định nghĩa ở application layer
- Sử dụng IP và port number để phân các segment vào đúng socket
    - Port number nằm trong khoảng từ 0 đến 65535.
    - Các port number dưới 1024 gọi là “well known port number” và chỉ có thể sử dụng trong đúng giao thức mà nó dùng cho
    - Các port number còn lại có thể dùng cho kết nối UDP
- Connectionless multiplex & demultiplex:
    - Khi host nhận UDP segment, nó kiểm tra xem des port của các segment có giống nhau không, nếu giống nhau thì cùng sử dụng một socket để nhận tin ngay cả khi có IP khác nhau
- Connection oriented multiplex & demultiplex:
    - Cả 4 giá trị src IP, src port, des IP, des port được dùng để chia cổng
    - Các server dùng TCP sẽ để một cổng “welcoming socket” để đợi một yêu cầu thiết lập kết nối từ client

## UDP

- Tính chất:
    - “No frill”, “Bare bones”, có thể mất thông tin hoặc sai thứ tự
    - Connectionless: Không cần handshaking giữa server và người nhật, mỗi UDP segment được xử lý độc lập
    - Dùng trong DNS, SNMP
    - Dùng khi cần thêm reliability ở application layer, error recovery cho một số ứng dụng
- Vì sao vẫn có UDP?
    - Application layer dễ dàng kiểm soát được thông tin được gửi và khi nào được gửi
        - Hữu ích trong các ứng dụng cần thông tin real-time
    - Không cần thiết lập kết nối
    - Không cần quan tâm connection state của ng gửi và nhận
    - Packet nhẹ hơn (8 byte header so với 20 byte)

### UDP segment format

![Cấu trúc gói tin UDP segment](public/network/transport-layer/2.png)

### UDP checksum

- Dùng để kiểm tra các lỗi trong segment được chuyển đi bởi bên gửi
- Cách tính:
    - Chia toàn bộ segment thành các đoạn con 16 bit
    - Lấy tổng bù 1 của tất cả các segment (bằng cách đảo từng bit một)
        - Nếu xảy ra tràn số, kết quả sẽ lược bỏ các bit có thứ tự cao hơn 16
        - VD:  đoạn tin chia được thành 2 từ máy `1011101110110101` và `1000111100001100` sẽ có checksum là `1011010100111101` (là bù 1 của tổng 2 từ máy trên)
- Phía gửi tính giá trị trên của các trường khác (trừ checksum) rồi đưa vào trường checksum
- Phía nhận tính tổng của tất cả các đoạn 16 bit (kể cả checksum) rồi kiểm tra xem đúng không. Nếu kết quả của tổng là `1111111111111111` thì kết quả được coi là hợp lệ. Ngược lại thì chắc chắn đã xuất hiện lỗi.
- UDP không cung cấp phương pháp nào để khắc phục lỗi

## Nguyên lý truyền tin đáng tin cậy

- Vấn đề: Dữ liệu cần phải truyền theo một đường đáng tin cậy, tuy nhiên trên thực tế không được như vậy do nó phải đi trên network layer là nền tảng không đáng tin cậy
- Interface của reliable data transfer protocol (rdt)
    - `rdt_send()`: App gọi hàm này để thông báo dữ liệu đã được chuyển đi
    - `udt_send()`: Tầng transport gọi để thông báo cho tầng network là có dữ liệu dc gửi đi
    - `rdt_rcv()`: Gọi khi dữ liệu đã đến bên nhận của kênh truyền
    - `deliver_data()`: rdt gọi để chuyển dữ liệu lên app layer

### Trường hợp đường truyền tin đáng tin cậy

- rdt 1.0: Reliable transfer trong điều kiện chắc chắn đường truyền đáng tin cậy
    - Điều kiện: không có lỗi bit, không mất tin
    - FSM (máy hữu hạn trạng thái) miêu tả
    - ![FSM cho giao thức rdt 1.0 truyền dữ liệu tin cậy trên kênh truyền hoàn hảo](public/network/transport-layer/3.png)
### ARQ Protocol

- rdt 2.0: Trong điều kiện kênh truyền tin có lỗi về bit
    - Điều kiện: một số bit bị lật trong quá trình truyền tin
    - Giải pháp:
        - Dùng checksum để check
        - Khôi phục bằng cách thông báo cho bên gửi để gửi lại
            - Nếu gửi ACK (acknowledgement) nghĩa là ok, nếu là NAK (not acknowledgement) thì cần phải gửi lại
            - Cơ chế này gọi là ARQ (Automatic Repeat reQuest)
        - Theo cách này, rdt 2.0 là stop-and-wait protocol
    - FSM:
        - Bên gửi: ![FSM phía gửi của rdt 2.0 (truyền tin có lỗi bit)](public/network/transport-layer/4.png)
		
        - Bên nhận: ![FSM phía nhận của rdt 2.0 (truyền tin có lỗi bit)](public/network/transport-layer/5.png)
### Sequence number

- rdt 2.1: Trong điều kiện truyền tin có lỗi, và việc gửi ACK/NAK cũng bị lỗi
    - Giải pháp:
        - Gửi thêm gói tin nếu không rõ trạng thái (ACK/NAK) được gửi lại
            - Sẽ gây trùng lặp nếu gói tin đó đã đến đích
        - Để tránh trùng lặp, gắn thêm id (sequence number) cho mỗi gói tin, và làm bên nhận xoá bỏ trùng lặp
            - Sequence number chỉ cần là 0 và 1: nếu bên nhận nhận được số giống gói cuối đã nhận, nó sẽ coi là trùng lặp
    - FSM:
        - Bên gửi: ![FSM phía gửi của rdt 2.1 (xử lý lỗi ACK/NAK bị nhiễu)](public/network/transport-layer/6.png)
        
        - Bên nhận: ![FSM phía nhận của rdt 2.1 (xử lý lỗi ACK/NAK bị nhiễu)](public/network/transport-layer/7.png)

- rdt 2.2: Điều kiện như 2.1 nhưng loại bỏ thông báo NAK
    - Giải pháp:
        - Phía nhận sẽ gửi ACK + sequence number của gói cuối cùng nhận được thành công
            - Nếu bên gửi nhận lại hai tín hiệu ACK giống nhau liên tiếp thì gói vừa gửi (mang sequence number khác) không được gửi thành công

### Cơ chế timeout

- rdt3.0: Trong điều kiện đường truyền có lỗi và mất mát
    - Giải pháp:
        - Chờ ACK một khoảng thời gian nhất định, nếu không nhận được thì phải gửi lại (cơ chế timeout)
            - Có thể xảy ra tình huống ACK gửi lại bị chậm dẫn đến timeout trước, nhưng không ảnh hưởng gì
            - ![Kịch bản hoạt động của rdt 3.0 trong điều kiện không mất gói](public/network/transport-layer/8.png)
            - ![Kịch bản hoạt động của rdt 3.0 khi xảy ra mất gói tin](public/network/transport-layer/9.png)
            - ![Kịch bản hoạt động của rdt 3.0 khi mất ACK hoặc xảy ra hiện tượng Timeout](public/network/transport-layer/10.png)

- Tới đây ta đã xây dựng thành công một giao thức truyền tin đáng tin cậy (theo cơ chế stop-and wait)

### Giao thức truyền tin đáng tin cậy có pipeline

- Pipeline: Gửi một loạt gói tin rồi mới đợi phản hồi
- Pipeline làm phát sinh một số vấn đề:
    - Cần nhiều sequence number hơn (vì bên nhận nhận nhiều gói tin một lúc)
    - Xử lý timeout thông thường không còn hợp lý
- Xử lý các vấn đề trên bằng 2 cách: go-back-$N$ và selective repeat

### Cơ chế go-back-$N$

- Phía gửi gửi một loạt $N$ gói tin ⇒ sequence number phải chỉnh lại thành số có $k$ bit
    - Các số sử dụng được nằm trong một cửa sổ có độ dài $N$. Trước khoảng này là các số đã sử dụng để đánh số và đã nhận được ACK.
    - Trong cửa sổ, một vài số được đánh dấu đã gửi, chưa ACK. Nếu muốn gửi gói tin mới, phải lấy ngoài các số này
    - Sau khi hoàn thành lượt gửi hàng loạt này, cửa sổ sẽ được đẩy lên 1 vị trí

![Cơ chế cửa sổ trượt Go-Back-N](public/network/transport-layer/11.png)

- Phía gửi chỉ đẩy cửa sổ lên nếu nhận được cummulative ACK `ACK(N)` (nghĩa là đã nhận được tất cả các gói tin từ $1$ đến $N$)
- Phía gửi sẽ tự động gửi lại tất cả $N$ gói tin ở cửa sổ hiện tại nếu có timeout xuất hiện
- Phía nhận chỉ nhận các gói tin đúng thứ tự sequence number, tức là sau $N$ nhất định phải là $N + 1$. Nếu nhận gói tin khác thì sẽ bị huỷ.
    - Có thể bị trùng lặp
- Ví dụ: Bên gửi gửi 4 gói $0, 1, 2, 3$, tuy nhiên gói $2$ bị mất. Bên nhận sẽ nhận được $0$, gửi lại `ACK(0)`, rồi nhận được $1$, gửi `ACK(1)`. Khi nhận được $3$, gói tin này bị huỷ bỏ và bên nhận chỉ gửi lại `ACK(1)`. Sau khi bên gửi nhận được `ACK(0)`, cửa sổ dịch lên $1$ và gói tin $4$ được gửi đi, tuy nhiên bên nhận không nhận được và gửi lại `ACK(1)`. Tình huống tương tự xảy ra khi nhận được `ACK(1)` ở bên gửi và gửi gói $5$ đi. Do không nhận được `ACK(2)`, bên gửi phát hiện timeout. Lúc này, nó sẽ gửi lại các gói tin $2, 3, 4, 5$, tương ứng với vị trí cửa sổ hiện tại.

![Kịch bản truyền dữ liệu và xử lý lỗi với giao thức Go-Back-N](public/network/transport-layer/12.png)

### Cơ chế Selective repeat

- Cho phép gửi ACK một cách riêng biệt với từng gói tin khi bên nhận đã nhận nó.
    - Các gói tin sai thứ tự sẽ được lưu lại trong buffer của bên nhận
- Ở phía gửi, nếu có gói tin bị timeout (sau một thời gian không nhận được ACK của nó) thì sẽ phải gửi lại gói này
- Ví dụ: Vẫn với tình huống trên, khi gói tin thứ $3$ được gửi, phía nhận sẽ đưa gói tin này vào buffer rồi gửi `ACK(3)`.  Bên gửi gửi các gói $4, 5$ sau khi nhận `ACK(0), ACK(1)` , bên nhận sẽ đưa các gói này vào buffer do chưa đúng thứ tự. Khi bên gửi phát hiện timeout và gửi lại gói $2$, bên nhận sẽ nhận gói tin này, chuyển nó lên application layer cùng với các gói trong buffer theo đúng thứ tự

![Kịch bản truyền dữ liệu và xử lý lỗi với giao thức Selective Repeat](public/network/transport-layer/13.png)

## TCP

### Tính chất chung

![Đặc tính luồng dữ liệu liên tục của TCP](public/network/transport-layer/14.png)

- point-to-point: 1 gửi 1 nhận
- Dữ liệu gửi theo byte
- Full duplex (hai chiều): cho phép gửi và nhận hai chiều theo MSS (maximum segment size)
    - MSS thường là 1460 byte
- Sử dụng pipeline và cummulative ACK
- Connection-oriented: cần thiết lập kết nối
    - Three-way handshake: cần phải gửi đi gửi lại 3 segment giữa 2 host để thiết lập kết nối được
- Flow control

### TCP segment format

![Cấu trúc phân đoạn TCP segment](public/network/transport-layer/15.png)

- Các bit thông tin:
    - ACK: có ACK hay không
    - CWR, ECE: thông báo có tắc nghẽn
    - URG: bên trong segment này có dữ liệu “urgent”, có byte cuối của phần này được chỉ vào bởi Urgent data pointer
    - PSH: nếu bằng 1 thì phải gửi tin lên tầng trên ngay
    - RST, SYN, FIN: thiết lập kết nối
- Recieve window: Số bit bên nhận có thể nhận được
- Sequence number: Là số thứ tự đầu tiên của byte đầu tiên segment
    - VD: Có 3 segment có kích thước 20B, 40B, 20B xếp theo đúng thứ tự đó và có số thứ tự của các bit là $1$ đến $20$, $21$ đến $60$, $61$ đến $80$. Sequence number của các segment trên lần lượt là $1, 21, 61$.
- ACK number: Sequence number của byte tiếp theo nó muốn nhận
    - VD: Giả sử đã nhận được gói tin có sequence number là $1$ ở ví dụ trên, trên thực tế nó đã nhận được các byte từ $1$ đến $20$. Bên nhận sẽ gửi lại `ACK(21)`. Tương tự, nếu đã nhận gói tin có sequence number là $21$, nó sẽ gửi lại `ACK(61)`.

### RTT và Timeout:

- RTT: khoảng thời gian từ lúc gói tin bắt đầu được gửi đi từ phía gửi cho đến lúc phỉa gửi nhận được một tín hiệu ACK của gói tin đó
- Timeout luôn phải lớn hơn RTT
- Estimated RTT tại một thời điểm được tính bằng các estimated RTT trước đó
- Timeout:

$$
EstimatedRTT(N) = 0.875\times EstimatedRTT(N-1) + 0.125 \times SampleRTT(N)
$$

$$
DevRTT(N) = (1-\beta)\times DevRTT(N-1)+\beta|SampleRTT(N)-EstimatedRTT(N)|
$$

$$
Timeout(N) = EstimatedRTT(N)+4\times DevRTT(N)
$$

- Một số tình huống:
    - ACK lost: Sẽ gây timeout, sau đó chỉ việc gửi lại
    - Premature timeout: Gửi ACK của sequence number cao nhất theo đúng cơ chế cumulative ACK
    - Một ACK của pipeline bị mất: Nếu có ACK của một gói sau đó, không cần phải gửi lại
- Fast retransmit: Gửi lại gói tin nếu chắc chắn đã bị mất gói tin (nhận được cùng một loại ACK nhiều lần) mà không cần đợi timeout
- Phương pháp xử lý lỗi của TCP là sự kết hợp của cả go-back-$N$ và selective repeat

### Flow control

- Giá trị recieve window `rwnd` trong segment là số byte tối đa mà bên nhận có thể tiếp nhận
- Được tính bằng kích thước buffer còn trống của phía nhận

### Connection management

- Thiết lập kết nối:
    - Bên gửi gửi một đoạn TCP đặc biệt (SYN segment) tới bên nhận không chứa dữ liệu từ application layer. Segment này có bit `SYN = 1` và sequence number được chọn ngẫu nhiên
    - Bên nhận sau khi lấy được segment này từ datagram sẽ phân bổ tài nguyên cho buffer và các biến liên quan đến kết nối. Bên nhận gửi lại một segment (SYNACK segment) chứa `SYN = 1`, ACK number là sequence number của gói tin được gửi từ bên gửi + 1, và một sequence number được nó tự chọn.
    - Bên gửi sau khi nhận được SYNACK cũng phân bổ tài nguyên cho buffer và các biến. Quá trình trao đổi thông tin bắt đầu diễn ra
        - Ở các bước sau bit SYN sẽ được đặt là 0

![Quy trình thiết lập kết nối TCP qua cái bắt tay 3 bước (3-way handshake)](public/network/transport-layer/16.png)

- Kết thúc kết nối: Quá trình hoàn toàn tương tự như khi bắt đầu, chỉ khác là các segment sẽ sử dụng bit FIN thay vì bit SYN

![Quy trình giải phóng và đóng kết nối TCP](public/network/transport-layer/17.png)

- Trong quá trình kết nối, phía gửi và phía nhận sẽ trải qua các TCP state khác nhau:
    - Phía gửi: ![FSM biểu diễn các trạng thái hoạt động phía gửi TCP](public/network/transport-layer/18.png)
    
    - Phía nhận: ![FSM biểu diễn các trạng thái hoạt động phía nhận TCP](public/network/transport-layer/19.png)

## Nguyên lý kiểm soát tắc nghẽn

### Nguyên nhân và hậu quả

- Nguyên nhân:
    - Do sự tồn tại của nhiều luồng tín hiệu đi theo nhiều hướng khác nhau trên cùng một đường dẫn của một hệ thống dùng chung tài nguyên
    - Do dung lượng của buffer là có hạn
    - Do trên thực tế đường đi còn phải đi qua các router, tại các router này còn có các gói tin của các đường đi khác
- Hậu quả:
    - Xuất hiện tình trạng queue delay dài ở router do khối lượng packet đến nó quá lớn, gần với thông lượng tối đa của link
    - Bên gửi không thể biết buffer bị tràn và phải gửi lại gói tin nếu nhận được tín hiệu từ buffer là nó sắp tràn (sẽ gây premature timeout khi mạng nghẽn)
    - Nếu các phản hồi về buffer bị premature timeout, sẽ xuất hiện nhiều gói tin gửi lại không cần thiết, càng làm tình trạng thêm trầm trọng
    - Gói tin đã xử lý xong có thể bị bít hết đường ra (bị đường khác chiếm hết throughput) và bị mất. Việc xử lý gói tin này qua hàng loạt router trước đó coi như vô dụng

### Các phương hướng kiểm soát tắc nghẽn

![Hai phương pháp kiểm soát tắc nghẽn: End-to-End và Network-Assisted](public/network/transport-layer/20.png)

- End-to-end:
    - Mọi công việc được xử lý trực tiếp trên transport layer mà không cần hỗ trợ từ network layer
    - Tất cả mọi việc kiểm soát đều dựa trên quan sát tình trạng của packet (bị mất hay không, delay lâu không)
- Network assisted:
    - Bên gửi và bên nhận nhận được tình trạng giao thông mạng hiện tại của mạng từ router

## Cơ chế kiểm soát tắc nghẽn của TCP

### Kiểm soát tắc nghẽn kiểu truyền thống (end-to-end)

- Ý tưởng: Phía gửi sẽ thay đổi tốc độ gửi dựa trên tình hình giao thông mạng hiện tại
- Cách kiểm soát tốc độ gửi:
    - Phía gửi giữ một giá trị congestion window `cwnd` là tốc độ mà TCP có thể gửi tin vào mạng. Lượng tin gửi đi cần thoả mãn:
    $$
    LastByteSend - LastByteACK \leq \min\{cwnd, rwnd\}
    $$
    - Giá trị `cwnd` thay đổi được và làm thay đổi tốc độ gửi gói tin
        - Tính chất này gọi là self-clocking
- Cách TCP nhận biết có tắc nghẽn
    - Nếu có tắc nghẽn trên đường đi, gói tin sẽ bị huỷ bỏ. Khi đó, phía gửi sẽ bị timeout hoặc nhận được vài cái ACK giống nhau, từ đó phát hiện ra tắc nghẽn

### Thuật toán TCP AIMD

![Biểu đồ tốc độ truyền tin của thuật toán TCP AIMD](public/network/transport-layer/21.png)

- Trạng thái Slow Start
    - Lúc mới thiết lập kết nối, khởi tạo `cwnd = MSS` và ngưỡng slow start `ssthresh = 64` (KB)
        - Dẫn tới tốc độ ban đầu xấp xỉ $\frac{MSS}{RTT}$
    - Cứ mỗi lần phía gửi nhận được một ACK, `cwnd += MSS`
        - Như vậy, cứ mỗi RTT thì tốc độ gửi lại nhân đôi (vì tính chất của pipeline)
    - Nếu xảy ra timeout:
        - Phía gửi gửi lại tin
        - Gán `ssthresh = cwnd / 2` và `cwnd = MSS`
    - Nếu `cwnd == ssthresh`, chuyển sang trạng thái Congestion Avoidance
    - Nếu nhận được 3 cái ACK giống hệt nhau liên tiếp:
        - Phía gửi kết thúc đếm giờ, gửi lại gói tin
        - Gán `ssthresh = cwnd / 2` và `cwnd = ssthresh + 3 * MSS`
        - Chuyển sang trạng thái Fast Recovery
- Trạng thái Congestion Avoidance
    - Mỗi lần phía gửi nhận được một ACK, `cwmd += MSS * (MSS / cwnd)`
        - Ví dụ, `cwnd = 14600, MSS = 1460`  (có 10 gói tin đang được chuyển cùng 1 lúc) thì ACK nhận được tiếp theo sẽ tăng `cwnd` lên 146. Tới lúc chuyển hết cả 10 gói tin thì mới đủ một lần MSS
    - Nếu xảy ra timeout:
        - Phía gửi gửi lại gói tin
        - Gán `ssthresh = cwnd / 2` và `cwnd = MSS`
        - Chuyển sang trạng thái Slow Start
    - Nếu nhận được 3 cái ACK giống hệt nhau liên tiếp:
        - Phía gửi kết thúc đếm giờ, gửi lại gói tin
        - Gán `ssthresh = cwnd / 2` và `cwnd = ssthresh + 3 * MSS`
        - Chuyển sang trạng thái Fast Recovery
- Trạng thái Fast Recovery
    - Mỗi lần phía gửi nhận được ACK bị lặp làm cho hệ thống rơi vào trạng thái này:
        - Phía gửi gửi lại gói tin
        - `cwnd += MSS`
    - Nếu phía gửi nhận được ACK của gói tin bị mất, `cwnd = ssthresh` và chuyển sang trạng thái Congestion Avoidance
    - Nếu xảy ra timeout:
        - Phía gửi gửi lại gói tin
        - Gán `ssthresh = cwnd / 2` và `cwnd = MSS`
        - Chuyển sang trạng thái Slow Start

### Thuật toán TCP CUBIC

- Hai bước Slow Start và Fast Recovery giữ nguyên. Bước Congestion Avoidance được sửa lại một chút để tăng tốc độ (Xem trang 272 giáo trình)

### Kiểm soát tắc nghẽn dựa trên thông báo từ network layer (ECN)

- Khi bên nhận nhận được một thông báo ECN từ datagram của network layer, nó sẽ gửi lại bên gửi gói tin ACK chứa bit ECE bằng 1
- Khi bên gửi nhận được gói tin chứa ECE bằng 1:
    - Gán `cwnd = cwnd / 2`
    - Gói tin tiếp theo được gửi đi sẽ có bit CWR bằng 1

### Kiểm soát tắc nghẽn dựa trên delay

### Tính cân bằng

- Xét $K$ kết nối TCP có điểm đầu-cuối khác nhau, nhưng cùng sử dụng chung một đoạn đường nào đó có transmission rate là $R$. Giả sử tất cả các kết nối đều đang vận chuyển một lượng thông tin lớn, và không có kết nối UDP nào sử dụng đoạn đường này. Khi đó, một cách kiểm soát tắc nghẽn được gọi là cân bằng nếu transmission rate trung bình của mỗi đường dây đều xấp xỉ $\frac{R}{K}$.
- Thuật toán TCP AIMD là đảm bảo việc kiểm soát là cân bằng
- Nếu trong kết nối có UDP, việc kiểm soát là không cân bằng
- Tính cân bằng cũng bị ảnh hưởng nếu một ứng dụng sử dụng song song cùng lúc nhiều kết nối TCP
