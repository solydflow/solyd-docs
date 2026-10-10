---
id: tax-and-compliance
title: Tax & Cross-Border Compliance
sidebar_label: Tax & Compliance
---

# Tax & Cross-Border Compliance

:::info{title="Status: Under Active Development 🚧"}
Automated tax calculation and line-item reporting are currently in development. 

Today, tax collection and remittance remain the responsibility of your business or your configured payment providers under the **Bring Your Own Keys (BYOK)** model.
:::

```text
[1. Detect Customer Tax Jurisdiction] ➔ [2. Calculate Regional VAT / GST] ➔ [3. Record Tax in Ledger] ➔ [4. Export for Local Filing]
```

Selling software across borders introduces digital services taxes (VAT, GST, and Sales Tax). Understanding how taxes interact with your payment infrastructure ensures you maintain compliance without surprise penalties.

---

## Regional Digital Services Tax (DST) Landscape

When selling digital subscriptions across Africa and global markets, different jurisdictions impose specific indirect tax obligations:

| Jurisdiction | Tax Type | Typical Rate | Scope for Digital Products |
| :--- | :--- | :--- | :--- |
| **🇳🇬 Nigeria** | **Value Added Tax (VAT)** | `7.5%` | Applied to digital downloads, cloud software, and SaaS. |
| **🇰🇪 Kenya** | **Digital Services Tax (DST) / VAT** | `16% VAT` | Electronically supplied services and streaming subscriptions. |
| **🇿🇦 South Africa** | **VAT on Electronic Services** | `15%` | Foreign and domestic suppliers of cloud services and software. |
| **🇬🇭 Ghana** | **VAT / COVID-19 Health Levy** | `~21.9%` (Effective)| Digital services and electronic commerce. |
| **🇪🇺 European Union**| **EU VAT (One Stop Shop / OSS)** | `17% – 27%` | Destination-based VAT according to customer country. |
| **🇺🇸 United States** | **State Sales Tax** | `0% – 10%` | Based on state-by-state economic nexus thresholds. |

:::warning{title="SolydFlow Does Not Remit Taxes"}
SolydFlow provides calculation, reporting, and audit logs. We do **not** automatically remit taxes to government revenue authorities (such as FIRS in Nigeria or KRA in Kenya). You must remit collected taxes via your local tax accountants or use a **[Merchant of Record](./merchant-of-record.md)**.
:::

---

## Planned Tax Ledger Record Schema

Upcoming tax features will record detailed tax breakdowns on every transaction record:

```json title="Planned Transaction Tax Object (JSON)"
{
  "transaction_id": "txn_01J8K9B2D7E4F1A0C5E8",
  "pricing": {
    "currency": "KES",
    "subtotal_amount_cents": 43103,
    "tax_amount_cents": 6897,
    "total_amount_cents": 50000,
    "human_readable_total": "KSh 500.00"
  },
  "tax_metadata": {
    "jurisdiction": "KE",
    "tax_name": "Kenya Electronic Services VAT",
    "rate_percent": 16.0,
    "tax_included_in_price": true
  }
}
```

This ensures that at the end of every month, your accounting team can export clean CSV reports detailing exact taxable amounts versus gross revenue per jurisdiction.

---

## Best Practices for Cross-Border Tax Compliance

1. **Tax-Inclusive Pricing in Africa:** In Nigeria, Kenya, and South Africa, consumer regulations require B2C subscription prices to be displayed **tax-inclusive** (e.g., KSh 500 total, rather than KSh 431 + KSh 69 tax).
2. **Collect Country Identifiers:** Always collect billing country or rely on SolydFlow's Geo-IP resolution to establish tax residency evidence.
3. **Use a Merchant of Record for EU/US:** If your software business is incorporated in Africa and you begin doing substantial volume in the US or Europe, consider using a **[Merchant of Record (Paddle / Dodo)](./merchant-of-record.md)** to automate cross-border VAT filings.

---

## Related Documentation

* **[Global Commerce Overview →](./overview.md)**
* **[Merchant of Record (MoR) →](./merchant-of-record.md)**
* **[Multi-Currency Architecture →](./multi-currency.md)**
* **[The Immutable Transaction Ledger →](../truth/transaction-ledger.md)**
