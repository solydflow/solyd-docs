---
id: javascript
title: JavaScript / TypeScript SDK
sidebar_label: JavaScript / Web
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JavaScript / TypeScript SDK

The **`solydflow-js`** SDK connects modern web applications (Next.js, React, Vue, Nuxt, Svelte, or Vanilla JS) to SolydFlow's unified revenue infrastructure.

```text
[1. Install Package] ➔ [2. Initialize Client] ➔ [3. Render Paywall or Fetch Offerings] ➔ [4. Hosted Checkout Redirect]
```

It delivers the same multi-currency pricing, Purchasing Power Parity (PPP), and upgrade calculations as mobile apps, while handling web checkouts through secure, Smart-Routed payment pages.

---

## 1. Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install solydflow-js
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```bash
yarn add solydflow-js
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add solydflow-js
```

</TabItem>
</Tabs>

:::info{title="TypeScript Support Included"}
`solydflow-js` ships with native TypeScript definitions. No separate `@types/solydflow-js` package is required.
:::

---

## 2. Initialization

Initialize SolydFlow as early as possible in your web app (e.g. inside `_app.tsx`, a root layout, or an auth context):

```typescript title="src/index.ts"
import { SolydFlow } from "solydflow-js";

await SolydFlow.configure(
  process.env.NEXT_PUBLIC_SOLYDFLOW_KEY!, // sf_pk_live_... or sf_pk_test_...
  "usr_supabase_991823",                 // User ID from your database / auth
  "customer@example.com",                // Customer email (for receipts & recovery)
  "+2348012345678"                       // E.164 phone (Required for M-Pesa STK push)
);
```

---

## 3. Choose Your Paywall Strategy

| Strategy | When to Use | Setup Effort |
| :--- | :--- | :--- |
| **Option A: Drop-In Paywall** | You want a high-converting, console-managed paywall rendered into a `<div>`. | **2 lines of code** |
| **Option B: Custom UI (React / Next.js)** | You want full CSS control to match your existing design system. | Full component |

---

### Option A: Drop-In Paywall

Renders the paywall designed and published in your SolydFlow Console directly into your webpage:

```html title="index.html"
<!-- 1. Add container -->
<div id="solydflow-paywall-container"></div>

<!-- 2. Render paywall -->
<script type="module">
  import { SolydFlow } from "solydflow-js";

  await SolydFlow.configure(
    "sf_pk_test_a8f93b1c8e924a1b82",
    "usr_12345",
    "customer@example.com"
  );

  await SolydFlow.renderPaywall("solydflow-paywall-container");
</script>
```

---

### Option B: Custom UI (React / Next.js Example)

Fetch offerings dynamically and bind them to your own components. SolydFlow automatically localizes currency and computes pro-rated upgrade credits:

```tsx title="components/PricingSection.tsx"
import React, { useEffect, useState } from "react";
import { SolydFlow, SolydPackage } from "solydflow-js";

export function PricingSection() {
  const [packages, setPackages] = useState<SolydPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOfferings() {
      try {
        const offerings = await SolydFlow.getOfferings();
        setPackages(offerings);
      } finally {
        setLoading(false);
      }
    }
    loadOfferings();
  }, []);

  const handleSubscribe = async (packageId: string) => {
    try {
      // Automatically redirects browser to the Smart-Routed payment rail
      await SolydFlow.purchasePackage(packageId, "+2348012345678");
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
    }
  };

  if (loading) return <div>Loading localized pricing...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto p-4">
      {packages.map((pkg) => {
        const price = (pkg.is_upgrade ? pkg.calculated_amount_minor : pkg.amount_minor);
        
        return (
          <div key={pkg.identifier} className="border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                {pkg.is_upgrade && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                    UPGRADE CREDIT APPLIED
                  </span>
                )}
              </div>
              <p className="text-3xl font-extrabold my-4">
                {pkg.currency} {price.toFixed(2)}
                <span className="text-sm font-normal text-gray-500"> / {pkg.duration}</span>
              </p>
            </div>

            <button
              onClick={() => handleSubscribe(pkg.identifier)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {pkg.is_upgrade ? "Upgrade Plan" : "Subscribe Now"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 4. Checking Access

Use `hasEntitlement()` to verify whether the logged-in user has access:

```typescript title="src/guards/auth.ts"
import { SolydFlow } from "solydflow-js";

export async function checkProAccess(): Promise<boolean> {
  const isPro = await SolydFlow.hasEntitlement("pro_access");
  
  if (!isPro) {
    window.location.href = "/pricing";
    return false;
  }
  return true;
}
```

---

## 5. Web Purchase Flow & Fulfillment

Unlike mobile apps (which can wait for in-app store completion), web checkouts redirect the browser to secure payment rails (Paystack, Stripe, Flutterwave):

```text
[User Clicks Subscribe] ➔ [Browser Redirects to Gateway] ➔ [Payment Succeeded] ➔ [Webhook Fulfills in Database]
```

1. `SolydFlow.purchasePackage(packageId)` initiates checkout and redirects the browser.
2. The customer authorizes payment.
3. The gateway notifies SolydFlow, and SolydFlow verifies consensus.
4. SolydFlow delivers a signed `subscription_started` webhook to your backend server.
5. Your backend extends the user's access date in your database.

---

## Related Documentation

* **[Flutter Mobile SDK →](./flutter.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Webhook Event Handling →](../webhooks/event-handling.md)**
* **[Regional Pricing & PPP →](../monetization/regional-pricing.md)**

