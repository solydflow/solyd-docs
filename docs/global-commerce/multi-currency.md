---
id: multi-currency
title: Multi-Currency Architecture
sidebar_label: Multi-Currency
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multi-Currency Architecture

SolydFlow enables you to sell the same core product across multiple currencies without building complex exchange-rate converters or managing separate codebases for each country.

```text
[1. Create Base Product] ➔ [2. Attach Regional Currency Packages] ➔ [3. Auto Geo-IP Detection] ➔ [4. Unified Multi-Currency Ledger]
```

By decoupling your high-level **Product** from single-currency **Packages**, your business can charge customers in their native currency while aggregating reporting into your primary base currency.

---

## The "Smallest Currency Unit" Rule

In financial software, floating-point arithmetic (e.g. `5000.00 * 0.075`) introduces rounding inaccuracies that corrupt accounting ledgers. 

To guarantee mathematical precision, **all amounts in SolydFlow are stored and processed as integers in the smallest currency unit**:

| Currency | ISO Code | Smallest Unit Name | Divisor | Example Raw Integer | Human-Readable Display |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nigerian Naira** | `NGN` | Kobo | `100` | `500000` | **`₦5,000.00`** |
| **Kenyan Shilling** | `KES` | Cents | `100` | `50000` | **`KSh 500.00`** |
| **Ghanaian Cedi** | `GHS` | Pesewas | `100` | `6500` | **`GH₵ 65.00`** |
| **South African Rand** | `ZAR` | Cents | `100` | `9900` | **`R 99.00`** |
| **US Dollar** | `USD` | Cents | `100` | `499` | **`$4.99`** |
| **Euro** | `EUR` | Cents | `100` | `499` | **`€4.99`** |

---

## Multi-Currency Product Structure

```text
📦 Product: "Pro Workspace" ➔ Entitlement: "pro_access"
│
├── 🇳🇬 Package: pro_monthly_ngn ➔ ₦5,000 (500000 kobo) via Paystack / Monnify
├── 🇰🇪 Package: pro_monthly_kes ➔ KSh 500 (50000 cents) via M-Pesa STK Push
├── 🇬🇭 Package: pro_monthly_ghs ➔ GH₵ 65 (6500 pesewas) via Flutterwave
├── 🇿🇦 Package: pro_monthly_zar ➔ R 99 (9900 cents) via Paystack EFT
└── 🌍 Package: pro_monthly_usd ➔ $4.99 (499 cents) via Stripe (Global Fallback)
```

No matter which currency package a customer purchases, SolydFlow unlocks the exact same entitlement: **`pro_access`**.

---

## Formatting Multi-Currency Prices in Code

Never hardcode currency symbols (`₦`, `$`, `KSh`) into your UI. Use standard internationalization formatters that parse the currency code returned by the SDK:

<Tabs>
<TabItem value="flutter" label="Flutter (intl package)" default>

```dart title="lib/utils/currency_formatter.dart"
import 'package:intl/intl.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

String formatPackagePrice(SolydPackage pkg) {
  // 1. Determine raw integer amount (supporting upgrade credits)
  final int amount = pkg.isUpgrade 
      ? pkg.calculatedAmountMinor 
      : pkg.amountMinor;

  // 2. Automatically formats ₦, KSh, $, €, GH₵ based on ISO code
  return NumberFormat.simpleCurrency(name: pkg.currency).format(amount);
}

// Example Outputs:
// pkg.currency: "NGN", pkg.amountMinor: 5000 ➔ "₦5,000.00"
// pkg.currency: "KES", pkg.amountMinor: 500  ➔ "KSh500.00"
// pkg.currency: "USD", pkg.amountMinor: 4.99    ➔ "$4.99"
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Intl.NumberFormat)">

```typescript title="src/utils/currency.ts"
import { SolydPackage } from "solydflow-js";

export function formatPackagePrice(pkg: SolydPackage): string {
  const rawUnits = pkg.is_upgrade 
    ? pkg.calculated_amount_minor 
    : pkg.amount_minor;

  const amount = rawUnits / 100;

  // Built-in browser internationalization API
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: pkg.currency,
  }).format(amount);
}
```

</TabItem>
</Tabs>

---

## Geo-IP Package Resolution & USD Fallback

When your application calls `SolydFlow.getOfferings()`:
1. SolydFlow inspects the customer's incoming IP address.
2. If the user connects from **Nigeria**, it serves `pro_monthly_ngn`.
3. If the user connects from **Kenya**, it serves `pro_monthly_kes`.
4. If the user connects from an unmapped country (e.g. Japan or Brazil), it automatically defaults to your base **`USD`** package.

This guarantees that every visitor is presented with a valid purchase option without throwing layout errors.

---

## Related Documentation

* **[Global Commerce Overview →](./overview.md)**
* **[Regional Pricing & Purchasing Power Parity →](../monetization/regional-pricing.md)**
* **[Smart Payment Routing →](../enforce/smart-routing.md)**
* **[Products & Packages Architecture →](../concepts/products-and-packages.md)**
