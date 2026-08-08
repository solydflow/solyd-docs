# Make Your First Purchase

Once your project is configured, you're ready to process your first purchase.

This guide uses the Sandbox environment.

---

## Before You Begin

Make sure you have:

- A SolydFlow project
- A connected payment provider
- A Product and Package
- An Entitlement
- The SDK installed and configured

If not, complete the **[Quickstart →](./quickstart.md)** first.

---

## Purchase Flow

```text
Customer
      │
      ▼
Select Package
      │
      ▼
Paywall or SDK
      │
      ▼
Payment Provider
      │
      ▼
SolydFlow
 ├── Recover
 ├── Truth
 └── Enforce
      │
      ▼
Entitlement Granted
      │
      ▼
Customer Gets Access
```

---

## 1. Show Your Offering

Display the package you want the customer to purchase.

Example:

```text
Premium Monthly

₦5,000

[Subscribe]
```

Packages can be displayed using SolydFlow Paywalls or your own application UI.

---

## 2. Start the Purchase

Use the SDK to initiate the purchase.

```javascript
await SolydFlow.purchase({
    packageId: "premium_monthly"
});
```

See the **[JavaScript SDK →](../sdk/javascript.md)** for the complete API.

---

## 3. Let SolydFlow Handle the Transaction

Once the purchase starts, SolydFlow manages the revenue lifecycle.

```text
Payment
      │
      ▼
Recover
      ▼
Truth
      ▼
Enforce
      ▼
Entitlement
```

Your application should rely on the customer's entitlement rather than the initial payment response.

Learn more:

- **[Recover →](../recover/overview.md)**
- **[Truth →](../truth/overview.md)**
- **[Enforce →](../enforce/overview.md)**

---

## 4. Check the Customer's Entitlement

Use the customer's entitlement to determine access.

```javascript
const hasAccess =
    await SolydFlow.hasEntitlement(
        "premium_access"
    );

if (hasAccess) {
    unlockPremiumFeatures();
}
```

---

## 5. Test in Sandbox

Before going live, verify that your integration handles:

- Successful payments
- Failed payments
- Interrupted payments
- Delayed transactions

**[Sandbox →](../sandbox/overview.md)**

---

## Related Documentation

- **[Transactions →](../concepts/transactions.md)**
- **[Entitlements →](../concepts/entitlements.md)**
- **[Sandbox →](../sandbox/overview.md)**

<!-- ## Related Content

**[Production Checklist →](../production/production-checklist.md)** -->