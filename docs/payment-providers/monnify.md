# Monnify

Monnify can be connected to SolydFlow to support payment collection for applications serving customers in supported African markets.

With Monnify connected, SolydFlow provides the revenue infrastructure around Monnify transactions while your application works with a consistent revenue layer.

```text
Your Application
       ↓
   SolydFlow
       ↓
    Monnify
       ↓
Payment Network
```

Monnify remains responsible for the underlying payment operation. SolydFlow manages the application-facing revenue flow around the transaction.

---

## When to Use Monnify

Monnify can be useful when your application serves customers in markets supported by Monnify and needs access to the payment methods and collection capabilities it provides.

For example:

```text
Application
    ↓
SolydFlow
    ↓
Monnify
    ↓
Customer
```

Monnify can also operate alongside other payment providers in the same SolydFlow project.

```text
                 SolydFlow
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Monnify    Paystack   Flutterwave
          │          │          │
       Nigeria    Nigeria    Other Markets
```

The appropriate provider depends on your target market, payment methods, currencies, and business requirements.

---

## How Monnify Fits Into SolydFlow

The integration follows the standard SolydFlow provider architecture.

```text
                 SolydFlow
                     │
             Monnify Connection
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Payment Flow          Provider Events
          │                     │
          ↓                     ↓
       Monnify              SolydFlow
          │                     │
          └──────────┬──────────┘
                     ↓
                Transaction
                     ↓
                 Entitlement
                     ↓
              Application Access
```

Your application can therefore work with the SolydFlow transaction lifecycle without implementing every provider-specific payment operation itself.

---

## What Monnify Handles

Monnify handles the provider-side payment and collection operations supported by its platform.

Depending on the configured payment method and account, this can include:

* Payment collection
* Supported payment methods
* Payment authorization
* Provider-side transaction processing
* Provider-side transaction records
* Payment notifications or events
* Other collection capabilities supported by Monnify

Provider capabilities can change over time.

Always verify the current Monnify capabilities and requirements before relying on a specific feature in production.

---

## What SolydFlow Handles

SolydFlow sits above the provider layer and manages the application-facing revenue lifecycle.

This can include:

* Connecting Monnify to your project
* Associating payments with products and packages
* Tracking transactions
* Processing provider events
* Recovering transactions when expected events are missing
* Verifying transaction state
* Maintaining a unified transaction view
* Managing entitlements
* Supporting routing and failover where configured

```text
Monnify Payment
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

Before connecting Monnify to SolydFlow, you should have:

1. A Monnify account
2. The required Monnify credentials
3. A SolydFlow project
4. Products configured in SolydFlow
5. Packages and prices configured
6. The markets and payment methods you intend to support identified

Your Monnify account must also be configured appropriately for your business and intended payment flows.

---

## Connecting Monnify

The general setup flow is:

```text
Configure Monnify Account
          ↓
    Obtain Credentials
          ↓
    Connect to SolydFlow
          ↓
   Configure Products
          ↓
   Configure Packages
          ↓
 Configure Provider Events
          ↓
          Test
          ↓
       Go Live
```

The exact configuration fields depend on the current SolydFlow Monnify integration.

---

## Monnify Credentials

Monnify integrations require credentials to authenticate requests.

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

Your commercial model should remain defined in SolydFlow.

For example:

```text
Product
└── Premium
    ├── Monthly
    └── Annual
```

The package defines what the customer is purchasing.

Monnify processes the corresponding payment.

See:

**[Products →](../concepts/products.md)**

**[Packages →](../concepts/packages.md)**

**[Products and Packages →](../monetization/products-and-packages.md)**

---

## Monnify and Paywalls

The customer typically encounters your application's paywall before the payment begins.

```text
Customer
   ↓
Application
   ↓
SolydFlow Paywall
   ↓
Package
   ↓
Monnify
   ↓
Payment
```

The paywall communicates the configured product, package, and price.

Monnify then handles the payment operation.

See:

**[Paywalls →](../concepts/paywalls.md)**

---

## Provider Events

Monnify can communicate payment-related changes through its supported notification mechanisms.

Conceptually:

```text
Monnify
   ↓
Provider Event
   ↓
SolydFlow
   ↓
Transaction Processing
```

These events are important because the final payment state may become available after the initial payment request.

See:

**[Provider Webhooks →](../webhooks/provider-webhooks.md)**

---

## Missing Provider Events

A payment may succeed even if the expected provider event is delayed or not received.

For example:

```text
Customer
   ↓
Monnify
   ↓
Payment Successful
   ↓
Provider Event
   X
```

This can create a mismatch between the provider and application state:

```text
Monnify
└── Successful

Application
└── Pending
```

SolydFlow can use its recovery and verification mechanisms to help resolve this situation.

```text
Payment
   ↓
Expected Event Missing
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

## Monnify Transaction State

Monnify has its own representation of payment state.

SolydFlow maintains an application-facing transaction lifecycle.

These states may not update simultaneously.

For example:

```text
Monnify
└── Successful

SolydFlow
└── Processing
```

SolydFlow can use provider information and transaction events to determine the appropriate application-facing state.

```text
Monnify State
      +
SolydFlow State
      ↓
Transaction Truth
```

See:

**[Transaction States →](../concepts/transaction-states.md)**

**[State Mismatches →](../truth/state-mismatches.md)**

---

## Monnify and Transaction Recovery

Consider a payment where Monnify completes the transaction but the expected event is not received.

```text
Application
    ↓
Purchase Started
    ↓
Monnify
    ↓
Payment Completed
    ↓
Provider Event Missing
```

Without recovery, the application may leave the customer's purchase unresolved.

SolydFlow can provide the recovery layer:

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

This prevents every application from having to implement its own provider-specific recovery workflow.

See:

**[Recover →](../recover/overview.md)**

---

## Monnify and the Transaction Ledger

Monnify provides provider-side transaction information.

SolydFlow can maintain a unified transaction record around the application's revenue lifecycle.

```text
Monnify
   ↓
Provider Transaction
   ↓
SolydFlow
   ↓
SolydFlow Transaction
   ↓
Unified Revenue Record
```

This becomes particularly useful when an application uses multiple payment providers.

```text
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Monnify     Paystack    Flutterwave
          │           │           │
          └───────────┼───────────┘
                      ↓
                Unified Ledger
```

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

**[Reconciliation →](../truth/reconciliation.md)**

---

## Using Monnify Alongside Other Providers

SolydFlow allows your revenue architecture to support multiple payment providers.

For example:

```text
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Monnify     Paystack     Stripe
          │           │           │
       Nigeria      Nigeria        US
```

The application can continue using the SolydFlow revenue layer rather than implementing separate transaction models for every provider.

Provider selection can be based on your target market, payment methods, currencies, and configured routing rules.

See:

**[Smart Routing →](../enforce/smart-routing.md)**

---

## Monnify and Regional Pricing

Your pricing model should be designed independently from the payment provider implementation.

For example:

```text
Product
   ↓
Regional Package
   ↓
Market-specific Price
   ↓
Monnify
```

This allows your application to maintain a consistent product structure while adapting the commercial offering to the target market.

See:

**[Regional Pricing →](../monetization/regional-pricing.md)**

**[Multi-Currency →](../global-commerce/multi-currency.md)**

---

## Monnify Failover

If multiple payment providers are configured, Monnify may participate in a resilient provider architecture where supported.

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

Failover must be handled carefully.

A delayed Monnify response does not necessarily mean that the payment failed.

A second payment attempt should therefore not be triggered blindly.

Transaction verification is important when implementing resilient payment flows.

See:

**[Provider Failover →](../enforce/provider-failover.md)**

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Testing Monnify

Use Monnify's supported test environment before processing live payments.

A typical testing flow is:

```text
Development
    ↓
Monnify Test Environment
    ↓
SolydFlow Sandbox
    ↓
Test Payment
    ↓
Provider Event Test
    ↓
Failure / Recovery Test
    ↓
Production
```

Test at least:

* Successful payments
* Failed payments
* Pending payments
* Provider event delivery
* Missing provider events
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

Before using Monnify for live transactions, verify:

### Monnify

* Your Monnify account is configured for your business
* Production credentials are being used
* The intended payment methods are enabled
* Required currencies are supported
* Provider event configuration is correct

### SolydFlow

* Monnify is connected to the correct project
* Products are configured correctly
* Packages are configured correctly
* Prices are correct
* Paywalls display the intended offering
* Provider event processing is configured
* Recovery has been tested
* Entitlements behave correctly

### Security

* Secret credentials are protected
* Provider events are verified where supported
* Production secrets are not exposed to clients
* Access to provider configuration is restricted

See:

**[Production Checklist →](../production/production-checklist.md)**

---

## Refunds and Payment Changes

Payment operations such as refunds, reversals, or other post-payment changes depend on the capabilities of the Monnify integration and your account configuration.

When the provider reports a payment change, the application-facing revenue state may also need to change.

Conceptually:

```text
Monnify Event
      ↓
SolydFlow
      ↓
Transaction State
      ↓
Entitlement / Access
```

Do not assume that the initial payment event is the only event that can affect the customer's revenue lifecycle.

---

## Compliance

Monnify remains responsible for the provider-side requirements associated with its payment infrastructure.

However, connecting Monnify does not automatically remove the compliance responsibilities applicable to your business.

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

When a Monnify payment does not produce the expected result, trace the complete flow.

```text
Customer
   ↓
Paywall
   ↓
Purchase
   ↓
Monnify
   ↓
Provider Event
   ↓
SolydFlow
   ↓
Transaction
   ↓
Entitlement
```

Check:

1. Did the customer initiate the purchase?
2. Did the Monnify payment request start successfully?
3. What state does Monnify report?
4. Was the expected provider event generated?
5. Did SolydFlow receive the event?
6. What transaction state does SolydFlow show?
7. Was the transaction verified?
8. Was the entitlement granted?

See:

**[Troubleshooting →](../troubleshooting/overview.md)**

---

## Key Principle

> **Monnify processes the payment. SolydFlow manages the revenue flow around the payment.**

Your application should not need to duplicate provider-specific payment, event handling, recovery, and transaction logic throughout its codebase.

```text
Your Application
       ↓
   SolydFlow
       ↓
    Monnify
       ↓
    Payment
       ↓
  Transaction
       ↓
  Entitlement
       ↓
Application Access
```

This allows Monnify to remain the payment infrastructure while SolydFlow provides a consistent revenue layer for your application.

<!-- ---

## Next Steps

For mobile and app-store payments, continue with:

**[Apple →](./apple.md)**

Or return to the complete provider list:

**[Payment Providers Overview →](./overview.md)** -->