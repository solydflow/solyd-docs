---
id: webhook-not-received
title: "Troubleshooting: Webhook Not Received"
sidebar_label: Webhook Not Received
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Troubleshooting: Webhook Not Received

If your backend server is not receiving outbound webhooks (`subscription_started`, `subscription_renewed`, or `subscription_revoked`), use this guide to identify where the delivery pipeline stalled.

```text
[1. Click "Send Test Webhook"] ➔ [2. Inspect Outbound Activity Log] ➔ [3. Check HTTP Response Code] ➔ [4. Apply 30s Fix]
```

---

## The 4 Most Common Culprits

| Issue | What Happened | How to Fix in 30 Seconds |
| :--- | :--- | :--- |
| **1. Localhost URL Configured** | You entered `http://localhost:3000/webhook` in the Console. SolydFlow cannot reach private local networks. | Use a public HTTPS tunnel like **ngrok** (`ngrok http 3000`) for local testing. |
| **2. The Raw Body Rule Broken** | Your server returned `401 Unauthorized` because Express/FastAPI parsed JSON before checking HMAC. | Use `express.raw({ type: 'application/json' })` so the hash is computed on unparsed bytes. |
| **3. Handler Timeout (>5s)** | Your server took >5 seconds to respond (e.g. sending emails or PDF generation inside handler). | **Acknowledge with `200 OK` first**, then dispatch heavy tasks to a background worker. |
| **4. HTTP 301/302 Redirect** | Your server redirected `http://` to `https://`, dropping the POST body. | Update your Console Webhook URL to use explicit `https://` directly. |

---

## Outbound Delivery Error Codes Matrix

In the [SolydFlow Console](https://console.solydflow.com), go to **Project Settings → Outbound Webhooks → Delivery Logs** to inspect recent delivery attempts:

| HTTP Status Code | Meaning | Root Cause & Resolution |
| :--- | :--- | :--- |
| **`401 Unauthorized`** | Cryptographic Signature Mismatch | Your server rejected the signature. Verify you are using the secret starting with `whsec_...` and hashing raw bytes. |
| **`504 Gateway Timeout`** | Server Took Too Long to Respond | SolydFlow enforces a strict **5-second timeout**. Return `{ "received": true }` immediately. |
| **`ECONNREFUSED`** | Server Unreachable | Your server is down, firewall is blocking inbound requests, or port is closed. |
| **`SSL_ERROR`** | Invalid / Self-Signed SSL Certificate | SolydFlow requires valid SSL certificates from trusted certificate authorities (Let's Encrypt, Cloudflare). |

---

## Step 1: Use the Built-in Test Tool

Before checking production transactions, verify basic connectivity:

1. Open **SolydFlow Console → Project Settings → Outbound Webhooks**.
2. Confirm your endpoint URL is set (e.g. `https://api.yourapp.com/webhook/solydflow`).
3. Click **"Send Test Webhook"**.
4. Check the **Delivery Status**:
   * **`200 OK` (Green):** Connectivity and signature verification are working properly.
   * **`4xx` / `5xx` (Red):** Click the event to view the raw response body returned by your server.

---

## Testing Webhooks Locally with Ngrok

To receive live or test webhooks while developing on your local machine:

1. Start your local server:
   ```bash
   node server.js # Running on port 3000
   ```
2. In a separate terminal, start an HTTPS tunnel:
   ```bash
   ngrok http 3000
   ```
3. Copy the secure forwarding URL (e.g., `https://a1b2-34-56.ngrok-free.app`).
4. In **SolydFlow Console → Outbound Webhooks**, set your endpoint to:
   ```text
   https://a1b2-34-56.ngrok-free.app/webhook/solydflow
   ```
5. Click **"Send Test Webhook"** to confirm your local server logs receive the event.

---

## Automated Retry Schedule

If your server was temporarily down or returned a `5xx` error, SolydFlow's recovery system does not drop the event. It automatically retries delivery:

```text
[Attempt 1: Immediate] ➔ [Attempt 2: 1 min later] ➔ [Attempt 3: 5 mins later] ➔ [Attempt 4: 30 mins later] ➔ [Attempt 5: 2 hours later]
```

Once your server recovers, incoming retried events will be delivered automatically. Ensure your handler is idempotent using `event_id`.

---

## Related Documentation

* **[Webhook Signature Verification Code →](../webhooks/signature-verification.md)**
* **[Event Handling Best Practices →](../webhooks/event-handling.md)**
* **[Handling Failed Webhooks →](../recover/failed-webhooks.md)**
* **[Troubleshooting Overview →](./overview.md)**
