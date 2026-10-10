---
id: transaction-state-mismatch
title: "Troubleshooting: State Mismatches"
sidebar_label: State Mismatches
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Troubleshooting: State Mismatches

A **State Mismatch** occurs when your payment gateway dashboard and SolydFlow show conflicting information for the same checkout reference.

```text
[1. Identify Discrepancy] ➔ [2. Compare Gateway vs. Ledger] ➔ [3. Click "Verify Now" in Console] ➔ [4. State Harmonized]
```

---

## The 3 Common Mismatch Scenarios

| Discrepancy | Gateway State | SolydFlow State | Root Cause | How to Fix |
| :--- | :--- | :--- | :--- | :--- |
| **1. Stranded Settlement** | `Successful` | `Pending` | Inbound webhook was dropped or delayed by mobile carrier. | Click **"Verify Now"** in Console, or wait for the Sweeper to query the API. |
| **2. Client Spoof Attempt** | `Failed / None` | `Successful` (Client claims) | User modified app binary or replayed a mock response. | SolydFlow rejects client claims automatically. Access remains locked. |
| **3. Post-Payment Dispute** | `Refunded / Disputed` | `Active` | Customer filed a chargeback directly with their bank. | SolydFlow transitions state to `REVOKED_REFUND` upon receiving the refund event. |

---

## Step-by-Step Resolution: The "Verify Now" Fix

If your gateway dashboard (Paystack, Stripe, or Flutterwave) shows that a payment cleared, but SolydFlow still displays `PENDING`:

```text
[Gateway Shows "Success"] ➔ [Open SolydFlow Transactions Ledger] ➔ [Click "Verify Now"] ➔ [State Settled in 2 Seconds]
```

1. Copy the **Payment Reference** from your gateway dashboard (e.g. `ref_pstk_89283ab71928` or Stripe `pi_3Mzx...`).
2. Log in to the [SolydFlow Console](https://console.solydflow.com).
3. Navigate to **Transactions Ledger** and search for the reference.
4. Click on the transaction row to open the details drawer.
5. In the top-right corner, click **"Verify Now"**.
6. SolydFlow will instantly issue an authenticated REST request to the gateway using your encrypted Vault keys:
   * The status transitions to **`SETTLED_CONSENSUS`**.
   * The entitlement is granted immediately.
   * An append-only audit event is added to the ledger log.

---

## Synchronizing the Client Device

Once resolved in the console, the customer's mobile or web app will update its encrypted cache on the next network cycle. 

To force an immediate re-check in code:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/settings_screen.dart"
// Calling getCustomerInfo() forces the SDK to fetch the latest
// verified cloud ledger state and update the local encrypted store:
Future<void> refreshAccess(BuildContext context) async {
  final CustomerInfo info = await SolydFlow.getCustomerInfo();

  if (info.activeEntitlements["pro_access"] == true) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("✅ Access synchronized successfully!")),
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/access.ts"
import { SolydFlow } from "solydflow-js";

// Re-fetches current ledger truth from the cloud:
const customerInfo = await SolydFlow.getCustomerInfo();
console.log("Updated entitlements:", customerInfo.active_entitlements);
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Troubleshooting Overview →](./overview.md)**
* **[State Mismatches Architecture →](../truth/state-mismatches.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
