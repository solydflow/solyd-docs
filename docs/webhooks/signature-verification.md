---
id: signature-verification
title: Webhook Signature Verification
sidebar_label: Signature Verification
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhook Signature Verification

To guarantee that incoming webhook requests actually originated from SolydFlow and were not intercepted or modified, every outbound request is cryptographically signed using **Timestamped HMAC-SHA256**.

```text
[1. Extract t & v1 Headers] ➔ [2. Verify Timestamp < 5 mins] ➔ [3. Hash: timestamp + . + rawBody] ➔ [4. Timing-Safe Compare]
```

---

## How It Works

SolydFlow transmits the signature in the `X-SolydFlow-Signature` HTTP header:

```text
X-SolydFlow-Signature: t=1677638400,v1=5a8d29bf1c...
```

* **`t`**: UNIX timestamp when the event was generated.
* **`v1`**: HMAC-SHA256 hex digest of the payload.
* **Signing Secret:** Starts with `whsec_...` (Found in **Console → API Management**).

:::danger{title="The 'Raw Body' Rule (Crucial)"}
To compute the signature correctly, you **must hash the raw, unparsed HTTP body bytes** exactly as received. If your server framework (Express, FastAPI, Django) parses the JSON into an object first and converts it back to a string, whitespace or key ordering will change, causing verification to fail.
:::

---

## Production Verification Handlers

<Tabs>
<TabItem value="nodejs" label="Node.js (Express)" default>

```javascript title="src/webhook.js"
const express = require('express');
const crypto = require('crypto');
const app = express();

const WEBHOOK_SECRET = process.env.SOLYDFLOW_WEBHOOK_SECRET; // whsec_...

// Use express.raw() to preserve unparsed bytes
app.post('/webhook/solydflow', express.raw({ type: 'application/json' }), (req, res) => {
  const sigHeader = req.headers['x-solydflow-signature'];

  if (!sigHeader) {
    return res.status(401).send('Missing signature header');
  }

  try {
    // 1. Parse header components
    const parts = sigHeader.split(',');
    const timestamp = parts.find(p => p.startsWith('t=')).split('=')[1];
    const signature = parts.find(p => p.startsWith('v1=')).split('=')[1];

    // 2. Prevent Replay Attacks (5-minute tolerance)
    const fiveMinsAgo = Math.floor(Date.now() / 1000) - 300;
    if (parseInt(timestamp, 10) < fiveMinsAgo) {
      return res.status(400).send('Webhook expired (replay attack)');
    }

    // 3. Compute expected signature: timestamp + "." + rawBody
    const rawBody = req.body.toString('utf8');
    const payloadToSign = `${timestamp}.${rawBody}`;
    
    const expectedSig = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(payloadToSign)
      .digest('hex');

    // 4. Constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );

    if (!isValid) {
      return res.status(401).send('Invalid cryptographic signature');
    }

    // 5. Signature verified safely; process business logic
    const event = JSON.parse(rawBody);
    console.log("✅ Verified SolydFlow Event:", event.event);

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(400).send('Webhook verification failed');
  }
});
```

</TabItem>
<TabItem value="python" label="Python (FastAPI)">

```python title="src/webhook.py"
import hmac
import hashlib
import time
from fastapi import FastAPI, Request, HTTPException, Header

app = FastAPI()
WEBHOOK_SECRET = "whsec_..." # Set via environment variable

def verify_solydflow_signature(raw_body: bytes, sig_header: str, secret: str) -> bool:
    try:
        # 1. Parse header components
        parts = {p.split('=')[0]: p.split('=')[1] for p in sig_header.split(',')}
        timestamp = parts.get('t')
        signature = parts.get('v1')

        if not timestamp or not signature:
            return False

        # 2. Prevent Replay Attacks (5-minute tolerance)
        if time.time() - int(timestamp) > 300:
            return False

        # 3. Compute expected signature
        payload_to_sign = f"{timestamp}.".encode('utf-8') + raw_body
        expected_sig = hmac.new(
            secret.encode('utf-8'),
            msg=payload_to_sign,
            digestmod=hashlib.sha256
        ).hexdigest()

        # 4. Constant-time comparison
        return hmac.compare_digest(expected_sig, signature)
    except Exception:
        return False

@app.post("/webhook/solydflow")
async def handle_webhook(request: Request, x_solydflow_signature: str = Header(None)):
    raw_body = await request.body()
    
    if not x_solydflow_signature or not verify_solydflow_signature(raw_body, x_solydflow_signature, WEBHOOK_SECRET):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = await request.json()
    print("✅ Verified Event:", payload.get("event"))
    return {"status": "success"}
```

</TabItem>
<TabItem value="supabase" label="Supabase Edge Functions (Deno)">

```typescript title="supabase/functions/solydflow-webhook/index.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const WEBHOOK_SECRET = Deno.env.get("SOLYDFLOW_WEBHOOK_SECRET")!; // whsec_...

serve(async (req) => {
  const sigHeader = req.headers.get("x-solydflow-signature");
  if (!sigHeader) return new Response("Missing signature", { status: 401 });

  // 1. Extract raw text body
  const rawBody = await req.text();

  // 2. Parse timestamp & signature
  const parts = Object.fromEntries(sigHeader.split(",").map(p => p.split("=")));
  const { t: timestamp, v1: signature } = parts;

  // 3. Replay attack check (5-minute tolerance)
  if (Math.floor(Date.now() / 1000) - parseInt(timestamp) > 300) {
    return new Response("Webhook expired", { status: 400 });
  }

  // 4. Compute expected HMAC-SHA256
  const payloadToSign = `${timestamp}.${rawBody}`;
  const expectedSig = hmac("sha256", WEBHOOK_SECRET, payloadToSign, "utf8", "hex");

  if (signature !== expectedSig) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log("✅ Verified Event:", event.event);

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
```

</TabItem>
</Tabs>

---

## Testing Your Implementation

You can test your signature verification without making a real purchase:

1. Open the [SolydFlow Console](https://console.solydflow.com).
2. Go to **Project Settings → Outbound Webhooks**.
3. Click **"Send Test Webhook"**.
4. SolydFlow will immediately dispatch a signed `test_event` payload to your endpoint.
5. Check your server logs to confirm that the HMAC signature was accepted with an HTTP `200 OK`.

---

## Related Documentation

* **[Webhooks Overview →](./overview.md)**
* **[Event Handling Best Practices →](./event-handling.md)**
* **[Webhook Security Overview →](../security/webhook-security.md)**
