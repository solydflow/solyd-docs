---
id: overview
title: Global Commerce Overview
sidebar_label: Overview
---

# Global Commerce Overview

Expanding a digital business across Africa and international markets introduces significant friction: volatile currency exchange rates, high bank card decline rates on cross-border payments, and fragmented payment preferences.

```text
[1. Detect Customer Geo-IP] ➔ [2. Display Local Currency & PPP Price] ➔ [3. Route to Native Payment Rail] ➔ [4. Unified Multi-Currency Ledger]
```

**SolydFlow Global Commerce** unifies local African payment rails (M-Pesa, Paystack, Monnify, Flutterwave) and international gateways (Stripe) into a single orchestration layer. You can price in local currencies, route to domestic processors, and maintain a single source of truth across all markets.

---

## The Cross-Border Problem SolydFlow Solves

When an application attempts to sell globally using only an international gateway (like Stripe USD):

* **Prohibitive Card Declines:** Local African bank debit cards frequently block international foreign currency (USD) transactions.
* **Unfair FX Conversions:** Customers get hit with unpredictable 3% to 7% bank FX conversion surcharges.
* **Exclusion of Non-Card Users:** In East Africa, over **80% of digital payments** happen via Mobile Money (M-Pesa), not international credit cards.

**SolydFlow eliminates this friction** by allowing you to offer localized packages and domestic payment rails to users in Nigeria, Kenya, Ghana, and South Africa, while automatically falling back to Stripe for global users.

---

## Geo-IP Resolution & Fallback Matrix

When a user opens your paywall, SolydFlow's routing engine automatically serves the optimal regional package:

| Customer Country | Detected Currency | Resolved Package | Payment Rail Used |
| :--- | :--- | :--- | :--- |
| **🇳🇬 Nigeria** | `NGN` | `pro_monthly_ngn` (`₦5,000`) | Paystack / Monnify Virtual Account |
| **🇰🇪 Kenya** | `KES` | `pro_monthly_kes` (`KSh 500`) | Safaricom M-Pesa STK Push |
| **🇬🇭 Ghana** | `GHS` | `pro_monthly_ghs` (`GH₵ 65`) | Flutterwave Mobile Money |
| **🇿🇦 South Africa** | `ZAR` | `pro_monthly_zar` (`R 99`) | Paystack EFT / Cards |
| **🌍 Rest of World**| `USD` | `pro_monthly_usd` (`$4.99`) | Stripe Global Credit Cards (Fallback) |

:::tip Universal USD Fallback
If a customer accesses your app from an unmapped region (e.g. Germany, Japan, or Brazil), SolydFlow automatically defaults to your base USD package via Stripe.
:::

---

## The 5 Pillars of Global Commerce

| Capability | What It Does | Why It Matters |
| :--- | :--- | :--- |
| **[Local Payments](./local-payments.md)** | Direct integration with regional mobile money and virtual accounts. | Unlocks payments for non-card populations across Africa. |
| **[International Payments](./international-payments.md)** | Global card processing with 3D-Secure and Apple/Google Pay. | Seamless global monetization across the US, UK, and Europe. |
| **[Merchant of Record Model](./merchant-of-record.md)** | Understand direct BYOK processing vs. MoR legal structures. | Clear guidance on tax collection, payouts, and compliance. |
| **[Tax and Compliance](./tax-and-compliance.md)** | Guidance on VAT, digital services taxes, and cross-border invoicing. | Avoids surprise tax penalties when selling software globally. |
| **[Multi-Currency Architecture](./multi-currency.md)** | Managing pricing matrices, exchange rate volatility, and base ledgers. | Protects your operating margins against currency devaluation. |

---

## Single Unified Entitlement Layer

Regardless of the currency paid or the gateway that processed the transaction, your application only checks one unified entitlement:

```dart title="What You Check in Flutter"
// Same 1 line of code whether paid via M-Pesa in Kenya or Stripe in the US:
bool isPro = await SolydFlow.hasEntitlement("pro_access");
```

---

## Related Documentation

* **[Regional Pricing & PPP →](../monetization/regional-pricing.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
* **[Payment Providers Overview →](../payment-providers/overview.md)**
* **[Entitlements Architecture →](../concepts/entitlements.md)**
