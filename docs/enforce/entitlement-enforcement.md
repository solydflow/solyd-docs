---
id: entitlement-enforcement
title: Entitlement Enforcement
sidebar_label: Entitlement Enforcement
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Entitlement Enforcement

**Entitlement Enforcement** is the automated process of unlocking, renewing, or revoking application access based strictly on verified financial truth.

```text
[1. SETTLED_CONSENSUS Achieved] ➔ [2. Activate Entitlement] ➔ [3. Encrypt Local Cache (<5ms)] ➔ [4. Sync Backend Webhook]
```

Instead of forcing your app to inspect gateway transaction IDs or calculate monthly expiration dates manually, SolydFlow's enforcement layer guarantees that a user's permissions are always synchronized across their mobile devices, web browsers, and backend databases.

---

## The Dual-Enforcement Architecture

SolydFlow enforces customer access across two synchronized planes:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Enforcement Plane                     │ How It Works & Why It Matters                          │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 📱 **Client-Side (Offline-First)**    │ Hardware-encrypted local cache (AES-GCM). Allows users │
│                                       │ to access paid features on airplanes or offline (<5ms).│
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 🖥️ **Server-Side (Backend Sync)**     │ Dispatches signed webhooks (`subscription_started` /   │
│                                       │ `revoked`) to update your PostgreSQL/Supabase database.│
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## The 4 Entitlement Lifecycle States

An entitlement moves through four distinct states as the customer's subscription progresses:

| State | What Happened | Feature Access | Next Transition |
| :--- | :--- | :--- | :--- |
| **`ACTIVE`** | Transaction reached `SETTLED_CONSENSUS`. | **Full Access ✅** | Renews on billing date or transitions to Expired. |
| **`GRACE_PERIOD`** | Recurring card renewal failed; gateway is retrying. | **Full Access ✅** | Recovers to Active, or drops to Expired after 3 days. |
| **`EXPIRED`** | Subscription duration lapsed without renewal. | Locked 🔒 | Re-activates immediately upon successful checkout. |
| **`REVOKED`** | Customer initiated a bank chargeback or refund. | Locked 🔒 | Access killed immediately across all devices. |

---

## Implementing Enforcement in Code

### 1. Client-Side Feature Gating (Offline-Ready)

Use `hasEntitlement` to protect tabs, screens, and premium features:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/premium_content.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

class PremiumToolScreen extends StatelessWidget {
  const PremiumToolScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      // Instant check (<5ms) from encrypted local storage
      future: SolydFlow.hasEntitlement("pro_access"),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const CircularProgressIndicator();
        
        final hasAccess = snapshot.data ?? false;

        if (hasAccess) {
          return const Text("🚀 Full Pro Access Unlocked!");
        }

        return ElevatedButton(
          onPressed: () => Navigator.pushNamed(context, "/paywall"),
          child: const Text("Upgrade to Unlock"),
        );
      },
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/guards/proGuard.ts"
import { SolydFlow } from "solydflow-js";

export async function canAccessTool(): Promise<boolean> {
  // Returns true immediately if active
  return await SolydFlow.hasEntitlement("pro_access");
}
```

</TabItem>
</Tabs>

---

### 2. Backend Enforcement (Webhook Sync)

When SolydFlow enforces or revokes an entitlement, it notifies your server with a cryptographically signed webhook:

```javascript title="server.js (Node.js Express)"
// Handle SolydFlow Enforcement Webhook Events
switch (payload.event) {
  case "subscription_started":
  case "subscription_renewed":
    // 1. Grant database access until expires_at
    await db.users.update({
      where: { id: payload.user_id },
      data: {
        is_pro: true,
        pro_expires_at: new Date(payload.expires_at),
      },
    });
    break;

  case "subscription_revoked":
    // 2. Kill access immediately on chargeback / refund
    await db.users.update({
      where: { id: payload.user_id },
      data: {
        is_pro: false,
        revoked_reason: payload.reason, // e.g. "chargeback"
      },
    });
    break;
}
```

---

## Automatic Revocation Handling (Disputes & Refunds)

If a customer files a chargeback with their bank or you issue a refund in the Stripe/Paystack dashboard:

```text
[Refund in Dashboard] ➔ [Gateway Fires Refund Event] ➔ [SolydFlow Consensus Verifies] ➔ [State Marked REVOKED_REFUND] ➔ [Kills Local & Cloud Access]
```

1. SolydFlow updates the user's status from `ACTIVE` to `REVOKED`.
2. A signed `subscription_revoked` webhook is sent to your backend.
3. The next time the user's mobile app touches the network, the encrypted cache is cleared and features lock automatically.

---

## Related Documentation

* **[Enforce Overview →](./overview.md)**
* **[Smart Payment Routing →](./smart-routing.md)**
* **[Transaction Finality →](./transaction-finality.md)**
* **[Webhook Event Handling →](../webhooks/event-handling.md)**
