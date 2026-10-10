---
id: provider-webhooks
title: Provider Webhooks
sidebar_label: Provider Webhooks
---

# Provider Webhooks

**Provider Webhooks** are asynchronous event payloads sent directly by payment gateways (Paystack, Stripe, Flutterwave, M-Pesa) to SolydFlow's inbound endpoints.

```text
[1. Provider Webhook Arrives] ➔ [2. Adapter Normalization] ➔ [3. Correlate Transaction ID] ➔ [4. Trigger Consensus Engine]
```

Every payment provider uses different event names, JSON schemas, and status codes. SolydFlow acts as an abstraction buffer—normalizing these disparate formats into a single financial lifecycle before passing them to the **Consensus Engine**.

---

## Provider Event Normalization Matrix

Instead of writing custom webhook parsers for every payment gateway, SolydFlow normalizes raw events into unified states:

| Payment Provider | Raw Inbound Event Name | Raw Status String | Normalized SolydFlow State |
| :--- | :--- | :--- | :--- |
| **Paystack** | `charge.success` | `status: "success"` | **`SETTLED_CONSENSUS`** |
| **Stripe** | `payment_intent.succeeded` | `status: "succeeded"` | **`SETTLED_CONSENSUS`** |
| **Flutterwave** | `charge.completed` | `status: "successful"` | **`SETTLED_CONSENSUS`** |
| **M-Pesa (Daraja)**| Lipa Na M-Pesa Callback | `ResultCode: 0` | **`SETTLED_CONSENSUS`** |
| **Paystack** | `charge.failed` | `status: "failed"` | **`FAILED_DECLINED`** |
| **Stripe** | `payment_intent.payment_failed` | `status: "requires_payment_method"` | **`FAILED_DECLINED`** |
| **M-Pesa (Daraja)**| Lipa Na M-Pesa Callback | `ResultCode: 1032` (Cancelled) | **`FAILED_DECLINED`** |
| **Stripe / Paystack**| `charge.refunded` / `refund.processed` | `status: "reversed"` | **`REVOKED_REFUND`** |

---

## Transaction Correlation: How SolydFlow Matches Events

When a raw webhook arrives, SolydFlow inspects provider-specific reference fields to locate the corresponding checkout intent in your project's ledger:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Payment Rail                          │ Primary Correlation Key in Webhook Payload             │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Paystack**                          │ `data.reference` (e.g. `ref_pstk_89283ab71928`)        │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Stripe**                            │ `data.object.id` (PaymentIntent ID `pi_3Mzx...`)       │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Flutterwave**                       │ `data.tx_ref` or `data.id`                             │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **M-Pesa (Daraja)**                   │ `Body.stkCallback.CheckoutRequestID`                   │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

Once correlated, SolydFlow validates that the amount in kobo/cents matches the expected package price before committing to the ledger.

---

## Raw Provider Payload vs. Normalized Evidence

### What Paystack Sends to SolydFlow (Raw Inbound Payload)
```json
{
  "event": "charge.success",
  "data": {
    "id": 30291823,
    "reference": "ref_pstk_89283ab71928",
    "amount": 500000,
    "currency": "NGN",
    "status": "success"
  }
}
```

### What SolydFlow Sends to Your Server (Normalized Outbound Event)
```json
{
  "event": "subscription_started",
  "event_id": "evt_110e8400-e29b-41d4-a716-446655440001",
  "environment": "live",
  "user_id": "usr_supabase_991823",
  "package_id": "pro_monthly_ngn",
  "entitlement": "pro_access",
  "provider": "paystack",
  "expires_at": "2026-09-27T10:14:35Z"
}
```

Your backend only ever handles clean, standardized SolydFlow events—insulating your codebase from gateway-specific schema breaking changes.

---

## Related Documentation

* **[Inbound Gateway Webhooks →](./inbound-webhooks.md)**
* **[Signature Verification Guide →](./signature-verification.md)**
* **[Event Handling Best Practices →](./event-handling.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
