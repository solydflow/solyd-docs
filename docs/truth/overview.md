---
id: overview
title: Truth Overview
sidebar_label: Overview
---

# Truth Overview

In distributed payment systems, different components often hold conflicting information. A gateway webhook may report that a charge completed, while the mobile client lost connection and still shows "Pending". Conversely, a malicious client may forge a local success callback to unlock paid features for free.

```text
[1. Collect Signals (Webhook / Client)] ➔ [2. Consensus Engine] ➔ [3. Immutable Ledger Commit] ➔ [4. Financial Truth]
```

**SolydFlow Truth** is the cryptographic verification and consensus layer that establishes an indisputable record of financial reality before customer entitlements are granted or revenue is reported.

---

## The Zero-Trust Payment Principle

Traditional architectures suffer from revenue leakage because they rely on single, unverified signals:

| Integration Model | How It Decides Access | The Vulnerability |
| :--- | :--- | :--- |
| **❌ Naive Client-Side** | `if (payment.status == "success")` | **Trivial to spoof.** Users can patch mobile app binaries or replay mock HTTP responses. |
| **❌ Naive Webhook-Only** | Grants access immediately upon receiving webhook POST. | **Vulnerable to replay attacks,** out-of-order deliveries, and spoofed payloads. |
| **✅ SolydFlow Truth** | Holds activation until **Consensus Engine** independently verifies the transaction with the bank via REST API. | **Zero-trust.** Entitlements only unlock when independent signals achieve agreement. |

---

## The 4 Signals of Financial Evidence

To establish absolute truth, SolydFlow evaluates up to four independent data points:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Signal Source                         │ What SolydFlow Validates                               │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Client Checkout Token              │ Validates session timestamp, user_id, and package SKU. │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. Inbound Gateway Webhook            │ Cryptographically validates HMAC-SHA256 signature.     │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Direct Server-to-Server REST Query │ Queries gateway using your encrypted Vault secret key. │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. Sweeper Reconciliation Log         │ Reconciles delayed clearing (e.g. NIBSS bank transfers)│
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

When these signals agree on the currency, amount, and reference, SolydFlow records a `SETTLED_CONSENSUS` event. Only then is access granted.

---

## Real-World Example: Spoofed Webhook Defense

Consider an attacker attempting to gain free access to a ₦50,000 annual subscription:

1. The attacker crafts a forged `charge.success` webhook payload with `amount: 5000000` and posts it to your server.
2. **SolydFlow Truth intercepts:** Entitlement activation is placed on hold.
3. The Consensus Engine makes an authenticated query directly to Paystack's API (`GET /transaction/verify/:ref`) using your encrypted Vault key.
4. Paystack returns: *"Transaction reference not found"* or *"Amount was ₦50, not ₦50,000"*.
5. SolydFlow flags a **State Mismatch**, rejects the fraudulent event, and leaves features locked.

---

## The 5 Pillars of Truth

| Module | What It Does | Why It Matters |
| :--- | :--- | :--- |
| **[Transaction Verification](./transaction-verification.md)** | Direct server-to-server validation against gateway APIs. | Bypasses client spoofing and unverified payloads. |
| **[Consensus Engine](./consensus-engine.md)** | Multi-signal agreement logic between webhooks and REST APIs. | Eliminates single points of failure in billing logic. |
| **[Transaction Ledger](./transaction-ledger.md)** | Append-only, tamper-proof audit trail of all state transitions. | Provides full auditability for finance and accounting teams. |
| **[State Mismatches](./state-mismatches.md)** | Automated detection when bank records conflict with app state. | Prevents granting access for refunded or declined transactions. |
| **[Reconciliation](./reconciliation.md)** | Automated cross-checking between bank payouts and app revenue. | Ensures bank settlements match ledger revenue exactly. |

---

## Related Documentation

* **[Transaction States & Lifecycle →](../concepts/transaction-states.md)**
* **[Recovery Workflows →](../recover/recovery-workflows.md)**
* **[Entitlements Architecture →](../concepts/entitlements.md)**
* **[Webhook Security & Signatures →](../webhooks/signature-verification.md)**
