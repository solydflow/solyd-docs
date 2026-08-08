# Regional Pricing

Customers in different markets may not pay the same amount for your product.

Regional pricing allows you to offer the same product and package at prices that are appropriate for different markets.

```text
Product
   ↓
Package
   ↓
Regional Pricing
   ├── Nigeria
   ├── United States
   ├── United Kingdom
   └── Other Markets
```

This lets you adapt your pricing strategy without creating a separate product for every country.

---

## Why Regional Pricing Matters

A single global price does not always work well across different markets.

For example, you may want to offer:

```text
Pro Monthly

Nigeria
₦15,000 / month

United States
$20 / month

United Kingdom
£16 / month
```

The underlying product is still the same.

```text
Product
└── Pro
    └── Monthly
```

Only the applicable price changes based on the market.

---

## One Product, Multiple Markets

Regional pricing keeps your product structure simple.

Instead of:

```text
Nigeria Product
United States Product
United Kingdom Product
```

you can have:

```text
Product
└── Pro
    └── Monthly
        ├── Nigeria Price
        ├── US Price
        └── UK Price
```

This makes it easier to manage a product that serves customers across multiple countries.

---

## Regional Pricing and Currency

Different markets may use different currencies.

For example:

```text
Pro Monthly

Nigeria       → ₦15,000
United States → $20
United Kingdom → £16
```

The currency displayed to the customer should correspond to the configured price for the applicable market.

This gives customers a more familiar purchasing experience.

---

## Regional Pricing and Packages

Regional pricing works at the package level.

For example:

```text
Product
└── Project Management
    │
    └── Pro
        │
        ├── Nigeria → ₦15,000
        ├── US → $20
        └── UK → £16
```

The package remains the same while the price can vary by market.

This means you do not need to duplicate the package simply because you serve another country.

---

## Regional Pricing and Paywalls

Your paywall can present the applicable price to the customer.

For example, the same package could appear as:

```text
Nigeria

┌──────────────────────┐
│       Pro            │
│   ₦15,000 / month    │
│                      │
│     [Subscribe]      │
└──────────────────────┘
```

while a customer in another market may see:

```text
United States

┌──────────────────────┐
│       Pro            │
│     $20 / month      │
│                      │
│     [Subscribe]      │
└──────────────────────┘
```

The product remains the same.

The applicable regional price changes.

---

## Regional Pricing and Payment Providers

Regional pricing is particularly useful when your application supports multiple payment providers.

For example:

```text
                 SolydFlow
                     │
              Regional Pricing
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
    Nigeria          US            UK
       │             │             │
   Paystack        Stripe        Stripe
```

Your payment-provider configuration can then support the payment methods appropriate to each market.

See:

**[Payment Providers →](../payment-providers/overview.md)**

---

## Regional Pricing Does Not Mean Separate Products

Avoid creating duplicate products simply because customers are in different countries.

Instead of:

```text
Product: Pro Nigeria
Product: Pro US
Product: Pro UK
```

prefer a structure where appropriate:

```text
Product: Pro

Package: Monthly

Prices:
├── Nigeria
├── US
└── UK
```

This keeps your product catalog easier to maintain.

---

## Regional Pricing and Discounts

Discounts can work alongside regional pricing.

For example:

```text
Nigeria

Regular Price
₦15,000

Discount
20%

Effective Price
₦12,000
```

Another market can have its own configured price and applicable promotion.

```text
United States

Regular Price
$20

Discount
20%

Effective Price
$16
```

The discount strategy should therefore be considered together with your regional pricing strategy.

See:

**[Discounts →](./discounts.md)**

---

## Regional Pricing and Price Changes

Markets evolve.

You may need to change the price of a package in one country without changing the price everywhere else.

For example:

```text
Before

Nigeria → ₦15,000
US      → $20
UK      → £16
```

Later:

```text
Nigeria → ₦18,000
US      → $20
UK      → £16
```

The Nigerian price can change while the other markets remain unchanged.

See:

**[Changing Pricing →](./changing-pricing.md)**

---

## Choosing Regional Prices

Regional pricing should reflect your business strategy.

Factors you may consider include:

* Local purchasing power
* Local market expectations
* Currency
* Payment methods
* Taxes and fees
* Provider costs
* Competitive pricing
* Your desired margins

SolydFlow provides the revenue infrastructure; your business determines the pricing strategy.

---

## Example: SaaS Across Three Markets

Suppose you operate a SaaS product called **Pro Workspace**.

Your structure could be:

```text
Product
└── Pro Workspace
    │
    └── Professional
        │
        ├── Nigeria
        │   └── ₦15,000 / month
        │
        ├── United States
        │   └── $20 / month
        │
        └── United Kingdom
            └── £16 / month
```

A customer purchases the Professional package.

The application presents the applicable price for the customer's market.

```text
Customer
   ↓
Market
   ↓
Package
   ↓
Regional Price
   ↓
Paywall
   ↓
Purchase
```

The resulting transaction still belongs to the same product and package.

---

## Example: Mobile Application

A mobile application may offer a premium subscription across several countries.

```text
Product
└── Premium
    │
    └── Monthly
        │
        ├── Nigeria
        ├── Ghana
        ├── Kenya
        ├── UK
        └── US
```

Each market can have its appropriate pricing configuration.

This allows the application to expand into new markets without creating an entirely new product structure for every country.

---

## Adding a New Market

When expanding into a new country, the goal is to extend the existing monetization configuration.

For example:

```text
Existing

Product
└── Pro
    └── Monthly
        ├── Nigeria
        ├── US
        └── UK
```

New market:

```text
Product
└── Pro
    └── Monthly
        ├── Nigeria
        ├── US
        ├── UK
        └── Ghana
```

The underlying product and package do not need to change simply because a new market was added.

---

## Regional Pricing and Your Application Code

Regional pricing is intended to keep commercial configuration out of application code where possible.

Avoid scattering prices throughout your application:

```text
if (country === "NG") {
    price = 15000;
}

if (country === "US") {
    price = 20;
}
```

Instead, your application can consume the configured monetization data.

```text
Application
     ↓
SolydFlow
     ↓
Product
     ↓
Package
     ↓
Applicable Price
     ↓
Paywall
```

This makes pricing easier to manage as your number of markets grows.

---

## Regional Pricing and Revenue Infrastructure

Regional pricing is only one part of the complete revenue flow.

```text
Regional Pricing
       ↓
     Paywall
       ↓
    Purchase
       ↓
   Transaction
       ↓
 Recovery / Truth
       ↓
     Enforce
       ↓
   Entitlement
       ↓
      Access
```

The price determines what the customer is charged.

The transaction determines what happened with the payment.

The entitlement determines what the customer receives.

---

## Important Considerations

Regional pricing introduces additional considerations as you expand globally.

You should account for:

### Currency

Determine which currencies you want to support in each market.

### Payment Methods

Different markets may prefer different payment methods.

### Taxes

Depending on your business model and payment setup, tax obligations may vary by market.

For global commerce and compliance considerations, see:

**[Global Commerce →](../global-commerce/overview.md)**

### Provider Availability

Not every payment provider supports every market or payment method.

Your provider configuration should therefore be considered alongside your regional pricing strategy.

---

## Keep Your Pricing Strategy Centralized

When you operate across multiple applications, centralized pricing becomes even more valuable.

For example:

```text
                 SolydFlow
                     │
             Pricing Configuration
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      App A         App B        App C
        │            │            │
      Nigeria       Nigeria      Nigeria
        │            │            │
      US             US           US
```

Instead of maintaining separate pricing logic for every application, your revenue configuration can be managed centrally.

---

## Key Principle

> **One product does not need one global price.**

You can keep your product and package structure consistent while adapting prices to the markets you serve.

```text
One Product
     ↓
One Package
     ↓
Multiple Markets
     ↓
Appropriate Prices
     ↓
Local Customer Experience
```

This makes it easier to expand internationally while keeping your monetization model organized.

---

<!-- ## Next Steps

Learn how to create promotional offers:

**[Discounts →](./discounts.md)**

Learn how to change prices as your business evolves:

**[Changing Pricing →](./changing-pricing.md)**

Learn how SolydFlow supports global commerce:

**[Global Commerce →](../global-commerce/overview.md)** -->