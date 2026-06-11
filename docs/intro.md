# Quick Start Guide

# Quick Start Integration Guide

> N.B: The documentation is still undergoing standardization, please report any issues you had while following the guide.

SolydFlow is the revenue infrastructure for African mobile apps.

It unifies app stores (Apple App Store and Google Play) and local payment gateways (Paystack, Flutterwave, and Stripe) into a single API, allowing you to manage subscriptions, purchases, and customer access from one place.

Built for the realities of emerging markets, SolydFlow provides:

* Offline entitlement access, so users can continue accessing paid features even when connectivity is unstable.
* Transaction recovery, ensuring successful payments are restored even if the app closes before completion.
* Churn protection tools that help recover subscribers before they cancel or expire.
* A single dashboard for managing products, pricing, entitlements, and payment providers.

This guide walks you through setting up your project, connecting payment providers, configuring products, and integrating the SolydFlow SDK into your Flutter application.

---

## How SolydFlow Works

At a high level, SolydFlow sits between your application and your payment providers.

```text
Customer
    ↓
Your App
    ↓
SolydFlow SDK
    ↓
SolydFlow Platform
    ↓
Paystack / Flutterwave / Stripe
    ↓
Payment Verified
    ↓
Entitlement Activated
    ↓
Premium Features Unlocked
```

### What Happens During a Purchase?

1. A customer selects a product in your application.
2. SolydFlow initiates the payment with the configured payment provider.
3. The payment provider confirms the transaction.
4. SolydFlow verifies the payment and activates the associated entitlement.
5. The SDK updates the customer's access locally and remotely.
6. Premium content or features become immediately available.

### Why Entitlements Matter

An entitlement represents access, not a product.

For example:

| Package      | Entitlement |
| ------------ | ----------- |
| gold_monthly | gold_access |
| gold_yearly  | gold_access |

Although the customer purchased different packages, both unlock the same entitlement (`gold_access`).

This allows you to manage access consistently regardless of billing period, currency, or payment provider.

---


## Prerequisites

*   A [SolydFlow Account](https://console.solydflow.com)
*   A Flutter App
*   A Payment Gateway Account (Live or Test)

---

## Step 1: Configure Your Project in the SolydFlow Console

Before writing code, you need to configure your project in the SolydFlow Console.

### 1. Create a Project

Log in to the SolydFlow Console and click **New Project**.

Enter your application's name and create the project.

After creation, you'll receive:

* **Public Key (`sf_pk_...`)**: Used by your mobile application.
* **Secret Key (`sf_sk_...`)**: Used only by your backend services.

> Keep your Secret Key private and never expose it inside your mobile application.

---

### 2. Connect Your Payment Providers

SolydFlow follows a Bring Your Own Gateway (BYOK) model.

Navigate to **Project Settings → Connect Gateway** and connect the payment providers you want to use.

> **Production-ready providers**
>
> * Paystack
> * Flutterwave
>
> **Currently in testing**
>
> * Apple In-App Purchases
> * Google Play Billing
> * Stripe

For each provider:

1. Paste your provider's Secret Key.
2. Save the configuration.
3. Copy the SolydFlow Webhook URL displayed in the dashboard.
4. Add the webhook URL to your payment provider's dashboard.

Webhook integration enables:

* Automatic payment verification
* Transaction recovery
* Background subscription synchronization
* Restoration of interrupted purchases

---

### 3. Create Entitlements

Entitlements represent the access level a customer receives after a successful purchase.

Examples:

* `pro_access`
* `gold_access`
* `enterprise_access`

Think of an entitlement as the permission that unlocks premium features inside your application.

---

### 4. Create Packages

Packages are the products customers actually purchase.

Examples:

* `gold_monthly`
* `gold_yearly`
* `pro_monthly`
* `pro_annual`

Each package should be mapped to an entitlement.

Example:

| Package      | Entitlement |
| ------------ | ----------- |
| gold_monthly | gold_access |
| gold_yearly  | gold_access |

Both subscriptions unlock the same access level even though they have different billing periods.

---

### 5. Configure Regional Pricing

When creating packages, SolydFlow can automatically suggest localized pricing across supported regions using **Smart Suggestions**.

This helps maintain purchasing-power parity across currencies such as:

* NGN
* KES
* GHS
* ZAR
* USD
* EUR

You can accept the suggested pricing or customize prices manually for each market.
---
## Step 2: Install the SDK

Add SolydFlow to your Flutter project's `pubspec.yaml`.

```yaml
dependencies:
  flutter:
    sdk: flutter

  solydflow_flutter:
    git:
      url: https://github.com/solydflow/solydflow_flutter.git
      path: sdk_flutter
      ref: v0.7.0
```

After updating your dependencies, run:

```bash
flutter pub get
```

---

## Platform Requirements

### Android

SolydFlow requires Android API Level 21 (Android 5.0) or higher.

Open:

```text
android/app/build.gradle
```

or

```text
android/app/build.gradle.kts
```

and ensure:

```kotlin
defaultConfig {
    minSdkVersion = 21
}
```

---

### iOS

If you are participating in Apple In-App Purchase testing, enable the **In-App Purchase** capability in Xcode.

1. Open:

```text
ios/Runner.xcworkspace
```

2. Navigate to:

```text
Signing & Capabilities
```

3. Click:

```text
+ Capability
```

4. Add:

```text
In-App Purchase
```

> Apple In-App Purchase support is currently in testing. Most Paystack and Flutterwave integrations do not require this step.

---

## Step 3: Initialize SolydFlow

Initialize SolydFlow as early as possible in your application's lifecycle, ideally before rendering your first screen.

```dart
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SolydFlow.configure(
    apiKey: "sf_pk_your_public_key",
    userID: "unique_user_id",
    userPhone: "2348012345678",
  );

  runApp(const MyApp());
}
```

---

### Configuration Parameters

#### `apiKey`

Your project's public API key.

You can find this in your SolydFlow project dashboard.

Example:

```text
sf_pk_xxxxxxxxxxxxxxxxx
```

---

#### `userID`

A unique identifier for the currently authenticated user in your application.

Examples:

* Firebase UID
* Supabase User ID
* Internal database user ID

This value is used to:

* Track purchases
* Restore access across devices
* Sync entitlements
* Recover interrupted transactions

Example:

```text
user_12345
```

---

#### `userPhone` (Recommended)

The user's phone number in international format.

Example:

```text
2348012345678
```

Providing a phone number enables SolydFlow features such as:

* Subscription recovery campaigns
* Churn prevention messaging
* Customer re-engagement workflows

If a phone number is not available, SolydFlow will continue to function normally.

---

### When Should Initialization Happen?

Initialize SolydFlow:

* After the user has authenticated.
* Before checking entitlements.
* Before displaying a paywall.
* Before making purchases.

If your application supports guest users, initialize SolydFlow with a temporary identifier and reconfigure it once the user signs in.

---

## Step 4: Choose Your Integration Strategy

SolydFlow supports two different integration approaches.

Choose the one that best matches your team's workflow and product requirements.

| Option          | Best For                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Custom UI       | Teams that want complete control over the paywall experience and design.                                                         |
| No-Code Paywall | Teams that want to design, update, and publish paywalls directly from the SolydFlow Console without releasing a new app version. |

---

### Option A: Custom UI

With the Custom UI approach, your application fetches products from SolydFlow and renders them using your own Flutter widgets and layouts.

This gives you complete control over:

* Design
* User experience
* Layout
* Product presentation

Fetch your available packages:

```dart
Future<void> loadProducts() async {
  List<SolydPackage> offerings = await SolydFlow.getOfferings();

  for (var pkg in offerings) {
    if (pkg.isUpgrade) {
      print(
        "Upgrade Price: ${pkg.currency} ${pkg.calculatedAmountKobo / 100}"
      );
    } else {
      print(
        "Base Price: ${pkg.currency} ${pkg.amountKobo / 100}"
      );
    }
  }
}
```

The returned packages can be displayed in any UI design you choose.

---

### Purchase a Package

When a user selects a package, initiate the purchase flow:

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

The SDK automatically handles:

* Payment processing
* Verification
* Entitlement updates
* Transaction recovery
* Customer synchronization

---

### Option B: No-Code Paywall

With the No-Code Paywall, you design and manage your paywall directly from the SolydFlow Console.

Changes can be published without requiring users to update your application.

Display the paywall with:

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

The paywall automatically:

* Displays products configured in your dashboard
* Uses your published paywall design
* Handles purchases
* Tracks conversion events
* Updates customer entitlements after successful payment

---

### Which Option Should You Choose?

Choose **Custom UI** if:

* You need full control over the user experience.
* Your design system is highly customized.
* You want to build your own paywall components.

Choose **No-Code Paywall** if:

* You want faster implementation.
* Product teams need to update paywalls without app releases.
* You want dashboard-managed paywall experiences.

---

## Step 5: Checking Entitlements and Customer State

SolydFlow provides two ways to check a user's access level depending on your needs.

---

## Option A: Simple Access Check (Recommended for UI)

Use this when you only need to quickly determine whether a user has access to a feature.

```dart id="k2p9ld"
Future<void> checkAccess() async {
  bool isPro = await SolydFlow.hasEntitlement("pro_tier");

  if (isPro) {
    // Unlock premium features
    print("User has access");
  } else {
    // Show paywall or restrict access
    print("User does not have access");
  }
}
```

### Why use this method?

* Fast (<5ms)
* Works offline using encrypted local cache
* Ideal for UI gating and navigation decisions

---

## Option B: Full Customer State (Advanced)

Use this when you need complete information about a user's subscriptions, expiry dates, or entitlement history.

```dart id="x8q2mn"
Future<void> getCustomerState() async {
  CustomerInfo info = await SolydFlow.getCustomerInfo();

  // Check active entitlement
  if (info.activeEntitlements["pro_tier"] == true) {
    print("User is Pro");
  }

  // Get entitlement expiry
  DateTime? expiry = info.allEntitlements["pro_tier"];
  if (expiry != null) {
    print("Expires on: $expiry");
  }
}
```

---

## What `CustomerInfo` Contains

The `CustomerInfo` object includes:

* `activeEntitlements`
  → A map of currently active access levels

* `allEntitlements`
  → All entitlements with their expiration dates

* Cached local state (instant access even offline)

* Synchronized server state (updated in background when connection is restored)

---

## Offline-First Behavior

SolydFlow is designed to work in unstable network conditions.

When calling `getCustomerInfo()`:

1. The SDK first checks encrypted local storage (instant response).
2. If available, it returns immediately.
3. It then syncs with the server in the background.
4. Any updates are automatically merged.

This ensures:

* No blocked UI
* No dependency on constant internet connectivity
* Reliable entitlement restoration after interruptions

---

## When to Use Which

| Scenario                     | Recommended Method  |
| ---------------------------- | ------------------- |
| Show/hide premium UI         | `hasEntitlement()`  |
| Route navigation decisions   | `hasEntitlement()`  |
| Show subscription details    | `getCustomerInfo()` |
| Analytics / billing insights | `getCustomerInfo()` |
| Debugging user access issues | `getCustomerInfo()` |

---

## Step 6: Display Products and Process Purchases

Before a customer can make a purchase, your application needs to retrieve the products configured in your SolydFlow dashboard.

---

## Fetch Available Packages

Use `getOfferings()` to retrieve the packages associated with your project.

```dart
Future<void> loadProducts() async {
  List<SolydPackage> offerings =
      await SolydFlow.getOfferings();

  for (var pkg in offerings) {
    print(
      "${pkg.name} - ${pkg.currency} ${pkg.amountKobo / 100}"
    );
  }
}
```

Example output:

```text
Gold Monthly - NGN 1000
Gold Yearly - NGN 10000
```

The returned packages can be displayed using your own UI or through the SolydFlow No-Code Paywall.

---

## Upgrade Pricing and Smart Credits

When a customer is upgrading from one plan to another, SolydFlow can return adjusted pricing information.

```dart
for (var pkg in offerings) {
  if (pkg.isUpgrade) {
    print(
      "Upgrade Price: ${pkg.currency} ${pkg.calculatedAmountKobo / 100}"
    );
  }
}
```

When `isUpgrade` is `true`, the package contains upgrade-adjusted pricing that can be displayed to the customer.

---

## Initiate a Purchase

When a customer selects a package, call `purchasePackage()`.

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
      // User cancelled purchase
      return;
    }

    if (info.activeEntitlements["gold_access"] == true) {
      print("Purchase successful!");
    }
  } catch (e) {
    print("Purchase failed: $e");
  }
}
```

---

## What Happens During a Purchase?

The SDK automatically handles:

* Payment initialization
* Payment provider communication
* Transaction verification
* Entitlement activation
* Customer synchronization
* Transaction recovery

After a successful purchase, the updated `CustomerInfo` object is returned immediately.

This allows your application to unlock features without requiring another API call.

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

Always handle all three scenarios to provide a smooth user experience.

---

## Recommended Flow

1. Fetch offerings using `getOfferings()`.
2. Display products to the user.
3. User selects a package.
4. Call `purchasePackage()`.
5. Verify access using the returned `CustomerInfo`.
6. Unlock premium functionality immediately.

---

## Step 7: Test Transaction Recovery

One of SolydFlow's core capabilities is transaction recovery.

In regions with unstable networks, users may successfully complete a payment but lose connectivity before the application receives confirmation. This can result in paid customers temporarily losing access.

SolydFlow automatically reconciles these transactions using webhook events, entitlement synchronization, and secure local caching.

---

## The "Zombie Transaction" Test

Use this test to verify that transaction recovery is working correctly.

### Test Steps

1. Start a purchase on a physical device.
2. Complete the payment process.
3. Before the payment flow returns to your application, immediately force-close the app.
4. Wait approximately 15 to 30 seconds.
5. Re-open the application.
6. Check the user's entitlement status.

### Expected Result

The user should automatically regain access to the purchased entitlement even though the application was closed before the purchase flow completed.

For example:

```dart id="krp18v"
bool hasAccess =
    await SolydFlow.hasEntitlement(
      "gold_access",
    );
```

The result should return:

```text id="8l78m7"
true
```

---

## What This Test Validates

A successful recovery test confirms:

* Webhooks are configured correctly.
* Payment verification is working.
* Entitlement synchronization is active.
* Customer state recovery is functioning properly.
* Interrupted purchases can be restored automatically.

---

## Common Issues

### Purchase Not Restored

Verify:

* Gateway credentials are correct.
* Webhook URLs are configured.
* The webhook endpoint is reachable.
* The payment was successfully completed on the provider side.

---

### Entitlement Not Activated

Verify:

* The package is mapped to the correct entitlement.
* The entitlement exists in the SolydFlow Console.
* The application is checking the correct entitlement identifier.

Example:

```dart id="fd1wkf"
await SolydFlow.hasEntitlement(
  "gold_access",
);
```

---

### Recovery Takes Longer Than Expected

Recovery timing depends on:

* Payment provider webhook delivery
* Network conditions
* Application reconnect timing

In most cases, recovery should occur automatically within a short period after the payment provider confirms the transaction.

---

## Need Help?

### Documentation

Visit the SolydFlow Console documentation for detailed guides, SDK references, and platform-specific integration examples.

### Support

For technical assistance, contact:

[support@solydflow.com](mailto:support@solydflow.com)

When contacting support, include:

* Project name
* SDK version
* Platform (Android or iOS)
* Relevant error messages
* Steps to reproduce the issue

This helps the team resolve issues more quickly.

---