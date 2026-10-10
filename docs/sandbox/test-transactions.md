---
id: test-transactions
title: Testing Transactions
sidebar_label: Test Transactions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testing Transactions

The **Solyd Simulator** enables you to validate your end-to-end checkout experience, test multi-currency pricing, and verify entitlement grants in a safe sandbox environment without moving real money.

```text
[1. Select Simulated Region] ➔ [2. Launch Simulate Checkout] ➔ [3. Enter Gateway Test Credentials] ➔ [4. Verify SETTLED_CONSENSUS]
```

---

## Gateway Test Credentials Reference

Use these standard sandbox credentials when the simulator redirects to your configured payment gateway:

| Gateway Rail | Test Payment Method | Card / Phone Number | Expiry / CVV | Test OTP / PIN | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Paystack** | Visa / Mastercard Card | `4084 0841 0000 0000` | Future date / `408` | Any 4 digits / `123456` | `SETTLED_CONSENSUS` ✅ |
| **Stripe** | International Card | `4242 •••• •••• 4242` | Future date / `123` | N/A | `SETTLED_CONSENSUS` ✅ |
| **Flutterwave**| Pan-African Card | `4444 •••• •••• 4444` | Future date / `123` | `12345` | `SETTLED_CONSENSUS` ✅ |
| **M-Pesa** | Daraja STK Push | `254708374149` | N/A | Any 4 digits (Simulator) | `SETTLED_CONSENSUS` ✅ |
| **Monnify** | Virtual Bank Transfer | Copy test DVA account | N/A | Use "Simulate Transfer" | `SETTLED_CONSENSUS` ✅ |

---

## Step-by-Step Simulator Walkthrough

### 1. Open the Simulator
1. In the [SolydFlow Console](https://console.solydflow.com), open your project.
2. In the top navigation, select **Solyd Simulator**.
3. Set the **Execution Mode** to `Test (Sandbox)`.

### 2. Choose a Simulated Location & Currency
Select the country you want to test from the dropdown:
* **Nigeria (`NGN`):** Loads NGN packages and routes to Paystack/Monnify.
* **Kenya (`KES`):** Loads KES packages and routes to M-Pesa STK push.
* **United States (`USD`):** Loads USD packages and routes to Stripe.

### 3. Click "Simulate Checkout"
1. Locate your desired package (e.g., `pro_monthly_ngn`).
2. Click **Simulate Checkout**.
3. Inspect the **Routing Engine Log** on the right side of the screen to confirm that Smart Routing picked your expected gateway:
   ```text
   ROUTER DECISION: Smart Routing selected [PAYSTACK]
   ```
4. The provider's test modal opens. Enter the test card details from the table above and complete the payment.

---

## Post-Test Verification Checklist

Once the payment completes, verify the revenue flow across three tabs in the Console:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Verification Point                    │ What to Confirm in the Console                         │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **1. Transactions Ledger**            │ Transaction state is **`SETTLED_CONSENSUS`**.          │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **2. Customer Directory**             │ Test user has **`activeEntitlements: { "pro_access": true }`**. │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **3. Inbound Gateway Webhooks**       │ Inbound event logged HTTP `200 OK` with verified HMAC. │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Verifying in Your Application Code

If you are running the test from your Flutter or Web app using your `sf_pk_test_...` key, confirm that the entitlement unlocked immediately in code:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/test_screen.dart"
Future<void> verifySandboxAccess() async {
  final bool hasAccess = await SolydFlow.hasEntitlement("pro_access");
  debugPrint("Sandbox Pro Access: $hasAccess"); // Output: true
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/test.ts"
import { SolydFlow } from "solydflow-js";

const hasAccess = await SolydFlow.hasEntitlement("pro_access");
console.log("Sandbox Pro Access:", hasAccess); // Output: true
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Sandbox & Simulator Overview →](./overview.md)**
* **[Simulating Payment Failures →](./simulate-failures.md)**
* **[Testing Recovery Workflows →](./testing-recovery.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
