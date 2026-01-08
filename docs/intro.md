# Quick Start Guide

SolydFlow is the revenue infrastructure for African mobile apps. It unifies Paystack, Flutterwave, Apple IAP, and Google Play into a single API that handles **offline entitlements** and **transaction recovery**.
Our current implementation are Paystack and Flutterwave, while others are in progress...

## Prerequisites

*   A [SolydFlow Account](https://console.solydflow.com)
*   A Flutter App
*   A Paystack or Flutterwave Account (Live or Test)

---

> N.B: The docs is undergoing improvement, and more visuals will be added soon for better experience, please bear with us.

## Step 1: Configure the Dashboard

Before writing code, we need to define *what* you are selling.

### 1. Create a Project
Log in to the SolydFlow Console. Click **New Project** and give your app a name (e.g., "NaijaFitness").

### 2. Connect Your Gateway
Inside your project card, you will see a status badge. Click **"Connect Gateway"**.
*   Select your provider (Paystack or Flutterwave).
*   Enter your **Secret Key** (starts with `sk_` or `FLWSECK_`).

### 3. Set Up Pricing (Packages & Entitlements)
Go to the **Pricing & Products** tab. This is where the magic happens. You need to create "Packages" that unlock "Entitlements".

*   **Package Identifier:** The unique ID for the specific product (e.g., `gold_monthly`, `gold_yearly`). Whatever name you choose should be the same with the name you will use in your app.
*   **Entitlement ID:** The access level the user gets (e.g., `gold_access`).
    *   *Note:* Both `gold_monthly` and `gold_yearly` should unlock the **same** Entitlement ID (`gold_access`).

---

## Step 2: Install the SDK

Add SolydFlow to your Flutter project's `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  # For Alpha Access:
  solydflow_flutter:
    git:
      url: https://github.com/solydflow/solydflow_flutter.git
      path: sdk_flutter
      ref: v0.3.0
```

**Android Requirement:**
Open `android/app/build.gradle` and ensure `minSdkVersion` is **21** or higher.

---

## Step 3: Integrate into your App

### 1. Initialization
Initialize the SDK in your `main.dart`.

```dart
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SolydFlow.configure(
    apiKey: "sf_live_YOUR_API_KEY", // Found in your Dashboard Project Card
    userID: "user_12345" // Your App's logged-in User ID
  );

  runApp(const MyApp());
}
```

### 2. Checking Access (The Gatekeeper)
You can check if a user has access anywhere in your app. This checks the local encrypted cache first, making it **instant and offline-safe**.

```dart
Future<void> checkAccess() async {
  // Check for the "Entitlement ID" you set in Dashboard Step 3
  if (await SolydFlow.hasEntitlement("gold_access")) {
    print("User is Gold! 💎");
    // Navigate to Premium Content
  } else {
    print("User is Free.");
    // Show Paywall
  }
}
```

### 3. Showing the Paywall
Don't hardcode prices. Fetch them from SolydFlow so you can change prices remotely.

```dart
// Returns a list of packages configured in your Dashboard
List<SolydPackage> offerings = await SolydFlow.getOfferings();

// Display in UI
for (var pkg in offerings) {
  print("${pkg.name} - ${pkg.currency} ${pkg.amountKobo / 100}");
  // e.g., "Gold Monthly - NGN 1000"
}
```

### 4. Making a Purchase
When the user taps "Buy", call this method. It handles the Payment UI, Verification, and Error handling.

```dart
Future<void> buyPlan(BuildContext context, String packageID) async {
  try {
    // 1. Trigger Purchase (Opens WebView)
    final CustomerInfo? info = await SolydFlow.purchasePackage(context, packageID);

    if (info == null) return;

    // 2. Check Status Immediately
    if (await SolydFlow.hasEntitlement("gold_access")) {
      Navigator.pop(context); // Close Paywall
      print("Welcome to the Gold Club!");
    }
  } catch (e) {
    print("Purchase failed: $e");
  }
}
```

---

## Step 4: Testing & Recovery

### The "Zombie Transaction" Test
SolydFlow is built for unstable networks. Test the recovery engine:

1.  Start a purchase on a real device.
2.  Complete the payment in the WebView.
3.  **Immediately kill the app** (swipe it away) before it returns to the success screen.
4.  Wait 30 seconds.
5.  Re-open the app.
6.  The user will automatically have `gold_access`.

---

### Need Help?
Contact the team at alpha@solydflow.com.

---