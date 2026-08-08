# Flutter

SolydFlow provides a Flutter SDK for integrating revenue infrastructure into Flutter applications.

The SDK connects your application to SolydFlow's payment, entitlement, pricing, recovery, and customer synchronization systems.

The Flutter integration supports:

* Paystack
* Flutterwave
* Stripe
* Monnify
* M-Pesa / Daraja
* Apple In-App Purchases — currently in testing
* Google Play Billing — currently in testing

---

## Installation

Add `solydflow_flutter` to your Flutter project's `pubspec.yaml`.

```yaml
dependencies:
  flutter:
    sdk: flutter
  solydflow_flutter:
    git:
      url: https://github.com/solydflow/solydflow_flutter.git
      path: sdk_flutter
      ref: v0.8.0
```

Then run:

```bash
flutter pub get
```

---

## Platform Requirements

### Android

SolydFlow requires:

```text
Android API Level 21+
```

Open either:

```text
android/app/build.gradle
```

or:

```text
android/app/build.gradle.kts
```

and ensure the minimum SDK version is 21.

### iOS

If you are participating in Apple In-App Purchase testing, enable the **In-App Purchase** capability in Xcode:

1. Open `ios/Runner.xcworkspace`.
2. Open **Signing & Capabilities**.
3. Click **+ Capability**.
4. Add **In-App Purchase**.

Apple In-App Purchase support is currently in testing. Most Paystack and Flutterwave integrations do not require this capability.

---

## Initialize SolydFlow

Initialize SolydFlow as early as possible in the application lifecycle, ideally before rendering the first screen.

```dart
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SolydFlow.configure(
    apiKey: "sf_pk_your_public_key",
    userID: "unique_user_id",
    userPhone: "2348012345678",
    userEmamil: "user@mail.com"
  );

  runApp(const MyApp());
}
```

---

## Configuration Parameters

### `apiKey`

Your project's public API key.

You can find it in the SolydFlow project dashboard.

```text
sf_pk_xxxxxxxxxxxxxxxxx
```

The public key is used by the application. Your SolydFlow Secret Key must remain on your backend and must never be exposed in the mobile application.

### `userID`

A unique identifier for the currently authenticated user.

Examples include:

* Firebase UID
* Supabase User ID
* Internal database user ID

SolydFlow uses this identifier to:

* Track purchases
* Restore access across devices
* Synchronize entitlements
* Recover interrupted transactions

```text
user_12345
```

### `userPhone`

The user's phone number in international format.

```text
2348012345678
```

Providing a phone number enables features including:

* Subscription recovery campaigns
* Churn prevention messaging
* Customer re-engagement workflows
* Local payment rails such as M-Pesa

If a phone number is unavailable, you can pass an empty string and SolydFlow continues to function normally, although M-Pesa cannot be used.

---

## When to Initialize

Initialize SolydFlow:

* After the user has authenticated
* Before checking entitlements
* Before displaying a paywall
* Before making purchases

If your application supports guest users, initialize SolydFlow with a temporary identifier and reconfigure it after the user signs in.

---

# Choose an Integration Strategy

SolydFlow provides two Flutter integration approaches:

| Approach        | Best for                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Custom UI       | Complete control over paywall design and user experience                                         |
| No-Code Paywall | Designing and publishing paywalls from the SolydFlow Console without releasing a new app version |

---

## Custom UI

With Custom UI, your application retrieves packages from SolydFlow and renders them using your own Flutter widgets.

```dart
Future<void> loadProducts() async {
  List<SolydPackage> offerings =
      await SolydFlow.getOfferings();

  for (var pkg in offerings) {
    if (pkg.isUpgrade) {
      print(
        "Upgrade Price: ${pkg.currency} "
        "${pkg.calculatedAmountKobo / 100}"
      );
    } else {
      print(
        "Base Price: ${pkg.currency} "
        "${pkg.amountKobo / 100}"
      );
    }
  }
}
```

You control:

* Design
* User experience
* Layout
* Product presentation

The returned packages can be displayed using any Flutter UI you choose.

---

## Purchase a Package

When a user selects a package, call `purchasePackage()`.

```dart
Future<void> buyPlan(
  BuildContext context,
  String packageID,
) async {
  try {
    final CustomerInfo? info =
        await SolydFlow.purchasePackage(
      context,
      packageID,
    );

    if (info == null) {
      return;
    }

    if (info.activeEntitlements["gold_access"] == true) {
      Navigator.pop(context);
      print("Purchase successful!");
    }
  } catch (e) {
    print("Purchase failed: $e");
  }
}
```

The SDK handles:

* Payment processing
* Verification
* Entitlement updates
* Transaction recovery
* Customer synchronization

---

## No-Code Paywall

The No-Code Paywall allows you to design and manage the paywall directly from the SolydFlow Console.

Changes can be published without requiring users to update the application.

Display the paywall using `SolydPaywall`:

```dart
void showPaywall(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (ctx) => SolydPaywall(
      onPurchaseSuccess: (CustomerInfo info) {
        Navigator.pop(ctx);

        ScaffoldMessenger.of(ctx).showSnackBar(
          const SnackBar(
            content: Text(
              "Subscription Unlocked! 🚀",
            ),
          ),
        );
      },
      onClose: () => Navigator.pop(ctx),
    ),
  );
}
```

The No-Code Paywall:

* Displays products configured in your dashboard
* Uses your published paywall design
* Handles purchases
* Tracks conversion events
* Updates customer entitlements after successful payment

---

# Checking Entitlements

SolydFlow provides two ways to check customer access.

## `hasEntitlement()`

Use `hasEntitlement()` when the application only needs to determine whether a user has access to a feature.

```dart
Future<void> checkAccess() async {
  bool isPro =
      await SolydFlow.hasEntitlement("pro_tier");

  if (isPro) {
    print("User has access");
  } else {
    print("User does not have access");
  }
}
```

This method is:

* Fast
* Available offline through encrypted local cache
* Suitable for UI gating and navigation decisions

---

## `getCustomerInfo()`

Use `getCustomerInfo()` when the application needs complete customer information.

```dart
Future<void> getCustomerState() async {
  CustomerInfo info =
      await SolydFlow.getCustomerInfo();

  if (info.activeEntitlements["pro_tier"] == true) {
    print("User is Pro");
  }

  DateTime? expiry =
      info.allEntitlements["pro_tier"];

  if (expiry != null) {
    print("Expires on: $expiry");
  }
}
```

`CustomerInfo` contains:

* `activeEntitlements`
* `allEntitlements`
* Cached local state
* Synchronized server state

---

# Offline-First Behavior

SolydFlow is designed for unstable network conditions.

When `getCustomerInfo()` is called:

1. The SDK checks encrypted local storage.
2. Available local state is returned immediately.
3. The SDK synchronizes with the server in the background.
4. Updates are automatically merged.

This provides:

* No blocked UI
* No dependency on constant internet connectivity
* Reliable entitlement restoration after interruptions

---

## Choosing an Entitlement Method

| Scenario                     | Method              |
| ---------------------------- | ------------------- |
| Show/hide premium UI         | `hasEntitlement()`  |
| Navigation decisions         | `hasEntitlement()`  |
| Show subscription details    | `getCustomerInfo()` |
| Analytics / billing insights | `getCustomerInfo()` |
| Debug user access issues     | `getCustomerInfo()` |

---

# Fetch Available Packages

Use `getOfferings()` to retrieve the packages configured for your project.

```dart
Future<void> loadProducts() async {
  List<SolydPackage> offerings =
      await SolydFlow.getOfferings();

  for (var pkg in offerings) {
    print(
      "${pkg.name} - "
      "${pkg.currency} "
      "${pkg.amountKobo / 100}"
    );
  }
}
```

Example:

```text
Gold Monthly - NGN 1000
Gold Yearly - NGN 10000
```

The returned packages can be displayed using your own UI or the SolydFlow No-Code Paywall.

---

# Upgrade Pricing

When a customer upgrades from one plan to another, SolydFlow can return adjusted pricing.

```dart
for (var pkg in offerings) {
  if (pkg.isUpgrade) {
    print(
      "Upgrade Price: ${pkg.currency} "
      "${pkg.calculatedAmountKobo / 100}"
    );
  }
}
```

When `isUpgrade` is `true`, the package contains upgrade-adjusted pricing.

---

# Purchase Flow

When a customer selects a package:

```text
Customer
   ↓
Flutter Application
   ↓
SolydFlow SDK
   ↓
Payment Provider
   ↓
Transaction Verification
   ↓
Entitlement Activation
   ↓
CustomerInfo
   ↓
Application
```

The SDK handles:

* Payment initialization
* Payment provider communication
* Transaction verification
* Entitlement activation
* Customer synchronization
* Transaction recovery

After a successful purchase, the updated `CustomerInfo` is returned immediately.

---

## Handling Purchase Results

### Successful Purchase

```dart
if (info.activeEntitlements["gold_access"] == true) {
  // Unlock premium features
}
```

### User Cancelled

```dart
if (info == null) {
  return;
}
```

### Failed Purchase

```dart
catch (e) {
  print("Purchase failed: $e");
}
```

Handle all three cases to provide the appropriate application experience.

---

# Checkout Experience

Depending on the configured payment routing rules, customers may experience different payment flows.

Examples include:

* Hosted checkout pages — Paystack, Flutterwave, Stripe
* Virtual account payments — Monnify
* Native mobile money prompts — M-Pesa

The SDK selects and manages the configured payment flow.

---

# Transaction Recovery

SolydFlow automatically recovers transactions when a customer completes payment but the application loses connectivity or closes before receiving confirmation.

The recovery process uses:

* Webhook events
* Entitlement synchronization
* Secure local caching

### Testing a Zombie Transaction

To test transaction recovery:

1. Start a purchase on a physical device.
2. Complete the payment.
3. Force-close the application before the payment flow returns.
4. Wait approximately 15–30 seconds.
5. Reopen the application.
6. Check the user's entitlement.

```dart
bool hasAccess =
    await SolydFlow.hasEntitlement(
  "gold_access",
);
```

The expected result is:

```text
true
```

A successful recovery test confirms that webhook delivery, payment verification, entitlement synchronization, customer-state recovery, and interrupted-purchase restoration are functioning correctly.

---

## Related Documentation

[SDK Overview →](./overview.md)

[JavaScript →](./javascript.md)

[React Native →](./react-native.md)

[Swift →](./swift.md)

[Kotlin →](./kotlin.md)

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

[Paywalls →](../concepts/paywalls.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Webhooks →](../webhooks/overview.md)

<!-- ---

## Next Steps

Continue with:

[React Native →](./react-native.md) -->
