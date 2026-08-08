# Consensus Engine

Payment transactions can generate information from multiple sources.

A single transaction may have:

```text id="q8m3v6"
Payment Request
       ↓
Provider Response
       ↓
Webhook
       ↓
Verification
       ↓
Recovery
```

These signals do not always arrive at the same time or report the same state.

The SolydFlow consensus engine provides a framework for evaluating these signals and determining the transaction state that the rest of the system can rely on.

```text id="m4r7n2"
Payment Evidence
      │
      ├── Provider Response
      ├── Webhook
      ├── Verification
      └── Recovery
              ↓
        Consensus Engine
              ↓
       Transaction State
```

---

## Why a Consensus Engine Is Needed

Payment systems are distributed systems.

The application, SolydFlow, and payment providers can each have different information about the same transaction.

For example:

```text id="k7q3x9"
Application
└── Pending

SolydFlow
└── Pending

Provider
└── Successful
```

The application needs more than a collection of disconnected events.

It needs a reliable interpretation of those events.

The consensus engine helps turn transaction evidence into a consistent state.

---

## Consensus Is About Evidence

The consensus engine should not simply ask:

> "Which event arrived last?"

Instead, it considers the available evidence.

```text id="v5m8q2"
Provider Response
       │
Webhook│
       │
Verification
       │
Recovery Event
       ↓
Consensus
       ↓
Transaction State
```

Different pieces of evidence may have different meanings and levels of reliability depending on the transaction and provider.

---

## Example: Webhook and Verification Agree

Suppose a provider sends:

```text id="n3r7m5"
Webhook
└── Successful
```

A verification request also returns:

```text id="x8k2q4"
Verification
└── Successful
```

The evidence is consistent:

```text id="p6m4v9"
Webhook       ──┐
                ├──→ Successful
Verification ───┘
```

The transaction can therefore be resolved confidently as successful.

---

## Example: Webhook Is Missing

Suppose:

```text id="q7m2n8"
Webhook
└── Not Received
```

But provider verification returns:

```text id="r4k9x3"
Verification
└── Successful
```

The absence of the webhook does not override the verified provider state.

The evidence becomes:

```text id="v8m3q6"
Webhook        ──→ Missing
Verification   ──→ Successful
                     ↓
                  Consensus
                     ↓
                 Successful
```

This is one reason recovery and truth are closely connected.

---

## Example: Conflicting Evidence

Consider:

```text id="m5q8r2"
Webhook
└── Successful

Verification
└── Failed
```

The evidence conflicts.

SolydFlow should not blindly choose one simply because it arrived first or last.

Instead, the conflict needs to be evaluated according to the transaction's context and provider behavior.

```text id="k3n7x5"
Webhook ──────────┐
                  ├──→ Conflict
Verification ─────┘
                     ↓
                  Evaluate
                     ↓
              Resolve Transaction
```

This is the purpose of the consensus layer.

---

## Consensus Does Not Mean Majority Vote

The term **consensus** does not necessarily mean:

```text id="q6m3v8"
3 sources say Successful
2 sources say Failed
       ↓
Successful wins
```

Payment systems do not work reliably by simply counting events.

One authoritative provider verification may be more meaningful than several stale application events.

The consensus engine should therefore evaluate the **meaning and context of evidence**, not simply the number of events.

---

## Sources of Evidence

Transaction evidence can originate from different parts of the payment lifecycle.

```text id="r8k2m4"
                  Transaction
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
Provider Response   Webhook     Verification
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                   Recovery
                      ↓
                  Consensus
```

The available evidence depends on the payment provider and integration.

---

## Provider Responses

A provider response can provide information about the result of an operation.

For example:

```text id="m7q3n8"
Payment Request
      ↓
Provider Response
      ↓
Successful
```

This is useful evidence for the transaction.

However, responses can be lost because of network failures or timeouts.

For example:

```text id="x4r8k2"
Payment Request
      ↓
Provider
      ↓
Successful
      X
Application
```

The absence of a response therefore does not necessarily mean that the provider did not process the transaction.

---

## Webhooks

Webhooks provide asynchronous transaction events.

For example:

```text id="p5m8q3"
Provider
   ↓
Webhook
   ↓
Successful
```

They are useful because the provider can notify SolydFlow independently of the original payment request.

However, webhooks can:

* Arrive late
* Be duplicated
* Arrive out of order
* Fail to arrive
* Fail during processing

Therefore, webhook events are important evidence but must be handled within the broader transaction model.

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

## Verification

Verification provides a way to check the provider's current transaction information when existing evidence is incomplete or conflicting.

```text id="n6q2v9"
Existing Evidence
      ↓
Uncertain
      ↓
Verification
      ↓
Provider State
```

Verification is particularly useful for:

* Payment timeouts
* Missing webhooks
* Zombie transactions
* State mismatches
* Recovery workflows

See:

[Transaction Verification →](./transaction-verification.md)

---

## Recovery Events

Recovery operations can also provide evidence about what happened to a transaction.

For example:

```text id="r3k7m5"
Webhook Missing
      ↓
Recovery
      ↓
Verification
      ↓
Successful
```

The recovery process helps gather information that can then be used to resolve the transaction.

See:

[Recovery Workflows →](../recover/recovery-workflows.md)

---

# Evidence Evaluation

A simplified consensus process looks like:

```text id="v8m4q2"
Collect Evidence
      ↓
Validate Evidence
      ↓
Identify Transaction
      ↓
Compare States
      ↓
Evaluate Context
      ↓
Determine State
      ↓
Record Result
```

Each step matters.

---

## 1. Collect Evidence

The system gathers relevant transaction information.

```text id="k5q8n3"
Provider Response
Webhook
Verification
Recovery
   ↓
Evidence Set
```

The evidence should be associated with the correct transaction.

---

## 2. Validate Evidence

Evidence should be checked before being used.

For example:

```text id="m7r2x8"
Webhook
   ↓
Signature Verification
   ↓
Valid
   ↓
Evidence
```

Similarly, a provider verification response should correspond to the transaction being evaluated.

See:

[Signature Verification →](../webhooks/signature-verification.md)

---

## 3. Identify the Transaction

The system must establish that the evidence belongs to the transaction being evaluated.

```text id="q4n8m3"
Evidence
   ↓
Transaction Identifier
   ↓
Existing Transaction
```

This prevents information from one transaction being incorrectly applied to another.

---

## 4. Compare States

The system evaluates the current SolydFlow state against available evidence.

For example:

```text id="x8k3r5"
SolydFlow → Pending
Provider   → Successful
```

This is a mismatch.

The consensus layer needs to determine how the mismatch should be resolved.

---

## 5. Evaluate Context

The same state can have different meanings depending on when and how it was observed.

For example:

```text id="p7m4q2"
Successful Webhook
       ↓
Received Before Verification
```

is different from:

```text id="n5r8k3"
Successful Webhook
       ↓
Received After Provider Reports Failed
```

The system needs to evaluate the transaction history and provider behavior rather than treating each event in isolation.

---

## 6. Determine Transaction State

After evaluating the evidence:

```text id="v3q7m8"
Evidence
   ↓
Evaluation
   ↓
Resolved Transaction State
```

Possible states depend on the transaction model.

For example:

```text id="k8m2r5"
Successful
Pending
Failed
```

The transaction state model defines the supported states and transitions.

See:

[Transaction States →](../concepts/transaction-states.md)

---

## 7. Record the Result

The resolved state should be recorded in the transaction history.

```text id="m4q8n2"
Evidence
   ↓
Consensus
   ↓
Transaction State
   ↓
Ledger
```

This provides traceability.

See:

[Transaction Ledger →](./transaction-ledger.md)

---

# State Precedence

Different evidence may have different significance.

The consensus engine therefore needs rules for determining which evidence should influence the transaction state when signals disagree.

For example:

```text id="r7k3x8"
Evidence
   ↓
 ┌──────────┬───────────┬───────────┐
 ↓          ↓           ↓
Webhook   Provider    Verification
          Response
 └──────────┴───────────┴───────────┘
                ↓
          Evaluation Rules
                ↓
          Transaction State
```

The exact precedence rules are provider- and implementation-dependent.

The important principle is that the transaction should not be resolved through arbitrary event ordering.

---

# Final and Intermediate States

The consensus engine should distinguish between final and intermediate transaction states.

For example:

```text id="q5m8n3"
Pending
   ↓
Intermediate
```

while:

```text id="v7r2k9"
Successful
   ↓
Final
```

and:

```text id="m3x8q6"
Failed
   ↓
Final
```

The ability to distinguish these states prevents a temporary state from being treated as a final outcome.

---

# Handling Conflicts

When evidence conflicts:

```text id="k8n4m2"
Evidence A → Successful
Evidence B → Failed
```

the system should enter a conflict-resolution process rather than arbitrarily selecting a state.

```text id="r6q3v8"
Conflict
   ↓
Investigate
   ↓
Verify
   ↓
Evaluate
   ↓
Resolve
```

The transaction may require additional provider verification or other evidence.

See:

[State Mismatches →](./state-mismatches.md)

---

# Handling Missing Evidence

Missing evidence is also important.

For example:

```text id="x7m2p5"
Payment
   ↓
Provider
   ↓
Successful

Webhook
   X
```

The missing webhook should not automatically become:

```text id="n4q8r3"
Failed
```

Instead:

```text id="m6k2v9"
Webhook Missing
      ↓
Recovery / Verification
      ↓
Evidence
      ↓
Consensus
```

---

# Handling Duplicate Evidence

The same event may be received more than once.

```text id="p8r3m7"
Webhook A
   ↓
Webhook A
```

The consensus layer should recognize that these events refer to the same underlying transaction or event rather than interpreting them as multiple payments.

```text id="q5n7k2"
Webhook A ──┐
            ├──→ Same Transaction
Webhook A ──┘
```

This works together with idempotent event processing.

See:

[Event Handling →](../webhooks/event-handling.md)

---

# Handling Out-of-Order Evidence

Events may not always arrive in the same order they were generated.

For example:

```text id="x3m8q6"
Generated:
A → B → C

Received:
B → A → C
```

The consensus engine should therefore evaluate transaction state using the meaning and context of the evidence rather than assuming arrival order equals transaction order.

---

# Consensus and Recovery

Recovery often provides the evidence needed to resolve uncertainty.

```text id="v8q2m5"
Unresolved Transaction
        ↓
Recovery
        ↓
Verification
        ↓
Provider State
        ↓
Consensus
        ↓
Resolved Transaction
```

This creates a feedback loop:

```text id="k4n7r3"
Truth
  ↓
Detect Uncertainty
  ↓
Recover
  ↓
Verify
  ↓
Truth
```

Recovery helps gather evidence.

The consensus layer helps interpret that evidence.

---

# Consensus and Reconciliation

Consensus focuses primarily on determining the appropriate state of a transaction.

Reconciliation focuses on identifying differences between records and helping bring those records into agreement.

```text id="m8q3x6"
Evidence
   ↓
Consensus
   ↓
Transaction State
   ↓
Ledger
   ↓
Reconciliation
```

Both are important for maintaining reliable transaction records.

See:

[Reconciliation →](./reconciliation.md)

---

# Consensus and Entitlements

Once a transaction reaches a reliable state, other systems can act on it.

For example:

```text id="n5r7k2"
Consensus
   ↓
Successful Transaction
   ↓
Entitlement
   ↓
Application Access
```

The consensus engine should therefore provide a stable transaction state rather than forcing each application to interpret provider events independently.

---

# Consensus and the Transaction Ledger

The ledger records the resulting transaction state and relevant history.

```text id="q7m3v8"
Evidence
   ↓
Consensus
   ↓
Transaction
   ↓
Ledger
```

For example:

```text id="x4n8k2"
Transaction
├── Created
├── Pending
├── Webhook Received
├── Verification Requested
├── Provider Verified
└── Successful
```

The ledger provides the historical context needed to understand the transaction.

---

# Example: Missing Webhook

Consider:

```text id="m3r8q5"
Provider
└── Successful

SolydFlow
└── Pending

Webhook
└── Missing
```

The consensus workflow is:

```text id="v7k2n4"
Pending
   ↓
Missing Expected Event
   ↓
Recovery
   ↓
Provider Verification
   ↓
Successful
   ↓
Consensus
   ↓
Successful
```

The transaction is then resolved using verified evidence.

---

# Example: Conflicting Webhook and Verification

Consider:

```text id="q8m4r3"
Webhook
└── Successful

Verification
└── Failed
```

The consensus engine should identify this as conflicting evidence.

```text id="k5n7x2"
Conflict
   ↓
Investigate
   ↓
Evaluate Transaction History
   ↓
Additional Verification if Necessary
   ↓
Resolve
```

The exact resolution depends on the provider's transaction model and the evidence available.

The important point is that the system should **not silently choose one state without evaluating the conflict**.

---

# Example: Repeated Webhook

Suppose:

```text id="r4m8q3"
Webhook A
Webhook A
Webhook A
```

All three deliveries refer to the same underlying event.

The desired result remains:

```text id="n7k2v5"
One Transaction
      ↓
One Resolved State
```

rather than:

```text id="x3q8m6"
Three Payments
```

This requires event deduplication and idempotent processing.

---

# Example: Provider Still Pending

Suppose:

```text id="m8r2k4"
Webhook
└── Pending

Verification
└── Pending
```

The evidence agrees.

```text id="v5n7q3"
Webhook       ──┐
                ├──→ Pending
Verification ───┘
```

The transaction should remain pending rather than being artificially promoted to a final state.

---

# Example: Provider State Is Unavailable

Suppose:

```text id="q4m8x2"
Webhook
└── Missing

Verification
└── Provider Unavailable
```

The evidence does not establish a final transaction state.

The appropriate result may therefore remain unresolved while recovery continues:

```text id="k7n3r5"
Insufficient Evidence
       ↓
Recovery
       ↓
Retry Verification
       ↓
Additional Evidence
```

This is preferable to treating provider unavailability as payment failure.

---

# Consensus Should Produce a Stable Result

The purpose of consensus is not to expose every conflicting signal to the application.

Instead, the application should be able to work with a coherent transaction model.

```text id="m5q8n3"
Multiple Signals
      ↓
Consensus
      ↓
Reliable Transaction State
      ↓
Application
```

The application can then focus on its own business logic.

---

# Consensus Is a Layer, Not a Guarantee

The consensus engine can evaluate available evidence, but it cannot manufacture information that does not exist.

For example:

```text id="x8r3m7"
No Webhook
No Provider Response
No Verification
No Transaction Record
```

There may simply be insufficient information to establish the final state.

In that case:

```text id="q4m7n2"
Insufficient Evidence
       ↓
Remain Unresolved
       ↓
Continue Recovery / Investigation
```

This is an important distinction.

A reliable system should be comfortable representing uncertainty rather than inventing certainty.

---

# The Consensus Workflow

The complete model is:

```text id="v6k3m8"
             Transaction
                  ↓
           Collect Evidence
                  ↓
           Validate Evidence
                  ↓
          Identify Transaction
                  ↓
          Evaluate Evidence
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
     Agreement            Conflict
        ↓                   ↓
     Resolve             Verify
        │                   ↓
        └─────────┬─────────┘
                  ↓
          Transaction State
                  ↓
               Ledger
                  ↓
        Entitlement / Revenue
```

---

# Key Principles

### 1. Do not rely on a single event blindly

A webhook is evidence, not necessarily the entire transaction truth.

### 2. Do not use event counts as consensus

Three stale events should not automatically outweigh one authoritative verification.

### 3. Evaluate transaction context

Transaction history and state matter.

### 4. Resolve conflicts explicitly

Conflicting evidence should trigger evaluation rather than silent assumptions.

### 5. Preserve uncertainty when necessary

If there is insufficient evidence, the system should remain unresolved rather than inventing a final state.

### 6. Record the resulting state

The resolved transaction should be reflected in the ledger.

---

# The Core Principle

> **Consensus turns multiple payment signals into one reliable transaction state.**

The workflow is:

```text id="n8q4m2"
Evidence
   ↓
Validation
   ↓
Evaluation
   ↓
Consensus
   ↓
Transaction State
   ↓
Ledger
```

This provides the foundation for SolydFlow Truth.

---

## Related Documentation

### Truth

[Truth Overview →](./overview.md)

[Transaction Verification →](./transaction-verification.md)

[Transaction Ledger →](./transaction-ledger.md)

[State Mismatches →](./state-mismatches.md)

[Reconciliation →](./reconciliation.md)

### Recovery

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Recovery Workflows →](../recover/recovery-workflows.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Event Handling →](../webhooks/event-handling.md)

[Signature Verification →](../webhooks/signature-verification.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

### Payment Providers

[Payment Providers Overview →](../payment-providers/overview.md)

