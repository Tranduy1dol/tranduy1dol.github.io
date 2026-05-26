---
title: "Some Ways to Use zk-SNARKs for Privacy"
date: 2026-05-26
excerpt: "Các tình huống và giải pháp ứng dụng thực tế của zk-SNARKs nhằm bảo mật dữ liệu và quyền riêng tư giao dịch."
category: LEARNING
---

## Term

zk-SNARKs

Proof-of-humanity

Merkle tree

Denial-of-service

## Definitions of zk-SNARKs

## Proof of membership

Suppose you have an Ethereum wallet and you want to prove that this wallet has a proof-of-humanity registration, without revealing which registered human you are. We can mathematically describe the function as follows:

- The **private input** $(w)$*:* your address $A$, and the private key $k$ to your address.
- The public input $(x)$: the set of all addresses with verified proof-of-humanity profiles $\{H_1...H_n\}$
- The verification function $f(x,w)$:
    - Interpret $w$ as the pair $(A, k)$, and $x$ as the list of valid profiles $\{H_1...H_n\}$
    - Verify that $A$ is one of the addresses in $\{H_1...H_n\}$
    - Verify that $privtoaddr(k) = A$. This s*ub-function* p*roves* that private key $k$ belongs to address $A$.
    - Return $True$ **if both verifications pass, $False$ **if either verification fails.

The prover generates their address $A$ and the associated key $k$, and provides $w = (A, k)$ as the private input to $f$. They take the public input, the current set of verified proof-of-humanity $\{H_1…H_n\}$ from the chain. They run the zk-SNARK proving algorithm, which generates the proof. The prover sends the proof to the verifier and they provide the block height at which they obtain the list of verified profiles.

The verifier also reads the chain, gets the list $\{H_1...H_n\}$ at the height that the prover specified, and checks the proof. If the check passes, the verifier is convinced that the prover has some verified proof-of-humanity profile.

## Making the proof-of-membership more efficient

Problem: One weakness in the above proof system is that the verifier needs to know the whole set of profile $\{H_1...H_n\}$, and they need to spend $O(n)$ time ‘inputting” this set into the zk-SNARK mechanism.

Solution: We can solve this by instead passing in as a public input an on-chain Merkle root containing profiles. We add another private input, a Merkle proof M proving that the prover’s account A is in the relevant part of the tree. Besides, there is a new and more efficient alternative to Merkle proofs for zk-proving membership is Caulk.

![Sơ đồ cấu trúc cây Merkle (Merkle Tree) xác thực thành viên](public/zero-knowledge/some-ways-to-use-zk-snarks-for-privacy/1.png)

## ZK-SNARKs for coin

Projects like Zcash and [Tornado.cash](http://Tornado.cash) allow you to have privacy-preserving currency. The projects take the “ZK proof-of-humanity” to prove access to a coin. But we have 2 problems: simultaneously solve privacy and the double spending problem.

Here’s how we solve this. Anyone who has a count has a secret $s$. They locally compute the “leaf” $L = hash(s, 1)$ which gets published on-chain and becomes part of the state, and nullifier $N = hash(s, 2)$. The state gets stored in a Merkle tree.

![Cơ chế chuyển và chi tiêu tài sản bảo mật (Shielded Transaction)](public/zero-knowledge/some-ways-to-use-zk-snarks-for-privacy/2.png)

To spend a coin, the sender must make a ZK-SNARK where:

- The public input contains a nullifier $N$, the current or recent Merkle root $R$, and a new leaf $L’$ (The receiver has a secret $s’$ and passes to the sender $L’ = hash(s’, 1)$)
- The private input contains a secret $s$, a leaf $L$, and a Merkle branch $M$
- The verification function checks that:
    - $M$ is a valid Merkle branch proving that $L$ is a leaf in a tree with root $R$
    - $Hash(s, 1) = L$
    - $Hash(s, 2) = N$

The transaction contains the nullifier N and the new leaf L’ (we “mix it in” $L'$ to the proof to prevent $L'$ from being modified by third parties when the transaction is in-flight)

To verify the transaction, the chain checks the ZK-SNARK and checks that $N$ was not used in a previous spending transaction. If the transaction succeeds, $N$ is added to the spent nullifier set, and $L'$ is added to the Merkle tree. 

We use a zk-SNARK to relate two values, $L$ (which goes on-chain when a coin is created) and $N$ (which goes on-chain when a coin is spent), without revealing which L is connected to which $N$. The connection between $N$ and $L$ can only be discovered if you know the secret $s$. Each coin that gets created can only be spent once but which coin is being spent at a particular time is kept hidden.

## Coins with arbitrary balances

Extending the scheme to coins with hidden balances is straightforward. Each coin stores a private balance alongside its public commitment. Transactions consume two coins, generate two new ones, and update the state with balances for each. A zk-SNARK ensures the transaction conserves total balance and both outputs are positive, without revealing actual amounts. This simple approach paves the way for privacy-preserving transactions with arbitrary balances

## ZK anti-denial-of-service

Definition of Denial-of-Service attack (DoS)

Suppose you have some on-chain identity that is non-trivial to create. We could create a more DoS-resistant peer-to-peer network by only accepting a message if it comes with proof that the message’s sender has a profile. Every profile would be allowed to send up to 1000 messages per hour, and a sender’s profile would be removed from the list if the sender cheated. Here is how we make this privacy-preserving.

First, is the setup.

Let k be a user’s private key, and $A = privtoaddr(k)$ is the corresponding address. The list of addresses is public. You have to prove that you have the private key without revealing which one. But here, we don’t just want proof that you are on the list, we want a protocol that lets you prove you are on the list but prevents you from making too many proofs.

We will divide up time into epochs, each epoch lasts 3.6 seconds (so 1000 epochs per hour). Each user is allowed to send one message per epoch, if they send more messages per epoch, they will get caught. Users can use epochs in the recent past to send more messages.

### The protocol

A user generates a nullifier $N = hash(k, e)$ with $k$ as their key and $e$ as the epoch number, and publishes it along with their message $m$. The zk-SNARK mixes in $hash(m)$ without revealing the message, so that the proof is bound to a single message. If a user sends two messages with the same nullifier, they will get caught.

So the core technique relies on the “two points make a line” trick: if you reveal one point on the line, you will reveal little, but if you reveal two points, you will reveal the whole line.

For each epoch, we take a line $L_e = hash(k,e)*x+k$. The slope of the line is $hash(k, e)$ and the y-intercept is $k$., both are private. To make a certificate for a message $m$, the sender provides $y = L_e(hash(m))=hash(k,e)*hash(m)+k$, along with a zk-SNARK proving that y was computed correctly.

![Sơ đồ chứng minh chữ ký và tài khoản hợp lệ bằng zk-SNARK](public/zero-knowledge/some-ways-to-use-zk-snarks-for-privacy/3.png)

To recap, the zk-SNARK here is as follows:

- Public input:
    - $\{A_1...A_n\}$, the list of accounts.
    - $m$, the message that the certificate is verifying.
    - $e$, the epoch number used for the certificate.
    - $y$, the line function evaluation.
- Private input:
    - $k$, the private key.
- Verification function:
    - Check that $privtoaddr(k)$ is in $\{A_1..A_n\}$
    - Check that $y = hash(k,e)*hash(m)+k$

But if someone uses a single epoch twice? They will reveal $y_1 = hash(k,e)*hash(m_1)+k$ and $y_2=hash(k,e)*hash(m_2) + k$. We can use two points to compute the private key of this user: 

$$
k = y_1 - hash(m_1)*\frac{y_2-y_1}{hash(m_2)-hash(m_1)}
$$

## ZK negative reputation

Designing a reputation system for an anonymous forum like 0chan (think 4chan with no usernames) presents challenges. The goal is to incentivize quality content while preserving anonymity. Up/down voting or moderation flagging are potential solutions, but allowing a negative reputation is trickier. It requires users to consider all reputation messages, positive and negative when proving their identity, similar to Unirep Social's approach. This complex but crucial feature could foster a more responsible and engaged community on 0chan.

## Chaining post: the basis

Anyone can make a post by publishing a message on-chain that contains the post, and a ZK proving two things: 

1. You own some scarce external identity
2. You made some previous post

The ZK-SNARK is as follows:

- Public input:
    - The nullifier $N$
    - A recent blockchain state root $R$
    - The post content (”mixed in” to the proof to bind it to the post, but doesn’t have any computation about)
- Private input:
    - Your private key $k$
    - Either an external identity (with address $A$) or the nullifier $N_{prev}$ used by the previous post
    - A Merkle tree root $M$ proving conclusion of $A$ or $N_{prev}$ on-chain
    - The number $i$ of posts that you have previously made with this account
- Verification function:
    - Check that $M$ is a valid Merkle tree branch proving that (either $A$ or $N_{prev}$ whichever is provided) is a leaf in a tree root $R$
    - Check that $N = enc(i, k)$ where $enc$ is a encrypt function
    - If $i =0$, check that $privtoaddr(k)=A$, otherwise check that $N_{prev}=enc(i-1,k)$

In addition to verifying the proof, the chain also checks that (i) $R$ is a recent state root and (ii) the nullifier $N$ has not yet been used.

We use $enc$ instead of $hash$ to make the nullifiers reversible: if you have $k$, you can decrypt any specific nullifier you see on-chain, if the result is a valid index and not random junk, you know that nullifier was made by using $k$.

### Adding reputation

Reputation in this scheme is on-chain and in the clear: some smart contract has a method `addReputation`, which takes the nullifier published along the post, and the number of reputation units to add or subtract.

We extend the on-chain data stored per post $\{N, \bar{h}, \bar{u} \}$ where:

- $\bar{h} = hash(h,r)$ where $h$ is the block height of the state root that was referenced in the proof.
- $\bar{u} = hash(u, r)$ where $u$ is the account’s reputation score (0 for a fresh account)

$r$ here is a random value, added to prevent $h$ and $u$ from being uncovered by brute-force search.

Suppose that a post uses a root $R$ and stores data $\{ N, \bar{h}, \bar{u} \}$. In the proof, it links to the previous post, with stored data $\{ N_{prev}, \bar{h}_{prev}, \bar{u}_{prev} \}$. Also, the post’s proof requires walking over the reputation entries that have been published between $\bar{h}_{prev}$ and $h$. For each nullifier $N$, the verification function would decrypt $N$ using the user’s key $k$, and if the decryption output is a valid index, it would apply a reputation update. If the sum of all reputation updates is $\delta$, the proof would finally check $u=u_{prev}+\delta$.

![Cơ chế cập nhật điểm uy tín ẩn danh trên diễn đàn bảo mật](public/zero-knowledge/some-ways-to-use-zk-snarks-for-privacy/4.png)

Many kinds of reputation rules like “three strikes and you’re out” or “high-reputation poster” can be accommodated by setting up conditions for $u$.

To increase the scalability of this scheme, we could split it up into two kinds of messages: posts and reputation update acknowledgments (RCAs). A post would be off-chain, though it would be required to point to an RCA made in the past. RCAs would be on-chain, and an RCA would walk through all reputation updates since that poster’s previous RCA.

## Holding centralized parties accountable

Centralized "operators" are sometimes necessary in schemes aimed at scalability or data privacy. The MACI voting system exemplifies this: voters encrypt votes to the operator's key, which decrypts and counts them publicly on-chain. This complexity ensures "coercion-resistance," where voters cannot prove their vote even if they want to. Blockchain and ZK-SNARKs minimize trust in the operator: they can't censor votes or cheat the count, although they could still break coercion resistance. In sum, central operators can be trusted less thanks to these technologies.

## Combining ZK-SNARK with MPC

ZK-SNARKs can now handle confidential computations between multiple parties (not just 2!) while keeping each party's input secret. This opens doors for advanced privacy-preserving applications like secure reputation systems and data markets. However, the tech for efficient multi-party ZK-SNARKs is still young and needs further development.

## What can’t we make private?

ZK-SNARKs excel at making user state private, but they can't hide information that absolutely nobody knows. For example, Uniswap's central market maker account, crucial for every trade, can't be fully hidden. Someone needs to hold its state in the clear to prove transactions are valid, making it a central point of vulnerability.

While a ZK-SNARKed, centrally-operated Uniswap might be possible, the benefits are questionable. Even if user trades are private, revealing price changes would still leak information about trading activity.

The crux of the issue is the seeming incompatibility of the global state (accessible to everyone) and private state (hidden from everyone). Blockchains excel at one, ZK-SNARKs at the other, but achieving both simultaneously remains a challenge.

Multi-party computation offers a potential solution, but it relies on an honest majority, which can be unstable in practice due to the risk of collusion for privacy breaches without detection.

In short, ZK-SNARKs are powerful for user privacy, but hiding information crucial to system function remains a hurdle. We need better solutions to reconcile global and private states for truly private, decentralized systems.
