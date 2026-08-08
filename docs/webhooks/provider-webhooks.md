# Provider Webhooks

Payment providers communicate transaction events to SolydFlow through webhooks.

These events allow SolydFlow to receive asynchronous updates about payment activity without continuously polling each provider.

The basic flow is:

```text
Payment Provider
      ↓
Provider Webhook
      ↓
SolydFlow
      ↓
Verify
      ↓
Validate
      ↓
Correlate With Transaction
      ↓
Process Evidence
      ↓
Truth
      ↓
Finality
```

Provider webhooks are therefore an important part of SolydFlow's ability to maintain reliable transaction state across different payment providers.

---

# Why Provider Webhooks Matter

A payment provider may complete or update a transaction after the original payment request has already returned.

For example:

```text
Application
    ↓
SolydFlow
    ↓
Payment Provider
    ↓
Initial Response
```

The final provider outcome may arrive later:

```text
Payment Provider
      ↓
Webhook
      ↓
SolydFlow
```

Without provider webhooks, SolydFlow may not immediately know that the transaction has changed.

---

# Provider Webhooks vs Inbound Webhooks

Provider webhooks are a specific type of inbound webhook.

The distinction is:

```text
Inbound Webhooks
└── General mechanism for receiving external events

Provider Webhooks
└── Payment-provider events received by SolydFlow
```

The general inbound webhook model is described in:

[Inbound Webhooks →](./inbound-webhooks.md)

This page focuses specifically on payment-provider events.

---

# Provider Webhook Flow

A provider webhook typically follows this path:

```text
Provider
   ↓
Webhook
   ↓
SolydFlow Endpoint
   ↓
Signature Verification
   ↓
Payload Validation
   ↓
Provider Event Identification
   ↓
Transaction Correlation
   ↓
Transaction Evaluation
   ↓
Truth
   ↓
Finality
```

The provider's event is evidence that SolydFlow can use when evaluating the transaction.

---

# Why SolydFlow Receives Provider Webhooks

Provider APIs are not necessarily sufficient for maintaining a reliable revenue state.

A payment may:

* Complete asynchronously
* Change after the initial request
* Time out at the application layer while succeeding at the provider
* Produce a webhook after a delayed confirmation
* Require additional verification
* Have conflicting evidence across systems

Provider webhooks provide another source of transaction evidence.

---

# Provider Events Are Evidence

A provider webhook should not automatically be interpreted as the final truth of a transaction.

For example:

```text
Provider Webhook
      ↓
"Successful"
```

does not necessarily mean the complete SolydFlow transaction lifecycle is finished.

Instead:

```text
Provider Webhook
      ↓
Verification
      ↓
Transaction Correlation
      ↓
Truth Evaluation
      ↓
Finality
```

This distinction is central to SolydFlow's architecture.

See:

[Transaction Verification →](../truth/transaction-verification.md)

[Transaction Finality →](../enforce/transaction-finality.md)

---

# Provider-Specific Webhook Formats

Different payment providers can use different webhook formats.

For example, providers may differ in:

* Event names
* Payload structures
* Signature mechanisms
* Headers
* Transaction identifiers
* Status values
* Timestamp formats
* Retry behavior

SolydFlow should normalize these differences internally rather than forcing the application to implement provider-specific webhook logic.

Conceptually:

```text
Paystack ────────┐
Flutterwave ─────┤
Stripe ──────────┤
M-Pesa ──────────┤
Monnify ─────────┤
                 ↓
             SolydFlow
                 ↓
       Unified Transaction Model
```

---

# Provider Normalization

The purpose of normalization is to translate provider-specific events into a common SolydFlow representation.

For example:

```text
Provider A
└── "success"

Provider B
└── "completed"

Provider C
└── "succeeded"
```

SolydFlow can normalize these provider-specific statuses into the appropriate internal transaction representation.

```text
Provider Event
      ↓
Provider Adapter
      ↓
Normalized Evidence
      ↓
Transaction
```

This keeps provider-specific differences inside the integration layer.

---

# Provider Adapter

Conceptually, each provider can have an adapter responsible for translating provider-specific behavior.

```text
Provider
   ↓
Provider Adapter
   ↓
SolydFlow Event Model
```

An adapter can be responsible for understanding:

* Provider event formats
* Provider identifiers
* Provider status values
* Provider signatures
* Provider-specific metadata

The rest of SolydFlow can then operate on normalized information.

---

# Transaction Correlation

A provider webhook must be associated with the correct SolydFlow transaction.

Conceptually:

```text
Provider Webhook
      ↓
Provider Transaction ID
      ↓
Find SolydFlow Transaction
      ↓
Correlate Event
```

Depending on the provider, correlation may involve:

* Provider transaction ID
* SolydFlow transaction reference
* Merchant reference
* Checkout reference
* Metadata
* Other provider-supported identifiers

The exact identifier depends on the provider integration.

---

# Why Correlation Matters

Suppose a provider sends:

```text
transaction_id = 12345
status = successful
```

SolydFlow must determine:

```text
Which SolydFlow transaction does 12345 belong to?
```

Only after the event has been correctly correlated should it be used as transaction evidence.

```text
Webhook
   ↓
Correlation
   ↓
Transaction
   ↓
Evidence
```

---

# Unknown Provider Transactions

A webhook may reference a transaction that SolydFlow cannot immediately locate.

For example:

```text
Provider Webhook
      ↓
Provider Transaction ID
      ↓
No Matching Transaction
```

SolydFlow should not invent a transaction or arbitrarily attach the event to another transaction.

The event may need to be:

* Retried
* Queued
* Investigated
* Reconciled
* Rejected according to the integration contract

The appropriate behavior depends on the provider integration.

---

# Provider Status Mapping

Providers can use different status vocabularies.

For example:

```text
Provider A:
successful

Provider B:
completed

Provider C:
succeeded
```

These may represent similar outcomes, but SolydFlow must interpret them according to each provider's semantics.

Conceptually:

```text
Provider Status
      ↓
Provider Mapping
      ↓
SolydFlow Transaction State
```

A provider status should not be mapped purely by its name.

Its actual meaning within that provider's transaction lifecycle must be understood.

---

# Pending Provider Events

A provider may send an event indicating that a transaction is still being processed.

For example:

```text
Provider
   ↓
Pending
```

SolydFlow can record the evidence while keeping the transaction non-final:

```text
Provider Webhook
      ↓
Pending Evidence
      ↓
Transaction
      ↓
Not Final
```

The application should not treat the webhook itself as permission to grant final access.

---

# Successful Provider Events

A provider may send a successful event:

```text
Provider
   ↓
Successful
```

SolydFlow can use that event as evidence:

```text
Successful Webhook
       ↓
Verify
       ↓
Correlate
       ↓
Evaluate
```

If the transaction satisfies the requirements for finality:

```text
Verified Success
      ↓
Final
      ↓
Enforcement
```

See:

[Entitlement Enforcement →](../enforce/entitlement-enforcement.md)

---

# Failed Provider Events

A provider may send a failure event:

```text
Provider
   ↓
Failed
```

SolydFlow should determine whether the failure represents:

* A final failure
* A temporary failure
* A retryable condition
* An ambiguous state

Conceptually:

```text
Provider Failure
      ↓
Interpret
      ↓
Transaction State
      ↓
Finality Evaluation
```

A provider event called `failed` should not automatically be treated as final without considering the provider's semantics.

---

# Unknown Provider Outcomes

Some provider events may not provide enough information to determine the final transaction state.

For example:

```text
Provider
   ↓
Unknown
```

SolydFlow should preserve the uncertainty:

```text
Unknown
   ↓
Recovery / Verification
   ↓
Truth
   ↓
Finality
```

This prevents uncertain provider information from being incorrectly converted into a final financial outcome.

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

# Duplicate Provider Webhooks

Providers may retry webhook delivery.

Therefore, the same event may arrive multiple times:

```text
Provider
   ↓
Webhook A
   ↓
SolydFlow

Provider
   ↓
Webhook A
   ↓
SolydFlow
```

SolydFlow must process these events safely.

A typical model is:

```text
Event ID
   ↓
Already Processed?
   / \
 Yes  No
 ↓     ↓
Ignore Process
```

This prevents duplicate side effects.

---

# Provider Webhook Idempotency

Provider webhook processing should be idempotent.

For example:

```text
Webhook:
event_123
```

First delivery:

```text
event_123
   ↓
Process
   ↓
Store Processing Result
```

Second delivery:

```text
event_123
   ↓
Already Processed
   ↓
Do Not Repeat Side Effect
```

This is particularly important for transaction and entitlement operations.

---

# Out-of-Order Provider Events

Provider events may arrive in an order different from the order in which the underlying events occurred.

For example:

```text
Provider Event A
Provider Event B
```

may arrive as:

```text
Event B
Event A
```

SolydFlow should therefore consider the provider's event metadata and the current transaction state rather than blindly applying events in arrival order.

```text
Incoming Event
      ↓
Current State
      ↓
Event Metadata
      ↓
State Rules
      ↓
Apply / Ignore / Investigate
```

---

# Late Provider Webhooks

A provider webhook can arrive after SolydFlow has already taken some action.

For example:

```text
Payment
   ↓
Timeout
   ↓
Recovery Started
```

Later:

```text
Provider
   ↓
Successful Webhook
```

The webhook becomes additional evidence:

```text
Recovery
   +
Provider Evidence
      ↓
Truth
      ↓
Transaction State
```

This is one of the important cases SolydFlow's recovery and Truth systems are designed to handle.

---

# Provider Webhooks and Recovery

Provider webhooks can resolve uncertain transactions.

For example:

```text
Initial Request
      ↓
Timeout
      ↓
Unknown
```

Later:

```text
Provider Webhook
      ↓
Successful
```

SolydFlow can combine the evidence:

```text
Request Evidence
       +
Webhook Evidence
       ↓
Truth
       ↓
Finality
```

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

# Provider Webhooks and Truth

Truth is concerned with determining what actually happened.

Provider webhooks are one source of evidence.

```text
Provider API
      +
Provider Webhook
      +
SolydFlow Records
      ↓
Truth
```

The exact evidence available depends on the provider.

The important distinction is:

```text
Provider Says X
```

versus:

```text
SolydFlow Has Established X
```

Truth is concerned with the latter.

See:

[Truth Overview →](../truth/overview.md)

---

# Multiple Provider Evidence

SolydFlow may work with multiple payment providers.

A transaction can therefore involve evidence from more than one provider.

For example:

```text
Provider A
   ↓
Webhook
   ↓
Evidence A

Provider B
   ↓
Webhook
   ↓
Evidence B

Evidence A + Evidence B
          ↓
        Truth
```

This becomes particularly important when routing, retries, and failover are involved.

---

# Provider Webhooks and Failover

Suppose Provider A fails and SolydFlow attempts Provider B.

```text
Provider A
   ↓
Failure
   ↓
Provider B
   ↓
Success
```

Provider A may later send a delayed webhook.

```text
Provider A
   ↓
Delayed Success Webhook
```

SolydFlow must determine whether this represents:

* The original transaction
* A duplicate provider attempt
* A conflicting outcome
* A transaction that requires reconciliation

The webhook should therefore enter the Truth process rather than directly granting another entitlement.

See:

[Provider Failover →](../enforce/provider-failover.md)

---

# Avoiding Duplicate Purchases

Provider failover creates an important risk.

Consider:

```text
Provider A
   ↓
Timeout
```

SolydFlow cannot immediately determine whether the payment succeeded.

It tries Provider B:

```text
Provider B
   ↓
Success
```

Later Provider A sends:

```text
Provider A
   ↓
Success
```

There are now two provider-side success signals.

SolydFlow must determine how those attempts relate to the transaction before deciding what should happen.

```text
Provider A Evidence
       +
Provider B Evidence
       ↓
Transaction Truth
       ↓
Enforcement
```

This prevents a provider retry from automatically becoming a second purchase.

---

# Provider Webhooks and Entitlements

A provider webhook should not directly grant an entitlement.

Avoid:

```text
Provider Webhook
      ↓
Grant Access
```

Prefer:

```text
Provider Webhook
      ↓
Verify
      ↓
Correlate
      ↓
Truth
      ↓
Finality
      ↓
Entitlement Enforcement
```

This keeps customer access tied to the trusted revenue state.

See:

[Entitlement Enforcement →](../enforce/entitlement-enforcement.md)

---

# Provider Webhooks and Reconciliation

Provider webhooks can be compared against provider records and SolydFlow's internal transaction history.

For example:

```text
SolydFlow
└── Pending

Provider Webhook
└── Successful
```

Reconciliation can evaluate the discrepancy:

```text
Internal State
      +
Provider Evidence
      ↓
Reconciliation
      ↓
Resolved Transaction State
```

See:

[Reconciliation →](../truth/reconciliation.md)

---

# Provider Webhook Verification

Before provider webhook data is used, the request should be verified according to that provider's security mechanism.

Different providers may use different mechanisms.

Conceptually:

```text
Provider Webhook
      ↓
Provider-Specific Verification
      ↓
Trusted Event
```

Verification details should be documented separately from the general provider webhook lifecycle.

See:

[Signature Verification →](./signature-verification.md)

---

# Provider-Specific Security

Each provider integration may have its own requirements for:

* Signature headers
* Signing secrets
* Timestamp validation
* Event IDs
* Replay protection
* Authentication
* IP restrictions where applicable

These should be implemented according to the provider's documented webhook security model.

SolydFlow should normalize the resulting verification outcome without hiding provider-specific security requirements from maintainers.

---

# Provider Webhook Payloads

Provider payloads should be treated as provider-specific.

A provider may send information such as:

```json id="y0f0af"
{
  "event": "transaction.updated",
  "data": {
    "reference": "provider_reference",
    "status": "successful"
  }
}
```

Another provider may use a completely different structure.

Therefore, provider adapters should translate the payload into the SolydFlow transaction model rather than exposing provider-specific structures throughout the rest of the system.

---

# Provider Metadata

Provider webhooks may contain useful metadata such as:

* Provider transaction ID
* Merchant reference
* Amount
* Currency
* Payment method
* Customer reference
* Event timestamp
* Provider status

Only information relevant to the SolydFlow transaction model should be relied upon for business decisions.

---

# Amount and Currency Validation

Where the provider webhook includes transaction amount and currency, SolydFlow should correlate these values with the transaction where appropriate.

Conceptually:

```text
Provider Webhook
      ↓
Transaction ID
      ↓
Amount / Currency
      ↓
Expected Transaction
      ↓
Consistency Check
```

A mismatch may indicate:

* Incorrect correlation
* Provider inconsistency
* Configuration problem
* Fraudulent or malformed input
* A transaction requiring investigation

The exact validation rules depend on the integration.

---

# Provider Event Timestamps

Provider events may include timestamps.

These can help determine the sequence of events:

```text
Event A
10:01

Event B
10:05
```

However, timestamps should not automatically override transaction state.

They are one piece of event metadata that can assist with ordering, investigation, and reconciliation.

---

# Provider Webhook Logging

Useful webhook metadata can include:

```text
Provider
Event ID
Event Type
Provider Transaction ID
SolydFlow Transaction ID
Received At
Provider Event Time
Processing Status
```

Sensitive credentials and unnecessary personal information should not be stored in logs.

See:

[Webhook Security →](../security/webhook-security.md)

---

# Provider Webhook Monitoring

Operational monitoring should make it possible to identify:

* Webhook delivery failures
* Verification failures
* Processing failures
* Duplicate events
* Unknown events
* Unmatched transactions
* Processing latency
* Provider-specific issues

A useful high-level view is:

```text
Provider
   ↓
Webhook
   ↓
Received
   ↓
Verified
   ↓
Processed
   ↓
Transaction Updated
```

Failures should be visible at the stage where they occur.

---

# Provider Webhook Lifecycle

The complete provider webhook lifecycle is:

```text
Provider Event
      ↓
Delivery
      ↓
Receive
      ↓
Verify
      ↓
Validate
      ↓
Correlate
      ↓
Normalize
      ↓
Process Evidence
      ↓
Truth
      ↓
Finality
      ↓
Enforcement
```

This allows provider-specific events to enter SolydFlow's unified revenue infrastructure.

---

# Example: Successful Provider Webhook

A customer completes a payment.

```text
Customer
   ↓
SolydFlow
   ↓
Provider
   ↓
Payment Successful
```

The provider later sends a webhook:

```text
Provider
   ↓
Successful Webhook
   ↓
SolydFlow
```

SolydFlow processes it:

```text
Webhook
   ↓
Verify
   ↓
Correlate
   ↓
Normalize
   ↓
Truth
   ↓
Finality
```

If final:

```text
Final Transaction
      ↓
Entitlement Enforcement
```

---

# Example: Provider Timeout Followed by Webhook

Initial payment:

```text
Application
   ↓
SolydFlow
   ↓
Provider
```

The request times out:

```text
Provider
   ↓
Timeout
```

SolydFlow does not assume failure.

```text
Transaction
   ↓
Unknown
```

The provider later sends:

```text
Successful Webhook
```

SolydFlow evaluates the new evidence:

```text
Unknown
   +
Webhook Evidence
      ↓
Truth
      ↓
Finality
      ↓
Success
```

This is one of the core scenarios provider webhooks help solve.

---

# Example: Duplicate Delivery

Provider sends:

```text
event_456
```

SolydFlow processes it.

Later the same event arrives again:

```text
event_456
```

The processor detects the duplicate:

```text
event_456
   ↓
Already Processed
   ↓
No Duplicate Side Effect
```

---

# Example: Conflicting Provider Evidence

Suppose SolydFlow receives:

```text
Provider Event A
└── Successful
```

and later receives:

```text
Provider Event B
└── Failed
```

SolydFlow should not simply overwrite one with the other.

Instead:

```text
Evidence A
    +
Evidence B
    ↓
Transaction Evaluation
    ↓
Truth / Reconciliation
```

The resulting transaction state should follow the provider's semantics and SolydFlow's state model.

---

# Provider Integration Boundary

The provider integration should form a clear boundary:

```text
┌───────────────────────────┐
│     Provider-Specific     │
│                           │
│ Payloads                  │
│ Statuses                  │
│ Signatures                │
│ Identifiers               │
│ Webhook Semantics         │
└─────────────┬─────────────┘
              ↓
       Provider Adapter
              ↓
┌─────────────┴─────────────┐
│     SolydFlow Unified     │
│                           │
│ Transactions              │
│ Truth                     │
│ Finality                  │
│ Enforcement               │
└───────────────────────────┘
```

This boundary is important because applications should not need to understand every provider's webhook format.

---

# Adding a New Provider

When adding a new payment provider, its webhook integration should account for:

1. Provider webhook endpoint requirements
2. Authentication and signature verification
3. Event types
4. Payload schemas
5. Provider transaction identifiers
6. Status mapping
7. Event ordering
8. Retry behavior
9. Duplicate delivery
10. Transaction correlation
11. Error handling
12. Reconciliation behavior

The provider-specific implementation should then translate those details into SolydFlow's common transaction model.

---

# Provider Webhook Design Principles

### 1. Normalize provider differences

Applications should not need to implement provider-specific webhook logic.

### 2. Verify every provider event

Provider webhook requests must pass the appropriate security checks.

### 3. Correlate before changing state

Always establish which SolydFlow transaction the event belongs to.

### 4. Preserve provider evidence

Provider events can be valuable when investigating transaction state.

### 5. Make processing idempotent

Providers may retry webhook delivery.

### 6. Handle late events

A webhook can arrive after recovery or another transaction action has already occurred.

### 7. Handle conflicting events

Do not blindly overwrite trusted transaction state.

### 8. Keep provider logic at the integration boundary

Provider-specific details should not leak unnecessarily into the application.

### 9. Do not grant entitlements directly

Allow Truth, Finality, and Enforce to determine the resulting access state.

### 10. Make provider behavior observable

Webhook failures and unusual provider behavior should be easy to investigate.

---

# The Core Principle

> **Provider webhooks are asynchronous evidence from payment providers that SolydFlow uses to maintain a unified and reliable transaction state.**

The complete model is:

```text
Provider
   ↓
Webhook
   ↓
Verify
   ↓
Correlate
   ↓
Normalize
   ↓
Truth
   ↓
Finality
   ↓
Enforce
```

The application should ultimately consume the resulting SolydFlow state rather than implementing provider-specific webhook interpretation itself.

---

## Related Documentation

### Webhooks

[Webhooks Overview →](./overview.md)

[Inbound Webhooks →](./inbound-webhooks.md)

[Signature Verification →](./signature-verification.md)

[Event Handling →](./event-handling.md)

### Payment Providers

[Payment Providers Overview →](../payment-providers/overview.md)

### Truth

[Truth Overview →](../truth/overview.md)

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Transaction Ledger →](../truth/transaction-ledger.md)

[Reconciliation →](../truth/reconciliation.md)

### Recover

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

### Enforce

[Provider Failover →](../enforce/provider-failover.md)

[Transaction Finality →](../enforce/transaction-finality.md)

[Entitlement Enforcement →](../enforce/entitlement-enforcement.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

### Security

[Webhook Security →](../security/webhook-security.md)

[Credential Security →](../security/credential-security.md)

