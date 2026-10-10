---
id: retries
title: Retries & Exponential Backoff
sidebar_label: Retries
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Retries & Exponential Backoff

Distributed payment infrastructure relies on external bank APIs, cellular networks, and webhooks. Transient network timeouts and temporary gateway outages are normal, not exceptional.

```text
[1. Temporary Error (504/429)] ➔ [2. Classify: Safe to Retry?] ➔ [3. Backoff + Jitter Delay] ➔ [4. Safe Re-Query]
```

SolydFlow automatically retries operations that fail temporarily, using **Exponential Backoff** and **Jitter** to prevent system overload while strictly safeguarding against duplicate customer charges.

---

## Safe Retries vs. Dangerous Retries

The golden rule of payment infrastructure is knowing what can be retried safely:

| Operation Type | Examples | Is it Safe to Retry? | SolydFlow Action |
| :--- | :--- | :--- | :--- |
| **Read / Verification** | `GET /transaction/verify/:ref`<br/>`GET /v1/payment_intents/:id` | ✅ **100% Safe** | Automatically retried using exponential backoff. |
| **Outbound Webhook Delivery** | Dispatching `subscription_started` to your backend server. | ✅ **100% Safe** | Retried up to 5 times with idempotency headers. |
| **Payment Debits (Charges)** | Charging a credit card or triggering an M-Pesa STK PIN prompt. | ❌ **Dangerous** | **Never retried automatically.** A timeout on a charge must be verified before any retry. |

---

## HTTP Error Classification Matrix

SolydFlow's Consensus Engine classifies errors immediately before initiating retries:

| HTTP Status | Category | Retryable? | SolydFlow Behavior |
| :--- | :--- | :--- | :--- |
| **`429 Too Many Requests`** | Gateway Rate Limit | ✅ **Yes** | Respects `Retry-After` header or adds exponential backoff. |
| **`502 / 503 / 504`** | Gateway Outage / Timeout | ✅ **Yes** | Retries verification using randomized jitter. |
| **`401 / 403`** | Bad Vault Keys / Unauthorized | ❌ **No** | Aborts immediately; alerts developer in the Console. |
| **`400 Bad Request`** | Malformed Payload | ❌ **No** | Aborts immediately; logs error for inspection. |
| **`402 Card Declined`** | Insufficient Funds / Bad PIN | ❌ **No** | Aborts; transitions transaction to `FAILED_DECLINED`. |

---

## Exponential Backoff with Jitter

When a gateway experiences a temporary slowdown, flooding it with instant retries makes the outage worse. 

SolydFlow applies **Exponential Backoff with Full Jitter** to spread out network traffic:

```text
Delay = Min(Max_Delay, Base_Delay * 2^attempt) ± Random_Jitter
```

| Attempt | Base Delay | Random Jitter Range (±20%) | Actual Delay Range |
| :--- | :--- | :--- | :--- |
| **1st Retry** | 1.0 second | ± 0.2s | **0.8s – 1.2s** |
| **2nd Retry** | 2.0 seconds | ± 0.4s | **1.6s – 2.4s** |
| **3rd Retry** | 4.0 seconds | ± 0.8s | **3.2s – 4.8s** |
| **4th Retry** | 8.0 seconds | ± 1.6s | **6.4s – 9.6s** |
| **5th Retry** | 16.0 seconds | ± 3.2s | **12.8s – 19.2s** |

After 5 failed attempts, the operation stops and the transaction is flagged as an **Orphaned Transaction** for the background Sweeper to inspect on a longer cadence (1m, 5m, 15m).

---

## Webhook Retry Delivery Schedule

When SolydFlow sends signed webhooks to your backend (e.g. `subscription_started` or `subscription_renewed`), it expects an HTTP `200 OK` response within **5 seconds**.

If your server times out or returns a `5xx` error, SolydFlow retries delivery:

```text
[Initial Delivery Fails] ➔ Wait 1 min ➔ [Retry 1] ➔ Wait 5 mins ➔ [Retry 2] ➔ Wait 30 mins ➔ [Retry 3] ➔ Final Retry (2 hours)
```

:::tip{title="Handling Webhook Retries Safely"}
Because SolydFlow retries failed deliveries, your backend webhook endpoint must be **idempotent**. Check the payload's `event_id` against a database or cache before applying upgrades twice.
:::

---

## Related Documentation

* **[Transaction Recovery Principles →](./transaction-recovery.md)**
* **[Orphaned Transactions →](./orphaned-transactions.md)**
* **[Handling Failed Webhooks →](./failed-webhooks.md)**
* **[Recovery Workflows →](./recovery-workflows.md)**
