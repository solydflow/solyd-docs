---
id: encryption
title: Encryption in Transit & At Rest
sidebar_label: Encryption
---

# Encryption in Transit & At Rest

SolydFlow enforces cryptographic protection across every stage of the revenue lifecycle: across the wire, inside our cloud vaults, and locally on customer mobile devices.

```text
[1. TLS 1.3 in Transit] ➔ [2. Ingest via Edge Network] ➔ [3. AES-256-GCM Vault at Rest] ➔ [4. Device Keychain/Keystore]
```

---

## The 3 Encryption Domains

| Domain | Where It Operates | Cryptographic Standard | What It Protects |
| :--- | :--- | :--- | :--- |
| **1. In Transit** | Client ➔ SolydFlow ➔ Payment Rails | **TLS 1.2 / TLS 1.3 with HSTS** | Prevents packet sniffing, ISP eavesdropping, and Man-in-the-Middle (MitM) attacks. |
| **2. At Rest (Cloud)** | API Credentials Vault & Immutable Ledger | **AES-256-GCM** | Protects gateway secret keys (`sk_live_...`, `FLWSECK_...`) and financial ledger records. |
| **3. On Device (Mobile)**| SolydFlow Flutter & Native Client SDKs | **Android Keystore / iOS Keychain** | Encrypts cached entitlement records so users cannot alter access on rooted/jailbroken devices. |

---

## 1. Encryption in Transit (Network Security)

All network traffic between your client applications, your backend, SolydFlow, and third-party payment rails is encrypted over HTTPS:

* **Modern Cipher Suites:** SolydFlow enforces TLS 1.3 (with fallback to TLS 1.2 for older devices). Insecure ciphers (SSLv3, TLS 1.0, and TLS 1.1) are permanently disabled.
* **HTTP Strict Transport Security (HSTS):** Enforces encrypted connections and prevents SSL-stripping attacks.
* **Ephemeral PFS (Perfect Forward Secrecy):** Ensures that even if a future server key were compromised, historical session traffic cannot be decrypted.

---

## 2. Encryption at Rest (API Credentials Vault)

Your third-party merchant credentials (Paystack Secret Keys, Stripe Keys, M-Pesa PassKeys) are stored in the **API Credentials Vault**:

* **AES-256-GCM Encryption:** Keys are encrypted before touching disk.
* **Ephemeral Decryption:** Secrets are only decrypted in volatile memory during active server-to-server consensus checks and are immediately scrubbed from memory after the request completes.
* **Log Redaction:** Automated log filters scrub known key patterns (`sk_live_...`, `FLWSECK_...`, `whsec_...`) to ensure secrets never leak into debugging logs.

---

## 3. On-Device Encryption (Offline Entitlement Defense)

To allow subscribers to use paid features without internet access (e.g. on an airplane or subway), the SolydFlow mobile SDK caches entitlement data locally.

To prevent users from modifying local JSON files or shared preferences on rooted/jailbroken devices:

```text
[Cloud Ledger Settlement] ➔ [Encrypt with Device Hardware Key] ➔ [Write to Secure Storage] ➔ [Instant <5ms Offline Check]
```

* **Android:** Keys are managed via the **Android Keystore system** and encrypted using AES-GCM via `EncryptedSharedPreferences`.
* **iOS:** Keys and entitlement states are stored inside the hardware **iOS Keychain**, protected by the Secure Enclave.

---

## Developer Security Checklist

* [ ] **Enforce HTTPS:** Ensure all webhook receiver URLs configured in the SolydFlow Console use `https://`.
* [ ] **Keep Secrets Off Git:** Never commit `sf_sk_...` or `whsec_...` keys to version control.
* [ ] **MinSdkVersion 21 on Android:** Ensure your Android project target is API Level 21+ to support hardware-backed AES encryption.

---

## Related Documentation

* **[Security Overview →](./overview.md)**
* **[API Credentials Vault (BYOK) →](./credential-security.md)**
* **[Webhook Security & Replay Defense →](./webhook-security.md)**
* **[Audit Logs & Traceability →](./audit-logs.md)**
