---
title: "Module 4: SNARKs vs STARKs"
date: 2026-05-26
excerpt: "So sánh chi tiết về kiến trúc hệ thống, độ tin cậy của thiết lập, kích thước bằng chứng và hiệu năng giữa SNARKs và STARKs."
category: LEARNING
---

- STARK (Scalable Transparent Argument of Knowledge): doesn't require pre-processing, doesn't need trusted set-up
    1. Execution trace
    
    Take Fibonacci as an example, we have a scheme of STARK's arithmetization.
    
    

![Mô hình kiến trúc của STARKs dựa trên FRI và không cần Trusted Setup](public/zero-knowledge/module-4-snarks-vs-starks/1.png)

    
    

![Biểu đồ so sánh kích thước chứng minh (Proof Size) giữa SNARKs và STARKs](public/zero-knowledge/module-4-snarks-vs-starks/2.png)

    
    1. Low-degree extensions
        - Idea:
        
        

![So sánh thời gian kiểm thử (Verifier Time) của các hệ thống ZKP](public/zero-knowledge/module-4-snarks-vs-starks/3.png)

        
        - STARK domain:
        
        

![So sánh thời gian tạo chứng minh (Prover Time) theo độ phức tạp của mạch](public/zero-knowledge/module-4-snarks-vs-starks/4.png)

        
        1. Constraint evaluation (ràng buộc)
        - Idea:
        
        

![Bảng tổng hợp đặc điểm kỹ thuật giữa các dòng SNARKs và STARKs](public/zero-knowledge/module-4-snarks-vs-starks/5.png)

        
        - Types:
        
        

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/6.png)

        
        1. FRI
        
        

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/7.png)

        
        

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/8.png)

        
        

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/9.png)

        
        

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/10.png)

        
- STARK-based virtual machine
    
    

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/11.png)

    
- There are 2 components usually used to build both STARKs and SNARKs.
    - 1st: Arithmetization
    - 2nd: Polynomial commitment scheme

- Arithmetization
    - This component transforms high-level programs into polynomials that the STARK system can understand.
    - Method 1: R1CS(Rank-one constraint satisfiability) → arithmetic circuits
    
    

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/12.png)

    
    - Method 2: AIR(Algebraic intermediate representation) → machine computation state
    
    

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/13.png)

    
    ⇒ Comparison:
    
    

![Hình ảnh minh họa](public/zero-knowledge/module-4-snarks-vs-starks/14.png)

    
- Polynomial commitment
    - Method 1: KZG → used for SNARK
    - Method 2: FRI → used for STARK (use hash function → fast)
    - Method 3: IPA (Inner Product Argument) → used for SNARK
