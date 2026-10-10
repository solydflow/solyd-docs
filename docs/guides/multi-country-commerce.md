---
id: multi-country-commerce
title: Multi-Country Commerce Guide
sidebar_label: Multi-Country Commerce
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multi-Country Commerce Guide

Expanding software sales across Africa and international borders requires balancing **Purchasing Power Parity (PPP)**, **domestic payment rails**, and **currency stability**.

```text
[1. Create Base Product] ➔ [2. Attach Localized Packages (PPP)] ➔ [3. Pair Regional Gateways] ➔ [4. Auto Geo-IP Routing]
```

SolydFlow allows you to launch in multiple countries simultaneously from a single dashboard—serving localized prices in local currencies while routing each transaction to the domestic payment rail with the highest conversion rate.

---

## The 5-Country Pan-African & Global Playbook

Below is the standard blueprint for scaling a digital subscription product across emerging and international markets:

| Market | Currency | Local PPP Price | Primary Payment Rail | Preferred Domestic Method | Conversion Benefit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🇳🇬 Nigeria** | `NGN` | `₦5,000` / mo | **Paystack / Monnify** | Direct Bank Transfer / USSD | Eliminates card 3DS timeouts (>96% transfer success). |
| **🇰🇪 Kenya** | `KES` | `KSh 500` / mo | **M-Pesa (Daraja)** | Native STK Push Prompt | Unlocks 85%+ of adult population using mobile money. |
| **🇬🇭 Ghana** | `GHS` | `GH₵ 65` / mo | **Flutterwave** | MTN MoMo / Telecel Cash | Unlocks mobile money wallets without foreign card fees. |
| **🇿🇦 South Africa** | `ZAR` | `R 99` / mo | **Paystack** | Capitec Pay & Instant EFT | Connects to domestic banking rails with zero FX drag. |
| **🌍 Global / US** | `USD` | `$4.99` / mo | **Stripe** | 3D-Secure Cards & Apple Pay | Global hard-currency baseline with automated fallbacks. |

:::tip{title="Single Codebase, Zero `if/else` Ladders"}
All five regional packages above map to the exact same entitlement: **`pro_access`**. You never have to write country-specific conditionals in your app.
:::

---

## Testing 5 Countries in 2 Minutes (No VPN Required)

Instead of using proxies or foreign SIM cards to verify your checkout flows, use the **Solyd Simulator**:

```text
[Open Solyd Simulator] ➔ [Toggle Simulated Region: Nigeria] ➔ [Inspect Paystack Route] ➔ [Toggle: Kenya] ➔ [Inspect M-Pesa Route]
```

1. Open **SolydFlow Console → Solyd Simulator**.
2. Select **Execution Mode: `Test (Sandbox)`**.
3. Select **Nigeria (`NGN`)** ➔ Click **Simulate Checkout** to verify that Paystack card and bank transfer routes appear.
4. Switch dropdown to **Kenya (`KES`)** ➔ Click **Simulate Checkout** to verify that the M-Pesa STK push prompt initializes.
5. Switch dropdown to **Global (`USD`)** ➔ Confirm Stripe card fields render.

---

## Client Implementation: Dynamic Localization

Your mobile or web application needs only a single function call. SolydFlow detects the visitor's location and serves the correct regional package automatically:

<Tabs>
<TabItem value="flutter" label="Flutter (Cross-Platform Mobile)" default>

```dart title="lib/screens/pricing_screen.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

Future<void> openLocalizedPaywall(BuildContext context) async {
  // Automatically resolves user's country via Geo-IP and renders
  // localized prices with native domestic checkout rails:
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (ctx) => SolydPaywall(
      onPurchaseSuccess: (CustomerInfo info) {
        Navigator.pop(ctx);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("🎉 Pro access active globally!")),
        );
      },
      onClose: () => Navigator.pop(ctx),
    ),
  );
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / Web Portal">

```typescript title="src/checkout.ts"
import { SolydFlow } from "solydflow-js";

export async function launchGlobalCheckout(packageId: string) {
  // Redirects to Paystack in NG, M-Pesa in KE, or Stripe in US/EU:
  await SolydFlow.purchasePackage(packageId);
}
```

</TabItem>
</Tabs>

---

## Currency Volatility & Margin Protection

When selling across volatile currency markets, manage price stability from **Console → Pricing & Products**:

* **Independent Updates:** If the Nigerian Naira experiences inflation, you can adjust `pro_monthly_ngn` from `₦5,000` to `₦6,500` in the console.
* **Zero Disruption to Other Markets:** Your Kenyan (`KSh 500`) and US (`$4.99`) packages remain completely untouched.
* **Instant Over-the-Air Sync:** The updated price reflects across all live mobile apps immediately without submitting an app update to Apple or Google.

---

## Related Documentation

* **[Global Commerce Overview →](../global-commerce/overview.md)**
* **[Local African Payment Methods →](../global-commerce/local-payments.md)**
* **[Multi-Currency Architecture →](../global-commerce/multi-currency.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
* **[Changing Pricing Safely →](../monetization/changing-pricing.md)**
