---
id: smart-routing
title: Smart Payment Routing
sidebar_label: Smart Routing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Smart Payment Routing

Smart Payment Routing dynamically selects the most reliable payment gateway for a customer based on their currency, geographical location, payment method, and real-time provider uptime.

```text
[1. Customer Checkout] ➔ [2. Inspect Currency & Geo-IP] ➔ [3. Evaluate Routing Rules] ➔ [4. Route to Optimal Gateway]
```

Instead of hardcoding gateway choices into your mobile app or website, routing decisions are configured centrally in the SolydFlow Console and executed automatically at checkout.

---

## The Production Routing Matrix

Below is a typical multi-market routing configuration across African and global payment rails:

| Currency | Market | Primary Gateway | Preferred Local Rail | Backup / Failover Rail |
| :--- | :--- | :--- | :--- | :--- |
| **`NGN`** | Nigeria | **Paystack** | Local Debit Cards & USSD | **Monnify** (Virtual Accounts) |
| **`KES`** | Kenya | **M-Pesa (Daraja)** | Native STK Push Prompt | **Paystack** (Cards / M-Pesa) |
| **`GHS`** | Ghana | **Flutterwave** | MTN Mobile Money & Telecel | **Paystack** |
| **`ZAR`** | South Africa | **Paystack** | Instant EFT & Local Cards | **Stripe** |
| **`USD` / `EUR`**| Global / International | **Stripe** | 3D-Secure Cards & Apple Pay | **Paystack** (Intl Cards) |

---

## Anti-Pattern vs. SolydFlow Smart Routing

### ❌ The Anti-Pattern: Hardcoded Gateway Spaghetti
When applications handle provider selection manually, adding or updating a gateway requires building, testing, and shipping an entire mobile app release:

```typescript title="❌ Fragile & Unmaintainable"
// Client app has to bundle 4 different payment SDKs
if (user.currency === "KES") {
  launchMpesaSTKPush(user.phone);
} else if (user.currency === "NGN" && user.wantsBankTransfer) {
  launchMonnifyVirtualAccount();
} else if (user.currency === "USD") {
  launchStripePaymentSheet();
} else {
  launchPaystackModal();
}
```

---

### ✅ The SolydFlow Way: Single Unified SDK Call
Your application only initiates the checkout against the package. SolydFlow evaluates routing rules on the fly and opens the appropriate payment interface:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/checkout.dart"
// 1 single call automatically triggers M-Pesa STK in Kenya,
// Paystack/Monnify in Nigeria, or Stripe internationally:
final CustomerInfo? info = await SolydFlow.purchasePackage(
  context,
  "pro_monthly",
);
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/checkout.ts"
// Automatically redirects to the Smart-Routed gateway
await SolydFlow.purchasePackage("pro_monthly", "+2348012345678");
```

</TabItem>
</Tabs>

---

## Configuring Routing Rules in the Console

You manage routing rules from **SolydFlow Console → Project Settings → Payment Routing Rules**:

```text
┌─────────────────────────────────────────────────────────────┐
│ Payment Routing Configuration                               │
├─────────────────────────────────────────────────────────────┤
│ Default Global Route:       [ Stripe (USD / EUR)          ▼]│
│                                                             │
│ Regional Overrides:                                         │
│ 1. IF Currency = NGN  ➔  Route to: [ Paystack Card / USSD ▼]│
│ 2. IF Currency = KES  ➔  Route to: [ M-Pesa STK Push     ▼]│
│ 3. IF Currency = GHS  ➔  Route to: [ Flutterwave MoMo    ▼]│
│                                                             │
│ [ Save & Deploy Over-The-Air (No App Update Required) ]     │
└─────────────────────────────────────────────────────────────┘
```

When you update a rule in the console (e.g. switching your Nigerian card route from Paystack to Monnify), the change takes effect immediately across all active iOS, Android, and Web clients.

---

## Routing vs. Failover

It is important to separate these two concepts:

* **Smart Routing** determines which gateway to use **before** the customer pays (based on currency, region, and method).
* **Provider Failover** determines what to do **after** an initial route encounters an unexpected outage (safely switching to a backup rail without double-charging).

---

## Related Documentation

* **[Enforce Overview →](./overview.md)**
* **[Provider Failover →](./provider-failover.md)**
* **[Transaction Finality →](./transaction-finality.md)**
* **[Regional Pricing & PPP →](../monetization/regional-pricing.md)**
