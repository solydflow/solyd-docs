---
id: transaction-recovery
title: Transaction Recovery
sidebar_label: Transaction Recovery
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transaction Recovery

Transaction recovery is the automated process of investigating and resolving payments that did not complete cleanly due to dropped connections, closed apps, or missing webhooks.

```text
[1. Payment Stalls] ➔ [2. Sweeper Queries Gateway] ➔ [3. Truth Verified] ➔ [4. Entitlement Granted]
```

---

## The Golden Rule: Verify, Never Recharge

A common mistake in payment integrations is treating an unresolved transaction as a failure and prompting the customer to pay again. This leads to duplicate charges.

SolydFlow follows a strict verification principle:

| Action | Is it Safe? | What SolydFlow Does |
| :--- | :--- | :--- |
| **Re-querying the Gateway API** | ✅ **Safe** | Queries Paystack, Stripe, or M-Pesa using the existing transaction reference to check if funds cleared. |
| **Recharging the Customer** | ❌ **Dangerous** | **Never done.** SolydFlow will never initiate a second debit on an unresolved payment attempt. |

---

## The 3 Recovery Scenarios

When a transaction enters recovery, the **Consensus Engine** determines the real financial outcome:

| Scenario | What Happened at the Bank | SolydFlow Action | Customer Experience |
| :--- | :--- | :--- | :--- |
| **1. Customer was debited** | Payment succeeded, but the app dropped the connection before confirmation. | Queries gateway, confirms settlement, writes `SETTLED_CONSENSUS`. | **Access unlocked immediately.** No support ticket needed. |
| **2. Customer was declined** | Card expired, bad PIN, or insufficient funds. | Queries gateway, confirms failure, marks `FAILED_DECLINED`. | Prompted to try again with a clear error message. |
| **3. Bank is still clearing** | Interbank transfer or USSD is still processing. | Keeps status as `RECOVERING` and re-checks on a short backoff. | Customer sees "Processing payment... Check back shortly." |

---

## How It Works in Your Application

You don't need to write manual polling loops. The SDK handles recovery in the background:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/dashboard.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

// When the user opens the app, hasEntitlement automatically checks local
// encrypted storage first, then syncs any recovered transactions from the server.
Future<void> checkAccessOnAppLaunch() async {
  final bool isPro = await SolydFlow.hasEntitlement("pro_access");

  if (isPro) {
    debugPrint("✅ Access granted (including any recovered transactions)");
  } else {
    debugPrint("🔒 Features locked");
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/access.ts"
import { SolydFlow } from "solydflow-js";

export async function verifyUserAccess(): Promise<boolean> {
  // Returns true immediately if a recovered transaction was settled
  return await SolydFlow.hasEntitlement("pro_access");
}
```

</TabItem>
</Tabs>

---

## Testing Recovery: The "Force-Close" Test

Use this simple 5-step test to verify that transaction recovery is working properly in your app:

1. **Start a test purchase** on a physical mobile device or browser.
2. Complete the payment authorization (e.g. enter test card OTP or approve simulator prompt).
3. **Immediately force-close the app** before the success screen appears.
4. Wait **15 to 30 seconds** for the gateway settlement to register.
5. **Re-open the app** and check access:

```dart
bool hasAccess = await SolydFlow.hasEntitlement("pro_access");
print("Has Access: $hasAccess"); // Output: true
```

### What this validates:
* The payment was completed at the provider.
* SolydFlow detected the orphaned checkout intent.
* The Consensus Engine verified the settlement server-to-server.
* Access was restored without the user needing to repeat the checkout.

---

## Related Documentation

* **[Orphaned Transactions →](./orphaned-transactions.md)**
* **[Handling Failed Webhooks →](./failed-webhooks.md)**
* **[Retries & Backoff →](./retries.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
