# Projects

A Project is the top-level revenue environment in SolydFlow.

```text
                   PROJECT
                      │
        ┌─────────────┴─────────────┐
        │                           │
   PAYMENT PROVIDERS           PRODUCTS
                                      │
                                  PACKAGES
                                      │
                                   PRICING
                                      │
                                   PAYWALLS
                                      │
                                      ▼
                                   PURCHASE
                                      │
                                 TRANSACTION
                                      │
                             TRANSACTION STATE
                                      │
                      Recover → Truth → Enforce
                                      │
                                 ENTITLEMENT
                                      │
                                     USER
                                      │
                             APPLICATION ACCESS
```

It groups everything needed to manage the revenue infrastructure for an application or business.

```text
Project
│
├── Payment Providers
├── Products
├── Packages
├── Paywalls
├── Entitlements
├── Sandbox
├── Transactions
└── API Keys
```

---

## Why Projects?

Projects keep the revenue configuration for different applications separate.

For example:

```text
Your Account
│
├── School App
├── SaaS Platform
└── Mobile App
```

Each project has its own:

- Payment providers
- Products and Packages
- API keys
- Transactions
- Revenue configuration

---

## One Project or Multiple?

A common approach is one project per application.

```text
SolydFlow
│
├── Mobile App
├── Web App
└── Admin Portal
```

However, multiple applications can share the same project if they belong to the same revenue environment.

Example:

```text
            One Project
                 │
        ┌────────┴────────┐
        ▼                 ▼
    Web App          Mobile App
```

Choose a single project when applications share:

- Customers
- Products
- Pricing
- Entitlements

Create separate projects when they have independent revenue operations.

---

## Sandbox and Live

Every project includes two environments.

```text
Sandbox
      │
Build & Test
      │
      ▼
Live
```

The Sandbox lets you test purchases, recovery workflows, and entitlement behavior without processing real payments.

---

## Project API Keys

Each project includes separate API keys for Sandbox and Live.

```text
Sandbox
sf_pk_test_...

Live
sf_pk_live_...
```

Use the correct key for the environment you're working in.

Never expose secret credentials in client-side applications.

---

## Typical Project Setup

```text
Create Project
      ↓
Connect Payment Provider
      ↓
Create Product
      ↓
Add Packages
      ↓
Create Entitlements
      ↓
Configure Paywalls
      ↓
Test in Sandbox
      ↓
Go Live
```

---

## Related Documentation

- **[Products →](./products.md)**
- **[Payment Providers →](../payment-providers/overview.md)**
- **[Sandbox →](../sandbox/overview.md)**

<!-- ## Related Content

**[Users →](./users.md)** -->