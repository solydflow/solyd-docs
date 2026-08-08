# M-Pesa

M-Pesa can be connected to SolydFlow to support mobile-money payments in supported markets.

With M-Pesa connected, SolydFlow provides the revenue infrastructure around the payment flow while your application works with a consistent revenue layer.

```text
Your Application
       ↓
   SolydFlow
       ↓
     M-Pesa
       ↓
Mobile Money Network
```

M-Pesa remains responsible for the underlying mobile-money payment operation. SolydFlow manages the application-facing revenue flow around the transaction.

---

## When to Use M-Pesa

M-Pesa is particularly useful when your application serves customers in markets where M-Pesa is a commonly used payment method.

For example:

```text id="a8q4nm"
Application
    ↓
SolydFlow
    ↓
M-Pesa
    ↓
Customer Mobile Money Account
```

M-Pesa can also be used alongside other payment providers in the same SolydFlow project.

```text id="m5z8cp"
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       M-Pesa      Paystack    Flutterwave
          │           │           │
       Kenya       Nigeria      Other Markets
```

The appropriate provider depends on your target market, payment methods, currencies, and business requirements.

---

## How M-Pesa Fits Into SolydFlow

The integration follows the standard SolydFlow provider architecture.

```text id="q7x3mk"
                 SolydFlow
                     │
              M-Pesa Connection
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Payment Flow          Provider Events
          │                     │
          ↓                     ↓
       M-Pesa               SolydFlow
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

## What M-Pesa Handles

M-Pesa handles the underlying mobile-money payment operation.

Depending on the market and integration being used, this can include:

* Mobile-money payment initiation
* Customer authorization
* Payment processing
* Provider-side transaction state
* Payment confirmation
* Provider-side transaction records
* Provider callbacks or events

The exact capabilities depend on the M-Pesa service and market being used.

Always verify the current provider requirements and supported capabilities before using an M-Pesa integration in production.

---

## What SolydFlow Handles

SolydFlow sits above the provider layer and manages the application-facing revenue lifecycle.

This can include:

* Connecting the provider to your project
* Associating payments with products and packages
* Tracking transactions
* Processing provider events
* Recovering transactions when expected events are missing
* Verifying transaction state
* Maintaining a unified transaction view
* Managing entitlements
* Supporting routing and failover where configured

```text id="k4v9xs"
M-Pesa Payment
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

Before connecting M-Pesa to SolydFlow, you should have:

1. An account with the relevant M-Pesa service
2. The required provider credentials
3. A SolydFlow project
4. Products configured in SolydFlow
5. Packages and prices configured
6. The target market identified
7. The required M-Pesa payment capabilities enabled

The exact requirements depend on the M-Pesa integration and market.

---

## Connecting M-Pesa

The general setup flow is:

```text id="z5w2nr"
Configure M-Pesa Account
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

The exact configuration fields depend on the current SolydFlow M-Pesa integration.

---

## M-Pesa Credentials

M-Pesa integrations require credentials to authenticate requests.

Treat secret credentials as sensitive information.

```text id="f7k3qp"
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

```text id="b9x4kw"
Product
└── Premium
    ├── Monthly
    └── Annual
```

The package defines what the customer is purchasing.

M-Pesa processes the corresponding payment.

See:

**[Products →](../concepts/products.md)**

**[Packages →](../concepts/packages.md)**

**[Products and Packages →](../monetization/products-and-packages.md)**

---

## M-Pesa and Paywalls

The customer typically encounters your application's paywall before the payment begins.

```text id="t3q8mv"
Customer
   ↓
Application
   ↓
SolydFlow Paywall
   ↓
Package
   ↓
M-Pesa
   ↓
Mobile Money Payment
```

The paywall communicates the configured product, package, and price.

M-Pesa then handles the payment operation.

See:

**[Paywalls →](../concepts/paywalls.md)**

---

## Mobile-Money Payment Flow

Unlike a card payment, a mobile-money payment may involve additional customer interaction before the transaction is completed.

A conceptual flow is:

```text id="r6n2xp"
Customer
   ↓
Selects Package
   ↓
SolydFlow
   ↓
M-Pesa
   ↓
Customer Authorization
   ↓
Payment Processing
   ↓
Provider Confirmation
   ↓
SolydFlow
   ↓
Transaction State
```

The exact interaction depends on the M-Pesa service and payment method being used.

---

## Asynchronous Payment State

Mobile-money payments may not always resolve immediately.

For example:

```text id="y4m8qs"
Payment Started
      ↓
Customer Authorization
      ↓
Processing
      ↓
Provider Confirmation
      ↓
Successful
```

During this period, your application should not assume that a transaction has failed simply because the final provider confirmation has not yet arrived.

SolydFlow's transaction lifecycle is designed to represent these intermediate states.

See:

**[Transaction States →](../concepts/transaction-states.md)**

---

## Provider Events

M-Pesa integrations may use provider callbacks or other event mechanisms to communicate payment results.

Conceptually:

```text id="n8v3cz"
M-Pesa
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

```text id="x7k2mq"
Customer
   ↓
M-Pesa
   ↓
Payment Successful
   ↓
Provider Event
   X
```

This creates a potentially inconsistent state:

```text id="p4w9nz"
M-Pesa
└── Successful

Application
└── Pending
```

SolydFlow can use its recovery and verification mechanisms to help resolve this situation.

```text id="c6r3yv"
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

## M-Pesa Transaction State

The M-Pesa provider has its own representation of payment state.

SolydFlow maintains an application-facing transaction lifecycle.

These states may not update simultaneously.

For example:

```text id="v5q8km"
M-Pesa
└── Processing

SolydFlow
└── Pending
```

Later:

```text id="d9x3rp"
M-Pesa
└── Successful

SolydFlow
└── Successful
```

SolydFlow can use provider information and transaction events to determine the appropriate application-facing state.

See:

**[Transaction States →](../concepts/transaction-states.md)**

**[State Mismatches →](../truth/state-mismatches.md)**

---

## M-Pesa and Transaction Recovery

Consider a payment where the customer completed authorization but the expected confirmation was not received.

```text id="q2m7sx"
Customer
   ↓
M-Pesa
   ↓
Authorization
   ↓
Payment Completed
   ↓
Confirmation Missing
```

Without recovery, the application may leave the customer's purchase unresolved.

SolydFlow can provide the recovery layer:

```text id="n6x4vp"
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

## M-Pesa and the Transaction Ledger

M-Pesa provides provider-side transaction information.

SolydFlow can maintain a unified transaction record around the application revenue lifecycle.

```text id="k8p3my"
M-Pesa
   ↓
Provider Transaction
   ↓
SolydFlow
   ↓
SolydFlow Transaction
   ↓
Unified Revenue Record
```

This is particularly useful when your application uses different providers for different markets.

```text id="u4w7nc"
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       M-Pesa      Paystack    Flutterwave
          │           │           │
       Kenya       Nigeria      Other Markets
          └───────────┼───────────┘
                      ↓
                Unified Ledger
```

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

**[Reconciliation →](../truth/reconciliation.md)**

---

## Using M-Pesa Alongside Other Providers

SolydFlow allows your revenue architecture to support multiple payment providers.

For example:

```text id="m9x2ck"
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       M-Pesa      Paystack     Stripe
          │           │           │
       Kenya       Nigeria        US
```

This allows the provider layer to reflect the markets your application serves.

The application can continue using the SolydFlow revenue layer rather than implementing separate transaction models for every provider.

---

## M-Pesa and Regional Pricing

Payment providers may support different currencies and payment methods across different markets.

Your pricing model should therefore be designed independently from the provider implementation.

For example:

```text id="z3q7mv"
Product
   ↓
Regional Package
   ↓
Market-specific Price
   ↓
M-Pesa
```

This allows your application to maintain a consistent product structure while adapting the commercial offering to the target market.

See:

**[Regional Pricing →](../monetization/regional-pricing.md)**

**[Multi-Currency →](../global-commerce/multi-currency.md)**

---

## M-Pesa Failover

If multiple payment providers are configured, M-Pesa may participate in a resilient provider architecture where supported.

Conceptually:

```text id="f8r4qx"
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

A delayed M-Pesa response does not necessarily mean that the payment failed.

A second payment attempt should therefore not be triggered blindly.

Transaction verification is important when implementing resilient payment flows.

See:

**[Provider Failover →](../enforce/provider-failover.md)**

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Testing M-Pesa

Use the supported M-Pesa test environment before processing live payments.

A typical testing flow is:

```text id="c5n8wr"
Development
    ↓
M-Pesa Test Environment
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
* Customer authorization
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

Before using M-Pesa for live transactions, verify:

### M-Pesa

* Your M-Pesa account is configured for your business
* Production credentials are being used
* The intended market is supported
* The intended payment method is enabled
* Required currencies are supported
* Provider callback/event configuration is correct

### SolydFlow

* M-Pesa is connected to the correct project
* Products are configured correctly
* Packages are configured correctly
* Prices are correct
* Paywalls display the intended offering
* Provider events are being processed
* Recovery has been tested
* Entitlements behave correctly

### Security

* Secret credentials are protected
* Provider callbacks are verified where supported
* Production secrets are not exposed to clients
* Access to provider configuration is restricted

See:

**[Production Checklist →](../production/production-checklist.md)**

---

## Refunds and Payment Changes

Payment operations such as refunds, reversals, or other post-payment changes depend on the capabilities of the specific M-Pesa integration and market.

When the provider reports a payment change, the application-facing revenue state may also need to change.

Conceptually:

```text id="w7q3mx"
M-Pesa Event
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

M-Pesa remains responsible for the provider-side requirements associated with its payment infrastructure.

However, connecting M-Pesa does not automatically remove the compliance responsibilities applicable to your business.

Depending on your business model and market, you may need to consider:

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

When an M-Pesa payment does not produce the expected result, trace the complete flow.

```text id="r5k8vq"
Customer
   ↓
Paywall
   ↓
Purchase
   ↓
M-Pesa
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
2. Did the M-Pesa payment request start successfully?
3. Did the customer complete the required authorization?
4. What state does the provider report?
5. Was the expected provider event generated?
6. Did SolydFlow receive the event?
7. What transaction state does SolydFlow show?
8. Was the transaction verified?
9. Was the entitlement granted?

See:

**[Troubleshooting →](../troubleshooting/overview.md)**

---

## Key Principle

> **M-Pesa processes the mobile-money payment. SolydFlow manages the revenue flow around the payment.**

Your application should not need to duplicate provider-specific payment, event handling, recovery, and transaction logic throughout its codebase.

```text id="x9m4kp"
Your Application
       ↓
   SolydFlow
       ↓
     M-Pesa
       ↓
 Mobile Money
       ↓
  Transaction
       ↓
  Entitlement
       ↓
Application Access
```

This allows M-Pesa to remain the payment infrastructure while SolydFlow provides a consistent revenue layer for your application.

<!-- ---

## Next Steps

For another African payment provider, continue with:

**[Monnify →](./monnify.md)**

Or return to the complete provider list:

**[Payment Providers Overview →](./overview.md)** -->

