### Review of `guides/marketplaces.md`

#### Analysis
* **What works well:** Identifying marketplace revenue drivers—such as seller subscriptions, listing promotions, and feature upgrades—lays the groundwork for multi-sided platforms.
* **Areas to optimize & embellish (Applying the "Simplicity Wins" Standard):**
  1. **Frontmatter:** Add proper Docusaurus frontmatter (`id`, `title`, `sidebar_label`).
  2. **Glanceable Linear Flow:** Replace fragmented lists with a clean 4-step linear flow.
  3. **The 3 Core Marketplace Monetization Models Table:** Detail how marketplace operators monetize their platforms:
     * **Seller Subscriptions** (e.g. *Verified Merchant Pro* with unlimited product uploads).
     * **Featured Listing Boosts** (e.g. 7-day front-page search highlight).
     * **Contact / Lead Unlocking** (e.g. service marketplaces where artisans or contractors pay to view customer leads).
  4. **The Split-Payment & Escrow Boundary:** Clarify that SolydFlow manages **platform revenue** (monetizing sellers, listing fees, subscriptions), while multi-party buyer-seller payouts flow through underlying gateway split features (Paystack Subaccounts / Stripe Connect).
  5. **Concrete Code Snippet:** Provide a practical example of a vendor purchasing a 7-day listing bump.

---

### Optimized & Embellished `guides/marketplaces.md`

```markdown
---
id: marketplaces
title: Marketplaces & Classifieds Guide
sidebar_label: Marketplaces
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Marketplaces & Classifieds Guide

This guide walks you through monetizing multi-sided platforms, classified portals, and service marketplaces using SolydFlow.

```text
[1. Configure Seller / Listing Packages] ➔ [2. Vendor Selects Tier or Boost] ➔ [3. Smart-Routed Checkout] ➔ [4. Enforce Entitlement (Badge / Promotion)]
```

---

## The 3 Marketplace Monetization Models

Marketplace businesses typically monetize the **supply side** (merchants, sellers, and service providers) using three primary models:

| Monetization Model | Product Type in SolydFlow | Entitlement Target | Business Use Case |
| :--- | :--- | :--- | :--- |
| **1. Pro Seller Subscriptions** | Recurring Subscription | `verified_merchant` | Verified badge, unlimited inventory listings, lower commission rates. |
| **2. Featured Listing Boosts** | Non-Renewing Pass (e.g. 7 Days) | `featured_listing_7d` | Pushes a seller's item to the top of category search results for 7 days. |
| **3. Lead Unlocking Credits** | Consumable Pack (e.g. 20 Leads) | `lead_credits_20` | Allows contractors or service providers to reveal customer contact info. |

---

## Catalog Structure for Marketplaces

```text
📦 Product: "Verified Merchant Badge" ➔ Entitlement: "verified_merchant"
│
├── 🇳🇬 Package: merchant_pro_ngn ➔ ₦15,000 / month (Paystack / Monnify)
├── 🇰🇪 Package: merchant_pro_kes ➔ KSh 1,500 / month (M-Pesa STK Push)
└── 🌍 Package: merchant_pro_usd ➔ $14.99 / month (Stripe)

📦 Product: "7-Day Top Search Boost" ➔ Entitlement: "featured_boost"
│
├── 🇳🇬 Package: boost_7d_ngn ➔ ₦3,500 (One-time, 7-day duration)
└── 🇰🇪 Package: boost_7d_kes ➔ KSh 400 (One-time, 7-day duration)
```

---

## Code Example: Seller Purchasing a Listing Boost

When a merchant taps **"Promote Listing"** on their dashboard:

<Tabs>
<TabItem value="flutter" label="Flutter (Mobile Seller Dashboard)" default>

```dart title="lib/screens/seller_listing_screen.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

Future<void> promoteListing(BuildContext context, String listingId) async {
  try {
    // 1. Launch purchase for a 7-day search boost package
    final CustomerInfo? info = await SolydFlow.purchasePackage(
      context,
      "boost_7d_ngn", // SolydFlow routes to local payment rail
    );

    if (info == null) return; // Dismissed

    // 2. Confirm entitlement activated
    if (info.activeEntitlements["featured_boost"] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("🚀 Listing boosted to top of search for 7 days!")),
      );
      // Refresh listing UI
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Promotion failed: $e")),
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / Web Portal">

```typescript title="src/components/PromoteListing.ts"
import { SolydFlow } from "solydflow-js";

export async function handleListingBoost(listingId: string) {
  // Triggers hosted checkout for one-time listing promotion
  await SolydFlow.purchasePackage("boost_7d_ngn");
}
```

</TabItem>
</Tabs>

---

## Backend Fulfillment for Verified Badges

When a merchant's monthly verification subscription renews or gets revoked:

```javascript title="src/webhookHandler.js (Node.js Express)"
app.post('/webhook/solydflow', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Verify signature ...
  const payload = JSON.parse(req.body.toString());

  if (payload.event === "subscription_started" && payload.entitlement === "verified_merchant") {
    // Activate verified badge on public seller profile
    await db.merchants.update({
      where: { userId: payload.user_id },
      data: { isVerified: true, badgeExpiresAt: new Date(payload.expires_at) },
    });
  }

  if (payload.event === "subscription_revoked" && payload.entitlement === "verified_merchant") {
    // Strip verified badge on cancellation or chargeback
    await db.merchants.update({
      where: { userId: payload.user_id },
      data: { isVerified: false },
    });
  }

  return res.status(200).json({ received: true });
});
```

---

## Platform Revenue vs. Peer-to-Peer Payouts

:::info{title="Scope of SolydFlow"}
* **SolydFlow Manages:** Platform fees, merchant subscriptions, listing upgrade fees, and seller verification tiers.
* **Underlying Gateways Manage:** Automated split payments and escrow transfers between buyers and sellers via your gateway's native subaccount tools (e.g. Paystack Subaccounts or Stripe Connect).
:::

---

## Related Documentation

* **[SaaS Platforms Guide →](./saas.md)**
* **[Mobile Apps Integration Guide →](./mobile-apps.md)**
* **[Products & Packages Architecture →](../concepts/products-and-packages.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
