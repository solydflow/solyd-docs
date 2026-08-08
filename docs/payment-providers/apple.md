# Apple

Apple can be connected to SolydFlow to support in-app purchases for applications distributed through Apple's App Store.

With Apple connected, SolydFlow provides the revenue infrastructure around the purchase lifecycle while your application works with a consistent transaction and entitlement layer.

```text
Your Application
       ↓
   SolydFlow
       ↓
     Apple
       ↓
App Store / In-App Purchase
```

Apple remains responsible for processing the App Store purchase. SolydFlow manages the application-facing revenue flow around the purchase.

---

## When to Use Apple

Apple is appropriate when your application uses Apple's in-app purchase infrastructure for digital products or subscriptions distributed through the App Store.

For example:

```text
Customer
   ↓
iOS Application
   ↓
SolydFlow
   ↓
Apple In-App Purchase
   ↓
App Store
```

Apple can also operate alongside other payment providers in the same SolydFlow project.

```text
                    SolydFlow
                        │
            ┌───────────┼───────────┐
            ↓           ↓           ↓
          Apple      Paystack      Stripe
            │           │           │
        iOS App      Africa       Web App
```

This allows an application to use different payment infrastructure depending on the platform and market.

---

## How Apple Fits Into SolydFlow

The Apple integration follows the same revenue infrastructure model used across SolydFlow providers.

```text
                 SolydFlow
                     │
              Apple Connection
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Purchase Flow         Store Events
          │                     │
          ↓                     ↓
        Apple                SolydFlow
          │                     │
          └──────────┬──────────┘
                     ↓
                Transaction
                     ↓
                 Entitlement
                     ↓
              Application Access
```

The application can work with SolydFlow's transaction and entitlement model instead of implementing separate revenue logic around every provider.

---

## What Apple Handles

Apple handles the App Store-side purchase operation.

This can include:

* App Store purchase processing
* In-app purchase authorization
* Subscription billing
* App Store transaction records
* Store-side purchase state
* App Store receipts or transaction information
* Subscription-related events

The exact capabilities and requirements depend on Apple's current App Store and In-App Purchase infrastructure.

Always verify Apple's current requirements before implementing a production integration.

---

## What SolydFlow Handles

SolydFlow provides the application-facing revenue infrastructure around the Apple transaction.

This can include:

* Connecting Apple to your SolydFlow project
* Associating purchases with products and packages
* Tracking transactions
* Processing store events
* Verifying transaction information
* Recovering transactions when expected events are missing
* Maintaining a unified transaction view
* Managing entitlements
* Supporting the same revenue model across different providers

```text
Apple Purchase
      ↓
Store Transaction
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

Before connecting Apple to SolydFlow, you should have:

1. An Apple Developer account
2. An application configured for App Store distribution
3. The required App Store in-app purchase products
4. A SolydFlow project
5. Products configured in SolydFlow
6. Packages and pricing configured
7. The required Apple credentials or configuration

Apple's developer and App Store requirements must be satisfied before production purchases can be processed.

---

## Apple Product Configuration

Apple's App Store uses its own product identifiers for in-app purchases.

SolydFlow can provide an application-facing product and package structure above the provider-specific identifiers.

For example:

```text
SolydFlow Product
└── Pro
    ├── Monthly
    └── Annual

Apple
├── com.example.pro.monthly
└── com.example.pro.annual
```

This allows your application to maintain a consistent commercial model while the provider-specific identifiers remain associated with the appropriate store products.

See:

**[Products →](../concepts/products.md)**

**[Packages →](../concepts/packages.md)**

**[Products and Packages →](../monetization/products-and-packages.md)**

---

## Apple and Paywalls

The customer typically sees your application's paywall before selecting an in-app purchase.

```text
Customer
   ↓
iOS Application
   ↓
SolydFlow Paywall
   ↓
Package
   ↓
Apple In-App Purchase
   ↓
App Store
```

The paywall communicates the product and package available to the customer.

Apple then presents and processes the store purchase.

See:

**[Paywalls →](../concepts/paywalls.md)**

---

## Apple Transaction Flow

A typical purchase lifecycle can be represented as:

```text
Customer
   ↓
Select Package
   ↓
Application
   ↓
Apple In-App Purchase
   ↓
Store Authorization
   ↓
Transaction
   ↓
SolydFlow
   ↓
Verification
   ↓
Entitlement
   ↓
Application Access
```

The transaction and entitlement should not be treated as permanently equivalent simply because a purchase was initially successful.

Later store events can change the customer's entitlement state.

---

## Apple and Asynchronous Events

Store transactions can have lifecycle events that occur after the initial purchase.

For example:

```text
Purchase
   ↓
Successful
   ↓
Subscription Active
   ↓
Later Store Event
   ↓
Subscription State Changes
```

SolydFlow therefore needs to account for the transaction lifecycle rather than treating the initial purchase as the end of the process.

Conceptually:

```text
Apple
  ↓
Store Event
  ↓
SolydFlow
  ↓
Transaction State
  ↓
Entitlement
```

See:

**[Provider Webhooks →](../webhooks/provider-webhooks.md)**

**[Event Handling →](../webhooks/event-handling.md)**

---

## Transaction Verification

Store transactions should be verified before the application grants durable access to paid functionality.

Conceptually:

```text
Apple Transaction
       ↓
Verification
       ↓
SolydFlow
       ↓
Transaction State
       ↓
Entitlement
```

Verification helps ensure that the application is responding to a valid transaction rather than trusting an unverified client-side state.

See:

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Missing Store Events

A transaction can exist on the provider side while the expected event is delayed or unavailable to the application.

For example:

```text
Apple
   ↓
Purchase Successful
   ↓
Store Event
   X
```

This can produce a mismatch:

```text
Apple
└── Purchased

Application
└── Pending
```

SolydFlow's recovery and verification layers can help resolve these situations.

```text
Store Transaction
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

---

## Apple Transaction State

Apple has its own transaction and subscription state.

SolydFlow maintains an application-facing transaction lifecycle.

These states may not always change at exactly the same time.

For example:

```text
Apple
└── Transaction Exists

SolydFlow
└── Verification Pending
```

After verification:

```text
Apple
└── Valid Transaction

SolydFlow
└── Successful
```

SolydFlow can use provider information, transaction verification, and store events to determine the appropriate application-facing state.

See:

**[Transaction States →](../concepts/transaction-states.md)**

**[State Mismatches →](../truth/state-mismatches.md)**

---

## Apple and Entitlements

The most important application-facing result of an in-app purchase is often the entitlement it grants.

For example:

```text
Apple Purchase
      ↓
Transaction
      ↓
Verification
      ↓
Package
      ↓
Entitlement
      ↓
Premium Access
```

This separates the store transaction from the application's access-control decision.

If the customer has a valid entitlement, the application can grant the corresponding access.

See:

**[Entitlements →](../concepts/entitlements.md)**

---

## Apple Subscriptions

Subscriptions introduce additional lifecycle events beyond the initial purchase.

Conceptually:

```text
Purchase
   ↓
Active
   ↓
Renewal
   ↓
Renewed
   ↓
Renewal
   ↓
...
```

A subscription can also move into another state depending on events reported by the store.

Your application should therefore rely on the current verified transaction and entitlement state rather than assuming that the original purchase remains active forever.

---

## Apple and the Transaction Ledger

Apple provides store-side transaction information.

SolydFlow can maintain a unified transaction record for the application's revenue lifecycle.

```text
Apple
   ↓
Store Transaction
   ↓
SolydFlow
   ↓
SolydFlow Transaction
   ↓
Unified Revenue Record
```

This becomes especially useful when the same application monetizes through multiple platforms.

```text
                    SolydFlow
                        │
            ┌───────────┼───────────┐
            ↓           ↓           ↓
          Apple      Google Play   Stripe
            │           │           │
          iOS        Android        Web
            └───────────┼───────────┘
                        ↓
                  Unified Ledger
```

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

**[Reconciliation →](../truth/reconciliation.md)**

---

## Apple Alongside Other Providers

A single application may have different payment infrastructure depending on the platform.

For example:

```text
iOS
 ↓
Apple
 ↓
SolydFlow

Android
 ↓
Google Play
 ↓
SolydFlow

Web
 ↓
Stripe / Paystack / Other Provider
 ↓
SolydFlow
```

The application can still consume a consistent SolydFlow transaction and entitlement model.

This is one of the key benefits of placing SolydFlow above the provider layer.

---

## Apple and Regional Pricing

Apple manages store pricing and availability according to its App Store infrastructure and configuration.

SolydFlow's product and package model should remain conceptually separate from provider-specific pricing configuration.

For example:

```text
SolydFlow
└── Premium
    └── Monthly Package

Apple
└── App Store Product
    └── Store-specific Price
```

This allows SolydFlow to maintain the application-level commercial model while Apple handles the store-specific purchase experience.

See:

**[Regional Pricing →](../monetization/regional-pricing.md)**

**[Multi-Currency →](../global-commerce/multi-currency.md)**

---

## Apple and Recovery

Consider a transaction where the store confirms a purchase but the application does not immediately receive or process the expected event.

```text
Customer
   ↓
Apple
   ↓
Purchase Completed
   ↓
Application Event Missing
```

SolydFlow can provide a recovery and verification layer:

```text
Transaction
    ↓
Recovery
    ↓
Apple Verification
    ↓
Resolved State
    ↓
Entitlement
```

This prevents individual applications from having to build the same transaction recovery logic independently.

See:

**[Recover →](../recover/overview.md)**

---

## Apple Failover

Apple App Store purchases are platform-specific.

They should not be treated like ordinary payment-provider failover where a transaction can simply be moved from one provider to another.

For example:

```text
iOS Application
      ↓
Apple
```

should remain distinct from:

```text
Web Application
      ↓
Stripe / Paystack / Other Provider
```

SolydFlow can unify the resulting transaction and entitlement data without pretending that every provider supports the same payment flow.

This distinction is important when designing multi-provider architectures.

---

## Testing Apple Purchases

Use Apple's supported testing environments before processing live purchases.

A typical testing flow is:

```text
Development
    ↓
Apple Test Environment
    ↓
SolydFlow Sandbox
    ↓
Test Purchase
    ↓
Verification
    ↓
Store Event Test
    ↓
Recovery Test
    ↓
Production
```

Test at least:

* Successful purchases
* Failed purchases
* Pending transactions
* Transaction verification
* Subscription lifecycle events
* Store event delivery
* Missing events
* Transaction recovery
* Entitlement updates
* Restore purchase scenarios

See:

**[Test Transactions →](../sandbox/test-transactions.md)**

**[Simulate Failures →](../sandbox/simulate-failures.md)**

**[Testing Recovery →](../sandbox/testing-recovery.md)**

---

## Restore Purchases

Customers may reinstall an application, switch devices, or otherwise need their previous purchases restored.

The application should be able to retrieve and verify the customer's eligible purchases and restore the appropriate entitlement.

Conceptually:

```text
Customer
   ↓
Restore Purchases
   ↓
Apple
   ↓
Transactions
   ↓
SolydFlow
   ↓
Verification
   ↓
Entitlement Restored
```

This allows access to be restored without treating the new application installation as a completely new purchase history.

---

## Production Checklist

Before using Apple for live in-app purchases, verify:

### Apple

* The App Store application is configured correctly
* In-app purchase products are configured
* Product identifiers match the intended packages
* Production credentials/configuration are being used
* Store event configuration is correct
* Required agreements and App Store requirements are satisfied

### SolydFlow

* Apple is connected to the correct project
* Products are configured correctly
* Packages are mapped correctly
* Store product identifiers are configured correctly
* Paywalls display the intended offerings
* Transaction verification is working
* Store events are processed
* Recovery has been tested
* Entitlements behave correctly

### Security

* Secret credentials are protected
* Store transaction information is validated
* Production secrets are not exposed to clients
* Access to provider configuration is restricted

See:

**[Production Checklist →](../production/production-checklist.md)**

---

## Refunds and Subscription Changes

An App Store transaction can change after the original purchase.

For example:

```text
Purchase
   ↓
Active
   ↓
Store Event
   ↓
Subscription / Transaction State Changes
   ↓
SolydFlow
   ↓
Entitlement Update
```

The application should therefore respond to the current verified transaction and entitlement state rather than permanently granting access based only on the original purchase.

---

## Compliance

Apple handles the App Store-side requirements associated with its platform and payment infrastructure.

However, using Apple does not automatically remove all legal or regulatory responsibilities from your business.

Depending on your business model and target markets, you may need to consider:

* Taxes
* Consumer protection
* Data protection
* Business requirements
* Platform policies
* Local regulations

See:

**[Compliance →](../security/compliance.md)**

**[Tax and Compliance →](../global-commerce/tax-and-compliance.md)**

---

## Troubleshooting

When an Apple purchase does not produce the expected result, trace the complete flow.

```text
Customer
   ↓
Paywall
   ↓
Apple Purchase
   ↓
Store Transaction
   ↓
Verification
   ↓
SolydFlow
   ↓
Transaction
   ↓
Entitlement
```

Check:

1. Did the customer initiate the purchase?
2. Did Apple create the transaction?
3. Was the transaction completed?
4. Was the transaction verified?
5. Was the expected store event received?
6. Did SolydFlow process the event?
7. What transaction state does SolydFlow show?
8. Was the entitlement granted?
9. If the purchase was restored, was the entitlement restored correctly?

See:

**[Troubleshooting →](../troubleshooting/overview.md)**

---

## Key Principle

> **Apple processes the App Store purchase. SolydFlow manages the application revenue lifecycle around the purchase.**

Your application should not need to maintain separate transaction and entitlement logic for every store and payment provider.

```text
Your Application
       ↓
   SolydFlow
       ↓
     Apple
       ↓
   App Store
       ↓
  Transaction
       ↓
  Entitlement
       ↓
Application Access
```

SolydFlow provides the common revenue layer while Apple remains the platform-specific store and payment infrastructure.

<!-- ---

## Next Steps

For Android applications distributed through Google Play, continue with:

**[Google Play →](./google-play.md)**

Or return to the complete provider list:

**[Payment Providers Overview →](./overview.md)** -->
