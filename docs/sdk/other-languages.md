# Other Languages

SolydFlow's SDK integrations are being expanded to support more application platforms and programming languages.

Currently documented integrations are:

* JavaScript / TypeScript
* Flutter

React Native, Swift, and Kotlin integrations are **under development**.

Additional language and platform integrations will be documented here as they become available.

---

## SolydFlow Integration Model

Regardless of the application platform, the integration follows the same SolydFlow model:

```text id="w9zq4v"
Application
    ↓
SolydFlow Integration
    ↓
SolydFlow Platform
    ↓
Payment Providers
    ↓
Transaction Verification
    ↓
Entitlement
    ↓
Application Access
```

The application interacts with SolydFlow while SolydFlow provides the underlying revenue infrastructure.

---

## Core Concepts

Applications integrating with SolydFlow work with the same core concepts:

### Users

A user identifies the customer whose purchases and entitlements are being managed.

See:

[Users →](../concepts/users.md)

### Products

Products define what is available for sale.

See:

[Products →](../concepts/products.md)

### Packages

Packages represent the purchasable plans associated with products.

See:

[Packages →](../concepts/packages.md)

### Entitlements

Entitlements represent the access granted to a customer after a successful purchase.

See:

[Entitlements →](../concepts/entitlements.md)

### Transactions

Transactions represent payment activity and its resulting state.

See:

[Transactions →](../concepts/transactions.md)

---

## Building Without a Native SDK

Where a native SDK is not yet available for your platform, you can integrate with SolydFlow through its platform APIs and webhooks where supported.

This allows your application to communicate with SolydFlow without requiring a platform-specific SDK.

The exact integration approach depends on the type of application and the SolydFlow functionality being used.

See:

[How SolydFlow Works →](../how-solydflow-works.md)

[Webhooks →](../webhooks/overview.md)

---

## Web Applications

Web applications can use the JavaScript SDK.

The JavaScript SDK is framework-agnostic and can be used with technologies such as:

* React
* Vue
* Next.js
* Vanilla JavaScript

See:

[JavaScript →](./javascript.md)

---

## Mobile Applications

For mobile applications, SolydFlow is expanding its native SDK coverage.

### Flutter

The Flutter SDK is currently documented and available.

See:

[Flutter →](./flutter.md)

### React Native

The React Native SDK is currently **under development**.

See:

[React Native →](./react-native.md)

### iOS / Swift

The Swift SDK is currently **under development**.

See:

[Swift →](./swift.md)

### Android / Kotlin

The Kotlin SDK is currently **under development**.

See:

[Kotlin →](./kotlin.md)

---

## Future SDK Support

SolydFlow will continue expanding its SDK coverage as additional integrations are developed.

When an SDK becomes available, this page will be updated with:

* Installation instructions
* Platform requirements
* Initialization
* User configuration
* Package retrieval
* Purchase flows
* Entitlement checks
* Customer state
* Transaction recovery
* Platform-specific configuration

This keeps the SDK documentation aligned with the actual integrations available in SolydFlow.

---

## Current SDK Status

| Platform                | SDK                 | Status               |
| ----------------------- | ------------------- | -------------------- |
| JavaScript / TypeScript | `solydflow-js`      | Available            |
| Flutter                 | `solydflow_flutter` | Available            |
| React Native            | —                   | 🚧 Under Development |
| Swift                   | —                   | 🚧 Under Development |
| Kotlin                  | —                   | 🚧 Under Development |
| Other platforms         | —                   | Future               |

The table will be updated as new SDKs become available.

---

## Related Documentation

[SDK Overview →](./overview.md)

[JavaScript →](./javascript.md)

[Flutter →](./flutter.md)

[React Native →](./react-native.md)

[Swift →](./swift.md)

[Kotlin →](./kotlin.md)

[How SolydFlow Works →](../how-solydflow-works.md)

[Webhooks →](../webhooks/overview.md)

[Transactions →](../concepts/transactions.md)

[Entitlements →](../concepts/entitlements.md)
