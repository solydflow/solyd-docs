# Changing Pricing

Your pricing will change as your product, market, and business evolve.

SolydFlow lets you manage pricing as part of your revenue configuration rather than requiring pricing rules to be rebuilt directly into every application.

```text
Current Pricing
      ↓
Update Configuration
      ↓
SolydFlow
      ↓
Connected Applications
      ↓
Updated Pricing
```

The goal is simple:

> **Changing your price should not require rewriting your payment infrastructure.**

---

## Why Pricing Changes Become Expensive

When prices are hard-coded into an application, even a simple pricing change can require changes across several parts of the system.

For example:

```text
Price Change
    ↓
Paywall
    ↓
Checkout
    ↓
Payment Logic
    ↓
Subscription Logic
    ↓
Database
    ↓
Application Code
    ↓
Deployment
```

If you operate multiple applications, the problem becomes larger:

```text
App A → Update → Test → Deploy

App B → Update → Test → Deploy

App C → Update → Test → Deploy
```

SolydFlow separates your monetization configuration from the application logic so that pricing can be managed centrally.

---

## Change Pricing Without Rebuilding Your Application

Suppose your current package is:

```text
Pro Monthly
$10 / month
```

You decide to increase it to:

```text
Pro Monthly
$15 / month
```

Instead of rebuilding the payment logic inside your application, the pricing configuration can be updated in SolydFlow.

```text
Before

Pro Monthly
$10
```

```text
After

Pro Monthly
$15
```

Your application continues to use the same product and package.

---

## What Does Not Need to Change

A pricing change does not necessarily mean changing:

* Your product
* Your package
* Your payment-provider integration
* Your transaction handling
* Your recovery logic
* Your entitlement logic
* Your application's core business logic

The exact behavior depends on how your application consumes SolydFlow configuration.

The architectural principle remains:

```text
Product
   ↓
Package
   ↓
Pricing
```

Pricing should remain a configurable part of the monetization layer.

---

## Changing Prices Across Multiple Applications

This becomes especially useful when the same commercial offering is used by multiple applications.

For example:

```text
                    SolydFlow
                       │
                Pricing Configuration
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
        App A         App B        App C
```

Suppose the price changes from:

```text
$10 → $15
```

The change can be managed centrally rather than implementing the same pricing change independently in every application.

This is one of the key reasons to keep monetization configuration outside your application code.

---

## Changing Regional Prices

You may want to change the price in one market without affecting other markets.

For example:

```text
Before

Nigeria       ₦15,000
United States $20
United Kingdom £16
```

You may decide to change only Nigeria:

```text
After

Nigeria       ₦18,000
United States $20
United Kingdom £16
```

The product and package remain unchanged.

Only the applicable regional price changes.

See:

**[Regional Pricing →](./regional-pricing.md)**

---

## Changing Multiple Prices

You can also change pricing across several markets as part of a broader pricing strategy.

For example:

```text
Before

Nigeria       ₦15,000
Ghana         GH₵200
United States $20
United Kingdom £16
```

After a pricing review:

```text
Nigeria       ₦18,000
Ghana         GH₵250
United States $25
United Kingdom £20
```

The underlying product remains the same.

Your pricing configuration changes.

---

## Changing a Package's Pricing Model

Your commercial strategy may also change beyond simply changing the amount.

For example:

```text
Before

Pro
$20 / month
```

You may later decide to offer:

```text
Pro
$20 / month

or

$200 / year
```

The product remains the same while the available package offerings can evolve.

For larger structural changes, consider whether you should create a new package rather than modifying an existing one.

See:

**[Products and Packages →](./products-and-packages.md)**

---

## Adding a New Package

Sometimes you do not want to change an existing price.

Instead, you want to introduce another option.

For example:

```text
Before

Pro
├── Monthly
└── Annual
```

Later:

```text
Pro
├── Monthly
├── Annual
└── Lifetime
```

This is a package change rather than simply a price change.

The existing offerings can remain available while the new option is introduced.

---

## Removing an Offering

You may eventually decide that a package should no longer be available to new customers.

For example:

```text
Before

Basic
Pro
Enterprise
```

Later:

```text
Basic
Pro
```

When retiring an offering, consider existing customers separately from new purchases.

Existing customers may already have transactions and entitlements associated with the package.

Do not assume that removing an offering from your paywall automatically means existing customer access should be removed.

---

## Existing Customers vs New Customers

One of the most important considerations when changing pricing is whether the change applies to:

* New customers
* Existing customers
* Both

For example:

```text
Existing Customers
$10 / month

New Customers
$15 / month
```

This is different from simply replacing:

```text
$10 → $15
```

Your pricing strategy should therefore distinguish between the price offered to new purchases and the treatment of existing customers.

The exact capabilities for grandfathering or migrating existing customers depend on your SolydFlow implementation.

---

## Pricing Changes and Active Subscriptions

Subscription pricing requires additional care.

Suppose a customer currently has:

```text
Pro Monthly
$10 / month
```

You change the package price to:

```text
$15 / month
```

You need to determine whether:

```text
Existing Subscription
$10
```

should remain at its current price or move to:

```text
$15
```

This is a business and subscription-management decision, not simply a paywall decision.

Before applying a pricing change to active subscriptions, establish the intended customer behavior.

---

## Pricing Changes and One-Time Purchases

One-time purchases are generally simpler.

For example:

```text
Before

Lifetime
$200
```

You change the price:

```text
After

Lifetime
$250
```

Customers who purchase after the change can be charged according to the new configuration.

Customers who already completed a successful purchase retain the entitlement associated with their completed transaction.

```text
Existing Purchase
       ↓
Existing Transaction
       ↓
Existing Entitlement
```

A new price should not retroactively alter a completed transaction.

---

## Pricing Changes and Transactions

A pricing configuration describes what a customer is offered.

A transaction records what actually happened when a purchase was made.

For example:

```text
Current Price
$20
```

Customer purchases:

```text
Transaction
$20
```

Later, the price changes:

```text
New Price
$25
```

The previous transaction remains a record of the original purchase.

```text
Transaction 1
$20
```

and future purchases can use:

```text
Transaction 2
$25
```

This distinction is important for accurate revenue history and reconciliation.

---

## Pricing Changes and Entitlements

Changing the price of a package does not automatically mean changing what an existing customer is entitled to.

For example:

```text
Pro
$20
   ↓
pro_access
```

Later:

```text
Pro
$25
   ↓
pro_access
```

The commercial price changed.

The entitlement may remain the same.

This separation allows you to adjust pricing without unnecessarily changing your application's feature-access model.

---

## Pricing Changes and Discounts

You may also change your standard price while running a promotion.

For example:

```text
Regular Price
$20

Discount
25%

Customer Price
$15
```

You later change the standard price:

```text
Regular Price
$25

Discount
25%

Customer Price
$18.75
```

The discount and the underlying price are separate parts of the monetization configuration.

See:

**[Discounts →](./discounts.md)**

---

## Pricing Changes and Paywalls

Your paywall should present the current applicable offering.

For example:

```text
Before

┌──────────────────────┐
│         Pro          │
│      $20 / month     │
│                      │
│      [Subscribe]     │
└──────────────────────┘
```

After the price changes:

```text
┌──────────────────────┐
│         Pro          │
│      $25 / month     │
│                      │
│      [Subscribe]     │
└──────────────────────┘
```

The application should consume the current monetization configuration rather than maintaining a second hard-coded copy of the price.

---

## Avoid Hard-Coding Prices

Avoid spreading prices throughout your application.

For example:

```text
❌ Frontend
$20

❌ Backend
$20

❌ Checkout
$20

❌ Subscription Logic
$20
```

This creates multiple sources of truth.

Instead:

```text
SolydFlow
   ↓
Pricing Configuration
   ↓
Application
   ↓
Paywall / Purchase Flow
```

The application consumes the configured pricing information.

---

## One Source of Truth

A useful architecture is:

```text
                    SolydFlow
                       │
                Pricing Configuration
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Paywall      Purchase      Checkout
```

The same monetization configuration can therefore drive the different parts of the purchasing experience.

This reduces the risk of displaying one price while charging another.

---

## Validate Before Going Live

Before applying a significant pricing change to production, verify:

* The correct package is being updated
* The correct market is being updated
* The correct currency is configured
* The paywall displays the intended price
* The purchase flow uses the intended price
* Existing customers are handled as intended
* Active subscriptions are handled correctly
* Discounts still behave as expected
* Entitlements remain correct
* Transactions are recorded correctly

For production changes, see:

**[Production Checklist →](../production/production-checklist.md)**

---

## Example: Changing Pricing Across an Ecosystem

Imagine you have three applications:

```text
SolydGuide
SolydHome
SolydFlow
```

and each application offers:

```text
Pro
$10 / month
```

You decide to increase the price:

```text
$10 → $15
```

Without centralized monetization:

```text
SolydGuide
   ↓
Change Code
   ↓
Test
   ↓
Deploy

SolydHome
   ↓
Change Code
   ↓
Test
   ↓
Deploy

SolydFlow
   ↓
Change Code
   ↓
Test
   ↓
Deploy
```

With centralized monetization:

```text
Update Pricing
      ↓
  SolydFlow
      ↓
Connected Applications
```

The commercial configuration is managed in one place.

---

## Pricing Changes Are Configuration Changes

The key architectural idea is to treat pricing as configuration rather than application logic.

```text
Application Logic
        +
Revenue Configuration
```

instead of:

```text
Application Logic
      +
Hard-coded Prices
      +
Hard-coded Discounts
      +
Hard-coded Provider Rules
```

This makes your application easier to maintain as your monetization strategy evolves.

---

## Key Principle

> **Your business should be able to change its pricing strategy without forcing your engineering team to rebuild the payment architecture.**

SolydFlow separates the commercial configuration from your application's core logic.

```text
Change Price
     ↓
Update Configuration
     ↓
SolydFlow
     ↓
Connected Applications
```

Your team can therefore spend less time rewriting payment logic and more time improving the product.

---

<!-- ## Next Steps

You have now completed the core **Monetization** section.

Continue with the payment infrastructure:

**[Payment Providers →](../payment-providers/overview.md)**

From there you can configure the providers that process your customers' payments. -->