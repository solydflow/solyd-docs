---
id: intro
title: SolydFlow Documentation
slug: /
---

# What is SolydFlow?

SolydFlow is revenue infrastructure for digital businesses.

It provides a unified layer for connecting payment providers, managing products and pricing, processing transactions, recovering failed payments, verifying transaction outcomes, and enforcing the correct revenue state.

Instead of rebuilding payment and revenue logic for every application, you configure your revenue infrastructure once in SolydFlow and connect your applications to it.

---

## Recover. Truth. Enforce.

SolydFlow is built around three core responsibilities.

### Recover

Recover interrupted or failed payment flows before revenue is lost.

### Truth

Verify what actually happened before granting access or updating customer records.

### Enforce

Apply the correct revenue outcome by updating entitlements, synchronizing customer access, and enforcing your configured revenue rules.

```text
             RECOVER
                ↓
     Recover interrupted or
       failed transactions
                ↓
              TRUTH
                ↓
     Verify what actually
      happened financially
                ↓
             ENFORCE
                ↓
     Apply the correct
       revenue outcome
```

---

## How SolydFlow Fits Into Your Stack

Your application remains responsible for your product and user experience.

Your payment providers remain responsible for processing payments.

SolydFlow provides the revenue infrastructure between them.

```text
┌──────────────────────┐
│   Your Application   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      SolydFlow       │
│                      │
│ Recover              │
│ Truth                │
│ Enforce              │
└──────────┬───────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
 Paystack Flutterwave Stripe
```

---

## Why SolydFlow Exists

Real-world payments don't always follow a simple path.

```text
Customer
    ↓
Payment Attempt
    ↓
Provider
    ↓
Delayed Response
    ↓
Missing Callback
    ↓
Unknown Transaction State
    ↓
Recover
    ↓
Truth
    ↓
Enforce
    ↓
Correct Entitlement
```

SolydFlow is designed around these real-world payment conditions, helping your application respond to verified transaction outcomes instead of assumptions.

---

## Configure Once

Configure your revenue infrastructure in SolydFlow:

- Products
- Packages
- Pricing
- Payment Providers
- Paywalls
- Entitlements

Your applications connect to SolydFlow while your payment providers continue processing payments.

### Example

```text
Premium Monthly
        │
        ├── ₦5,000 (NGN)
        ├── KSh500 (KES)
        └── $4.99 (USD)
                │
                ▼
          Customer Purchases
                │
                ▼
             Recover
                ▼
              Truth
                ▼
             Enforce
                ▼
        premium_access Granted
```

---

## Start Building

Ready to integrate SolydFlow?

## Related Documentation

- **[How SolydFlow Works →](./how-solydflow-works.md)**

<!-- ## Next Step

**[Quickstart →](./get-started/quickstart.md)**
 -->