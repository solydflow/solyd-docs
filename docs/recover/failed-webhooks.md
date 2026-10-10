---
id: failed-webhooks
title: Handling Failed Webhooks
sidebar_label: Failed Webhooks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Handling Failed Webhooks

Webhooks are asynchronous event notifications. In production, webhooks can arrive late, get dropped by firewalls, fail due to server timeouts, or be delivered multiple times.

```text
[1. Webhook Drops / Times Out] ➔ [2. Sweeper Detects Inactivity] ➔ [3. Direct REST Verification] ➔ [4. Entitlement Granted]
```

SolydFlow is architected with a core rule: **A missing webhook must never mean a lost payment.** When a webhook drops, SolydFlow's recovery layer automatically falls back to direct API verification.

---

## The 3 Webhook Failure Modes

| Failure Mode | What Happened | Provider State | How SolydFlow Resolves It |
| :--- | :--- | :--- | :--- |
| **1. Delivery Failure** | Gateway timed out connecting to your server (DNS/firewall drop). | Settled (`success`) | **Sweeper queries gateway directly** via REST and settles the ledger. |
| **2. Processing Failure** | Your server returned `500 Internal Error` or database crashed mid-execution. | Settled (`success`) | Gateway retries with exponential backoff; SolydFlow reconciles state. |
| **3. Signature Rejection** | Malformed headers or mismatched secret rejected the request. | Settled (`success`) | SolydFlow rejects the spoofed payload, then verifies the raw transaction via secure REST API. |

---

## Delivery Failure vs. Financial Truth

Consider what happens when a customer in Lagos or Nairobi completes a checkout:

```text
Customer pays ₦5,000 via Paystack
    ↓
Bank debits account successfully
    ↓
Paystack fires webhook ➔ Destination endpoint times out (504 Gateway Timeout)
    ↓
Standard App: Payment lost. Customer angry. ❌
    ↓
SolydFlow: Sweeper queries GET /transaction/verify/:ref ➔ Consensus Settled ✅
```

Because SolydFlow maintains an active **Consensus Engine**, it does not wait passively for webhooks. If an expected event does not arrive within **45 seconds**, the Sweeper proactively queries the provider's authoritative REST endpoint.

---

## Guarding Against Duplicate Webhooks (Idempotency)

Payment gateways (especially Stripe, Flutterwave, and Paystack) frequently retry webhooks if your server takes longer than 2–5 seconds to respond. 

Your backend must treat webhook processing as **strictly idempotent** using SolydFlow's unique `event_id`:

<Tabs>
<TabItem value="nodejs" label="Node.js (Express)" default>

```javascript title="src/webhook.js"
// Set to store processed event IDs (In production, use Redis or Postgres)
const processedEvents = new Set();

app.post('/webhook/solydflow', express.raw({ type: 'application/json' }), (req, res) => {
  // 1. Verify signature (see Webhooks > Signature Verification)
  // ...

  const payload = JSON.parse(req.body.toString());
  const eventId = payload.event_id;

  // 2. IDEMPOTENCY CHECK: Ignore duplicate delivery
  if (processedEvents.has(eventId)) {
    console.log(`⚠️ Duplicate event ${eventId} received. Skipping.`);
    return res.status(200).json({ received: true });
  }

  // 3. Record event as processed
  processedEvents.add(eventId);

  // 4. Process business logic
  if (payload.event === "subscription_started") {
    console.log(`Granting ${payload.entitlement} to user ${payload.user_id}`);
  }

  // Always return 200 immediately
  return res.status(200).json({ received: true });
});
```

</TabItem>
<TabItem value="python" label="Python (FastAPI)">

```python title="src/webhook.py"
from fastapi import FastAPI, Request, HTTPException
import json

app = FastAPI()
processed_event_ids = set() # In production, use Redis

@app.post("/webhook/solydflow")
async def handle_webhook(request: Request):
    raw_body = await request.body()
    payload = json.loads(raw_body)
    event_id = payload.get("event_id")

    # IDEMPOTENCY CHECK
    if event_id in processed_event_ids:
        return {"status": "duplicate_acknowledged"}

    processed_event_ids.add(event_id)

    # Handle subscription
    if payload.get("event") == "subscription_started":
        # Unlock database access
        pass

    return {"status": "success"}
```

</TabItem>
</Tabs>

---

## Out-of-Order Delivery Protection

In rare cases, network latency can cause provider events to arrive out of order (e.g., `subscription_renewed` arrives before `subscription_started`).

SolydFlow protects your database against out-of-order writes by attaching an immutable `expires_at` ISO-8601 timestamp to every event. Your backend should simply update the user's access date to whichever timestamp is furthest in the future:

```javascript
// Safe timestamp comparison
if (new Date(payload.expires_at) > currentDatabaseExpiry) {
  await updateUserAccess(payload.user_id, payload.expires_at);
}
```

---

## Related Documentation

* **[Transaction Recovery →](./transaction-recovery.md)**
* **[Orphaned Transactions →](./orphaned-transactions.md)**
* **[Retries & Exponential Backoff →](./retries.md)**
* **[Signature Verification Guide →](../webhooks/signature-verification.md)**
