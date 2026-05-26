---
title: "Quyền riêng tư của Zero Knowledge Proofs (ZKP)"
date: 2026-05-26
excerpt: "Khám phá các khía cạnh bảo mật, cách thức ZKP bảo vệ quyền riêng tư người dùng trong thế giới Web3."
category: LEARNING
---

## Thuật ngữ

- Proof: tuyên bố, bằng chứng …
- Prover: bên đưa ra proof, thường là người thực hiện giao dịch
- Verifier: bên xác minh proof, thường là các hợp đồng thông minh hoặc nút mạng
- ZKP (Zero Knowledge Proof): là phương thức chứng minh hợp lệ của 1 tuyên bố mà không cần tiết lộ thông tin của tuyên bố đó.
- DVP (Designated Verifier Proof): là 1 loại ZKP đặc biệt có khả năng hạn chế danh tính của người xác minh để chỉ những người được ủy quyền mới có thể xác minh
- BDVP (Blockchain Designated Verifier Proof): DVP dành cho blockchain để bảo vệ quyền riêng tư
- Quantum attack problem: vấn đề tấn công lượng tử, các máy tính thông thường sẽ mất nhiều thời gian để giải mã 1 blockchain vì hiệu suất giải mã không quá cao, nhưng 1 máy tính lượng tử có thể làm.
- DAZKP (Deniable Authentication ZKP):
- BDVP (Blockchain designated validator proof):
- DLP (discreate logarithm problems):
- PQC (post quantum crytography):

## Nội dung

- Tóm tắt
    - Khái niệm ZKP và DVP
    - DVP và các phương thức khác không hoạt động trong trường hợp verifier có thêm thông tin về nguồn gốc của proof. Bởi vì các thông tin này lưu trữ trong Blockchain, proof có thể được cấp nhận bởi bên thứ ba dù verifier mong muốn bảo vệ quyền riêng tư của prover.
    - Paper đưa ra các thông tin về BDVP, nhằm phục vụ mục đích xây dựng 1 blockchain với công nghệ ZKP.
    - Công nghệ lõi được dùng là verifier tạo 1 proof giả mô phỏng lại proof. Từ đó bên thứ ba không thể biết cái nào là real proof của prover. Điều này cho phép verifier bảo vệ quyền riêng tư của prover, cái mà luật pháp cần.
    - Ngoài ra paper này giải quyết các vấn đề về Quantum attack problem bằng các phương thức chống máy tính lượng tử, so sánh hiệu suất hoạt động của các giao thức.
- Mở đầu
    - Blockchain là mạng phi tập trung, công khai, các tổ chức được sắp xếp theo thời gian và nhất quán trên các nút mạng. Khi sử dụng blockchain, luật pháp yêu cầu phải bảo mật các thông tin của prover. ZKP được dùng để bảo vệ thông tin của blockchain. Bằng việc sử dụng ZKP, prover có thể chứng minh quyền sở hữu đối với 1 secret mà không tiết lộ bất cứ thông tin gì.
    - ZKP không thể phòng ngừa việc verifier tiết lộ cho bên thứ 3 biết prover sở hữu 1 secret. Và ta cần 1 ZKP mà không thể chuyển giao. (non-transferable zero-knowledge proof scheme)
    - Để giải quyết vấn đề trên, cách đầu tiên là dùng DVP. Nhưng có 3 vấn đề khi dùng DVP
        1. Verifier có thể tạo 1 fake secret giống secret của prover
        2. Nếu verifier thuyết phục third-party chấp nhận nguồn gốc của proof, verifier có thể chuyển giao proof đó cho third-party.
        3. Verifier có thể show transcript của DVP cho third-party
    - Cách giải quyết khác là dùng DAZKP, DAZKP cho phép giả mạo chữ ký với 1 chữ ký hợp lệ của prover
    - Ý tưởng paper: tạo ZKP với chữ kí của prover, trao quyền cho verifier bằng collision feature. Nếu verifier thuyết phục được third-party rằng proof thuộc về prover, thì verifier có thể làm được điều ngược lại.
    
    

![Mô hình chữ ký ẩn danh Linkable Ring Signature](public/zero-knowledge/quyen-rieng-tu-cua-zkp/1.png)

    
- Related work
    1. Zero-knowledge proof
    - ZKP sẽ có 2 bên, verifier-prover được giao tiếp với nhau qua các giao thức thỏa mãn 3 yếu tố sau:
        - Tính đầy đủ (Completeness)
        - Không bao hàm kiến thức (Zero-knowledge)
        - Tính chắc chắn
    - Một giao thức thường có các thuật toán sau:
        - Commit() → r
        
        The algorithm outputs a commitment r, which is used to verify the correctness of the proof about the secret s.
        
        - Challenge() → e
        
        The algorithm generates a random challenge string e, which the verifier sends to the prover
        
        - Prove(e, w, k) → s
        
        The algorithm outputs a proof s computed by a given e, the witness ω, and a random string k
        
        - Verify(r, e, s) → {0, 1}
        
        The verification algorithm outputs 1 if the verification result is correct; otherwise, 0
        
    1. Designated verifier proof
    2. Deniable authentication
- Preliminary (Tiền đề)
    
    > Bao gồm các thuật toán ngắn gọn được đề xuất sử dung trong ZKP. (Chameleon hash functions)
    > 
    
    > Trong các thuật toán, P đại diện cho prover, V đại diện cho verifier, x là secret mà P muốn V xác minh mà không cho V biết x là gì.
    > 
    
    1. Schnorr’s ZKP
    
    Với tập Z hữu hạn các số nhân, và g sinh ra từ Z. P muốn chứng minh rằng người xác minh biết x sao cho y = g^x
    
    

![Quy trình xác thực giao dịch không tiết lộ khóa công khai](public/zero-knowledge/quyen-rieng-tu-cua-zkp/2.png)

    
    1.  Lyubashevsky’s ZKP
    
    Dựa trên bài toán tìm vector ngắn nhất khác 0.
    
    

![Kiến trúc hệ thống ZKP cho xác thực danh tính riêng tư](public/zero-knowledge/quyen-rieng-tu-cua-zkp/3.png)

    
    

![Cơ chế mã hóa cam kết (Commitment Scheme) bảo mật](public/zero-knowledge/quyen-rieng-tu-cua-zkp/4.png)

    
    1. PEIKERT’S NIZKP SCHEME
    
    

![Ứng dụng Zero Knowledge Proofs trong hệ thống bỏ phiếu kín](public/zero-knowledge/quyen-rieng-tu-cua-zkp/5.png)

    
    1. Kết hợp Peikert và Lyubashevsky, dùng thêm 1 mô hình chữ ký bảo mật ta có giao thức sau:
    
    

![Sơ đồ chữ ký bảo mật kết hợp Peikert và Lyubashevsky](public/zero-knowledge/quyen-rieng-tu-cua-zkp/6.png)

    
    1. Chameleon hash function
    - 1 hàm băm thường có tính chống va chạm, nghĩa là rất khó để tìm được 2 input giống nhau dù có cùng giá trị băm. Đối với Chameleon hash function, ta vẫn có thế thấy va chạm nếu có trapdoor key, nhưng không có trapdoor key thì CH vẫn chống va chạm.
    - CH có 3 thuật toán như sau:
    
    

![Các thuật toán cốt lõi của hàm băm Chameleon (Chameleon Hash)](public/zero-knowledge/quyen-rieng-tu-cua-zkp/7.png)

    
    - CH có 3 thuộc tính:
        - Chống va chạm: chỉ sử dụng khóa công khai pk, không có thuật toán nào tìm được cặp (m,p) và (m’, p’) mà m ≠ m’ sao cho CH(pk, m, p) = CH(pk, m’, p’)
        - Trapdoor collision: sử dụng trapdoor key t, với bất kỳ cặp (m, p) và 1 tin nhắn ngẫu nhiên m’, có thuật toán hiệu quả để tìm ra p’ sao cho CH(pk, m, p) = CH(pk, m’, p’)
        - Tính đồng nhất:
- Privacy-preserving zero-knowledge proof
    - Chúng ta sẽ xây dựng ZKP với khả năng bảo vệ quyền riêng tư bằng cách sử dụng BDVP và DLP. BDVP cho phép bảo vệ quyền riêng tư của người dùng blockchain. Chameleon hash function cho phép xử lý va chạm và cho verifier giả mạo bằng chứng. Third-party sẽ không tin verifier dù họ biết trapdoor key.
    - Ta định nghĩa các ký tự như sau:
        - Chữ in hoa bôi đậm: tên thuật toán
        - Ký tự in hoa bôi đậm: đại diện cho các party(bên tham gia)
        - Ký tự in hoa bôi đậm có subscript: đại diện cho ma trận/lưới
        - Ký tự in thường bôi đậm: đại diện cho vector, tuple
        - Ký tự in hoa mà không bôi đậm: đại diện cho 1 tập hợp
        - Ký tự in thường: giá trị, biến
    - Mô hình này sử dụng 5 thuật toán:
    
    

![Quy trình Commit sử dụng Chameleon Hash](public/zero-knowledge/quyen-rieng-tu-cua-zkp/8.png)

    
    ⇒ Chameleon hash function sẽ được sử dụng ở thuật toán **Commit(p)**
    
    

![Cơ chế tạo chữ ký giả để bảo vệ quyền riêng tư của Prover](public/zero-knowledge/quyen-rieng-tu-cua-zkp/9.png)

    
    - Chi tiết hơn, sử dụng các thuật toán tạo chữ ký, ta có mô hình:
    
    

![Mô hình chi tiết hệ thống chữ ký ẩn danh dựa trên Chameleon Hash](public/zero-knowledge/quyen-rieng-tu-cua-zkp/10.png)

    
    

![Sơ đồ hoạt động của giao thức bảo mật nâng cao](public/zero-knowledge/quyen-rieng-tu-cua-zkp/11.png)

    
- Lattice-based NI-BDVP
    
    Ở phần này, ta cải thiện Lyubashevsky’ ZKP bằng cách dùng Module-SIS để chống Quantum attack. (NIQR-BDVP)
    
    - Mô hình này dùng 4 thuật toán:
    
    

![Các bước khởi tạo khóa và chứng minh của Lattice-based NI-BDVP](public/zero-knowledge/quyen-rieng-tu-cua-zkp/12.png)

    
    

![Quy trình xác thực khóa công khai và commitment trong mạng lưới](public/zero-knowledge/quyen-rieng-tu-cua-zkp/13.png)

    
    ⇒ Tất cả mọi người đều phải dùng KeyGen() để tạo public key. Khi P muốn chứng minh x cho V1, P phải dùng key của V1, sau đó gửi Commitment và proof cho V1. Tất cả mọi người đều có thể xác minh nhưng mà sẽ fail hết, trừ V1. Hơn nữa, V1 muốn bảo vệ quyền riêng tư của P thì có thể tạo chữ ký giả vì V1 biết trapdoor key.
    
    - Cấu trúc của giao thức:
    
    

![Cấu trúc giao thức truyền tin bảo mật NI-BDVP](public/zero-knowledge/quyen-rieng-tu-cua-zkp/14.png)

    
    

![Sơ đồ chứng minh và phân tích thuộc tính an toàn của giao thức](public/zero-knowledge/quyen-rieng-tu-cua-zkp/15.png)

    
    - Chứng minh các tính chất (lười xem)
- Hiệu năng
