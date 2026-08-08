# Entitlement Enforcement

Entitlement enforcement is the process of ensuring that a customer's access to a product or feature reflects the trusted state of their payment.

A payment does not automatically mean that an entitlement should be granted.

Instead, SolydFlow connects:

```text id="a4m8q2"
Transaction
    ↓
Truth
    ↓
Finality
    ↓
Entitlement
    ↓
Customer Access
```

This allows applications to separate **payment processing** from **access enforcement**.

---

# Why Entitlement Enforcement Matters

Consider a customer purchasing a premium subscription.

The payment may initially be:

```text id="q8m3r5"
Payment
   ↓
Pending
```

The application should not necessarily grant premium access immediately.

The transaction may later become:

```text id="m5r8q3"
Successful
```

Once the required finality conditions are satisfied:

```text id="x7q3m8"
Successful
   ↓
Final
   ↓
Entitlement
   ↓
Premium Access
```

This prevents temporary or uncertain payment states from being treated as confirmed purchases.

---

# Entitlement vs Transaction

A transaction answers:

> **What happened to the payment?**

An entitlement answers:

> **What is the customer allowed to access?**

They are related but different concepts.

```text id="k4m8q3"
Transaction
└── Payment was successful

Entitlement
└── Customer has access to Product X
```

The transaction provides the financial evidence.

The entitlement represents the resulting access.

See:

[Entitlements →](../concepts/entitlements.md)

[Transactions →](../concepts/transactions.md)

---

# The Enforcement Flow

The simplified enforcement flow is:

```text id="v8m3q5"
Payment
   ↓
Transaction
   ↓
Truth
   ↓
Finality
   ↓
Entitlement Decision
   ↓
Customer Access
```

For a successful purchase:

```text id="m4q8r3"
Payment Successful
       ↓
Verified
       ↓
Final
       ↓
Grant Entitlement
       ↓
Access Granted
```

For an unresolved payment:

```text id="q7m3n5"
Payment Pending
       ↓
Not Final
       ↓
Do Not Grant Final Entitlement
```

---

# Enforcement Is Based on Trusted State

An entitlement should not be granted simply because:

* A payment request was created
* A checkout was opened
* A provider was selected
* A payment attempt was made
* A provider returned an uncertain response

Instead, enforcement should be based on the transaction state established by the SolydFlow revenue infrastructure.

```text id="x5m8q3"
Provider Events
      ↓
Verification
      ↓
Truth
      ↓
Finality
      ↓
Enforcement
```

---

# Successful Payment

The most straightforward case is a successfully completed transaction.

```text id="m8q3r5"
Payment
   ↓
Successful
   ↓
Verified
   ↓
Final
```

SolydFlow can then determine that the associated entitlement should become active according to the application's configuration.

```text id="k7m3q8"
Final Successful Transaction
          ↓
      Entitlement
          ↓
       Active
```

---

# Pending Payment

A pending transaction has not necessarily reached the state required to grant access.

```text id="q8m3r5"
Payment
   ↓
Pending
```

The entitlement should therefore remain unresolved or inactive until the transaction reaches the required state.

```text id="v5m8q3"
Pending
   ↓
Continue Evaluation
   ↓
No Final Enforcement
```

This is particularly important for payment methods where confirmation can take time.

---

# Failed Payment

A failed payment does not establish a successful entitlement.

```text id="m4q8r3"
Payment
   ↓
Failed
   ↓
No Successful Entitlement
```

If the failure is final:

```text id="x7q3m5"
Final Failure
   ↓
Entitlement Not Granted
```

If the failure is recoverable or another attempt is permitted, the transaction can continue through the applicable recovery or payment flow.

---

# Unknown Payment Outcome

An unknown outcome requires particular care.

For example:

```text id="q5m8r3"
Payment
   ↓
Provider Timeout
   ↓
Unknown
```

The system should not interpret this as:

```text id="v8m3q5"
Failed
```

nor should it automatically grant an entitlement.

Instead:

```text id="m7q3r5"
Unknown
   ↓
Recovery
   ↓
Verification
   ↓
Truth
   ↓
Finality
   ↓
Enforcement
```

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

# Entitlement Enforcement and Finality

Finality is the boundary that allows an entitlement decision to be made safely.

```text id="x4m8q3"
Transaction State
       ↓
Finality
      / \
    No   Yes
    ↓     ↓
Continue  Enforce
```

For example:

```text id="k8q3m5"
Successful
   ↓
Final
   ↓
Grant Entitlement
```

while:

```text id="m5r8q3"
Successful
   ↓
Not Yet Final
   ↓
Continue Evaluation
```

The exact finality requirements depend on the transaction and enforcement configuration.

See:

[Transaction Finality →](./transaction-finality.md)

---

# Entitlement Activation

When the transaction reaches the required successful state, the corresponding entitlement can become active.

Conceptually:

```text id="q7m3r8"
Customer
   ↓
Purchase
   ↓
Final Successful Transaction
   ↓
Entitlement
   ↓
Active
```

The entitlement can then be used by the application to determine what the customer can access.

---

# Entitlement Expiration

An entitlement may have a defined validity period.

For example:

```text id="v8m3q5"
Purchase
   ↓
Entitlement
   ↓
Active
   ↓
Expiration
```

For a time-limited product:

```text id="m4q8r3"
Start
  ↓
Active
  ↓
Expiration Date
  ↓
Expired
```

The exact expiration behavior depends on the product, package, and entitlement configuration.

See:

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

---

# Entitlement Renewal

A recurring or renewable entitlement may be extended by another successful transaction.

Conceptually:

```text id="x7q3m5"
Existing Entitlement
       ↓
Renewal Payment
       ↓
Verified
       ↓
Final
       ↓
Entitlement Extended
```

This keeps entitlement state connected to the revenue events that support it.

---

# Entitlement and Multiple Transactions

A customer may have multiple transactions associated with an entitlement over time.

For example:

```text id="k8m3q5"
Customer

Transaction 1
   ↓
Initial Purchase
   ↓
Entitlement

Transaction 2
   ↓
Renewal
   ↓
Entitlement Extended

Transaction 3
   ↓
Renewal
   ↓
Entitlement Extended
```

The entitlement represents the customer's resulting access rather than treating every transaction as an independent access record.

---

# Entitlement and Products

A transaction can be associated with a product.

```text id="q5m8r3"
Transaction
   ↓
Product
   ↓
Entitlement
```

For example:

```text id="m7q3r5"
Premium Product
       ↓
Successful Purchase
       ↓
Premium Entitlement
```

The exact relationship between products and entitlements is defined by the application's product configuration.

See:

[Products →](../concepts/products.md)

---

# Entitlement and Packages

Packages can define a particular commercial offering associated with a product.

For example:

```text id="x8m3q5"
Product
   ↓
Premium Package
   ↓
Purchase
   ↓
Entitlement
```

The resulting entitlement can reflect the access associated with that package.

See:

[Packages →](../concepts/packages.md)

---

# Entitlement and Pricing

Pricing determines what the customer pays.

Entitlement enforcement determines what the customer receives access to after the relevant payment outcome has been established.

```text id="k4m8r3"
Pricing
   ↓
Payment
   ↓
Transaction
   ↓
Finality
   ↓
Entitlement
```

These concerns should remain separate.

See:

[Pricing →](../concepts/pricing.md)

---

# Entitlement and Paywalls

A paywall controls when a customer must purchase access.

The entitlement determines whether that customer has already obtained the required access.

Conceptually:

```text id="q7m3r5"
Customer
   ↓
Paywall
   ↓
Does entitlement exist?
      / \
    Yes  No
    ↓     ↓
  Access  Purchase
```

After a successful purchase:

```text id="m8q3r5"
Purchase
   ↓
Final Transaction
   ↓
Entitlement
   ↓
Paywall
   ↓
Access
```

See:

[Paywalls →](../concepts/paywalls.md)

---

# Entitlement Enforcement and Recovery

If a payment has not reached a final outcome, SolydFlow may continue recovery.

For example:

```text id="x5m8q3"
Payment
   ↓
Unknown
   ↓
Recovery
   ↓
Verification
```

If recovery establishes success:

```text id="k7q3m5"
Successful
   ↓
Final
   ↓
Entitlement
```

If recovery establishes failure:

```text id="v8m3q5"
Failed
   ↓
Final
   ↓
No Successful Entitlement
```

This prevents entitlement decisions from being made while the payment outcome remains uncertain.

---

# Entitlement Enforcement and Webhooks

Provider webhooks can provide important transaction evidence.

For example:

```text id="m4q8r3"
Provider
   ↓
Successful
   ↓
Webhook
   ↓
SolydFlow
```

SolydFlow can process the event as part of the transaction verification and Truth process.

```text id="q7m3r5"
Webhook
   ↓
Verification
   ↓
Truth
   ↓
Finality
   ↓
Entitlement
```

A webhook itself should not be confused with the entitlement.

The webhook is evidence.

The entitlement is the resulting access state.

See:

[Provider Webhooks →](../webhooks/provider-webhooks.md)

[Event Handling →](../webhooks/event-handling.md)

---

# Entitlement Enforcement and Webhook Failures

A missing webhook does not necessarily mean that the transaction failed.

For example:

```text id="x8m3q5"
Provider
   ↓
Successful
   X
Webhook Not Received
```

The transaction may still be recoverable through verification or reconciliation.

```text id="m5q8r3"
Missing Webhook
      ↓
Recovery
      ↓
Verification
      ↓
Truth
      ↓
Finality
      ↓
Entitlement
```

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

# Entitlement Revocation

An entitlement may need to be removed or changed when the underlying revenue state requires it.

Conceptually:

```text id="q4m8r3"
Entitlement
   ↓
Transaction / Revenue State Changes
   ↓
Truth
   ↓
Finality
   ↓
Enforcement
   ↓
Entitlement Updated
```

The exact revocation conditions depend on the product and entitlement model.

The important principle is that entitlement changes should be driven by trusted transaction information rather than by isolated provider events.

---

# Entitlement and Refunds

A refund changes the financial outcome associated with a transaction.

Where the application's entitlement rules require it, the resulting verified state can trigger an entitlement change.

Conceptually:

```text id="k8m3q5"
Successful Purchase
       ↓
Entitlement Active
       ↓
Refund
       ↓
Verified State
       ↓
Enforcement
       ↓
Entitlement Updated
```

The exact refund and entitlement behavior depends on the supported transaction model.

---

# Entitlement and Chargebacks

A chargeback can similarly introduce a change to the financial state of a transaction.

The general model is:

```text id="v5m8r3"
Transaction
   ↓
Chargeback Event
   ↓
Verification
   ↓
Truth
   ↓
Enforcement
   ↓
Entitlement Decision
```

The application should consume the resulting trusted entitlement state rather than implementing provider-specific chargeback handling independently.

---

# Entitlement and Provider Failover

Failover should not grant an entitlement simply because another provider successfully received an attempt.

For example:

```text id="m7q3r5"
Provider A
   ↓
Unknown
   ↓
Recovery
   ↓
Failover
   ↓
Provider B
```

The entitlement should be based on the resulting transaction truth.

```text id="x8m3q5"
Provider Attempts
       ↓
Truth
       ↓
Final Transaction
       ↓
Entitlement
```

This prevents multiple provider attempts from being mistaken for multiple successful purchases.

See:

[Provider Failover →](./provider-failover.md)

---

# Entitlement and the Transaction Ledger

The transaction ledger provides the history behind an entitlement decision.

For example:

```text id="q5m8r3"
Transaction TX-123

Created
   ↓
Provider A
   ↓
Timeout
   ↓
Recovery
   ↓
Provider A Verified
   ↓
Successful
   ↓
Final
   ↓
Entitlement Granted
```

This history helps explain why the customer received access.

See:

[Transaction Ledger →](../truth/transaction-ledger.md)

---

# Entitlement Enforcement and Multiple Providers

The customer should not need to know which provider ultimately processed the payment.

For example:

```text id="m8q3r5"
Customer
   ↓
SolydFlow
   ↓
Provider A
   ↓
Provider Failure
   ↓
Provider B
   ↓
Successful
   ↓
Entitlement
```

The entitlement represents the customer's access resulting from the transaction, not the provider that happened to process it.

---

# Application Integration

The application should ideally consume the resulting entitlement rather than reconstructing it from raw provider events.

Instead of:

```text id="x7m3q5"
Provider Webhook
   ↓
Application
   ↓
Custom Payment Logic
   ↓
Custom Entitlement Logic
```

the application can work with:

```text id="k4m8r3"
Provider Events
      ↓
SolydFlow
      ↓
Truth
      ↓
Finality
      ↓
Entitlement
      ↓
Application
```

This keeps payment-provider complexity inside the revenue infrastructure layer.

---

# Entitlement Enforcement and Security

Entitlement state should be treated as an important authorization signal.

The application should not allow a client to arbitrarily declare:

```text id="m5q8r3"
entitlement = active
```

Instead, entitlement state should originate from the trusted payment infrastructure.

Conceptually:

```text id="q8m3r5"
Provider Evidence
      ↓
SolydFlow
      ↓
Trusted Transaction State
      ↓
Entitlement
      ↓
Application Access
```

Client-side state can improve the user experience, but it should not be treated as the authoritative source for payment-derived access.

See:

[Credential Security →](../security/credential-security.md)

[Webhook Security →](../security/webhook-security.md)

---

# Entitlement Enforcement and API Design

The application should be able to determine whether a customer has the entitlement required for a particular feature.

Conceptually:

```text id="v7m3q5"
Application
    ↓
Customer Entitlement
    ↓
Access Decision
```

The exact API shape depends on the SolydFlow implementation.

The important separation is:

```text id="m4q8r3"
Payment Infrastructure
          ↓
Entitlement State
          ↓
Application Authorization
```

---

# Example: Successful Purchase

A customer purchases a premium package.

### Payment

```text id="q7m3r5"
Customer
   ↓
Premium Package
   ↓
Payment
```

### Transaction

```text id="x8m3q5"
Payment
   ↓
Successful
```

### Truth and finality

```text id="m5q8r3"
Successful
   ↓
Verified
   ↓
Final
```

### Enforcement

```text id="k7m3r5"
Final Successful Transaction
          ↓
Premium Entitlement
          ↓
Active
```

### Application

```text id="v8q3m5"
Premium Entitlement
       ↓
Premium Features
       ↓
Access Granted
```

---

# Example: Pending Purchase

A customer starts a purchase but the provider has not completed it.

```text id="q4m8r3"
Payment
   ↓
Pending
```

The entitlement remains unenforced:

```text id="m8q3r5"
Pending
   ↓
No Final Successful Transaction
   ↓
No Final Entitlement
```

When the payment eventually succeeds:

```text id="x5m8q3"
Successful
   ↓
Final
   ↓
Entitlement
   ↓
Access
```

---

# Example: Failed Purchase

A provider definitively rejects the payment.

```text id="k7m3r5"
Payment
   ↓
Declined
   ↓
Verified Failure
   ↓
Final Failure
```

The entitlement is not activated:

```text id="v8q3m5"
Final Failure
   ↓
No Successful Entitlement
```

The customer can then be presented with an appropriate payment or retry option.

---

# Example: Timeout With Later Success

A customer completes checkout, but the provider response times out.

```text id="m4q8r3"
Payment
   ↓
Timeout
```

SolydFlow does not immediately grant or deny access.

```text id="q7m3r5"
Unknown
   ↓
Recovery
```

The provider later confirms the transaction:

```text id="x8m3q5"
Provider
   ↓
Successful
```

Truth establishes the outcome:

```text id="k5m8r3"
Successful
   ↓
Final
```

The entitlement is then enforced:

```text id="v7q3m5"
Final Successful Transaction
       ↓
Entitlement Active
```

This allows the customer to receive the correct access without treating the original timeout as a failed payment.

---

# Example: Failover

A payment cannot be safely completed through the initially selected provider.

```text id="m8q3r5"
Provider A
   ↓
Known Failure
```

SolydFlow evaluates another eligible provider:

```text id="x5m8q3"
Provider B
   ↓
Payment
   ↓
Successful
```

After verification and finality:

```text id="q7m3r5"
Provider B Success
       ↓
Truth
       ↓
Finality
       ↓
Entitlement
```

The customer receives the entitlement without needing to know which provider processed the successful payment.

---

# The Enforcement Model

The complete Enforce flow is:

```text id="k8m3q5"
Payment
   ↓
Smart Routing
   ↓
Provider
   ↓
Transaction
   ↓
Recovery / Verification
   ↓
Truth
   ↓
Finality
   ↓
Entitlement Enforcement
   ↓
Customer Access
```

When something goes wrong:

```text id="v4m8r3"
Provider Problem
      ↓
Recovery / Truth
      ↓
Is the transaction final?
      │
      ├── No
      │    ↓
      │ Continue evaluation
      │
      └── Yes
           ↓
      Enforcement Decision
           ↓
      Entitlement
```

---

# Key Principles

### 1. Payment and access are separate concerns

A payment transaction records the financial event. An entitlement represents access.

### 2. Enforce trusted outcomes

Entitlements should be based on the trusted transaction state.

### 3. Do not grant access from payment attempts

Creating or attempting a payment is not equivalent to completing it.

### 4. Respect finality

A non-final transaction should not automatically drive a final entitlement decision.

### 5. Protect against duplicate payments

Multiple provider attempts should remain associated with the appropriate transaction.

### 6. Keep provider complexity out of the application

The application should not need to implement provider-specific entitlement logic.

### 7. Entitlements can change

Renewals, refunds, chargebacks, expiration, and other verified revenue events can affect entitlement state.

### 8. Keep enforcement traceable

An entitlement decision should be explainable through the underlying transaction history.

---

# The Core Principle

> **Entitlement enforcement turns trusted payment outcomes into customer access decisions.**

The complete SolydFlow model is:

```text id="m7q3r5"
Payment
   ↓
Provider
   ↓
Transaction
   ↓
Truth
   ↓
Finality
   ↓
Entitlement
   ↓
Access
```

This allows SolydFlow to keep the difficult payment-state logic inside the revenue infrastructure while giving applications a reliable basis for determining what customers can access.

---

## Related Documentation

### Enforce

[Enforce Overview →](./overview.md)

[Smart Routing →](./smart-routing.md)

[Provider Failover →](./provider-failover.md)

[Transaction Finality →](./transaction-finality.md)

### Concepts

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Paywalls →](../concepts/paywalls.md)

[Entitlements →](../concepts/entitlements.md)

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

### Truth

[Truth Overview →](../truth/overview.md)

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Transaction Ledger →](../truth/transaction-ledger.md)

[Reconciliation →](../truth/reconciliation.md)

### Recover

[Recovery Overview →](../recover/overview.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Provider Webhooks →](../webhooks/provider-webhooks.md)

[Event Handling →](../webhooks/event-handling.md)

### Security

[Credential Security →](../security/credential-security.md)

[Webhook Security →](../security/webhook-security.md)

---

<!-- ## Related Content

The **Enforce** section is now complete.

Next, continue with:

[Webhooks Overview →](../webhooks/overview.md) -->
