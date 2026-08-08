# Paywalls

A **Paywall** is the customer-facing experience where customers discover your offerings and start a purchase.

In SolydFlow, a paywall presents **Products**, displays the appropriate **Packages**, and initiates purchases.

```text
Your Application
       ↓
    Paywall
       ↓
     Product
       ↓
     Package
       ↓
    SolydFlow
       ↓
Payment Provider
```

The paywall answers one question:

> **What can this customer purchase?**

---

## Products, Packages and Paywalls

These concepts work together but serve different purposes.

| Concept | Purpose |
|---------|---------|
| Product | What you're selling |
| Package | How it's purchased |
| Paywall | How it's presented |

For example:

```text
Product
Premium Monthly
      │
      ├── NGN Package
      ├── KES Package
      ├── USD Package
      └── Apple Package
             │
             ▼
          Paywall
```

Customers see a Product, but purchases are always made against a Package.

---

## Hosted or Custom

SolydFlow supports two purchase experiences.

### Hosted Paywall

Use SolydFlow's hosted checkout when you want a ready-to-use purchase experience.

Ideal for:

- Websites
- Payment links
- Quick integrations

### Custom Paywall

Build your own interface while using the SolydFlow SDK or API to initiate purchases.

Ideal for:

- Mobile applications
- SaaS platforms
- Fully branded experiences

```text
Your UI
     ↓
 SolydFlow
     ↓
Payment Provider
```

---

## Why Centralize Paywalls?

Revenue configuration changes over time.

You may need to:

- Add new packages
- Update prices
- Launch promotions
- Enable regional pricing
- Introduce new plans

Instead of hardcoding these changes into every application, manage them once in SolydFlow.

```text
                SolydFlow
         Revenue Configuration
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Web     Mobile   Desktop
```

Each application keeps its own user experience while sharing the same revenue configuration.

---

## Regional Pricing

A paywall automatically presents the appropriate Package for the customer.

For example:

```text
Premium Monthly

Nigeria
₦2,500

Kenya
KSh300

United States
$5
```

SolydFlow selects the appropriate Package based on your currency mapping. If no mapping exists, USD is used by default.

---

## Testing Your Paywall

Before going live, verify that:

- The correct Products appear
- The correct Packages are displayed
- Prices are correct
- Purchases can be completed
- Entitlements are granted correctly
- Recovery scenarios behave as expected

Use the **Sandbox** to test both successful and failed purchase flows before processing live transactions.

---


## Related Documentation

- **[Products →](./products.md)**
- **[Packages →](./packages.md)**
- **[Pricing →](./pricing.md)**
- **[Sandbox →](../sandbox/overview.md)**


<!-- ## Related Content

Learn how SolydFlow grants access after a successful purchase.

**[Entitlements →](./entitlements.md)** -->
