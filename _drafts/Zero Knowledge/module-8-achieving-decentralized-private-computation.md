---
title: "Module 8: Achieving Decentralized Private Computation"
date: 2026-05-26
excerpt: "Cách thức xây dựng các mô hình tính toán riêng tư phi tập trung sử dụng công nghệ Zero Knowledge Proofs."
category: LEARNING
---

- How existing system fall short?
    - Like Ethereum, we have a list of blocks that are chained and entities to append the new block to the blockchain. If someone has a new transaction, entities will check if this block is valid or not and chained it to the network.
    - Miner will re-execute the computation that is occurring inside the transaction and make sure the transaction came from the correct parties.
    - Problem 1: Scalability perspective ⇒ The code has to be re-executed by every node in the network. But there will be some heavy nodes that need a supercomputer and the full desktop checks the node in time. So the week node will not be participating.
    - Problem 2: Privacy ⇒ Each transaction reveals at least 3 kinds of data: the executing program, data provided as input, and participants. So participants, although they use pseudonymity, their information in other transactions will be revealed to everyone take participates in the network
    
- UTXO and account model transactions
    - We have a list account in the network, so if any account does a transaction, the value of the transaction will be updated.
    - So privacy of transactions will be more difficult because you need to hide which entry in this list will be updated for every transaction.
    
    ⇒ We have some crypto techniques for this but not efficient.
    
    - UTXO model transaction:
    
    

![Mô hình hệ thống tính toán riêng tư phi tập trung](public/zero-knowledge/module-8-achieving-decentralized-private-computation/1.png)

    
    - Each transaction will spend an amount of active coin as input, then create some output that will be used in the next transaction
    - Properties:
        - Check that the spent coin is active(before the transaction)/is authorized. ⇒ harm the anonymity
        - Check the value is conserved ⇒ harm the privacy
    
- ZKP in UTXO
    - With the UTXO model and ZKP, we will solve our problem in this way:
        - 1st, inputs, and output will put into a commitment that the value of the coin spent and, the public key is hidden.
        - 2nd, this transaction will be put into a proof pi, and validate construction will do the work:
            - with the input are commitment and commitment tree represent historical commitments, 1st step of validation is open all the input.
            - 2nd it will check that input commitment exists in the commitment tree.
            - 3rd constructor will check if the input value is equal to the output value.
            - 4th constructor will check if this transaction exits.
    - So we want to check whether the spent coin is correct or not, we will do this this way:
        - With the commitment tree representing all coins, we create a set of spent coins. This set contains a list of serial numbers, just a set, not a Merkel tree-like commitment tree.
        - Each serial number is public and corresponds to a coin, so the ZKP construct will check if the serial number of the input corresponding commitment is right.
        - One of the solutions is to put an epoch like three years on this list. So if someone makes a transaction with a coin in the last epoch, this person must provide the non-membership proof. And with coins in this epoch, we just need to check the serial number.
    - Summary We have a ZKP scheme with proof pi, input(sr_1, cm_2, cm_3 …, rt), a commitment consisting of value v, public key pk, serial number sr, program id p_id:
        - Open
        - Check cm_1 in rt (Mtree)
        - Check that sr_1 corresponding to cm_1
        - Check signature against pk (proof itself is a signature)
        - Check that the program for p_id is executed correctly.
- Universal circuits
- Trade-off for different proof systems
    - Growth smaller 17(Paper)
    - Simulation extractability(properity)
    - Grouth 16 need trusted set-up but in the context of arbitrary computation, other will have to produce a trusted setup for every program that they produce
    - Birth predicate
        - Record consist of data, pk, vk_d for verification key upon the death or consumption, vk_b for verification key for when program born.
        - So ZKP scheme will have:
            - For each input/record check for vk_d. This parameter will be set-up when a record/coin is spent
            - For each output check proof against vk_b. This parameter will be set-up when user create a new record.
            - For a transaction, we set-up vk_p stand for verification key program. This parameter is created by combine vk_b and vk_d.
