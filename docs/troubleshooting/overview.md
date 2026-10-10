---
id: overview
title: Troubleshooting Overview
sidebar_label: Overview
---

# Troubleshooting Overview

When a payment does not produce the expected result, SolydFlow provides transparent diagnostic tools across your transaction history, inbound gateway logs, and outbound webhook delivery queues.

```text
[1. Check Transaction Ledger] ➔ [2. Inspect Inbound Gateway Log] ➔ [3. Audit Consensus Verification] ➔ [4. Check Outbound Webhook]
```

---

## 4-Point Pre-Flight Health Check

Before diving into complex debugging, verify these four common configuration checkpoints:

* [ ] **Sandbox vs. Live Match:** Confirm your app uses `sf_pk_test_...` with gateway test keys, or `sf_pk_live_...` with live keys. Mixing environments causes immediate `401 Unauthorized` errors.
* [ ] **Vault Credentials Saved:** Verify in **Project Settings → API Credentials Vault** that secret keys (`sk_live_...`, `FLWSECK_...`) are saved and have green status pings.
* [ ] **Inbound Webhook Configured:** Confirm your payment gateway dashboard has your project's unique inbound webhook URL configured (`https://api.solydflow.com/api/v1/webhook/...`).
* [ ] **HTTPS Endpoint Reachable:** Ensure your backend webhook receiver is live, uses valid SSL/HTTPS, and returns HTTP `200 OK` within 5 seconds.

---

## Diagnostic Triage Matrix

Find your symptom below to jump straight to the solution:

| Symptom | Most Likely Cause | Quick Fix | Detailed Guide |
| :--- | :--- | :--- | :--- |
| **Payment stays "Pending"** | User paid via USSD/Bank Transfer; bank switch is clearing or callback was dropped. | Check Paystack/Monnify status; the Sweeper reconciles stalled intents automatically. | **[Payment Pending Guide →](./payment-pending.md)** |
| **Webhook not received on server** | Endpoint returned non-200 status, timed out (>5s), or URL is misconfigured. | Inspect **Outbound Webhooks Log** in Console; test endpoint using "Send Test Webhook". | **[Webhook Not Received →](./webhook-not-received.md)** |
| **Paid, but features stay locked** | Package is not mapped to the entitlement being checked in app code (`hasEntitlement`). | Check **Products & Packages** to confirm package is linked to `pro_access`. | **[Entitlement Not Granted →](./entitlement-not-granted.md)** |
| **Gateway says paid, app says failed** | Inbound webhook was dropped or user closed app before redirect. | The Sweeper will recover the **Orphaned Transaction** within 45s via direct REST check. | **[State Mismatches →](./transaction-state-mismatch.md)** |
| **Payment modal fails to open** | Missing `userPhone` for M-Pesa STK, or provider credentials invalid. | Pass valid E.164 phone (`+254...`); re-save keys in the Vault. | **[Provider Errors →](./provider-errors.md)** |

---

## Console Diagnostic Tools

When troubleshooting an issue, use these four dedicated console interfaces:

```text
┌───────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Console Diagnostic Tool               │ What It Tells You                                      │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 📜 **Transactions Ledger**            │ Full transition timeline (`INITIALIZED` ➔ `SETTLED`).  │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 📥 **Inbound Gateway Webhooks**       │ Shows raw payloads and HTTP status codes from banks.   │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 📤 **Outbound Webhooks Activity**     │ Delivery logs and response codes from your server.     │
├───────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 🧪 **Solyd Simulator**                │ Reproduce checkouts across regions without real cards. │
└───────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## Explore Troubleshooting Guides

* **[Payment Remains Pending →](./payment-pending.md)**
* **[Webhook Not Received on Backend →](./webhook-not-received.md)**
* **[Entitlement Not Granted After Purchase →](./entitlement-not-granted.md)**
* **[Transaction State Mismatches →](./transaction-state-mismatch.md)**
* **[Handling Payment Provider Errors →](./provider-errors.md)**
