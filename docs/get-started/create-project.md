# Create a Project

A SolydFlow project represents a single application or revenue environment.

Each project has its own:

- Payment providers
- Products and Packages
- API keys
- Webhooks
- Transactions
- Revenue configuration

For example:

```text
SolydFlow
│
├── School App
├── SaaS Platform
└── Mobile App
```

Each project is managed independently while remaining under the same SolydFlow account.

---

## Before You Begin

You'll need a SolydFlow account.

If you don't have one yet, create one from the SolydFlow Console.

---

## Create Your Project

1. Sign in to the SolydFlow Console.
2. Open **Projects**.
3. Click **Create Project**.
4. Enter your project name.
5. Choose the environment.
6. Create the project.

Once created, you can begin configuring your revenue infrastructure.

---

## Choose an Environment

Every project includes two environments:

```text
Sandbox
    ↓
Build & Test
    ↓
Live
```

Use **Sandbox** while developing and **Live** when you're ready to process real transactions.

> **Important:** Never use Live credentials during development.

---

## Project Credentials

Each project includes its own API credentials.

Use:

- Sandbox credentials for testing
- Live credentials for production

Keep secret credentials on your backend and never expose them in client-side applications.

**[Configure SolydFlow →](./configure-solydflow.md)**

---

## What's Next?

After creating your project, the typical setup is:

```text
Create Project
      ↓
Connect Payment Provider
      ↓
Create Product
      ↓
Create Package
      ↓
Create Entitlement
      ↓
Install SDK
      ↓
Test in Sandbox
```

Each step has its own guide:

- **[Payment Providers →](../payment-providers/overview.md)**
- **[Products →](../concepts/products.md)**
- **[Packages →](../concepts/packages.md)**
- **[Entitlements →](../concepts/entitlements.md)**
- **[Install SDK →](./install-sdk.md)**

---

## Multiple Projects

Create separate projects for different applications.

For example:

```text
Your Account
│
├── SolydHome
├── SolydGuide
├── Client Portal
└── Mobile App
```

Each project has its own transactions, providers, credentials, and revenue configuration.

---

## Related Documentation

- **[Projects →](../concepts/projects.md)**
- **[Payment Providers →](../payment-providers/overview.md)**

<!-- ## Related Content

**[Install the SDK →](./install-sdk.md)** -->