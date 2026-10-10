---
id: transaction-ledger
title: The Immutable Transaction Ledger
sidebar_label: Transaction Ledger
---

# The Immutable Transaction Ledger

The **Transaction Ledger** is the append-only, tamper-proof record of every financial state change in SolydFlow.

```text
[1. Event / Callback] ➔ [2. Consensus Verification] ➔ [3. Append Transition Log] ➔ [4. Immutable Ledger Record]
```

While your mobile app primarily cares about the current state (`isPro == true`), your finance, accounting, and support teams require the complete story of how that state was reached.

---

## Current State vs. Ledger History

A static database row only tells you the end result. The Ledger preserves the full sequence of events:

| Static View (Traditional Database) | SolydFlow Immutable Ledger View |
| :--- | :--- |
| `status: "SETTLED_CONSENSUS"` | **10:00:00** — Intent Created (`INITIALIZED`)<br/>**10:00:15** — Bank Transfer Prompt Shown (`PENDING`)<br/>**10:01:00** — Webhook Missing; Flagged as `UNRESOLVED_ORPHAN`<br/>**10:01:15** — Sweeper verified settlement via Paystack API (`RECOVERING`)<br/>**10:01:17** — Entitlement unlocked (`SETTLED_CONSENSUS`) |

---

## The Append-Only Immutability Rule

SolydFlow enforces strict ledger immutability:

```text
❌ Never Overwrite: UPDATE transactions SET status = 'success' WHERE id = 123
✅ Always Append: INSERT INTO ledger_transitions (txn_id, from_state, to_state, reason, timestamp)
```

1. **Tamper-Proof Audit Trail:** Past events cannot be deleted, altered, or retroactively modified.
2. **Dispute Protection:** If a customer files a chargeback claiming they never authorized a payment, the ledger provides timestamped evidence showing the exact OTP verification and provider reference.
3. **Financial Reconciliation:** Finance teams can run end-of-month reconciliations knowing the historical records reflect bank statements.

---

## Ledger Record Schema

Every transaction inspected in the **SolydFlow Console → Transactions Ledger** contains an auditable transition log:

```json title="Ledger Audit Entry (JSON)"
{
  "transaction_id": "txn_01J8K9B2D7E4F1A0C5E8",
  "project_id": "proj_apex_production",
  "user_id": "usr_supabase_991823",
  "package_id": "pro_monthly_ngn",
  "pricing": {
    "currency": "NGN",
    "amount_minor": 500000,
    "human_readable": "₦5,000.00"
  },
  "provider": {
    "rail": "paystack",
    "reference": "ref_pstk_89283ab71928",
    "channel": "bank_transfer"
  },
  "current_state": "SETTLED_CONSENSUS",
  "transition_history": [
    {
      "from": null,
      "to": "INITIALIZED",
      "timestamp": "2026-08-27T10:00:00Z",
      "source": "client_sdk"
    },
    {
      "from": "INITIALIZED",
      "to": "UNRESOLVED_ORPHAN",
      "timestamp": "2026-08-27T10:00:45Z",
      "source": "sweeper_engine",
      "note": "Callback threshold (45s) exceeded without gateway event"
    },
    {
      "from": "UNRESOLVED_ORPHAN",
      "to": "SETTLED_CONSENSUS",
      "timestamp": "2026-08-27T10:01:02Z",
      "source": "consensus_verification",
      "note": "Provider REST API confirmed 500000 kobo received"
    }
  ]
}
```

---

## Searching and Inspecting the Ledger

When investigating customer billing inquiries or accounting questions, search the ledger in the **SolydFlow Console** by:

* **SolydFlow Transaction ID:** `txn_01J8K...`
* **Provider Reference:** Paystack `ref_...`, Stripe `pi_...`, or Flutterwave `tx_id`
* **Customer Identifier:** Authenticated User ID (`usr_...`), email, or international phone number (`+234...`, `+254...`)

---

## Related Documentation

* **[Truth Overview →](./overview.md)**
* **[Consensus Engine →](./consensus-engine.md)**
* **[State Mismatches →](./state-mismatches.md)**
* **[Reconciliation Workflows →](./reconciliation.md)**
