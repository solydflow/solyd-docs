---
id: testing-recovery
title: Testing Recovery Workflows
sidebar_label: Testing Recovery
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testing Recovery Workflows

Recovery testing validates that SolydFlow automatically rescues transactions when real-world failures occur—such as a customer completing payment and then losing mobile connectivity, closing the browser, or having a webhook blocked.

```text
[1. Complete Test Payment] ➔ [2. Kill App / Drop Socket] ➔ [3. Sweeper Reconciles in Background] ➔ [4. Entitlement Restored]
```

---

## Test 1: The "Force-Close" Test (Mobile App)

This test proves that customers who pay via USSD, Bank Transfer, or M-Pesa but lose cellular data still get their pro access restored automatically.

### Test Steps:
1. Launch your mobile app in debug/test mode (`sf_pk_test_...`).
2. Trigger the paywall and select a package (e.g. `pro_monthly_ngn`).
3. Complete the payment authorization using a test card or simulator PIN.
4. **Immediately force-close / swipe away the app** before the success screen appears.
5. Wait **15 to 30 seconds** for the gateway settlement to register.
6. Re-open your mobile app.
7. Verify that access was restored automatically without prompting the user to pay again:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/dashboard.dart"
// On app launch, hasEntitlement reads from encrypted local storage
// and checks if the Sweeper settled the orphaned transaction.
final bool isPro = await SolydFlow.hasEntitlement("pro_access");
print("Restored Access: $isPro"); // Expected: true ✅
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/access.ts"
const isPro = await SolydFlow.hasEntitlement("pro_access");
console.log("Restored Access:", isPro); // Expected: true ✅
```

</TabItem>
</Tabs>

---

## Test 2: The "Blocked Webhook" Test (Backend / Web)

This test proves that SolydFlow's **Consensus Engine** does not depend solely on webhooks to unlock subscriptions.

### Test Steps:
1. In the **SolydFlow Console**, go to **Inbound Gateway Webhooks**.
2. Temporarily enter an invalid webhook URL (e.g. `https://httpstat.us/500`) to simulate a complete webhook delivery outage.
3. Open the **Solyd Simulator** in `Test (Sandbox)` mode.
4. Select a package and complete checkout using a test card.
5. In your gateway dashboard, the webhook will show as failed (`500 Internal Error`).
6. **Watch the SolydFlow Simulator Log:**
   * After 45 seconds of webhook silence, the **Sweeper** detects the `UNRESOLVED_ORPHAN` transaction.
   * The Sweeper queries the gateway's REST API directly using your Vault secret key.
   * The transaction settles to **`SETTLED_CONSENSUS`**.
   * Entitlement `pro_access` unlocks cleanly.
7. Re-enable your valid webhook URL once the test is complete.

---

## What the Ledger Looks Like During Recovery

When a recovery test succeeds, inspect the transaction in **SolydFlow Console → Transactions Ledger**. You will see the complete audit trail:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Timestamp                             │ State Transition & Operational Source                  │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **10:00:00**                          │ `INITIALIZED` (Client started checkout)                │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **10:00:45**                          │ `UNRESOLVED_ORPHAN` (Callback missing after 45s)       │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **10:01:00**                          │ `RECOVERING` (Sweeper queried gateway verify API)      │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ **10:01:02**                          │ `SETTLED_CONSENSUS` (Entitlement "pro_access" granted) │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## What a Successful Recovery Test Proves

Passing these tests confirms that:
* ✅ Network drops never lead to lost customer revenue.
* ✅ Dropped or blocked webhooks are recovered automatically via direct REST verification.
* ✅ Subscribers never have to contact support or pay twice for the same subscription.

---

## Related Documentation

* **[Sandbox Overview →](./overview.md)**
* **[Simulating Payment Failures →](./simulate-failures.md)**
* **[Orphaned Transactions →](../recover/orphaned-transactions.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
