# Swift

The SolydFlow Swift SDK is currently **under development**.

This integration will bring SolydFlow's revenue infrastructure to native iOS applications, providing the same core concepts used across the SolydFlow platform.

The Swift SDK documentation will be updated as the integration becomes available.

---

## Planned Integration

The Swift SDK will integrate native iOS applications with SolydFlow's platform, including the core SolydFlow concepts:

* Users
* Products
* Packages
* Entitlements
* Transactions
* Payment providers
* Transaction recovery
* Offline entitlement access

The integration will follow the SolydFlow model where the application interacts with the SolydFlow SDK while SolydFlow handles the underlying payment infrastructure.

```text
iOS App
   ↓
SolydFlow Swift SDK
   ↓
SolydFlow Platform
   ↓
Payment Providers
   ↓
Transaction Verification
   ↓
Entitlement Activation
   ↓
Premium Features
```

---

## Native iOS Integration

The Swift integration is being developed for native iOS applications.

When available, this page will document:

* Installation
* Project configuration
* SDK initialization
* User identification
* Package retrieval
* Purchase flows
* Entitlement checks
* Customer state
* Offline entitlement access
* Transaction recovery
* Apple In-App Purchase integration

---

## SolydFlow's iOS Model

The Swift SDK will follow the same separation between **packages** and **entitlements** used throughout SolydFlow.

For example:

```text
gold_monthly
      ↓
gold_access
```

and:

```text
gold_yearly
      ↓
gold_access
```

The package represents what the customer purchases, while the entitlement represents the access granted to the customer.

See:

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

---

## Apple In-App Purchases

Apple In-App Purchase support is currently listed by SolydFlow as **in testing**.

The Swift SDK will provide the native integration for this payment path when the integration is ready.

The current documentation therefore does not provide Swift implementation instructions yet.

---

## SDK Status

**Status:** 🚧 Under Development

The Swift SDK documentation will be expanded when the SDK is ready for integration.

This page will then include the complete native iOS setup and API reference.

For currently available integrations, see:

* [JavaScript →](./javascript.md)
* [Flutter →](./flutter.md)

---

## Related Documentation

[SDK Overview →](./overview.md)

[JavaScript →](./javascript.md)

[Flutter →](./flutter.md)

[React Native →](./react-native.md)

[Users →](../concepts/users.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

[Transactions →](../concepts/transactions.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Apple →](../payment-providers/apple.md)
