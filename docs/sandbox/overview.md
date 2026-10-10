---
id: overview
title: Sandbox & Simulator Overview
sidebar_label: Overview
---

# Sandbox & Simulator Overview

The **Solyd Simulator** is an interactive testing suite built into the SolydFlow Console that allows you to simulate customer purchases, inspect Smart Routing decisions, and verify entitlement grants across different countries before writing application code.

```text
[1. Select Simulated Location / Currency] ➔ [2. Inspect Smart Router Decision] ➔ [3. Execute Sandbox Payment] ➔ [4. Audit Ledger & Entitlement]
```

Because the simulator uses your project's active routing configuration, it guarantees that test checkouts behave identically to real mobile and web transactions in production.

---

## Sandbox (Test) vs. Live (Real Money) Modes

The Solyd Simulator supports two operating modes:

| Mode | API Keys Used | Financial Effect | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Test (Sandbox)** | `sf_pk_test_...`<br/>`sk_test_...` | **Zero money moved.** Uses simulator cards, test USSD, and dummy STK pushes. | Feature development, CI/CD testing, and failure simulation. |
| **Live (Real Money)** | `sf_pk_live_...`<br/>`sk_live_...` | **Real currency deducted.** Actual debits from live cards/bank accounts. | Final pre-launch smoke testing before public release. |

:::warning{title="Live Mode Charges Real Money"}
Only switch the simulator to **Live Mode** when you intentionally wish to process a real payment on your personal merchant account.
:::

---

## Simulating Geo-IP Locations & Currencies

In the simulator, you can select any supported regional currency context:

```text
┌─────────────────────────────────────────────────────────────┐
│ Solyd Simulator: Apex SaaS Production                       │
├─────────────────────────────────────────────────────────────┤
│ Execution Mode:     (●) Test (Sandbox)     ( ) Live         │
│ Simulated Region:   [ 🇳🇬 Nigeria (NGN)                    ▼]│
│ Available Packages: [ pro_monthly_ngn (₦5,000 / mo)       ▼]│
│                                                             │
│ [ Simulate Checkout ]                                       │
└─────────────────────────────────────────────────────────────┘
```

When you change the region to **Kenya (KES)** or **Global (USD)**, the simulator instantly reloads the catalog packages, localized prices, and gateway routes configured for that market.

---

## Real-Time Routing Engine Log

When you click **Simulate Checkout**, the simulator displays a live execution trace showing exactly how SolydFlow routes the payment:

```text title="Simulator Routing Console Log"
[10:14:02] INITIATED: Checkout requested for package: "pro_monthly_ngn"
[10:14:02] GEO_IP_DETECTED: Region [NG], Currency [NGN]
[10:14:03] VAULT_CHECK: Paystack test credentials verified (AES-256-GCM)
[10:14:03] ROUTER DECISION: Smart Routing selected [PAYSTACK_CARD] (Priority 1)
[10:14:04] ACTION: Dispatching test checkout session
[10:14:05] CHECKOUT_URL: https://checkout.paystack.com/test_chk_991823746
[10:14:20] INBOUND_WEBHOOK: charge.success received
[10:14:21] CONSENSUS_ENGINE: Server-to-server verification confirmed (₦5,000.00)
[10:14:22] LEDGER_COMMIT: State transitioned to SETTLED_CONSENSUS
[10:14:22] ENFORCE: Entitlement "pro_access" granted to test user
```

---

## Explore Sandbox Guides

| Guide | What You'll Test |
| :--- | :--- |
| **[Test Transactions](./test-transactions.md)** | Step-by-step test purchases using test cards and dummy mobile money. |
| **[Simulate Failures](./simulate-failures.md)** | Simulating card declines, invalid OTPs, and gateway timeouts. |
| **[Testing Recovery](./testing-recovery.md)** | Running the force-close test to verify orphaned transaction recovery. |

---

## Related Documentation

* **[Quickstart Guide →](../get-started/quickstart.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
