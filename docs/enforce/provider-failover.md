---
id: provider-failover
title: Provider Failover
sidebar_label: Provider Failover
---

# Provider Failover

**Provider Failover** allows SolydFlow to route a payment attempt to an alternative, healthy payment gateway when your primary provider is experiencing degraded performance or an unexpected outage.

```text
[1. Primary Rail Times Out] ➔ [2. Verify Previous Intent] ➔ [3. Confirm Unbilled] ➔ [4. Safe Failover to Backup Rail]
```

The most important rule in payment infrastructure is **safety**. A gateway timeout does not mean the payment failed—the bank may have already debited the user's card. SolydFlow verifies the previous attempt before triggering a fallback rail.

---

## Blind Failover vs. SolydFlow Safe Failover

| Failover Approach | How It Handles a Timeout | Risk Level | The Outcome |
| :--- | :--- | :--- | :--- |
| **❌ Naive / Blind Failover** | Paystack times out (504) ➔ Immediately charge via Flutterwave. | **Extreme Risk** | **Customer debited twice.** Chargeback filed. |
| **✅ SolydFlow Safe Failover** | Paystack times out (504) ➔ Hold intent ➔ Query Paystack verify API ➔ Only switch to Flutterwave if confirmed uncharged. | **Zero Risk** | Customer billed once; subscription unlocked cleanly. |

---

## Master Failover Decision Matrix

| Gateway Condition | What Happened | Is Failover Safe? | SolydFlow Action |
| :--- | :--- | :--- | :--- |
| **Pre-Flight Outage** | Primary gateway returns `503 Service Unavailable` before payment starts. | ✅ **Yes (Immediate)** | Routes checkout intent directly to eligible backup rail. |
| **Definitive Decline** | Primary gateway confirms `Card Expired` or `Insufficient Balance`. | ✅ **Yes (Conditional)** | Prompts user to select an alternative payment method or card. |
| **Gateway Timeout (504)** | Socket drops mid-checkout; gateway status unknown. | ⚠️ **Hold & Verify** | Consensus Engine queries primary gateway API before allowing fallback. |
| **Settled at Primary** | Primary gateway confirms payment cleared after initial timeout. | ❌ **Forbidden** | **Stops failover immediately.** Unlocks entitlement via primary rail. |

---

## The 2 Operational Failover Modes

### 1. Pre-Flight Failover (Before Checkout Initiates)
If SolydFlow detects that your primary provider is experiencing high latency or downtime:
* A Nigerian user attempting to pay in `NGN` is seamlessly served a **Monnify Virtual Account** instead of an unresponsive card modal.
* The customer experiences zero checkout errors or broken spinners.

### 2. Mid-Flight Safe Failover (During an Active Session)
If a provider hangs after the user submits their payment details:

```text
[User Submits Card on Paystack] ➔ [Paystack Times Out (504)] ➔ [SolydFlow Queries GET /verify] ➔ [Paystack: "No Charge Recorded"] ➔ [Prompts Fallback to Monnify / Flutterwave]
```

Because SolydFlow confirms with Paystack that no money was deducted, failing over to a backup provider is **100% safe against double-debiting**.

---

## Real-World Multi-Rail Failover Paths

To enable automated failover, ensure backup credentials are saved in your **API Credentials Vault**:

```text
┌───────────────────────────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Market & Currency                     │ Primary Payment Rail          │ Automated Failover Rail       │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🇳🇬 Nigeria (NGN)                      │ Paystack (Cards / USSD)       │ Monnify (Virtual Accounts)    │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🇰🇪 Kenya (KES)                        │ M-Pesa STK Push (Daraja)      │ Paystack / Flutterwave        │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🇬🇭 Ghana (GHS)                        │ Flutterwave Mobile Money      │ Paystack Mobile Money         │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🌍 Global (USD / EUR)                 │ Stripe Credit Cards           │ Paystack International Cards  │
└───────────────────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

---

## Failover Audit Trail in the Ledger

When a transaction successfully fails over to a secondary provider, the transition is permanently recorded in your **Immutable Ledger**:

```json title="Ledger Failover Entry (JSON)"
{
  "transaction_id": "txn_01J8K9B2D7E4F1A0C5E8",
  "attempts": [
    {
      "attempt_number": 1,
      "provider": "paystack",
      "status": "GATEWAY_TIMEOUT",
      "verified_uncharged": true
    },
    {
      "attempt_number": 2,
      "provider": "monnify",
      "status": "SETTLED_CONSENSUS",
      "reference": "ref_mnf_991823746"
    }
  ],
  "final_state": "SETTLED_CONSENSUS",
  "entitlement_granted": "pro_access"
}
```

---

## Related Documentation

* **[Smart Payment Routing →](./smart-routing.md)**
* **[Transaction Finality →](./transaction-finality.md)**
* **[Transaction Verification →](../truth/transaction-verification.md)**
* **[Truth Overview →](../truth/overview.md)**
