---
id: overview
title: Webhooks Overview
sidebar_label: Overview
---

# Webhooks Overview

Webhooks allow payment providers, SolydFlow, and your application backend to communicate asynchronously when real-world payment events occur (such as 3D-Secure card debits, M-Pesa PIN authorizations, or annual renewals).

```text
[1. Gateway Inbound Webhook] ➔ [2. Consensus Engine Verifies] ➔ [3. Ledger Settled] ➔ [4. Signed Outbound Event to Your Server]
```

---

## The Two Webhook Planes

To integrate correctly, it is important to distinguish between the two separate webhook directions:

| Plane | Direction | Purpose | Header & Security |
| :--- | :--- | :--- | :--- |
| **1. Gateway Inbound** | Provider (Paystack/Stripe) ➔ **SolydFlow** | Notifies SolydFlow that an asynchronous payment or bank transfer cleared. | Provider-specific signatures (validated server-to-server by SolydFlow). |
| **2. Merchant Outbound** | **SolydFlow** ➔ Your Backend Server | Notifies your database to unlock entitlements, grant roles, or send emails. | Signed with `X-SolydFlow-Signature` using your secret (`whsec_...`). |

---

## The 4 Unified SolydFlow Events

Instead of writing separate handlers for dozens of fragmented provider event types (`charge.success`, `payment_intent.succeeded`, `charge.completed`, `0`), SolydFlow consolidates all billing lifecycles into **four clean events**:

| Event Name | When It Fires | What Your Backend Should Do |
| :--- | :--- | :--- |
| **`subscription_started`** | A user completes an initial purchase or re-subscribes after expiry. | Grant the `entitlement` in your database until `expires_at`. Perfect for onboarding emails. |
| **`subscription_renewed`** | A recurring subscription cycle successfully renews, or the Sweeper recovers a stalled payment. | Silently extend the user's expiration timestamp in your database. |
| **`subscription_revoked`** | A customer initiates a bank chargeback, Apple refund, or admin cancellation. | Immediately revoke the `entitlement` and lock premium features. |
| **`test_event`** | You click **"Send Test Webhook"** in the SolydFlow Console. | Verify your HMAC-SHA256 signature verification code before deploying to production. |

---

## Cryptographic Security & Replay Defense

Every outbound webhook sent from SolydFlow to your backend is cryptographically signed:

* **Header:** `X-SolydFlow-Signature: t=1677638400,v1=5a8d...`
* **Secret Key:** Found in your SolydFlow Console (`whsec_...`).
* **Algorithm:** Timestamped HMAC-SHA256 over `${timestamp}.${rawBody}`.
* **Replay Protection:** Automatically rejects any payload older than 5 minutes.

---

## Explore Webhooks Documentation

| Module | What You'll Learn |
| :--- | :--- |
| **[Inbound Webhooks](./inbound-webhooks.md)** | Setting up provider endpoints in the SolydFlow Console. |
| **[Provider Webhooks](./provider-webhooks.md)** | How SolydFlow handles Paystack, Flutterwave, Stripe, and M-Pesa webhooks. |
| **[Signature Verification](./signature-verification.md)** | Production-ready verification code for Node.js, Python, and Supabase. |
| **[Event Handling](./event-handling.md)** | Best practices for idempotent processing, database updates, and retries. |

---

## Related Documentation

* **[Handling Failed Webhooks →](../recover/failed-webhooks.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
* **[Entitlement Enforcement →](../enforce/entitlement-enforcement.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**

