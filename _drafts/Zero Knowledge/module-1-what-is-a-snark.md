---
title: "Module 1: What is a SNARK?"
date: 2026-05-26
excerpt: "Tổng quan về SNARKs, hệ thống chứng minh phi tương tác, mạch số học và các thuộc tính cơ bản."
category: LEARNING
---

1. SNARK(succinct non-interactive arguments of knowledge): a short proof that a certain statement is true.

⇒ Short and fast to verify.

1. zk-SNARK: the proof “reveals nothing” about $m$*. (the message $m$)*
- Cryptographic background.
    1. Arithmetic circuits: 
    - Fix a finite field $F = {0, .. p - 1}$ with some prime $p > 2$
        - $C: F_n → F$
        - directed acyclic graph (DAG) internal node labeled + - x /, inputs labeled  $1, x_1, x_2…$
        - define an n-variate polynomial with an evaluation recipe
        - $|C| =$   gates in $C$
        
        

![Sơ đồ mạch số học (Arithmetic Circuit) biểu diễn đa thức](public/zero-knowledge/module-1-what-is-a-snark/1.png)

        
    1. Argument system: $C(x, m) → F$ with $x$ : public statement in $F_n$, $m$: secret witness in $F_m$
    - Input of Prover: $x, m$
    - Input of Verifier: $x$
    
    ⇒ Prover’s goal is to convince that there is one $m$ such that $C(x, m) = 0$
    
    1. Preprocessing (setup): $S(C)$ → public parameters $(S_p, S_v)$ 
    
    

![Quy trình thiết lập (Setup) trong hệ thống lập luận phi tương tác SNARK](public/zero-knowledge/module-1-what-is-a-snark/2.png)

    
    ⇒ non-interactive because Prover and Verifier don’t have any conversation, just prover send proof $π$ to verifier
    
    

![Sơ đồ truyền tin phi tương tác giữa Prover và Verifier](public/zero-knowledge/module-1-what-is-a-snark/3.png)

    
    1. Properties
        1. Complete (Tính đầy đủ)
        2. Knowledge sound (Tính chắc chắn)
        3. Zero knowledge (không bao hàm thông tin)
        
        

![Các thuộc tính cốt lõi của zk-SNARK: Complete, Knowledge sound và Zero knowledge](public/zero-knowledge/module-1-what-is-a-snark/4.png)

        
- SNARK: succinct non-interactive arguments of knowledge
    
    

![Khái quát định nghĩa hệ thống SNARK](public/zero-knowledge/module-1-what-is-a-snark/5.png)

    
    - $λ$: security parameter
    - We need to preprocess $C$ because the Verifier doesn’t have enough time to read arithmetic circuits  $C$. So with pre-processing, we have $S_v$ is the summary of $C$ for Verifier.
    
    

![Đặc tả thời gian xử lý và kiểm tra của Verifier](public/zero-knowledge/module-1-what-is-a-snark/6.png)

    
    - Type of set-up
    
    

![Phân loại các phương pháp thiết lập tham số ban đầu (Setup Type)](public/zero-knowledge/module-1-what-is-a-snark/7.png)

    
    - how to build the SNARK software system
    
    

![Kiến trúc phần mềm tổng quan của một hệ thống zk-SNARK](public/zero-knowledge/module-1-what-is-a-snark/8.png)

    
- Define “Knowledge soundness” and “Zero knowledge”
    1. Knowledge sound
    
    

![Mô hình chứng minh tính chắc chắn tri thức (Knowledge Soundness)](public/zero-knowledge/module-1-what-is-a-snark/9.png)

    
    1. Zero-knowledge
    
    

![Mô hình chứng minh thuộc tính không tiết lộ thông tin (Zero Knowledge)](public/zero-knowledge/module-1-what-is-a-snark/10.png)
