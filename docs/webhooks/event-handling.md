---
id: event-handling
title: Webhook Event Handling
sidebar_label: Event Handling
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhook Event Handling

When billing activity occurs (such as a new purchase, monthly renewal, rescued payment, or chargeback), SolydFlow delivers a signed webhook to your backend server.

```text
[1. Receive Signed Event] ➔ [2. Verify Signature] ➔ [3. Idempotency Check (event_id)] ➔ [4. Update Database & Return 200]
```

SolydFlow consolidates all billing lifecycles into **four clean events**, abstracting away provider-specific status codes and schemas.

---

## The 4 Standard Billing Events

| Event Name | When It Fires | What Your Backend Should Do |
| :--- | :--- | :--- |
| **`subscription_started`** | Initial checkout succeeds, or user re-subscribes after expiry. | Grant `entitlement` in your database until `expires_at`. Trigger onboarding flow. |
| **`subscription_renewed`** | Monthly cycle renews, user upgrades, or Sweeper rescues stalled payment. | Silently extend user's `expires_at` date in your database. |
| **`subscription_revoked`** | Chargeback filed, refund issued, or manual admin cancellation. | Immediately revoke `entitlement` and lock premium features. |
| **`test_event`** | You click **"Send Test Webhook"** in the Console API Vault. | Validate your signature verification logic before going live. |

---

## Event Schemas

### 1. `subscription_started`
```json
{
  "event": "subscription_started",
  "event_id": "evt_110e8400-e29b-41d4-a716-446655440001",
  "environment": "live",
  "is_test": false,
  "user_id": "usr_supabase_991823",
  "package_id": "pro_monthly_ngn",
  "entitlement": "pro_access",
  "provider": "paystack",
  "expires_at": "2026-09-27T18:33:00Z"
}
```

### 2. `subscription_renewed`
```json
{
  "event": "subscription_renewed",
  "event_id": "evt_550e8400-e29b-41d4-a716-446655440000",
  "environment": "live",
  "is_test": false,
  "user_id": "usr_supabase_991823",
  "package_id": "pro_monthly_ngn",
  "entitlement": "pro_access",
  "provider": "paystack",
  "expires_at": "2026-10-27T18:33:00Z"
}
```

### 3. `subscription_revoked`
```json
{
  "event": "subscription_revoked",
  "event_id": "evt_991f8400-e29b-41d4-a716-446655440001",
  "environment": "live",
  "is_test": false,
  "user_id": "usr_supabase_991823",
  "package_id": "pro_monthly_ngn",
  "entitlement": "pro_access",
  "reason": "chargeback",
  "revoked_at": "2026-08-27T10:14:35Z"
}
```

---

## Production Backend Implementation

Your webhook handler must verify signatures, check for duplicate `event_id` deliveries, update your user records, and return HTTP `200` immediately:

<Tabs>
<TabItem value="nodejs" label="Node.js (Express + Database)" default>

```javascript title="src/webhookHandler.js"
const express = require('express');
const app = express();

// Set to track processed event IDs (Use Redis or Postgres in production)
const processedEventIds = new Set();

app.post('/webhook/solydflow', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Verify HMAC Signature (see Webhooks > Signature Verification)
  // ...

  const payload = JSON.parse(req.body.toString());
  const { event, event_id, user_id, entitlement, expires_at } = payload;

  // 2. IDEMPOTENCY CHECK: Safely ignore duplicate deliveries
  if (processedEventIds.has(event_id)) {
    return res.status(200).json({ received: true, note: "duplicate_ignored" });
  }
  processedEventIds.add(event_id);

  try {
    // 3. Process Billing Lifecycle Events
    switch (event) {
      case "subscription_started":
      case "subscription_renewed":
        await db.users.update({
          where: { id: user_id },
          data: {
            is_pro: true,
            active_entitlement: entitlement,
            access_expires_at: new Date(expires_at),
          },
        });
        console.log(`✅ Granted ${entitlement} to user ${user_id} until ${expires_at}`);
        break;

      case "subscription_revoked":
        await db.users.update({
          where: { id: user_id },
          data: {
            is_pro: false,
            active_entitlement: null,
          },
        });
        console.log(`🔒 Revoked access for user ${user_id}. Reason: ${payload.reason}`);
        break;

      case "test_event":
        console.log("🛠️ Test event received successfully");
        break;

      default:
        console.warn("⚠️ Unhandled event type:", event);
    }

    // 4. Acknowledge with 200 OK immediately
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Database update failed:", error);
    return res.status(500).send("Database error");
  }
});
```

</TabItem>
<TabItem value="python" label="Python (FastAPI)">

```python title="src/webhook_handler.py"
from fastapi import FastAPI, Request, HTTPException
import json
from datetime import datetime

app = FastAPI()
processed_events = set() # Use Redis in production

@app.post("/webhook/solydflow")
async def handle_solydflow_event(request: Request):
    raw_body = await request.body()
    # 1. Verify signature ...

    payload = json.loads(raw_body)
    event_id = payload.get("event_id")
    event = payload.get("event")

    # 2. Idempotency Check
    if event_id in processed_events:
        return {"received": True, "note": "duplicate_skipped"}
    processed_events.add(event_id)

    # 3. Handle Events
    user_id = payload.get("user_id")
    if event in ("subscription_started", "subscription_renewed"):
        expires_at = datetime.fromisoformat(payload.get("expires_at").replace("Z", "+00:00"))
        # Update user record in database
        print(f"Granted access to {user_id} until {expires_at}")
    elif event == "subscription_revoked":
        # Revoke user record in database
        print(f"Revoked access for {user_id}")

    return {"received": True}
```

</TabItem>
</Tabs>

---

## Best Practices

1. **Acknowledge in \<5 Seconds:** Return HTTP `200` immediately. If you need to send welcome emails or generate invoices, dispatch them to a background queue (e.g. BullMQ, Celery, or AWS SQS).
2. **Handle Timestamps Safely:** Always parse `expires_at` as ISO-8601 UTC.
3. **Ignore Test Events in Production:** Inspect `payload.is_test` to prevent test webhook pings from overwriting real production customer records.

---

## Related Documentation

* **[Webhooks Overview →](./overview.md)**
* **[Signature Verification →](./signature-verification.md)**
* **[Inbound Gateway Webhooks →](./inbound-webhooks.md)**
* **[Entitlement Enforcement →](../enforce/entitlement-enforcement.md)**

