# Flutterwave

Flutterwave can be connected to SolydFlow to process payments for customers in supported African markets and other supported regions.

With Flutterwave connected, SolydFlow provides the revenue infrastructure around Flutterwave transactions while your application works with a consistent revenue layer.

```text
Your Application
       ↓
   SolydFlow
       ↓
 Flutterwave
       ↓
Payment Network
```

Flutterwave remains responsible for processing the payment. SolydFlow manages the application-facing revenue flow around that payment.

---

## When to Use Flutterwave

Flutterwave can be useful when your application serves customers across African markets and needs access to the payment methods and currencies supported by Flutterwave.

For example:

```text id="5t8z3x"
Application
    ↓
SolydFlow
    ↓
Flutterwave
    ↓
Customers
```

Flutterwave can also operate alongside other providers in the same SolydFlow project.

```text id="v4r9mz"
                 SolydFlow
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
     Flutterwave   Paystack   Stripe
          │          │          │
       Africa     Africa      Global
```

The appropriate provider depends on your target market, payment methods, currencies, and business requirements.

---

## How Flutterwave Fits Into SolydFlow

The integration follows the standard SolydFlow provider architecture.

```text id="9v2j7k"
                 SolydFlow
                     │
            Flutterwave Connection
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Payment Flow          Webhooks
          │                     │
          ↓                     ↓
     Flutterwave            SolydFlow
          │                     │
          └──────────┬──────────┘
                     ↓
                Transaction
                     ↓
                 Entitlement
                     ↓
              Application Access
```

Your application does not need to implement Flutterwave-specific revenue logic throughout its codebase.

---

## What Flutterwave Handles

Flutterwave handles the provider-side payment operation.

Depending on the payment method, country, and account configuration, this can include:

* Payment processing
* Supported payment methods
* Payment authorization
* Provider-side transaction state
* Provider-side payment records
* Provider webhooks
* Refund-related operations supported by Flutterwave

Flutterwave's supported markets, payment methods, currencies, and capabilities can change.

Always verify the provider's current capabilities before relying on a specific feature in production.

---

## What SolydFlow Handles

SolydFlow sits above Flutterwave and manages the revenue infrastructure around the provider transaction.

This can include:

* Connecting Flutterwave to your project
* Associating payments with your products and packages
* Tracking transactions
* Processing provider events
* Recovering transactions when expected events are missing
* Verifying transaction state
* Maintaining a unified transaction view
* Managing entitlements
* Supporting routing and failover where configured

```text id="k7v2da"
Flutterwave Payment
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

Before connecting Flutterwave to SolydFlow, you should have:

1. A Flutterwave account
2. The required Flutterwave credentials
3. A SolydFlow project
4. Products configured in SolydFlow
5. Packages and prices configured
6. The markets and payment methods you intend to support identified

Your Flutterwave account must also be configured appropriately for your business and intended payment flows.

---

## Connecting Flutterwave

The general setup process is:

```text id="e9b5p2"
Create / Configure Flutterwave Account
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

The exact configuration fields depend on the current SolydFlow Flutterwave integration.

---

## Flutterwave Credentials

Flutterwave integrations require credentials to authenticate requests.

Treat secret credentials as sensitive information.

```text id="v5n8q3"
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

Your product structure should remain in SolydFlow rather than being duplicated inside Flutterwave-specific application logic.

For example:

```text id="k8y1rw"
Product
└── Pro
    ├── Monthly
    └── Annual
```

The package defines what the customer is purchasing.

Flutterwave processes the corresponding payment.

See:

**[Products →](../concepts/products.md)**

**[Packages →](../concepts/packages.md)**

**[Products and Packages →](../monetization/products-and-packages.md)**

---

## Flutterwave and Paywalls

The customer typically encounters your application's paywall before the payment is processed.

```text id="q6m3jx"
Customer
   ↓
Application
   ↓
SolydFlow Paywall
   ↓
Package
   ↓
Flutterwave
   ↓
Payment
```

The paywall communicates the configured product, package, and price.

Flutterwave then handles the payment operation.

See:

**[Paywalls →](../concepts/paywalls.md)**

---

## Flutterwave Webhooks

Flutterwave can send webhook events to communicate changes related to payment activity.

Conceptually:

```text id="h5x7cs"
Flutterwave
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

```text id="j3k9wp"
Customer
   ↓
Payment
   ↓
Flutterwave
   ↓
Webhook
   ↓
SolydFlow
```

See:

**[Provider Webhooks →](../webhooks/provider-webhooks.md)**

---

## Missing Flutterwave Webhooks

A payment can succeed even when the expected webhook is not received by the application.

For example:

```text id="x4k7vq"
Customer
   ↓
Flutterwave
   ↓
Payment Successful
   ↓
Webhook
   X
```

The payment outcome and webhook delivery are separate events.

SolydFlow's recovery and truth layers are designed to help handle situations where the expected provider event is missing.

```text id="u8s2hn"
Flutterwave
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

## Flutterwave Transaction State

Flutterwave has its own representation of transaction state.

SolydFlow also maintains an application-facing transaction lifecycle.

These states may not always update simultaneously.

For example:

```text id="n7v4tc"
Flutterwave
└── Successful

SolydFlow
└── Processing
```

SolydFlow can use provider information and transaction events to determine the appropriate state for the application.

```text id="p5m8qd"
Flutterwave State
       +
SolydFlow State
       ↓
Transaction Truth
```

See:

**[Transaction States →](../concepts/transaction-states.md)**

**[State Mismatches →](../truth/state-mismatches.md)**

---

## Flutterwave and Transaction Recovery

Consider this scenario:

```text id="r3x8km"
Application
    ↓
Purchase Started
    ↓
Flutterwave
    ↓
Payment Completed
    ↓
Webhook Missing
```

Without a recovery layer, the application may continue to believe that the transaction is incomplete.

SolydFlow can provide the recovery layer around the provider transaction:

```text id="b7n2cx"
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

## Flutterwave and the Transaction Ledger

Flutterwave provides provider-side transaction information.

SolydFlow can maintain a unified transaction record for the application.

```text id="w6f9ks"
Flutterwave
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

```text id="m2x7pa"
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
     Flutterwave   Paystack     Stripe
          │           │           │
          └───────────┼───────────┘
                      ↓
                Unified Ledger
```

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

**[Reconciliation →](../truth/reconciliation.md)**

---

## Using Flutterwave Alongside Other Providers

SolydFlow is designed to allow your revenue architecture to support multiple providers.

For example:

```text id="y8q3lr"
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
     Flutterwave   Paystack     Stripe
          │           │           │
       Ghana       Nigeria        US
```

This can be useful when your application serves multiple markets.

The provider can be selected based on your business requirements, market, payment method, and configured routing rules.

See:

**[Smart Routing →](../enforce/smart-routing.md)**

---

## Flutterwave and Regional Payments

For applications serving African customers, payment methods can differ between markets.

A possible architecture could look like:

```text id="u3v7mh"
Market
   ↓
Flutterwave
   ↓
Supported Local Payment Methods
```

Another market may use a different provider:

```text id="t5x8qp"
Another Market
   ↓
Paystack / M-Pesa / Other Provider
   ↓
Local Payment Methods
```

SolydFlow provides a common revenue layer above these provider differences.

See:

**[Regional Pricing →](../monetization/regional-pricing.md)**

**[Local Payments →](../global-commerce/local-payments.md)**

---

## Flutterwave Failover

If your project has multiple providers configured, Flutterwave can participate in a resilient provider architecture where supported.

Conceptually:

```text id="p9k4cs"
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

## Testing Flutterwave

Use Flutterwave's supported test environment before processing live payments.

A typical testing flow is:

```text id="c7w3zn"
Development
    ↓
Flutterwave Test Environment
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

Before using Flutterwave for live transactions, verify:

### Flutterwave

* Your Flutterwave account is configured for your business
* Production credentials are being used
* The intended payment methods are enabled
* The required currencies are supported
* Provider webhook configuration is correct

### SolydFlow

* Flutterwave is connected to the correct project
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

Flutterwave supports payment operations according to its current capabilities and your account configuration.

When a provider-side payment changes after the original transaction, the application-facing revenue state may also need to change.

Conceptually:

```text id="w4y8pq"
Flutterwave Event
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

Flutterwave remains responsible for the provider-side requirements associated with its payment infrastructure.

However, using Flutterwave does not automatically remove all compliance responsibilities from your business.

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

When a Flutterwave payment does not produce the expected result, trace the complete flow.

```text id="z8m4rk"
Customer
   ↓
Paywall
   ↓
Purchase
   ↓
Flutterwave
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
2. Did Flutterwave receive the payment request?
3. What state does Flutterwave report?
4. Was the expected webhook generated?
5. Did SolydFlow receive the webhook?
6. What transaction state does SolydFlow show?
7. Was the transaction verified?
8. Was the entitlement granted?

See:

**[Troubleshooting →](../troubleshooting/overview.md)**

---

## Key Principle

> **Flutterwave processes the payment. SolydFlow manages the revenue flow around the payment.**

Your application should not need to duplicate Flutterwave-specific payment, webhook, recovery, and transaction logic throughout its codebase.

```text id="h9x3vm"
Your Application
       ↓
   SolydFlow
       ↓
 Flutterwave
       ↓
    Payment
       ↓
  Transaction
       ↓
  Entitlement
       ↓
Application Access
```

This allows Flutterwave to remain the payment processor while SolydFlow provides a consistent revenue infrastructure for your application.

<!-- ---

## Next Steps

If you need mobile-money payment infrastructure for supported markets, continue with:

**[M-Pesa →](./mpesa.md)**

Or return to the complete provider list:

**[Payment Providers Overview →](./overview.md)** -->