---
id: saas
title: SaaS & Subscription Apps Guide
sidebar_label: SaaS Platforms
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SaaS & Subscription Apps Guide

This guide walks you through building an end-to-end recurring subscription architecture for web and mobile SaaS platforms using SolydFlow.

```text
[1. Configure Tiers in Console] ➔ [2. Render Pricing in App] ➔ [3. Smart-Routed Checkout] ➔ [4. Sync Database via Webhook]
```

---

## 1. The SaaS Tier Architecture

In SolydFlow, SaaS plans decouple **commercial packaging** from **feature permissions (entitlements)**:

| Tier | Plan Name | Tier Level | Local Pricing (NGN / KES / USD) | Entitlement Granted | Features Unlocked |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Starter** | `1` | `₦5,000` / `KSh 500` / `$4.99` mo | `starter_access` | 1 Workspace, 5 Projects, Basic Export |
| **Tier 2** | **Pro** | `2` | `₦15,000` / `KSh 1,500` / `$14.99` mo | `pro_access` | Unlimited Projects, Team Invites, HD Export |
| **Tier 3** | **Business**| `3` | `₦45,000` / `KSh 4,500` / `$44.99` mo | `business_access` | SSO, Audit Logs, Priority SLA |

:::tip Automatic Mid-Cycle Upgrades
Because each tier has an assigned **Tier Level**, when a subscriber on Starter (Tier 1) upgrades to Pro (Tier 2) mid-month, SolydFlow's **Smart Credits** automatically deduct their unused days from the checkout price.
:::

---

## 2. Frontend: Displaying SaaS Plans (React / Next.js)

Fetch localized offerings and let customers select a plan:

```tsx title="components/SaaSPricingTable.tsx"
import React, { useEffect, useState } from "react";
import { SolydFlow, SolydPackage } from "solydflow-js";

export function SaaSPricingTable({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [packages, setPackages] = useState<SolydPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // 1. Initialize client
      await SolydFlow.configure(
        process.env.NEXT_PUBLIC_SOLYDFLOW_KEY!,
        userId,
        userEmail
      );

      // 2. Fetch packages (automatically localized for user's country)
      const offerings = await SolydFlow.getOfferings();
      setPackages(offerings);
      setLoading(false);
    }
    init();
  }, [userId, userEmail]);

  const handleCheckout = async (packageId: string) => {
    // 3. Launches Smart-Routed checkout (Paystack in NG, M-Pesa in KE, Stripe in US)
    await SolydFlow.purchasePackage(packageId);
  };

  if (loading) return <div>Loading SaaS subscriptions...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {packages.map((pkg) => {
        const displayPrice = (pkg.is_upgrade ? pkg.calculated_amount_minor : pkg.amount_minor);

        return (
          <div key={pkg.identifier} className="border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold">{pkg.name}</h3>
              {pkg.is_upgrade && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                  PRO-RATED UPGRADE
                </span>
              )}
              <div className="text-3xl font-extrabold my-4">
                {pkg.currency} {displayPrice.toFixed(2)}
                <span className="text-sm font-normal text-gray-500"> / {pkg.duration}</span>
              </div>
            </div>

            <button
              onClick={() => handleCheckout(pkg.identifier)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition"
            >
              {pkg.is_upgrade ? "Upgrade Now" : "Get Started"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 3. Backend: Fulfilling SaaS Subscriptions

When a payment clears, SolydFlow sends a signed webhook to your server. Update your database to grant the organization or user access:

```javascript title="src/webhooks.js (Node.js Express)"
const express = require('express');
const app = express();

app.post('/webhook/solydflow', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Verify HMAC Signature (see Webhooks > Signature Verification)
  // ...

  const payload = JSON.parse(req.body.toString());
  const { event, user_id, entitlement, expires_at, reason } = payload;

  try {
    switch (event) {
      case "subscription_started":
      case "subscription_renewed":
        // 2. Grant or extend workspace access
        await db.workspaces.update({
          where: { ownerId: user_id },
          data: {
            plan_tier: entitlement, // e.g. "pro_access"
            is_active: true,
            expires_at: new Date(expires_at),
          },
        });
        console.log(`✅ Workspace updated to ${entitlement} for user ${user_id}`);
        break;

      case "subscription_revoked":
        // 3. Immediately downgrade workspace on chargeback / refund
        await db.workspaces.update({
          where: { ownerId: user_id },
          data: {
            plan_tier: "free",
            is_active: false,
            revocation_reason: reason,
          },
        });
        console.log(`🔒 Workspace access revoked for user ${user_id}`);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).send("Database error");
  }
});
```

---

## 4. Gating Features in Application Code

In your frontend or API endpoints, gate features based on the verified entitlement:

<Tabs>
<TabItem value="frontend" label="Frontend (React / Next.js)" default>

```tsx title="pages/workspace.tsx"
import { SolydFlow } from "solydflow-js";

export async function checkFeatureAccess() {
  const isPro = await SolydFlow.hasEntitlement("pro_access");
  const isBusiness = await SolydFlow.hasEntitlement("business_access");

  if (!isPro && !isBusiness) {
    // Show upgrade modal or redirect to /pricing
    return false;
  }
  return true;
}
```

</TabItem>
<TabItem value="backend" label="Backend Middleware (Express)">

```javascript title="middleware/requirePro.js"
async function requirePro(req, res, next) {
  const workspace = await db.workspaces.findUnique({ where: { ownerId: req.user.id } });

  if (workspace.is_active && new Date(workspace.expires_at) > new Date()) {
    return next();
  }

  return res.status(403).json({ error: "Pro subscription required" });
}
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Web Applications Guide →](./web-apps.md)**
* **[Smart Upgrade Credits & Discounts →](../monetization/discounts.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Multi-Currency Architecture →](../global-commerce/multi-currency.md)**
