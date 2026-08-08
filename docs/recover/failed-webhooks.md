# Failed Webhooks

Webhooks allow payment providers to notify SolydFlow when something happens to a transaction.

In a reliable payment system, however, webhook delivery cannot be treated as guaranteed.

A webhook can fail to arrive, arrive late, be rejected, be duplicated, or fail while being processed.

SolydFlow Recover is designed to handle these situations so that a missed webhook does not automatically become a missed payment.

```text id="w3kq8c"
Payment Provider
       ↓
     Webhook
       ↓
    SolydFlow
       ↓
 Transaction
       ↓
 Entitlement
```

When the webhook does not complete the expected flow:

```text id="2r7m9v"
Payment Provider
       ↓
     Webhook
        X
       ↓
 SolydFlow
       ↓
 Recovery
       ↓
 Verification
       ↓
 Transaction
```

---

## Why Webhooks Can Fail

Webhook delivery involves multiple systems.

For example:

```text id="6n4p8x"
Payment Provider
       ↓
Internet
       ↓
Webhook Endpoint
       ↓
Application / SolydFlow
       ↓
Event Processing
```

A failure can occur at several points.

Possible causes include:

* Temporary network failures
* Provider outages
* Endpoint unavailability
* Request timeouts
* Incorrect webhook configuration
* Authentication or signature failures
* Server errors
* Processing failures
* Duplicate events
* Delayed delivery

A failed webhook therefore does not necessarily mean that the underlying payment failed.

---

## A Missing Webhook Does Not Mean a Failed Payment

Consider this scenario:

```text id="j8v2q5"
Customer
   ↓
Payment Provider
   ↓
Payment Successful
```

The provider then attempts to notify SolydFlow:

```text id="c1m6w9"
Payment Provider
       ↓
Webhook
       X
```

The provider may still have:

```text id="r9q4s2"
Transaction = Successful
```

while SolydFlow has:

```text id="f7k3p1"
Transaction = Pending
```

This is a state synchronization problem, not necessarily a payment failure.

---

## The Recovery Flow

When an expected webhook is not received or cannot be processed, SolydFlow can use recovery mechanisms to determine the current transaction state.

```text id="x5n8m2"
Expected Webhook
       ↓
Not Received
       ↓
Recovery Trigger
       ↓
Provider Verification
       ↓
Transaction State
       ↓
Entitlement
```

The important step is verification.

SolydFlow should not assume:

```text id="q3w7k1"
Webhook Missing
      =
Payment Failed
```

or:

```text id="z8p4m6"
Webhook Missing
      =
Payment Successful
```

Instead:

```text id="v6r2n9"
Webhook Missing
       ↓
Investigate
       ↓
Verify
       ↓
Resolve
```

---

## Webhook Delivery vs Transaction State

A webhook is an event notification.

The transaction is the underlying payment record.

These should not be treated as the same thing.

```text id="b4x7m2"
Provider Transaction
        │
        ├── Payment State
        │
        └── Webhook Event
```

A webhook can fail while the provider transaction remains valid.

For example:

```text id="k5m8q1"
Provider Transaction
└── Successful

Webhook
└── Not Delivered
```

SolydFlow's recovery process exists to bridge this gap.

---

## Webhook Processing Failures

A webhook can also arrive successfully but fail during processing.

For example:

```text id="y2r8p6"
Provider
   ↓
Webhook
   ↓
SolydFlow
   ↓
Processing
   X
```

The provider may have successfully delivered the event, but the event handler may have encountered an error.

Possible causes include:

* Temporary database failure
* Internal application error
* Invalid event data
* Processing timeout
* Dependency failure
* Unexpected provider response

In such cases, the webhook event itself may need to be retried or recovered.

---

## Delivery Failure vs Processing Failure

These are different failure modes.

### Delivery failure

The event never reaches the receiving system.

```text id="n6k3q9"
Provider
   ↓
Webhook
   X
SolydFlow
```

### Processing failure

The event reaches the receiving system but cannot be successfully processed.

```text id="c9w5r2"
Provider
   ↓
Webhook
   ↓
SolydFlow
   ↓
Processing
   X
```

Both can result in a transaction that does not reach the expected state.

---

## Duplicate Webhooks

Providers may retry webhook delivery.

This means the same event can potentially be delivered more than once.

```text id="u4x8m7"
Provider
   ↓
Webhook
   ↓
SolydFlow

Provider
   ↓
Webhook Again
   ↓
SolydFlow
```

The application should not interpret this as two separate payments.

The transaction should remain associated with the same underlying provider transaction.

```text id="a7q2n5"
Webhook #1 ──┐
             ├──→ Same Transaction
Webhook #2 ──┘
```

Webhook processing should therefore be designed to be safe when events are delivered more than once.

See:

**[Event Handling →](../webhooks/event-handling.md)**

---

## Webhook Ordering

Events may not always arrive in the order in which they were generated.

For example:

```text id="p8m3q6"
Provider generates:

Event A
   ↓
Event B
   ↓
Event C
```

But the receiving system may observe:

```text id="h4r7n1"
Event B
   ↓
Event A
   ↓
Event C
```

This means event order should not automatically be treated as proof of the transaction's final state.

SolydFlow should use transaction information and provider state where necessary to determine the appropriate state.

---

## Webhook Timeouts

A webhook endpoint may fail to respond within the expected time.

```text id="m2k8v4"
Provider
   ↓
Webhook
   ↓
SolydFlow
   ↓
Processing
   ↓
Timeout
```

The provider may then retry the event.

This can produce:

```text id="w6q3p9"
Attempt 1
   ↓
Timeout

Attempt 2
   ↓
Success
```

The receiving system must therefore safely handle repeated delivery.

---

## Webhook Signature Failures

A webhook should be authenticated before its contents are trusted.

For example:

```text id="q7n4x2"
Webhook
   ↓
Signature Verification
   ↓
 ┌──────┴──────┐
 ↓             ↓
Valid        Invalid
 ↓             ↓
Process       Reject
```

An invalid signature should not simply be ignored as a harmless delivery problem.

It may indicate:

* Incorrect configuration
* Incorrect signing secret
* A malformed request
* A provider integration issue
* A potentially untrusted request

See:

**[Signature Verification →](../webhooks/signature-verification.md)**

---

## Recovery After Signature Failure

An invalid webhook should not be treated as proof that the underlying transaction failed.

For example:

```text id="n3x7k5"
Webhook
   ↓
Signature Invalid
   ↓
Reject Event
```

The transaction may still exist at the provider.

Therefore:

```text id="r8m2q6"
Rejected Webhook
       ↓
Existing Transaction
       ↓
Provider Verification
       ↓
Resolved State
```

This keeps webhook security separate from transaction resolution.

---

## Recovery After Provider Outage

A provider may temporarily become unavailable when SolydFlow needs to retrieve transaction information.

For example:

```text id="k9w4p2"
Recovery
   ↓
Provider API
   X
Unavailable
```

SolydFlow should not interpret provider unavailability as payment failure.

Instead, the recovery workflow can wait and retry an appropriate operation.

```text id="b6q8m3"
Provider Unavailable
       ↓
Wait / Retry
       ↓
Provider Available
       ↓
Verify
       ↓
Resolve
```

See:

**[Retries →](./retries.md)**

---

## Detecting Missing Webhooks

A missing webhook can be detected when SolydFlow has reason to expect an event but does not observe the expected transaction progress.

For example:

```text id="v5m8q2"
Transaction
   ↓
Pending
   ↓
Expected Event
   ↓
Not Received
   ↓
Recovery Candidate
```

The system should account for legitimate provider processing delays before declaring the transaction abnormal.

Conceptually:

```text id="j3r7n9"
Pending
   ↓
Expected Processing Window
   ↓
 ┌──────┴──────┐
 ↓             ↓
Progress     No Progress
 ↓             ↓
Continue      Recover
```

---

## Webhook Recovery vs Polling

Recovery may require querying the provider directly rather than waiting indefinitely for another webhook.

For example:

```text id="s4k8m1"
Webhook Missing
      ↓
Provider Query
      ↓
Current Transaction State
```

This can help determine what happened to the transaction.

The provider query should be used carefully and according to the provider's capabilities and rate limits.

---

## Avoiding Duplicate Charges

Webhook failure should never automatically result in a new customer charge.

For example:

```text id="d8q3m6"
Payment
   ↓
Provider
   ↓
Successful
   ↓
Webhook Missing
```

It would be dangerous to respond with:

```text id="p5r7x2"
Charge Again
```

Instead:

```text id="n6w4k8"
Existing Transaction
       ↓
Verify
       ↓
 ┌─────┴─────┐
 ↓           ↓
Paid       Not Paid
 ↓           ↓
Resolve     New Attempt
```

This distinction protects against duplicate charges.

---

## Webhook Recovery and Transaction Recovery

Failed webhook recovery is one part of the broader transaction recovery system.

```text id="x7m2q9"
                 Recover
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
 Failed Webhooks  Zombie     Retries
        │           │           │
        └───────────┼───────────┘
                    ↓
              Transaction
                 Recovery
```

See:

**[Transaction Recovery →](./transaction-recovery.md)**

---

## Webhook Recovery and Zombie Transactions

A missing webhook can cause a transaction to remain pending long enough to become a zombie transaction.

```text id="g4n8p2"
Payment Successful
       ↓
Webhook Missing
       ↓
Transaction Pending
       ↓
No Progress
       ↓
Zombie
       ↓
Recovery
```

This is why failed webhook handling and zombie transaction detection work together.

See:

**[Zombie Transactions →](./zombie-transactions.md)**

---

## Webhook Recovery and Entitlements

The purpose of recovering a successful payment is ultimately to ensure that the customer's entitlement reflects the verified transaction.

```text id="m8q2v6"
Webhook Missing
       ↓
Recovery
       ↓
Provider Verification
       ↓
Successful Transaction
       ↓
Entitlement
       ↓
Application Access
```

The application should therefore derive access from the resulting transaction and entitlement state rather than from whether a particular webhook happened to arrive.

See:

**[Entitlements →](../concepts/entitlements.md)**

---

## Webhook Recovery and the Transaction Ledger

A recovered webhook event should remain traceable in the transaction history.

For example:

```text id="r5k9x3"
Transaction
├── Created
├── Pending
├── Expected Webhook Missing
├── Recovery Triggered
├── Provider Verified
└── Successful
```

This provides operational visibility into what happened.

It can also help with:

* Customer support
* Debugging
* Reconciliation
* Auditing
* Payment investigations

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

---

## Webhook Recovery and Reconciliation

Webhook failures can create differences between provider records and SolydFlow records.

For example:

```text id="q3w7n5"
Provider
└── Successful

SolydFlow
└── Pending
```

Recovery can resolve the individual transaction:

```text id="k6m2r8"
Provider
└── Successful

SolydFlow
└── Successful
```

Reconciliation can then help identify and resolve broader differences between systems.

See:

**[Reconciliation →](../truth/reconciliation.md)**

---

## Designing Reliable Webhook Processing

A reliable webhook system should assume that:

```text id="v8n3q6"
Events may be:

✓ Delayed
✓ Duplicated
✓ Out of order
✓ Rejected
✓ Retried
✓ Temporarily unavailable
✓ Processed more than once
```

Therefore, webhook handling should be designed around transaction identity and state rather than assuming that every event is delivered exactly once and in perfect order.

---

## Recommended Flow

A resilient webhook architecture looks like:

```text id="y6r2m8"
Payment Provider
       ↓
Webhook
       ↓
Signature Verification
       ↓
Event Validation
       ↓
Idempotent Processing
       ↓
Transaction Update
       ↓
Entitlement Update
```

If the webhook cannot complete the flow:

```text id="c4m9q7"
Webhook Failure
       ↓
Recovery
       ↓
Provider Verification
       ↓
Transaction Update
       ↓
Entitlement
```

---

## What SolydFlow Should Protect Developers From

Without a centralized recovery layer, developers may need to implement:

```text id="h7x3n5"
Webhook Endpoint
       +
Signature Verification
       +
Duplicate Detection
       +
Event Ordering
       +
Retry Handling
       +
Missing Event Detection
       +
Provider Verification
       +
Transaction Recovery
```

SolydFlow provides the infrastructure around these concerns so that the application can work with a consistent transaction model.

---

## Key Principle

> **A webhook is a notification about a transaction, not the transaction itself.**

If a webhook is lost, delayed, duplicated, or rejected, the underlying transaction may still exist and have a different state.

The recovery process should therefore be:

```text id="n2q8m4"
Webhook Problem
      ↓
Find Transaction
      ↓
Verify Provider State
      ↓
Resolve Transaction
      ↓
Update Entitlement
```

rather than:

```text id="z5r7k3"
Webhook Missing
      ↓
Assume Payment Failed
```
