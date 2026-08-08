# Transactions

A **transaction** represents a customer's attempt to purchase a package.

It records the financial journey of that purchase—from initiation to its final outcome—and serves as the foundation for recovery, verification, and entitlement management.

```text
Customer
    ↓
Package
    ↓
Purchase
    ↓
Transaction
    ↓
Revenue Outcome
    ↓
Entitlement
```

Unlike a simple payment response, a transaction captures the complete lifecycle of a purchase.

---

## Why Transactions Matter

Payment providers don't always return an immediate or reliable final result.

Real-world payment flows can involve:

* Network interruptions
* Delayed provider responses
* Missing callbacks
* Duplicate webhooks
* Pending payments
* Customer abandonment

For example:

```text
Customer
    ↓
Starts Payment
    ↓
Payment Completes
    ↓
Network Interruption
    ↓
No Callback Received
```

Your application might assume the payment failed, even though the provider recorded it as successful.

SolydFlow tracks the transaction independently so it can determine the correct outcome.

---

## Transaction Lifecycle

Every transaction progresses through a lifecycle.

```text
Purchase Initiated
        ↓
Payment Processing
        ↓
Transaction Recorded
        ↓
Recover
        ↓
Truth
        ↓
Enforce
        ↓
Final Revenue Outcome
```

The exact states depend on the payment provider, but the principle remains the same:

> **A payment response is not always the final financial outcome.**

---

## Transaction States

During its lifecycle, a transaction may move through several states.

For example:

```text
Pending
    ↓
Successful
```

or

```text
Pending
    ↓
Failed
```

or

```text
Pending
    ↓
Interrupted
    ↓
Recovered
    ↓
Successful
```

Your application should rely on the transaction state provided by SolydFlow rather than interpreting provider-specific responses.

---

## Transactions and Packages

Every transaction belongs to a package.

The package determines details such as:

* Product
* Price
* Currency
* Billing model

For example:

```text
Product
└── Pro Plan
    └── Monthly (₦10,000)
            ↓
       Transaction
```

This allows SolydFlow to associate every financial event with the exact offering the customer attempted to purchase.

---

## Transactions and Entitlements

Transactions and entitlements serve different purposes.

| Transaction                | Entitlement                   |
| -------------------------- | ----------------------------- |
| What happened financially? | What can the customer access? |

Example:

```text
Successful Transaction
          ↓
     pro_access
          ↓
 Application Access
```

Your application should check entitlements instead of payment responses.

```javascript
const hasAccess = await SolydFlow.hasEntitlement("pro_access");

if (hasAccess) {
    unlockProFeatures();
}
```

---

## Transactions and Payment Providers

A transaction can be processed by any provider connected to your project.

```text
                SolydFlow
                    │
            Transaction Layer
                    │
     ┌──────────────┼──────────────┐
     ↓              ↓              ↓
 Paystack     Flutterwave      Stripe
```

Each provider has its own APIs and payment states.

SolydFlow provides a consistent transaction model across all supported providers.

---

## Interrupted Payment Flows

Interrupted payment flows are common, especially on unreliable networks.

For example:

```text
Payment Started
        ↓
Payment Completed
        ↓
Callback Lost
```

Instead of assuming failure, SolydFlow can:

```text
Recover
     ↓
Verify
     ↓
Determine Truth
     ↓
Apply Outcome
```

This helps prevent customers from losing access because of incomplete payment flows.

---

## Transaction Identity

Every transaction has a unique identifier.

For example:

```text
txn_01H...
```

Use this identifier when:

* Looking up a transaction
* Troubleshooting payments
* Contacting support
* Reconciling financial records

---

## Transaction Events

Transactions generate events as they progress.

For example:

```text
Transaction Created
        ↓
Payment Updated
        ↓
Verified
        ↓
Revenue Applied
```

Your application can respond to these events through the SolydFlow SDK or webhooks.

---

## Reconciliation

Sometimes your application and the payment provider disagree about a payment's status.

For example:

```text
Application
Pending

Provider
Successful
```

SolydFlow reconciles these differences to establish the correct transaction state before updating customer access.

---

## Idempotency

Payment providers may send the same event multiple times.

```text
Payment Success
      ↓
Webhook
      ↓
Retry
      ↓
Retry
```

SolydFlow treats these as updates to the same transaction rather than creating duplicate payments.

---

## Don't Build Your Own Transaction State Machine

Without a centralized revenue layer, applications often implement separate logic for:

* Every payment provider
* Webhook retries
* Recovery
* Reconciliation
* Subscription updates
* Entitlements

SolydFlow centralizes this complexity.

```text
Your Application
        ↓
    SolydFlow
        ↓
Recover → Truth → Enforce
        ↓
Payment Providers
```

Your application can focus on delivering features instead of managing payment edge cases.

---

## Key Principle

A transaction is more than a payment response.

It represents the complete financial lifecycle of a purchase.

```text
Purchase
    ↓
Processing
    ↓
Recover
    ↓
Truth
    ↓
Enforce
    ↓
Revenue Outcome
    ↓
Entitlement
```

SolydFlow ensures every transaction reaches the correct revenue outcome, even when payment flows are delayed, interrupted, or inconsistent.

---

<!-- ## Related Contents

Learn how SolydFlow structures commercial offerings and pricing:

**[Monetization Overview →](../monetization/overview.md)**

Configure payment providers for your project:

**[Payment Providers →](../payment-providers/overview.md)**

Or continue exploring SolydFlow's revenue lifecycle:

**[Recover →](../recover/overview.md)** -->