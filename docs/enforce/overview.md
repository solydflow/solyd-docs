# Enforce

SolydFlow Enforce is the layer responsible for turning reliable transaction information into reliable revenue and entitlement decisions.

A payment is not useful to an application simply because a provider reports it as successful.

The application also needs to know:

* Which transaction should be trusted
* Whether the transaction is final
* Which entitlement should be granted
* Which provider should process the payment
* What should happen when a provider becomes unavailable
* Whether access should continue after the transaction changes

Enforce provides the mechanisms for applying those decisions consistently.

---

# Why Enforce Exists

Consider a customer purchasing a subscription.

```text id="m7q3k8"
Customer
   ↓
Payment
   ↓
Provider
   ↓
Successful
```

Knowing that the payment succeeded is only part of the process.

The application still needs to determine:

```text id="q8n4r2"
Successful Payment
       ↓
Is it final?
       ↓
Which product?
       ↓
Which package?
       ↓
Which entitlement?
       ↓
Should access be granted?
```

Without a consistent enforcement layer, every application has to build this logic independently.

SolydFlow Enforce centralizes these decisions.

---

# Enforce in the SolydFlow Architecture

Enforce sits on top of the transaction, recovery, and Truth layers.

A simplified architecture is:

```text id="x5r8m3"
Payment Providers
       ↓
   Transactions
       ↓
     Recover
       ↓
      Truth
       ↓
     Enforce
       ↓
  Entitlements
       ↓
   Your Application
```

Each layer has a different responsibility.

### Recover

Attempts to recover transactions that are missing, delayed, or unresolved.

### Truth

Determines the transaction state that can be relied upon based on available evidence.

### Enforce

Applies that trusted state to payment routing, transaction finality, and customer entitlements.

---

# Enforce Is Not Payment Verification

Verification determines what the provider says about a transaction.

```text id="v3m8q5"
SolydFlow
   ↓
Provider
   ↓
Transaction Information
```

Enforce operates after the transaction information has been evaluated.

```text id="k7q2m4"
Transaction Evidence
       ↓
      Truth
       ↓
Reliable State
       ↓
     Enforce
```

This separation is important.

Enforce should not independently invent transaction truth.

---

# Enforce and Truth

Truth answers:

> **What transaction state can we rely on?**

Enforce answers:

> **What should the system do with that state?**

For example:

```text id="m4q8n2"
Provider
└── Successful

SolydFlow
└── Pending
```

Truth evaluates the available evidence:

```text id="r8m3k5"
Evidence
   ↓
Verification
   ↓
Consensus
   ↓
Successful
```

Enforce can then apply the result:

```text id="x7n4q2"
Successful
   ↓
Finality
   ↓
Entitlement
   ↓
Access Granted
```

---

# The Four Enforce Capabilities

The Enforce layer consists of four major capabilities:

```text id="q5m8r3"
             Enforce
                │
      ┌─────────┼─────────┐
      │         │         │
      ▼         ▼         ▼
Smart       Provider   Transaction
Routing     Failover    Finality
                          │
                          ▼
                  Entitlement
                   Enforcement
```

These are:

1. **Smart Routing**
2. **Provider Failover**
3. **Transaction Finality**
4. **Entitlement Enforcement**

Each addresses a different part of reliable revenue infrastructure.

---

# Smart Routing

Smart routing determines which payment provider should be used for a transaction.

For example:

```text id="k8m3q5"
Payment
   ↓
Routing
  / \
 ↓   ↓
A     B
```

The choice may depend on factors such as:

* Available providers
* Supported payment methods
* Currency
* Region
* Provider availability
* Application configuration
* Transaction requirements

The goal is to avoid forcing the application to implement provider-selection logic independently.

See:

[Smart Routing →](./smart-routing.md)

---

# Provider Failover

A provider may become unavailable.

For example:

```text id="m5q8v3"
Payment
   ↓
Provider A
   X
Unavailable
```

If another provider can safely handle the transaction:

```text id="r7n3k5"
Provider A
   X
   ↓
Failover
   ↓
Provider B
   ↓
Payment
```

Provider failover is different from simply retrying the same payment request.

The system must account for the possibility that the first provider actually processed the payment even though the response was unsuccessful or unavailable.

This is why failover depends on the transaction truth and state.

See:

[Provider Failover →](./provider-failover.md)

---

# Transaction Finality

A transaction can pass through several states before reaching a final state.

For example:

```text id="q8m4n2"
Created
   ↓
Pending
   ↓
Processing
   ↓
Successful
```

Enforce needs to understand when a transaction has reached a state that should be treated as final for the relevant operation.

Finality helps prevent actions such as:

* Granting access too early
* Reversing a completed transaction incorrectly
* Processing the same transaction more than once
* Treating temporary states as permanent

See:

[Transaction Finality →](./transaction-finality.md)

---

# Entitlement Enforcement

A payment ultimately needs to produce the appropriate customer access.

For example:

```text id="x5r8m3"
Successful Transaction
       ↓
Product
       ↓
Package
       ↓
Entitlement
       ↓
Customer Access
```

Enforce ensures that transaction state and entitlement state remain connected.

For example:

```text id="v7m3q5"
Transaction
└── Successful
       ↓
Entitlement
└── Active
```

If the transaction changes, the entitlement may need to change as well.

See:

[Entitlement Enforcement →](./entitlement-enforcement.md)

---

# Enforce and Entitlements

An entitlement represents what a customer is allowed to access.

For example:

```text id="k4m8r2"
Customer
   ↓
Successful Purchase
   ↓
Package
   ↓
Entitlement
   ↓
Premium Access
```

Enforce applies the transaction outcome to that entitlement.

This separates payment processing from application access control.

Your application does not need to independently interpret every payment-provider response to determine whether a customer should have access.

---

# Enforce and Packages

A transaction may be associated with a package.

For example:

```text id="m8q3v5"
Transaction
   ↓
Product
   ↓
Package
   ↓
Entitlement
```

The package defines what the customer purchased, while Enforce determines how the resulting transaction state affects the entitlement.

See:

[Packages →](../concepts/packages.md)

---

# Enforce and Products

Products provide the commercial identity of what is being sold.

For example:

```text id="q7n3m8"
Product
└── Premium App

Package
└── Monthly

Transaction
└── Successful

Entitlement
└── Premium Access
```

Enforce connects the trusted transaction outcome to the appropriate access decision.

See:

[Products →](../concepts/products.md)

---

# Enforce and Payment Providers

Applications may use multiple payment providers.

For example:

```text id="x8m4q2"
                  SolydFlow
                 /        \
                ↓          ↓
           Paystack    Flutterwave
```

Enforce helps prevent provider-specific payment logic from becoming application-specific business logic.

The application can work with the SolydFlow transaction model while SolydFlow manages provider-specific routing and state behavior.

---

# Why Multiple Providers Matter

Different providers may be stronger in different markets or payment scenarios.

For example:

```text id="r5m8k3"
Nigeria
└── Provider A

Kenya
└── Provider B

International
└── Provider C
```

A unified infrastructure layer can use different providers without forcing the application to implement a separate payment flow for each one.

This becomes especially important as an application expands across regions.

---

# Enforce and Provider Failures

A provider failure does not necessarily mean the payment failed.

Consider:

```text id="q8m3v5"
Application
   ↓
Provider A
   ↓
Payment
   ↓
Provider Timeout
```

At this point, the payment outcome may be uncertain.

Enforce should rely on the transaction state established by the appropriate recovery and Truth processes before deciding whether another provider should be used.

```text id="m7r2n8"
Provider Timeout
      ↓
Transaction Investigation
      ↓
Truth
      ↓
Known State?
   /       \
 Yes        No
 ↓          ↓
Enforce   Recover / Verify
```

This helps reduce duplicate payment attempts.

---

# Enforce and Failover Are Not the Same as Retry

A retry means attempting an operation again.

Failover means changing the provider or route used to process the operation.

For example:

```text id="k4q8m3"
Retry
Provider A
   ↓
Provider A
```

while:

```text id="x7m3r5"
Failover
Provider A
   ↓
Provider B
```

Both require careful transaction handling.

If the first provider may have processed the transaction, blindly failing over can create a duplicate payment.

---

# Enforce and Transaction Finality

Provider routing decisions should account for transaction state.

For example:

```text id="m8r3q5"
Provider A
└── Payment Pending
```

It may be unsafe to immediately send another payment to Provider B without first determining whether Provider A actually completed the payment.

The safer model is:

```text id="q5n8m3"
Provider A
   ↓
Uncertain
   ↓
Recovery / Verification
   ↓
Truth
   ↓
Routing Decision
```

This is why Enforce depends on the preceding layers.

---

# Enforce and Recovery

Recovery attempts to establish the state of transactions that are unresolved.

Enforce acts on the resulting state.

```text id="v8m3k5"
Transaction
   ↓
Recover
   ↓
Truth
   ↓
Enforce
```

For example:

```text id="r7q2m4"
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Successful
   ↓
Entitlement Enforcement
```

See:

[Recovery Overview →](../recover/overview.md)

---

# Enforce and Webhooks

Webhooks can provide information that eventually affects enforcement.

```text id="m4q8n3"
Provider
   ↓
Webhook
   ↓
Truth
   ↓
Enforce
   ↓
Entitlement
```

The webhook should not bypass the transaction validation and Truth mechanisms where those mechanisms are required.

See:

[Webhooks Overview →](../webhooks/overview.md)

---

# Enforce and Reconciliation

Reconciliation can discover a difference between provider records and SolydFlow records.

```text id="x8m3r5"
Reconciliation
      ↓
Difference
      ↓
Truth
      ↓
Resolved State
      ↓
Enforce
```

For example, a transaction that was previously pending may become successful after reconciliation and verification.

Enforce can then apply the resulting state to the customer's entitlement.

See:

[Reconciliation →](../truth/reconciliation.md)

---

# Enforce and Transaction State

Enforce depends heavily on transaction state.

A simplified model is:

```text id="q7m4n8"
Transaction
     ↓
State
     ↓
Finality
     ↓
Enforcement Decision
```

Not every state should produce the same action.

For example:

```text id="m8r3q5"
Pending
   ↓
Do not grant final entitlement
```

while:

```text id="k5n7m2"
Successful / Final
   ↓
Grant appropriate entitlement
```

The exact state behavior depends on the transaction and product configuration.

---

# Enforce and Customer Access

The ultimate purpose of entitlement enforcement is to ensure that customer access reflects the reliable state of the customer's revenue relationship.

For example:

```text id="v3q8m5"
Customer
   ↓
Purchase
   ↓
Verified Transaction
   ↓
Final State
   ↓
Entitlement
   ↓
Access
```

This prevents payment status and application access from becoming disconnected systems.

---

# What Enforce Does Not Do

Enforce does not replace:

* Payment providers
* Transaction verification
* Recovery
* Reconciliation
* Your application's access-control system

Instead, it provides the infrastructure connecting these systems.

```text id="q8m3r4"
Providers
   ↓
Transactions
   ↓
Recover
   ↓
Truth
   ↓
Enforce
   ↓
Application
```

---

# A Complete Example

Consider a customer purchasing a premium package.

### Step 1: Payment starts

```text id="m5r8q3"
Customer
   ↓
Application
   ↓
SolydFlow
```

### Step 2: Smart routing selects a provider

```text id="k7q3m8"
SolydFlow
   ↓
Smart Routing
   ↓
Provider A
```

### Step 3: Provider processes the payment

```text id="v4m8n2"
Provider A
└── Successful
```

### Step 4: Provider event reaches SolydFlow

```text id="x8r3q5"
Provider
   ↓
Webhook
   ↓
SolydFlow
```

### Step 5: Truth establishes the transaction state

```text id="q5m7k3"
Evidence
   ↓
Truth
   ↓
Successful
```

### Step 6: Enforce evaluates finality

```text id="m8q3v4"
Successful
   ↓
Final
```

### Step 7: Entitlement is enforced

```text id="r7n2m5"
Package
   ↓
Entitlement
   ↓
Active
```

### Step 8: Application receives the result

```text id="k4m8q3"
Customer
   ↓
Premium Access
```

---

# The Enforce Model

The complete relationship is:

```text id="x7m3q8"
                   SolydFlow
                       │
          ┌────────────┴────────────┐
          │                         │
       Payments                  Revenue
          │                         │
          ▼                         ▼
     Transactions                Enforce
          │                 ┌───────┼────────┐
          ▼                 │       │        │
       Recover              ▼       ▼        ▼
          │             Routing  Failover  Finality
          ▼                                  │
        Truth                                 ▼
          │                              Entitlements
          └──────────────────────────────────┘
```

The important distinction is:

```text id="m8q3r5"
Truth
"What happened?"

Enforce
"What should happen because of it?"
```

---

# Design Principles

### 1. Enforce trusted outcomes

Enforcement decisions should be based on reliable transaction state.

### 2. Do not confuse uncertainty with failure

An uncertain payment should be investigated before another payment is initiated.

### 3. Keep provider logic out of the application

Provider-specific routing and failover should be handled by the infrastructure layer where possible.

### 4. Protect against duplicate payments

Failover and retries must account for the possibility that the original provider processed the payment.

### 5. Connect payments to entitlements

A successful transaction should have a clear relationship with the customer's resulting access.

### 6. Respect transaction finality

Temporary states should not be treated as permanent outcomes.

### 7. Keep enforcement traceable

Important enforcement decisions should be observable and associated with the relevant transaction.

---

# The Core Principle

> **Truth establishes what happened. Enforce determines what the system should do about it.**

The simplified flow is:

```text id="q8m3r5"
Payment
   ↓
Recover
   ↓
Truth
   ↓
Enforce
   ├── Smart Routing
   ├── Provider Failover
   ├── Transaction Finality
   └── Entitlement Enforcement
```

This allows developers to focus on their product while SolydFlow handles the complexity of reliable revenue operations underneath it.

---

## Related Documentation

### Enforce

[Smart Routing →](./smart-routing.md)

[Provider Failover →](./provider-failover.md)

[Transaction Finality →](./transaction-finality.md)

[Entitlement Enforcement →](./entitlement-enforcement.md)

### Truth

[Truth Overview →](../truth/overview.md)

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Transaction Ledger →](../truth/transaction-ledger.md)

[State Mismatches →](../truth/state-mismatches.md)

[Reconciliation →](../truth/reconciliation.md)

### Recovery

[Recovery Overview →](../recover/overview.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Provider Webhooks →](../webhooks/provider-webhooks.md)

[Event Handling →](../webhooks/event-handling.md)

### Concepts

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

---

<!-- ## Related Content

Continue with Smart Routing:

[Smart Routing →](./smart-routing.md) -->

