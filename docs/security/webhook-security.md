---
id: webhook-security
title: Webhook Security & Replay Defense
sidebar_label: Webhook Security
---

# Webhook Security & Replay Defense

Because webhook endpoints are public HTTP URLs, anyone on the internet can attempt to send fake requests to your server. 

```text
[1. Enforce HTTPS POST] ➔ [2. Parse t & v1 Header] ➔ [3. Verify Timestamp (<300s)] ➔ [4. Timing-Safe HMAC Check]
```

SolydFlow secures all outbound webhooks with a **Defense-in-Depth** model, ensuring your application only processes authentic, unaltered events sent directly by our infrastructure.

---

## The 4 Webhook Defense Layers

SolydFlow protects your backend across four distinct layers:

| Defense Layer | Security Mechanism | What It Protects Against |
| :--- | :--- | :--- |
| **1. Encryption in Transit** | **HTTPS Only (TLS 1.2 / 1.3)** | Eavesdropping and Man-in-the-Middle packet inspection. |
| **2. Cryptographic Integrity**| **HMAC-SHA256 Signature** | Payload tampering, forged events, and altered user IDs or amounts. |
| **3. Freshness Validation** | **Timestamp Header (`t=...`)** | Replay attacks where an attacker re-sends an old, valid payload. |
| **4. Idempotency Tracking** | **Unique Event ID (`event_id`)** | Duplicate deliveries, network retries, and race conditions. |

---

## Threat Scenarios & How SolydFlow Defeats Them

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Attack Vector                         │ SolydFlow Mitigation                                   │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Payload Tampering**                 │ Attacker modifies `user_id` in transit. The calculated │
│                                       │ HMAC-SHA256 signature fails. Request rejected (`401`). │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Replay Attack**                     │ Attacker captures a valid webhook and replays it days  │
│                                       │ later. The timestamp (`t`) is >300s old. Rejected (`400`). |
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Timing Attack**                     │ Attacker measures string comparison latency. Defeated  │
│                                       │ via constant-time comparison (`crypto.timingSafeEqual`).│
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Network Retry Spam**                │ Gateway retries event 5 times due to lag. Defeated by  │
│                                       │ caching and deduplicating the unique `event_id`.       │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## The 5-Minute Replay Attack Window

Every webhook header includes the UNIX timestamp when the event was generated:

```text
X-SolydFlow-Signature: t=1677638400,v1=5a8d29bf1c...
```

Your server must reject any request where:

```text
Current_Server_Time − Header_Timestamp > 300 seconds (5 minutes)
```

This prevents an attacker from intercepting a legitimate webhook (e.g. `subscription_started`) and replaying it to grant access long after the original purchase expired.

---

## Best Practices for Your Webhook Endpoint

1. **Strictly Require HTTPS:** SolydFlow will refuse to deliver production webhooks to plaintext `http://` endpoints.
2. **Never Parse JSON Before Hashing:** Remember the **Raw Body Rule**. Always compute the HMAC on the unparsed HTTP request bytes.
3. **Return HTTP 200 Fast (\<5s):** Never block the webhook response while sending onboarding emails or calling external APIs. Return `200 OK` immediately and dispatch tasks to a background queue.
4. **Rotate Webhook Secrets via Console:** If your `whsec_...` secret is ever exposed, rotate it immediately in **SolydFlow Console → Project Settings → API Management**.

---

## Implementation Code

For ready-to-copy verification handlers in **Node.js (Express)**, **Python (FastAPI)**, and **Supabase (Deno)**:

👉 **[See Production Signature Verification Handlers →](../webhooks/signature-verification.md)**

---

## Related Documentation

* **[Security Overview →](./overview.md)**
* **[Signature Verification Code →](../webhooks/signature-verification.md)**
* **[Event Handling Best Practices →](../webhooks/event-handling.md)**
* **[Credential Vault Security →](./credential-security.md)**
