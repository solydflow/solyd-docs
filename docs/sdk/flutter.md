---
id: flutter
title: Flutter Mobile SDK
sidebar_label: Flutter (Mobile)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Flutter Mobile SDK

The **`solydflow_flutter`** SDK connects your Flutter application (iOS and Android) to SolydFlow's unified billing infrastructure, consensus engine, and offline entitlement cache.

```text
[1. Add to pubspec.yaml] ➔ [2. Configure on Launch] ➔ [3. Render Paywall or Custom UI] ➔ [4. Instant Offline Gating (<5ms)]
```

---

## 1. Installation & Requirements

Add `solydflow_flutter` to your `pubspec.yaml`:

```yaml title="pubspec.yaml"
dependencies:
  flutter:
    sdk: flutter

  solydflow_flutter:
    git:
      url: https://github.com/solydflow/solydflow_flutter.git
      path: sdk_flutter
      ref: v0.9.0
```

Run in your terminal:
```bash
flutter pub get
```

### Platform Configuration

#### Android Setup
SolydFlow requires **Android API Level 21 (Android 5.0 Lollipop)** or higher for hardware-backed AES-GCM local storage encryption.

In `android/app/build.gradle` (or `build.gradle.kts`):

```groovy title="android/app/build.gradle"
android {
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
    }
}
```

#### iOS Setup
Ensure your deployment target in `ios/Podfile` is set to **iOS 13.0** or higher:

```ruby title="ios/Podfile"
platform :ios, '13.0'
```

---

## 2. Initialize SolydFlow

Initialize SolydFlow as early as possible in your application lifecycle (ideally inside `main()` or right after user sign-in):

```dart title="lib/main.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize SolydFlow before rendering root widget
  await SolydFlow.configure(
    apiKey: "sf_pk_live_44019283bc918237fa", // Your Public Key
    userID: "usr_supabase_991823",          // Authenticated User ID
    userEmail: "customer@example.com",       // Customer email (receipts & disputes)
    userPhone: "+2348012345678",             // E.164 phone (Required for M-Pesa STK)
  );

  runApp(const MyApp());
}
```

---

## 3. Choose Your Paywall Strategy

| Strategy | When to Use | Effort |
| :--- | :--- | :--- |
| **Option A: No-Code Drop-In Paywall** | Fast integration with dashboard-managed design and pricing. | **1 function call** |
| **Option B: Custom UI Paywall** | Complete control over Flutter layout, design system, and animations. | Full custom widget |

---

### Option A: No-Code Paywall (`SolydPaywall`)

Launch the paywall designed and published directly from your SolydFlow Console:

```dart title="lib/screens/home_screen.dart"
void openNoCodePaywall(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => SolydPaywall(
      onPurchaseSuccess: (CustomerInfo info) {
        Navigator.pop(ctx);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("🎉 Subscription Unlocked!")),
        );
      },
      onClose: () => Navigator.pop(ctx),
    ),
  );
}
```

---

### Option B: Custom UI Paywall Example

Fetch offerings and render your own widgets with dynamic currency formatting and upgrade credit calculations:

```dart title="lib/screens/custom_paywall.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

class CustomPaywallScreen extends StatefulWidget {
  const CustomPaywallScreen({super.key});

  @override
  State<CustomPaywallScreen> createState() => _CustomPaywallScreenState();
}

class _CustomPaywallScreenState extends State<CustomPaywallScreen> {
  List<SolydPackage> _packages = [];
  bool _isLoading = true;
  String? _purchasingId;

  @override
  void initState() {
    super.initState();
    _loadOfferings();
  }

  Future<void> _loadOfferings() async {
    try {
      final offerings = await SolydFlow.getOfferings();
      setState(() {
        _packages = offerings;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      debugPrint("Failed to load packages: $e");
    }
  }

  Future<void> _buyPackage(SolydPackage pkg) async {
    setState(() => _purchasingId = pkg.identifier);

    try {
      // 1. Trigger purchase modal / payment rail
      final CustomerInfo? customerInfo = await SolydFlow.purchasePackage(
        context,
        pkg.identifier,
      );

      // 2. User dismissed modal without paying
      if (customerInfo == null) return;

      // 3. Confirm entitlement unlocked
      if (customerInfo.activeEntitlements["pro_access"] == true) {
        if (!mounted) return;
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("🚀 Pro Access Unlocked!")),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Purchase failed: $e")),
      );
    } finally {
      if (mounted) setState(() => _purchasingId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: const Text("Select Subscription")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _packages.length,
        itemBuilder: (context, index) {
          final pkg = _packages[index];
          final isBuying = _purchasingId == pkg.identifier;

          // Convert smallest currency unit (kobo/cents)
          final double basePrice = pkg.amountMinor;
          final double netPrice = (pkg.isUpgrade ? pkg.calculatedAmountMinor : pkg.amountMinor);

          return Card(
            elevation: 2,
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Row(
                children: [
                  Text(pkg.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  if (pkg.isUpgrade) ...[
                    const SizedBox(width: 8),
                    const Text("UPGRADE CREDIT", style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ],
              ),
              subtitle: pkg.isUpgrade
                  ? Text("Save on upgrade: ${pkg.currency} $netPrice / ${pkg.duration}")
                  : Text("${pkg.currency} $basePrice / ${pkg.duration}"),
              trailing: isBuying
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _purchasingId == null ? () => _buyPackage(pkg) : null,
                      child: Text(pkg.isUpgrade ? "Upgrade" : "Subscribe"),
                    ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 4. Checking Entitlements (Offline-First)

Check whether a user has access anywhere in your application. This call reads from the device's hardware-encrypted local store in **< 5ms** without blocking your UI:

```dart title="lib/screens/dashboard.dart"
Future<void> onFeatureClick(BuildContext context) async {
  final bool isPro = await SolydFlow.hasEntitlement("pro_access");

  if (isPro) {
    Navigator.pushNamed(context, "/pro-tools");
  } else {
    Navigator.pushNamed(context, "/paywall");
  }
}
```

---

## 5. Testing Orphaned Transaction Recovery

Verify that SolydFlow restores subscriptions even if the user loses connection or force-closes the app mid-checkout:

1. Start a purchase on a physical device.
2. Complete the payment authorization (e.g. enter simulator OTP).
3. **Immediately force-close the app** before the success screen appears.
4. Wait **15 to 30 seconds**.
5. Reopen the application.
6. Check access:

```dart
bool hasAccess = await SolydFlow.hasEntitlement("pro_access");
print("Restored Access: $hasAccess"); // Returns true ✅
```

---

## Related Documentation

* **[JavaScript / Web SDK →](./javascript.md)**
* **[React Native SDK →](./react-native.md)**
* **[Entitlements Architecture →](../concepts/entitlements.md)**
* **[Orphaned Transactions →](../recover/orphaned-transactions.md)**

