---
id: simulate-failures
title: Simulating Payment Failures
sidebar_label: Simulate Failures
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Simulating Payment Failures

Testing failure states is just as important as testing successful purchases. You must ensure that declined cards, cancelled PIN prompts, and insufficient funds do not grant free access or leave users stranded with frozen screens.

```text
[1. Enter Decline Test Card] ➔ [2. Provider Returns Decline] ➔ [3. SolydFlow Commits FAILED_DECLINED] ➔ [4. App Displays Retry UI]
```

---

## Failure Trigger Matrix Across Gateways

Use these test card numbers and simulator prompts to test specific failure conditions:

| Failure Scenario | Gateway | Test Input / Card Number | CVV / PIN | Expected State |
| :--- | :--- | :--- | :--- | :--- |
| **Card Declined** | **Paystack** | `4084 0841 0000 0001` | `408` | **`FAILED_DECLINED`** |
| **Insufficient Balance** | **Paystack** | `4084 0841 0000 0002` | `408` | **`FAILED_DECLINED`** |
| **Generic Card Decline**| **Stripe** | `4000 •••• •••• 0002` | `123` | **`FAILED_DECLINED`** |
| **Insufficient Funds** | **Stripe** | `4000 •••• •••• 0996` | `123` | **`FAILED_DECLINED`** |
| **Declined Card** | **Flutterwave**| `4444 •••• •••• 4441` | `123` | **`FAILED_DECLINED`** |
| **User Cancelled PIN** | **M-Pesa** | Select "Cancel" on SIM simulator | `ResultCode: 1032` | **`FAILED_DECLINED`** |
| **Wrong M-Pesa PIN** | **M-Pesa** | Enter invalid 4-digit PIN | `ResultCode: 2001` | **`FAILED_DECLINED`** |

---

## How to Simulate Failures in the Simulator

1. Open the [SolydFlow Console](https://console.solydflow.com) and navigate to **Solyd Simulator**.
2. Ensure **Execution Mode** is set to `Test (Sandbox)`.
3. Select your simulated currency (e.g. `NGN`, `USD`, or `KES`).
4. Click **Simulate Checkout** on your package.
5. In the payment modal, enter one of the decline cards from the matrix above (e.g., Paystack `4084 0841 0000 0001`).
6. Click **Pay**. The gateway will immediately reject the payment.

---

## Post-Failure Verification Checklist

After simulating a decline, verify the following in the SolydFlow Console:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Console Checkpoint                    │ Expected Behavior                                      │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **1. Transactions Ledger**            │ State is recorded as **`FAILED_DECLINED`**.            │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **2. Customer Directory**             │ Entitlement remains **`null` / inactive**.             │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **3. Outbound Webhooks**              │ **No** `subscription_started` webhook was fired.       │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Handling Failures in Application Code

Your client application should handle the three possible checkout outcomes cleanly:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/checkout_screen.dart"
Future<void> handlePurchase(BuildContext context, String packageId) async {
  try {
    final CustomerInfo? info = await SolydFlow.purchasePackage(context, packageId);

    // Case 1: User voluntarily dismissed or cancelled modal
    if (info == null) {
      debugPrint("User dismissed the checkout sheet.");
      return;
    }

    // Case 2: Success
    if (info.activeEntitlements["pro_access"] == true) {
      Navigator.pop(context);
    }
  } catch (error) {
    // Case 3: Gateway Declined / Network Failure
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Payment unsuccessful: $error"),
        backgroundColor: Colors.red,
        action: SnackBarAction(
          label: "Try Another Card",
          onPressed: () => handlePurchase(context, packageId),
        ),
      ),
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/checkout.ts"
import { SolydFlow } from "solydflow-js";

async function buyPlan(packageId: string) {
  try {
    await SolydFlow.purchasePackage(packageId, "+2348012345678");
  } catch (err: any) {
    // Graceful error prompt
    alert(`Payment could not be completed: ${err.message}`);
  }
}
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Sandbox Overview →](./overview.md)**
* **[Testing Successful Transactions →](./test-transactions.md)**
* **[Testing Recovery Workflows →](./testing-recovery.md)**
* **[Transaction States Lifecycle →](../concepts/transaction-states.md)**
