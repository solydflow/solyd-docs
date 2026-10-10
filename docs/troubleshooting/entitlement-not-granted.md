---
id: entitlement-not-granted
title: "Troubleshooting: Entitlement Not Granted"
sidebar_label: Entitlement Not Granted
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Troubleshooting: Entitlement Not Granted

If a customer successfully completes checkout and funds are debited from their account, but your application keeps premium features locked, use this guide to identify the breakdown.

```text
[1. Confirm Ledger: SETTLED_CONSENSUS] ➔ [2. Verify Package Mapping in Console] ➔ [3. Check for String Typo in Code] ➔ [4. Force Client Cache Sync]
```

---

## The 4 Most Common Causes

| Issue | What Happened | How to Fix in 60 Seconds |
| :--- | :--- | :--- |
| **1. Unmapped Package** | You created the package (e.g. `pro_monthly_ngn`), but forgot to link it to an Entitlement in the Console. | Go to **Console → Pricing & Products**, edit the package, and select your Entitlement (e.g. `pro_access`). |
| **2. String Typo in Code** | Your Flutter/Web code calls `hasEntitlement("pro_tier")`, but the Console identifier is `pro_access`. | Ensure the string in code matches the exact slug in **Console → Entitlements**. |
| **3. Transaction Still Pending** | The customer paid via USSD or Bank Transfer, but the bank switch is still clearing. | Entitlements **only** unlock when state reaches `SETTLED_CONSENSUS`. Wait for the Sweeper to settle it. |
| **4. User ID Disconnect** | The customer paid as an anonymous guest (`anon_123`), but your app is now checking entitlements for `usr_999`. | Call `SolydFlow.configure()` with the permanent ID to link anonymous purchases. |

---

## Step 1: Verify Ledger Finality in the Console

Entitlements are **never granted on pending states**.

1. Open the [SolydFlow Console](https://console.solydflow.com) and navigate to **Transactions Ledger**.
2. Locate the customer's transaction.
3. Check the **Current State**:
   * **`SETTLED_CONSENSUS` (Green):** The payment was verified. The problem is either a string typo in your app code or an unmapped package.
   * **`PENDING` / `RECOVERING` (Yellow):** Funds have not cleared. Access will unlock once the bank settles.
   * **`FAILED_DECLINED` (Red):** The bank declined the charge. Access was correctly withheld.

---

## Step 2: Confirm Package Entitlement Mapping

In SolydFlow, Packages are the items purchased, while Entitlements represent access:

```text
[Package: pro_monthly_ngn] ──── MUST MAP TO ────▶ [Entitlement: pro_access]
```

1. In the Console, go to **Pricing & Products**.
2. Click on the package the user purchased (e.g. `pro_monthly_ngn`).
3. Verify that **Mapped Entitlement** points to your intended entitlement (e.g., `pro_access`).
4. If it says **"None"**, select the entitlement and click **Save Changes**.

---

## Step 3: Inspect Client State with Debugging Code

To inspect what entitlements the user's device currently holds in its encrypted cache, run this diagnostic check:

<Tabs>
<TabItem value="flutter" label="Flutter Diagnostic Snippet" default>

```dart title="lib/screens/debug_screen.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

Future<void> debugCustomerState() async {
  final CustomerInfo info = await SolydFlow.getCustomerInfo();

  debugPrint("=== SOLYDFLOW DIAGNOSTIC DUMP ===");
  debugPrint("Active Entitlements: ${info.activeEntitlements}");
  debugPrint("All Entitlements (with Expiry): ${info.allEntitlements}");

  // Diagnostic Checks:
  if (info.activeEntitlements.isEmpty) {
    debugPrint("⚠️ Warning: No active entitlements found for this user ID.");
  } else if (info.activeEntitlements["pro_access"] != true) {
    debugPrint("⚠️ Warning: User has entitlements, but NOT 'pro_access'. Check for spelling typos!");
  } else {
    debugPrint("✅ 'pro_access' is active! Check your UI conditional logic.");
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/debug.ts"
import { SolydFlow } from "solydflow-js";

async function debugState() {
  const info = await SolydFlow.getCustomerInfo();
  
  console.log("Active Entitlements:", info.active_entitlements);
  console.log("Expiration Dates:", info.all_entitlements);

  if (!info.active_entitlements["pro_access"]) {
    console.warn("User does not hold 'pro_access'. Verify package mapping in console.");
  } else {
    console.log("✅ Entitlement is active!");
  }
}
```

</TabItem>
</Tabs>

---

## Step 4: Resolving User ID Aliasing

If a user started checkout before registering an account:

```dart
// 1. User starts as guest:
await SolydFlow.configure(apiKey: "sf_pk_...", userID: "anon_991823");

// 2. User registers permanently:
// Always re-configure with permanent ID so SolydFlow transfers entitlements:
await SolydFlow.configure(apiKey: "sf_pk_...", userID: "usr_permanent_48102");
```

---

## Related Documentation

* **[Troubleshooting Overview →](./overview.md)**
* **[Entitlements Architecture →](../concepts/entitlements.md)**
* **[Products & Packages Catalog →](../concepts/products-and-packages.md)**
* **[Transaction Finality →](../enforce/transaction-finality.md)**

