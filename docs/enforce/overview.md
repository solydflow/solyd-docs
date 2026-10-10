---
id: overview
title: Enforce Overview
sidebar_label: Overview
---

# Enforce Overview

Knowing that a payment succeeded is only half the battle. Your application still needs to know: *Which payment rail should be selected? Is the payment truly final? Which features should be unlocked? What happens if a card is refunded next week?*

```text
[1. Verified Truth] ➔ [2. Smart Routing & Failover] ➔ [3. Evaluate Finality] ➔ [4. Enforce Entitlements]
```

**SolydFlow Enforce** is the runtime policy and execution layer that connects verified financial transactions to application access, payment routing, and customer entitlement lifecycles.

---

## Truth vs. Enforce

| Layer | Core Question | Primary Responsibility |
| :--- | :--- | :--- |
| **Truth** | *"What happened financially?"* | Verifies gateway receipts, evaluates consensus, and commits to the ledger. |
| **Enforce** | *"What should the system do about it?"* | Routes checkouts, evaluates finality, unlocks local/cloud features, and handles revokals. |

---

## The 4 Pillars of Enforce

SolydFlow structures enforcement into four core capabilities:

| Pillar | Capability | Why It Matters |
| :--- | :--- | :--- |
| **[Smart Routing](./smart-routing.md)** | Dynamic payment gateway selection based on currency, region, and uptime. | Routes NGN to Paystack/Monnify, KES to M-Pesa, and USD to Stripe automatically. |
| **[Provider Failover](./provider-failover.md)** | Intelligent fallback to backup payment rails during gateway outages. | Prevents checkout drops without risking double-debits. |
| **[Transaction Finality](./transaction-finality.md)** | Distinguishes between temporary authorizations and irreversible settlements. | Prevents granting permanent access on reversible or pending checks. |
| **[Entitlement Enforcement](./entitlement-enforcement.md)** | Real-time unlocking and revoking of application features. | Powers `<5ms` offline checks on mobile and webhook sync to backends. |

---

## Real-World Multi-Market Routing in Action

Consider a customer subscribing to your app from different regions:

```text
┌───────────────────────────────────────┬────────────────────────────────────────┬───────────────────────────┐
│ Customer Location & Currency          │ Enforce Smart Routing Selection        │ Resulting Entitlement     │
├───────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────┤
│ 🇰🇪 Nairobi, Kenya (KES)               │ M-Pesa STK Push (Daraja)               │ Unlocks "pro_access" ✅    │
├───────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────┤
│ 🇳🇬 Lagos, Nigeria (NGN)               │ Paystack Card or Monnify Virtual Acc   │ Unlocks "pro_access" ✅    │
├───────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────┤
│ 🇬🇭 Accra, Ghana (GHS)                 │ Flutterwave Mobile Money (MTN/Telecel) │ Unlocks "pro_access" ✅    │
├───────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────┤
│ 🇺🇸 New York, USA (USD)                │ Stripe Credit Card / Apple Pay         │ Unlocks "pro_access" ✅    │
└───────────────────────────────────────┴────────────────────────────────────────┴───────────────────────────┘
```

Notice that regardless of which payment provider processed the funds or what local currency was charged, **Enforce produces a single, unified entitlement: `pro_access`**.

---

## Safe Failover vs. Blind Retries

Enforce strictly separates **route failover** from naive charge retries:

* **Naive Failover (Dangerous):** Provider A times out ➔ Immediately charge via Provider B ➔ **Customer charged twice.**
* **Enforce Safe Failover:** Provider A times out ➔ Hold intent ➔ Verify whether Provider A debited funds ➔ If confirmed uncharged, safely failover to Provider B.

---

## Explore Enforce Modules

<div className="row">
  <div className="col col--6">
    <div className="card padding--md margin-bottom--md">
      <h3>🧭 Smart Routing</h3>
      <p>Configure dynamic gateway routing rules by currency and region.</p>
      <a className="button button--secondary button--block" href="/enforce/smart-routing">Read Guide →</a>
    </div>
  </div>
  <div className="col col--6">
    <div className="card padding--md margin-bottom--md">
      <h3>🛡️ Provider Failover</h3>
      <p>Resilient payment failover without the risk of duplicate charges.</p>
      <a className="button button--secondary button--block" href="/enforce/provider-failover">Read Guide →</a>
    </div>
  </div>
  <div className="col col--6">
    <div className="card padding--md margin-bottom--md">
      <h3>⚖️ Transaction Finality</h3>
      <p>Understanding when a payment is authoritative and irreversible.</p>
      <a className="button button--secondary button--block" href="/enforce/transaction-finality">Read Guide →</a>
    </div>
  </div>
  <div className="col col--6">
    <div className="card padding--md margin-bottom--md">
      <h3>🔑 Entitlement Enforcement</h3>
      <p>Offline-first feature gating and multi-device access synchronization.</p>
      <a className="button button--secondary button--block" href="/enforce/entitlement-enforcement">Read Guide →</a>
    </div>
  </div>
</div>
```
