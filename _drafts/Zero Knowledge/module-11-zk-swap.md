---
title: "Module 11: zkSwap"
date: 2026-05-26
excerpt: "Nghiên cứu kiến trúc và cơ chế vận hành của giao thức trao đổi tài sản bảo mật phi tập trung zkSwap."
category: LEARNING
---

- Penumbra: a cross-chain, shielded, DEX (2 chains communicate with each other
    - Natively IBC-compatible (bridging, allows 2 chains to read each other state)
    - Zcash-style shielded pool (only the owner of assets or data knows the amount and can transfer anonymously) + multi-asset capability (collection of notes like UTXO or Bitcoin)
    
    ⇒ value stored in notes (v: v64/v128 - amount, a: **F** asset ID, address)
    
    ⇒ Shielded: spend notes without revealing anything by using ZK proof
    
    - Sealed-input batch swaps (each trade only reveals the trading pair and encrypts the input amounts to a decryption key that is charted the whole validator set)
    
    ⇒ all individual encrypted transaction values, get summed up and decrypted into a combined input value and sent off to DEX in a single trade. Then one executed the clearing price ⇒ block batch input written into the chain state and everybody can read and know the state of the market.
    
    - Liquidity positions (market design stuff)
    
    ⇒ execute DEX once per block
    
- Overview of the Zcash-style state model → **Goal: private transaction with ZKPs**
    - Strategy:
        - 1st: a chain where we have fragmented the chain state (to have the privacy we need to have a key material) ⇒ every note will be put in a Merkle tree that we call a set of all notes.
        - 2nd: move the state off-chain, and replace the notes with notes commitments ⇒ now we have a set off note commitment.
    - Transaction structure:
        - Every note contains a typed value and a controlling address. Also, notes are stored in the set of notes (Merkle tree)
        - State change, notes are replaced by note commitments which are stored in a set of note commitments (Merkle tree)
        - Because the type of note is UTXO (usually), a transaction will have some spent notes and new notes that are created when the user does a transaction.
        - In the set of note commitments, each note before being replaced has a serial number.
        - Stage change, a transaction has serial number, zero-knowledge proof, and new notes.
        - The system will prove that the output note corresponds to the cryptographic commitments, and zk proof will be used to prove that the input value was recorded in the chain.
        - The system will reveal nullifiers (serial numbers) which can only be derived by the entity that controls the noted address. Every one will check if the nullifier appear in the chain or not, so we can reject the transaction. Also validator will check if user compute nullifier correct or not.
    
    

![Kiến trúc hệ thống giao dịch bảo mật zkSwap](public/zero-knowledge/module-11-zk-swap/1.png)

    
    ⇒ So we can not share state and execute later or earlier than user do a transaction.
    
    

![Quy trình nạp và rút tiền giữa Layer 1 và Layer 2 zkSwap](public/zero-knowledge/module-11-zk-swap/2.png)

    
- Privately interact with public shared state
