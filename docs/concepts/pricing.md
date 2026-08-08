# Pricing

Pricing in SolydFlow is managed through **Packages**.

A **Product** defines what you're selling, while each **Package** defines how that product is purchased in a specific currency, platform, or market.

This separation allows businesses to offer the same feature set across multiple countries without requiring separate products.

## Localized Pricing

Each Package has its own currency and price.

For example:

```text
Product
Pro Monthly

Packages

NGN
₦2,500

KES
KSh300

USD
$5
```

Each package has its own currency and price, allowing the same product to be sold at market-appropriate prices across different regions.

Customers purchasing the same Product can therefore see different prices depending on the Package selected for their region.

## Purchasing Power Parity (PPP)

Localized Packages make it possible to implement regional pricing strategies.

Instead of using direct exchange-rate conversions, businesses can set prices that reflect purchasing power in each market while selling the same product.

For example:

```text
Premium Monthly

United States
$9.99

Nigeria
₦2,000

Kenya
KSh500
```

Although these Packages belong to the same Product, each Package maintains its own localized price.

## Pricing Flow

```text
Product
    │
    ▼
Package
    │
    ▼
Localized Price
    │
    ▼
Customer Purchase
    │
    ▼
Transaction
```

## Platform Packages

Packages can also be linked to platform-specific purchase identifiers, such as Apple App Store and Google Play product IDs. This allows the same product to be sold across web, mobile, and app stores while keeping the business offering consistent.

## Geo-IP Package Selection

When multiple currency packages exist for a product, SolydFlow automatically selects the most appropriate package based on the customer's location.

If no matching currency is available, SolydFlow falls back to the product's USD package.

This gives businesses localized pricing without requiring additional application logic.

<!-- ## Related Content

Learn how packages are used to build purchasing experiences.

**[Paywalls →](./paywalls.md)**

Or continue to:

- **[Products →](./products.md)**
- **[Packages →](./packages.md)**
- **[Monetization Overview →](../monetization/overview.md)** -->
