# Transaction Ledger

The transaction ledger is the durable record of transaction activity in SolydFlow.

A payment transaction can pass through multiple states and generate information from multiple sources.

The ledger provides a consistent history of those changes:

```text id="m4q8n2"
Transaction
    ↓
Events & State Changes
    ↓
Transaction Ledger
    ↓
Reliable Transaction History
```

Instead of relying only on the latest transaction state, the ledger provides the context needed to understand how that state was reached.

---

## Why the Transaction Ledger Matters

Consider a transaction that currently shows:

```text id="q7m3r8"
Successful
```

The current state alone does not explain what happened before it.

The transaction may have gone through:

```text id="x5n8k2"
Created
   ↓
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

The ledger preserves this history.

This is important when investigating:

* Payment failures
* Delayed transactions
* State mismatches
* Duplicate events
* Recovery operations
* Reconciliation differences
* Customer disputes
* Revenue records

---

## The Ledger Is More Than a Transaction Table

A simple transaction record might look like:

```text id="r8m2q6"
Transaction
└── Successful
```

A transaction ledger provides additional context:

```text id="k4n7m3"
Transaction
├── Created
├── Payment Attempted
├── Pending
├── Provider Event Received
├── Verification Requested
├── Verification Completed
└── Successful
```

The ledger therefore represents the **history of the transaction**, not just its current state.

---

## Transaction State and Transaction History

These are related but different concepts.

### Current state

The current state answers:

> What is the transaction now?

For example:

```text id="v3q8m5"
Transaction
└── Successful
```

### Ledger history

The ledger answers:

> How did the transaction get here?

For example:

```text id="n7k2r4"
Created
  ↓
Pending
  ↓
Verification
  ↓
Successful
```

Both are important.

The application may primarily need the current state, while operations, reconciliation, and recovery may need the historical record.

---

## What the Ledger Records

The exact ledger fields depend on the SolydFlow implementation, but transaction history can contain information associated with events and state changes such as:

* Transaction identity
* Project
* Customer or user
* Payment provider
* Provider transaction reference
* Transaction state
* Event type
* Event source
* Timestamp
* State transition
* Verification activity
* Recovery activity
* Relevant provider information
* Reconciliation information

The purpose is to preserve enough context to understand the transaction lifecycle.

---

## A Transaction Lifecycle

A simplified transaction lifecycle might look like:

```text id="q5m8v3"
Created
   ↓
Pending
   ↓
Provider Processing
   ↓
Successful
```

The ledger can preserve each significant stage.

For a transaction requiring recovery:

```text id="m7r2k8"
Created
   ↓
Pending
   ↓
Webhook Expected
   ↓
Webhook Missing
   ↓
Recovery Started
   ↓
Verification
   ↓
Successful
```

The second history explains much more about the transaction than simply storing:

```text
Successful
```

---

## Ledger Events

A ledger can contain multiple events associated with the same transaction.

Conceptually:

```text id="x8n4q2"
Transaction
│
├── Event 1 → Created
├── Event 2 → Payment Attempted
├── Event 3 → Pending
├── Event 4 → Provider Webhook
├── Event 5 → Verification
└── Event 6 → Successful
```

Each event contributes to the transaction history.

---

## Event Source

It can be useful to distinguish where transaction information came from.

For example:

```text id="r6m3k8"
Event
├── Source: Provider
├── Source: Webhook
├── Source: Verification
└── Source: Recovery
```

This helps explain why a transaction changed state.

For example:

```text id="v7q2n5"
Pending
   ↓
Provider Verification
   ↓
Successful
```

The ledger can therefore provide context for the state transition.

---

## State Transitions

The ledger should make meaningful state changes traceable.

For example:

```text id="k8m4r2"
Pending
   ↓
Successful
```

The history can capture that the transaction moved from one state to another.

A more complete representation might be:

```text id="q3n7m5"
Previous State
└── Pending

Event
└── Provider Verification

New State
└── Successful
```

This makes the transition understandable when reviewing the transaction later.

---

## Ledger and Truth

The transaction ledger is one of the records that supports the Truth layer.

The relationship can be represented as:

```text id="m8q3v6"
Payment Evidence
      ↓
Consensus
      ↓
Transaction State
      ↓
Ledger
```

The consensus process determines the appropriate transaction state from available evidence.

The ledger preserves the resulting state and relevant history.

See:

[Consensus Engine →](./consensus-engine.md)

---

## Ledger and Transaction Verification

Verification may resolve an uncertain transaction.

For example:

```text id="x4m8q2"
Pending
   ↓
Verification
   ↓
Successful
```

The ledger provides a record of that activity:

```text id="r7n3k5"
Pending
   ↓
Verification Requested
   ↓
Provider Result
   ↓
Successful
```

This makes the resolution traceable.

See:

[Transaction Verification →](./transaction-verification.md)

---

## Ledger and Recovery

Recovery operations may generate additional transaction activity.

For example:

```text id="q5m8r3"
Pending
   ↓
Recovery Started
   ↓
Verification
   ↓
Successful
```

Without the history, an operator may only see:

```text id="v8k2n4"
Successful
```

The ledger provides the context that the transaction required recovery before reaching its final state.

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

## Ledger and Webhooks

Webhook events can contribute to the transaction history.

For example:

```text id="m3q7n8"
Provider
   ↓
Webhook
   ↓
SolydFlow
   ↓
Transaction Ledger
```

The ledger can help establish:

* When the webhook was received
* Which transaction it related to
* What event it represented
* Whether it caused a state change

See:

[Webhooks Overview →](../webhooks/overview.md)

---

## Duplicate Webhooks

Payment providers may deliver the same event more than once.

For example:

```text id="k7m3q8"
Webhook A
Webhook A
Webhook A
```

The ledger should distinguish repeated delivery of an event from multiple payment transactions.

Conceptually:

```text id="x4n8r2"
One Transaction
      │
      └── One Event
             ↑
       Multiple Deliveries
```

This works together with idempotent webhook processing.

See:

[Event Handling →](../webhooks/event-handling.md)

---

## Ledger and State Mismatches

Suppose the provider reports:

```text id="q8m3v5"
Successful
```

while SolydFlow currently has:

```text id="r6k2n7"
Pending
```

The ledger can provide the history needed to investigate the mismatch.

For example:

```text id="m4q8x3"
Transaction
├── Created
├── Pending
├── Webhook Missing
└── Verification Requested
```

This history helps explain why the systems currently disagree.

See:

[State Mismatches →](./state-mismatches.md)

---

## Ledger and Reconciliation

Reconciliation requires comparing transaction records.

The ledger provides a historical record that can be used during that process.

```text id="v7m2q5"
Provider Records
       ↓
Compare
       ↓
SolydFlow Ledger
       ↓
Identify Difference
       ↓
Resolve
```

For example, a provider may contain a successful transaction that does not appear as successful in the SolydFlow transaction record.

The ledger can help determine whether the transaction:

* Was never received
* Was received but remained pending
* Was recovered later
* Was resolved through verification
* Has another state mismatch

See:

[Reconciliation →](./reconciliation.md)

---

## Ledger and Entitlements

Transaction history can also help explain entitlement changes.

For example:

```text id="n5q8m3"
Payment
   ↓
Successful
   ↓
Entitlement Granted
```

If the entitlement was not granted:

```text id="k7r2v8"
Successful Transaction
       ↓
Entitlement Missing
```

The transaction ledger can help establish whether the payment itself was successful and when that state was reached.

See:

[Entitlements →](../concepts/entitlements.md)

---

## Ledger and Revenue

The transaction ledger provides an important foundation for revenue records.

Conceptually:

```text id="m8q4n2"
Payment
   ↓
Transaction
   ↓
Verified State
   ↓
Ledger
   ↓
Revenue
```

A reliable revenue system needs to know which transactions actually reached the relevant final states.

The ledger provides the transaction history needed to support that determination.

---

# Ledger Immutability

A transaction history should be treated carefully.

Once an event has been recorded, changing historical information without traceability can make the transaction difficult to audit.

Conceptually:

```text id="q3m7n8"
Event A
   ↓
Event B
   ↓
Event C
```

Rather than silently rewriting:

```text id="x5r8k2"
Event B
```

the system should preserve the historical record and record subsequent changes as new events where appropriate.

This creates a more reliable audit trail.

---

## Current State vs Historical Events

A useful mental model is:

```text id="v8m3q6"
                  Transaction
                       │
            ┌──────────┴──────────┐
            ↓                     ↓
       Current State          Event History
            │                     │
            ↓                     ↓
       Successful          Created → Pending
                                  → Verify
                                  → Successful
```

The current state provides a fast representation of where the transaction is now.

The history provides the context for how it got there.

---

# Ledger Ordering

Transaction events should be associated with appropriate timestamps and ordering information.

For example:

```text id="k7n2m4"
10:00  Created
10:01  Pending
10:03  Verification Requested
10:04  Provider Verified
10:04  Successful
```

This allows operators and systems to reconstruct the transaction lifecycle.

However, event arrival time and event creation time may not always be identical.

For distributed payment systems, this distinction can matter.

---

## Event Time vs Processing Time

Consider:

```text id="r4m8q3"
Provider Event
└── Created at 10:00

SolydFlow receives it
└── 10:05
```

The event occurred at one time but was processed later.

The ledger should preserve the relevant timing information where available.

This helps explain delayed events and webhook delivery delays.

---

# Provider References

A transaction may have identifiers from both SolydFlow and the payment provider.

Conceptually:

```text id="q8m3n5"
SolydFlow
└── Transaction ID

Provider
└── Provider Transaction ID
```

Keeping the relationship between these identifiers allows operators and systems to trace a transaction across the payment infrastructure.

---

# Customer and Project Context

A transaction does not exist independently of the application using SolydFlow.

It may be associated with:

```text id="m5r7k2"
Project
   ↓
Customer
   ↓
Transaction
   ↓
Product / Package
```

This context can help identify the business meaning of a payment.

For example, a successful transaction may correspond to the purchase of a particular package and therefore support a particular entitlement.

See:

[Projects →](../concepts/projects.md)

[Users →](../concepts/users.md)

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

---

# Ledger as an Operational Tool

The ledger is not only useful for automated systems.

It can also support operational investigation.

For example:

```text id="v3k8m4"
Customer Reports Problem
        ↓
Find Transaction
        ↓
Review Ledger
        ↓
Identify State
        ↓
Review Events
        ↓
Understand What Happened
```

This can make payment support and troubleshooting more reliable.

---

# Example: Normal Successful Transaction

A simple transaction may look like:

```text id="n7m2q5"
Created
   ↓
Payment Attempted
   ↓
Successful
```

The ledger records the lifecycle.

---

# Example: Successful Transaction After Webhook

```text id="x8r3m6"
Created
   ↓
Pending
   ↓
Webhook Received
   ↓
Successful
```

The webhook provides the evidence that allowed the transaction to progress.

---

# Example: Successful Transaction After Recovery

```text id="q4m8k2"
Created
   ↓
Pending
   ↓
Webhook Missing
   ↓
Recovery Started
   ↓
Verification
   ↓
Successful
```

The ledger makes the recovery path visible.

---

# Example: Failed Transaction

```text id="m7n3v8"
Created
   ↓
Payment Attempted
   ↓
Provider Declined
   ↓
Failed
```

The transaction history explains why the final state was reached.

---

# Example: State Mismatch

```text id="r5k8q3"
Created
   ↓
Pending
   ↓
Webhook Missing
   ↓
Provider Verification
   ↓
Successful
```

The ledger provides evidence that the transaction was not simply changed from pending to successful arbitrarily.

It was resolved through verification.

---

# Example: Multiple Events

A more complex transaction may look like:

```text id="v8m4q2"
Created
   ↓
Pending
   ↓
Webhook Received
   ↓
Verification
   ↓
Provider Confirmed
   ↓
Successful
   ↓
Entitlement Granted
```

The complete history gives the system and operators a clearer view of the transaction lifecycle.

---

# Ledger and Auditability

A transaction ledger can support auditing by answering questions such as:

* When was the transaction created?
* Which provider handled it?
* What state was it in?
* When did the state change?
* What caused the change?
* Was verification performed?
* Was recovery triggered?
* What happened before the final state?

This makes transaction behavior more explainable.

---

# Ledger Does Not Replace Reconciliation

The ledger records transaction history.

Reconciliation compares records and identifies differences.

```text id="q6m3r8"
Ledger
  ↓
Transaction History

Reconciliation
  ↓
Compare Records
```

They solve different problems and work together.

See:

[Reconciliation →](./reconciliation.md)

---

# Ledger Does Not Replace the Provider

The transaction ledger represents SolydFlow's record of the transaction and its processing history.

It does not mean SolydFlow becomes the original source of every payment event.

The provider remains an important source of payment information.

The ledger records how SolydFlow received, interpreted, verified, and processed that information.

---

# Ledger and the Truth Model

The overall Truth flow can therefore be represented as:

```text id="m8q2v5"
Provider Evidence
       ↓
Webhook / Verification
       ↓
Consensus
       ↓
Transaction State
       ↓
Ledger
       ↓
Reliable Transaction History
```

The ledger provides the historical foundation for understanding the resolved transaction.

---

# Key Principles

### 1. Record transaction history

Do not rely only on the latest state.

### 2. Preserve meaningful state changes

The history should explain how the transaction reached its current state.

### 3. Keep provider references traceable

Provider transaction identifiers should remain associated with the appropriate SolydFlow transaction.

### 4. Preserve recovery and verification context

When recovery or verification changes the outcome, that activity should be traceable.

### 5. Distinguish events from state

An event is something that happened.

A state describes the transaction's resulting condition.

### 6. Support reconciliation

The ledger should provide enough transaction history to investigate differences between systems.

### 7. Preserve uncertainty

If the transaction has not been conclusively resolved, the ledger should not manufacture a final outcome.

---

# The Core Principle

> **The transaction ledger tells the story behind the transaction state.**

The current state tells you:

```text id="x7m3q8"
Successful
```

The ledger tells you:

```text id="n4k8r2"
Created
  ↓
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

Together, they provide a more reliable representation of transaction truth.

---

## Related Documentation

### Truth

[Truth Overview →](./overview.md)

[Transaction Verification →](./transaction-verification.md)

[Consensus Engine →](./consensus-engine.md)

[State Mismatches →](./state-mismatches.md)

[Reconciliation →](./reconciliation.md)

### Recovery

[Transaction Recovery →](../recover/transaction-recovery.md)

[Recovery Workflows →](../recover/recovery-workflows.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Event Handling →](../webhooks/event-handling.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Projects →](../concepts/projects.md)

[Users →](../concepts/users.md)

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Entitlements →](../concepts/entitlements.md)

