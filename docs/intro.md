# Quick Start Integration Guide

> N.B: The documentation is still undergoing standardization, please report any issues you had while following the guide.

SolydFlow is the revenue infrastructure for African mobile apps.

It unifies app stores (Apple App Store and Google Play), local African payment gateways (Paystack and Flutterwave), and Stripe for global coverage and portability into a single API.

Beyond payment aggregation, SolydFlow includes Smart Payment Routing, allowing transactions to be automatically routed to the payment rail most likely to succeed based on the customer's region, currency, and available payment methods.


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

## Smart Payment Routing

SolydFlow can automatically route payments to the most appropriate payment provider based on currency, geography, and configured routing rules.

This helps improve conversion rates by reducing failed card transactions and directing users to payment methods that are commonly used in their region.

### Example Routing Flow

```text
Customer (NGN)
        ↓
SolydFlow Smart Router
        ↓
Monnify Virtual Account
```

```text
Customer (KES)
        ↓
SolydFlow Smart Router
        ↓
M-Pesa STK Push
```

```text
Customer (USD)
        ↓
SolydFlow Smart Router
        ↓
Stripe
```

### Supported Payment Rails

| Payment Rail    | Best For                      |
| --------------- | ----------------------------- |
| Paystack        | General African card payments |
| Flutterwave     | General African card payments |
| Monnify         | Nigerian virtual accounts     |
| M-Pesa / Daraja | Kenyan mobile money payments  |
| Stripe          | Global card payments          |

Routing rules are configured from the SolydFlow Console and require no application code changes.

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

SolydFlow follows a secure **Bring Your Own Keys (BYOK)** model. This ensures you maintain direct ownership of your merchant accounts, payouts, and compliance, while SolydFlow orchestrates the intelligence and routing.

Navigate to **SolydFlow Console → Projects → Configuration (Settings Icon)** to access your **API Credentials Vault** and connect the payment providers you want to use.

Depending on your target markets, configure the following providers:

*   **[Connecting Paystack (Pan-African Cards)](#paystack-integration)**
*   **[Connecting Flutterwave (Pan-African Cards)](#flutterwave-integration)**
*   **[Connecting Stripe (Global Cards)](#stripe-integration)**
*   **[Connecting Monnify (Nigerian Virtual Accounts) - coming soon](#)**
*   **[Connecting M-Pesa / Daraja (Kenyan Mobile Money)](#)**

*(Click any provider above to view their specific key and webhook setup guide).*

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

Overview for each provider:

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

<div id="paystack-integration"></div>
# Connecting Paystack to SolydFlow

Connect your Paystack account to enable payment monitoring, transaction recovery, and financial consensus across your revenue infrastructure.

By integrating Paystack, SolydFlow's **Consensus Engine**, **Sweeper**, and **Immutable Ledger** continuously monitor transaction states and eliminate revenue uncertainty.

## Prerequisites

* An active Paystack account (Live or Test mode).
* A SolydFlow project.

---

## Step 1: Add Your Paystack Secret Keys to SolydFlow

SolydFlow requires your Paystack Secret Keys to initialize payments and independently verify transaction states directly from Paystack's API.

1. Log in to your Paystack Dashboard.
2. Navigate to **Settings → API Keys & Webhooks**.
3. Copy your **Secret Key** (`sk_live_...` and `sk_test_...`).
4. Log in to the SolydFlow Console.
5. Open your Project settings.
6. Navigate to **API Credentials Vault**.
7. Paste your Paystack Secret Keys into the Paystack section.
8. Click **Save Configuration**.

> **Security Note:** All gateway credentials are encrypted using AES-256-GCM and are never exposed to client applications.

---

## Step 2: Configure the Inbound Webhook

Paystack must notify SolydFlow when payment activity occurs.

1. In the SolydFlow Console, open **Inbound Gateway Webhook Configurations**.
2. Copy your Paystack Webhook URL:

```text
https://api.solydflow.com/api/v1/webhook/paystack/{your_solydflow_api_key}
```

3. Log in to Paystack.
4. Navigate to **Settings → API Keys & Webhooks**.
5. Paste the SolydFlow URL into the Webhook URL field.
6. Save your configuration.

---

## How SolydFlow Secures Paystack Events

SolydFlow never grants access based solely on a webhook payload.

When Paystack sends an event:

1. SolydFlow intercepts the webhook.
2. The Consensus Engine pauses entitlement activation.
3. SolydFlow securely queries Paystack's Verify Transaction API using your encrypted Secret Key.
4. The returned transaction state is compared against the webhook payload.
5. If both states agree, SolydFlow records a `SETTLED_CONSENSUS` event in the Immutable Ledger.
6. Access is granted.

This prevents:

* Webhook spoofing
* Replay attacks
* State manipulation
* False payment confirmations

---

## What SolydFlow Monitors

Once connected, SolydFlow continuously tracks:

* Successful transactions
* Delayed callbacks
* Missing webhooks
* Abandoned checkouts
* Zombie transactions
* State mismatches

These signals power Recover, Truth, and Enforce across your payment infrastructure.

---

<div id="flutterwave-integration"></div>
# Connecting Flutterwave to SolydFlow

Connect your Flutterwave account to enable transaction recovery, payment verification, and financial consensus across your revenue stack.

By integrating Flutterwave, SolydFlow's **Consensus Engine** continuously verifies transaction states before access is granted to customers.

## Prerequisites

* An active Flutterwave account (Live or Test mode).
* A SolydFlow project.

---

## Step 1: Add Your Flutterwave Secret Keys to SolydFlow

SolydFlow requires your Flutterwave Secret Keys to independently verify transactions and eliminate trust in client-side responses.

1. Log in to your Flutterwave Dashboard.
2. Navigate to **Settings → API Keys**.
3. Copy your Secret Key (`FLWSECK_TEST...` and `FLWSECK_LIVE...`).
4. Log in to the SolydFlow Console.
5. Open your Project settings.
6. Navigate to **API Credentials Vault**.
7. Paste your Flutterwave Secret Keys into the Flutterwave section.
8. Click **Save Configuration**.

> **Security Note:** SolydFlow encrypts all gateway credentials using AES-256-GCM before storage.

---

## Step 2: Configure the Inbound Webhook

Flutterwave must notify SolydFlow whenever transaction activity occurs.

1. In the SolydFlow Console, open **Inbound Gateway Webhook Configurations**.
2. Copy your Flutterwave Webhook URL:

```text
https://api.solydflow.com/api/v1/webhook/flutterwave/{your_solydflow_api_key}
```

3. Log in to Flutterwave.
4. Navigate to **Settings → Webhooks**.
5. Paste the SolydFlow URL.
6. Save your webhook configuration.

---

## How SolydFlow Secures Flutterwave Events

Unlike traditional integrations, SolydFlow does not blindly trust incoming webhooks.

When Flutterwave sends a payment event:

1. SolydFlow receives the webhook.
2. The Consensus Engine pauses entitlement activation.
3. SolydFlow queries Flutterwave's transaction verification API using your encrypted Secret Key.
4. The API response is compared against the webhook payload.
5. If consensus is reached, a `SETTLED_CONSENSUS` record is written to the Immutable Ledger.
6. User access is activated.

This guarantees financial truth even when:

* Webhooks arrive late
* Duplicate events are received
* Client responses are manipulated
* Network interruptions occur

---

## What SolydFlow Monitors

After connection, SolydFlow actively monitors:

* Successful payments
* Pending transactions
* Failed callbacks
* Missing webhooks
* Delayed settlements
* Zombie transactions
* Ledger conflicts

These signals feed SolydFlow Recover, Truth, and Enforce to ensure every payment reaches a final and correct state.

---

<div id="stripe-integration"></div>
# Connecting Stripe to SolydFlow

Connect your Stripe account to enable global card processing. By integrating Stripe, SolydFlow's **Consensus Engine** and **Sweeper** can actively monitor your international transactions, resolve state mismatches, and automate recovery workflows.

## Prerequisites
* An active Stripe account (Live or Test mode).
* A SolydFlow project.

---

## Step 1: Add Your Stripe Keys to SolydFlow

SolydFlow requires your Stripe Secret Keys to securely initialize payments and verify transaction status directly with the Stripe API (bypassing client-side spoofing).

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com).
2. Navigate to **Developers → API Keys**.
3. Copy your **Secret Key** (`sk_live_...` and `sk_test_...`).
4. Log in to the **SolydFlow Console**.
5. Go to your Project settings and open the **API Credentials Vault**.
6. Paste your Stripe Secret Keys into the Stripe section and click **Save Configuration**.

> **Security Note:** SolydFlow uses military-grade AES-256-GCM encryption to store your Secret Keys at rest.

---

## Step 2: Configure the Inbound Webhook

Stripe must notify SolydFlow whenever a payment completes. SolydFlow uses a cryptographically secure webhook endpoint unique to your project.

1. In the SolydFlow Console, scroll down to **Inbound Gateway Webhook Configurations**.
2. Copy your unique Stripe Webhook URL:
   `https://api.solydflow.com/api/v1/webhook/stripe/{your_solydflow_api_key}`
3. In your Stripe Dashboard, navigate to **Developers → Webhooks → Add Endpoint**.
4. Paste the SolydFlow URL.
5. Under **Select Events**, add `payment_intent.succeeded`. (SolydFlow's Consensus Engine will automatically query the API for the rest of the required data).
6. Click **Add Endpoint**.

---

## How SolydFlow Secures Stripe Events

Unlike standard integrations, SolydFlow **does not blindly trust incoming webhooks**. 

When Stripe fires a webhook to SolydFlow, our **Layer 2 Consensus Engine** activates:
1. We intercept the webhook.
2. We pause the entitlement grant.
3. We securely query the Stripe REST API using your encrypted `sk_live_...` key.
4. If the live API confirms the webhook payload, we log a `SETTLED_CONSENSUS` event to your Immutable Ledger and grant the user access. 

This completely eliminates Webhook Replay attacks and guarantees Absolute Financial Truth.
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

### 6. Configure Payment Routing Rules

SolydFlow allows you to define routing rules that determine which payment provider should be used for specific currencies or markets.

Navigate to:

```text
Settings → Payment Routing Rules
```

Configure:

* A default payment provider.
* Currency-specific routing overrides.
* Local payment rail preferences.

Example:

| Currency | Route To |
| -------- | -------- |
| NGN      | Monnify  |
| KES      | M-Pesa   |
| USD      | Stripe   |
| Other    | Paystack |

These rules can be updated without releasing a new version of your application.

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
* and local payment rails such as M-Pesa.

If a phone number is not available, M-Pesa can not be used, you can then pass empty string for the phone number field and SolydFlow will continue to function normally.

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

* Fast ( < 5ms )
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

### Checkout Experience

Depending on the configured routing rules, the customer may experience different payment flows.

Examples include:

* Hosted checkout pages (Paystack, Flutterwave, Stripe)
* Virtual account payments (Monnify)
* Native mobile money prompts (M-Pesa)

The SDK automatically selects and manages the appropriate flow.

No additional application logic is required.

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

# Web Integration (JavaScript & TypeScript)

SolydFlow provides a lightweight, framework-agnostic JavaScript SDK for web applications (React, Vue, Next.js, or Vanilla JS).

The JavaScript SDK provides the same core capabilities available on mobile, including:

* Dynamic pricing
* Purchasing Power Parity (PPP)
* Smart Upgrade Credits
* Entitlement management
* Subscription lifecycle tracking

It allows you to use the same pricing logic, entitlement system, and upgrade rules as your mobile applications while maintaining a separate web checkout flow.
This allows customers to purchase and manage subscriptions from your website while maintaining a single source of truth across platforms.

## Mobile vs Web Purchase Flow

The purchase experience differs slightly between mobile and web platforms.

### Mobile SDK

```text
User
 ↓
In-App Purchase Flow
 ↓
Payment Completed
 ↓
CustomerInfo Returned
 ↓
Entitlement Activated
```

The SDK waits for the purchase flow to complete and returns an updated `CustomerInfo` object immediately.

### Web SDK

```text
User
 ↓
Hosted Checkout Page
 ↓
Payment Completed
 ↓
Webhook Sent
 ↓
Backend Updated
 ↓
Entitlement Activated
```

Because the browser is redirected to a hosted checkout page, the web application cannot wait for payment completion.

Instead, SolydFlow notifies your backend using webhooks after the transaction has been verified.


---

## 1. Installation

Install directly from GitHub:

```bash id="n3kq9v"
npm install git+https://github.com/solydflow/solydflow-js.git
```

or:

```bash id="d9x2kq"
yarn add git+https://github.com/solydflow/solydflow-js.git
```

---

## 2. Initialization

Initialize the SDK as early as possible in your web application.

```javascript id="p2x8la"
import { SolydFlow } from "solydflow-js";

await SolydFlow.configure(
  "sf_pk_live_YOUR_PUBLIC_KEY",
  "user_12345"
);
```

---

## 3. Checking Access

Check whether the current user has an active entitlement.

```javascript id="c8v1mz"
async function checkAccess() {
  const isGold = await SolydFlow.hasEntitlement("gold_access");

  if (isGold) {
    console.log("Welcome to the premium dashboard!");
  } else {
    // Redirect to pricing page
  }
}
```

---

## 4. Fetching Dynamic Pricing

Fetch packages configured in your SolydFlow dashboard.

SolydFlow automatically applies:

* Purchasing Power Parity (Geo-IP pricing)
* Smart Upgrade Credits
* User-based pricing rules

```javascript id="k1q9dp"
async function renderPaywall() {
  const offerings = await SolydFlow.getOfferings();

  offerings.forEach(pkg => {
    if (pkg.is_upgrade) {
      console.log(
        `Upgrade for ${pkg.currency} ${pkg.calculated_amount_kobo / 100}`
      );
    } else {
      console.log(
        `Standard Price: ${pkg.currency} ${pkg.amount_kobo / 100}`
      );
    }
  });
}
```

---

## 5. Making a Purchase (Web Redirect Flow)

When a user initiates a purchase, they are redirected to a secure hosted checkout page.

> ⚠️ Web Flow Difference:
> Unlike the mobile SDK (which returns `CustomerInfo` directly), the web SDK redirects the user to a hosted payment page. Your application does not wait for completion.

```javascript id="m8v2kc"
async function handleCheckout(packageId) {
  try {
    await SolydFlow.purchasePackage(
      packageId,
      "2348012345678"
    );

    // Redirect occurs automatically.
    // Code below will not execute immediately.
  } catch (error) {
    console.error("Checkout failed:", error.message);
  }
}
```

---

## 6. Handling Completed Purchases (Webhooks)

Because web applications cannot directly observe payment completion, SolydFlow uses backend webhooks.

### Setup Steps

1. Go to SolydFlow Console → Projects
2. Open your project settings
3. Locate **Webhook Configuration**
4. Add your backend endpoint (e.g. Node.js, Supabase, or serverless function)

---

### Webhook Event Flow

When a payment is completed:

```text id="q8w1zp"
Customer → Checkout → Payment Provider → SolydFlow → Webhook → Your Backend
```

SolydFlow sends a `subscription_renewed` event to your backend.

Your backend should then:

* Validate the event
* Update user subscription state
* Activate entitlements in your database

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