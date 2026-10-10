---
id: local-payments
title: Local African Payment Methods
sidebar_label: Local Payments
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Local African Payment Methods

In African markets, credit card penetration is under **15%**. The vast majority of digital commerce is powered by **Mobile Money (MoMo)**, **Direct Bank Transfers (Virtual Accounts)**, **USSD codes**, and **domestic debit cards (Verve)**.

```text
[1. Select Local Currency Package] ➔ [2. Trigger Native Local Rail] ➔ [3. User Authorizes on Phone / Bank] ➔ [4. Instant Ledger Settlement]
```

Forcing African customers to enter 16-digit card numbers frequently leads to **50% to 70% cart abandonment**. SolydFlow lets you accept preferred domestic payment methods natively while managing everything from a single dashboard.

---

## Regional Payment Rails Matrix

SolydFlow automatically routes transactions to domestic payment methods based on your project's Smart Routing configuration:

| Country & Currency | Dominant Payment Method | Primary Gateway Rail | Why It Matters |
| :--- | :--- | :--- | :--- |
| **🇰🇪 Kenya (`KES`)** | **M-Pesa STK Push** | Safaricom (Daraja) / Paystack | Over 85% of Kenyan adults use M-Pesa. Native SIM prompt maximizes conversion. |
| **🇳🇬 Nigeria (`NGN`)** | **Dynamic Virtual Accounts** | Monnify / Paystack | Bank transfers achieve >96% success rates vs. cards which suffer from bank 3DS timeouts. |
| **🇳🇬 Nigeria (`NGN`)** | **USSD & Verve Cards** | Paystack | Enables checkout for users without internet banking or smartphones via `*737#`, etc. |
| **🇬🇭 Ghana (`GHS`)** | **Mobile Money (MTN / Telecel)**| Flutterwave | MTN MoMo dominates digital payments across Ghana. |
| **🇿🇦 South Africa (`ZAR`)**| **Instant EFT & Capitec Pay** | Paystack | Direct bank debit rails account for a major share of online checkouts in SA. |

---

## How Local Payment Methods Work in SolydFlow

### 1. M-Pesa STK Push (Kenya)
When a Kenyan user purchases a package:
* SolydFlow prompts Safaricom Daraja using the customer's phone number (`+254...`).
* The customer receives an instant pop-up menu on their handset: *"Do you want to pay KSh 500 to [Your Business]?"*
* The user enters their 4-digit PIN; funds settle, and SolydFlow verifies the callback.

### 2. Dynamic Virtual Accounts (Nigeria)
When a Nigerian user selects Bank Transfer:
* SolydFlow generates a dedicated, temporary account number (e.g. *Wema Bank: 9918237465*) valid for 30 minutes.
* The customer opens their banking app (GTBank, Kuda, PalmPay) and transfers the exact amount.
* Interbank settlement is detected, consensus is verified, and features unlock automatically.

### 3. Pan-African Mobile Money (Ghana / Uganda / Rwanda)
* SolydFlow prompts the user's telco wallet (MTN Mobile Money, Airtel Money).
* The user approves the prompt on their phone; access is unlocked across all their devices.

---

## Developer Experience: Zero Rail-Specific Code

You do not need to write separate UI widgets for USSD, M-Pesa, or bank transfers. The SDK handles the entire flow automatically:

<Tabs>
<TabItem value="flutter" label="Flutter" default>

```dart title="lib/screens/checkout.dart"
// Handles hosted checkouts, M-Pesa STK prompts, and virtual accounts automatically:
final CustomerInfo? info = await SolydFlow.purchasePackage(
  context,
  "pro_monthly_kes", // Automatically triggers M-Pesa STK push in Kenya
);

if (info?.activeEntitlements["pro_access"] == true) {
  debugPrint("Pro unlocked via native local rail!");
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / TypeScript (Web)">

```typescript title="src/checkout.ts"
import { SolydFlow } from "solydflow-js";

// Automatically redirects browser to the appropriate domestic payment rail:
await SolydFlow.purchasePackage(
  "pro_monthly_ngn", 
  "+2348012345678" // Customer phone
);
```

</TabItem>
</Tabs>

---

## Related Documentation

* **[Global Commerce Overview →](./overview.md)**
* **[International Payments (Stripe) →](./international-payments.md)**
* **[Connecting M-Pesa (Daraja) →](../payment-providers/mpesa.md)**
* **[Connecting Monnify (Virtual Accounts) →](../payment-providers/monnify.md)**
