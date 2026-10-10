---
id: payment-pending
title: "Troubleshooting: Payment Remains Pending"
sidebar_label: Payment Pending
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Troubleshooting: Payment Remains Pending

In emerging markets, payments do not always settle instantly. A transaction may linger in `PENDING`, `PENDING_CHALLENGE`, or `RECOVERING` while bank networks or mobile telcos clear funds.

```text
[1. Copy Transaction ID] ➔ [2. Check Status in Gateway Dashboard] ➔ [3. Inspect Inbound Webhook Logs] ➔ [4. Force Verify in Console]
```

---

## The 3 Common Causes

| Cause | What Happened | Is Action Needed? | SolydFlow Behavior |
| :--- | :--- | :--- | :--- |
| **1. Interbank Clearing Delay** | User sent funds via bank transfer or USSD; central bank switch (NIBSS) is lagging. | ❌ **No.** Wait for settlement. | Sweeper monitors transaction and settles automatically when funds land. |
| **2. Customer Hasn't Entered PIN** | User is looking at the M-Pesa SIM prompt or waiting for a card OTP. | ❌ **No.** User is actively paying. | Kept in `PENDING_CHALLENGE` until customer authorizes. |
| **3. Dropped Gateway Webhook** | User paid, but gateway failed to notify SolydFlow due to network timeout. | ⚠️ **Automated Sweeper kicks in.** | Sweeper queries gateway REST API within 45s and commits `SETTLED_CONSENSUS`. |

:::warning{title="Never Grant Access on Pending States"}
Do not unlock premium features while a transaction is pending. If the customer cancels their PIN prompt or the bank transfer bounces, your app would leak unearned access.
:::

---

## Step-by-Step Diagnostic Walkthrough

### 1. Check the Transaction in the Console
1. Open the [SolydFlow Console](https://console.solydflow.com) and go to **Transactions Ledger**.
2. Search by the customer's user ID, email, or transaction reference (`ref_...`).
3. Inspect the **State Timeline**:
   * If state is **`UNRESOLVED_ORPHAN`**: The customer likely closed their app. The Sweeper is scheduled to query the bank within 45 seconds.
   * If state is **`RECOVERING`**: SolydFlow is actively querying the gateway REST verification endpoint.

### 2. Compare Against Your Gateway Dashboard
Log in to your payment provider dashboard (Paystack, Stripe, or Flutterwave):
* **If Gateway shows "Success":** The inbound webhook was likely blocked or dropped. Click **"Verify Now"** in the SolydFlow console to immediately achieve `SETTLED_CONSENSUS`.
* **If Gateway shows "Abandoned" or "Failed":** The customer never completed payment or their card was declined. The state will transition to `FAILED_DECLINED`.

---

## Client UI Best Practice: Handling Pending States

Never show an error screen while a payment is pending. Guide the user with clear status messaging:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/checkout_screen.dart"
void handlePendingState(BuildContext context, CustomerInfo? info) {
  // If user paid via bank transfer, access might settle in background
  if (info != null && info.activeEntitlements["pro_access"] != true) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Payment Processing"),
        content: const Text(
          "We are waiting for your bank to confirm the transfer. "
          "Your access will activate automatically in a few moments.",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Got It"),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / Web">

```typescript title="src/checkout.ts"
// If user returns from redirect but webhook hasn't fulfilled yet:
function displayPendingNotice() {
  document.getElementById("status-banner").innerHTML = `
    <div class="alert alert-info">
      Your payment is currently clearing with the bank. 
      Access will unlock automatically once confirmed.
    </div>
  `;
}
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Troubleshooting Overview →](./overview.md)**
* **[Orphaned Transactions →](../recover/orphaned-transactions.md)**
* **[Transaction States Lifecycle →](../concepts/transaction-states.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
