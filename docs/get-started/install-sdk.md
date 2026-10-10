---
id: install-sdk
title: Installing the SDK
sidebar_label: Install SDK
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing the SolydFlow SDK

SolydFlow provides native client SDKs designed for zero-latency offline entitlement checks, smart payment routing, and automated purchase recovery.

---

## Supported Platforms & SDKs

| Platform / Framework | Package / Source | Minimum Requirement | Docs |
| :--- | :--- | :--- | :--- |
| **Flutter** | `solydflow_flutter` | Flutter 3.0+ / Dart 3.0+ | **[Flutter SDK →](../sdk/flutter.md)** |
| **JavaScript / TypeScript** | `solydflow-js` | ES6+ / Node 18+ / Browsers | **[JavaScript SDK →](../sdk/javascript.md)** |
| **React Native** | `@solydflow/react-native` | React Native 0.70+ | **[React Native SDK →](../sdk/react-native.md)** |
| **iOS (Swift)** | `SolydFlowSwift` | iOS 14.0+ | **[Swift SDK →](../sdk/swift.md)** |
| **Android (Kotlin)** | `com.solydflow.android` | API Level 21+ | **[Kotlin SDK →](../sdk/kotlin.md)** |

---

## 1. Flutter Installation

### Add to `pubspec.yaml`

Add the SolydFlow Flutter package to your dependencies:

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

Install via terminal:

```bash
flutter pub get
```

### Platform Requirements

#### Android Configuration
SolydFlow requires **Android API Level 21 (Android 5.0 Lollipop)** or higher for hardware-backed AES-GCM local storage encryption.

Check `android/app/build.gradle` (or `build.gradle.kts`):

```groovy title="android/app/build.gradle"
android {
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
    }
}
```

#### iOS Configuration
Ensure your deployment target is at least **iOS 13.0**:

```ruby title="ios/Podfile"
platform :ios, '13.0'
```

---

## 2. JavaScript / TypeScript Installation

Install the lightweight, framework-agnostic web client (works with React, Next.js, Vue, Nuxt, Svelte, or Vanilla JS):

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install solydflow-js
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```bash
yarn add solydflow-js
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add solydflow-js
```

</TabItem>
</Tabs>

### Verification Import

Verify your setup by importing the module:

```typescript title="src/main.ts"
import { SolydFlow } from "solydflow-js";

console.log("SolydFlow SDK loaded successfully");
```
