---
id: compliance
title: Compliance & Regulatory Standards
sidebar_label: Compliance
---

# Compliance & Regulatory Standards

Operating across African and international payment rails requires compliance with payment card security standards and regional data privacy regulations.

```text
[1. Zero-Custody BYOK Model] ➔ [2. PCI-DSS SAQ-A Scoping] ➔ [3. Data Privacy (NDPR / GDPR)] ➔ [4. Shared Responsibility]
```

SolydFlow is architected to minimize your regulatory burden—ensuring cardholder data never touches your application servers while maintaining compliance with regional data protection frameworks.

---

## PCI-DSS SAQ-A Scoping

The Payment Card Industry Data Security Standard (PCI-DSS) applies to any business that accepts card payments.

Because SolydFlow uses hosted checkouts and gateway SDK elements (Paystack, Flutterwave, Stripe):

* **Card Numbers (PAN) Never Touch Your Servers:** Customers input card numbers directly into gateway-hosted, tokenized iframes or secure payment sheets.
* **Simplest Compliance Level (SAQ-A):** Your application qualifies for **Self-Assessment Questionnaire A (SAQ-A)**—the shortest and simplest PCI assessment tier.
* **Zero Cardholder Storage:** Neither your backend nor SolydFlow ever stores raw 16-digit card numbers or 3-digit CVVs in plain text.

---

## The Shared Responsibility Matrix

Security and compliance are a shared partnership between SolydFlow and your development team:

| Operational Domain | SolydFlow Responsibilities | Your Application Responsibilities |
| :--- | :--- | :--- |
| **Payment Card Data** | Ensures payment forms render securely from PCI-compliant gateways. | Never intercept, log, or store raw card numbers on your server. |
| **API Credential Security**| Hardware AES-256-GCM encryption of keys in the BYOK Vault. | Keep your Secret Key (`sf_sk_...`) in secure environment variables; never commit to Git. |
| **Webhook Delivery** | Cryptographically signs all outbound webhooks with HMAC-SHA256. | Verify the `X-SolydFlow-Signature` header before updating your database. |
| **User Authentication** | Scopes entitlements to the provided `user_id`. | Secure your login, password hashing, and user session management (OAuth/Firebase/Supabase). |
| **Customer Data Storage** | Enforces TLS 1.3 in transit and role-based access in the Console. | Enforce two-factor authentication (2FA) for your console team members. |

---

## Regional Data Privacy Standards

When collecting customer email addresses and international phone numbers (`+234...`, `+254...`), SolydFlow aligns with local data protection regulations:

### 1. Nigeria: NDPR (Nigeria Data Protection Regulation)
* **Purpose of Collection:** Customer phone numbers and emails are collected strictly for payment receipt delivery, M-Pesa/USSD transaction routing, and subscription recovery.
* **Data Minimization:** SolydFlow collects only the minimum identifiers required to link a transaction to a customer profile.

### 2. Kenya: Data Protection Act (2019)
* **Mobile Money Identifiers:** MSISDN phone numbers used for M-Pesa STK pushes are transmitted via encrypted TLS tunnels directly to Safaricom Daraja endpoints.

### 3. Global / Europe: GDPR & UK-GDPR
* **Right to Erasure (Account Deletion):** When a user requests account deletion, non-financial profile metadata can be scrubbed. 
* **Financial Record Retention:** By banking law, immutable financial transaction records in the ledger are retained for statutory accounting periods (up to 7 years) to satisfy tax and anti-money laundering (AML) audits.

---

## Compliance Checklist for Going Live

Before accepting live customer payments:

- [ ] **Verify SAQ-A Eligibility:** Confirm that your frontend only uses SolydFlow's native SDK or hosted checkout redirect.
- [ ] **Enforce HTTPS:** Ensure your production webhook receiver uses a valid TLS/SSL certificate.
- [ ] **Publish Privacy Policy:** Clearly disclose to your customers that payments are processed securely via registered payment gateways.
- [ ] **Enable 2FA:** Require two-factor authentication for all administrators on your SolydFlow organization account.

---

## Related Documentation

* **[Security Overview →](./overview.md)**
* **[API Credentials Vault (BYOK) →](./credential-security.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Production Launch Checklist →](../production/production-checklist.md)**
