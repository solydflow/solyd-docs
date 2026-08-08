# Monetization

SolydFlow gives you a centralized way to define and manage how your applications make money.

Instead of embedding products, packages, pricing, discounts, and payment behavior throughout your application code, you can manage your revenue configuration through SolydFlow and let your applications use that configuration.

```text
Your Application
       ↓
   SolydFlow
       │
       ├── Products
       ├── Packages
       ├── Pricing
       ├── Discounts
       └── Payment Providers
```

This allows you to change your monetization strategy without repeatedly rebuilding the revenue logic inside your applications.

---

## How Monetization Works

SolydFlow separates the commercial model from the payment infrastructure that processes it.

A typical revenue flow is:

```text
Product
   ↓
Package
   ↓
Price
   ↓
Paywall
   ↓
Purchase
   ↓
Transaction
   ↓
Recover
   ↓
Truth
   ↓
Enforce
   ↓
Entitlement
   ↓
Customer Access
```

Each part has a different responsibility:

| Concept     | Role                                         |
| ----------- | -------------------------------------------- |
| Product     | Defines what you are selling                 |
| Package     | Defines how the product can be purchased     |
| Price       | Defines what the customer pays               |
| Paywall     | Presents available offerings to the customer |
| Purchase    | Represents the customer's attempt to buy     |
| Transaction | Records the financial outcome                |
| Entitlement | Represents the access the customer receives  |

The detailed definitions of these concepts are covered in the [Concepts](../concepts/projects.md) section.

---

## Building Your Revenue Model

SolydFlow's monetization layer focuses on four areas:

```text
Products & Packages
        ↓
Regional Pricing
        ↓
Discounts
        ↓
Changing Pricing
```

Together, these allow you to define what you sell, how customers can purchase it, how pricing varies across markets, and how your commercial strategy evolves over time.

---

## Products and Packages

Products define the offerings you sell, while packages define the specific ways customers can purchase those offerings.

For example:

```text
Product
└── Pro
    ├── Monthly
    ├── Annual
    └── Lifetime
```

A product can therefore support multiple purchase options without requiring each option to become a separate product.

See [Products and Packages](./products-and-packages.md).

---

## Regional Pricing

Customers in different markets may require different currencies and pricing strategies.

For example:

```text
Pro Monthly

Nigeria
₦2,500

Kenya
KSh500

United States
$5
```

SolydFlow allows your monetization model to account for regional pricing rather than relying only on direct currency conversion.

See [Regional Pricing](./regional-pricing.md).

---

## Discounts

Discounts allow you to offer customers a different effective price without changing the underlying product.

For example:

```text
Regular Price
$20

      ↓

25% Discount

      ↓

Customer Price
$15
```

Discounts can be useful for:

* Launch promotions
* Seasonal campaigns
* Early-access offers
* Customer promotions
* Marketing campaigns

See [Discounts](./discounts.md).

---

## Changing Pricing

Your monetization strategy may change as your business grows.

You may need to:

* Increase or reduce prices
* Introduce new packages
* Remove existing offerings
* Change regional prices
* Adjust your commercial model

With centralized revenue configuration, these changes can be managed through SolydFlow rather than requiring pricing logic to be duplicated throughout your applications.

See [Changing Pricing](./changing-pricing.md).

---

## Monetization Across Multiple Applications

SolydFlow is particularly useful when the same business operates multiple applications.

Without centralized monetization:

```text
App A
 └── Pricing Logic

App B
 └── Pricing Logic

App C
 └── Pricing Logic
```

With SolydFlow:

```text
                 SolydFlow
             Monetization Layer
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
        App A      App B      App C
```

Your applications can maintain their own user experiences while consuming the revenue configuration managed through SolydFlow.

This reduces duplicated monetization logic and makes it easier to maintain a consistent commercial model across your product ecosystem.

---

## Monetization and Payment Providers

Monetization defines **what you sell and how you price it**.

Payment providers determine **how the customer pays**.

```text
Product
   ↓
Package
   ↓
Price
   ↓
Paywall
   ↓
Payment Provider
   ↓
Transaction
```

For example, the same product may be sold through different payment providers depending on the market or application.

SolydFlow connects the monetization layer to the underlying payment infrastructure without requiring your application to rebuild the entire payment integration for each provider.

See [Payment Providers](../payment-providers/overview.md).

---

## From Monetization to Revenue

Monetization defines the commercial configuration, but the revenue lifecycle continues after the customer starts a purchase.

```text
Monetization
     ↓
  Purchase
     ↓
 Transaction
     ↓
   Recover
     ↓
    Truth
     ↓
   Enforce
     ↓
 Entitlement
     ↓
Customer Access
```

This separation is important:

* **Monetization** defines what the customer can buy and at what price.
* **Transaction processing** establishes what happened financially.
* **Recovery** handles transactions that may not have reached a reliable state.
* **Truth** establishes the authoritative transaction outcome.
* **Enforce** applies the appropriate revenue outcome.
* **Entitlement** represents what the customer should have access to.

The detailed transaction lifecycle is covered in the [Concepts](../concepts/transactions.md), [Recover](../recover/overview.md), [Truth](../truth/overview.md), and [Enforce](../enforce/overview.md) sections.

---

## When to Use SolydFlow Monetization

SolydFlow's centralized monetization model is particularly useful when you:

* Manage multiple applications
* Offer multiple products or packages
* Support multiple currencies or markets
* Use multiple payment providers
* Change pricing frequently
* Run promotional campaigns
* Want to separate monetization configuration from application code
* Want to reduce duplicated revenue logic across applications

---

## Recommended Architecture

A clean implementation separates your application from your revenue infrastructure.

```text
┌─────────────────────────────┐
│       Your Application      │
│                             │
│  Features                   │
│  User Experience            │
│  Business Logic             │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│          SolydFlow          │
│                             │
│  Products                   │
│  Packages                   │
│  Pricing                    │
│  Discounts                  │
│  Transactions               │
│  Recovery                   │
│  Truth                      │
│  Enforcement                │
│  Entitlements               │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│      Payment Providers      │
│                             │
│  Paystack                   │
│  Flutterwave                │
│  Stripe                     │
│  Other Providers            │
└─────────────────────────────┘
```

Your application focuses on delivering the product.

SolydFlow provides the configurable revenue infrastructure around it.

---

## Key Principle

> **Your application should not have to carry your entire monetization infrastructure.**

Define what you sell.

Configure how customers can purchase it.

Set prices for your markets.

Create promotions when needed.

Connect your payment providers.

Then let SolydFlow manage the revenue flow around those decisions.

```text
Define Your Offering
        ↓
Configure Packages
        ↓
Set Pricing
        ↓
Add Discounts
        ↓
Connect Payment Infrastructure
        ↓
Manage Revenue
```

---
<!-- 
## Next Steps

Learn how products and packages work together:

**[Products and Packages →](./products-and-packages.md)**

Learn how to configure pricing for different markets:

**[Regional Pricing →](./regional-pricing.md)**

Learn how to create promotional discounts:

**[Discounts →](./discounts.md)**

Learn how to change your pricing strategy:

**[Changing Pricing →](./changing-pricing.md)** -->
