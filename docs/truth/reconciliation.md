# Reconciliation

Reconciliation is the process of comparing transaction records from different systems and identifying differences.

In payment infrastructure, SolydFlow may have a transaction record while a payment provider has its own record of the same transaction.

These records should eventually agree.

```text id="m7q3v8"
Payment Provider
      │
      │
      ▼
   Compare
      ▲
      │
      │
SolydFlow Ledger
      │
      ▼
Differences / Agreement
```

When they do not agree, reconciliation helps identify the difference and provides the information needed to resolve it.

---

## Why Reconciliation Matters

A payment may appear successful in one system while remaining pending or missing in another.

For example:

```text id="q8n4m2"
Provider
└── Successful

SolydFlow
└── Pending
```

Without reconciliation, the difference may remain unnoticed.

With reconciliation:

```text id="x5r7k3"
Provider Record
       +
SolydFlow Record
       ↓
    Compare
       ↓
Difference Detected
```

This allows the transaction to be investigated and, where possible, resolved.

---

# Reconciliation Is Not the Same as Verification

These concepts are related but serve different purposes.

### Verification

Verification asks:

> What does the provider currently say about this transaction?

```text id="v3m8q5"
SolydFlow
   ↓
Provider
   ↓
Transaction State
```

### Reconciliation

Reconciliation asks:

> Do the records held by the different systems agree?

```text id="k7q2m4"
Provider Records
      +
SolydFlow Records
      ↓
   Compare
      ↓
 Agreement / Difference
```

Verification can therefore be used as part of reconciliation when a difference needs to be investigated.

See:

[Transaction Verification →](./transaction-verification.md)

---

# Reconciliation and Truth

Reconciliation identifies differences.

Truth helps determine the reliable transaction state when those differences exist.

```text id="m4q8n2"
Records
   ↓
Reconciliation
   ↓
Difference
   ↓
Verification / Evidence
   ↓
Consensus
   ↓
Resolved State
```

The two systems work together rather than replacing one another.

---

# Reconciliation and the Transaction Ledger

The SolydFlow transaction ledger provides the internal transaction history used during reconciliation.

```text id="r8m3k5"
Provider Records
       │
       │
       ▼
   Reconciliation
       ▲
       │
       │
SolydFlow Ledger
```

The ledger can provide context such as:

* Transaction state
* State transitions
* Provider references
* Events
* Verification activity
* Recovery activity
* Relevant timestamps

See:

[Transaction Ledger →](./transaction-ledger.md)

---

# What Gets Reconciled?

Reconciliation can compare information associated with transactions, such as:

* Transaction identity
* Provider reference
* Transaction state
* Payment amount
* Currency
* Payment provider
* Transaction timestamps
* Product or package information
* Relevant transaction events

The exact fields available depend on the payment provider and SolydFlow integration.

---

# Reconciliation Outcomes

A reconciliation process can produce several broad outcomes.

### Matched

Both systems agree.

```text id="q5m8r2"
Provider
└── Successful

SolydFlow
└── Successful

       ↓

MATCHED
```

No state correction is required.

---

### Mismatched

The systems disagree.

```text id="x7n3k8"
Provider
└── Successful

SolydFlow
└── Pending

       ↓

MISMATCH
```

The difference needs investigation.

---

### Missing From SolydFlow

The provider has a transaction that SolydFlow does not currently have in the expected records.

```text id="m8q4v3"
Provider
└── Transaction A

SolydFlow
└── No Transaction A
```

This can require investigation to determine whether the transaction was:

* Never received
* Created under another reference
* Still being processed
* Lost during processing
* Subject to another integration condition

---

### Missing From Provider Records

SolydFlow has a transaction that cannot currently be matched to a provider record.

```text id="k3r7m8"
SolydFlow
└── Transaction A

Provider
└── No Transaction A
```

The transaction should be investigated rather than automatically assumed to have failed.

---

# The Reconciliation Workflow

A simplified reconciliation process looks like:

```text id="v8m2q5"
Collect Records
      ↓
Normalize Records
      ↓
Match Transactions
      ↓
Compare Records
      ↓
Identify Differences
      ↓
Investigate Differences
      ↓
Resolve Where Possible
      ↓
Record Result
```

Each step has a specific purpose.

---

# 1. Collect Records

The reconciliation process needs transaction information from the systems being compared.

```text id="q4m8n3"
Provider Records
       +
SolydFlow Records
       ↓
   Record Set
```

The exact collection mechanism depends on the provider.

It may involve provider APIs, transaction queries, webhooks, or other supported integration mechanisms.

---

# 2. Normalize Records

Different providers may represent transaction information differently.

For example:

```text id="m7q3r8"
Provider A
└── status: success

Provider B
└── status: completed

SolydFlow
└── state: successful
```

Reconciliation needs a common interpretation of these values before comparing them.

Conceptually:

```text id="x8n4k2"
Provider Data
      ↓
Normalization
      ↓
Common Transaction Model
```

This allows different provider representations to be compared consistently.

---

# 3. Match Transactions

The system needs to determine which records represent the same transaction.

For example:

```text id="r5m8q3"
SolydFlow Transaction
└── TX-123

Provider Transaction
└── PROVIDER-456
```

The relationship between the identifiers allows the records to be matched.

```text id="k7n3v2"
TX-123
  ↕
PROVIDER-456
```

Without reliable transaction matching, reconciliation can produce incorrect results.

---

# 4. Compare Records

Once transactions have been matched, the relevant fields can be compared.

For example:

```text id="q8m4r5"
                 SolydFlow    Provider
State            Pending      Successful
Amount           ₦10,000      ₦10,000
Currency         NGN          NGN
Reference        TX-123       TX-123
```

The difference is:

```text id="m3k7v8"
State:
Pending ≠ Successful
```

---

# 5. Identify Differences

Not every difference has the same meaning.

For example:

```text id="x4n8q2"
State Difference
```

may indicate a genuine transaction mismatch.

But:

```text id="v7m3r5"
Timestamp Difference
```

may simply reflect different processing or recording times.

Reconciliation should therefore classify differences rather than treating every difference as an error.

---

# 6. Investigate Differences

When a meaningful difference is detected:

```text id="q5r8m3"
Difference
   ↓
Transaction History
   ↓
Evidence
   ↓
Verification
```

The transaction ledger can provide historical context.

See:

[State Mismatches →](./state-mismatches.md)

---

# 7. Resolve Where Possible

Suppose reconciliation identifies:

```text id="k8m2q4"
Provider → Successful
SolydFlow → Pending
```

Verification confirms:

```text id="m5r7n3"
Provider → Successful
```

The transaction can then be resolved:

```text id="v4q8k2"
Pending
   ↓
Verification
   ↓
Successful
```

The resolution should be recorded in the transaction history.

---

# 8. Record the Reconciliation Result

The reconciliation result should remain traceable.

For example:

```text id="x7m3r8"
Reconciliation
└── Mismatch Detected

Verification
└── Successful

Resolution
└── Transaction Updated
```

This provides an operational record of what happened.

---

# Reconciliation Frequency

Reconciliation does not necessarily need to happen only when someone notices a problem.

Depending on the integration and business requirements, reconciliation can be performed periodically or as part of operational workflows.

For example:

```text id="q8n3m5"
Transactions
   ↓
Periodic Reconciliation
   ↓
Differences
   ↓
Investigation
```

The appropriate frequency depends on the provider, transaction volume, and application requirements.

---

# Event-Driven vs Periodic Reconciliation

SolydFlow can conceptually use both approaches.

### Event-driven

A transaction discrepancy is investigated when relevant evidence arrives.

```text id="m7r4q8"
Provider Event
      ↓
Transaction
      ↓
Compare
```

### Periodic

Records are compared on a schedule.

```text id="k5q8n2"
Transactions
      ↓
Scheduled Reconciliation
      ↓
Compare
```

The two approaches can complement each other.

---

# Why Webhooks Alone Are Not Enough

Webhooks are useful for receiving transaction events, but webhook delivery is not guaranteed to provide a complete transaction history by itself.

A webhook can:

* Fail to arrive
* Arrive late
* Be duplicated
* Arrive out of order
* Be processed incorrectly

For example:

```text id="x4m8q7"
Provider
   ↓
Successful
   X
Webhook
```

Periodic or on-demand reconciliation can help detect situations where the expected event did not reach SolydFlow.

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

# Reconciliation and Recovery

Recovery can be triggered when reconciliation identifies an unresolved transaction.

```text id="r7m3k5"
Reconciliation
      ↓
Mismatch
      ↓
Recovery
      ↓
Verification
      ↓
Resolution
```

For example:

```text id="q8n4m2"
Provider → Successful
SolydFlow → Pending
        ↓
   Reconciliation
        ↓
    Difference
        ↓
     Recovery
        ↓
   Verification
        ↓
    Successful
```

See:

[Recovery Workflows →](../recover/recovery-workflows.md)

---

# Reconciliation and Consensus

When multiple pieces of evidence are available, consensus helps determine the appropriate transaction state.

```text id="m5q8v3"
Provider Record
Webhook
Verification
Transaction History
       ↓
    Consensus
       ↓
Resolved State
```

Reconciliation tells the system:

> These records are different.

Consensus helps answer:

> Given the available evidence, what state should the transaction have?

See:

[Consensus Engine →](./consensus-engine.md)

---

# Reconciliation and State Mismatches

A reconciliation difference often becomes a state mismatch.

For example:

```text id="k3r7m8"
Provider
└── Successful

SolydFlow
└── Pending
```

The reconciliation process detects the difference.

The Truth layer then helps resolve it.

```text id="v8m2q4"
Reconciliation
      ↓
State Mismatch
      ↓
Verification
      ↓
Consensus
      ↓
Resolved State
```

See:

[State Mismatches →](./state-mismatches.md)

---

# Reconciliation and the Ledger

The transaction ledger provides the history needed to understand why records differ.

For example:

```text id="q7m3n8"
Provider
└── Successful

SolydFlow
└── Pending
```

The ledger may show:

```text id="x5m8r2"
Created
   ↓
Pending
   ↓
Webhook Missing
   ↓
Recovery Started
```

This context can explain why the provider and SolydFlow temporarily disagree.

---

# Reconciliation and Revenue

Reliable revenue reporting depends on reliable transaction records.

Consider:

```text id="m4q8k3"
Provider
└── Successful

SolydFlow Revenue
└── Missing
```

Reconciliation can identify the difference.

```text id="r7n3m5"
Provider Record
      ↓
Reconciliation
      ↓
Missing Revenue Record
```

The transaction can then be investigated and resolved according to the application's revenue model.

---

# Reconciliation and Entitlements

Payment state and entitlement state can also become inconsistent.

For example:

```text id="q8m4r2"
Transaction
└── Successful

Entitlement
└── Not Granted
```

This is not necessarily a provider reconciliation problem, but transaction truth can help determine whether the entitlement should exist.

```text id="v3k7m8"
Verified Transaction
       ↓
Successful
       ↓
Entitlement
```

See:

[Entitlements →](../concepts/entitlements.md)

---

# Reconciliation and Multi-Provider Payments

When an application uses multiple payment providers, reconciliation becomes more important.

For example:

```text id="m8q3r5"
                  SolydFlow
                 /        \
                ↓          ↓
           Paystack     Flutterwave
                │          │
                ↓          ↓
             Records     Records
```

SolydFlow can maintain a unified transaction model while provider-specific records remain associated with their respective providers.

This makes it possible to investigate transaction differences without requiring the application to implement separate reconciliation logic for every provider.

---

# Example: Two Providers

Suppose an application uses two payment providers.

```text id="k7m3q8"
Provider A
└── Successful

Provider B
└── Successful

SolydFlow
└── Successful
```

The records agree.

```text id="x4n8r2"
MATCHED
```

If SolydFlow instead shows:

```text id="q5m7v3"
Provider A → Successful
Provider B → Successful
SolydFlow → Pending
```

reconciliation identifies the mismatch.

The Truth layer can then determine the appropriate resolution based on the transaction's actual provider relationship and available evidence.

---

# Example: Provider Record Missing

Suppose:

```text id="m8r3k5"
Provider
└── TX-123

SolydFlow
└── No matching transaction
```

The system should investigate:

```text id="v7q2n4"
Search References
      ↓
Check Transaction History
      ↓
Check Events
      ↓
Determine Whether Match Exists
```

A missing record does not automatically mean that the payment failed.

---

# Example: SolydFlow Record Missing From Provider

Suppose:

```text id="k4m8q3"
SolydFlow
└── TX-123

Provider
└── No TX-123
```

Possible explanations include:

* The payment request was never completed
* The provider reference was incorrect
* The transaction belongs to another provider
* The transaction is still being processed
* The provider record is unavailable
* The integration requires further investigation

The system should investigate before assigning a final interpretation.

---

# Handling Amount Differences

A reconciliation process may also identify amount differences.

For example:

```text id="q7m3n8"
SolydFlow
└── ₦10,000

Provider
└── ₦9,500
```

This is different from a simple state mismatch.

The system should flag the difference for investigation rather than silently changing the transaction amount.

---

# Handling Currency Differences

Similarly:

```text id="m5q8r2"
SolydFlow
└── USD

Provider
└── NGN
```

This requires investigation because currency is part of the financial meaning of the transaction.

Currency normalization should not be confused with currency conversion.

---

# Handling Timestamp Differences

Different systems may record different timestamps.

For example:

```text id="x8n3k5"
Provider Created:
10:00

SolydFlow Received:
10:02
```

This is not necessarily an error.

Distributed systems naturally introduce differences between:

* Creation time
* Provider processing time
* Webhook time
* Receipt time
* Processing time

Reconciliation should distinguish expected timing differences from genuine inconsistencies.

---

# Reconciliation Does Not Mean Automatic Correction

Finding a difference does not mean the system should automatically overwrite one record with another.

For example:

```text id="r4m8q2"
Provider → Successful
SolydFlow → Pending
```

The correct process is:

```text id="k7n3m5"
Difference
   ↓
Investigate
   ↓
Verify
   ↓
Evaluate
   ↓
Resolve
```

Automatic correction without sufficient evidence can create new inconsistencies.

---

# Reconciliation Results

A reconciliation operation can conceptually produce a result such as:

```text id="q8m3v5"
Reconciliation Result

Status:
└── Matched / Mismatched

Transaction:
└── TX-123

Provider:
└── Provider A

SolydFlow State:
└── Pending

Provider State:
└── Successful

Resolution:
└── Verification Required
```

The exact implementation and response format depend on the SolydFlow API.

---

# Reconciliation as a Continuous Process

Payment infrastructure is distributed and continuously changing.

A transaction that appears consistent at one moment can become inconsistent if delayed events arrive later.

For example:

```text id="m7q2r8"
10:00
Provider → Successful
SolydFlow → Pending

10:02
Verification → Successful

10:03
Webhook → Successful
```

The transaction moves through several observations before the systems converge.

Reconciliation helps maintain consistency across these changes.

---

# Reconciliation and Transaction Finality

Reconciliation should distinguish between transactions that are still evolving and transactions that have reached a reliable final state.

For example:

```text id="v5m8q3"
Pending
   ↓
Verification
   ↓
Successful
```

Once the transaction has reached the appropriate final state, later duplicate or delayed evidence should not create a new transaction or incorrectly reverse the established state.

See:

[Transaction States →](../concepts/transaction-states.md)

---

# Reconciliation and Auditability

Reconciliation should be traceable.

An operational record should make it possible to understand:

* What was compared
* Which transactions were matched
* Which differences were found
* What evidence was considered
* Whether verification was performed
* What resolution occurred

Conceptually:

```text id="k8r3m5"
Reconciliation Run
       ↓
Differences
       ↓
Investigation
       ↓
Resolution
```

This supports operational visibility and auditability.

---

# A Complete Reconciliation Example

Consider a payment that initially appears unresolved.

### Initial transaction

```text id="q4m8n3"
SolydFlow
└── Pending
```

### Provider record

```text id="x7r2m5"
Provider
└── Successful
```

### Reconciliation

```text id="m8q3v4"
Compare
   ↓
Pending ≠ Successful
   ↓
Mismatch
```

### Investigation

```text id="k5n7r2"
Transaction History
   ↓
Webhook Missing
```

### Verification

```text id="v3m8q5"
Provider Verification
└── Successful
```

### Consensus

```text id="q7k2m4"
Evidence
   ↓
Consensus
   ↓
Successful
```

### Ledger

```text id="r8m3n5"
Created
   ↓
Pending
   ↓
Webhook Missing
   ↓
Verification
   ↓
Successful
```

The systems now have a consistent transaction interpretation.

---

# The Reconciliation Model

The overall process is:

```text id="m4q8r3"
Provider Records
       │
       │
       ▼
   Normalize
       │
       ▼
     Match
       │
       ▼
    Compare
       │
       ▼
 ┌─────┴─────┐
 ↓           ↓
Match      Difference
 ↓           ↓
Done      Investigate
             ↓
         Verification
             ↓
          Consensus
             ↓
          Resolution
             ↓
           Ledger
```

This is how reconciliation fits into SolydFlow Truth.

---

# Key Principles

### 1. Compare systems, not assumptions

Reconciliation should be based on actual transaction records.

### 2. Match transactions carefully

The same transaction may have different identifiers across systems.

### 3. Normalize provider data

Different providers may use different representations for the same concept.

### 4. Classify differences

Not every difference represents a payment problem.

### 5. Investigate before correcting

A mismatch should not automatically overwrite existing transaction information.

### 6. Use verification when necessary

Provider verification can provide additional evidence for resolving differences.

### 7. Preserve the transaction history

Resolutions should remain traceable in the ledger.

### 8. Do not manufacture certainty

If the available evidence is insufficient, the transaction should remain unresolved rather than being incorrectly marked successful or failed.

---

# The Core Principle

> **Reconciliation keeps the records of different payment systems aligned by finding differences, investigating their causes, and providing the evidence needed to resolve them.**

The workflow is:

```text id="x8m3q5"
Compare
   ↓
Detect
   ↓
Investigate
   ↓
Verify
   ↓
Resolve
   ↓
Record
```

---

## Related Documentation

### Truth

[Truth Overview →](./overview.md)

[Transaction Verification →](./transaction-verification.md)

[Consensus Engine →](./consensus-engine.md)

[Transaction Ledger →](./transaction-ledger.md)

[State Mismatches →](./state-mismatches.md)

### Recovery

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

[Recovery Workflows →](../recover/recovery-workflows.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Event Handling →](../webhooks/event-handling.md)

[Signature Verification →](../webhooks/signature-verification.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

