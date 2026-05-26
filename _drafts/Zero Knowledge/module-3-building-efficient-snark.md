---
title: "Module 3: Building an Efficient SNARK (Part II)"
date: 2026-05-26
excerpt: "Các kỹ thuật nâng cao để tối ưu hóa hiệu năng, giảm kích thước chứng minh và thời gian kiểm thử của SNARK."
category: LEARNING
---

## GOAL: construct a poly-IOP called PLONK

⇒ PLONK + PCS = SNARK (and also a zk-SNARK)

- Observation
    
    

![So sánh các lược đồ cam kết đa thức (PCS) phổ biến](public/zero-knowledge/module-3-building-efficient-snark/1.png)

    
    - The probability that $r$ is the root of $f$ is almost $d/p$
    - Simple test to know committed polynomial is zero or not
    - SZDL lemma: (*) also holds for multivariate polynomials (where $d$ is the total degree of $f$)
    
    

![Thuật toán và cấu trúc chứng minh của lược đồ KZG](public/zero-knowledge/module-3-building-efficient-snark/2.png)

    
    - Equality test by choosing a random $r$
    
    

![Quy trình thiết lập tham số tin cậy (Trusted Setup) cho KZG](public/zero-knowledge/module-3-building-efficient-snark/3.png)

    
    - Gadget(tiện ích)
    - With set $H$ of omega is a primitive $k^{th}$ root of unity (tập căn bậc k của đơn vị) we have 3 tests:
        - Zero test ⇒ this segment concentrates on this test
        - Sum-check: with $b$ in the finite field, prove the sum of $f(a) = b$ with $a$ in $H$
        - Product-check: with $c$ in the finite field, prove the product of $f(a) = c$ with $a$ in $H$
    
    

![Sơ đồ kiểm tra cam kết đa thức KZG đa điểm](public/zero-knowledge/module-3-building-efficient-snark/4.png)

    
    - The verifier asks the prover to open 2 polynomials at random points $r$
    - Complete: if $f$ is zero on $H$, the verifier will accept the proof
    - Sound: if $f$ is not zero on $H$, the verifier will reject the proof with a high probability
    - The basic error probability is $d/p$ ⇒ negligible
    - The verifier needs to send a random point $r$ after the prover has committed to the polynomial $q$.
- PLONK
    1. Step 1: Compile the circuit to a computation trace
        - Computation trace: a table lists the input
        - Encoding the trace as a polynomial
        
        

![Lược đồ cam kết đa thức dựa trên IPA (Inner Product Argument)](public/zero-knowledge/module-3-building-efficient-snark/5.png)

        
        - So we have a plan to do this
        
        

![Cơ chế hoạt động của lược đồ FRI trong STARKs](public/zero-knowledge/module-3-building-efficient-snark/6.png)

        
        ⇒ Prover uses FFT(Fast Fourier Transform) to compute coefficient of $P$ in $d.log(d)$
        
    
    1. Step 2: Proving the validity of $P$
        
        The prover needs to prove that $P$ is a correct computation trace:
        
        - (1) $P$ encodes the correct inputs.
        - (2) Every gate is evaluated correctly.
        - (3) The wiring is implemented correctly.
        - (4) The output of the last gate is 0. ⇒ easy: prove $P(ω^{3|C|-1}) = 0$
        
        For proving (1):
        
        

![So sánh hiệu năng, kích thước proof giữa KZG, IPA và FRI](public/zero-knowledge/module-3-building-efficient-snark/7.png)

        
        For proving (2):
        
        

![Hình ảnh minh họa](public/zero-knowledge/module-3-building-efficient-snark/8.png)

        
        ⇒ $S(X)$ depends only on the circuit, not the inputs
        
        ⇒ $S(X)$ will be computed during the preprocessing phase
        
        

![Hình ảnh minh họa](public/zero-knowledge/module-3-building-efficient-snark/9.png)

        
        For proving (3): 
        
        

![Hình ảnh minh họa](public/zero-knowledge/module-3-building-efficient-snark/10.png)

        

⇒ After this we have the final Plonk Poly-IOP

![Hình ảnh minh họa](public/zero-knowledge/module-3-building-efficient-snark/11.png)
