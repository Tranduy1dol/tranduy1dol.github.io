---
title: "Module 6: Lookup Arguments for Performance Optimization"
date: 2026-05-26
excerpt: "Giới thiệu về Lookup Arguments, một kỹ thuật mạnh mẽ giúp tối ưu hóa hiệu năng cho các phép tính phức tạp trong ZKP."
category: LEARNING
---

- Lookup argument would prove that you have secret *w* in a public set but don’t reveal it.
- It is usually used in constraint systems because it is quicker to check.
- Range proof and constraint system
    - Range proof appears everywhere in SNARK
    - The first way is binary decomposition. EX: $b_1, b_2, b_3$  in binary s.t $w = b_1 + 2.b_2 + 4.b_3$ **and $b$ is secret.
        - To check if $b_i$ is binary, we compute $0 = b_i.b_i - b_i$*.*
        - R1CS matrix: (this matrix will prove that $w$ is in $[0,8)$ public set)
        
        

![Nguyên lý cơ bản của kỹ thuật Lookup Arguments](public/zero-knowledge/module-6-lookup-arguments/1.png)

        
- Lookup proof, lookup table
    - It is a pre-compute step.
    - EX. (in this example, we will prove $w$ is in $T$).
    
    

![Sơ đồ tối ưu hóa mạch số học bằng bảng tra cứu (Lookup Table)](public/zero-knowledge/module-6-lookup-arguments/2.png)

    
    - A table can store operations, constraints, and possible outputs.
    - To prove this, we will use the LaGrange basis:
        - $f(x)  = a_0.L_0(x) + a_1.L_1(x) + a_2.L_2(x)$ where $L_0, L_1, L_2$ are the LaGrange polynomials over the set $V = {w_0, w_1, w_2}$ **and *$a_0, a_1, a_2$* are inputs. $L_0(x)$ is the unique polynomial s.t $L_0(w_0) = 1, L_0(w_1) = 0, L_0(w_2) = 0$*.*
        
        

![Cơ chế hoạt động của thuật toán Plookup](public/zero-knowledge/module-6-lookup-arguments/3.png)

        
- Vector commitment
    - With set $V = \{w_0, w_1, w_2 \}$, if we want to open $f$ at $w_1$, just prove $f(w_1) = a_1$ (using KZG polynomial commitment).
- Halo 2 lookup argument
    - We have $V = \{w_0, w_1, w_2\}$*, $f(x)  = a_0.L_0(x) + a_1.L_1(x) + a_2.L_2(x)$. (it represents a lookup table)*
    - With $a(X) = b_0.L_0(x) + b_1.L_1(x) + b_2.L_2(x)$ is another polynomial and $b_0, b_1, b_2$ are in $\{a_0, a_1, a_2\}$ (no order).
    - The first thing Halo does is permute $b_i$. So prove
    
    

![So sánh hiệu năng chứng minh khi dùng và không dùng Lookup Arguments](public/zero-knowledge/module-6-lookup-arguments/4.png)

    
    - $V, W$ are set to root of unity
    
    

![Hình ảnh minh họa](public/zero-knowledge/module-6-lookup-arguments/5.png)

    
    

![Hình ảnh minh họa](public/zero-knowledge/module-6-lookup-arguments/6.png)

    
    the
