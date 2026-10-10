---
id: monitoring
title: Production Monitoring & Health
sidebar_label: Monitoring
---

# Production Monitoring & Health

Once your project is live in production, regular operational monitoring ensures your payment rails remain healthy, webhooks are acknowledged promptly, and the Sweeper is actively recovering orphaned payments.

```text
[1. Track Consensus Settlement Rate] ➔ [2. Monitor Outbound Webhooks] ➔ [3. Audit Sweeper Recoveries] ➔ [4. Review Daily Reconciliation]
```

---

## The 4 Core Production Health Metrics

Monitor these four metrics in the **SolydFlow Console** to evaluate revenue health:

| Health Metric | Healthy Target | What an Anomaly Indicates | Where to Check |
| :--- | :--- | :--- | :--- |
| **1. Consensus Settlement Rate** | **> 92%** | Sudden drop indicates bank 3DS downtime or an expired gateway secret key. | **Console → Dashboard Overview** |
| **2. Webhook Delivery Rate** | **> 99.5%** | Spike in non-200 responses means your backend receiver is slow or timing out. | **Console → Outbound Webhooks** |
| **3. Sweeper Recovery Volume** | Consistent baseline | Spike indicates upstream telco lag (e.g., Safaricom M-Pesa or NIBSS delays). | **Console → Recover Logs** |
| **4. Inbound Gateway Status** | Green (`200 OK`) | `401` errors mean gateway secret keys in the Vault were rotated out of sync. | **Console → Inbound Gateways** |

---

## Setting Up Operational Alerts

Do not wait for customer support tickets to discover a broken webhook receiver. Configure automated alerts in **Console → Project Settings → Notifications**:

```text
┌─────────────────────────────────────────────────────────────┐
│ Automated Health Alerts                                     │
├─────────────────────────────────────────────────────────────┤
│ Notify via:          (●) Slack Webhook    ( ) Email         │
│ Webhook URL:         [ https://hooks.slack.com/services/... ]│
│                                                             │
│ Trigger Alerts For:                                         │
│ [x] Webhook Delivery Failure (5 consecutive non-200s)       │
│ [x] Gateway Outage / Failover Triggered                     │
│ [x] High Volume of Orphaned Transactions (>10 in 5 mins)    │
│ [x] API Key Compromise / Emergency Revoke                   │
└─────────────────────────────────────────────────────────────┘
```

When an incident occurs (such as your backend server taking longer than 5 seconds to process events), your engineering team receives an instant alert with direct links to the failing transaction references.

---

## Routine Maintenance Schedule

Keep your revenue infrastructure operating smoothly with this maintenance cadence:

### Weekly
* **Inspect Outbound Webhook Retries:** Confirm all retried events successfully resolved with HTTP `200 OK`.
* **Review Orphaned Recoveries:** Verify the Sweeper is successfully reconciling delayed USSD and bank transfer checkouts.

### Monthly
* **Run Financial Reconciliation:** Use the **Reconciliation** tab to cross-check SolydFlow ledger revenue totals against raw bank payout statements before closing accounting books.
* **Audit Vault Status:** Verify all connected providers (Paystack, Stripe, Flutterwave, M-Pesa, Monnify) report healthy connection pings.

### Quarterly
* **Review Team Console Access:** Remove former team members and verify that all active administrators have Two-Factor Authentication (2FA) enabled.
* **Rotate Webhook Signing Secrets:** If required by internal security policy, regenerate your `whsec_...` secret using our zero-downtime rolling grace period.

---

## Incident Triage: When Things Go Wrong

If you observe an unexpected drop in completed checkouts:

1. **Check Inbound Gateway Webhooks:** Are incoming provider events returning green `200` statuses? If you see `401`, your gateway secret key in the Vault may have expired.
2. **Check Outbound Webhooks Log:** Is your server returning `504 Gateway Timeout`? Your server may be doing heavy synchronous work inside the handler instead of returning `200` immediately.
3. **Inspect the Transactions Ledger:** Are checkouts getting stuck in `UNRESOLVED_ORPHAN`? Click **"Verify Now"** on a transaction to force an immediate server-to-server check.

---

## Related Documentation

* **[Production Launch Checklist →](./production-checklist.md)**
* **[Going Live in Production →](./going-live.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
* **[Financial Reconciliation →](../truth/reconciliation.md)**
* **[Troubleshooting Overview →](../troubleshooting/overview.md)**
