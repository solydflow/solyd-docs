# Paystack

Paystack can be connected to SolydFlow to process payments for customers in supported African markets.

With Paystack connected, SolydFlow provides the revenue infrastructure around Paystack transactions while your application works with a consistent SolydFlow revenue layer.

```text
Your Application
       ↓
   SolydFlow
       ↓
   Paystack
       ↓
Payment Network
```

Paystack remains responsible for processing the payment. SolydFlow manages the application-facing revenue flow around it.

---

## When to Use Paystack

Paystack is particularly useful when your application serves customers in African markets supported by Paystack.

For example:

```text
Application
    ↓
SolydFlow
    ↓
Paystack
    ↓
African Customers
```

Paystack can also exist alongside other providers in the same SolydFlow project.

```text
                 SolydFlow
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      Paystack     Stripe   Flutterwave
          │          │          │
       Africa     Global     Africa
```

The appropriate provider depends on your target market, payment methods, currencies, and business requirements.

---

## How Paystack Fits Into SolydFlow

The integration follows the standard SolydFlow provider architecture.

```text
                 SolydFlow
                     │
              Paystack Connection
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Payment Flow          Webhooks
          │                     │
          ↓                     ↓
      Paystack              SolydFlow
          │                     │
          └──────────┬──────────┘
                     ↓
                Transaction
                     ↓
                 Entitlement
                     ↓
              Application Access
```

Your application does not need to implement Paystack-specific revenue logic throughout its codebase.

---

## What Paystack Handles

Paystack handles the provider-side payment operation.

Depending on the payment method and configuration, this can include:

* Payment processing
* Supported payment methods
* Payment authorization
* Provider-side transaction state
* Provider-side customer/payment records
* Provider webhooks
* Refund-related operations supported by Paystack

Paystack's supported countries, payment methods, currencies, and capabilities can change.

Always verify current provider capabilities before relying on a specific feature in production.

---

## What SolydFlow Handles

SolydFlow sits above Paystack and manages the revenue infrastructure around the provider transaction.

This can include:

* Connecting Paystack to your project
* Associating payments with your products and packages
* Tracking transactions
* Processing provider events
* Recovering transactions when expected events are missing
* Verifying transaction state
* Maintaining a unified transaction view
* Managing entitlements
* Supporting routing and failover where configured

```text
Paystack Payment
       ↓
Provider Event
       ↓
   SolydFlow
       ↓
Transaction State
       ↓
  Entitlement
       ↓
Application Access
```

---

## Prerequisites

Before connecting Paystack to SolydFlow, you should have:

1. A Paystack account
2. The required Paystack credentials
3. A SolydFlow project
4. Products configured in SolydFlow
5. Packages and prices configured
6. The markets and payment methods you intend to support identified

Your Paystack account must also be configured appropriately for your business and intended payment flows.

---

## Connecting Paystack

The general setup process is:

```text
Create / Configure Paystack Account
              ↓
      Obtain Credentials
              ↓
      Connect to SolydFlow
              ↓
     Configure Products
              ↓
     Configure Packages
              ↓
       Configure Webhooks
              ↓
              Test
              ↓
          Go Live
```

The exact configuration fields depend on the current SolydFlow Paystack integration.

---

## Paystack Credentials

Paystack integrations require credentials to authenticate requests.

Treat secret credentials as sensitive information.

```text
❌ Do not expose secret credentials
   in frontend application code.

✅ Keep secret credentials
   in protected configuration.
```

Configure provider credentials through the supported SolydFlow provider configuration mechanism.

See:

**[API Keys →](../security/api-keys.md)**

**[Credential Security →](../security/credential-security.md)**

---

## Products and Packages

Your product structure should remain in SolydFlow rather than being duplicated inside your Paystack-specific application logic.

For example:

```text
Product
└── Pro
    ├── Monthly
    └── Annual
```

The package defines what the customer is purchasing.

Paystack processes the corresponding payment.

See:

**[Products →](../concepts/products.md)**

**[Packages →](../concepts/packages.md)**

**[Products and Packages →](../monetization/products-and-packages.md)**

---

## Paystack and Paywalls

The customer typically encounters your application's paywall before the payment is processed.

```text
Customer
   ↓
Application
   ↓
SolydFlow Paywall
   ↓
Package
   ↓
Paystack
   ↓
Payment
```

The paywall communicates the configured product, package, and price.

Paystack then handles the payment operation.

See:

**[Paywalls →](../concepts/paywalls.md)**

---

## Paystack Webhooks

Paystack can send webhook events to communicate changes related to payment activity.

Conceptually:

```text
Paystack
   ↓
Webhook Event
   ↓
SolydFlow
   ↓
Transaction Processing
```

Webhook events are an important part of keeping the revenue lifecycle synchronized.

A successful payment may occur independently of your application's immediate request lifecycle.

For example:

```text
Customer
   ↓
Payment
   ↓
Paystack
   ↓
Webhook
   ↓
SolydFlow
```

See:

**[Provider Webhooks →](../webhooks/provider-webhooks.md)**

---

## Missing Paystack Webhooks

A payment can succeed even when the expected webhook is not received by the application.

For example:

```text
Customer
   ↓
Paystack
   ↓
Payment Successful
   ↓
Webhook
   X
```

The payment outcome and webhook delivery are separate events.

SolydFlow's recovery and truth layers are designed to help handle situations where the expected provider event is missing.

```text
Paystack
   ↓
Payment Successful
   ↓
Webhook Missing
   ↓
Recovery
   ↓
Verification
   ↓
Transaction State
   ↓
Entitlement
```

See:

**[Failed Webhooks →](../recover/failed-webhooks.md)**

**[Transaction Recovery →](../recover/transaction-recovery.md)**

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Paystack Transaction State

Paystack has its own representation of transaction state.

SolydFlow also maintains an application-facing transaction lifecycle.

These states may not always update simultaneously.

For example:

```text
Paystack
└── Successful

SolydFlow
└── Processing
```

SolydFlow can use provider information and transaction events to determine the appropriate state for the application.

```text
Paystack State
      +
SolydFlow State
      ↓
Transaction Truth
```

See:

**[Transaction States →](../concepts/transaction-states.md)**

**[State Mismatches →](../truth/state-mismatches.md)**

---

## Paystack and Transaction Recovery

Consider this scenario:

```text
Application
    ↓
Purchase Started
    ↓
Paystack
    ↓
Payment Completed
    ↓
Webhook Missing
```

Without a recovery layer, the application may continue to believe that the transaction is incomplete.

SolydFlow can provide the recovery layer around the provider transaction:

```text
Transaction
    ↓
Recovery
    ↓
Provider Verification
    ↓
Resolved State
    ↓
Entitlement
```

This means your applications do not need to independently implement the same provider-specific recovery logic.

See:

**[Recover →](../recover/overview.md)**

---

## Paystack and the Transaction Ledger

Paystack provides provider-side transaction information.

SolydFlow can maintain a unified transaction record for the application.

```text
Paystack
   ↓
Provider Transaction
   ↓
SolydFlow
   ↓
SolydFlow Transaction
   ↓
Unified Revenue Record
```

This becomes increasingly valuable when the same application uses more than one payment provider.

```text
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      Paystack     Stripe     Flutterwave
          │           │           │
          └───────────┼───────────┘
                      ↓
                Unified Ledger
```

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

**[Reconciliation →](../truth/reconciliation.md)**

---

## Using Paystack Alongside Other Providers

SolydFlow is designed to allow your revenue architecture to support multiple providers.

For example:

```text
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      Paystack     Stripe     Flutterwave
          │           │           │
       Nigeria       US          Ghana
```

This can be useful when your application serves multiple markets.

The provider can be selected based on your business requirements, market, payment method, and configured routing rules.

See:

**[Smart Routing →](../enforce/smart-routing.md)**

---

## Paystack and Regional Payments

For applications serving African customers, payment methods can differ between markets.

A possible architecture could look like:

```text
Nigeria
   ↓
Paystack
   ↓
Supported Nigerian Payment Methods
```

while another market may use a different provider:

```text
Kenya
   ↓
M-Pesa
   ↓
Local Payment Methods
```

SolydFlow provides a common revenue layer above these provider differences.

See:

**[Regional Pricing →](../monetization/regional-pricing.md)**

**[Local Payments →](../global-commerce/local-payments.md)**

---

## Paystack Failover

If your project has multiple providers configured, Paystack can participate in a resilient provider architecture where supported.

Conceptually:

```text
Payment Request
      ↓
   SolydFlow
      ↓
 Preferred Provider
      ↓
   Unavailable
      ↓
Alternative Provider
```

Provider failover must be designed carefully.

A delayed provider response should not automatically result in a second payment attempt if the first payment may already have succeeded.

Transaction verification is therefore important when implementing resilient payment flows.

See:

**[Provider Failover →](../enforce/provider-failover.md)**

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Testing Paystack

Use Paystack's supported test environment before processing live payments.

A typical testing flow is:

```text
Development
    ↓
Paystack Test Environment
    ↓
SolydFlow Sandbox
    ↓
Test Transaction
    ↓
Webhook Test
    ↓
Failure / Recovery Test
    ↓
Production
```

Test at least:

* Successful payments
* Failed payments
* Pending payments
* Webhook delivery
* Missing webhooks
* Provider errors
* Transaction recovery
* Transaction verification
* Entitlement updates

See:

**[Test Transactions →](../sandbox/test-transactions.md)**

**[Simulate Failures →](../sandbox/simulate-failures.md)**

**[Testing Recovery →](../sandbox/testing-recovery.md)**

---

## Production Checklist

Before using Paystack for live transactions, verify:

### Paystack

* Your Paystack account is configured for your business
* Production credentials are being used
* The intended payment methods are enabled
* The required currencies are supported
* Provider webhook configuration is correct

### SolydFlow

* Paystack is connected to the correct project
* Products are configured correctly
* Packages are configured correctly
* Prices are correct
* Paywalls display the intended offering
* Webhook processing is configured
* Recovery has been tested
* Entitlements behave correctly

### Security

* Secret credentials are protected
* Webhook signatures are verified
* Production secrets are not exposed to clients
* Access to provider configuration is restricted

See:

**[Production Checklist →](../production/production-checklist.md)**

---

## Refunds and Payment Changes

Paystack supports payment operations according to its current capabilities and your account configuration.

When a provider-side payment changes after the original transaction, the application-facing revenue state may also need to change.

Conceptually:

```text
Paystack Event
      ↓
SolydFlow
      ↓
Transaction State
      ↓
Entitlement / Access
```

Do not assume that the original payment event is the only event that can affect the customer's revenue lifecycle.

---

## Compliance

Paystack remains responsible for the provider-side requirements associated with its payment infrastructure.

However, using Paystack does not automatically remove all compliance responsibilities from your business.

Depending on your business model and target markets, you may need to consider:

* Taxes
* Consumer protection
* Data protection
* Business registration
* Payment regulations
* Local requirements

See:

**[Compliance →](../security/compliance.md)**

**[Tax and Compliance →](../global-commerce/tax-and-compliance.md)**

---

## Troubleshooting

When a Paystack payment does not produce the expected result, trace the complete flow.

```text
Customer
   ↓
Paywall
   ↓
Purchase
   ↓
Paystack
   ↓
Webhook
   ↓
SolydFlow
   ↓
Transaction
   ↓
Entitlement
```

Check:

1. Did the customer initiate the purchase?
2. Did Paystack receive the payment request?
3. What state does Paystack report?
4. Was the expected webhook generated?
5. Did SolydFlow receive the webhook?
6. What transaction state does SolydFlow show?
7. Was the transaction verified?
8. Was the entitlement granted?

See:

**[Troubleshooting →](../troubleshooting/overview.md)**

---

## Key Principle

> **Paystack processes the payment. SolydFlow manages the revenue flow around the payment.**

Your application should not need to duplicate Paystack-specific payment, webhook, recovery, and transaction logic throughout its codebase.

```text
Your Application
       ↓
   SolydFlow
       ↓
   Paystack
       ↓
    Payment
       ↓
  Transaction
       ↓
  Entitlement
       ↓
Application Access
```

This allows Paystack to remain the payment processor while SolydFlow provides a consistent revenue infrastructure for your application.

<!-- ---

## Next Steps

If you also need another provider, continue with:

**[Flutterwave →](./flutterwave.md)**

Or return to the complete provider list:

**[Payment Providers Overview →](./overview.md)** -->