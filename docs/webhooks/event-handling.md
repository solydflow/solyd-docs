# Event Handling

SolydFlow sends signed webhook events to your backend when subscription activity occurs.

For web applications, these events allow your backend to update customer records, synchronize subscriptions, and manage entitlement access after a payment has been verified.

SolydFlow keeps the webhook integration simple by consolidating billing activity into four events:

```text
subscription_started
subscription_renewed
subscription_revoked
test_event
```

---

## Webhook Flow

The web purchase flow is:

```text
User
  ↓
Hosted Checkout
  ↓
Payment Completed
  ↓
SolydFlow Verifies Payment
  ↓
Webhook Sent
  ↓
Your Backend
  ↓
Customer / Subscription Updated
  ↓
Entitlement Access Synchronized
```

Unlike the mobile SDK, the web application does not wait for payment completion. SolydFlow sends the webhook to the configured backend after the transaction has been verified.

---

## Configure Your Webhook Endpoint

In the SolydFlow Console:

1. Navigate to **Projects**.
2. Click **Manage Connection**.
3. Under **Your Backend Webhook**, enter your backend endpoint URL.
4. Save the configuration.

SolydFlow then delivers signed webhook events to that endpoint when subscription activity occurs.

Your endpoint can be implemented using your preferred backend technology, including:

* Node.js
* Laravel
* Django
* Supabase Edge Functions

---

# Webhook Events

## `subscription_started`

This event is sent when a user successfully pays for an entitlement for the first time, or purchases it again after their previous subscription has completely expired.

### What to do

Grant the user access to the specified `entitlement` until the supplied `expires_at` date.

Example:

```json
{
  "event": "subscription_started",
  "event_id": "evt_110e8400-e29b-41d4-a716-446655440001",
  "environment": "live",
  "is_test": false,
  "user_id": "user_12345",
  "package_id": "gold_monthly",
  "entitlement": "gold_access",
  "provider": "paystack",
  "expires_at": "2026-07-27T18:33:00Z"
}
```

The event contains:

| Field         | Description                              |
| ------------- | ---------------------------------------- |
| `event`       | Event type                               |
| `event_id`    | Unique event identifier                  |
| `environment` | Environment in which the event occurred  |
| `is_test`     | Whether the event is a test event        |
| `user_id`     | SolydFlow user identifier                |
| `package_id`  | Purchased package                        |
| `entitlement` | Access level associated with the package |
| `provider`    | Payment provider                         |
| `expires_at`  | Date and time the entitlement expires    |

This event is also suitable for triggering a welcome or premium onboarding flow.

---

## `subscription_renewed`

This event is sent when an active subscription is:

* Renewed
* Upgraded
* Rescued by the SolydFlow Sweeper after a dropped payment

The user's access period is extended to the new `expires_at` value.

### What to do

Update the user's subscription record and extend access to the new expiration date.

Example:

```json
{
  "event": "subscription_renewed",
  "event_id": "evt_550e8400-e29b-41d4-a716-446655440000",
  "environment": "live",
  "is_test": false,
  "user_id": "user_12345",
  "package_id": "gold_monthly",
  "entitlement": "gold_access",
  "provider": "paystack",
  "expires_at": "2026-08-27T18:33:00Z"
}
```

The `expires_at` value represents the new access expiration date.

---

## `subscription_revoked`

This event is sent when a user's access is terminated before the natural expiration date.

Examples include:

* A card chargeback
* An Apple refund
* A manual administrator rejection from the SolydFlow dashboard

### What to do

Immediately revoke access to the specified `entitlement` and pause the associated services.

Example:

```json
{
  "event": "subscription_revoked",
  "event_id": "evt_991f8400-e29b-41d4-a716-446655440001",
  "environment": "live",
  "is_test": false,
  "user_id": "user_12345",
  "package_id": "gold_monthly",
  "entitlement": "gold_access",
  "reason": "chargeback",
  "revoked_at": "2026-06-27T18:33:00Z"
}
```

Unlike `subscription_renewed`, this event does not provide a new `expires_at` value. It provides the reason and time at which the entitlement was revoked.

---

## `test_event`

The `test_event` is used to verify that your webhook endpoint and signature verification are configured correctly before going live.

You can send it from:

**SolydFlow Console → API Vault → Send Test Webhook**

Example:

```json
{
  "event": "test_event",
  "user_id": "sf_test_user_999",
  "package_id": "test_monthly_gold",
  "entitlement": "gold_access",
  "provider": "solydflow_test",
  "expires_at": "2026-07-27T18:33:00Z"
}
```

Use this event to confirm that your backend can:

1. Receive the webhook.
2. Verify the SolydFlow signature.
3. Parse the event.
4. Identify the event type.
5. Return a successful response.

---

# Handling Events

Your backend should inspect the `event` field and perform the corresponding action.

A simple handler can follow this structure:

```javascript
switch (payload.event) {
  case "subscription_started":
    // Grant entitlement
    break;

  case "subscription_renewed":
    // Extend entitlement
    break;

  case "subscription_revoked":
    // Revoke entitlement
    break;

  case "test_event":
    // Confirm webhook configuration
    break;

  default:
    // Handle unknown event
    break;
}
```

The SolydFlow documentation uses this same event-based approach in its Node.js example.

---

# Idempotent Event Handling

Your backend should reject duplicate events before applying the same subscription change more than once.

Each event contains an `event_id`, which can be used as the event's unique identifier.

For example:

```text
event_id
   ↓
Already Processed?
   ├── Yes → Ignore
   └── No  → Process
```

SolydFlow's documented production practices specifically include rejecting duplicate events through idempotency.

---

# Process Verified Events

Webhook signature verification should happen before your backend updates customer or subscription records.

The documented processing order is:

```text
Webhook
   ↓
Verify Signature
   ↓
Verify Timestamp
   ↓
Check Idempotency
   ↓
Process Event
   ↓
Update Customer / Subscription
   ↓
Synchronize Entitlement
```

SolydFlow uses cryptographic signatures, timestamps, and replay protection for webhook deliveries.

See:

[Signature Verification →](./signature-verification.md)

---

# Updating Entitlements

The webhook event contains the entitlement associated with the subscription.

For example:

```json
{
  "event": "subscription_started",
  "user_id": "user_12345",
  "package_id": "gold_monthly",
  "entitlement": "gold_access"
}
```

Your backend can use the `entitlement` value to determine which access level should be activated for the user.

This follows SolydFlow's model where a package is mapped to an entitlement:

```text
Package
gold_monthly
      ↓
Entitlement
gold_access
```

A different package can provide the same entitlement.

---

# Event Environments

Webhook payloads include:

```text
environment
is_test
```

Use these values to distinguish live subscription activity from test activity.

For example:

```json
{
  "environment": "live",
  "is_test": false
}
```

A test event should not be treated as a real customer subscription.

---

# Acknowledging Webhooks

After successfully processing an event, your backend should return:

```json
{
  "received": true
}
```

with an HTTP `200` response.

Example:

```javascript
return res.status(200).json({
  received: true
});
```

This confirms to SolydFlow that the event was successfully delivered and processed.

---

# Handling Unknown Events

Your backend should safely handle an event type that it does not recognize.

The documented Node.js example logs an unhandled event rather than applying an unknown subscription action.

```javascript
default:
  console.log(
    "Unhandled event:",
    payload.event
  );
```

Do not map an unknown event to `subscription_started`, `subscription_renewed`, or `subscription_revoked`.

---

# Complete Event Model

The four SolydFlow webhook events map directly to subscription lifecycle actions:

| Event                  | Meaning                              | Backend Action     |
| ---------------------- | ------------------------------------ | ------------------ |
| `subscription_started` | New or reactivated subscription      | Grant entitlement  |
| `subscription_renewed` | Renewal, upgrade, or rescued payment | Extend entitlement |
| `subscription_revoked` | Access terminated early              | Revoke entitlement |
| `test_event`           | Webhook configuration test           | Verify integration |

This keeps the backend integration focused on the subscription lifecycle rather than requiring separate handlers for every underlying payment-provider event.

---

## Related Documentation

[Webhooks Overview →](./overview.md)

[Inbound Webhooks →](./inbound-webhooks.md)

[Provider Webhooks →](./provider-webhooks.md)

[Signature Verification →](./signature-verification.md)

[Transactions →](../concepts/transactions.md)

[Entitlements →](../concepts/entitlements.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

---
