# Users

A **User** represents a customer in your application.

SolydFlow uses the user identity provided by your application to associate purchases, transactions, and entitlements with the correct customer.

```text
User
 │
 ├── Purchases
 ├── Transactions
 └── Entitlements
```

A user belongs to a project and serves as the link between your application and its revenue data.

---

## Your Application Owns User Identity

Your application remains the source of truth for user accounts.

SolydFlow does not manage:

* Authentication
* Passwords
* Sessions
* User profiles

Instead, provide a stable user identifier when initializing the SDK.

```javascript
await SolydFlow.configure({
  apiKey: "...",
  userId: "user_12345"
});
```

The same customer should always be represented by the same `userId`.

---

## Optional Customer Identifiers

In addition to a stable `userId`, you can provide customer contact information such as an email address and WhatsApp number.

```javascript
await SolydFlow.configure({
  apiKey: "...",
  userId: "user_12345",
  email: "john@example.com",
  phoneNumber: "+2348012345678"
});
```

Providing this information allows SolydFlow to better associate payment activity with the correct customer.

Where supported by your payment provider and recovery workflow, SolydFlow can also use these identifiers to assist with recovering transactions that may have been interrupted or left unresolved—for example, when a payment succeeds but your application does not receive the expected callback.

```text
Customer
     ↓
Payment Completed
     ↓
Callback Missing
     ↓
Recovery Process
     ↓
Customer Identified
     ↓
Transaction Recovered
```

Customer contact information is optional but recommended, especially for applications that want to maximize transaction recovery and provide a better payment experience.

---


## Why User Identity Matters

Every purchase, transaction, and entitlement is associated with a user.

```text
User
    ↓
Purchase
    ↓
Transaction
    ↓
Entitlement
    ↓
Access
```

Using a consistent user identifier allows SolydFlow to:

* Associate purchases with the correct customer
* Track transaction history
* Grant and restore entitlements
* Recover interrupted purchases
* Synchronize customer access across devices
* Improve transaction recovery by matching payment activity to known customer identifiers such as email addresses and phone numbers

---

## One User, Multiple Purchases

A customer can make multiple purchases over time.

```text
User
 │
 ├── Monthly Subscription
 ├── AI Credits
 └── Premium Upgrade
```

Each purchase creates its own transaction while remaining associated with the same user.

---

## One User, Multiple Entitlements

A customer can also hold multiple entitlements.

```text
User
 │
 ├── premium_access
 ├── analytics_access
 └── ai_generation
```

Your application should check the customer's entitlements rather than relying on payment provider responses.

```javascript
const hasAccess = await SolydFlow.hasEntitlement("premium_access");

if (hasAccess) {
  unlockFeatures();
}
```

---

## Use Stable User Identifiers

Always use an identifier that consistently represents the same customer.

Avoid identifiers that change between sessions or devices.

❌ Bad

```text
Session 1 → guest_abc
Session 2 → guest_xyz
Session 3 → guest_123
```

✅ Good

```text
user_12345
      │
      ├── Purchase 1
      ├── Purchase 2
      └── Purchase 3
```

Using different identifiers for the same customer prevents SolydFlow from correctly associating purchases and entitlements.

---

## Users Across Projects

Users are scoped to a project.

The same customer can exist in multiple projects, with each project maintaining its own purchases, transactions, and entitlements.

```text
Project A
 └── user_12345

Project B
 └── user_12345
```

This allows projects to operate independently while using the same identifier from your application if appropriate.

---

## Best Practices

When integrating SolydFlow:

* Use a permanent user identifier from your application.
* Configure the SDK after the customer has been identified.
* Reuse the same identifier across devices and sessions.
* Check entitlements for access instead of transaction responses.

---

## Related Documentation

* **[Transactions →](./transactions.md)**
* **[Entitlements →](./entitlements.md)**
* **[Transaction States →](./transaction-states.md)**

<!-- ## Related Content

Now that you understand how customers are represented in SolydFlow, the next step is to learn how monetization works.

* **[Monetization →](../monetization/overview.md)** -->

