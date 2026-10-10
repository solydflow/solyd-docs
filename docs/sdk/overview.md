---
id: overview
title: SDK Overview
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Overview

The **SolydFlow Client SDK** connects your mobile and web applications to SolydFlow’s revenue infrastructure.

```text
[1. Configure with User ID] ➔ [2. Fetch Localized Offerings] ➔ [3. Initiate Purchase] ➔ [4. Instant Offline Gating (<5ms)]
```

Instead of managing payment modals, network timeouts, and token encryption yourself, the SDK automates checkout flows, synchronizes customer state in the background, and caches entitlements locally using hardware-backed AES-GCM encryption.

---

## Supported Client SDKs

| Platform / Framework | Package / Source | Minimum OS / Runtime | Documentation |
| :--- | :--- | :--- | :--- |
| **Flutter (Dart)** | `solydflow_flutter` | Flutter 3.0+ / Dart 3.0+ | **[Flutter SDK →](./flutter.md)** |
| **JavaScript / TypeScript** | `solydflow-js` | ES6+ / Browsers / Node 18+ | **[JavaScript SDK →](./javascript.md)** |
| **React Native** | `@solydflow/react-native` | React Native 0.70+ | **[React Native SDK →](./react-native.md)** |
| **iOS (Swift)** | `SolydFlowSwift` | iOS 14.0+ | **[Swift SDK →](./swift.md)** |
| **Android (Kotlin)** | `com.solydflow.android` | API Level 21+ (Android 5.0) | **[Kotlin SDK →](./kotlin.md)** |

---

## Core SDK API Cheatsheet

All SolydFlow SDKs expose five core functions:

| Method | What It Does | Primary Use Case |
| :--- | :--- | :--- |
| **`configure()`** | Authenticates client and sets user identity. | Call immediately after user signs in. |
| **`getOfferings()`** | Returns active packages with PPP pricing. | Render your custom paywall or pricing table. |
| **`purchasePackage()`** | Launches Smart-Routed payment flow. | Triggered when user selects a plan. |
| **`hasEntitlement()`** | Returns boolean access (`<5ms` offline check). | Protect feature screens, tabs, and actions. |
| **`restorePurchases()`** | Re-syncs previous purchases from Apple/Google. | "Restore Purchases" button in app settings. |

---

## Initializing the SDK

Initialize SolydFlow as early as possible after user authentication:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/main.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SolydFlow.configure(
    apiKey: "sf_pk_live_44019283bc918237fa",
    userID: "usr_supabase_991823",
    userEmail: "customer@example.com",
    userPhone: "+2348012345678", // Enables M-Pesa STK & SMS churn recovery
  );

  runApp(const MyApp());
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/index.ts"
import { SolydFlow } from "solydflow-js";

await SolydFlow.configure(
  "sf_pk_live_44019283bc918237fa",
  "usr_supabase_991823",
  "customer@example.com",
  "+2348012345678"
);
```

</TabItem>
</Tabs>

---

## Simple Access Check vs. Full Customer Profile

Depending on your UI requirements, SolydFlow provides two ways to read access state:

### 1. Simple Access Check (Recommended for UI Navigation)
```dart
// Blazing fast (<5ms), reads from encrypted local storage, 100% offline-ready
bool isPro = await SolydFlow.hasEntitlement("pro_access");
```

### 2. Full Customer State (For Account & Settings Screens)
```dart
// Returns active entitlements, expiration DateTime, and purchase history
CustomerInfo info = await SolydFlow.getCustomerInfo();
DateTime? expiresAt = info.allEntitlements["pro_access"];
```

---

## Offline-First Guarantee

The SDK is built for emerging market network realities:

```text
[App Launch] ➔ [Read Encrypted Local Cache (<5ms)] ➔ [Unlock Features Instantly]
                                                          │
                                                          ▼
                                    [Sync with Server Silently in Background]
```

Subscribers on airplanes, subways, or unstable cellular networks never see blank screens or loading spinners when opening your app.

---

## Related Documentation

* **[Quickstart Guide →](../get-started/quickstart.md)**
* **[JavaScript / TypeScript SDK →](./javascript.md)**
* **[Flutter Mobile SDK →](./flutter.md)**
* **[Entitlements Architecture →](../concepts/entitlements.md)**
