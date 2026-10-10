---
id: merchant-of-record
title: Merchant of Record (MoR)
sidebar_label: Merchant of Record
---

# Merchant of Record (MoR)

:::info Status: Under Active Development 🚧
Native Merchant of Record integrations are currently in development. 

Today, SolydFlow operates under our production-ready **[Bring Your Own Keys (BYOK)](../concepts/projects.md)** model—connecting directly to your merchant accounts on Paystack, Flutterwave, Stripe, and M-Pesa.
:::

---

## What is a Merchant of Record?

A **Merchant of Record (MoR)** is a legal entity that sells digital products or software subscriptions to your end customer on your behalf.

```text
[1. Customer Purchases SaaS] ➔ [2. MoR Acts as Legal Reseller] ➔ [3. MoR Remits Global VAT & Sales Tax] ➔ [4. Net Payout Sent to You]
```

Because the MoR assumes legal liability for the transaction, they automatically calculate, collect, and remit digital services taxes (VAT, GST, US State Sales Tax) in over 100+ countries, shielding software developers from complex international tax audits.

---

## BYOK Gateway Model vs. Merchant of Record Model

SolydFlow is designed to support both models so businesses can choose the optimal balance of margins and compliance:

| Comparison Dimension | Direct Gateway Model (BYOK) *(Available Today)* | Merchant of Record (MoR) *(Upcoming)* |
| :--- | :--- | :--- |
| **Legal Seller of Record** | **Your Company** | **The MoR Entity** (e.g. Paddle / Dodo) |
| **Merchant Account Ownership**| You own your Paystack/Stripe/M-Pesa accounts directly. | Managed under the MoR’s global umbrella entity. |
| **International Tax & VAT** | Your business must file and remit sales tax/VAT manually. | **Handled 100% automatically** by the MoR. |
| **Typical Processing Cost** | Gateway fees only (~1.5% to 2.9% + markup). | All-in platform fee (~5% to 8% + transaction fee). |
| **Payout Destination** | Settles directly into your local or USD merchant bank. | Monthly or bi-weekly consolidated payout from the MoR. |

---

## Planned MoR Partner Integrations

SolydFlow is actively designing integrations with premier digital software MoRs:

| Planned Partner | Key Strengths | Regional Focus |
| :--- | :--- | :--- |
| **Dodo Payments** | Emerging-market friendly MoR for digital software and AI products. | Global with strong emerging market support. |
| **Paddle** | Enterprise-grade MoR for B2B SaaS and consumer software. | Global (US, UK, EU). |
| **Lemon Squeezy** | Developer-friendly MoR for creators, indie hackers, and SaaS apps. | Global (US, UK, EU). |

---

## The Hybrid Architecture: Local Rails + Global MoR

The primary pain point for African software companies is that global MoRs (like Paddle or Lemon Squeezy) do not support domestic African payment methods like **M-Pesa STK push** or **Nigerian Dynamic Virtual Accounts**.

SolydFlow's upcoming hybrid architecture will allow you to route:
* **Domestic African Checkouts (`NGN`, `KES`, `GHS`):** Through your direct Paystack/Monnify/M-Pesa merchant accounts (zero international tax drag, low 1.5% processing fees).
* **International Checkouts (`USD`, `EUR`, `GBP`):** Through an MoR partner to automate European VAT and US state sales tax compliance.

---

## Related Documentation

* **[Global Commerce Overview →](./overview.md)**
* **[Tax & Compliance Guidelines →](./tax-and-compliance.md)**
* **[International Payments (Stripe) →](./international-payments.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
