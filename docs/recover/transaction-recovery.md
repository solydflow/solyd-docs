# Transaction Recovery

Transaction recovery is the process of resolving a payment transaction when the expected payment lifecycle has not completed normally.

A transaction can become unresolved for many reasons:

* A provider response is delayed
* A webhook is not received
* A provider temporarily becomes unavailable
* A payment remains pending
* The provider and SolydFlow report different states
* A payment succeeds but the application does not receive the expected confirmation

SolydFlow Recover provides the infrastructure for handling these situations without requiring every application to implement its own provider-specific recovery logic.

```text
Payment
   ↓
Transaction
   ↓
Unexpected / Incomplete State
   ↓
Recovery
   ↓
Verification
   ↓
Resolved Transaction
   ↓
Entitlement
```

---

## Why Transaction Recovery Is Necessary

Payment systems are distributed systems.

A payment may pass through several components before the application can safely grant access:

```text
Customer
   ↓
Application
   ↓
SolydFlow
   ↓
Payment Provider
   ↓
Payment Network
   ↓
Provider
   ↓
SolydFlow
   ↓
Application
```

Any part of this flow can experience delay or temporary failure.

For example:

```text
Customer
   ↓
Payment Provider
   ↓
Payment Successful
   ↓
Webhook
   X
```

The customer may have successfully paid while SolydFlow is still waiting for confirmation.

Without recovery, the transaction may remain:

```text
Pending
```

even though the actual provider-side state is:

```text
Successful
```

---

## The Recovery Principle

Transaction recovery should not assume that an unresolved transaction is either successful or failed.

Instead, SolydFlow should determine what actually happened.

```text
Unresolved Transaction
        ↓
     Investigate
        ↓
    Verify State
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
Paid  Pending Failed
 ↓      ↓      ↓
Resolve Continue Resolve
```

The goal is to move the transaction from uncertainty to a reliable state.

---

## Typical Recovery Flow

A simplified transaction recovery flow is:

```text
Transaction Created
       ↓
Payment Initiated
       ↓
Provider Processing
       ↓
Expected Completion
       ↓
      Event?
     /     \
   Yes      No
    ↓        ↓
Process    Recovery
 Event        ↓
    ↓      Verify
    ↓        ↓
    └────┬───┘
         ↓
   Resolve Transaction
         ↓
      Entitlement
```

The exact recovery process depends on the payment provider and the reason the transaction became unresolved.

---

## Detecting a Transaction That Needs Recovery

Not every pending transaction should immediately enter recovery.

A transaction may legitimately remain pending while the provider is processing it.

For example:

```text
Payment Started
      ↓
Provider Processing
      ↓
Pending
      ↓
Provider Completing
      ↓
Successful
```

Recovery becomes relevant when the transaction does not progress as expected.

Possible signals include:

* An expected event is missing
* A transaction remains pending beyond an expected period
* A provider operation failed
* The provider and SolydFlow states disagree
* A transaction has stopped progressing
* A recovery workflow has explicitly been triggered

The recovery system should therefore distinguish between **normal processing** and **abnormal inactivity**.

---

## Recovery Does Not Mean Immediate Retry

A common mistake is to treat every unresolved transaction as a reason to start another payment attempt.

That can create duplicate charges.

For example:

```text
Original Payment
      ↓
Provider Processing
      ↓
Response Delayed
      ↓
Application
      ↓
Starts Second Payment
```

The customer could potentially be charged twice.

Instead:

```text
Original Transaction
       ↓
Uncertain
       ↓
Verify Existing Transaction
       ↓
Determine Actual State
```

Only when the existing transaction is determined to be unsuccessful should another payment attempt be considered.

---

## Provider Verification

Recovery should use the strongest available evidence to determine transaction state.

Conceptually:

```text
SolydFlow Transaction
        ↓
Provider Verification
        ↓
Provider State
        ↓
SolydFlow State
        ↓
Resolved State
```

For example:

```text
SolydFlow
└── Pending

Provider
└── Successful
```

The recovery process can use the provider's transaction information to resolve the application-facing state.

See:

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Recovery After a Missing Webhook

One of the most common recovery situations is a missing provider event.

```text
Provider
   ↓
Payment Successful
   ↓
Webhook
   X
```

SolydFlow may detect that the transaction has not progressed as expected.

```text
Transaction
   ↓
Expected Event Missing
   ↓
Recovery
   ↓
Provider Verification
   ↓
Successful
```

The transaction can then continue through the normal entitlement process.

See:

**[Failed Webhooks →](./failed-webhooks.md)**

---

## Recovery of Pending Transactions

A pending transaction should not automatically be considered failed.

For example:

```text
Transaction
    ↓
Pending
    ↓
Provider Still Processing
```

SolydFlow can allow the transaction to remain pending while the provider completes its operation.

If the transaction exceeds the expected processing conditions:

```text
Pending
   ↓
No Progress
   ↓
Recovery
   ↓
Verification
```

The result may be:

```text
Successful
```

or:

```text
Failed
```

or, depending on the provider and available information, the transaction may remain unresolved until more information becomes available.

---

## Recovery and Zombie Transactions

Some transactions remain in an intermediate state longer than expected.

For example:

```text
Payment Started
      ↓
Pending
      ↓
No Event
      ↓
No Progress
      ↓
Zombie Transaction
```

These transactions require a different recovery strategy from ordinary pending payments.

SolydFlow can identify such transactions and route them through the appropriate recovery workflow.

See:

**[Zombie Transactions →](./zombie-transactions.md)**

---

## Recovery and Retries

Some recovery situations can be resolved by retrying a failed operation.

For example:

```text
Provider Request
      ↓
Temporary Failure
      ↓
Retry
      ↓
Success
```

However, retries should be applied to operations that are safe to retry.

A retry should not blindly create another customer charge.

```text
Safe:

Verification Request
      ↓
Retry
```

is different from:

```text
Potentially Dangerous:

Charge Customer
      ↓
Retry
      ↓
Second Charge
```

SolydFlow's retry strategy should therefore distinguish between recoverable operations and payment operations where duplication is possible.

See:

**[Retries →](./retries.md)**

---

## Recovery and Transaction State

Recovery exists to help a transaction move toward a reliable state.

For example:

```text
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Successful
```

Or:

```text
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Failed
```

The recovery process should not invent a state.

It should derive the resulting state from available transaction and provider information.

See:

**[Transaction States →](../concepts/transaction-states.md)**

---

## Recovery and Entitlements

A recovered transaction may affect the customer's entitlement.

For example:

```text
Transaction
   ↓
Recovery
   ↓
Verification
   ↓
Successful
   ↓
Package
   ↓
Entitlement
   ↓
Premium Access
```

If the transaction is determined to have failed:

```text
Transaction
   ↓
Recovery
   ↓
Verification
   ↓
Failed
   ↓
No New Entitlement
```

The transaction state should therefore be resolved before the application makes a durable access decision.

See:

**[Entitlements →](../concepts/entitlements.md)**

---

## Recovery and Existing Entitlements

Recovery should also account for the customer's existing entitlement state.

For example, a customer may already have access when a renewal transaction becomes temporarily unresolved.

```text
Existing Entitlement
        ↓
Renewal Transaction
        ↓
Pending
        ↓
Recovery
```

The application should not necessarily remove access simply because a transaction is temporarily unresolved.

The appropriate behavior depends on the transaction type, entitlement rules, and final provider state.

---

## Recovery and Multiple Providers

Different payment providers can have different transaction models.

For example:

```text
                 SolydFlow
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     Paystack    Flutterwave    Stripe
        │            │            │
     Provider     Provider      Provider
      State        State         State
        └────────────┼────────────┘
                     ↓
              Recovery Layer
                     ↓
              SolydFlow State
```

The application should not need to implement a separate recovery architecture for every provider.

SolydFlow provides the common recovery layer while provider-specific behavior remains inside the integration.

---

## Recovery and the Transaction Ledger

A recovered transaction should leave an understandable record of what happened.

For example:

```text
Transaction
├── Created
├── Pending
├── Recovery Triggered
├── Provider Verified
└── Successful
```

This history is useful for:

* Debugging
* Customer support
* Reconciliation
* Auditing
* Understanding payment failures

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

**[Audit Logs →](../security/audit-logs.md)**

---

## Recovery and Reconciliation

Recovery and reconciliation solve related but different problems.

**Recovery** focuses on resolving an individual transaction that has not completed normally.

**Reconciliation** focuses on ensuring that transaction records agree across systems.

For example:

```text
Recovery

Transaction
   ↓
Verify
   ↓
Resolve
```

while:

```text
Reconciliation

Provider Records
      +
SolydFlow Records
      ↓
Compare
      ↓
Identify Differences
      ↓
Resolve
```

A recovered transaction can subsequently become part of the reconciliation process.

See:

**[Reconciliation →](../truth/reconciliation.md)**

---

## Recovery and Duplicate Events

Payment providers may sometimes deliver the same event more than once.

For example:

```text
Provider
   ↓
Payment Successful
   ↓
Webhook
   ↓
Webhook Again
```

Recovery and event processing must therefore avoid treating duplicate notifications as separate payments.

Conceptually:

```text
Provider Event
      ↓
Identify Transaction
      ↓
Check Existing State
      ↓
Process Safely
```

The objective is to make the transaction lifecycle resilient to repeated provider notifications.

See:

**[Event Handling →](../webhooks/event-handling.md)**

---

## Recovery and Provider Outages

A provider may temporarily become unavailable.

For example:

```text
Application
    ↓
SolydFlow
    ↓
Provider
    X
Unavailable
```

The correct response depends on what operation failed.

For some operations:

```text
Temporary Failure
      ↓
Retry
```

For others:

```text
Temporary Failure
      ↓
Wait
      ↓
Verify Later
```

The system should avoid interpreting provider unavailability as proof that the customer's payment failed.

See:

**[Retries →](./retries.md)**

---

## Recovery Workflow Example

Consider a customer who completes a payment but the provider webhook does not reach SolydFlow.

### Initial transaction

```text
Customer
   ↓
Payment Provider
   ↓
Payment Successful
```

### Expected notification

```text
Provider
   ↓
Webhook
   X
```

### SolydFlow detects the problem

```text
Transaction
   ↓
Still Pending
   ↓
Recovery Triggered
```

### Verification

```text
Recovery
   ↓
Provider Verification
   ↓
Provider: Successful
```

### Resolution

```text
Transaction
   ↓
Successful
   ↓
Entitlement
   ↓
Customer Access
```

The customer does not need to repeat the purchase.

---

## Recovery Workflow Example: Failed Payment

A different transaction may genuinely fail.

```text
Customer
   ↓
Payment Provider
   ↓
Payment Failed
```

SolydFlow should not attempt to turn this into a successful transaction.

Instead:

```text
Transaction
   ↓
Recovery / Verification
   ↓
Failed
```

The application can then allow the customer to try again.

```text
Failed
   ↓
Customer Retry
   ↓
New Payment Attempt
```

This keeps the original transaction and the new payment attempt distinct.

---

## Recovery Workflow Example: Unknown State

Sometimes the available information may not immediately establish whether the payment succeeded.

```text
Transaction
   ↓
Provider Unavailable
   ↓
State Unknown
```

The system should avoid prematurely declaring success or failure.

```text
Unknown
   ↓
Retry / Wait / Verify
   ↓
More Information
   ↓
Resolved State
```

This is particularly important when the customer may already have been charged.

---

## Recovery Boundaries

Recovery should have clear boundaries.

It should not:

* Invent payment success
* Assume a missing webhook means failure
* Assume a missing webhook means success
* Automatically duplicate a customer charge
* Grant permanent access based solely on an unverified client-side event
* Hide unresolved transactions from the transaction record

Instead, recovery should:

* Detect incomplete flows
* Gather available evidence
* Retry safe operations
* Verify provider state
* Resolve transactions when sufficient evidence exists
* Preserve transaction history

---

## Application Responsibilities

SolydFlow handles the infrastructure around transaction recovery, but the application still needs to integrate with the SolydFlow transaction and entitlement model correctly.

The application should:

* Listen for the appropriate SolydFlow transaction state
* Avoid granting access based solely on client-side payment initiation
* Treat transaction state as authoritative for access decisions
* Handle pending states appropriately
* Respond to entitlement changes
* Provide appropriate customer messaging

Conceptually:

```text
Payment UI
    ↓
SolydFlow
    ↓
Transaction
    ↓
Recovery
    ↓
Verified State
    ↓
Entitlement
    ↓
Application
```

---

## Key Principle

> **Transaction recovery is about resolving uncertainty, not simply retrying payments.**

The safest recovery strategy is:

```text
Detect
  ↓
Investigate
  ↓
Verify
  ↓
Resolve
  ↓
Update Entitlement
```

rather than:

```text
Something went wrong
       ↓
Charge Again
```

This distinction helps prevent duplicate charges while ensuring successful customers receive the access they paid for.

