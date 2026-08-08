# Configure SolydFlow

After installing the SDK, initialize it with your SolydFlow project so your application can communicate with SolydFlow.

```text
SolydFlow Project
        │
        ▼
     API Key
        │
        ▼
Your Application
        │
        ▼
   SolydFlow SDK
```

---

## Before You Begin

Make sure you have:

- A SolydFlow project
- A Project API key
- The SolydFlow SDK installed

If not, complete:

- **[Create a Project →](./create-project.md)**
- **[Install the SDK →](./install-sdk.md)**

---

## Initialize the SDK

Initialize SolydFlow when your application starts.

```javascript
import { SolydFlow } from "solydflow-js";

await SolydFlow.configure({
    apiKey: "sf_pk_test_...",
    userId: "usr_123"
});
```

The initialization method may vary depending on your SDK.

**[SDK Documentation →](../sdk/overview.md)**

---

## Choose the Correct API Key

Use the API key for the environment you're working in.

```text
Sandbox
sf_pk_test_...

Live
sf_pk_live_...
```

- Sandbox → Development & Testing
- Live → Production

Never expose secret credentials in client-side applications.

**[Credential Security →](../security/credential-security.md)**

---

## Identify Your Customer

Provide a stable user identifier during initialization.

```javascript
await SolydFlow.configure({
    apiKey: "sf_pk_test_...",
    userId: "user_12345"
});
```

The same customer should always use the same `userId`.

This allows SolydFlow to associate:

- Transactions
- Entitlements
- Purchase history

with the correct customer.

---

## Initialize Once

Initialize SolydFlow once during application startup before performing revenue operations.

```text
Application Starts
        │
        ▼
Initialize SDK
        │
        ▼
Customer Ready
        │
        ▼
Purchases & Entitlements
```

---

## Verify Your Configuration

Before continuing, confirm that:

- SDK initialization succeeds
- The correct API key is used
- The customer is identified
- Your application can communicate with SolydFlow

If something isn't working, see:

**[Troubleshooting →](../troubleshooting/overview.md)**

---

## Related Documentation

- **[SDK Overview →](../sdk/overview.md)**
- **[Credential Security →](../security/credential-security.md)**

<!-- ## Related Content

**[Make Your First Purchase →](./first-purchase.md)** -->