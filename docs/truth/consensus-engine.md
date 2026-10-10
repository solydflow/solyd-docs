---
id: consensus-engine
title: Consensus Engine
sidebar_label: Consensus Engine
---

# Consensus Engine

In distributed payment infrastructure, a single transaction generates signals from multiple sources: the client app, inbound webhooks, direct provider APIs, and the background Sweeper. These signals rarely arrive simultaneously.

```text
[1. Gather Signals (Webhook / API)] ➔ [2. Rank Authority] ➔ [3. Reconcile Conflicts] ➔ [4. SETTLED_CONSENSUS]
```

The **Consensus Engine** evaluates these signals, resolves discrepancies, and establishes an authoritative financial state that your application can safely rely on.

---

## Why Consensus is Not a "Majority Vote"

A common misconception is that consensus means counting events:

```text
❌ Bad Logic: 2 webhooks say "Success", 1 API call says "Failed" ➔ Declare "Success"
```

Payment systems cannot operate on simple event counting. A spoofed or replayed webhook may claim a charge succeeded, while the bank's live REST API confirms the card was declined.

SolydFlow enforces an **Evidence Authority Hierarchy**:

| Authority Level | Signal Source | Reliability | Precedence |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Highest)** | **Server-to-Server REST Query** (`GET /verify/...`) | Authoritative | Wins all conflicts. Queries gateway directly using Vault keys. |
| **Tier 2** | **Signed Inbound Gateway Webhook** | High | Triggers verification; establishes intent if HMAC signature is valid. |
| **Tier 3** | **Sweeper Reconciliation Log** | High | Background audit trail for delayed interbank clearing. |
| **Tier 4 (Lowest)** | **Client-Side SDK Response** | Zero-Trust | Used only to initiate state; **never** used to grant access. |

---

## Handling Real-World Signal Conflicts

### Conflict 1: Webhook Says "Success", API Says "Failed"
* **The Situation:** An attacker captures an old webhook payload and replays it to your server to obtain free access.
* **Consensus Resolution:** The Consensus Engine halts entitlement activation and queries the gateway's REST endpoint. The gateway confirms the payment reference was either already used or does not exist.
* **Outcome:** The transaction is marked as a **State Mismatch**, the spoofed event is discarded, and entitlements remain locked.

---

### Conflict 2: Webhook Arrives Before Client Redirect
* **The Situation:** A customer completes a 3D-Secure card charge. The bank fires the webhook to SolydFlow before the user's mobile browser redirects back to your application.
* **Consensus Resolution:** SolydFlow processes the webhook, verifies the settlement with the provider, and writes `SETTLED_CONSENSUS` to the cloud ledger.
* **Outcome:** By the time the user's mobile app opens, `hasEntitlement("pro_access")` is already `true`. Zero loading spinner delay for the user.

---

### Conflict 3: Webhook Missing, Sweeper Queries Gateway
* **The Situation:** Cellular data cuts out during an M-Pesa STK push or USSD transfer. No webhook is delivered.
* **Consensus Resolution:** After 45 seconds of inactivity, the Sweeper issues an authenticated query to Safaricom/Paystack. The provider confirms: `status: "successful"`.
* **Outcome:** Consensus is achieved without a webhook. Access is granted and synchronized to the device cache on next launch.

---

## The 4-Step Consensus Lifecycle

```text
[1. Collect Evidence] ➔ [2. Verify Identity] ➔ [3. Evaluate Context] ➔ [4. Commit Ledger]
```

1. **Collect Evidence:** Aggregates provider callbacks, client session tokens, and query responses.
2. **Verify Identity:** Validates that the amount in kobo/cents, currency, and customer ID match the package catalog.
3. **Evaluate Context:** Checks transaction history to ensure the reference has not been previously settled or revoked.
4. **Commit Ledger:** Writes an immutable `SETTLED_CONSENSUS` record to the ledger, unlocking the entitlement.

---

## What Consensus Produces for Developers

Your application never has to evaluate raw gateway responses or reconcile out-of-order webhooks. You simply listen to the unified entitlement state:

```dart title="What You Write in Flutter"
// The Consensus Engine handles all signal evaluation behind this single call:
final bool isPro = await SolydFlow.hasEntitlement("pro_access");
```

---

## Related Documentation

* **[Truth Overview →](./overview.md)**
* **[Transaction Verification →](./transaction-verification.md)**
* **[The Immutable Transaction Ledger →](./transaction-ledger.md)**
* **[State Mismatches →](./state-mismatches.md)**
