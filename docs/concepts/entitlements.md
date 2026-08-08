# Entitlements

An **entitlement** represents what a customer is allowed to access in your application.

Rather than deciding access from payment responses, your application checks whether the customer has a specific entitlement.

For example:

```text
Customer
    ↓
Purchase
    ↓
Transaction Verified
    ↓
Entitlement Granted
    ↓
Application Access
```

An entitlement answers one question:

> **What can this customer access?**

---

## Why Use Entitlements?

Your application shouldn't need to understand payment states like:

* Pending
* Successful
* Failed
* Refunded
* Expired

Instead, SolydFlow handles the payment lifecycle and updates the customer's entitlements accordingly.

Your application simply checks access.

```javascript
const hasAccess = await SolydFlow.hasEntitlement("pro_access");

if (hasAccess) {
    unlockProFeatures();
}
```

---

## Product vs Package vs Entitlement

These concepts have different responsibilities.

| Concept     | Purpose                                |
| ----------- | -------------------------------------- |
| Product     | What you're selling                    |
| Package     | How it's purchased (currency/platform) |
| Entitlement | What access the customer receives      |

Example:

```text
Product
└── Pro Plan

Package
└── Pro Monthly (NGN)

Entitlement
└── pro_access
```

---

## One Entitlement, Multiple Packages

Different packages can unlock the same entitlement.

```text
Pro Monthly
        │
Pro Annual
        │
Pro Lifetime
        │
        ▼
   pro_access
```

Your application only checks:

```javascript
await SolydFlow.hasEntitlement("pro_access");
```

It doesn't matter which package the customer purchased.

---

## Naming Entitlements

Use names that describe application capabilities.

Good examples:

```text
pro_access
premium_content
advanced_analytics
school_admin
ai_generation
```

Avoid payment-related names such as:

```text
paystack_subscription
flutterwave_payment
stripe_pro
```

Entitlements represent **access**, not payments.

---

## Entitlement Lifecycle

An entitlement changes as the customer's revenue state changes.

```text
No Access
      ↓
Purchase
      ↓
Active
      ↓
Expired / Revoked
      ↓
No Access
```

The exact lifecycle depends on your product type and billing model.

---

## Best Practice

Your application should always check entitlements instead of payment results.

✅ Recommended

```javascript
const hasAccess = await SolydFlow.hasEntitlement("pro_access");
```

❌ Avoid

```javascript
if (payment.success) {
    unlockFeatures();
}
```

Payment success doesn't always mean the customer should immediately receive access. SolydFlow determines that through its revenue lifecycle.

---

## Related Documentation

* **Transactions** — Learn how SolydFlow tracks payment events.
* **Recover** — Understand how interrupted payments are recovered.
* **Truth** — Learn how SolydFlow verifies transaction state.
* **Enforce** — See how verified transactions become customer access.