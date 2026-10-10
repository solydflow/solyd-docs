---
id: api-keys
title: API Keys & Key Management
sidebar_label: API Keys
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Keys & Key Management

SolydFlow authenticates every client SDK request and backend API call using project-scoped API key pairs.

```text
[1. Copy Key Pair from Console] ➔ [2. Embed Public Key in Client SDK] ➔ [3. Store Secret Key in Env Vars] ➔ [4. Zero-Downtime Rotation]
```

To eliminate cross-environment leakage, **Sandbox** and **Live** environments use completely distinct key pairs.

---

## API Key Types & Permissions Matrix

| Key Name | Prefix | Target Environment | Where to Store | Permitted Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Test Public Key** | `sf_pk_test_...` | Sandbox | Mobile Apps, Web Frontend | Fetch test offerings, start test checkouts. |
| **Test Secret Key** | `sf_sk_test_...` | Sandbox | Backend Server `.env` | Manage sandbox users, trigger test refunds. |
| **Live Public Key** | `sf_pk_live_...` | Production | Mobile Apps, Web Frontend | Fetch live offerings, initiate real checkouts. |
| **Live Secret Key** | `sf_sk_live_...` | Production | Backend Server `.env` | Administrative API calls, server-to-server intent creation. |

:::danger{title="Protect Your Secret Keys"}
**Never commit `sf_sk_...` keys to version control (Git) or embed them in compiled client apps (Flutter, React, iOS, Android).** If a secret key is pushed to a public repository, revoke it immediately in the console.
:::

---

## Safe Key Placement in Practice

<Tabs>
<TabItem value="client" label="Client Apps (Flutter / Web)" default>

```dart title="lib/main.dart (Client Mobile SDK)"
// Safe: Only Public Keys are shipped inside mobile binaries
await SolydFlow.configure(
  apiKey: kReleaseMode 
      ? "sf_pk_live_44019283bc918237fa" 
      : "sf_pk_test_a8f93b1c8e924a1b82",
  userID: user.uid,
);
```

</TabItem>
<TabItem value="backend" label="Backend Servers (Node.js / Python)">

```bash title=".env (Backend Environment File)"
# Confidential: Kept on protected servers only
SOLYDFLOW_SECRET_KEY=sf_sk_live_1982736450192837465019283
SOLYDFLOW_WEBHOOK_SECRET=whsec_live_991823ab719284bc710293
```

</TabItem>
</Tabs>

---

## Zero-Downtime Key Rotation (Rolling Grace Window)

When rotating a compromised or aging **Secret Key**:

1. Log in to the [SolydFlow Console](https://console.solydflow.com) and go to **Project Settings → API Management**.
2. Click **Regenerate Secret Key**.
3. SolydFlow generates a new key (`sf_sk_live_...new`) while activating a **24-hour Rolling Grace Period**.
4. Both the old key and the new key remain valid for 24 hours.
5. Deploy your updated backend environment variables.
6. Once deployed, click **Decommission Old Key Now** or allow it to expire automatically after 24 hours.

```text
[Old Key Active] ➔ [Click Regenerate] ➔ [24-Hour Dual-Key Grace Window] ➔ [Deploy Backend] ➔ [Old Key Decommissioned]
```

This guarantees zero failed customer checkouts during infrastructure maintenance.

---

## Emergency Revocation Protocol

If you suspect an API key has been compromised (e.g. accidentally pushed to GitHub):

1. Go to **Console → Project Settings → API Management**.
2. Click **Emergency Revoke** next to the compromised key.
3. Select **"Revoke Immediately (Zero Grace Period)"**.
4. The key is instantly invalidated across all SolydFlow edge nodes (`401 Unauthorized`).
5. Copy the newly generated key pair and update your production server environment variables immediately.

---

## Related Documentation

* **[Security Overview →](./overview.md)**
* **[Credential Vault Security (BYOK) →](./credential-security.md)**
* **[Webhook Signature Verification →](../webhooks/signature-verification.md)**
* **[Production Checklist →](../production/production-checklist.md)**
