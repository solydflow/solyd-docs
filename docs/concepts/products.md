# Products

A **Product** represents the business offering that customers purchase.

Products group together all purchase options for the same business offering.

A project can contain multiple products, allowing you to offer different tiers or plans.

For example:

```text
Fitness App
├── Basic Plan
├── Pro Plan
└── Elite/Premium Plan
```

Each Product defines the shared business configuration for every Package beneath it, including:

* Subscription Type
* Display Name
* Entitlement ID
* Tier Level
* Duration
* Product Type

The actual purchasable units are **Packages**, which belong to a Product.

## Product Structure

```text
Project
    │
    ├── Product
    │     ├── Package (NGN)
    │     ├── Package (KES)
    │     ├── Package (USD)
    │     └── Package (...)
    │
    └── Product
```

Every package under the same product represents the same business offering, but may differ by currency, platform integration, or localized pricing.

## Product vs Package

Products and Packages serve different purposes.

A Product answers:

> *What is the business selling?*

A Package answers:

> *How is this offering purchased in a specific currency or platform?*

| Product             | Package                   |
| ------------------- | ------------------------- |
| What is being sold? | How is it purchased?      |
| Business concept    | Technical purchase unit   |
| One per offering    | One per currency/platform |

For example:

```text
Product
Premium Monthly

Packages
├── premium_monthly_ngn
├── premium_monthly_kes
├── premium_monthly_usd
└── premium_monthly_ios
```

> Because Packages are independent, you can localize pricing for each market without creating separate Products. For example, the same Product can cost ₦5,000 in Nigeria and $9.99 in the US.

## Products in the Dashboard

Products are managed from **Pricing & Products**.

Creating a Product establishes the shared configuration for that offering.

Additional localized purchase options are added later as Currency Packages.


## Related Documentation

- **[Pricing →](./pricing.md)**
- **[Entitlements →](./entitlements.md)**
- **[Products & Packages →](../monetization/products-and-packages.md)**

<!-- ## Related Content

**[Packages →](./packages.md)** -->