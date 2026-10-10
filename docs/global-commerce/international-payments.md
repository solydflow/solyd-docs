---
id: international-payments
title: International Payments & Global Rails
sidebar_label: International Payments
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# International Payments & Global Rails

While local payment rails unlock emerging market conversion, international customers expect seamless credit card processing, 3D-Secure authorization, and mobile wallets (**Apple Pay and Google Pay**).

```text
[1. International Customer (USD/EUR/GBP)] ➔ [2. Route to Global Rail (Stripe)] ➔ [3. 3DS / Apple Pay Auth] ➔ [4. Direct Settlement to Your Bank]
```

SolydFlow enables African and cross-border businesses to accept international card payments globally by connecting **Stripe** or **Paystack International**, while managing transactions and entitlements alongside domestic rails.

---

## Global Payment Rails Matrix

| Payment Rail | Primary Markets | Supported Methods | Best For |
| :--- | :--- | :--- | :--- |
| **[Stripe](../payment-providers/stripe.md)** | United States, UK, EU, Canada, Australia | Visa, Mastercard, American Express, Apple Pay, Google Pay, SEPA Direct Debit | Global SaaS, enterprise tiers, and non-African cardholders. |
| **[Paystack (International)](../payment-providers/paystack.md)** | African registered entities accepting international cards | International Visa and Mastercard in `USD` or `NGN` | African businesses without a foreign registered entity. |
| **[Apple In-App Purchases](../payment-providers/apple.md)** | Global iOS App Store (175+ countries) | StoreKit 2 Subscriptions & In-App Purchases | Mobile consumer subscriptions distributed via the App Store. |
| **[Google Play Billing](../payment-providers/google-play.md)** | Global Google Play Store (190+ countries) | Google Play Store Subscriptions | Android consumer subscriptions distributed via Google Play. |

---

## The Zero-Custody Settlement Guarantee

A critical architectural pillar of SolydFlow is that **we never sit in the flow of your money**:

```text
Customer Pays $49.99 USD ➔ Gateway (Stripe / Paystack) ➔ Direct Deposit into Your Bank Account
                                      │
                                      ▼
                        [SolydFlow Consensus Engine]
                           (Zero Access to Funds)
```

1. **Direct Payouts:** Funds clear directly into your company’s registered merchant bank accounts according to your gateway's standard payout schedule.
2. **Zero Escrow Risk:** Because SolydFlow is not a financial intermediary, your revenues are never frozen, pooled, or subject to third-party reserve withholdings.
3. **Transparent Merchant Records:** Your customers see your business name on their credit card statements.

---

## Hedging Against FX Devaluation

For African software companies operating in volatile currency environments, selling to international customers in hard currencies is essential for protecting profit margins:

* **Base USD Anchor:** You can configure your global tier as `pro_monthly_usd` (`$4.99 USD` or `$19.99 USD`).
* **Automated Smart Routing:** When an international customer accesses your web app from London, New York, or Berlin, SolydFlow serves the USD price and routes to Stripe automatically.
* **Unified Accounting:** SolydFlow records the transaction in your Immutable Ledger alongside local Naira and Shilling purchases, maintaining unified customer entitlement state.

---

## Developer Experience: Global Checkout

<Tabs>
<TabItem value="flutter" label="Flutter (Global Mobile Checkout)" default>

```dart title="lib/screens/checkout.dart"
// Automatically routes international users to Stripe Card / Apple Pay:
final CustomerInfo? info = await SolydFlow.purchasePackage(
  context,
  "pro_monthly_usd", // $4.99 USD base tier
);

if (info?.activeEntitlements["pro_access"] == true) {
  debugPrint("Global subscriber access active!");
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/checkout.ts"
import { SolydFlow } from "solydflow-js";

// Triggers Smart-Routed Stripe hosted checkout for international users:
await SolydFlow.purchasePackage("pro_monthly_usd");
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Global Commerce Overview →](./overview.md)**
* **[Local African Payment Methods →](./local-payments.md)**
* **[Connecting Stripe →](../payment-providers/stripe.md)**
* **[Multi-Currency Architecture →](./multi-currency.md)**
