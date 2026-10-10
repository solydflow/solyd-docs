---
id: react-native
title: React Native SDK
sidebar_label: React Native
---

# React Native SDK

:::info{title="Status: Under Active Development 🚧"}
The official **`@solydflow/react-native`** package is currently in private preview. 

If you are building a cross-platform mobile application today, we recommend using our production-ready **[Flutter Mobile SDK](./flutter.md)**.
:::

---

## What to Expect

The React Native SDK will bring SolydFlow's core engine to React Native and Expo projects, featuring:

* **Hardware-Backed Offline Caching:** `<5ms` local entitlement checks using secure on-device storage.
* **Smart Payment Routing:** Native integration with African rails (M-Pesa, Paystack, Monnify) and global cards (Stripe).
* **Automated Recovery:** Background reconciliation for orphaned transactions and dropped connections.
* **Expo & Bare React Native Support:** Seamless setup without manual native linking conflicts.

---

## Planned API Preview

The React Native SDK will follow the same unified developer interface as our Flutter and JavaScript SDKs:

```tsx title="Planned Interface Preview"
import { SolydFlow } from "@solydflow/react-native";

// 1. Initialize
await SolydFlow.configure({
  apiKey: "sf_pk_live_44019283bc918237fa",
  userId: "usr_991823",
  userEmail: "customer@example.com",
  userPhone: "+2348012345678",
});

// 2. Fast Offline Entitlement Check (<5ms)
const isPro = await SolydFlow.hasEntitlement("pro_access");

// 3. Purchase Package
const customerInfo = await SolydFlow.purchasePackage("pro_monthly");
```

---

## Current Workaround for React Native Apps

If you are shipping a React Native application before the native library releases, you can monetize today by pairing `solydflow-js` with a secure web browser session:

1. Use **`solydflow-js`** to fetch localized package pricing and PPP calculations.
2. When the user taps "Subscribe", open the hosted payment redirect using `react-native-inappbrowser-reborn` or Expo's `WebBrowser.openAuthSessionAsync`.
3. Fulfill the purchase asynchronously via your backend webhook (`subscription_started`).

---

## Production-Ready Alternatives

* **[Flutter Mobile SDK →](./flutter.md)** (Full production support for iOS & Android)
* **[JavaScript / TypeScript SDK →](./javascript.md)** (Full production support for Web apps)
* **[SDK Overview →](./overview.md)**

