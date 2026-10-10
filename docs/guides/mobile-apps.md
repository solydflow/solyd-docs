---
id: mobile-apps
title: Mobile Apps Integration Guide
sidebar_label: Mobile Apps
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Mobile Apps Integration Guide

This guide walks you through integrating SolydFlow into your iOS and Android mobile applications using our production-ready **Flutter Mobile SDK**.

```text
[1. Configure Packages & Store SKUs] ➔ [2. Initialize SDK on App Launch] ➔ [3. Display Paywall] ➔ [4. Instant Offline Gating (<5ms)]
```

SolydFlow gives mobile applications an offline-first revenue engine: subscribers retain access on airplanes or during network drops, dropped checkouts are rescued automatically, and purchases sync across devices.

---

## The Hybrid Mobile Monetization Model

Depending on your business model and target audience, SolydFlow lets you unify both traditional app store billing and emerging market domestic rails:

| Monetization Rail | Best For | Handled In SolydFlow |
| :--- | :--- | :--- |
| **Direct African Rails (M-Pesa, Paystack, Monnify)** | Emerging market users without credit cards linked to Apple ID or Google Play. | ✅ Supported natively via Smart Routing (USSD, STK Push, Virtual Accounts). |
| **Apple In-App Purchases (StoreKit 2)** | Global iOS users expecting FaceID / TouchID checkout. | ✅ Mapped to Package via `appleProductId`. |
| **Google Play Billing** | Global Android users paying via Google Play Store balances. | ✅ Mapped to Package via `googleProductId`. |

Regardless of how the customer pays, your application code only ever checks a single entitlement: **`pro_access`**.

---

## End-to-End Flutter Implementation

### 1. Initialize on App Launch

Configure SolydFlow in `main()` with your public key and authenticated user ID:

```dart title="lib/main.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize SolydFlow before rendering root UI
  await SolydFlow.configure(
    apiKey: "sf_pk_live_44019283bc918237fa",
    userID: "usr_firebase_991823",
    userEmail: "customer@example.com",
    userPhone: "+2348012345678", // Enables native M-Pesa STK prompt
  );

  runApp(const MyApp());
}
```

---

### 2. Feature Gating with Offline-First Caching

Check entitlement status anywhere in your widget tree. This call reads from the device's hardware-encrypted local storage in **< 5ms** without blocking the UI:

```dart title="lib/screens/dashboard_screen.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("My Workspace")),
      body: Center(
        child: FutureBuilder<bool>(
          future: SolydFlow.hasEntitlement("pro_access"),
          builder: (context, snapshot) {
            final hasPro = snapshot.data ?? false;

            if (hasPro) {
              return const Text("🚀 Premium Features Unlocked!");
            }

            return ElevatedButton(
              onPressed: () => _openPaywall(context),
              child: const Text("Unlock Pro Features"),
            );
          },
        ),
      ),
    );
  }

  void _openPaywall(BuildContext context) {
    // Launch console-designed paywall
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => SolydPaywall(
        onPurchaseSuccess: (info) {
          Navigator.pop(ctx);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("🎉 Subscription Active!")),
          );
        },
        onClose: () => Navigator.pop(ctx),
      ),
    );
  }
}
```

---

### 3. Adding the "Restore Purchases" Button

Apple and Google guidelines require mobile apps to provide a way for users to restore purchases when switching phones or reinstalling:

```dart title="lib/screens/settings_screen.dart"
Future<void> onRestoreTapped(BuildContext context) async {
  try {
    final CustomerInfo info = await SolydFlow.restorePurchases();

    if (info.activeEntitlements["pro_access"] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Purchases successfully restored!")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("No active subscriptions found to restore.")),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Restore failed: $e")),
    );
  }
}
```

---

## Automatic Orphaned Transaction Recovery

In mobile applications, users frequently minimize the app to check SMS verification codes, complete bank app transfers, or answer incoming calls.

If the app process is terminated before the success screen returns:
1. The payment settles at the bank or gateway.
2. The **SolydFlow Sweeper** detects the orphaned checkout and verifies consensus in the cloud.
3. The next time the user launches the app, `hasEntitlement("pro_access")` returns `true` immediately from the synced cache.

---

## Related Documentation

* **[Flutter SDK Reference →](../sdk/flutter.md)**
* **[No-Code vs. Custom Paywalls →](../concepts/paywalls.md)**
* **[Apple In-App Purchases →](../payment-providers/apple.md)**
* **[Google Play Billing →](../payment-providers/google-play.md)**
* **[Orphaned Transaction Recovery →](../recover/orphaned-transactions.md)**
