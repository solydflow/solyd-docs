---
id: audit-logs
title: Audit Logs & Traceability
sidebar_label: Audit Logs
---

# Audit Logs & Traceability

SolydFlow maintains an append-only, tamper-proof **Audit Trail** of every administrative change, vault modification, and pricing update across your organization.

```text
[1. Admin Action / Engine Trigger] ➔ [2. Capture Actor, IP & Context] ➔ [3. Append Immutably] ➔ [4. Instant Console Audit Trail]
```

Audit logs ensure that team actions are fully traceable for internal security reviews, forensic debugging, and financial compliance audits.

---

## The 4 Audit Event Categories

SolydFlow logs actions across four critical operational domains:

| Category | Logged Events | Why It Matters |
| :--- | :--- | :--- |
| **1. Credential Vault** | API Key generated, secret key rotated, gateway keys updated in Vault. | Tracks which team member accessed or modified payment credentials. |
| **2. Monetization & Catalog**| Package price updated, package archived, tier level edited. | Prevents unauthorized pricing changes that could affect live checkout rates. |
| **3. Smart Routing** | Default provider changed, regional rule added/removed, failover toggled. | Explains why transactions switched from one payment rail to another. |
| **4. Manual Financial Actions** | Manual reconciliation run, entitlement granted/revoked by admin. | Documents human intervention in customer subscription lifecycles. |

---

## Audit Record Schema

Every entry in **Console → Project Settings → Audit Logs** captures full operational context:

```json title="Audit Log Entry (JSON)"
{
  "audit_id": "aud_01J8K9X4M2D7E4F1",
  "project_id": "proj_apex_production",
  "actor": {
    "user_id": "admin_ada_991823",
    "email": "ada@company.com",
    "role": "OWNER",
    "ip_address": "102.89.23.14",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X...)"
  },
  "action": "PRICING_PACKAGE_UPDATED",
  "target": {
    "resource_type": "PACKAGE",
    "resource_id": "pro_monthly_ngn"
  },
  "changes": {
    "previous_amount_minor": 350000,
    "new_amount_minor": 500000,
    "currency": "NGN"
  },
  "timestamp": "2026-08-27T14:20:10Z"
}
```

---

## Searching and Filtering Audit Logs

Authorized administrators can inspect audit history in the **SolydFlow Console**:

1. Open the [SolydFlow Console](https://console.solydflow.com).
2. Navigate to **Project Settings → Audit Logs**.
3. Filter entries by:
   * **Actor:** Filter by specific admin email address.
   * **Action Type:** E.g., `VAULT_CREDENTIAL_UPDATED`, `PACKAGE_PRICE_CHANGED`.
   * **Date Range:** Filter across daily, monthly, or quarterly windows.
4. Export CSV reports for external compliance auditors.

---

## Retention & Immutability

* **Append-Only Guarantee:** Audit log records cannot be edited, overwritten, or deleted by any console user (including organization owners).
* **Retention Policy:** Production audit logs are retained for **7 years** to satisfy international banking and financial record-keeping standards.

---

## Related Documentation

* **[Security Overview →](./overview.md)**
* **[API Credentials Vault (BYOK) →](./credential-security.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
* **[Compliance & Regulatory Standards →](./compliance.md)**
