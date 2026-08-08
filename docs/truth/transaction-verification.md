# Transaction Verification

Transaction verification is the process of checking the state of a transaction against the payment provider or other available transaction evidence.

A transaction may be uncertain for several reasons:

* A payment request timed out
* A webhook was not received
* A webhook was delayed
* A transaction remains pending
* Different systems report different states
* A recovery operation needs to determine what actually happened

Instead of assuming the outcome, SolydFlow can verify the transaction and use the result to establish a reliable state.

```text id="4kq8m2"
Transaction
     ↓
Uncertain
     ↓
Verify
     ↓
Provider / Evidence
     ↓
Verified State
```

---

## Why Verification Matters

Consider a payment request that times out:

```text id="7m3q9v"
Application
    ↓
Payment Request
    ↓
Provider
    ↓
Timeout
```

The application cannot safely conclude:

```text id="2n8x5p"
Timeout = Payment Failed
```

The provider may have processed the payment even though the response never reached the application.

The safer approach is:

```text id="6r4k1w"
Timeout
   ↓
Find Existing Transaction
   ↓
Verify
   ↓
Determine Actual State
```

This helps prevent both lost revenue and duplicate charges.

---

## What Verification Answers

Verification should help answer questions such as:

* Does the transaction exist?
* What state is the transaction in?
* Was the payment successful?
* Was the payment declined?
* Is the transaction still pending?
* Does the provider's transaction correspond to the expected transaction?
* Has the transaction already reached a final state?

Conceptually:

```text id="8p2m7q"
Unknown
   ↓
Verification
   ↓
 ┌──────────┬──────────┬──────────┐
 ↓          ↓          ↓
Successful Pending    Failed
```

The resulting state should then be recorded appropriately.

---

## Verification Is Not a New Payment Attempt

This distinction is important.

Verification asks:

> **What happened to the existing transaction?**

It does not ask:

> **Should we create another payment?**

For example:

```text id="5x8m3r"
Existing Payment
      ↓
Unknown Result
      ↓
Verify
```

is different from:

```text id="9q4k7n"
Existing Payment
      ↓
Unknown Result
      ↓
Create New Payment
```

The second approach can potentially result in a duplicate charge.

---

## When Verification Is Needed

Verification can be useful whenever the transaction state cannot be established confidently from the information already available.

Common scenarios include:

### Payment timeout

```text id="m7r2q8"
Payment Request
      ↓
Timeout
      ↓
Verify Existing Transaction
```

### Missing webhook

```text id="x3k9p5"
Expected Webhook
      ↓
Not Received
      ↓
Verify Transaction
```

### Zombie transaction

```text id="q8n4m6"
Transaction
      ↓
Pending Too Long
      ↓
Verify
```

### State mismatch

```text id="v5p7r2"
Provider ≠ SolydFlow
        ↓
Verification
```

### Recovery workflow

```text id="k2m8q4"
Recovery
   ↓
Verification
   ↓
Resolution
```

---

## Verification Sources

The primary verification source for a payment transaction is generally the payment provider's transaction information, where the provider exposes a suitable verification mechanism.

Conceptually:

```text id="n6q3m8"
SolydFlow
    ↓
Provider Verification
    ↓
Transaction Information
```

The exact verification mechanism varies by payment provider.

Some providers may expose transaction lookup APIs, while others may have provider-specific mechanisms for checking transaction status.

SolydFlow's provider integrations abstract these differences where supported.

---

## Provider-Specific Verification

Different payment providers may use different terminology, identifiers, APIs, and transaction states.

For example:

```text id="p8m3v6"
SolydFlow Transaction
        ↓
Provider Integration
        ↓
Provider-Specific API
        ↓
Provider Response
```

The provider integration is responsible for translating provider-specific information into the SolydFlow transaction model.

This allows the application to work with a consistent transaction representation rather than implementing provider-specific verification logic itself.

See:

[Payment Providers →](../payment-providers/overview.md)

---

## Transaction Identity

Verification requires identifying the transaction being checked.

A transaction may have identifiers associated with:

* The SolydFlow transaction
* The payment provider
* The payment attempt
* The customer
* The project

Conceptually:

```text id="r7k2m9"
SolydFlow Transaction
       │
       ├── Provider Identifier
       ├── Project
       └── Customer
```

The appropriate identifier depends on the provider integration.

The important principle is that verification must target the **correct existing transaction**.

---

## Verification Flow

A typical verification flow looks like:

```text id="w4q8n2"
Start
  ↓
Identify Transaction
  ↓
Request Provider State
  ↓
Receive Response
  ↓
Validate Response
  ↓
Map Provider State
  ↓
Resolve SolydFlow State
  ↓
Record Result
```

This separates provider-specific responses from the transaction state exposed to the application.

---

## Validate Before Trusting the Result

A verification response should not simply be accepted without checking that it corresponds to the expected transaction.

Conceptually:

```text id="k8m3p6"
Provider Response
       ↓
Validate Identity
       ↓
Validate Data
       ↓
Map State
```

For example, SolydFlow should establish that the provider response refers to the expected transaction rather than another transaction associated with the same customer.

---

## Verification and Webhooks

Webhooks and verification complement each other.

A webhook provides an event:

```text id="v2q7m4"
Provider
   ↓
Webhook
   ↓
SolydFlow
```

Verification provides another way to establish the provider's transaction state:

```text id="n8r3k5"
SolydFlow
   ↓
Provider
   ↓
Transaction State
```

Together:

```text id="x6m2q9"
Webhook ──────────┐
                  ├──→ Transaction State
Verification ─────┘
```

This is particularly useful when webhook delivery is unreliable.

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

## Verification After a Missing Webhook

Suppose the provider processed a payment successfully:

```text id="p3k8m5"
Provider
└── Successful
```

But SolydFlow did not receive the webhook:

```text id="r7q2n9"
Webhook
   X
```

The transaction may remain:

```text id="v4m8x3"
SolydFlow
└── Pending
```

Verification can resolve the difference:

```text id="n5k2q7"
Pending
   ↓
Verify
   ↓
Provider = Successful
   ↓
SolydFlow = Successful
```

This is a common recovery pattern.

---

## Verification After a Timeout

Consider:

```text id="q8m4r6"
Payment Request
       ↓
Provider
       ↓
Timeout
```

The application does not know whether the provider processed the transaction.

Verification should first locate the existing transaction:

```text id="x3n7k5"
Timeout
   ↓
Locate Existing Transaction
   ↓
Verify
```

If the provider reports success:

```text id="m6p2v8"
Successful
   ↓
Resolve Existing Transaction
```

If the provider reports failure:

```text id="k9r4q3"
Failed
   ↓
Resolve Existing Transaction
```

If the provider reports pending:

```text id="w7n2m5"
Pending
   ↓
Continue Monitoring / Recovery
```

---

## Verification and Transaction States

Verification provides evidence for determining the transaction state.

For example:

```text id="r4m8q2"
Current State
└── Pending

Provider Verification
└── Successful
```

The transaction can then transition to:

```text id="v6k3n9"
Pending
   ↓
Successful
```

Another example:

```text id="p8m2x7"
Current State
└── Pending

Provider Verification
└── Failed
```

The transaction can transition to:

```text id="q5n7r3"
Pending
   ↓
Failed
```

The exact state transition rules depend on the transaction state model.

See:

[Transaction States →](../concepts/transaction-states.md)

---

## Verification and Final States

A provider may indicate that a transaction has reached a final state.

For example:

```text id="m3q8v6"
Provider
└── Successful
```

SolydFlow can use this information to resolve the transaction.

Once a transaction has reached an appropriate final state, subsequent verification should not unnecessarily create new transaction effects.

Conceptually:

```text id="k7r2n4"
Successful
    ↓
Verify Again
    ↓
Still Successful
```

The operation should remain associated with the same transaction.

---

## Verification and Pending States

Not every verification produces an immediate final state.

For example:

```text id="x8m4q6"
Verify
  ↓
Provider
  ↓
Pending
```

The transaction may remain pending.

```text id="n5r7k2"
Pending
   ↓
Continue Monitoring
```

A pending result should therefore be treated differently from a verified failure.

---

## Verification and Recovery

Verification is a central component of recovery.

A simplified recovery workflow is:

```text id="q3m8v5"
Problem Detected
      ↓
Recovery
      ↓
Verification
      ↓
Transaction State
      ↓
Resolution
```

For example:

```text id="w7k2n4"
Zombie Transaction
      ↓
Verification
      ↓
Provider = Successful
      ↓
Resolve
```

See:

[Recovery Workflows →](../recover/recovery-workflows.md)

---

## Verification and Retries

Verification itself can fail temporarily.

For example:

```text id="r8m3q6"
Verification
      ↓
Provider
      ↓
Timeout
```

SolydFlow may retry the verification operation when appropriate:

```text id="v2k7n5"
Verification Timeout
       ↓
Backoff
       ↓
Retry Verification
       ↓
Provider Response
```

The retry applies to the verification request.

It does **not** automatically mean that the original payment should be attempted again.

See:

[Retries →](../recover/retries.md)

---

## Verification and Duplicate Payments

Verification is particularly important when a payment's outcome is unknown.

Consider:

```text id="p6n4q8"
Payment
  ↓
Timeout
  ↓
Unknown
```

Without verification:

```text id="x7m2r5"
Unknown
  ↓
New Payment
```

Potentially:

```text id="k3q8n6"
Customer
  ↓
Charged Twice
```

With verification:

```text id="m8r4v2"
Unknown
  ↓
Verify Existing Transaction
  ↓
Determine State
  ↓
Only Initiate Another Attempt If Appropriate
```

This is a core safety principle for payment recovery.

---

## Verification and Entitlements

The result of verification may affect the customer's entitlement.

For example:

```text id="q7m3k8"
Provider Verification
       ↓
Successful
       ↓
Transaction
       ↓
Entitlement
```

A failed transaction should not be treated as a successful purchase merely because a verification request was made.

The entitlement should follow the resolved transaction state.

See:

[Entitlements →](../concepts/entitlements.md)

---

## Verification and the Transaction Ledger

Verification results should be traceable in the transaction history.

For example:

```text id="n4x8m2"
Transaction
├── Created
├── Pending
├── Verification Requested
├── Provider Response
└── Successful
```

This allows the transaction record to explain how its state was established.

See:

[Transaction Ledger →](./transaction-ledger.md)

---

## Verification and State Mismatches

Verification is often triggered by a mismatch.

For example:

```text id="m7q3r9"
Provider
└── Successful

SolydFlow
└── Pending
```

Verification provides evidence that can help resolve the mismatch.

```text id="k2n8v4"
Mismatch
   ↓
Verify
   ↓
Provider State
   ↓
Resolve
```

See:

[State Mismatches →](./state-mismatches.md)

---

## Verification Does Not Mean Blindly Trusting One Response

A reliable verification process should consider the context of the transaction.

For example:

```text id="p8m4q2"
Provider Response
       ↓
Transaction Identity
       ↓
Provider State
       ↓
Existing SolydFlow State
       ↓
Resolution
```

The purpose is to produce a consistent transaction record, not simply copy a provider response into the application.

This becomes particularly important when multiple events or state changes have occurred.

---

## Example: Successful Verification

A transaction begins as:

```text id="x6q3m8"
Pending
```

Verification is requested:

```text id="r4n7k2"
Pending
   ↓
Verify Provider
```

The provider responds:

```text id="v8m3q5"
Successful
```

SolydFlow resolves the transaction:

```text id="m2k7r9"
Pending
   ↓
Successful
```

The resulting entitlement can then be updated according to the application's entitlement rules.

---

## Example: Failed Verification Result

A transaction begins as:

```text id="q5n8m3"
Pending
```

Verification returns:

```text id="k7r2x4"
Failed
```

The transaction can be resolved:

```text id="n3m8v6"
Pending
   ↓
Failed
```

The application can then handle the failed transaction according to its normal payment flow.

---

## Example: Still Pending

Verification returns:

```text id="p4q8m2"
Provider
└── Pending
```

SolydFlow should not convert this into a successful transaction simply because verification completed.

Instead:

```text id="x7m3n9"
Verification Complete
       ↓
Provider Still Pending
       ↓
Transaction Remains Pending
       ↓
Continue Monitoring / Recovery
```

This preserves the actual state reported by the provider.

---

## Example: Provider Unavailable

Verification cannot be completed:

```text id="r8k4m2"
Verify
  ↓
Provider
  X
Unavailable
```

This does not establish the transaction as failed.

Instead:

```text id="v3q7n5"
Verification Unavailable
       ↓
Retry / Recovery
       ↓
Verify Later
```

This distinction prevents temporary infrastructure failures from becoming incorrect transaction states.

---

## Verification Lifecycle

The overall verification lifecycle can be summarized as:

```text id="m5n8q3"
Transaction Requires Verification
             ↓
       Identify Transaction
             ↓
       Request Provider State
             ↓
          Validate
             ↓
        Interpret Result
             ↓
    ┌────────┼────────┐
    ↓        ↓        ↓
Successful Pending  Failed
    ↓        ↓        ↓
 Resolve   Monitor  Resolve
    └────────┼────────┘
             ↓
        Record Result
```

---

## Key Principles

When verifying transactions, SolydFlow should follow these principles:

### 1. Verify the existing transaction

Do not create a new payment simply because the original result is uncertain.

### 2. Verify before retrying uncertain payment operations

A timeout does not prove that the payment failed.

### 3. Validate transaction identity

Make sure the provider response belongs to the transaction being verified.

### 4. Distinguish pending from failed

A transaction that remains pending has not necessarily failed.

### 5. Keep verification separate from payment creation

Verification determines what happened; it does not create another payment.

### 6. Record verification activity

The transaction history should provide visibility into how the state was established.

---

## The Core Principle

> **Verification turns transaction uncertainty into evidence.**

The workflow is:

```text id="q8m3r5"
Unknown
  ↓
Verify
  ↓
Evidence
  ↓
Transaction State
  ↓
Reliable Revenue Record
```

This makes verification a foundational component of SolydFlow Truth and a critical part of reliable payment recovery.

---

## Related Documentation

### Truth

[Truth Overview →](./overview.md)

[Consensus Engine →](./consensus-engine.md)

[Transaction Ledger →](./transaction-ledger.md)

[State Mismatches →](./state-mismatches.md)

[Reconciliation →](./reconciliation.md)

### Recovery

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

[Recovery Workflows →](../recover/recovery-workflows.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

### Payment Providers

[Payment Providers Overview →](../payment-providers/overview.md)

