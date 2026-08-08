# Webhooks

Webhooks allow systems to communicate asynchronously when something happens.

In payment infrastructure, this is especially important because a payment can change state after the original payment request has already completed.

For example:

```text id="m7q3k8"
Payment Request
      ↓
Payment Provider
      ↓
Transaction Processed
      ↓
Webhook
      ↓
SolydFlow
```

The webhook allows SolydFlow to receive information about the transaction without continuously asking the provider whether something has changed.

---

# Why Webhooks Matter

A payment does not always finish within the lifetime of the original request.

For example:

```text id="q8m3r5"
Application
    ↓
Payment Request
    ↓
Provider
    ↓
Pending
```

Later, the provider may complete the transaction:

```text id="x4n7m2"
Provider
    ↓
Payment Successful
    ↓
Webhook
```

The webhook allows the application or SolydFlow to learn about that change asynchronously.

---

# Webhooks in SolydFlow

SolydFlow sits between your application and multiple payment systems.

A simplified flow is:

```text id="v5m8q3"
                 Your Application
                        │
                        ▼
                    SolydFlow
                   /        \
                  ▼          ▼
             Paystack    Flutterwave
                  │          │
                  └────┬─────┘
                       │
                    Webhooks
                       │
                       ▼
                    SolydFlow
                       │
                       ▼
                Transaction State
```

The exact provider and integration behavior depends on the payment provider.

---

# Two Directions of Webhooks

Within the SolydFlow ecosystem, it is useful to distinguish between two directions of webhook communication.

## Provider Webhooks

A payment provider sends an event to SolydFlow.

```text id="k3r8m5"
Payment Provider
       ↓
Provider Webhook
       ↓
SolydFlow
```

For example:

```text id="q7m2n4"
Paystack
   ↓
Payment Successful
   ↓
Webhook
   ↓
SolydFlow
```

Provider webhooks allow SolydFlow to receive asynchronous information about transactions.

See:

[Provider Webhooks →](./provider-webhooks.md)

---

## Inbound Webhooks

Inbound webhooks are webhook endpoints exposed by SolydFlow for receiving events.

Conceptually:

```text id="m8q3v7"
External System
      ↓
SolydFlow Webhook Endpoint
      ↓
Event Processing
```

The exact source and purpose depend on the integration.

See:

[Inbound Webhooks →](./inbound-webhooks.md)

---

# Webhooks and Transactions

Webhooks can provide evidence that affects a transaction's state.

For example:

```text id="r5k8m3"
Transaction
└── Pending

Webhook
└── Successful
```

SolydFlow can process the webhook and use the event as part of its transaction state resolution.

```text id="x7n4q2"
Webhook
   ↓
Validate
   ↓
Identify Transaction
   ↓
Process Event
   ↓
Update / Evaluate State
```

A webhook is therefore an important input into the transaction lifecycle.

---

# A Webhook Is Evidence

A webhook should not automatically be treated as unquestionable transaction truth.

For example:

```text id="q8m3r6"
Webhook
└── Successful
```

The system should still establish that:

* The event came from the expected source
* The event is authentic
* It belongs to the expected transaction
* The event has not already been processed
* The event is compatible with the transaction lifecycle

This is why webhook handling works together with SolydFlow Truth.

```text id="m4q7n8"
Webhook
   ↓
Validation
   ↓
Transaction
   ↓
Consensus / Truth
   ↓
Transaction State
```

---

# Webhooks and Truth

Webhooks are one source of transaction evidence.

The Truth layer can combine webhook information with other available evidence.

```text id="v8m3q5"
Provider Response
       │
Webhook│
       │
Verification
       │
Recovery
       ▼
    Consensus
       ↓
Transaction State
```

This is especially important when webhook information is missing, delayed, duplicated, or inconsistent with another source.

See:

[Consensus Engine →](../truth/consensus-engine.md)

---

# Webhooks and Recovery

A webhook may fail to arrive.

For example:

```text id="k5r8m2"
Provider
   ↓
Successful
   X
Webhook
```

SolydFlow may therefore continue to show:

```text id="q7m3n5"
Pending
```

Recovery can identify the unresolved transaction and use verification or other mechanisms to establish its state.

```text id="x8m4q2"
Pending
   ↓
Webhook Missing
   ↓
Recovery
   ↓
Verification
   ↓
Successful
```

This is one of the reasons SolydFlow does not rely exclusively on webhooks for transaction truth.

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

# Webhooks and Transaction History

Webhook events can become part of the transaction history.

For example:

```text id="m3q8v5"
Created
   ↓
Pending
   ↓
Provider Webhook
   ↓
Successful
```

The transaction ledger can preserve the relevant event and state transition.

See:

[Transaction Ledger →](../truth/transaction-ledger.md)

---

# Webhooks and Event Handling

Receiving a webhook is only the beginning.

A reliable webhook flow is:

```text id="r7m2k4"
Receive
   ↓
Authenticate / Verify
   ↓
Parse
   ↓
Identify Event
   ↓
Identify Transaction
   ↓
Check Duplicate
   ↓
Process
   ↓
Update State / Record Event
```

This prevents a webhook from being treated as a simple HTTP request with no transaction context.

See:

[Event Handling →](./event-handling.md)

---

# Webhook Signatures

Payment providers commonly provide mechanisms for verifying that webhook requests originated from the expected source.

Conceptually:

```text id="q4n8m3"
Webhook Request
       ↓
Signature
       ↓
Verification
       ↓
Trusted Event
```

SolydFlow should validate provider-specific webhook signatures according to the requirements of each integration.

See:

[Signature Verification →](./signature-verification.md)

---

# Why Signature Verification Matters

Without appropriate verification, an application could potentially accept an event that did not originate from the expected provider.

For example:

```text id="x7m3r8"
Untrusted Request
       ↓
"Payment Successful"
       ↓
Application
```

That could result in an incorrect transaction state or entitlement.

A safer flow is:

```text id="k8q2m5"
Webhook
   ↓
Signature Verification
   ↓
Valid?
  / \
No   Yes
↓     ↓
Reject Process
```

The exact verification mechanism depends on the provider.

---

# Webhooks Can Arrive More Than Once

Webhook systems should be designed with duplicate delivery in mind.

For example:

```text id="m5r8q3"
Webhook A
Webhook A
Webhook A
```

These may all represent the same underlying event.

The system should not interpret them as:

```text id="q7n2k4"
Payment A
Payment B
Payment C
```

Instead:

```text id="v4m8r3"
One Event
   ↑
Multiple Deliveries
```

This is why idempotent event handling is important.

See:

[Event Handling →](./event-handling.md)

---

# Webhooks Can Arrive Late

A provider webhook may arrive after SolydFlow has already resolved a transaction through another mechanism.

For example:

```text id="x8q3m5"
Payment
   ↓
Pending
   ↓
Verification
   ↓
Successful
```

Later:

```text id="r7m2n8"
Provider Webhook
└── Successful
```

The webhook should be processed against the existing transaction rather than creating a new payment or reversing the established state.

---

# Webhooks Can Arrive Out of Order

Consider:

```text id="k5m8q3"
Generated:
A → B → C
```

but:

```text id="n7r3m2"
Received:
B → A → C
```

Event processing should therefore account for transaction history and event meaning rather than assuming that arrival order is transaction order.

This is particularly important when multiple events can affect the same transaction.

---

# Webhooks and Transaction States

A webhook may cause or contribute to a state transition.

For example:

```text id="q8m4v3"
Pending
   ↓
Successful Webhook
   ↓
Successful
```

But a webhook does not necessarily mean that every transaction should immediately move to a final state.

For example:

```text id="m3k7r8"
Pending
   ↓
Pending Webhook
   ↓
Pending
```

The resulting state depends on the event and the transaction lifecycle.

See:

[Transaction States →](../concepts/transaction-states.md)

---

# Webhooks and State Mismatches

A webhook can reveal a difference between provider and SolydFlow state.

For example:

```text id="x5n8q2"
SolydFlow
└── Pending

Provider Webhook
└── Successful
```

This creates a state mismatch that can be evaluated by the Truth layer.

```text id="v7m3k5"
Webhook
   ↓
Mismatch Detected
   ↓
Evidence Evaluation
   ↓
Consensus
   ↓
Resolved State
```

See:

[State Mismatches →](../truth/state-mismatches.md)

---

# Webhooks and Reconciliation

Webhooks provide real-time or near-real-time information, while reconciliation can provide a broader mechanism for checking whether transaction records agree.

```text id="q4m8n3"
Webhook
   ↓
Real-Time Event

Reconciliation
   ↓
Record Comparison
```

They complement each other.

A webhook may update a transaction immediately, while reconciliation can later detect transactions for which expected events were missing or incorrectly processed.

See:

[Reconciliation →](../truth/reconciliation.md)

---

# Webhook Processing Should Be Idempotent

A webhook handler should be able to safely process the same event more than once.

Conceptually:

```text id="m7q3r8"
Event A
   ↓
Process
   ↓
Transaction Updated

Event A
   ↓
Process Again
   ↓
No Duplicate Effect
```

This is especially important because network failures can cause senders to retry webhook delivery.

---

# Webhook Processing Should Be Observable

Webhook processing should provide enough information to determine what happened when an event is received.

Useful operational information can include:

* Event received
* Event source
* Event identifier
* Associated transaction
* Verification result
* Processing result
* Processing error
* Retry information
* Timestamp

This makes webhook failures easier to investigate.

---

# Webhook Failures

A webhook can fail at several stages:

```text id="x8m4q3"
Provider
   ↓
Delivery
   ↓
Endpoint
   ↓
Authentication
   ↓
Parsing
   ↓
Transaction Matching
   ↓
Processing
```

A failure anywhere in this chain can prevent the transaction event from being processed correctly.

This is why SolydFlow treats webhook handling as a complete workflow rather than simply exposing an endpoint.

---

# Webhook Security

Webhook endpoints are externally reachable integration points and should be protected appropriately.

Important considerations include:

* Signature verification
* HTTPS
* Request validation
* Event validation
* Transaction validation
* Replay protection where supported
* Idempotent processing
* Secure credential handling
* Logging without exposing sensitive information

See:

[Webhook Security →](../security/webhook-security.md)

[Signature Verification →](./signature-verification.md)

---

# Webhooks and Provider Integrations

Each provider may have different webhook behavior.

For example, providers may differ in:

* Event names
* Payload structures
* Signature mechanisms
* Retry behavior
* Transaction identifiers
* Status values
* Event ordering
* Delivery behavior

SolydFlow abstracts these provider-specific differences into its unified transaction model where supported.

```text id="q7m3n8"
Paystack Webhook
        │
Flutterwave Webhook
        │
Stripe Webhook
        │
        ▼
Provider Adapter
        ↓
SolydFlow Event Model
        ↓
Transaction
```

Provider-specific details belong in the provider documentation.

See:

[Payment Providers →](../payment-providers/overview.md)

---

# Webhooks and the SolydFlow Model

A simplified SolydFlow webhook flow is:

```text id="m8r3q5"
Provider
   ↓
Webhook
   ↓
SolydFlow Endpoint
   ↓
Verify
   ↓
Normalize
   ↓
Identify Transaction
   ↓
Process Event
   ↓
Truth / Transaction State
   ↓
Ledger
```

This allows different providers to communicate transaction events through a consistent infrastructure layer.

---

# What Happens When a Webhook Is Not Enough?

Sometimes the webhook does not provide enough information to determine the correct transaction state.

For example:

```text id="x4m8k2"
Webhook
└── Unknown / Incomplete

Transaction
└── Pending
```

The system may need additional evidence.

```text id="q7n3r5"
Webhook
   ↓
Insufficient Evidence
   ↓
Verification
   ↓
Consensus
   ↓
Transaction State
```

This is where Webhooks connects directly with Truth and Recovery.

---

# A Complete Webhook Example

Consider a customer making a payment.

### 1. Payment begins

```text id="m5q8n3"
Customer
   ↓
Application
   ↓
SolydFlow
```

### 2. SolydFlow sends the payment to a provider

```text id="k7r3m8"
SolydFlow
   ↓
Payment Provider
```

### 3. Provider processes the payment

```text id="v4q8m2"
Provider
└── Successful
```

### 4. Provider sends a webhook

```text id="x8m3n5"
Provider
   ↓
Webhook
   ↓
SolydFlow
```

### 5. SolydFlow validates the event

```text id="q5r7k3"
Webhook
   ↓
Signature Verification
   ↓
Transaction Matching
```

### 6. Event is processed

```text id="m8q2v4"
Webhook
   ↓
Event Handling
   ↓
Transaction
```

### 7. Transaction state is resolved

```text id="k3n7r5"
Evidence
   ↓
Truth
   ↓
Successful
```

### 8. Transaction history is recorded

```text id="v7m4q8"
Transaction Ledger
└── Successful
```

---

# Webhook Design Principles

### 1. Treat webhooks as asynchronous events

Do not assume the webhook will arrive immediately.

### 2. Verify incoming events

Do not trust external events without appropriate validation.

### 3. Make processing idempotent

Repeated delivery should not create repeated side effects.

### 4. Expect delays

A valid webhook may arrive later than expected.

### 5. Expect duplicates

Providers may retry delivery.

### 6. Expect out-of-order events

Event arrival order may differ from generation order.

### 7. Connect events to transactions

Every event should be associated with the correct transaction where possible.

### 8. Do not rely exclusively on webhooks

Recovery, verification, and reconciliation provide additional mechanisms for dealing with missing or inconsistent events.

### 9. Preserve event history

Webhook activity should remain traceable when it affects transaction processing.

### 10. Keep provider differences isolated

Provider-specific webhook formats should be handled within the provider integration layer rather than forcing every application to understand them.

---

# The Core Principle

> **Webhooks provide asynchronous payment events; SolydFlow turns those events into reliable transaction processing through validation, event handling, Truth, recovery, and reconciliation.**

The simplified model is:

```text id="n8m3q5"
Provider
   ↓
Webhook
   ↓
Validation
   ↓
Event Handling
   ↓
Transaction
   ↓
Truth
   ↓
Ledger
```

When the webhook is missing or insufficient:

```text id="r7q2m8"
Webhook Missing / Insufficient
          ↓
       Recovery
          ↓
      Verification
          ↓
       Consensus
          ↓
    Transaction State
```

---

## Related Documentation

### Webhooks

[Inbound Webhooks →](./inbound-webhooks.md)

[Provider Webhooks →](./provider-webhooks.md)

[Signature Verification →](./signature-verification.md)

[Event Handling →](./event-handling.md)

### Truth

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Transaction Ledger →](../truth/transaction-ledger.md)

[State Mismatches →](../truth/state-mismatches.md)

[Reconciliation →](../truth/reconciliation.md)

### Recovery

[Failed Webhooks →](../recover/failed-webhooks.md)

[Recovery Workflows →](../recover/recovery-workflows.md)

[Retries →](../recover/retries.md)

### Security

[Webhook Security →](../security/webhook-security.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

### Payment Providers

[Payment Providers Overview →](../payment-providers/overview.md)
