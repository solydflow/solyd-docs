---
id: transaction-finality
title: Transaction Finality
sidebar_label: Transaction Finality
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transaction Finality

**Transaction Finality** defines the exact point at which a payment state is authoritative and settled enough to trigger irreversible downstream actions: unlocking entitlements, halting retries, or preventing duplicate charges.

```text
[1. Transient State (Pending/Challenge)] ➔ [2. Consensus Verification] ➔ [3. Finality Established] ➔ [4. Enforce Entitlement]
```

In emerging market billing, payments frequently linger in intermediate states (e.g., USSD sessions or bank transfer clearing). Finality establishes the boundary between **a transaction that may still change** and **a transaction that can safely drive business logic**.

---

## The Danger of Premature Finality

Treating an intermediate state as final causes revenue leakage and customer confusion:

```text
❌ Premature Grant: User prompted for M-Pesa PIN (PENDING_CHALLENGE) ➔ App unlocks Pro ➔ User hits "Cancel" on phone ➔ Free access leaked!
```

```text
✅ SolydFlow Enforce: User prompted for M-Pesa PIN ➔ App holds state ➔ User enters PIN ➔ Consensus verifies settlement ➔ "pro_access" unlocked cleanly.
```

---

## The Master Finality Matrix

SolydFlow evaluates finality to determine which operations are permitted at any given moment:

| Transaction State | State Category | Is it Final? | Can Unlock Features? | Can Failover? | Can Customer Retry? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`INITIALIZED`** | Transient | ❌ No | ❌ No | ❌ No | ❌ Wait |
| **`PENDING_CHALLENGE`** | Transient | ❌ No | ❌ No | ❌ No | ❌ Wait (Entering PIN/OTP) |
| **`PROCESSING`** | Transient | ❌ No | ❌ No | ❌ No | ❌ Wait (Clearing Bank) |
| **`UNRESOLVED_ORPHAN`** | Transient | ❌ No | ❌ No | ⚠️ Hold & Verify | ❌ Wait (Sweeper Checking) |
| **`SETTLED_CONSENSUS`** | **Terminal Success** | ✅ **Yes** | ✅ **Yes (Grant)** | ❌ No | ❌ No (Already Paid) |
| **`FAILED_DECLINED`** | **Terminal Failure** | ✅ **Yes** | ❌ No | ✅ Yes (Backup Rail)| ✅ Yes (Clean Retry) |
| **`REVOKED_REFUND`** | **Terminal Reversal**| ✅ **Yes** | ❌ **Revoke Access**| ❌ No | ✅ Yes (New Checkout) |

---

## The 3 Terminal States in SolydFlow

Once a transaction enters a **Terminal State**, it achieves finality:

### 1. `SETTLED_CONSENSUS` (Terminal Success)
* **What it means:** The payment has been cryptographically confirmed by the Consensus Engine.
* **Enforce Action:** Automatically unlocks the mapped entitlement (e.g. `pro_access`), updates the encrypted device cache, and sends `subscription_started` to your backend.
* **Protection:** Blocks any subsequent charge attempts for this checkout session.

### 2. `FAILED_DECLINED` (Terminal Failure)
* **What it means:** The issuing bank or payment rail definitively rejected the transaction (e.g., card expired, invalid CVV, wrong PIN entered 3 times).
* **Enforce Action:** Features remain locked. The user receives a clear decline reason and can safely restart the checkout.

### 3. `REVOKED_REFUND` (Terminal Reversal)
* **What it means:** A dispute, chargeback, or administrative refund occurred post-settlement.
* **Enforce Action:** Enforce immediately kills the customer's active entitlement across all mobile and web devices.

---

## Developer Experience: Relying on Finality

Because SolydFlow enforces finality internally, your application code is insulated from all transient complexities:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/feature_screen.dart"
// SolydFlow.hasEntitlement() ONLY returns true when the underlying
// transaction has reached SETTLED_CONSENSUS finality.
Future<void> openProWorkspace(BuildContext context) async {
  final bool isPro = await SolydFlow.hasEntitlement("pro_access");

  if (isPro) {
    Navigator.pushNamed(context, "/pro-tools");
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Subscription is pending or inactive.")),
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/guards/auth.ts"
import { SolydFlow } from "solydflow-js";

export async function canAccessFeature(): Promise<boolean> {
  // Safe from premature access grants
  return await SolydFlow.hasEntitlement("pro_access");
}
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Enforce Overview →](./overview.md)**
* **[Smart Payment Routing →](./smart-routing.md)**
* **[Provider Failover →](./provider-failover.md)**
* **[Entitlement Enforcement →](./entitlement-enforcement.md)**

