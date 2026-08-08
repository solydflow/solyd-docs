# Quickstart

Get your first SolydFlow integration running in a few steps.

By the end of this guide, you'll have:

- A SolydFlow project
- A connected payment provider
- A Product and Package
- An Entitlement
- A configured SDK
- A working purchase flow

---

## Before You Begin

You'll need:

- A SolydFlow account
- A SolydFlow project
- An application to integrate, or a payment link to share with customers
- A supported payment provider account

---

## Integration Flow

```text
Create Project
      ↓
Connect Payment Provider
      ↓
Create Product
      ↓
Add Package
      ↓
Create Entitlement
      ↓
Install SDK
      ↓
Configure SolydFlow
      ↓
Test Purchase
      ↓
Go Live
```

---

## 1. Create a Project

Create a project for your application.

Each project has its own:

- Products
- Packages
- Payment providers
- API keys
- Revenue configuration

**[Create a Project →](./create-project.md)**

---

## 2. Connect a Payment Provider

Connect the payment provider you want to use with your project.

SolydFlow works with your existing provider accounts—you continue to own and manage them.

**[Payment Providers →](../payment-providers/overview.md)**

---

## 3. Configure Your Revenue

Create:

- A Product
- One or more Packages
- An Entitlement

Example:

```text
Premium Monthly
        │
        └── ₦5,000
                │
                ▼
        premium_access
```

Learn more:

- **[Products →](../concepts/products.md)**
- **[Packages →](../concepts/packages.md)**
- **[Entitlements →](../concepts/entitlements.md)**

---

## 4. Install the SDK

Install the SDK for your platform.

```bash
npm install solydflow-js
```

See the **[SDK Documentation →](../sdk/overview.md)** for other supported platforms.

---

## 5. Configure SolydFlow

Initialize the SDK using your project API key.

```javascript
import { SolydFlow } from "solydflow-js";

await SolydFlow.configure({
  apiKey: "sf_pk_test_...",
  userId: "usr_123"
});
```

Use Sandbox credentials while developing.

**[Configure SolydFlow →](./configure-solydflow.md)**

---

## 6. Make Your First Purchase

Start a purchase using either:

- SolydFlow Paywalls
- The SDK/API

```javascript
await SolydFlow.purchase({
    packageId: "premium_monthly"
});
```

**[First Purchase →](./first-purchase.md)**

---

## 7. Test Your Integration

Before going live, test your purchase flow using the Sandbox.

Verify:

- Successful payments
- Failed payments
- Recovery
- Entitlement activation

**[Sandbox →](../sandbox/overview.md)**

---

## That's It

Your integration is now ready for production.

```text
Customer
      │
      ▼
Your Application
      │
      ▼
SolydFlow
      │
      ▼
Payment Provider
      │
      ▼
Recover → Truth → Enforce
      │
      ▼
Entitlement Granted
```

## Related Documentation

- **[Projects →](../concepts/projects.md)**
- **[Sandbox →](../sandbox/overview.md)**
- **[SDK →](../sdk/overview.md)**

<!-- ## Related Content

**[Create a Project →](./create-project.md)** -->