# Zombie Transactions

A zombie transaction is a transaction that remains in an intermediate or unresolved state even though the transaction is no longer progressing normally.

The transaction may not be clearly successful or failed from the application's perspective, while the underlying payment provider may already have additional information about what happened.

```text
Payment
   ↓
Transaction
   ↓
Pending
   ↓
No Expected Progress
   ↓
Zombie Transaction
   ↓
Recovery
   ↓
Verification
   ↓
Resolved State
```

Zombie transactions are particularly important because they can create a gap between **what the customer experienced** and **what the application knows**.

---

## What Makes a Transaction a Zombie?

A transaction can become a zombie when it remains in an intermediate state beyond the period in which normal progress is expected.

For example:

```text
Payment Started
      ↓
Pending
      ↓
Provider Processing
      ↓
        X
   No Progress
```

The transaction still exists, but nothing appears to be moving it toward a final state.

This is different from an ordinary pending transaction.

### Normal pending transaction

```text
Pending
   ↓
Provider Processing
   ↓
Successful
```

### Zombie transaction

```text
Pending
   ↓
No Progress
   ↓
No Expected Event
   ↓
Zombie
```

The distinction is important because a legitimate payment may need time to complete.

---

## Why Zombie Transactions Matter

A stuck transaction can affect both the customer and the application.

For example:

```text
Customer
   ↓
Completes Payment
   ↓
Payment Provider
   ↓
Transaction Exists
   ↓
Application
   ↓
Still Pending
```

The customer may believe they have paid successfully while the application continues to show an incomplete purchase.

This can lead to:

* Customers paying again
* Duplicate payment attempts
* Missing entitlements
* Support requests
* Revenue discrepancies
* Manual investigation
* Inconsistent transaction records

Recovery helps reduce these problems.

---

## Zombie Transactions Are Not Automatically Failed

A zombie transaction should not automatically be marked as failed simply because it has been inactive for a while.

For example:

```text
Pending
   ↓
No Recent Event
```

does not necessarily mean:

```text
Failed
```

The provider may still have a successful or processing transaction.

Instead, the transaction should enter a recovery process:

```text
Zombie Candidate
      ↓
Investigate
      ↓
Verify
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
Paid Pending Failed
```

The resulting state depends on the evidence available from the payment provider and SolydFlow.

---

## Detecting Zombie Transactions

Detection requires more than simply checking whether a transaction is pending.

SolydFlow can consider signals such as:

* How long the transaction has remained in its current state
* Whether expected provider events were received
* Whether the transaction has shown any progress
* Whether recovery has already been attempted
* Whether provider information is available
* Whether the transaction has an associated entitlement
* Whether the transaction has entered an abnormal lifecycle pattern

Conceptually:

```text
Transaction
     ↓
Current State
     ↓
Time in State
     ↓
Expected Progress?
     ↓
 ┌───┴───┐
Yes      No
 ↓        ↓
Continue  Recovery
```

The exact detection rules can vary depending on the provider and transaction type.

---

## Pending vs Zombie

These states should not be treated as identical.

| Situation          | Meaning                                                      |
| ------------------ | ------------------------------------------------------------ |
| Pending            | The transaction may still be progressing normally            |
| Zombie candidate   | The transaction has remained unresolved longer than expected |
| Zombie transaction | The transaction requires recovery or further investigation   |
| Successful         | The transaction has been verified as successful              |
| Failed             | The transaction has been determined to have failed           |

A simplified lifecycle is:

```text
Pending
   ↓
Expected Progress
   │
   └──────────────→ Successful

Pending
   ↓
No Expected Progress
   ↓
Zombie Candidate
   ↓
Recovery
```

---

## The Zombie Transaction Recovery Flow

A typical recovery process looks like this:

```text
Pending Transaction
       ↓
Monitor Progress
       ↓
No Expected Progress
       ↓
Zombie Detection
       ↓
Recovery
       ↓
Provider Verification
       ↓
Transaction Resolution
```

The resolution may result in:

```text
Successful
```

```text
Failed
```

or:

```text
Still Pending
```

If the transaction remains unresolved, it may require another recovery attempt or continued monitoring.

---

## Provider Verification

The most important step in recovering a zombie transaction is determining what happened at the payment provider.

For example:

```text
SolydFlow
└── Pending

Provider
└── Successful
```

The recovery process can use the provider's transaction information to establish that the payment has completed.

```text
Zombie Transaction
       ↓
Provider Verification
       ↓
Successful
       ↓
Entitlement
```

Alternatively:

```text
Zombie Transaction
       ↓
Provider Verification
       ↓
Failed
```

The recovery process should rely on evidence rather than assumptions.

See:

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Missing Webhooks and Zombie Transactions

A missing webhook is one way a transaction can become a zombie.

For example:

```text
Customer
   ↓
Provider
   ↓
Payment Successful
   ↓
Webhook
   X
```

From the application's perspective:

```text
Transaction
└── Pending
```

If the expected event never arrives, the transaction may eventually become a zombie candidate.

```text
Pending
   ↓
Expected Event Missing
   ↓
Zombie Candidate
   ↓
Recovery
```

See:

**[Failed Webhooks →](./failed-webhooks.md)**

---

## Zombie Transactions and Recovery

Recovery should provide a controlled way to move zombie transactions back into the normal transaction lifecycle.

```text
Zombie
   ↓
Recovery
   ↓
Verification
   ↓
 ┌─────────────┐
 ↓      ↓      ↓
Success Pending Failed
```

A successful recovery returns the transaction to a reliable state.

For example:

```text
Zombie
  ↓
Verify
  ↓
Successful
  ↓
Entitlement Granted
```

---

## Zombie Transactions and Retries

Not every zombie transaction requires a retry.

For example, if the provider already processed the payment, retrying the original charge could create a duplicate payment.

```text
Provider
└── Already Paid

Application
└── Still Pending
```

The correct action is:

```text
Verify Existing Transaction
```

rather than:

```text
Charge Customer Again
```

Retries are more appropriate for safe operations such as retrieving information or repeating a failed non-charge operation.

See:

**[Retries →](./retries.md)**

---

## Avoiding Duplicate Charges

Zombie transaction recovery should prioritize determining the state of the existing transaction.

For example:

```text
Existing Transaction
       ↓
Uncertain
       ↓
Verify
       ↓
 ┌─────┴─────┐
 ↓           ↓
Paid       Not Paid
 ↓           ↓
Resolve     New Attempt
```

This prevents the application from treating an uncertain transaction as a reason to immediately create another payment.

---

## Zombie Transactions and Entitlements

A zombie transaction may have an entitlement associated with it, or it may not yet have produced one.

For example:

```text
Zombie Transaction
       ↓
Provider Verification
       ↓
Successful
       ↓
Package
       ↓
Entitlement
```

If the transaction is determined to have failed:

```text
Zombie Transaction
       ↓
Provider Verification
       ↓
Failed
       ↓
No Successful Entitlement
```

The entitlement decision should follow the verified transaction state.

See:

**[Entitlements →](../concepts/entitlements.md)**

---

## Existing Entitlements

A customer may already have access while another transaction is being recovered.

For example:

```text
Existing Entitlement
       ↓
Renewal Transaction
       ↓
Zombie
       ↓
Recovery
```

The application should not necessarily revoke access merely because the renewal transaction is temporarily unresolved.

The appropriate behavior depends on:

* The entitlement type
* The transaction type
* The customer's existing access
* The final provider state
* The application's configured rules

The recovery system should therefore separate **transaction resolution** from **immediate access assumptions**.

---

## Zombie Transactions and Transaction States

Zombie detection depends on understanding transaction states.

For example:

```text
Created
   ↓
Pending
   ↓
Processing
   ↓
Successful
```

A transaction becomes a potential recovery candidate when its state does not progress as expected:

```text
Created
   ↓
Pending
   ↓
Processing
   ↓
No Progress
   ↓
Zombie Candidate
```

Recovery then attempts to establish the correct state.

See:

**[Transaction States →](../concepts/transaction-states.md)**

---

## Zombie Transactions and the Transaction Ledger

Recovery should not erase the transaction's previous state.

Instead, the transaction history should show how it moved through the lifecycle.

For example:

```text
Transaction
├── Created
├── Pending
├── Zombie Candidate
├── Recovery Started
├── Provider Verified
└── Successful
```

This provides useful context for:

* Support
* Debugging
* Reconciliation
* Auditing
* Revenue analysis

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

---

## Zombie Transactions and Reconciliation

A zombie transaction can represent a difference between SolydFlow's records and the provider's records.

For example:

```text
SolydFlow
└── Pending

Provider
└── Successful
```

Recovery can resolve the individual transaction.

Reconciliation can then ensure that the broader records remain consistent.

```text
Zombie Transaction
       ↓
Recovery
       ↓
Verified State
       ↓
Ledger
       ↓
Reconciliation
```

See:

**[Reconciliation →](../truth/reconciliation.md)**

---

## What Happens When Recovery Cannot Resolve the Transaction?

Recovery may not always produce an immediate final state.

For example:

```text
Zombie
  ↓
Verification
  ↓
Provider Unavailable
```

The transaction may need to remain unresolved temporarily.

```text
Zombie
  ↓
Recovery Attempt
  ↓
Still Unknown
  ↓
Retry / Wait
  ↓
Recover Again
```

The important principle is to avoid inventing a successful or failed state without sufficient evidence.

---

## Recovery Attempts

A transaction may require more than one recovery attempt.

For example:

```text
Zombie
  ↓
Recovery #1
  ↓
Provider Unavailable
  ↓
Recovery #2
  ↓
Provider Responds
  ↓
Successful
```

Recovery attempts should be controlled rather than performed indefinitely.

The system should maintain enough information to determine:

* When recovery was attempted
* What operation was attempted
* What result was returned
* Whether another attempt is appropriate
* Whether the transaction requires manual attention

---

## When a Transaction Requires Attention

Some transactions may remain unresolved even after automated recovery attempts.

For example:

```text
Zombie
  ↓
Recovery
  ↓
Verification
  ↓
Provider Information Unavailable
  ↓
Still Unknown
```

Such transactions may require further investigation.

The transaction should remain visible rather than silently disappearing from the system.

```text
Transaction
└── Requires Attention
```

This is important for operational visibility and reconciliation.

---

## Customer Experience

Recovery should be designed around the customer's experience as well as the backend transaction.

Consider:

```text
Customer
   ↓
Pays
   ↓
Payment Completed
   ↓
Application Shows "Processing"
```

The customer should not be forced to repeatedly pay simply because the application has not yet received confirmation.

A resilient flow is:

```text
Customer
   ↓
Payment
   ↓
Processing
   ↓
SolydFlow Recovery
   ↓
Verification
   ↓
Entitlement
   ↓
Access
```

This reduces unnecessary friction and support requests.

---

## Developer Experience

Without a recovery infrastructure layer, developers may need to build:

```text
Provider API Calls
       +
Webhook Recovery
       +
Polling
       +
Retry Logic
       +
Transaction Tracking
       +
State Management
       +
Entitlement Updates
```

SolydFlow centralizes these concerns around the transaction lifecycle.

```text
Application
    ↓
SolydFlow
    ↓
Recover
    ↓
Provider
```

The application can then focus primarily on consuming the resulting transaction and entitlement state.

---

## Key Principle

> **A zombie transaction is not a failed payment. It is an unresolved payment that requires evidence before its final state can be determined.**

The recovery process is therefore:

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
Stuck
  ↓
Charge Again
```

This distinction helps protect customers from duplicate charges while giving applications a reliable way to recover successful payments.

