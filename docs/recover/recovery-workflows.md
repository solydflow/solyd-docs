---
id: recovery-workflows
title: Recovery Workflows
sidebar_label: Recovery Workflows
---

# Recovery Workflows

A **Recovery Workflow** is an automated, deterministic sequence of steps SolydFlow executes to resolve transactions that do not complete cleanly.

```text
[1. Detect Interruption] ➔ [2. Classify Issue] ➔ [3. Verify Provider Truth] ➔ [4. Settle & Enforce]
```

Different payment failures require different solutions. A dropped webhook requires a direct API verification query, while a gateway timeout requires backoff before re-checking. SolydFlow selects the safest workflow automatically.

---

## Master Recovery Decision Matrix

| Problem Detected | Root Cause | SolydFlow Automated Workflow | Final Action |
| :--- | :--- | :--- | :--- |
| **Missing Webhook** | Bank debited customer, but gateway webhook was blocked or dropped. | **REST Query:** SolydFlow queries provider status using transaction reference. | Marks `SETTLED_CONSENSUS` and unlocks entitlement. |
| **Orphaned Checkout** | User entered PIN/OTP, but closed the app before redirect returned. | **Sweeper Sweeps:** Polling kicks in after 45s of inactivity. | Syncs active entitlement to encrypted device cache. |
| **Verification Timeout** | SolydFlow's verification check timed out due to bank network latency. | **Backoff & Re-query:** Safe retry with exponential backoff and jitter. | Verifies existing reference (zero re-debit risk). |
| **Payment Init Timeout** | App timed out while initiating charge; status at gateway unknown. | **Locate & Query:** Queries gateway before allowing customer to re-attempt. | Prevents double-charging the customer's card. |
| **Duplicate Webhook** | Gateway fired the same event 3 times due to slow acknowledgment. | **Idempotent Match:** Recognizes duplicate `event_id` or transaction reference. | Acknowledges with `200 OK` and skips duplicate writes. |
| **Permanent Decline** | Insufficient funds, bad card CVV, or expired card. | **Terminal State:** Provider confirms definitive failure. | Marks `FAILED_DECLINED` so user can cleanly retry. |

---

## The 3 Core Production Workflows

### Workflow A: Dropped Webhook (Paystack / Monnify / M-Pesa)

```text
[Customer Debited] ➔ [Webhook Lost in Transit] ➔ [Sweeper Detects Inactivity >45s] ➔ [Queries Bank API] ➔ [Entitlement Granted]
```

1. Customer authorizes a ₦5,000 bank transfer or KSh 500 M-Pesa payment.
2. The payment provider settles the funds, but the webhook drops in transit.
3. The transaction remains in `UNRESOLVED_ORPHAN` state.
4. After 45 seconds of silence, SolydFlow's **Sweeper** queries the provider's verification API.
5. The provider confirms settlement; SolydFlow commits `SETTLED_CONSENSUS` to the ledger and delivers access.

---

### Workflow B: Gateway API Timeout During Checkout

```text
[App Initiates Charge] ➔ [Gateway Times Out (504)] ➔ [Hold Intent] ➔ [Verify Reference Before Re-attempt]
```

1. Customer taps "Subscribe", but the provider API hangs and returns a `504 Gateway Timeout`.
2. **Crucial Rule:** SolydFlow does **not** assume the payment failed, nor does it immediately prompt the user to tap "Pay" again.
3. SolydFlow checks if a transaction reference was generated.
4. It issues an authenticated query to confirm whether the gateway processed the charge before allowing the client to re-attempt.

---

### Workflow C: Duplicate Gateway Delivery (Idempotency)

```text
[Gateway Fires Webhook #1] ➔ [Server Acknowledges] ➔ [Gateway Retries Webhook #2] ➔ [Matched via event_id] ➔ [NOOP / Skip]
```

1. Stripe or Flutterwave delivers a successful charge webhook.
2. SolydFlow settles the transaction and grants the entitlement.
3. Due to brief network latency, the gateway retries the exact same webhook 30 seconds later.
4. SolydFlow detects the identical `transaction_id` and acknowledges the payload with HTTP `200 OK` without creating duplicate ledger records or double-extending the user's expiration date.

---

## Recovery Audit Trail in the Ledger

Every automated recovery action is recorded as an auditable state transition in your **SolydFlow Console → Transactions**:

```json title="Recovery Event Record (JSON)"
{
  "transaction_id": "txn_01J8K9B2D7E4F1A0C5E8",
  "user_id": "usr_991823",
  "state_history": [
    {
      "state": "INITIALIZED",
      "timestamp": "2026-08-27T10:00:00Z"
    },
    {
      "state": "UNRESOLVED_ORPHAN",
      "timestamp": "2026-08-27T10:00:45Z",
      "reason": "Webhook callback missing after 45s threshold"
    },
    {
      "state": "RECOVERING",
      "timestamp": "2026-08-27T10:01:00Z",
      "action": "Sweeper queried provider verify endpoint"
    },
    {
      "state": "SETTLED_CONSENSUS",
      "timestamp": "2026-08-27T10:01:02Z",
      "entitlement_granted": "pro_access"
    }
  ]
}
```

---

## Related Documentation

* **[Transaction Recovery Principles →](./transaction-recovery.md)**
* **[Orphaned Transactions →](./orphaned-transactions.md)**
* **[Handling Failed Webhooks →](./failed-webhooks.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
