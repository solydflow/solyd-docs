# State Mismatches

A state mismatch occurs when different systems have different states for the same transaction.

For example:

```text id="m7q3x8"
Payment Provider
└── Successful

SolydFlow
└── Pending
```

The payment may have succeeded, but SolydFlow has not yet received or processed the information needed to update its transaction state.

State mismatches are a normal challenge in distributed payment systems.

SolydFlow Truth is designed to help identify these differences, gather additional evidence, and resolve the transaction into a reliable state.

---

## Why State Mismatches Happen

A payment transaction can pass through several systems:

```text id="q8n4m2"
Customer
   ↓
Application
   ↓
SolydFlow
   ↓
Payment Provider
```

Information can be delayed or lost between these systems.

For example:

```text id="x5r8k3"
Provider
   ↓
Successful Payment
   X
Webhook Delivery
```

The provider knows the payment succeeded, but SolydFlow may still show:

```text id="v3m7q9"
Pending
```

This creates a state mismatch.

---

## A State Mismatch Is Not Necessarily a Payment Failure

This distinction is important.

Suppose:

```text id="k8q2m5"
Provider
└── Successful

SolydFlow
└── Pending
```

The mismatch does **not** mean:

```text id="n4r7x3"
Payment Failed
```

It means:

```text id="m6q8v2"
Systems Disagree
```

The transaction needs to be investigated and, where necessary, verified.

---

## Common Causes

State mismatches can occur because of:

* Missing webhooks
* Delayed webhooks
* Duplicate webhooks
* Out-of-order events
* Network failures
* Provider API delays
* Payment request timeouts
* Recovery operations
* Manual intervention
* Provider-specific transaction behavior
* Incomplete synchronization

These conditions can cause different systems to temporarily or permanently disagree.

---

# Types of State Mismatches

## Provider vs SolydFlow

The provider reports one state while SolydFlow has another.

```text id="q7m3k8"
Provider
└── Successful

SolydFlow
└── Pending
```

This is one of the most important mismatch types because the provider may have information that SolydFlow has not yet received.

---

## Application vs SolydFlow

The application may maintain its own transaction state.

For example:

```text id="r5n8m3"
Application
└── Successful

SolydFlow
└── Pending
```

This can happen if the application updated its own records based on information that SolydFlow has not yet processed.

---

## Application vs Provider

The application may disagree directly with the payment provider.

```text id="x4m7q2"
Application
└── Failed

Provider
└── Successful
```

In this situation, SolydFlow can provide an intermediate layer for resolving the transaction state.

---

## Multiple Provider Signals

Even information from the same provider can appear inconsistent.

For example:

```text id="k8r3m5"
Provider Response
└── Pending

Provider Verification
└── Successful
```

This requires context and verification rather than simply choosing one value.

---

# How Mismatches Develop

Consider a payment request:

```text id="m3q7v8"
Application
   ↓
SolydFlow
   ↓
Provider
```

The provider processes the payment:

```text id="n5k8r2"
Provider
└── Successful
```

But the response is lost:

```text id="q4m7x3"
Provider
   ↓
Successful
   X
Response
```

SolydFlow may therefore remain:

```text id="v8n3k5"
Pending
```

Later, the webhook may also fail:

```text id="m6r2q8"
Webhook
   X
```

The result is:

```text id="x7k4n3"
Provider → Successful
SolydFlow → Pending
```

A mismatch now exists.

---

# Detecting a Mismatch

A mismatch can be identified when SolydFlow receives information that conflicts with its current transaction state.

For example:

```text id="q8m3r5"
Current State
└── Pending

New Evidence
└── Successful
```

The system can identify:

```text id="k4n7v2"
Pending ≠ Successful
```

This should trigger the appropriate resolution process.

---

# Mismatch Detection Does Not Immediately Change the State

Detecting a mismatch and resolving it are separate steps.

```text id="m8q3n5"
Mismatch Detected
       ↓
Evaluate Evidence
       ↓
Verify if Necessary
       ↓
Resolve
       ↓
Update Transaction
```

This prevents the system from changing transaction state based on incomplete or untrusted information.

---

# Evidence Used to Resolve Mismatches

The Truth layer can use available transaction evidence such as:

```text id="r7m2k8"
Provider Response
       │
Webhook
       │
Verification
       │
Recovery
       ↓
Mismatch Resolution
```

The available evidence depends on the provider and transaction.

---

# Verification as a Resolution Tool

When the available information is insufficient, SolydFlow can verify the transaction with the provider where supported.

For example:

```text id="x5n8q3"
SolydFlow
└── Pending

Provider Verification
└── Successful
```

The evidence can then be used to resolve the mismatch:

```text id="m7r2k4"
Pending
   ↓
Verification
   ↓
Successful
```

See:

[Transaction Verification →](./transaction-verification.md)

---

# Consensus and State Mismatches

When multiple signals exist, the consensus engine helps evaluate them.

For example:

```text id="q8m4n2"
Webhook
└── Successful

Verification
└── Successful

Current State
└── Pending
```

The evidence is consistent:

```text id="v3k7m5"
Successful
Successful
    ↓
Consensus
    ↓
Successful
```

The transaction can then be resolved.

See:

[Consensus Engine →](./consensus-engine.md)

---

# Missing Webhooks

A missing webhook is one of the most common causes of a provider/SolydFlow mismatch.

```text id="r5m8q2"
Provider
└── Successful

Webhook
└── Missing
```

SolydFlow may still show:

```text id="n7k3x4"
Pending
```

Recovery can detect that the transaction has remained unresolved and trigger verification.

```text id="m4q8v2"
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

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

# Delayed Webhooks

A webhook may eventually arrive after the transaction has already been resolved through another mechanism.

For example:

```text id="q8m3k5"
Payment
   ↓
Pending
   ↓
Verification
   ↓
Successful
```

Later:

```text id="r4n7m2"
Webhook
└── Successful
```

The webhook should not create another payment or another transaction.

It should be processed against the already-resolved transaction.

This is where idempotent event handling becomes important.

See:

[Event Handling →](../webhooks/event-handling.md)

---

# Duplicate Webhooks

A provider may send the same webhook multiple times:

```text id="m7q2v8"
Webhook A
Webhook A
Webhook A
```

This should not produce:

```text id="x4k8n3"
Payment
Payment
Payment
```

Instead, all deliveries should refer to the same underlying transaction/event.

```text id="q6m3r7"
One Transaction
      ↑
Webhook A
Webhook A
Webhook A
```

See:

[Event Handling →](../webhooks/event-handling.md)

---

# Out-of-Order Events

Events may arrive in a different order from the order in which they were generated.

For example:

```text id="n8m4q2"
Generated:
A → B → C

Received:
B → A → C
```

The system should not automatically assume that the last received event represents the latest transaction state.

Instead, the event's meaning, timestamp, transaction identity, and existing transaction history should be considered.

---

# Timeout-Generated Mismatches

A payment request can time out even though the provider successfully processes the transaction.

```text id="k5r8m3"
Application
   ↓
Payment Request
   ↓
Provider
   ↓
Successful

Application
   X
Response Timeout
```

The application may interpret the timeout as:

```text id="q7n2m4"
Unknown
```

while the provider has:

```text id="x8m3v5"
Successful
```

Verification can resolve the uncertainty without creating another payment.

See:

[Transaction Verification →](./transaction-verification.md)

---

# Zombie Transactions

A transaction that remains pending longer than expected can become a candidate for investigation.

```text id="m4q8r2"
Pending
   ↓
No Expected Progress
   ↓
Zombie Candidate
```

Recovery can then attempt to establish its actual state.

```text id="n7k3v5"
Zombie Transaction
       ↓
Verification
       ↓
Successful / Failed / Still Pending
```

See:

[Zombie Transactions →](../recover/zombie-transactions.md)

---

# Resolving a State Mismatch

A simplified resolution workflow is:

```text id="q5m8x3"
Mismatch Detected
       ↓
Identify Transaction
       ↓
Collect Evidence
       ↓
Validate Evidence
       ↓
Compare States
       ↓
Verify if Necessary
       ↓
Evaluate Evidence
       ↓
Resolve Transaction State
       ↓
Record Resolution
```

---

# Step 1: Identify the Transaction

Before resolving the mismatch, SolydFlow needs to establish exactly which transaction is affected.

```text id="v8m3k5"
Provider Reference
       ↓
SolydFlow Transaction
       ↓
Matching Transaction
```

This prevents one transaction's information from being applied to another.

---

# Step 2: Collect Evidence

Gather the available information:

```text id="r4q7m2"
Provider Response
Webhook
Verification
Recovery
Transaction History
       ↓
Evidence
```

The evidence should be associated with the correct transaction.

---

# Step 3: Validate Evidence

Before using external events, validate them appropriately.

For webhooks:

```text id="m8k3q5"
Webhook
   ↓
Signature Verification
   ↓
Valid
```

For provider verification:

```text id="n4r7v2"
Provider Response
   ↓
Transaction Identity
   ↓
Validated
```

See:

[Signature Verification →](../webhooks/signature-verification.md)

---

# Step 4: Compare States

The system compares the current state with the new evidence.

```text id="q7m3x8"
Current
└── Pending

Evidence
└── Successful
```

This establishes the mismatch.

---

# Step 5: Verify When Necessary

If the available evidence is insufficient or conflicting:

```text id="k8m2r5"
Mismatch
   ↓
Verification
   ↓
Provider State
```

Verification provides additional evidence for the resolution process.

---

# Step 6: Evaluate the Evidence

The evidence is evaluated according to the transaction context.

```text id="v5q8m3"
Evidence
   ↓
Consensus
   ↓
Resolved State
```

See:

[Consensus Engine →](./consensus-engine.md)

---

# Step 7: Resolve the Transaction

Suppose:

```text id="m3r7n8"
Current State → Pending
Verification → Successful
```

The transaction can be resolved:

```text id="q8k2v5"
Pending
   ↓
Successful
```

The state change should be recorded.

---

# Step 8: Record the Resolution

The ledger should preserve the resolution:

```text id="x4m8q3"
Pending
   ↓
Verification
   ↓
Successful
```

This provides traceability for future investigation.

See:

[Transaction Ledger →](./transaction-ledger.md)

---

# What Happens When a Mismatch Cannot Be Resolved?

Not every mismatch can be immediately resolved.

For example:

```text id="r7n3m5"
Provider
└── Unavailable

Webhook
└── Missing

Verification
└── Failed to Complete
```

There may not be enough evidence to establish a final state.

In that situation, SolydFlow should preserve the uncertainty:

```text id="k8q2v4"
Insufficient Evidence
       ↓
Remain Unresolved
       ↓
Recovery / Retry
```

A temporary inability to verify should not automatically become:

```text id="x5m7n3"
Failed
```

---

# Mismatch Resolution and Retries

If verification fails because of a temporary provider or network problem, verification may be retried.

```text id="m4r8q2"
Verification
     ↓
Temporary Failure
     ↓
Retry
     ↓
Verification
```

This should not be confused with retrying the original payment.

See:

[Retries →](../recover/retries.md)

---

# Mismatch Resolution and Duplicate Payments

State mismatch handling is especially important when the original payment outcome is uncertain.

For example:

```text id="q7n3m8"
Payment
   ↓
Timeout
   ↓
Unknown
```

Creating another payment immediately could result in a duplicate charge.

Instead:

```text id="v5k8r2"
Unknown
   ↓
Verify Existing Transaction
   ↓
Resolve State
```

Only after the original transaction is appropriately resolved should the application determine whether another payment attempt is actually necessary.

---

# Mismatch Resolution and Entitlements

A mismatch can affect whether an entitlement is granted.

For example:

```text id="m8q4n3"
Provider
└── Successful

SolydFlow
└── Pending

Entitlement
└── Not Granted
```

After verification:

```text id="k3r7v8"
Successful
   ↓
Transaction Resolved
   ↓
Entitlement
```

This helps prevent customers from being incorrectly denied access after a successful payment.

See:

[Entitlements →](../concepts/entitlements.md)

---

# Mismatch Resolution and Revenue

A mismatch can also affect revenue reporting.

For example:

```text id="q5m8r3"
Provider
└── Successful

Revenue Record
└── Missing
```

The transaction ledger and reconciliation processes can help identify and resolve the difference.

```text id="x7n2k4"
Transaction
   ↓
Truth
   ↓
Ledger
   ↓
Reconciliation
   ↓
Revenue Record
```

See:

[Reconciliation →](./reconciliation.md)

---

# State Mismatches and Reconciliation

State mismatch resolution and reconciliation are closely related.

A mismatch may first be detected as:

```text id="m4q8n7"
Provider
└── Successful

SolydFlow
└── Pending
```

Reconciliation can identify the difference:

```text id="r7k3m5"
Compare Records
      ↓
Difference Detected
```

Truth can then help determine the appropriate state:

```text id="v8n2q4"
Difference
   ↓
Verification / Consensus
   ↓
Resolved State
```

See:

[Reconciliation →](./reconciliation.md)

---

# Example: Missing Webhook Resolved

Initial state:

```text id="q3m8k5"
Provider → Successful
SolydFlow → Pending
```

Detection:

```text id="x7r2n4"
Webhook Missing
```

Recovery:

```text id="m5q8v3"
Recovery
   ↓
Verification
```

Verification:

```text id="k4n7r2"
Provider → Successful
```

Resolution:

```text id="n8m3q5"
Pending
   ↓
Successful
```

Ledger:

```text id="v6q2r8"
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Successful
```

---

# Example: Temporary Provider Failure

Initial state:

```text id="r3m8q7"
SolydFlow → Pending
```

Verification:

```text id="k5n2v4"
Provider → Unavailable
```

The system should not conclude:

```text id="x7q3m8"
Failed
```

Instead:

```text id="m4r8n2"
Pending
   ↓
Verification Unavailable
   ↓
Retry / Recovery
```

Later:

```text id="q8m3v5"
Provider → Successful
```

The transaction can then be resolved.

---

# Example: Conflicting Evidence

Suppose:

```text id="v5k8m2"
Webhook → Successful
Verification → Failed
```

The system should flag the conflict:

```text id="n3q7r8"
Conflicting Evidence
```

Then:

```text id="m8x4k2"
Evaluate
   ↓
Additional Evidence
   ↓
Resolution
```

The final state should only be established when the available evidence supports it.

---

# Preventing State Mismatches

Not all mismatches can be prevented, but SolydFlow can reduce their impact through reliable transaction processing.

Important mechanisms include:

* Idempotent event handling
* Webhook verification
* Transaction verification
* Recovery workflows
* Transaction history
* Provider-specific integrations
* Reconciliation
* Clear transaction state transitions

Together:

```text id="q7m3n8"
Reliable Events
      +
Verification
      +
Recovery
      +
Truth
      ↓
Consistent Transaction State
```

---

# The Mismatch Resolution Model

The overall model is:

```text id="x8m4q2"
Different States
      ↓
Detect Mismatch
      ↓
Collect Evidence
      ↓
Validate
      ↓
Verify if Needed
      ↓
Consensus
      ↓
Resolve
      ↓
Ledger
      ↓
Reliable State
```

This keeps transaction resolution inside the revenue infrastructure rather than forcing each application to implement its own reconciliation logic.

---

# Key Principles

### 1. A mismatch is not automatically a failure

Different states indicate disagreement, not necessarily payment failure.

### 2. Detect before resolving

The system should identify the mismatch before changing the transaction state.

### 3. Verify uncertain transactions

When appropriate, verify the existing transaction instead of creating another payment.

### 4. Do not manufacture certainty

If there is insufficient evidence, preserve the unresolved state.

### 5. Record the resolution

State changes should remain traceable in the transaction ledger.

### 6. Handle duplicate and delayed events

Webhook delivery behavior should not create duplicate transactions or incorrect state changes.

### 7. Keep reconciliation and Truth connected

Reconciliation identifies differences; Truth helps establish the reliable transaction state.

---

# The Core Principle

> **A state mismatch means the systems disagree. Truth exists to determine why they disagree and, when sufficient evidence exists, establish the state the system can rely on.**

The workflow is:

```text id="m5q8r3"
Mismatch
   ↓
Evidence
   ↓
Verification
   ↓
Consensus
   ↓
Resolution
   ↓
Ledger
```

---

## Related Documentation

### Truth

[Truth Overview →](./overview.md)

[Transaction Verification →](./transaction-verification.md)

[Consensus Engine →](./consensus-engine.md)

[Transaction Ledger →](./transaction-ledger.md)

[Reconciliation →](./reconciliation.md)

### Recovery

[Transaction Recovery →](../recover/transaction-recovery.md)

[Zombie Transactions →](../recover/zombie-transactions.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

[Recovery Workflows →](../recover/recovery-workflows.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Signature Verification →](../webhooks/signature-verification.md)

[Event Handling →](../webhooks/event-handling.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

### Payment Providers

[Payment Providers Overview →](../payment-providers/overview.md)
