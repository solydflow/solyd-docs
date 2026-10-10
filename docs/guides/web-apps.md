---
id: web-apps
title: Web Apps Integration Guide
sidebar_label: Web Applications
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Web Apps Integration Guide

This guide walks you through integrating SolydFlow into modern web applications (Next.js, React, Vue, or Vanilla JavaScript) to monetize customer portals and subscription platforms.

```text
[1. Initialize solydflow-js] ➔ [2. Render Paywall or Custom UI] ➔ [3. Hosted Checkout Redirect] ➔ [4. Fulfill via Webhook]
```

---

## The Web Purchase Architecture

Unlike mobile applications that complete purchases within an in-app sheet, web applications redirect the browser to a secure, Smart-Routed hosted payment page:

```text
[User Clicks Subscribe] ➔ [Redirect to Gateway Rail (Paystack/Stripe/M-Pesa)] ➔ [Payment Succeeded] ➔ [Signed Webhook to Backend] ➔ [Database Unlocked]
```

1. **Client Redirect:** `SolydFlow.purchasePackage()` redirects the customer to the optimal checkout rail based on their location.
2. **Asynchronous Fulfillment:** Because the user leaves your website to pay, your backend receives a cryptographically signed webhook (`subscription_started`) to unlock access.
3. **Return Redirect:** After payment, the customer is redirected back to your configured `success_url` (e.g. `/dashboard?success=true`).

---

## 1. Frontend Integration

Install the lightweight web client:

```bash
npm install solydflow-js
```

### Option A: The Drop-In Paywall (Fastest)

Add a container to your HTML or React page and render the console-configured paywall:

<Tabs>
<TabItem value="html" label="HTML / Vanilla JS" default>

```html title="pricing.html"
<div id="solydflow-paywall-container"></div>

<script type="module">
  import { SolydFlow } from "solydflow-js";

  // 1. Initialize client
  await SolydFlow.configure(
    "sf_pk_live_44019283bc918237fa",
    "usr_supabase_991823",
    "customer@example.com"
  );

  // 2. Render paywall into container
  await SolydFlow.renderPaywall("solydflow-paywall-container");
</script>
```

</TabItem>
<TabItem value="react" label="React / Next.js">

```tsx title="pages/pricing.tsx"
import React, { useEffect } from "react";
import { SolydFlow } from "solydflow-js";

export default function PricingPage({ userId, userEmail }: { userId: string; userEmail: string }) {
  useEffect(() => {
    async function loadPaywall() {
      await SolydFlow.configure(
        process.env.NEXT_PUBLIC_SOLYDFLOW_KEY!,
        userId,
        userEmail
      );
      await SolydFlow.renderPaywall("solydflow-paywall-container");
    }
    loadPaywall();
  }, [userId, userEmail]);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div id="solydflow-paywall-container" />
    </div>
  );
}
```

</TabItem>
</Tabs>

---

### Option B: Custom UI (React / Tailwind Example)

If your website uses a custom design system, fetch the raw offerings and trigger the redirect manually:

```tsx title="components/CustomPricingCard.tsx"
import React, { useEffect, useState } from "react";
import { SolydFlow, SolydPackage } from "solydflow-js";

export function CustomPricingCard() {
  const [packages, setPackages] = useState<SolydPackage[]>([]);

  useEffect(() => {
    async function init() {
      await SolydFlow.configure(process.env.NEXT_PUBLIC_SOLYDFLOW_KEY!, "usr_991823", "customer@example.com");
      const offerings = await SolydFlow.getOfferings();
      setPackages(offerings);
    }
    init();
  }, []);

  const handleCheckout = async (packageId: string) => {
    // Redirects browser to Smart-Routed payment page
    await SolydFlow.purchasePackage(packageId, "+2348012345678");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-4">
      {packages.map((pkg) => (
        <div key={pkg.identifier} className="border p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold">{pkg.name}</h3>
          <p className="text-3xl font-extrabold my-3">
            {pkg.currency} {(pkg.is_upgrade ? pkg.calculated_amount_minor : pkg.amount_minor)}
            <span className="text-sm font-normal text-gray-500"> / {pkg.duration}</span>
          </p>
          <button
            onClick={() => handleCheckout(pkg.identifier)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition"
          >
            {pkg.is_upgrade ? "Upgrade Plan" : "Subscribe"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 2. Backend: Fulfilling Purchases via Webhooks

Because web checkouts are asynchronous, your backend must verify SolydFlow's signed webhooks before updating user permissions:

```javascript title="src/server.js (Node.js Express)"
const express = require('express');
const app = express();

app.post('/webhook/solydflow', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Verify HMAC-SHA256 signature (see Webhooks > Signature Verification)
  // ...

  const payload = JSON.parse(req.body.toString());

  // 2. Fulfill active subscriptions
  if (payload.event === "subscription_started" || payload.event === "subscription_renewed") {
    await db.users.update({
      where: { id: payload.user_id },
      data: {
        has_pro: true,
        pro_expires_at: new Date(payload.expires_at),
        tier: payload.entitlement,
      },
    });
    console.log(`✅ Granted ${payload.entitlement} to user ${payload.user_id}`);
  }

  // 3. Revoke access on chargebacks or refunds
  if (payload.event === "subscription_revoked") {
    await db.users.update({
      where: { id: payload.user_id },
      data: { has_pro: false, tier: null },
    });
    console.log(`🔒 Revoked access for user ${payload.user_id}`);
  }

  return res.status(200).json({ received: true });
});
```

---

## 3. Checking Access in Web Guards

Protect dashboard routes and premium pages using `hasEntitlement()`:

```typescript title="src/guards/authGuard.ts"
import { SolydFlow } from "solydflow-js";

export async function protectProDashboard() {
  const hasAccess = await SolydFlow.hasEntitlement("pro_access");

  if (!hasAccess) {
    // Redirect unauthenticated / non-paying user to pricing page
    window.location.href = "/pricing";
    return false;
  }
  return true;
}
```

---

## Cross-Platform Access: Web to Mobile

Because SolydFlow maintains a centralized **Immutable Ledger**:

```text
User subscribes on your website via Paystack / Card (₦5,000)
    ↓
SolydFlow commits SETTLED_CONSENSUS to the cloud ledger
    ↓
User opens your Flutter Mobile App on their iPhone or Android
    ↓
SolydFlow.hasEntitlement("pro_access") returns true immediately ✅
```

Your customers never have to pay twice across web and mobile platforms.

---

## Related Documentation

* **[JavaScript SDK Reference →](../sdk/javascript.md)**
* **[SaaS Integration Guide →](./saas.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Webhook Event Handling →](../webhooks/event-handling.md)**
