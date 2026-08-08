# Discounts

SolydFlow supports automatic upgrade discounts through **Smart Credits**.

Instead of requiring developers to create promo codes or manually calculate discounts, SolydFlow automatically applies credit when a customer upgrades from a lower-tier package to a higher-tier package.

---

## How Upgrade Credits Work

Each package has a **Tier Level**.

For example:

```text
Starter
Tier Level: 1

Pro
Tier Level: 2

Business
Tier Level: 3
```

When a customer upgrades, SolydFlow checks whether the new package has a higher tier than their current package.

```text
Starter
Tier 1
   ↓
Pro
Tier 2
   ↓
Upgrade Credit
```

If the customer is eligible, SolydFlow calculates the unused value of their current package and applies it toward the upgrade.

---

## Upgrade Eligibility

An upgrade credit is applied when:

* The customer has an active package.
* The new package has a higher `TierLevel`.
* Both packages use the same currency.
* The existing package still has unused time.

For example:

```text
Current Package
Starter
Tier 1
₦10,000
   ↓
New Package
Pro
Tier 2
₦20,000
```

If the customer still has unused time on Starter, SolydFlow can apply the corresponding unused value as credit toward Pro.

---

## How the Credit Is Calculated

The credit is based on the unused portion of the customer's current package.

Conceptually:

```text
Unused Credit =
(Remaining Days / Total Cycle Days)
× Amount Paid
```

The credit is then deducted from the new package's price.

```text
New Package Price
        ↓
   − Upgrade Credit
        ↓
Amount Customer Pays
```

---

## Example

A customer paid **₦10,000** for a 30-day Starter package.

They upgrade after 10 days, leaving 20 days unused.

```text
Remaining Value

20 / 30 × ₦10,000
= ₦6,666.67
```

If the Pro package costs ₦20,000:

```text
Pro Price       ₦20,000
Upgrade Credit  −₦6,666.67
───────────────────────
Amount Due      ₦13,333.33
```

The exact amount is calculated by SolydFlow.

---

## No Manual Discount Configuration

You do not need to create promo codes such as:

```text
SAVE20
UPGRADE10
WELCOME15
```

Upgrade credits are automatically calculated from the customer's existing package.

To enable the upgrade hierarchy, configure the appropriate **Tier Level** for each package.

```text
Starter  → 1
Pro      → 2
Business → 3
```

---

## How It Appears to Customers

When an upgrade credit applies, SolydFlow can present the original and discounted amounts:

```text
Pro

₦20,000
────────
₦13,333

UPGRADE CREDIT APPLIED

[Upgrade]
```

The customer pays the calculated amount.

---

## Accounting

The original price and applied credit are retained as part of the transaction record.

Conceptually:

```text
Original Amount
        ↓
Upgrade Credit
        ↓
Final Amount
```

This allows the discount to remain traceable for revenue reporting and reconciliation.

---

## Tier Levels

Tier Levels determine the upgrade hierarchy.

For example:

```text
Tier 1 → Starter
Tier 2 → Pro
Tier 3 → Business
```

A customer moving from Tier 1 to Tier 2 can qualify for an upgrade credit.

A customer moving from Tier 2 to Tier 3 can also qualify.

The tier structure is configured on your packages in the **Pricing** section.

---

## Key Principle

> **SolydFlow automatically applies the unused value of an active lower-tier package when a customer upgrades to a higher-tier package.**

Developers only need to maintain the correct package hierarchy using **Tier Levels**.

---

<!-- ## Next Steps

Learn how to change package prices:

**[Changing Pricing →](./changing-pricing.md)**

Learn how regional prices work:

**[Regional Pricing →](./regional-pricing.md)**

Learn how products and packages are structured:

**[Products and Packages →](./products-and-packages.md)** -->
