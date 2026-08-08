# JavaScript

SolydFlow provides a lightweight, framework-agnostic JavaScript SDK for web applications, including React, Vue, Next.js, and Vanilla JavaScript applications.

The SDK provides the same core revenue capabilities used across SolydFlow, including:

* Dynamic pricing
* Purchasing Power Parity (PPP)
* Smart Upgrade Credits
* Entitlement management
* Subscription lifecycle tracking

Web applications use a separate hosted checkout flow while maintaining the same SolydFlow pricing, entitlement, and upgrade logic across platforms.

---

## Installation

Install `solydflow-js` using your preferred package manager.

### npm

```bash
npm install solydflow-js
```

### Yarn

```bash
yarn add solydflow-js
```

### pnpm

```bash
pnpm add solydflow-js
```

---

## Initialization

Import `SolydFlow` and initialize it with your project's public key and the current user's information.

```javascript
import { SolydFlow } from "solydflow-js";

await SolydFlow.configure(
  "sf_pk_live_YOUR_PUBLIC_KEY",
  "user_12345",
  "user@mail.com"
);
```

Initialize SolydFlow as early as possible in your web application's lifecycle.

The public key is obtained from your SolydFlow project dashboard.

---

## Integration Strategies

The JavaScript SDK supports two approaches:

| Approach        | Best for                                                |
| --------------- | ------------------------------------------------------- |
| Drop-In Paywall | Fast integration with dashboard-managed pricing         |
| Custom UI       | Complete control over pricing and checkout presentation |

Both approaches use the same SolydFlow pricing, entitlement, and checkout infrastructure.

---

## Drop-In Paywall

The Drop-In Paywall provides a responsive pricing experience that stays synchronized with the configuration in the SolydFlow Console.

It handles:

* Purchasing Power Parity pricing
* Smart Upgrade Credits
* Payment routing rules
* Checkout initiation
* Product rendering

### Create a Container

Add a container to the page:

```html
<div id="solydflow-paywall-container"></div>
```

### Render the Paywall

```javascript
import { SolydFlow } from "solydflow-js";

async function showPricing() {
  await SolydFlow.configure(
    "sf_pk_live_YOUR_PUBLIC_KEY",
    "user_12345",
    "user@mail.com"
  );

  await SolydFlow.renderPaywall(
    "solydflow-paywall-container"
  );
}
```

The SDK loads and renders the paywall configured in the SolydFlow Console.

### When to Use the Drop-In Paywall

Use it when:

* You want the fastest implementation.
* Product teams manage pricing and promotions.
* Paywall updates should not require a website deployment.
* You want built-in pricing optimization and localization.

---

## Custom UI

If you want complete control over your pricing experience, you can retrieve the packages from SolydFlow and render them using your own components.

```javascript
async function fetchRawPackages() {
  const offerings = await SolydFlow.getOfferings();

  offerings.forEach(pkg => {
    if (pkg.is_upgrade) {
      console.log(
        `Upgrade for ${pkg.currency} ${
          pkg.calculated_amount_kobo / 100
        }`
      );
    } else {
      console.log(
        `Standard Price: ${pkg.currency} ${
          pkg.amount_kobo / 100
        }`
      );
    }
  });
}
```

SolydFlow continues to calculate:

* Purchasing Power Parity pricing
* Smart Upgrade Credits
* Regional pricing adjustments

Your application is responsible for rendering the UI, while SolydFlow handles the pricing logic, checkout routing, and entitlement management.

---

## Checking Entitlements

Use `hasEntitlement()` to determine whether the current user has access to an entitlement.

```javascript
async function checkAccess() {
  const isGold =
    await SolydFlow.hasEntitlement("gold_access");

  if (isGold) {
    console.log(
      "Welcome to the premium dashboard!"
    );
  } else {
    // Redirect to pricing page
  }
}
```

This can be used to control access to premium features or redirect users to your pricing experience.

---

## Web Purchase Flow

The web purchase flow differs from the mobile SDK.

On mobile, the SDK waits for the purchase flow and returns updated customer information.

On the web:

```text
User
  ↓
Hosted Checkout
  ↓
Payment Completed
  ↓
Webhook
  ↓
Backend
  ↓
Entitlement Activated
```

The browser is redirected to a hosted checkout page, so the web application does not wait for the payment to complete.

Instead, SolydFlow notifies your backend after the transaction has been verified.

---

## Making a Purchase

When the customer selects a package, call `purchasePackage()`.

```javascript
async function handleCheckout(packageId) {
  try {
    await SolydFlow.purchasePackage(
      packageId,
      "2348012345678"
    );

    // Redirect occurs automatically.
  } catch (error) {
    console.error(
      "Checkout failed:",
      error.message
    );
  }
}
```

The customer is redirected to the secure hosted checkout page automatically. Your application does not wait for the payment to complete.

---

## Fulfilling Web Purchases

Because the web checkout is hosted, your backend must receive SolydFlow webhook events to unlock subscriptions and synchronize customer access.

Configure the webhook from:

```text
SolydFlow Console
→ Projects
→ Manage Connection
→ Your Backend Webhook
```

Enter your backend endpoint and save the configuration.

SolydFlow then sends signed webhook events when subscription activity occurs.

The webhook events are:

```text
subscription_started
subscription_renewed
subscription_revoked
test_event
```

See:

[Event Handling →](../webhooks/event-handling.md)

---

## Pricing and Upgrades

The JavaScript SDK exposes SolydFlow's pricing calculations when using a Custom UI.

Packages can contain upgrade-specific pricing:

```javascript
if (pkg.is_upgrade) {
  console.log(
    `Upgrade for ${pkg.currency} ${
      pkg.calculated_amount_kobo / 100
    }`
  );
}
```

This allows your application to present the price calculated by SolydFlow rather than implementing upgrade pricing logic independently.

---

## Framework Compatibility

Because `solydflow-js` is framework-agnostic, it can be used with:

* React
* Vue
* Next.js
* Vanilla JavaScript

The SDK provides the SolydFlow integration layer while your chosen framework remains responsible for the application's UI and application state.

---

## Related Documentation

[SDK Overview →](./overview.md)

[Flutter →](./flutter.md)

[React Native →](./react-native.md)

[Webhooks →](../webhooks/overview.md)

[Event Handling →](../webhooks/event-handling.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

[Paywalls →](../concepts/paywalls.md)

[Pricing →](../concepts/pricing.md)

[Regional Pricing →](../monetization/regional-pricing.md)

<!-- ---

## Next Steps

Continue with:

[Flutter →](./flutter.md)
 -->