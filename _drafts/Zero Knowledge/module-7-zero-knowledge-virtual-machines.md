---
title: "Module 7: Zero Knowledge Virtual Machines (zkVM)"
date: 2026-05-26
excerpt: "Tổng quan về zkVM, máy ảo chứng minh tính đúng đắn của việc thực thi chương trình mà không tiết lộ dữ liệu đầu vào."
category: LEARNING
---

- zkVM gives us a very convenient and easy way to write a high-level program and execute it, get both the output and proof without having to know about zk
- Way to create zk:
    - Use a circuit to create proof (like an ASIC). We have some specific program languages like CIRCOM, and LEO and use circuits to compile the program.
    
    ⇒ highly optimized. Sometimes circuit will be more efficient for running computation
    
    ⇒ each time we use the circuit to generate a proof, we need a specific verifier that knows about the circuits
    
    - zkVM: with inputs are code, message .. we will have outputs are proof, …
    
    ⇒ just need to define the verifier once time, and can send as many programs as you can.
    
    ⇒ also we can use high-level programming languages like Solidity to compile
    
    ⇒ easy to loop and recursion.
    
- Building blocks
    - CPU
    
    

![Sơ đồ kiến trúc tổng quan của máy ảo Zero Knowledge (zkVM)](public/zero-knowledge/module-7-zero-knowledge-virtual-machines/1.png)

    
    - Memories: Use space ordering by address, ordering by time next, and store update
    
    

![Quy trình thực thi chương trình và tạo vết (Execution Trace) trong zkVM](public/zero-knowledge/module-7-zero-knowledge-virtual-machines/2.png)

    
    ⇒ to link the CPU and RAM in the VM, we use a lookup argument to connect them.
    
    - For any operation, we have to do the range check to know if our elements are valid to our VM (RAM, CPU maybe 32-bits, 64-bits..)
    - Our CPU will prove everything and it will be very expensive, so we have to use bitwise.
    - Hashing: a special processor to handle hashing like sha… (zk-friendly primitive)
    

⇒ Summary:

![Mô hình chứng minh tính đúng đắn của CPU trạng thái](public/zero-knowledge/module-7-zero-knowledge-virtual-machines/3.png)

- Handle program initialization
    - First option: use public memory
        - program use public inputs and we initialize our memory with it before start execution
        - program will be large and verifier has a lot more overhead
    - Second option: bootloader from hash
        - we just have a hash of our program as a public input
        - we have our full program as a part of witness
        - bootloader take our full program, hash it all together and prove that matches to the hash prover provides to verifier. Then it will put it into memory
    - Third option: Merkly’s abstract syntax tree (MAST)
        - Control flow
        - like bootloader, MAST will hash program as a public input. However, instead of unhash the whole thing and setting up all our memory, we can have unhash selectively because it is a binary tree, each node represents one control flow step

⇒ Miden execution trace:

- Padding will reduce the number of columns
- The set of constraints: we have constraints in every step (transaction function)
- Turn operation bits into operation flags

![Cơ chế bộ nhớ RAM chứng minh được (Proved RAM) trong zkVM](public/zero-knowledge/module-7-zero-knowledge-virtual-machines/4.png)

- Control flow and program decoding
    
    

![Kiến trúc đệ quy (Recursive Proofs) giúp gộp nhiều chứng minh zkVM](public/zero-knowledge/module-7-zero-knowledge-virtual-machines/5.png)

    
    - Every leaf node is a non-control flow
    - In the control flow node, we hash our data - the leaf node
    - How it works in our VM:
    
    

![Quy trình sinh bằng chứng thực thi từ mã bytecode](public/zero-knowledge/module-7-zero-knowledge-virtual-machines/6.png)

    
- Connect trace segments via lookup
    - After committed a bitwise compute($z = a\ AND\ b$), verifier sends two random value $α, β$. So we have a polynomial $X=β+α.a+α^2.b+α^3.z$.
    - For a bitwise computation, VM provide a bitwise segment (a stack) with 8 rows, the input in the first row (row 0) and the output in the last row (row 7).
    - In the first row, $a, b$ are decomposed into bit and in the last row, there is an aggregated element that equals our correct inputs.
    - After build 2 traces, VM builds an lookup argument column based on a method called “Randomized AIR with Preprocessing”.
    - Anytime we take a element from stack, we put $x$ or divide $x$ and put it into column.
