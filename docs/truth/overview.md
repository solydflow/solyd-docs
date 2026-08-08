# Truth

Payment systems can produce conflicting information.

A payment provider may say a transaction succeeded while an application still considers it pending. A webhook may arrive late, arrive more than once, or fail completely.

SolydFlow Truth is designed to help establish a reliable view of what actually happened.

```text
Provider
   ↓
Payment Events
   ↓
SolydFlow
   ↓
Transaction State
   ↓
Reliable Revenue Record
```

The goal is not simply to collect payment events.

The goal is to determine the **truth of a transaction** and maintain a consistent record that the rest of the system can rely on.

---

## Why Truth Matters

Consider a payment that has already succeeded at the provider:

```text
Payment Provider
└── Successful
```

But the application still has:

```text
Application
└── Pending
```

This creates uncertainty.

The customer may have paid, but the application does not know whether it should grant access.

Without a reliable transaction state, the application may:

* Grant access too early
* Deny access to a paying customer
* Process the same payment again
* Record incorrect revenue
* Create reconciliation problems

SolydFlow Truth exists to reduce this uncertainty.

---

## The Problem of Conflicting States

A transaction can exist across several systems.

```text
Customer
   ↓
Application
   ↓
SolydFlow
   ↓
Payment Provider
```

Each system may have its own representation of the transaction.

For example:

```text
Application     → Pending
SolydFlow       → Pending
Provider        → Successful
```

The systems are not necessarily synchronized at the same moment.

This means a transaction's state needs to be verified rather than assumed.

---

## Truth Is More Than a Webhook

A webhook is an important source of information, but it is not necessarily the complete representation of a transaction.

For example:

```text
Provider
   ↓
Successful Transaction
   ↓
Webhook
   X
```

The transaction may still be successful even though the webhook was not received.

Similarly, receiving a webhook does not mean that the application should blindly trust every value without validation.

The transaction needs to be evaluated using the available evidence.

---

## Sources of Transaction Evidence

Depending on the payment provider and integration, transaction information may come from sources such as:

```text
Transaction
   │
   ├── Payment Request
   ├── Provider Response
   ├── Provider Webhook
   ├── Transaction Verification
   └── Recovery Events
```

These sources help SolydFlow determine the current state of the transaction.

The exact sources available depend on the provider integration.

---

## Transaction Verification

When the state of a transaction is uncertain, SolydFlow can verify the transaction with the payment provider where supported.

Conceptually:

```text
Transaction
     ↓
Uncertain State
     ↓
Provider Verification
     ↓
Verified State
```

For example:

```text
SolydFlow
└── Pending

Provider Verification
└── Successful
```

The verified result can then be used to resolve the transaction.

See:

[Transaction Verification →](./transaction-verification.md)

---

## Consensus Engine

When transaction information comes from multiple sources, SolydFlow needs a consistent way to evaluate those signals.

The consensus engine is responsible for helping determine the appropriate transaction state from available information.

Conceptually:

```text
Webhook ──────────┐
                  │
Provider API ─────┼──→ Consensus ──→ Transaction State
                  │
Recovery ─────────┘
```

The purpose is not to treat every signal as equally authoritative in every situation.

Instead, the available evidence must be evaluated according to the transaction and provider context.

See:

[Consensus Engine →](./consensus-engine.md)

---

## Transaction Ledger

Once transaction information has been resolved, it needs to be recorded.

The transaction ledger provides a durable representation of transaction activity.

```text
Transaction
   ↓
State Changes
   ↓
Ledger
```

A transaction may therefore have a history such as:

```text
Created
  ↓
Pending
  ↓
Verification
  ↓
Successful
```

This history can help explain how the transaction reached its current state.

See:

[Transaction Ledger →](./transaction-ledger.md)

---

## State Mismatches

A state mismatch occurs when different systems have different views of the same transaction.

For example:

```text
Provider
└── Successful

SolydFlow
└── Pending
```

Or:

```text
Provider
└── Failed

Application
└── Successful
```

These mismatches need to be detected and resolved carefully.

See:

[State Mismatches →](./state-mismatches.md)

---

## Reconciliation

Reconciliation addresses differences between transaction records.

For example:

```text
Payment Provider
       ↓
Provider Records
       │
       │
       ↓
SolydFlow Ledger
```

If the records do not agree, reconciliation can identify the difference and provide the information needed to resolve it.

See:

[Reconciliation →](./reconciliation.md)

---

## Truth and Recovery

Truth and recovery work together.

Recovery deals with transactions that have not progressed as expected.

Truth determines what the transaction actually represents once sufficient evidence is available.

```text
Recovery
   ↓
Investigate
   ↓
Verify
   ↓
Truth
   ↓
Resolved Transaction
```

For example, a missing webhook may trigger recovery:

```text
Webhook Missing
      ↓
Recovery
      ↓
Provider Verification
      ↓
Successful
```

The verified provider state can then become part of the transaction's resolved state.

See:

[Recovery Workflows →](../recover/recovery-workflows.md)

---

## Truth and Entitlements

Transaction truth is important because other parts of the application depend on it.

For example:

```text
Verified Transaction
       ↓
Entitlement
       ↓
Application Access
```

If the transaction state is incorrect, the entitlement state can also become incorrect.

This is why entitlement decisions should be based on the appropriate resolved transaction state rather than simply on whether a webhook was received.

See:

[Entitlements →](../concepts/entitlements.md)

---

## Truth and Revenue

A reliable transaction record is also important for understanding revenue.

For example:

```text
Payment
   ↓
Transaction
   ↓
Verified State
   ↓
Ledger
   ↓
Revenue Records
```

When transaction states are inconsistent, revenue reporting can also become inconsistent.

Truth therefore provides an important foundation for reliable revenue infrastructure.

---

## Truth Is Not the Same as "Whatever the Provider Says"

The payment provider is an important source of transaction information, but SolydFlow also has to maintain its own transaction model.

The system needs to account for:

* Provider responses
* Webhook events
* Transaction history
* Recovery operations
* Existing transaction state
* Provider-specific behavior

The result should be a consistent transaction record that the rest of the SolydFlow system can use.

---

## A Unified Transaction View

The objective is to provide the application with one coherent view:

```text
             Payment Provider
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     Response     Webhook     Verification
        │           │           │
        └───────────┼───────────┘
                    ↓
               SolydFlow
                    ↓
             Truth Layer
                    ↓
           Transaction State
                    ↓
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Entitlement    Ledger     Reconciliation
```

The application should not need to reconstruct this state from multiple provider-specific signals itself.

---

## The Truth Workflow

At a high level:

```text
Payment Event
     ↓
Collect Evidence
     ↓
Evaluate Evidence
     ↓
Verify When Necessary
     ↓
Determine Transaction State
     ↓
Record State
     ↓
Expose Reliable State
```

This allows the rest of the SolydFlow ecosystem to build on a consistent transaction foundation.

---

## Truth Directory

The Truth documentation is structured as:

```text
truth/
├── overview.md                    ← You are here
├── transaction-verification.md    ← NEXT
├── consensus-engine.md
├── transaction-ledger.md
├── state-mismatches.md
└── reconciliation.md
```

### Continue

Start with transaction verification:

[Transaction Verification →](./transaction-verification.md)

Then continue through the Truth layer:

[Consensus Engine →](./consensus-engine.md)

[Transaction Ledger →](./transaction-ledger.md)

[State Mismatches →](./state-mismatches.md)

[Reconciliation →](./reconciliation.md)

### Related documentation

[Recovery Workflows →](../recover/recovery-workflows.md)

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)
