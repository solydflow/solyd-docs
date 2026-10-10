---
id: credential-security
title: API Credentials Vault (BYOK)
sidebar_label: Credential Security
---

# API Credentials Vault (BYOK)

SolydFlow operates under a secure **Bring Your Own Keys (BYOK)** architecture. You retain direct ownership of your merchant accounts, bank payouts, and compliance, while SolydFlow manages routing, consensus verification, and recovery.

```text
[1. Enter Gateway Secret] ➔ [2. Encrypt with AES-256-GCM] ➔ [3. Store in Encrypted Vault] ➔ [4. Ephemeral In-Memory Use Only]
```

Your third-party gateway credentials (Paystack, Stripe, Flutterwave, Monnify, M-Pesa) are protected by hardware-backed encryption and are **never exposed to client applications**.

---

## The BYOK Credentials Matrix

The table below outlines the sensitive credentials managed inside the **API Credentials Vault**:

| Payment Provider | Credential Stored | Encryption Standard | Usage Scope |
| :--- | :--- | :--- | :--- |
| **Paystack** | Secret Key (`sk_live_...` / `sk_test_...`) | AES-256-GCM at rest | Server-to-server verification & refund requests. |
| **Stripe** | Secret Key (`sk_live_...` / `sk_test_...`) | AES-256-GCM at rest | Server-to-server PaymentIntent creation & queries. |
| **Flutterwave** | Secret Key (`FLWSECK_LIVE...`) | AES-256-GCM at rest | Server-to-server transaction verification. |
| **M-Pesa (Daraja)**| Consumer Secret + Online PassKey | AES-256-GCM at rest | Dispatches STK pushes & queries transaction status. |
| **Monnify** | Secret Key + Contract Code | AES-256-GCM at rest | Generates dynamic virtual accounts & verifies transfers. |
| **Apple / Google** | Private Key (`.p8`) / Service JSON | AES-256-GCM at rest | App Store Server API & Google Play API verification. |

:::info Hardware-Backed Security
All gateway credentials stored in the SolydFlow Vault are encrypted at rest using AES-256-GCM before writing to persistent storage.
:::

---

## Ephemeral In-Memory Decryption

To eliminate unauthorized exposure, SolydFlow enforces **Ephemeral Decryption**:

```text
[Encrypted Vault Key] ➔ [Decrypt in Volatile Memory for REST Query] ➔ [Execute API Check] ➔ [Memory Immediately Flushed]
```

1. **Never Stored in Plaintext:** Keys are never written to disk unencrypted.
2. **Filtered from Logs:** All internal application logs automatically scrub and redact any strings matching known secret key patterns (`sk_live_...`, `FLWSECK_...`).
3. **Zero Client Exposure:** Public SDKs (Flutter, JavaScript, iOS, Android) cannot query the Vault. Only your publishable key (`sf_pk_...`) is ever passed to client apps.

---

## Dashboard Masking & Role-Based Access (RBAC)

Inside the [SolydFlow Console](https://console.solydflow.com):

* **Default Masking:** Secret keys are masked by default (e.g. `sk_live_••••••••••••1029`).
* **Temporary Reveal:** Only verified organization **Owners** or **Admins** with two-factor authentication (2FA) enabled can temporarily reveal a key for maintenance.
* **Audit Logging:** Every time a credential is viewed, updated, or rotated, an immutable event is logged in your **Security Audit Trail**.

---

## Best Practices for Credential Hygiene

1. **Delete Unused Gateway Credentials:** If you migrate away from a payment rail (e.g., closing a Flutterwave account in favor of Paystack), delete the keys from the Vault immediately.
2. **Rotate Keys Regularly:** When you rotate keys in your Paystack or Stripe dashboard, update the Vault immediately to prevent consensus verification timeouts.
3. **Enforce Two-Factor Authentication (2FA):** Ensure all team members with Console access have 2FA enabled on their SolydFlow accounts.

---

## Related Documentation

* **[Security Overview →](./overview.md)**
* **[API Keys & Key Management →](./api-keys.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
