# SDK Overview

SolydFlow provides SDKs that connect your application to the SolydFlow platform.

The SDK handles the application-side interaction with SolydFlow, including:

* Initializing a SolydFlow user
* Loading available packages
* Starting purchases
* Checking entitlements
* Synchronizing customer state
* Recovering interrupted transactions
* Providing offline access to entitlement state

The SDK works with the SolydFlow platform, which handles payment providers, payment verification, transaction recovery, and entitlement activation.

---

## How the SDK Fits Into SolydFlow

The application-side flow is:

```text
Customer
   ↓
Your Application
   ↓
SolydFlow SDK
   ↓
SolydFlow Platform
   ↓
Payment Provider
   ↓
Payment Verification
   ↓
Entitlement Activation
   ↓
SDK Customer State
   ↓
Premium Features
```

The SDK provides the interface your application uses to interact with this flow.

---

## What the SDK Handles

When a customer makes a purchase through the SDK, SolydFlow handles:

* Payment processing
* Payment verification
* Entitlement updates
* Transaction recovery
* Customer synchronization

Your application can then use the customer's entitlement state to determine which features should be available.

---

## User Initialization

SolydFlow is initialized with information about the current application user.

For example, the Flutter SDK uses:

```dart
await SolydFlow.configure(
  apiKey: "sf_pk_your_public_key",
  userID: "unique_user_id",
  userPhone: "2348012345678",
  userEmamil: "user@mail.com"
);
```

The `userID` identifies the customer within SolydFlow.

SolydFlow uses this identifier to:

* Track purchases
* Restore access across devices
* Synchronize entitlements
* Recover interrupted transactions

A phone number can also enable recovery campaigns, churn-prevention messaging, customer re-engagement workflows, and local payment rails such as M-Pesa.

---

## When to Initialize the SDK

Initialize SolydFlow:

* After the user has authenticated
* Before checking entitlements
* Before displaying a paywall
* Before making purchases

For applications that support guest users, SolydFlow can be initialized with a temporary identifier and reconfigured after the user signs in.

---

## Packages and Entitlements

The SDK works with SolydFlow's package and entitlement model.

A package is what the customer purchases.

An entitlement represents the access that the customer receives.

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

Different packages can therefore provide the same entitlement.

The SDK exposes this entitlement state to the application.

---

## Loading Packages

Applications can retrieve their configured packages from SolydFlow.

The Flutter SDK provides:

```dart
List<SolydPackage> offerings =
    await SolydFlow.getOfferings();
```

The application can then display the returned packages using its own interface.

---

## Purchasing a Package

Once a customer selects a package, the SDK starts the purchase flow.

For Flutter:

```dart
final CustomerInfo? info =
    await SolydFlow.purchasePackage(
  context,
  packageID,
);
```

After a successful purchase, the returned customer information can be used to check the customer's active entitlements.

---

## Checking Entitlements

SolydFlow provides two ways to access customer entitlement state.

### Simple Access Check

Use the simple access check when the application only needs to determine whether a customer has access to a feature.

```dart
bool isPro =
    await SolydFlow.hasEntitlement("pro_tier");
```

This method is designed for UI gating and navigation decisions.

It works offline using SolydFlow's encrypted local cache.

### Full Customer State

When the application needs more information, it can retrieve the complete customer state:

```dart
CustomerInfo info =
    await SolydFlow.getCustomerInfo();
```

`CustomerInfo` includes:

* Active entitlements
* Entitlement expiration dates
* Cached local state
* Synchronized server state

---

## Offline Entitlement Access

SolydFlow is designed for applications operating under unstable network conditions.

The SDK maintains encrypted local entitlement state so applications can continue determining access while offline.

When connectivity is restored, the SDK synchronizes the local state with the server state.

This allows applications to continue providing access without requiring a network request for every entitlement check.

---

## Paywall Integration

SolydFlow supports two approaches to paywalls.

| Approach        | Use when                                               |
| --------------- | ------------------------------------------------------ |
| Custom UI       | You want complete control over the paywall experience  |
| No-Code Paywall | You want to manage paywalls from the SolydFlow Console |

With **Custom UI**, your application retrieves packages from SolydFlow and renders them using its own components.

With the **No-Code Paywall**, the paywall is designed and managed through the SolydFlow Console and can be updated without releasing a new application version.

---

## SDK Integration Model

The SDK is the application-facing layer of SolydFlow.

```text
Your Application
       │
       ↓
   SolydFlow SDK
       │
       ↓
SolydFlow Platform
       │
 ┌─────┼─────────┐
 ↓     ↓         ↓
Payments  Recovery  Entitlements
```

The application does not need to implement each payment provider's integration separately when using the SolydFlow SDK.

---

## Supported SDKs

The documentation structure provides platform-specific SDK guides for:

```text
sdk/
├── overview.md
├── javascript.md
├── flutter.md
├── react-native.md
├── swift.md
├── kotlin.md
└── other-languages.md
```

The existing SolydFlow documentation currently provides the most detailed integration flow for **Flutter**.

The platform-specific pages should contain the installation, initialization, and usage instructions for each supported SDK.

---

## Related Documentation

[Quick Start →](../get-started/quickstart.md)

[Install SDK →](../get-started/install-sdk.md)

[Configure SolydFlow →](../get-started/configure-solydflow.md)

[Users →](../concepts/users.md)

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

[Paywalls →](../concepts/paywalls.md)

[Transactions →](../concepts/transactions.md)

[Transaction Recovery →](../recover/transaction-recovery.md)
<!-- 
---

## Next Steps

Choose the SDK for your application:

* [JavaScript →](./javascript.md)
* [Flutter →](./flutter.md)
* [React Native →](./react-native.md)
* [Swift →](./swift.md)
* [Kotlin →](./kotlin.md)
* [Other Languages →](./other-languages.md)
 -->