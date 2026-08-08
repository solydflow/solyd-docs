# Recovery Workflows

Payment failures are not always final failures.

A transaction may become unresolved because a provider is temporarily unavailable, a webhook is missed, a request times out, or the application does not receive the expected confirmation.

SolydFlow Recover provides workflows for detecting these situations, verifying what happened, and bringing transactions back into a reliable state.

```text id="w7m3q8"
Payment
   ↓
Transaction
   ↓
Expected Progress
   ↓
 ┌───────────────┐
 │               │
Normal          Problem
 │               │
 ↓               ↓
Resolved       Recovery
                 ↓
              Verify
                 ↓
              Resolve
```

---

## What Is a Recovery Workflow?

A recovery workflow is a controlled sequence of operations used to resolve a transaction or payment-related operation that did not complete as expected.

A typical workflow is:

```text id="p4n8v2"
Detect
  ↓
Investigate
  ↓
Verify
  ↓
Recover
  ↓
Resolve
  ↓
Update
```

The exact workflow depends on what went wrong.

For example:

```text id="x6q2m9"
Failed Webhook
      ↓
Provider Verification
      ↓
Transaction Update
```

while:

```text id="r8k3v5"
Temporary Provider Failure
      ↓
Backoff
      ↓
Retry
      ↓
Verification
```

---

## Why Recovery Needs a Workflow

A payment system should not react to every failure in exactly the same way.

Consider these situations:

```text id="n5m7q2"
Webhook Missing
```

```text id="v3p8k6"
Provider Temporarily Unavailable
```

```text id="q7r4x9"
Transaction Stuck
```

```text id="k2m6n8"
Verification Request Timed Out
```

Each situation requires a different response.

A recovery workflow provides a predictable way to determine:

* What happened
* What operation should be performed
* Whether the operation is safe to retry
* Whether provider verification is required
* What state the transaction should enter
* Whether the customer entitlement should change

---

# The General Recovery Model

SolydFlow's recovery model can be understood as:

```text id="m8q3v7"
                Problem
                   ↓
                Detect
                   ↓
              Identify Cause
                   ↓
             Choose Workflow
                   ↓
          ┌────────┼────────┐
          ↓        ↓        ↓
       Verify    Retry    Recover
          │        │        │
          └────────┼────────┘
                   ↓
                Resolve
                   ↓
             Update Records
                   ↓
               Entitlement
```

The system should avoid making assumptions when the actual transaction state can be verified.

---

# Workflow 1: Missing Webhook

A payment provider may successfully process a transaction but fail to deliver the corresponding webhook.

```text id="c7m2q9"
Customer
   ↓
Payment
   ↓
Provider
   ↓
Successful
```

The expected webhook does not arrive:

```text id="f4n8x3"
Provider
   ↓
Webhook
   X
SolydFlow
```

SolydFlow may still have:

```text id="p6r2m7"
Transaction
└── Pending
```

The recovery workflow becomes:

```text id="v8k3n5"
Webhook Missing
      ↓
Detect
      ↓
Find Transaction
      ↓
Verify Provider State
      ↓
Successful
      ↓
Update Transaction
      ↓
Grant / Update Entitlement
```

The missing webhook is therefore treated as a synchronization problem rather than automatically as a failed payment.

See:

**[Failed Webhooks →](./failed-webhooks.md)**

---

# Workflow 2: Zombie Transaction

A transaction may remain pending without expected progress.

```text id="q3m7x8"
Transaction
   ↓
Pending
   ↓
No Expected Progress
   ↓
Zombie Candidate
```

The recovery workflow is:

```text id="n6k2r4"
Zombie Candidate
      ↓
Investigate
      ↓
Provider Verification
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
Paid Pending Failed
```

The result determines what happens next.

If successful:

```text id="w5p8m3"
Successful
   ↓
Update Transaction
   ↓
Entitlement
```

If still pending:

```text id="r2q7n6"
Still Pending
   ↓
Continue Monitoring
   ↓
Recovery Later
```

If failed:

```text id="x4m8k2"
Failed
   ↓
Resolve Transaction
```

See:

**[Zombie Transactions →](./zombie-transactions.md)**

---

# Workflow 3: Temporary Provider Failure

A provider may be temporarily unavailable.

```text id="k7n3q5"
SolydFlow
   ↓
Provider
   X
Unavailable
```

The system should distinguish temporary unavailability from a permanent failure.

A typical workflow is:

```text id="m4r8x2"
Provider Unavailable
       ↓
Classify Failure
       ↓
Retryable?
       ↓
Backoff
       ↓
Retry
       ↓
Provider Available
       ↓
Verify
       ↓
Resolve
```

The transaction should not be marked failed merely because the provider was temporarily unreachable.

---

# Workflow 4: Verification Timeout

A verification request may itself fail.

```text id="p8q4m7"
Verify Transaction
       ↓
Provider
       ↓
Timeout
```

A safe workflow is:

```text id="v3n6x8"
Verification Timeout
       ↓
Retry Verification
       ↓
Provider Response
       ↓
Resolve
```

The retry applies to the **verification operation**, not necessarily to the original payment.

This distinction helps prevent duplicate charges.

See:

**[Retries →](./retries.md)**

---

# Workflow 5: Payment Request Timeout

A payment request can time out before the application knows whether the provider accepted it.

For example:

```text id="q6m2r9"
Application
    ↓
Payment Request
    ↓
Provider
    ↓
Timeout
```

At this point, the outcome may be unknown.

The system should avoid immediately creating another payment.

Instead:

```text id="n4k8x3"
Payment Timeout
      ↓
Locate Existing Transaction
      ↓
Verify Provider
      ↓
 ┌─────────────┐
 ↓             ↓
Successful    Not Successful
 ↓             ↓
Resolve       New Attempt
```

This is one of the most important payment recovery scenarios.

---

# Workflow 6: Webhook Processing Failure

A webhook may arrive but fail while being processed.

```text id="x7m3p8"
Provider
   ↓
Webhook
   ↓
SolydFlow
   ↓
Processing
   X
```

The event can be retried safely when the processing operation is designed to handle duplicate delivery.

```text id="r5q8n2"
Processing Failure
       ↓
Retry Event
       ↓
Process
       ↓
Transaction Update
```

The original event remains the same event.

The retry should not create a new payment transaction.

---

# Workflow 7: Duplicate Webhook

A provider may deliver the same webhook more than once.

```text id="m2n7q4"
Webhook A
   ↓
SolydFlow

Webhook A
   ↓
SolydFlow
```

The recovery and event-processing logic should associate both deliveries with the same underlying event or transaction.

```text id="k8x3p6"
Webhook A ──┐
            ├──→ Same Transaction
Webhook A ──┘
```

The desired result is:

```text id="v4r7m9"
One Payment
      ↓
One Transaction
      ↓
Correct Final State
```

rather than:

```text id="q6m2n8"
One Payment
      ↓
Duplicate Transaction Effects
```

See:

**[Event Handling →](../webhooks/event-handling.md)**

---

# Workflow 8: Provider Returns a Successful Transaction

Suppose SolydFlow has:

```text id="n7q3m5"
Transaction
└── Pending
```

Provider verification returns:

```text id="x4k8r2"
Provider
└── Successful
```

The recovery workflow is:

```text id="m6p2v9"
Pending
  ↓
Verify
  ↓
Provider = Successful
  ↓
Transaction = Successful
  ↓
Entitlement
```

The application can then rely on the resolved transaction state.

---

# Workflow 9: Provider Returns a Failed Transaction

If provider verification returns a failed transaction:

```text id="w8n4q6"
Pending
  ↓
Verify
  ↓
Provider = Failed
  ↓
Transaction = Failed
```

The transaction should be resolved according to the provider's verified result.

The system should not continue retrying a payment that the provider has definitively determined to have failed unless a new payment attempt is intentionally initiated.

---

# Workflow 10: Provider Still Shows Pending

Provider verification may return another intermediate state.

```text id="p3m7x8"
SolydFlow
└── Pending

Provider
└── Pending
```

This does not necessarily require an immediate failure.

A possible workflow is:

```text id="k5q2n9"
Pending
  ↓
Verify
  ↓
Provider Still Pending
  ↓
Continue Monitoring
  ↓
Recovery Later
```

This keeps the transaction aligned with the evidence available from the provider.

---

# Workflow 11: Provider Is Unavailable During Recovery

A recovery attempt may itself encounter a provider outage.

```text id="r8m3q7"
Recovery
   ↓
Provider Verification
   X
Provider Unavailable
```

The workflow can become:

```text id="v4n7k2"
Provider Unavailable
       ↓
Backoff
       ↓
Retry
       ↓
Verification
       ↓
Resolve
```

The important distinction is:

```text id="m6q8x3"
Provider Unavailable
        ≠
Payment Failed
```

---

# Workflow 12: Recovery Exhausted

A recovery operation may reach its configured retry limit without resolving the transaction.

```text id="q7m4n8"
Recovery
   ↓
Retry
   ↓
Retry
   ↓
Retry
   ↓
Maximum Attempts
```

At this point, the system should stop automatically retrying that operation.

The transaction may remain unresolved:

```text id="x3k8p6"
Recovery Exhausted
      ↓
Requires Further Handling
```

The important thing is that the transaction remains visible and traceable.

It should not silently disappear from the system.

---

# Recovery and Transaction States

Recovery should work with the transaction state model rather than bypassing it.

For example:

```text id="n8q3m5"
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Successful
```

or:

```text id="v7k2r9"
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Failed
```

Recovery does not mean:

```text id="q4m8x2"
Recovery
   ↓
Successful
```

Recovery is the process used to **determine** the correct state.

---

# Recovery and Entitlements

Transaction recovery should ultimately feed into entitlement management.

For example:

```text id="p5n8q3"
Payment
   ↓
Transaction
   ↓
Recovery
   ↓
Verified Successful
   ↓
Entitlement
   ↓
Access
```

If the transaction is verified as failed:

```text id="m7x2k9"
Transaction
   ↓
Recovery
   ↓
Verified Failed
   ↓
No Successful Entitlement
```

The exact entitlement behavior depends on the application's entitlement model.

See:

**[Entitlements →](../concepts/entitlements.md)**

---

# Recovery and the Transaction Ledger

Recovery should preserve the history of what happened.

For example:

```text id="r3q8m5"
Transaction
├── Created
├── Pending
├── Webhook Missing
├── Recovery Started
├── Provider Verified
└── Successful
```

This history helps explain why a transaction reached its current state.

It can be useful for:

* Customer support
* Debugging
* Reconciliation
* Auditing
* Operational monitoring

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

---

# Recovery and Reconciliation

Recovery resolves individual transaction uncertainty.

Reconciliation addresses differences across records.

For example:

```text id="k6m3x8"
Provider
└── Successful

SolydFlow
└── Pending
```

Recovery may resolve the transaction:

```text id="v8q2n5"
Provider
└── Successful

SolydFlow
└── Successful
```

Reconciliation can then verify that the broader records are consistent.

```text id="n4r7m9"
Recovery
   ↓
Resolved Transaction
   ↓
Ledger
   ↓
Reconciliation
```

See:

**[Reconciliation →](../truth/reconciliation.md)**

---

# Recovery Workflow Decision Model

A simplified decision model looks like this:

```text id="m8q3v6"
Something Went Wrong
        ↓
What Happened?
        ↓
 ┌──────┼──────────┬──────────┐
 ↓      ↓          ↓          ↓
Webhook Timeout  Zombie   Provider Error
 ↓      ↓          ↓          ↓
Recover Retry    Verify     Classify
 └──────┴──────────┴──────────┘
                ↓
             Resolve
```

The key is to identify the failure before choosing the recovery action.

---

# Recovery Should Be Evidence-Based

Recovery should not guess the final transaction state.

For example:

```text id="q5m8x2"
Webhook Missing
```

does not prove:

```text id="p3n7k9"
Failed
```

Likewise:

```text id="v6r2m8"
Request Timeout
```

does not prove:

```text id="x4q7n3"
Not Charged
```

The system should seek evidence:

```text id="k8m3r5"
Unknown
  ↓
Verify
  ↓
Evidence
  ↓
Resolved State
```

This principle is central to reliable payment recovery.

---

# Recovery Should Be Idempotent

Recovery operations may themselves be retried.

Therefore, recovery should avoid producing additional side effects when the same recovery operation is executed more than once.

For example:

```text id="n7q4m2"
Recovery Attempt
       ↓
Transaction Verification
       ↓
Successful
```

If the recovery workflow runs again:

```text id="w3k8p6"
Recovery Attempt Again
       ↓
Same Transaction
       ↓
Already Resolved
```

It should not create another transaction or duplicate entitlement.

---

# Recovery Should Be Observable

A recovery system needs visibility into what it is doing.

A useful recovery history may include:

```text id="r6m2q8"
Recovery Started
       ↓
Reason
       ↓
Operation
       ↓
Attempt
       ↓
Provider Response
       ↓
Result
```

This helps developers understand why a transaction was recovered and whether the workflow succeeded.

---

# Recovery Does Not Replace the Payment Provider

SolydFlow does not become the source of truth for the provider's internal payment processing simply because it performs recovery.

The provider remains responsible for processing the underlying payment.

SolydFlow's role is to help the application:

```text id="x8n4m7"
Connect
   ↓
Track
   ↓
Recover
   ↓
Verify
   ↓
Resolve
```

across the payment lifecycle.

---

# A Complete Recovery Example

Consider a customer purchasing a package.

### Step 1 — Payment starts

```text id="m3q7v9"
Customer
   ↓
Payment
   ↓
Provider
```

### Step 2 — Provider processes payment

```text id="k8n2r5"
Provider
   ↓
Successful
```

### Step 3 — Webhook fails

```text id="p4m7x8"
Provider
   ↓
Webhook
   X
```

### Step 4 — Transaction remains pending

```text id="v6q3n9"
SolydFlow
└── Pending
```

### Step 5 — Recovery detects the problem

```text id="r2m8k5"
Pending
   ↓
Expected Event Missing
   ↓
Recovery
```

### Step 6 — Provider is verified

```text id="n7x4q3"
Provider
└── Successful
```

### Step 7 — Transaction is resolved

```text id="w5m8p2"
Transaction
└── Successful
```

### Step 8 — Entitlement is updated

```text id="q3k7n9"
Successful Transaction
       ↓
Package
       ↓
Entitlement
       ↓
Customer Access
```

The customer does not need to make another payment simply because the webhook failed.

---

# Another Example: Unknown Payment Result

Consider a payment request that times out.

```text id="m6r2x8"
Payment Request
       ↓
Provider
       ↓
Timeout
```

The result is unknown.

SolydFlow should:

```text id="v8n4q3"
Timeout
  ↓
Find Transaction
  ↓
Verify Provider
```

If successful:

```text id="k5m7p2"
Successful
   ↓
Resolve
   ↓
Entitlement
```

If failed:

```text id="x3q8n6"
Failed
   ↓
Resolve
```

If still pending:

```text id="r7m2k9"
Pending
   ↓
Continue Recovery
```

This prevents the application from blindly creating a second charge.

---

# Recovery Workflow Summary

The major recovery scenarios can be summarized as:

| Problem                   | Primary Response                           |
| ------------------------- | ------------------------------------------ |
| Missing webhook           | Verify transaction                         |
| Failed webhook processing | Retry event processing                     |
| Zombie transaction        | Investigate and verify                     |
| Temporary provider error  | Backoff and retry                          |
| Verification timeout      | Retry verification                         |
| Unknown payment result    | Verify existing transaction                |
| Duplicate webhook         | Idempotent event handling                  |
| Provider outage           | Backoff and recover later                  |
| Retry exhaustion          | Stop and flag for further handling         |
| Verified success          | Resolve transaction and update entitlement |
| Verified failure          | Resolve transaction as failed              |
| Still pending             | Continue monitoring                        |

---

# The Recovery Principle

SolydFlow Recover is built around one fundamental idea:

> **When payment processing does not go as expected, the system should recover from uncertainty instead of forcing the application to guess.**

The general workflow is:

```text id="q8m3v5"
       Detect
         ↓
     Understand
         ↓
       Verify
         ↓
      Recover
         ↓
      Resolve
         ↓
       Update
```

This allows payment infrastructure to remain resilient even when individual components fail.
