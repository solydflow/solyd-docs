---
id: overview
title: Security Overview
sidebar_label: Overview
---

# Security Overview

Security is foundational to SolydFlow. Because our infrastructure bridges African payment rails with global banking systems, our security architecture enforces a **Zero-Trust** model across every API request, webhook delivery, and local storage read.

```text
[1. Public Key Client Auth] ➔ [2. Encrypted AES-256 Vault (BYOK)] ➔ [3. Signed Webhooks (HMAC)] ➔ [4. Immutable Ledger Audit]
```

SolydFlow never holds merchant funds, never exposes gateway secret keys to mobile clients, and encrypts all on-device entitlement caches using hardware-backed cryptographic modules.

---

## The 3 Key Types & Security Boundaries

To maintain zero credential exposure, SolydFlow separates keys by operational environment:

| Key Type | Prefix | Where It Lives | Exposure Level |
| :--- | :--- | :--- | :--- |
| **Publishable / Public Key** | `sf_pk_live_...`<br/>`sf_pk_test_...` | Flutter app, React/Next.js frontend, iOS/Android bundles. | **Public.** Safe to ship inside compiled mobile binaries and public web bundles. |
| **Secret API Key** | `sf_sk_live_...`<br/>`sf_sk_test_...` | Your backend servers, cloud functions, server environment variables. | **Confidential.** Never expose to clients. Grants administrative API access. |
| **Webhook Signing Secret** | `whsec_...` | Backend webhook receivers (Node.js, Python, Supabase). | **Confidential.** Used strictly to verify the cryptographic `X-SolydFlow-Signature`. |

:::danger{title="Never Expose Secret Keys"}
Embedding `sf_sk_...` or `whsec_...` inside a mobile application or frontend web bundle allows attackers to forge transactions or access administrative ledger endpoints.
:::

---

## The 6 Pillars of SolydFlow Security

| Security Pillar | Protection Mechanism | Why It Matters |
| :--- | :--- | :--- |
| **[API Keys](./api-keys.md)** | Scoped public and private key pairs for Sandbox and Live modes. | Eliminates cross-environment leakage and limits blast radius. |
| **[Credential Security](./credential-security.md)** | **Bring Your Own Keys (BYOK)** with hardware-backed AES-256-GCM encryption at rest. | SolydFlow never holds your payouts; gateway credentials remain private. |
| **[Webhook Security](./webhook-security.md)** | Timestamped HMAC-SHA256 signatures with 5-minute replay attack defense. | Prevents webhook spoofing, replay attacks, and man-in-the-middle tampering. |
| **[Encryption](./encryption.md)** | TLS 1.3 in transit and hardware Keystore/Keychain encryption on client devices. | Ensures entitlement states cannot be modified on rooted/jailbroken devices. |
| **[Audit Logs](./audit-logs.md)** | Tamper-proof, append-only logging of every configuration and financial transition. | Complete audit trail for compliance, forensic debugging, and accounting. |
| **[Compliance & Regulations](./compliance.md)** | Aligned with PCI-DSS SAQ-A, NDPR (Nigeria), and GDPR data privacy standards. | Simplifies your regulatory obligations when processing cross-border payments. |

---

## The BYOK Zero-Custody Guarantee

SolydFlow operates under a strict **Zero-Custody Model**:

```text
Customer Card / M-Pesa ➔ Payment Rail (Paystack/Stripe) ➔ Your Merchant Bank Account
                                      │
                                      ▼
                        [SolydFlow Consensus Engine]
                           (Zero Access to Funds)
```

1. **Direct Settlements:** All funds clear directly into your registered merchant bank accounts.
2. **Zero Escrow:** SolydFlow never sits in the flow of funds, eliminating intermediary counterparty risk.
3. **Encrypted Vault Storage:** Your provider secret keys are encrypted with AES-256-GCM before touching disk and are only decrypted in-memory during server-to-server consensus calls.

---

## Related Documentation

* **[API Keys Configuration →](./api-keys.md)**
* **[Credential Vault Security →](./credential-security.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
