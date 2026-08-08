# Kotlin

The SolydFlow Kotlin SDK is currently **under development**.

The integration will bring SolydFlow's revenue infrastructure to native Android applications.

This page will be updated as the Kotlin SDK becomes available, including installation, configuration, API usage, and Android-specific integration requirements.

---

## Planned Integration

The Kotlin SDK will connect native Android applications to the SolydFlow platform.

The integration will follow the same SolydFlow revenue model used by the existing SDK integrations:

```text id="m0w3tg"
Android App
     ↓
SolydFlow Kotlin SDK
     ↓
SolydFlow Platform
     ↓
Payment Providers
     ↓
Payment Verification
     ↓
Entitlement Activation
     ↓
Premium Features
```

---

## Core SolydFlow Concepts

The Kotlin integration will work with the same core concepts used throughout SolydFlow:

* **Users** — identify customers within SolydFlow.
* **Products** — define what is being sold.
* **Packages** — represent the purchasable plans.
* **Entitlements** — represent the access granted after purchase.
* **Transactions** — represent payment activity.
* **Payment Providers** — provide the underlying payment rails.
* **Transaction Recovery** — restores successful payments when an application is interrupted.
* **Offline Entitlement Access** — allows applications to determine access when connectivity is unstable.

See the relevant concept pages for the definitions of these components.

---

## Android Integration

When the Kotlin SDK is ready, this page will document:

* Installation
* Android project configuration
* SDK initialization
* User identification
* Package retrieval
* Purchase flows
* Entitlement checks
* Customer state
* Offline entitlement access
* Transaction recovery
* Google Play Billing integration

---

## Google Play Billing

Google Play Billing is currently listed by SolydFlow as **in testing**. ([docs.solydflow.com](https://docs.solydflow.com/))

The Kotlin SDK will provide the native Android integration for this payment path when the SDK is ready.

The current documentation therefore does not provide Kotlin implementation instructions.

---

## Packages and Entitlements

The Kotlin integration will use SolydFlow's existing package and entitlement model.

For example:

```text id="z6ksxg"
gold_monthly
      ↓
gold_access
```

and:

```text id="m0asq5"
gold_yearly
      ↓
gold_access
```

Both packages can provide the same entitlement.

The application uses the entitlement to determine access to premium features.

See:

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

---

## Transaction Recovery

Transaction recovery is a core part of SolydFlow's mobile revenue infrastructure.

The Kotlin integration will use the SolydFlow platform's transaction recovery and entitlement synchronization capabilities once the SDK is available.

The intended flow is:

```text id="2d3t8e"
Payment
   ↓
Transaction Processing
   ↓
SolydFlow Verification
   ↓
Entitlement
   ↓
Android Application
```

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

## SDK Status

**Status:** 🚧 Under Development

The Kotlin SDK documentation will be expanded when the SDK is ready for integration.

At that point, this page will contain the complete Android setup and API reference.

For currently available SDK integrations, see:

* [JavaScript →](./javascript.md)
* [Flutter →](./flutter.md)

---

## Related Documentation

[SDK Overview →](./overview.md)

[JavaScript →](./javascript.md)

[Flutter →](./flutter.md)

[React Native →](./react-native.md)

[Swift →](./swift.md)

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

[Transactions →](../concepts/transactions.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Google Play →](../payment-providers/google-play.md)
