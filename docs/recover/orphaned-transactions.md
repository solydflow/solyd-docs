---
id: orphaned-transactions
title: Orphaned Transactions
sidebar_label: Orphaned Transactions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Orphaned Transactions

A **Orphaned Transaction** is a payment that remains stranded in an unresolved state because the customer's connection dropped or their app was killed before the gateway callback arrived.

```text
[1. App Disconnects] ➔ [2. Sweeper Detects Inactivity] ➔ [3. Queries Bank/Gateway] ➔ [4. State Settled]
```

To the user's bank, the money may have already cleared. But to your app, the checkout looks stuck. SolydFlow automatically revives these transactions and restores entitlements without manual developer intervention.

---

## Normal Pending vs. Orphaned vs. Abandoned

It is critical to distinguish between these three states to avoid double-charging users:

| Status | What Happened | Gateway State | SolydFlow Action |
| :--- | :--- | :--- | :--- |
| **Normal Pending** | Customer is actively entering card OTP or viewing the payment modal. | `processing` | Wait for user action. Do not interrupt. |
| **Orphaned Transaction** | User authorized payment (e.g. bank transfer/M-Pesa PIN), but closed app before redirect. | `successful` (at bank) | **Sweeper queries gateway directly** and unlocks entitlement. |
| **Abandoned Checkout** | User closed the paywall without entering any details or authorizing funds. | `abandoned` / `cancelled` | Marked as `FAILED_DECLINED`. Safe for user to restart. |

---

## How the Sweeper Resolves Orphaned Transactions

SolydFlow's **Sweeper Engine** continuously monitors transactions that have shown no progress for more than **45 seconds**.

```text
[T + 0:00] User initiates payment ➔ Connection drops mid-flight.
[T + 0:45] SolydFlow flags transaction as UNRESOLVED.
[T + 1:00] Sweeper Query #1: Checks gateway REST API using transaction reference.
           └─ If Settled: Marks SETTLED_CONSENSUS & unlocks entitlement.
[T + 5:00] Sweeper Query #2: Fallback query if bank was experiencing clearing delays.
[T + 15:00] Final sweep before marking as FAILED_DECLINED if bank confirms no payment.
```

:::tip{title="Zero Duplicate Charges"}
The Sweeper **never charges the user's card again**. It only asks the gateway: *"Did reference `ref_102938` ever get paid?"*
:::

---

## How Your Application Handles Unreconciled transactions

You do not need to build background polling services in your app. When the customer launches your app again, SolydFlow's SDK checks the cloud ledger and syncs any revived entitlements immediately:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/dashboard.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

Future<void> syncCustomerOnLaunch() async {
  // 1. Instantly checks local encrypted cache (<5ms)
  // 2. Silently syncs any transactions recovered by the Sweeper in the background
  final CustomerInfo info = await SolydFlow.getCustomerInfo();

  if (info.activeEntitlements["pro_access"] == true) {
    debugPrint("✅ Orphaned revived! User has pro access.");
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/index.ts"
import { SolydFlow } from "solydflow-js";

async function checkAccess() {
  // Returns true if the Sweeper confirmed a previously stranded payment
  const hasAccess = await SolydFlow.hasEntitlement("pro_access");
  
  if (hasAccess) {
    console.log("Subscription active via automated recovery");
  }
}
```

</TabItem>
</Tabs>

---

## Common Real-World Orphaned Scenarios

### Scenario A: Paystack Bank Transfer / USSD
1. User chooses **Pay with Bank Transfer** in Nigeria.
2. User minimizes your app to open their Kuda/GTBank mobile app and transfers ₦5,000.
3. The operating system terminates your app in the background to free RAM.
4. When the user re-opens your app 10 minutes later, the Sweeper has already verified the NIBSS settlement with Paystack and unlocked `pro_access`.

### Scenario B: M-Pesa STK Push Timeout
1. Kenyan user initiates checkout for KSh 500.
2. The user's screen goes to sleep while waiting for the Safaricom SIM toolkit prompt.
3. User enters their M-Pesa PIN on the lock screen, but the socket connection to your app is broken.
4. The Sweeper queries Daraja, matches the `CheckoutRequestID`, and logs `SETTLED_CONSENSUS`.

---

## Related Documentation

* **[Transaction Recovery Principles →](./transaction-recovery.md)**
* **[Handling Failed Webhooks →](./failed-webhooks.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
