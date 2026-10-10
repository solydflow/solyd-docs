---
id: production-checklist
title: Production Launch Checklist
sidebar_label: Production Checklist
---

# Production Launch Checklist

Before flipping your project from Sandbox to Live mode and accepting customer payments, complete this pre-flight verification checklist.

```text
[1. Verify Live Vault Credentials] ➔ [2. Audit Packages & Currency Units] ➔ [3. Verify Webhook Signatures] ➔ [4. Run $1 / ₦100 Smoke Test]
```

---

## 1. API Keys & Vault Credentials

- [ ] **Live Public Key in Client App:** Ensure your production mobile build or web deployment uses your **Live Public Key** (`sf_pk_live_...`), not your test key.
- [ ] **Secret Key Stored in Backend `.env`:** Verify that `sf_sk_live_...` resides only on your backend server and is never committed to Git.
- [ ] **BYOK Credentials Vault Updated:** In **Project Settings → API Credentials Vault**, ensure live keys are saved and verified with green status pings:
  - Paystack Live Secret Key (`sk_live_...`)
  - Stripe Live Secret Key (`sk_live_...`)
  - Flutterwave Live Secret Key (`FLWSECK_LIVE...`)
  - M-Pesa Live Daraja Consumer Key, Secret & PassKey
  - Monnify Live Secret Key & Contract Code

---

## 2. Products, Packages & Regional Pricing

- [ ] **Base Currency Units Verified:** Confirm all prices are stored in the smallest integer currency unit (e.g., `₦5,000` = `500000` kobo; `$4.99` = `499` cents).
- [ ] **Every Package Mapped to an Entitlement:** Confirm under **Pricing & Products** that every active package points to a valid entitlement (e.g. `pro_monthly_ngn` ➔ `pro_access`).
- [ ] **Tier Levels Configured:** Ensure packages have numeric `tier_level` values set (`1`, `2`, `3`) to power automated **Smart Upgrade Credits**.
- [ ] **Default USD Fallback Active:** Verify a base USD package exists to serve unmapped international countries.

---

## 3. Webhooks & Backend Fulfillment

- [ ] **Inbound Gateway Webhooks Configured:** Verify each connected provider dashboard has your unique SolydFlow webhook URL configured:
  ```text
  https://api.solydflow.com/api/v1/webhook/{provider}/{your_solydflow_api_key}
  ```
- [ ] **Outbound Webhook Receiver Live:** Confirm your server webhook URL is saved under **Outbound Webhooks** with valid HTTPS.
- [ ] **HMAC Signature Verified:** Ensure your server verifies `X-SolydFlow-Signature` using your secret (`whsec_...`) and the **raw, unparsed body bytes**.
- [ ] **5-Minute Replay Defense Active:** Reject payloads where `Date.now() - timestamp > 300` seconds.
- [ ] **Idempotency Handled:** Confirm your backend deduplicates events using `payload.event_id`.
- [ ] **Fast Acknowledgment (\<5s):** Confirm your server returns `200 OK` immediately before queueing background jobs.

---

## 4. Mobile (Flutter / iOS / Android) Client Readiness

- [ ] **Android MinSdkVersion 21:** Verify `android/app/build.gradle` has `minSdkVersion = 21` for hardware AES-GCM local caching.
- [ ] **iOS Deployment Target:** Verify `ios/Podfile` is set to `platform :ios, '13.0'` or higher.
- [ ] **Restore Purchases Button:** Confirm iOS and Android builds expose a working "Restore Purchases" button in settings.
- [ ] **Offline Access Tested:** Verify that `hasEntitlement("pro_access")` unlocks features on a physical device in Airplane Mode.

---

## 5. The $1 / ₦100 Real-Money Smoke Test

Before opening your app to the public, execute one complete real-money transaction:

1. Create a temporary hidden package priced at **₦100** or **$1.00**.
2. Complete checkout on a live device using your personal bank card or M-Pesa phone number.
3. Verify in the **SolydFlow Console**:
   - Transaction state transitions to **`SETTLED_CONSENSUS`**.
   - Your customer profile shows the entitlement is **Active**.
   - Your backend database receives and acknowledges the `subscription_started` webhook.
   - Payout appears in your Paystack/Stripe/M-Pesa merchant dashboard.
4. Issue a refund from your gateway dashboard and verify your backend receives `subscription_revoked`.
5. Archive or delete the temporary test package.

---

## Related Documentation

* **[Going Live Step-by-Step →](./going-live.md)**
* **[Production Monitoring & Health →](./monitoring.md)**
* **[API Credentials Vault (BYOK) →](../security/credential-security.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
