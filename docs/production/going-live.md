---
id: going-live
title: Going Live in Production
sidebar_label: Going Live
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Going Live in Production

Once you have verified your integration in Sandbox, follow this deployment sequence to switch your project to Live mode and accept real customer payments.

```text
[1. Toggle to Live in Console] ➔ [2. Verify Live BYOK Vault] ➔ [3. Deploy Live Client & Server Keys] ➔ [4. 24-Hour Launch Watch]
```

---

## The Launch Day Deployment Sequence

To ensure zero downtime, follow this step-by-step launch order:

### 1. Toggle Console to Live Mode
In the top-left navigation bar of the [SolydFlow Console](https://console.solydflow.com), switch the environment dropdown from **Sandbox** to **Live**.

### 2. Confirm Live Gateway Keys in the Vault
Navigate to **Project Settings → API Credentials Vault** and verify that your live provider keys are configured:
* Paystack Live Secret Key (`sk_live_...`)
* Stripe Live Secret Key (`sk_live_...`)
* Flutterwave Live Secret Key (`FLWSECK_LIVE...`)
* M-Pesa Live Daraja Credentials & ShortCode
* Monnify Live Secret Key & Contract Code

### 3. Deploy Backend Environment Variables
Update your production server environment variables with your Live credentials:
```bash title="Production Server .env"
SOLYDFLOW_SECRET_KEY=sf_sk_live_1982736450192837465019283
SOLYDFLOW_WEBHOOK_SECRET=whsec_live_991823ab719284bc710293
```

### 4. Deploy Mobile & Web Client Builds
Ship your production build configured with your **Live Public Key** (`sf_pk_live_...`).

---

## Automating Key Switching in Code

Avoid hardcoding keys manually. Use environment flags to switch between Sandbox and Live automatically:

<Tabs>
<TabItem value="flutter" label="Flutter (kReleaseMode)" default>

```dart title="lib/main.dart"
import 'package:flutter/foundation.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Automatically toggles between test and live based on build mode:
  const String apiKey = kReleaseMode
      ? "sf_pk_live_44019283bc918237fa" // Production
      : "sf_pk_test_a8f93b1c8e924a1b82"; // Development / QA

  await SolydFlow.configure(
    apiKey: apiKey,
    userID: user.uid,
    userEmail: user.email,
    userPhone: user.phoneNumber,
  );

  runApp(const MyApp());
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / Next.js">

```typescript title="src/index.ts"
import { SolydFlow } from "solydflow-js";

// Uses Next.js public environment variables:
await SolydFlow.configure(
  process.env.NEXT_PUBLIC_SOLYDFLOW_KEY!, // Tied to .env.production
  userId,
  userEmail,
  userPhone
);
```

</TabItem>
</Tabs>

---

## The First-24-Hours Watchlist

During your first day accepting live customer transactions, monitor these three console views:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Console View                          │ What to Look For                                       │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 📜 **Transactions Ledger**            │ Confirm transactions show **`SETTLED_CONSENSUS`**.     │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 📤 **Outbound Webhooks Log**          │ Confirm your server returns **`200 OK`** within <5s.   │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 🔄 **Sweeper Recovery Log**           │ Check if any dropped bank transfers required recovery. │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Emergency Rollback Plan

If you detect a critical issue on your backend server after launch:

1. **Keep Mobile Apps Live:** Do not immediately pull your mobile app from app stores.
2. **Webhooks are Safe:** If your backend server goes down, SolydFlow's recovery queue will automatically hold and retry undelivered webhooks with exponential backoff for up to **2 hours**.
3. **Emergency Key Revocation:** If a key was accidentally exposed, use the **Emergency Revoke** feature in **Console → API Management** to rotate credentials with zero downtime.

---

## Related Documentation

* **[Production Launch Checklist →](./production-checklist.md)**
* **[Production Monitoring & Alerts →](./monitoring.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
* **[API Credentials Vault (BYOK) →](../security/credential-security.md)**
