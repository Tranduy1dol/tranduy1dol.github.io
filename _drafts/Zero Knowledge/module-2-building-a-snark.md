---
title: "Module 2: Building a SNARK"
date: 2026-05-26
excerpt: "Các khối xây dựng cơ bản của một SNARK, thiết lập tham số công khai và quy trình chứng minh."
category: LEARNING
---

- Building an efficient SNARK
    - 2 steps:
        - A functional commitment scheme
        - A suitable interactive oracle proof (IOP)
    - Commitment
        - **$Commit(m, r) → com(very short, about 32byte)$** (value $r$ chose at random)
        - $verify(m, com, r) → accept$ or $reject$
        
        ⇒ **Binding** (tính ràng buộc): cannot produce 2 valid openings for $com$
        
        ⇒ **Hiding** (tính bí mật): $com$ reveals nothing about committed data
        
        ---
        
        

![Mô hình bộ dịch (Compiler) chuyển đổi code thành hệ thống ràng buộc R1CS](public/zero-knowledge/module-2-building-a-snark/1.png)

        
        - Standard construction with message $M$, random string $R$ , and hash function $H$
        
        ---
        
        

![Quy trình chuyển đổi từ R1CS sang đa thức QAP (Quadratic Arithmetic Program)](public/zero-knowledge/module-2-building-a-snark/2.png)

        
        - Step 1: Prover sends $com_f$ to verifier with function $f$ in the function family $F$.
        - The verifier sends a value $x$ to the Prover
        - Prover compute $f(x) = y$ and send this result and proof $π$ to the verifier
        - Because the verifier knows $x, y$, he can accept or reject the proof
        
        

![Sơ đồ tối ưu hóa phép toán chứng minh qua đa thức QAP](public/zero-knowledge/module-2-building-a-snark/3.png)

        
        - $setup(λ)$ runs one time in the beginning and never runs again
        
        ---
        
        

![Phương pháp mã hóa và đánh giá đa thức tại điểm bí mật](public/zero-knowledge/module-2-building-a-snark/4.png)

        
        - Setup: we need to delete $α$ because if anyone knows $α$, they can create a fake proof. *⇒ trusted setup, very important*
        - Commit: we compute $f(α)$ by using $pp$ because $α$  is deleted.
        - We have a binding commitment, not hiding because we have not built a zk-SNARK yet.
        
        

![Sự kết hợp giữa đa thức và phép mã hóa đồng hình (Homomorphic Encryption)](public/zero-knowledge/module-2-building-a-snark/5.png)

        
        - To know the value of alpha, the verifier uses a “pairing” (algebraic structure: cấu trúc đại số), just know $G$ and $H_1$ from $pp$ ⇒ if a blockchain app want to implement an on-chain verifier, the smart contract going to run verify algorithm that only needs to $G$ and $H_1$ what will be stored in code
        - if $d$ is too large, it will be an expensive computation for  $q(X)$
        
        

![Quy trình kiểm tra tính đúng đắn của phép chia đa thức](public/zero-knowledge/module-2-building-a-snark/6.png)

        
        

![Sơ đồ tương tác kiểm tra đa thức giữa Prover và Verifier](public/zero-knowledge/module-2-building-a-snark/7.png)

        
    - Polynomial IOP
        
        

![Kiến trúc hệ thống lập luận đa thức (Polynomial Commitment Scheme)](public/zero-knowledge/module-2-building-a-snark/8.png)

        
        

![Hình ảnh minh họa](public/zero-knowledge/module-2-building-a-snark/9.png)

        
        - Verifier sends a bunch of random values to prover → prover corresponding commits to a bunch of polynomials → verifier asks prover to open these polynomials at several points → based on a bunch of random values decide to accept or reject
        - random values are chosen after the prover commits to a certain polynomial → prevent the prover from proving a false statement
    
    

![Hình ảnh minh họa](public/zero-knowledge/module-2-building-a-snark/10.png)
