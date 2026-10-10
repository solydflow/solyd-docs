---
id: state-mismatches
title: Resolving State Mismatches
sidebar_label: State Mismatches
---

# Resolving State Mismatches

A **State Mismatch** occurs when different components in your payment stack have conflicting views of the same transaction.

```text
[1. Discrepancy Detected] ➔ [2. Locate Gateway Reference] ➔ [3. Consensus Verification] ➔ [4. State Reconciled]
```

In distributed payment systems, temporary state mismatches are normal—a bank may settle funds before a webhook arrives, or a user may lose connection before a redirect returns. SolydFlow detects these discrepancies, determines the truth, and harmonizes state across all layers.

---

## The 4 Primary Mismatch Archetypes

SolydFlow automatically detects and resolves four common mismatch scenarios:

| Mismatch Scenario | Gateway State | App / SDK State | Root Cause | SolydFlow Automated Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **1. The Stranded Settlement** | `Successful` | `Pending` | Inbound webhook dropped or delayed by mobile carrier. | **Sweeper queries REST API**, commits `SETTLED_CONSENSUS`, and unlocks access. |
| **2. The Client Spoof Attempt** | `Failed / None` | `Successful` | Modified app binary or replayed client callback attempting to bypass paywall. | **Consensus Engine rejects client claim**, flags fraud alert, and locks entitlement. |
| **3. The Post-Payment Chargeback** | `Refunded / Disputed` | `Active` | Customer filed a dispute or refund directly with bank/Stripe/Paystack. | Gateway sends refund event; SolydFlow marks **`REVOKED_REFUND`** and revokes access. |
| **4. The Delayed Bank Clearing** | `Pending (NIBSS)` | `Timeout` | Interbank transfer or USSD code clearing slowly through central switch. | Kept in **`RECOVERING`**; re-queried with backoff until settled. |

---

## Mismatch Resolution in Action

### Scenario A: Resolving a Dropped Webhook (Bank Says Paid, App Says Pending)

```text
[Paystack Confirms ₦5,000 Settled] ➔ [Webhook Lost in Transit] ➔ [App Shows "Pending"] ➔ [Sweeper Queries GET /verify] ➔ [Harmonized to SETTLED_CONSENSUS]
```

1. A user pays ₦5,000 via Paystack Bank Transfer.
2. The webhook is blocked by a network timeout.
3. The app state is `PENDING`, but the gateway state is `SUCCESSFUL`.
4. The Consensus Engine detects the discrepancy after 45 seconds, executes an authenticated query to Paystack's verify endpoint, updates the cloud ledger to `SETTLED_CONSENSUS`, and updates the user's entitlements.

---

### Scenario B: Blocking a Client Spoof Attempt (App Claims Paid, Gateway Says Failed)

```text
[Compromised App Fires Success Callback] ➔ [SolydFlow Pauses Entitlement] ➔ [Queries Gateway API] ➔ [Gateway Confirms No Payment] ➔ [Entitlement Blocked]
```

1. A malicious user intercepts network calls on a jailbroken device and injects a fake `status: "success"` response.
2. **SolydFlow Zero-Trust Rule:** Client responses are never trusted as proof of payment.
3. SolydFlow queries the gateway API directly using your encrypted Vault Secret Key.
4. The gateway returns `404 Not Found` or `status: "failed"`.
5. SolydFlow flags a **State Mismatch**, commits `FAILED_DECLINED` to the ledger, and denies access.

---

## The 4-Step Resolution Lifecycle

```text
[1. Detect Discrepancy] ➔ [2. Validate Provider Reference] ➔ [3. Server Query] ➔ [4. Append Ledger Log]
```

1. **Detect Discrepancy:** Identifies that gateway state and ledger state diverge.
2. **Validate Provider Reference:** Confirms the query belongs to the exact transaction ID and user ID being evaluated.
3. **Server Query:** Queries the gateway's authoritative REST endpoint (bypassing client-side manipulation).
4. **Append Ledger Log:** Appends a new transition record documenting the reconciliation for compliance and accounting auditability.

---

## Related Documentation

* **[Truth Overview →](./overview.md)**
* **[Transaction Verification →](./transaction-verification.md)**
* **[Consensus Engine →](./consensus-engine.md)**
* **[The Immutable Transaction Ledger →](./transaction-ledger.md)**
* **[Reconciliation Workflows →](./reconciliation.md)**
