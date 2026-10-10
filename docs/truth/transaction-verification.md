---
id: transaction-verification
title: Transaction Verification
sidebar_label: Transaction Verification
---

# Transaction Verification

Transaction verification is the process of querying the payment provider directly to establish authoritative financial truth whenever a checkout session is interrupted, delayed, or unconfirmed.

```text
[1. State Uncertain (Timeout/No Webhook)] ➔ [2. Locate Transaction Reference] ➔ [3. Server-to-Server Query] ➔ [4. Settle Consensus]
```

Rather than guessing whether a customer paid, SolydFlow queries the provider's authoritative REST API using the encrypted keys stored in your **API Credentials Vault**.

---

## Verification is an Audit, Not a Re-Debit

The most critical principle of transaction verification:

| Action | What It Asks | Side Effects |
| :--- | :--- | :--- |
| **Transaction Verification** | *"Did reference `ref_102938` clear at the bank?"* | **Zero side effects.** Read-only audit check. |
| **Payment Creation** | *"Please charge this card ₦5,000 again."* | **High risk.** Can double-charge the customer. |

SolydFlow **always verifies the existing transaction reference** before permitting any new payment attempts.

---

## Provider Verification Methods Matrix

When verification is triggered, SolydFlow communicates directly with the provider's backend:

| Provider | Authoritative Verification Endpoint | Identifier Used | Secret Key Used |
| :--- | :--- | :--- | :--- |
| **Paystack** | `GET /transaction/verify/:reference` | Paystack Reference (`ref_...`) | Paystack Secret Key (`sk_live_...`) |
| **Stripe** | `GET /v1/payment_intents/:id` | PaymentIntent ID (`pi_...`) | Stripe Secret Key (`sk_live_...`) |
| **Flutterwave** | `GET /v3/transactions/:id/verify` | Flutterwave Transaction ID | Flutterwave Secret Key (`FLWSECK_LIVE...`) |
| **M-Pesa (Daraja)**| `POST /mpesa/stkpushquery/v1/query`| `CheckoutRequestID` | Consumer Secret + PassKey |

:::info{title="Hardware-Backed Security"}
All outbound verification calls are signed and executed server-to-server. Client applications never see provider secret keys or execute raw verification queries directly.
:::

---

## The 4-Point Field Integrity Checklist

SolydFlow does not simply accept an HTTP `200 OK` from a gateway. The **Consensus Engine** validates four data points before committing the transaction to your Immutable Ledger:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Verification Check                    │ What SolydFlow Validates                               │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Transaction Identity Match         │ Provider reference matches the session initialized in SDK.│
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. Exact Currency Match               │ Confirms currency matches package (e.g. NGN vs USD).    │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Exact Amount Match                 │ Confirms amount paid matches expected amount in kobo/cents.│
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. Customer Identifier Match          │ Confirms email/phone matches the authenticated user ID.│
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

If an attacker tampers with a client response or pays a lower amount (e.g. ₦50 instead of ₦5,000), the **Amount Match** check fails, the transaction is marked as a **State Mismatch**, and entitlements remain locked.

---

## The 4 Possible Verification Outcomes

| Verification Result | Gateway Status | SolydFlow State Transition | Entitlement Status |
| :--- | :--- | :--- | :--- |
| **Settled Consensus** | Gateway confirms funds cleared. | `PENDING` ➔ **`SETTLED_CONSENSUS`** | **Unlocked ✅** |
| **Definitive Failure** | Gateway confirms card declined or bad PIN. | `PENDING` ➔ **`FAILED_DECLINED`** | Locked 🔒 (Safe to retry) |
| **Still Pending** | Gateway reports USSD or bank transfer still clearing. | Remains in **`RECOVERING`** | Held in review ⏳ (Sweeper re-checks) |
| **Gateway Unavailable**| Provider API returns `502/504` timeout. | Retries query with **Backoff & Jitter** | Preserves state; re-queries later |

---

## When Verification Triggers Automatically

You do not need to manually trigger verification calls. SolydFlow initiates verification when:
1. **The Sweeper detects an Orphaned Transaction** (no activity for >45 seconds).
2. **An inbound webhook is delayed or missing** after checkout completion.
3. **A customer launches the app** after completing an out-of-band payment (e.g. USSD or Bank Transfer).
4. **An admin triggers manual reconciliation** in the SolydFlow Console.

---

## Related Documentation

* **[Truth Overview →](./overview.md)**
* **[Consensus Engine →](./consensus-engine.md)**
* **[The Immutable Transaction Ledger →](./transaction-ledger.md)**
* **[State Mismatches →](./state-mismatches.md)**
