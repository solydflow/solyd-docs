# How SolydFlow Works

SolydFlow sits between your application and your payment providers.

Your application uses SolydFlow to manage its revenue infrastructure, while your configured payment providers continue processing customer payments.

```text
Your Application
       │
       ▼
   SolydFlow
       │
       ▼
Payment Providers
       │
       ▼
Recover → Truth → Enforce
       │
       ▼
Entitlements
       │
       ▼
Your Application
```

---

## Revenue Flow

A typical purchase follows this flow:

```text
Customer
    │
    ▼
Select Package
    │
    ▼
Paywall or SDK
    │
    ▼
Payment Provider
    │
    ▼
SolydFlow
 ├── Recover
 ├── Truth
 └── Enforce
    │
    ▼
Entitlement Granted
    │
    ▼
Customer Gets Access
```

---

## Recover

Payment flows don't always complete successfully.

Recover detects interrupted payment flows and helps recover legitimate transactions before revenue is lost.

Examples include:

- Missing callbacks
- Delayed webhooks
- Network interruptions
- Zombie transactions

Learn more in **[Recover](./recover/overview.md)**.

---

## Truth

A payment response is not always the final outcome.

Truth verifies the transaction with the configured payment provider and establishes the authoritative transaction state before revenue decisions are made.

Learn more in **[Truth](./truth/overview.md)**.

---

## Enforce

Once the transaction state is known, SolydFlow applies the correct revenue outcome.

This may include:

- Granting entitlements
- Updating customer access
- Synchronizing revenue state

Learn more in **[Enforce](./enforce/overview.md)**.

---

## Configure Once

Configure your revenue infrastructure once in SolydFlow:

- Products
- Packages
- Pricing
- Paywalls
- Payment Providers
- Entitlements

Your applications connect to the same configuration while your payment providers continue processing payments.

```text
                 SolydFlow
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
      App A       App B       App C
                     │
                     ▼
           Payment Providers
```

---

## Example

A customer purchases **Premium Monthly**.

```text
Premium Monthly
        │
        ▼
Package (NGN)
        │
        ▼
Payment Provider
        │
        ▼
Recover
        ▼
Truth
        ▼
Enforce
        ▼
premium_access
```

The application checks the customer's entitlement instead of implementing provider-specific payment logic.

---

## Related Documentation

- **[Recover →](./recover/overview.md)**
- **[Truth →](./truth/overview.md)**
- **[Enforce →](./enforce/overview.md)**
- **[Projects →](./concepts/projects.md)**

<!-- ## Next Step

**[Quickstart →](./get-started/quickstart.md)** -->