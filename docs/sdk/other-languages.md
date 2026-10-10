---
id: other-languages
title: Other Languages & Direct REST API
sidebar_label: Other Languages / REST
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Other Languages & Direct REST API

If SolydFlow does not currently offer an official native SDK for your language (such as **Python, PHP/Laravel, Go, Java, Ruby, or C# / .NET**), you can integrate directly using our standard **REST API** and signed **Webhooks**.

```text
[1. Direct REST API Call] ➔ [2. Pass User ID & Package ID] ➔ [3. Receive Hosted Checkout URL] ➔ [4. Fulfill via Webhook]
```

---

## Complete SDK Status & Roadmap

| Platform / Language | Package | Status | Documentation |
| :--- | :--- | :--- | :--- |
| **Flutter (Dart)** | `solydflow_flutter` | ✅ **Production Ready** | **[Flutter SDK →](./flutter.md)** |
| **JavaScript / TypeScript** | `solydflow-js` | ✅ **Production Ready** | **[JavaScript SDK →](./javascript.md)** |
| **React Native** | `@solydflow/react-native` | 🚧 *Private Preview* | **[React Native SDK →](./react-native.md)** |
| **iOS (Swift)** | `SolydFlowSwift` | 🚧 *Private Beta* | **[Swift SDK →](./swift.md)** |
| **Android (Kotlin)** | `com.solydflow.android` | 🚧 *Private Beta* | **[Kotlin SDK →](./kotlin.md)** |
| **Python / Go / PHP / Other** | Direct REST API | ✅ **Production Ready** | Follow the REST guide below |

---

## Integrating via Direct REST API

Any backend or client capable of sending HTTPS requests can initiate checkouts directly:

### 1. Initialize a Checkout Session (cURL Example)

Send an authenticated `POST` request to the SolydFlow API using your **Secret Key** (`sf_sk_live_...` or `sf_sk_test_...`):

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -X POST https://api.solydflow.com/api/v1/checkouts \
  -H "Authorization: Bearer sf_sk_live_1982736450192837465019283" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr_supabase_991823",
    "package_id": "pro_monthly_ngn",
    "customer_email": "customer@example.com",
    "customer_phone": "+2348012345678",
    "success_url": "https://yourapp.com/dashboard?success=true",
    "cancel_url": "https://yourapp.com/pricing"
  }'
```

</TabItem>
<TabItem value="python" label="Python (Requests)">

```python
import requests

url = "https://api.solydflow.com/api/v1/checkouts"
headers = {
    "Authorization": "Bearer sf_sk_live_1982736450192837465019283",
    "Content-Type": "application/json"
}
payload = {
    "user_id": "usr_991823",
    "package_id": "pro_monthly_ngn",
    "customer_email": "customer@example.com",
    "customer_phone": "+2348012345678",
    "success_url": "https://yourapp.com/success",
    "cancel_url": "https://yourapp.com/pricing"
}

response = requests.post(url, json=payload, headers=headers)
checkout_url = response.json().get("checkout_url")
# Redirect user to checkout_url
```

</TabItem>
</Tabs>

### 2. Sample API Response

```json
{
  "status": "success",
  "checkout_url": "https://checkout.solydflow.com/pay/chk_01J8K9B2D7E4F1A0C5E8",
  "transaction_id": "txn_01J8K9B2D7E4F1A0C5E8",
  "currency": "NGN",
  "amount_minor": 500000
}
```

Redirect your customer to the returned `checkout_url`. SolydFlow's **Smart Router** automatically presents the optimal payment rail (Paystack, Monnify, M-Pesa, or Stripe).

---

## 2. Fulfilling Purchases on Your Backend

When the customer completes payment, SolydFlow sends a signed webhook to your server (`subscription_started` or `subscription_renewed`):

* Verify the `X-SolydFlow-Signature` header using your secret (`whsec_...`).
* Grant the user access in your database until `expires_at`.
* See **[Webhook Signature Verification →](../webhooks/signature-verification.md)** for complete handlers in Node.js, Python, and Supabase.

---

## Related Documentation

* **[SDK Overview →](./overview.md)**
* **[JavaScript / TypeScript SDK →](./javascript.md)**
* **[Flutter Mobile SDK →](./flutter.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
