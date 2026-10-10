---
id: reconciliation
title: Financial Reconciliation
sidebar_label: Reconciliation
---

# Financial Reconciliation

**Reconciliation** is the automated process of cross-checking SolydFlow's Immutable Ledger against raw settlement records and payout statements from your connected payment gateways (Paystack, Stripe, Flutterwave, M-Pesa).

```text
[1. Ingest Bank/Gateway Records] ➔ [2. Match Identifiers] ➔ [3. Compare Amount & State] ➔ [4. Flag / Settle Variances]
```

While **Verification** audits a single payment reference in real time, **Reconciliation** operates across batches of transactions to guarantee that your application revenue, merchant payouts, and bank deposits agree to the cent.

---

## Verification vs. Reconciliation

| Dimension | Transaction Verification | Financial Reconciliation |
| :--- | :--- | :--- |
| **Scope** | Single transaction reference (`ref_102938`). | Batch of transactions or daily payout statements. |
| **Trigger** | Real-time (User checkouts, timeouts, or webhooks). | Scheduled (Daily, weekly, or on-demand via Console). |
| **Core Question** | *"Did this customer pay right now?"* | *"Do our ledger totals match bank payouts?"* |
| **Primary Beneficiary** | Client app & customer (Unlocks entitlements). | Finance, accounting, and audit compliance teams. |

---

## The 4 Reconciliation Outcomes

When SolydFlow compares gateway payout files against your project's ledger, transactions are classified into four states:

| Outcome | Meaning | SolydFlow Action |
| :--- | :--- | :--- |
| **`MATCHED`** | Reference, amount, currency, and state match perfectly. | Reconciled ✅ (No action needed). |
| **`MISMATCHED`** | Reference matches, but amount or state diverges. | Flagged for review; Consensus Engine evaluates variance. |
| **`MISSING_IN_LEDGER`** | Gateway debited a customer, but no SolydFlow record exists. | Created and attributed via the customer's phone or email. |
| **`MISSING_AT_GATEWAY`** | Intent created in SolydFlow, but gateway has no record. | Marked as `ABANDONED` / `FAILED_DECLINED`. |

---

## Handling Financial Variances

Not all differences are simple errors. SolydFlow classifies discrepancies into specific categories:

### 1. Amount Variances
Occurs if a customer was charged a fee or transferred an incorrect amount:
* **Expected:** `₦10,000` (1000000 kobo).
* **Gateway Statement:** `₦9,500` (950000 kobo).
* **SolydFlow Action:** Flags an `AMOUNT_DISCREPANCY`. Entitlement is held until approved or pro-rated.

### 2. Currency Variances
Occurs if a gateway converted funds using an unexpected foreign currency rate:
* **Expected:** `$10.00 USD`.
* **Gateway Statement:** `₦15,000 NGN`.
* **SolydFlow Action:** Validates against the package currency mapping before reconciling.

### 3. Processing Timestamp Differences
* A customer initiates a bank transfer at **11:58 PM** on August 31st, but interbank settlement clears at **12:05 AM** on September 1st.
* SolydFlow links both timestamps to prevent end-of-month accounting discrepancies.

---

## Reconciliation Report Schema

When reconciliation identifies an anomaly, it generates an auditable record in the **SolydFlow Console → Reconciliation**:

```json title="Reconciliation Variance Record (JSON)"
{
  "reconciliation_id": "rec_01J8K9X4M2D7E4F1",
  "batch_date": "2026-08-27",
  "provider": "paystack",
  "status": "MISMATCH_DETECTED",
  "discrepancy": {
    "type": "STATE_DIVERGENCE",
    "transaction_id": "txn_01J8K9B2D7E4F1A0C5E8",
    "provider_reference": "ref_pstk_89283ab71928",
    "ledger_state": "PENDING",
    "provider_state": "SUCCESSFUL",
    "amount_minot": 500000,
    "currency": "NGN"
  },
  "resolution": {
    "action": "AUTO_RECONCILED",
    "new_state": "SETTLED_CONSENSUS",
    "timestamp": "2026-08-27T02:00:15Z",
    "note": "Reconciled during midnight automated batch sweep"
  }
}
```

---

## Running Reconciliation in Practice

1. **Continuous Event-Driven Sync:** As webhooks and Sweeper queries arrive, individual transactions are reconciled in real time.
2. **Automated Midnight Batch:** Every 24 hours, SolydFlow compares gateway settlement logs against your internal ledger.
3. **On-Demand Console Sync:** Finance teams can click **"Run Reconciliation"** in the console before closing monthly books.

---

## Related Documentation

* **[Truth Overview →](./overview.md)**
* **[Transaction Verification →](./transaction-verification.md)**
* **[The Immutable Transaction Ledger →](./transaction-ledger.md)**
* **[Resolving State Mismatches →](./state-mismatches.md)**

