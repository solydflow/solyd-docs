# Packages

A **Package** is the technical purchase unit in SolydFlow. Every transaction is processed against a Package.

Every purchase made through the SDK, API, or hosted checkout ultimately references a Package.

Packages belong to a Product.

## What a Package Contains

Each Package represents a single purchasable configuration.

Each Package defines everything needed to process a purchase, including:

* SDK Identifier
* Currency
* Price
* Duration
* Tier Level
* Payment Provider Route
* Apple Product ID (optional)
* Google Product ID (optional)

A Package supports **one currency only**. To sell the same Product in multiple currencies, create additional Packages under the same Product.

## Product Relationship

Multiple Packages can belong to the same Product.

For example:

```text
Product
Pro Monthly

Packages
├── pro_monthly_ngn
├── pro_monthly_ksh
├── pro_monthly_usd
└── pro_monthly_ios
```

Each package represents the same business offering while allowing localized pricing and platform-specific integrations.

## SDK Purchases

The SDK purchases Packages rather than Products.

For example:

```dart
SolydFlow.purchasePackage("pro_monthly_ngn")
```

The selected package determines:

* Price
* Currency
* Payment routing
* Store integration
* Resulting entitlement

## Add a Currency Package

> Use **Add Currency Package** to create another purchasable variant of an existing Product.

Example:

```text
Premium Monthly
│
├── NGN
├── KES
├── USD
└── EUR
```

These additional packages inherit the Product's shared configuration while allowing each currency to define its own purchasable configuration.


> During checkout, SolydFlow selects the most appropriate Package for the customer based on your currency mapping. If no mapping exists, USD is used by default.


## Related Documentation

- **[Products →](./products.md)**
- **[Entitlements →](./entitlements.md)**
- **[Products & Packages →](../monetization/products-and-packages.md)**
<!-- 
## Related Content

**[Pricing →](./pricing.md)** -->