# Products and Packages

SolydFlow separates **what you sell** from **how you offer it**.

A **Product** represents the core offering your business provides, while a **Package** represents a specific way a customer can purchase that product.

```text
Product
   │
   ├── Package
   ├── Package
   └── Package
```

This separation allows you to build different plans, billing options, and purchasing models around the same underlying product.

For the definitions of these concepts, see [Products](../concepts/products.md) and [Packages](../concepts/packages.md).

---

## Product

A Product represents the core offering you are selling.

For example:

```text
Product
└── Project Management
```

The Product answers:

> **What are you selling?**

The Product provides the common foundation for the commercial offerings built around it.

For example:

```text
Product
└── Fitness App
```

The same Product can then have multiple Packages for different customer needs.

---

## Package

A Package represents a specific purchasable offering of a Product.

For example:

```text
Product
└── Project Management

Packages
├── Starter
├── Professional
└── Business
```

The Package answers:

> **How is this product being offered to the customer?**

Packages can represent different plans, billing models, or purchasing options.

---

## Product vs Package

The distinction is:

| Concept | Answers                                   |
| ------- | ----------------------------------------- |
| Product | What are you selling?                     |
| Package | Which offering can the customer purchase? |

For example:

```text
Product
└── Online Course Platform

Packages
├── Student
├── Professional
└── Business
```

The Product remains the same while the Packages define the different commercial offerings.

---

## Multiple Packages for One Product

A Product can have multiple Packages.

For example:

```text
Product
└── SolydFlow Pro
    ├── Monthly
    ├── Annual
    └── Lifetime
```

These Packages can represent different ways of purchasing the same underlying offering.

For example:

```text
Monthly
$15 / month

Annual
$150 / year

Lifetime
$500 one-time
```

The Product remains unchanged while the Packages provide different purchasing options.

---

## Packages and Pricing

Packages define the offerings customers can purchase.

Pricing determines what customers pay for those offerings.

Conceptually:

```text
Product
   ↓
Package
   ↓
Price
```

For example:

```text
Product
└── Analytics
    └── Pro
        └── $20 / month
```

Keeping the Product, Package, and Price separate makes it easier to adjust pricing without restructuring the underlying product.

See [Regional Pricing](./regional-pricing.md) and [Changing Pricing](./changing-pricing.md).

---

## Packages and Billing Models

Packages can represent different billing models for the same Product.

For example:

```text
Product
│
├── Monthly
│   └── Recurring
│
├── Annual
│   └── Recurring
│
└── Lifetime
    └── One-time
```

This allows you to offer customers different ways to purchase the same Product.

---

## Packages and Customer Segments

Packages can also represent different offerings for different customer segments.

For example:

```text
Product
└── Education Platform

Packages
├── Student
├── Teacher
├── School
└── Enterprise
```

Each Package can have its own commercial configuration while remaining part of the same Product.

This is useful when different customer groups require different plans, features, limits, or pricing.

---

## Packages and Features

Packages can be used to differentiate what customers receive from each offering.

For example:

```text
Product: School Management

Basic
├── Student Management
└── Attendance

Pro
├── Student Management
├── Attendance
├── Financial Reports
└── WhatsApp Automation

Enterprise
├── Everything in Pro
├── Multiple Schools
└── Advanced Reporting
```

After a successful purchase, the resulting entitlement can determine which functionality the customer can access.

```text
Package
   ↓
Successful Transaction
   ↓
Entitlement
   ↓
Feature Access
```

See [Entitlements](../concepts/entitlements.md).

---

## Packages and Paywalls

Packages are the purchasable offerings that your application's paywall can present to customers.

For example:

```text
┌─────────────────────────────────────┐
│          Choose Your Plan            │
│                                     │
│  Basic       Pro        Enterprise  │
│   $5         $15           $30      │
│                                     │
│ [Choose]    [Choose]      [Choose]  │
└─────────────────────────────────────┘
```

Your application can use SolydFlow's configured Packages and Pricing rather than maintaining every commercial option directly in application code.

```text
SolydFlow
   │
   ├── Product
   ├── Packages
   └── Pricing
        ↓
      Paywall
        ↓
     Customer
```

See [Paywalls](../concepts/paywalls.md).

---

## Packages and Transactions

When a customer purchases a Package, the purchase produces a transaction.

```text
Customer
   ↓
Package
   ↓
Purchase
   ↓
Transaction
```

The transaction records the financial event associated with that purchase.

For example:

```text
Package
└── Pro Monthly

Transaction
├── Package: Pro Monthly
├── Amount: $15
├── Currency: USD
└── State: Successful
```

See [Transactions](../concepts/transactions.md).

---

## Packages and Entitlements

A successful Package purchase can result in an entitlement.

```text
Package
   ↓
Transaction
   ↓
Successful
   ↓
Entitlement
   ↓
Access
```

For example:

```text
Package
└── Pro

Entitlement
└── pro_access
```

Your application can use the entitlement to determine whether the customer should have access to the corresponding functionality.

See [Entitlements](../concepts/entitlements.md).

---

## Packages and Discounts

Discounts can be applied to Packages without requiring a new Product.

For example:

```text
Product
└── Pro

Package
└── Monthly

Regular Price
└── $20

Discount
└── 25%

Effective Price
└── $15
```

This keeps promotional pricing separate from the underlying Product and Package structure.

See [Discounts](./discounts.md).

---

## Packages Across Different Markets

The same Product and Package can be offered to customers in different markets with appropriate pricing.

For example:

```text
Product
└── Pro

Package
└── Monthly

Prices
├── Nigeria → ₦15,000
├── United States → $20
└── United Kingdom → £16
```

The commercial offering remains the same while the applicable price can vary according to the market.

See [Regional Pricing](./regional-pricing.md).

---

## Adding a New Package

Your Product structure can remain stable while you introduce additional purchasing options.

For example:

```text
Before

Product
└── Pro
    ├── Monthly
    └── Annual
```

Later:

```text
After

Product
└── Pro
    ├── Monthly
    ├── Annual
    └── Lifetime
```

This allows you to expand your commercial offering without creating an entirely new Product for every purchasing option.

---

## Changing Pricing Without Changing the Product

A pricing change does not necessarily require a new Product or Package.

For example:

```text
Before

Pro Monthly
$10 / month
```

Later:

```text
After

Pro Monthly
$15 / month
```

The Product can remain:

```text
Pro
```

and the Package can remain:

```text
Monthly
```

while the pricing configuration changes.

See [Changing Pricing](./changing-pricing.md).

---

## Product and Package Architecture

A typical monetization structure can look like:

```text
                         PRODUCT
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
           PACKAGE A     PACKAGE B     PACKAGE C
              │             │             │
              ↓             ↓             ↓
            PRICE         PRICE         PRICE
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                         PAYWALL
                            ↓
                         PURCHASE
                            ↓
                       TRANSACTION
                            ↓
                        ENTITLEMENT
                            ↓
                          ACCESS
```

This separates the commercial model from the transaction and access layers.

---

## When to Create a New Product

A useful rule is:

> **Create a new Product when you are selling something fundamentally different. Create a new Package when you are changing how the same Product is offered.**

For example:

```text
Different Products

Project Management
        +
Accounting Software
```

These are fundamentally different offerings.

But:

```text
Same Product

Project Management
├── Starter
├── Pro
└── Enterprise
```

These are different Packages of the same Product.

Keeping this distinction clear helps prevent your monetization structure from becoming unnecessarily fragmented as your business grows.

---

## Example: SaaS Application

Suppose you operate a project-management SaaS.

Your Product could be:

```text
Product
└── Project Management
```

Your Packages:

```text
Packages
├── Starter
├── Professional
└── Business
```

Your pricing:

```text
Starter
└── $9 / month

Professional
└── $19 / month

Business
└── $49 / month
```

A customer choosing Professional would follow the revenue flow:

```text
Professional Package
        ↓
     Purchase
        ↓
    Transaction
        ↓
     Successful
        ↓
    Entitlement
        ↓
Professional Features
```

---

## Example: Mobile Application

A mobile application could offer:

```text
Product
└── Fitness App

Packages
├── Free
├── Premium Monthly
└── Premium Annual
```

The customer selects a Package through the application's paywall.

```text
Customer
   ↓
Premium Annual
   ↓
Transaction
   ↓
Successful
   ↓
premium_access
   ↓
Premium Features
```

---

## Example: EdTech

An education platform could structure its offering as:

```text
Product
└── Mathematics Learning

Packages
├── Basic
├── Secondary
└── Premium
```

Each Package can represent a different commercial offering for a particular customer segment.

```text
Mathematics Learning
        │
        ├── Basic
        ├── Secondary
        └── Premium
```

The resulting entitlement can then determine the customer's access within the application.

---

## Key Principle

Products define **what you sell**.

Packages define **how you offer it**.

Pricing defines **what customers pay**.

```text
Product
   ↓
Package
   ↓
Price
   ↓
Purchase
   ↓
Transaction
   ↓
Entitlement
   ↓
Access
```

Keeping these responsibilities separate makes it easier to introduce new offerings, support different purchasing models, localize pricing, and evolve your monetization strategy without repeatedly changing your application architecture.

---

<!-- ## Next Steps

Learn how to configure pricing for different markets:

**[Regional Pricing →](./regional-pricing.md)**

Learn how to offer promotional discounts:

**[Discounts →](./discounts.md)**

Learn how to change pricing as your business evolves:

**[Changing Pricing →](./changing-pricing.md)** -->
