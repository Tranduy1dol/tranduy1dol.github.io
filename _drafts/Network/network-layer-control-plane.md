---
title: Tầng mạng - Control Plane (Network Layer - Control Plane)
date: 2026-05-26
excerpt: Chi tiết về Control Plane và các thuật toán định tuyến trong tầng mạng.
category: LEARNING
---

## Thuật toán định tuyến

- Mục tiêu: Tìm đường đi (path, gồm nhiều link) tốt nhất từ nguồn đến đích
- Abstraction:
    - Đồ thị có trọng số $G = (N, E)$
    - $N$: tập hợp các router
    - $E$: tập hợp các link
    - $c(x, y)$: cost của link nối từ $x$ đến $y$, bằng $\infty$ nếu không có link nối.
        - Cost có thể là tốc độ, thời gian di chuyển, băng thông, băng thông ^-1, …
- Phân loai thuật toán
    - Global: Mọi router có topology và cost đầy đủ
        - Thuật “link state”
    - Decentralized: Tại một router chỉ biết thông tin về các router cạnh nó
        - Thuật “distance vector”
    - Static: Đường đi ít thay đổi theo thời gian
    - Dynamic: Đường đi liên tục thay đổi

### Thuật Link-State (LS)

- Một số ký hiệu sử dụng:
    - $D(v)$: cost tốt nhất ở thời điểm hiện tại tại nút $v$
    - $p(v)$: nút ngay trước nút $v$ trên đường đi tốt nhất từ nguồn đến $v$
    - $N’$: tập hợp các nút đã tính xong đường đi ngắn nhất
- Giả thiết đã biết về toàn bộ cấu trúc mạng và cost trên đó; thông tin này có trên mọi router và là giống nhau
- Lặp $k$ lần để biết đường đi ngắn nhất đến $k$ điểm đến khác nhau
- Mã giả:

```python
def LS(G):
	N' = [u]
	for v in N:
		D[v] = c[u][v]
	while N' != N:
		w = argmin([D[v] for v in N - N')
		N'.append(w)
		for v in N.adj[w]:
			if w not in N':
				D[v] = min(D[v], D[w] + c[w][v])
		return N'
```

- Độ phức tạp: $\mathcal{O}(n^2)$
- Nên để các router chạy thuật LS ở các thời điểm khác nhau để tránh tình trạng tắc nghẽn

### Thuật Distant Vector (DV)

- Xét nút $x$. Từ nút này, ta ước tính được $D_x(y)$ là đường đi ngắn nhất từ $x$ đến $y$ với mọi nút $y$ có trên mạng. Xét $\mathbf{D}_x = [D_x(y): y\in N]$. Mỗi nút $x$ cần lưu giữ các thông tin:
    - $c(x, v)$ với mọi $v$ kề $x$
    - $\mathbf{D}_x$
    - $\mathbf{D}_v$ với mọi $v$ lề $x$
- Mô tả thuật toán:
    - Bắt đầu với việc chọn một nút $x$ bất kỳ rồi tìm $\mathbf{D}_x$.
    - Trên toàn mạng, mỗi lần nút $x$ bất kỳ biết được distant vector của một nút $v$ nào đó kề nó bị thay đổi, nó sẽ tính lại distant vector của nó theo công thức dưới đây. Sau đó nó sẽ gửi vector này ra xung quanh
    
    $$
    D_x(y) = \min\limits_{v\in N}\{c(x, y)+D_v(y)\}
    $$
    
    - Thuật toán tự kết thúc khi không có cập nhật nào nữa ở tất cả các nút
- Nếu một link cost bất kỳ thay đổi, thuật toán sẽ chạy tiếp và kết thúc sau một số bước. Tuy nhiên khi thay đổi theo chiều hướng tăng, việc thay đổi sẽ diễn ra rất lâu, do ta đã cập nhật đường đi tối ưu mới dựa trên một đường đi tối ưu lúc chưa xảy ra thay đổi
- Poisioned reverse: Nếu có $z$ kề $x$ sao cho đường đi từ $x$ qua $z$ đến $y$ là tốt nhất, $x$ vẫn update distant vector bình thường, tuy nhiên lại báo cáo cho $z$ là $D_x(y) = \infty$
    - Biện pháp này giúp giảm thời gian khi một cạnh thay đổi chỉ ảnh hưởng đến hai nút kề nhau

### So sánh LS và DV

- Số tin cần gửi giữa các nút: LS cần $\mathcal{O}(|N||E|)$ tin nhắn gửi giữa các nút để biết được cost trên tất cả các nút. Không tính được chính xác số tin cần gửi này ở DV, chỉ biết chúng chỉ là giao tiếp giữa các nút cạnh nhau
- Tốc độ hội tụ: LS cần $O(|N|^2)$ thời gian cho mỗi lần có một sửa đổi nào đó trên mạng. DV hội tụ chậm, trong lúc hội tụ còn gặp phải vấn đề tính sai đường đi ngắn nhất
- Khả năng xử lý lỗi: Nếu có router hỏng, LS có thể tính sai đường đi, nhưng không làm ảnh hưởng đến các router khác. Tuy nhiên DV sẽ làm lan tràn kết quả này đến các nút khác và làm hỏng hệ thống.

## Định tuyến trên Internet

- AS (autonomous system): một nhóm các router được quản lý bởi cùng một người/tổ chức
    - Trong một ISP, các router bên trong và các link nối chúng là một AS
- Mọi AS đều được xác định bởi một số ASN duy nhất
- Định tuyến bên trong một AS gọi là giao thức định tuyến Intra-AS

### Giao thức Routing Information Protocol (RIP)

- Sử dụng thuật toán DV
- Tất cả các link đều được coi là có cost = 1
    - Tuy nhiên các DV chỉ được lưu đối với các router/subnet cách 15 đơn vị
- Cứ mỗi 30s, các DV sẽ được trao đổi với các nút bên cạnh
    - Trong mỗi lần như vậy, tối đa 25 subnet sẽ được liệt kê
- RIP phát hiện được lỗi:
    - Nếu không nhận được thông tin từ một nút bên cạnh, nó sẽ coi là nút đó đã hỏng
    - Nút hiện tại lập tức quảng bá thông tin cho các nút xung quanh và nhanh chóng khắc phục lỗi
    - Có sử dụng poisoned reverse

### Giao thức Open Shortest Path First (OSPF)

- Sử dụng cách trao đổi thông tin kiểu LS và thuật toán Dijkstra để xây dựng một bản đồ của cả AS
- Tất cả các router chạy thuật toán Dijkstra một cách độc lập từ nó để xây dựng một cây đường đi ngắn nhất tới tất cả các subnet
- Thông tin định tuyến của một nút được broadcast cho toàn bộ mạng thay vì chỉ ở trên một nút
- Thông tin về các link kề nó cũng được broadcast mỗi 30 phút ngay cả không có link bị thay đổi
- Các trao đổi giữa các router theo giao thức này có thể mã hoá được

## Định tuyến giữa các ISP (không học)

- Có thể gọi là giao thức Inter-AS
- Giao thức inter-AS được Internet sử dụng là BGP (Border Gateway Protocol)

### Tổng quan về BGP

- Trong giao thức này, các gói tin không được định tuyến đến các địa chỉ cụ thể mà được định tuyến đến các subnet có địa chỉ kiểu CIDR
    - Các giá trị trong bảng forwarding table của router sẽ có dạng $(x, I)$, với $x$ là phần prefix và $I$ là interface number của các interface của router
- BGP cho phép xác định các AS xung quanh một AS và tìm đường tốt nhất đến một prefix.

### Lan truyền thông tin định tuyến BGP

- Trong AS ta chia các router làm gateway router và internal router. Gateway router là router nối với một hoặc một vài router bên ngoài AS
- Các router trong BGP trao đổi thông tin với nhau bằng các kết nối TCP ở cổng 179
    - Một kết nối giữa 2 router trong cùng AS gọi là iBGP. Một kết nối giữa 2 router khác AS gọi là eBGP
- Quy trình lan truyền thông tin định tuyến:
    - Giả sử cần lan truyền thông tin từ AS1 với prefix chung là $x$ đến AS2
    - Một gateway router của AS1 gửi thông báo eBGP “AS1 $x$” sang một gateway router của AS2
    - Gateway router trong AS2 gửi thông báo iBGP “AS1 $x$” sang tất cả các router trong AS2
    - Nếu muốn gửi sang các AS khác, quy trình là tương tự

### Tìm đường đi tốt nhất

![Cơ chế định tuyến liên AS qua giao thức BGP (NEXT-HOP và AS-PATH)](public/network/network-layer-control-plane/1.png)

- Các thuộc tính BGP của một router:
    - Route: một tiền tố và tất cả các thuộc tính của nó
    - AS-PATH: các AS mà việc lan truyền thông tin đã đi qua ở bước trước
    - NEXT-HOP: địa chỉ IP của interface bắt đầu AS-PATH
- Các route được viết theo format NEXT-HOP, AS-PATH, prefix đích
    - VD: trong hình trên, AS1 có 2 BGP route để đến prefix $x$ ở AS3:
        - NEXT-HOP tại 3d, AS3, $x$
        - NEXT-HOP tại 3a, AS2  AS3, $x$
- Hot potato routing:
    - Chọn đường đi có đường từ điểm xuất phát đến NEXT-HOP nhỏ nhất
        - Với ví dụ ở hình trên, nếu cost được tính bằng số link ít nhất trên đường đi thì đường đi tốt nhất từ 1b đến $x$ là đi qua NEXT-HOP tại 2a để sang AS2.
- Thuật toán chọn đường đi:
    - Mọi đường đi đến prefix $x$ được gắn một giá trị preference value như một thuộc tính
        - Giá trị này được quyết định bởi admin mạng
    - Trong các đường có preference value cao nhất, chọn đường đi có AS-PATH ngắn nhất
        - Sử dụng thuật DV để định tuyến một cách chính xác
    - Trong các đường có AS-PATH ngắn nhất, chọn đường đi có NEXT-HOP gần điểm xuất phát nhất
    - Nếu vẫn còn nhiều đường đi được chọn, ta chọn theo BGP identifier

### Routing Policy

![Thực thi chính sách định tuyến (Routing Policy) trong BGP](public/network/network-layer-control-plane/2.png)

- Trong hình trên, AS X là một multi-homed access ISP bằng cách kết nối với phần còn lại của mạng thông qua 2 provider network khác nhau. Khi đó, X không được truyền thông tin sang B rằng nó có đường qua C và ngược lại
- Mọi giao thông mạng đi vào hoặc đi ra provider network của một ISP phải có điểm đầu, điểm cuối hoặc cả 2 là một khách hàng của ISP đó
