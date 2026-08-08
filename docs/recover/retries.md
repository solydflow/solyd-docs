# Retries

Retries allow SolydFlow to repeat an operation that failed temporarily.

Payment systems depend on networks, APIs, webhooks, databases, and other distributed components. A temporary failure does not always mean that the underlying operation has permanently failed.

For example:

```text id="8q3m7v"
Request
   ↓
Provider
   ↓
Temporary Failure
   ↓
Retry
   ↓
Success
```

Retries are therefore an important part of SolydFlow Recover.

However, **not every payment operation is safe to retry**.

A retry must take into account whether repeating the operation could create a duplicate transaction or charge.

---

## Why Retries Matter

Distributed systems regularly encounter temporary failures.

For example:

* Network interruptions
* Request timeouts
* Temporary provider errors
* Service unavailability
* Connection failures
* Transient database errors
* Temporary webhook processing failures

A request that fails once may succeed when attempted again.

```text id="4w9n2k"
Attempt 1
   ↓
Temporary Failure
   ↓
Attempt 2
   ↓
Success
```

Without controlled retries, a temporary infrastructure failure can unnecessarily become a failed customer experience.

---

## Retry Does Not Mean Charge Again

This is the most important distinction when dealing with payments.

Consider:

```text id="7m2x8q"
Customer
   ↓
Payment Request
   ↓
Provider
   ↓
Timeout
```

A timeout does not necessarily tell us whether the provider processed the payment.

The dangerous response would be:

```text id="p4k8v1"
Timeout
   ↓
Charge Again
```

The customer could already have been charged.

Instead:

```text id="n6r3w9"
Timeout
   ↓
Determine Existing Transaction
   ↓
Verify
   ↓
Resolve
```

Retries should therefore be designed around the operation being repeated.

---

## Safe and Unsafe Retries

Not all operations have the same retry characteristics.

### Generally safer operations

Operations such as retrieving or verifying information can often be retried.

```text id="w5q8m2"
Get Transaction
      ↓
Temporary Failure
      ↓
Retry
      ↓
Get Transaction
```

Similarly:

```text id="c7n4x9"
Verify Transaction
      ↓
Temporary Failure
      ↓
Retry
      ↓
Verified
```

### Potentially dangerous operations

Creating or charging a payment may have side effects.

```text id="j2m7p5"
Charge Customer
      ↓
Timeout
      ↓
Unknown Result
```

The correct action is not necessarily:

```text id="b8r3q6"
Charge Customer Again
```

Instead, the existing transaction should first be investigated.

---

## Idempotency

Idempotency is an important concept when performing retryable operations.

An idempotent operation can be safely repeated without producing an unintended additional effect.

Conceptually:

```text id="4x9m2q"
Request
   ↓
Operation
   ↓
Retry
   ↓
Same Intended Result
```

For payment operations that support idempotency, a stable idempotency key can allow repeated requests to refer to the same intended operation.

```text id="7k3p8n"
Payment Request
Idempotency Key: ABC123
       ↓
Provider
       ↓
Retry
Idempotency Key: ABC123
       ↓
Same Transaction
```

The exact implementation depends on the payment provider.

SolydFlow should use provider-supported idempotency mechanisms where available rather than assuming that every provider handles retries identically.

---

## Retry Lifecycle

A simplified retry lifecycle is:

```text id="m8q4v1"
Operation
   ↓
Attempt
   ↓
Success?
  /    \
Yes     No
 ↓       ↓
Done   Determine Error
          ↓
      Retryable?
       /      \
     Yes       No
      ↓         ↓
    Retry     Resolve
```

This prevents the system from repeatedly retrying operations that cannot succeed without a change in conditions.

---

## Retryable vs Non-Retryable Failures

A failure should be classified before another attempt is made.

For example:

```text id="x3n7q9"
Operation Failed
      ↓
Classify Error
      ↓
 ┌────┴────┐
 ↓         ↓
Retryable  Permanent
 ↓         ↓
Retry      Resolve Failure
```

A temporary network failure may be retryable.

An invalid credential or invalid request may not be.

For example:

```text id="r6m2p8"
Network Timeout
      ↓
Potentially Retryable
```

while:

```text id="q9w4k3"
Invalid Credentials
      ↓
Not Fixed by Retry
```

Repeatedly retrying a permanent error only creates unnecessary load and delay.

---

## Exponential Backoff

Retries should generally not happen continuously with no delay.

For example:

```text id="5v8n2m"
Attempt 1
   ↓
Wait
   ↓
Attempt 2
   ↓
Longer Wait
   ↓
Attempt 3
   ↓
Longer Wait
   ↓
Attempt 4
```

This approach is commonly called **exponential backoff**.

A simplified progression might look like:

```text id="k4q7x9"
1st retry → short delay
2nd retry → longer delay
3rd retry → longer delay
4th retry → longer delay
```

The actual timing should be controlled by the operation and provider requirements.

---

## Why Backoff Matters

Imagine a payment provider experiencing an outage.

Without backoff:

```text id="n8m3q5"
Provider Outage
      ↓
Retry
Retry
Retry
Retry
Retry
Retry
...
```

This can increase load on an already unhealthy service.

With backoff:

```text id="v6p2k8"
Provider Outage
      ↓
Retry
      ↓
Wait
      ↓
Retry
      ↓
Longer Wait
      ↓
Retry
```

This gives the provider time to recover and reduces unnecessary traffic.

---

## Jitter

When many transactions fail at approximately the same time, retrying all of them at exactly the same intervals can create another traffic spike.

For example:

```text id="q5m8r2"
100 Transactions
      ↓
Retry at exactly the same time
      ↓
Provider
      ↓
Traffic Spike
```

Adding some variation to retry timing can spread the requests out.

Conceptually:

```text id="x7k3n9"
Transaction A → Retry
Transaction B → Slightly later
Transaction C → Later
Transaction D → Slightly later
```

This is commonly referred to as **jitter**.

---

## Retry Limits

Retries should have boundaries.

A transaction should not remain in an endless retry loop.

```text id="f8q2m6"
Failure
  ↓
Retry
  ↓
Failure
  ↓
Retry
  ↓
Failure
  ↓
Maximum Attempts
  ↓
Stop
```

After the retry policy is exhausted, the transaction or operation can be moved into an appropriate state for further handling.

For example:

```text id="v3n7k5"
Retries Exhausted
      ↓
Still Unresolved
      ↓
Recovery / Investigation
```

---

## Retry and Transaction Recovery

Retries are one mechanism inside the broader transaction recovery system.

```text id="s4m8q2"
              Recover
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
    Verify    Retry     Reconcile
       │         │
       └────┬────┘
            ↓
       Transaction
```

A retry can help an operation succeed, while verification determines what actually happened.

---

## Retry and Verification

Consider a provider request that times out:

```text id="p7x3m9"
SolydFlow
    ↓
Provider
    ↓
Timeout
```

SolydFlow should not automatically conclude:

```text id="q4k8n2"
Payment Failed
```

Instead, it can use verification:

```text id="m6v2r7"
Timeout
   ↓
Verify Existing Transaction
   ↓
 ┌──────┴──────┐
 ↓             ↓
Successful    Not Successful
 ↓             ↓
Resolve       Retry / Handle
```

This is especially important for operations that may have already produced a side effect.

See:

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Retry and Webhooks

Webhook delivery is a common use case for retries.

For example:

```text id="c8n4q6"
Provider
   ↓
Webhook
   ↓
SolydFlow
   ↓
Processing Failure
```

A retry can allow the event to be processed again.

```text id="w2r7m5"
Webhook Processing
       ↓
Failure
       ↓
Retry
       ↓
Success
```

However, webhook retries must account for duplicate delivery.

The same event may be received more than once.

See:

**[Failed Webhooks →](./failed-webhooks.md)**

**[Event Handling →](../webhooks/event-handling.md)**

---

## Retry and Idempotent Webhook Processing

Suppose a provider sends:

```text id="n5k8q2"
Webhook Event A
```

SolydFlow processes it but fails after part of the operation.

The provider may send it again:

```text id="n5k8q2"
Webhook Event A
```

The system should recognize that both events refer to the same underlying event or transaction.

Conceptually:

```text id="x3m7p9"
Event A
  ↓
Process
  ↓
Failure

Event A
  ↓
Retry
  ↓
Process Safely
```

This prevents retries from producing duplicate transaction effects.

---

## Retry and Provider Errors

Providers can return different types of errors.

For example:

```text id="q6v2n8"
Provider Error
     ↓
Classify
     ↓
 ┌──────────────┬───────────────┐
 ↓              ↓               ↓
Temporary     Rate Limit      Permanent
 ↓              ↓               ↓
Retry          Backoff         Resolve
```

The exact classification depends on the provider.

SolydFlow's provider integration should translate provider-specific behavior into an appropriate recovery strategy.

---

## Retry and Rate Limits

Payment providers may limit how frequently their APIs can be called.

Repeated retries can therefore make a recovery situation worse.

For example:

```text id="r4m8x2"
Provider
   ↓
Rate Limit
   ↓
Retry Immediately
   ↓
Rate Limit Again
```

Instead:

```text id="w7q3n5"
Rate Limit
   ↓
Backoff
   ↓
Retry Later
```

Provider-specific rate-limit information should be respected where available.

---

## Retry and Provider Outages

During a provider outage, many transactions may fail simultaneously.

```text id="j8m4q2"
Provider Outage
      ↓
Many Failed Requests
      ↓
Recovery Queue
```

A controlled retry strategy can gradually retry eligible operations rather than sending all requests immediately.

```text id="k3v7n9"
Failed Operations
      ↓
Backoff
      ↓
Retry
      ↓
Provider Recovers
      ↓
Success
```

This can help prevent a recovery storm when the provider becomes available again.

---

## Retry and Zombie Transactions

A zombie transaction may require verification rather than a payment retry.

For example:

```text id="m5q8x3"
Zombie Transaction
       ↓
Provider Verification
       ↓
Provider Unavailable
       ↓
Retry Verification
```

Here the retry is applied to the **verification operation**, not necessarily to the original payment.

```text id="z7r2n6"
Payment
   ↓
Existing Transaction
   ↓
Retry Verification
   ↓
Resolved
```

This distinction is critical.

See:

**[Zombie Transactions →](./zombie-transactions.md)**

---

## Retry and Transaction State

A retry should not arbitrarily change the transaction state.

For example:

```text id="v8m3q5"
Pending
   ↓
Verification Attempt
   ↓
Temporary Failure
   ↓
Retry Verification
   ↓
Successful
```

The transaction becomes successful because verification established that state—not simply because a retry occurred.

Similarly:

```text id="p4n7x2"
Pending
   ↓
Verification
   ↓
Failed
```

should remain failed even if a previous verification attempt had temporarily failed.

---

## Retry and Entitlements

A retry should not directly grant an entitlement.

For example:

```text id="q8m2r5"
Retry
   ↓
Success
```

does not automatically mean:

```text id="w3k7n9"
Entitlement Granted
```

Instead, the resulting transaction state should determine the entitlement:

```text id="f6v4p8"
Retry
   ↓
Successful Operation
   ↓
Verified Transaction
   ↓
Entitlement
```

This keeps payment recovery and access control properly separated.

---

## Retry History

Recovery operations should be observable.

A transaction may have a history such as:

```text id="n7q3m8"
Transaction
├── Created
├── Pending
├── Verification Attempt #1
├── Timeout
├── Verification Retry #1
├── Provider Response
└── Successful
```

This provides useful information for:

* Debugging
* Customer support
* Monitoring
* Auditing
* Reconciliation

The exact information retained depends on SolydFlow's audit and transaction-recording implementation.

---

## When to Stop Retrying

A retry policy should eventually stop.

Possible reasons include:

* Maximum attempts reached
* Permanent error detected
* Provider indicates the operation cannot succeed
* Transaction has already reached a final state
* Further retries would risk duplicate effects
* The operation requires manual investigation

For example:

```text id="x9m4q7"
Retry
  ↓
Retry
  ↓
Retry
  ↓
Maximum Attempts
  ↓
Stop
  ↓
Recovery / Investigation
```

---

## Recovery After Retries Are Exhausted

Exhausting retries does not necessarily mean the transaction failed.

For example:

```text id="j5k8n3"
Verification
   ↓
Temporary Provider Failure
   ↓
Retry
   ↓
Retry
   ↓
Retries Exhausted
```

The transaction may still be unresolved.

```text id="r2m7q4"
Still Unknown
   ↓
Continue Recovery Later
```

The system should distinguish:

**Operation failed permanently**

from:

**Operation could not currently be completed.**

---

## Example: Safe Verification Retry

Consider a payment that appears pending.

```text id="p6n3v8"
Transaction
   ↓
Pending
```

SolydFlow attempts to verify it:

```text id="w4q7m2"
Verify Provider
   ↓
Timeout
```

Instead of charging the customer again:

```text id="x8r5k3"
Retry Verification
       ↓
Provider Responds
       ↓
Successful
       ↓
Transaction Updated
       ↓
Entitlement
```

The original payment remains the transaction being resolved.

---

## Example: Webhook Processing Retry

A provider sends a successful payment event:

```text id="m7q2n5"
Webhook
   ↓
SolydFlow
   ↓
Processing Error
```

SolydFlow retries the processing operation:

```text id="v3k8r4"
Retry
   ↓
Event Processed
   ↓
Transaction Updated
   ↓
Entitlement Updated
```

The retry processes the same event rather than creating a second payment.

---

## Example: Permanent Failure

Consider an invalid configuration:

```text id="q8m3x6"
Provider Request
   ↓
Invalid Credentials
```

Repeated retries will not solve the problem:

```text id="f5n7k2"
Invalid Credentials
   ↓
Retry
   ↓
Invalid Credentials
   ↓
Retry
   ↓
Invalid Credentials
```

Instead:

```text id="r4p8m3"
Invalid Credentials
       ↓
Non-Retryable
       ↓
Configuration Error
```

This should be surfaced for correction.

---

## Retry Safety Principles

When implementing retries around payments, SolydFlow should follow several principles:

### 1. Know what is being retried

```text id="d8m4q7"
Payment?
Verification?
Webhook?
Database operation?
```

The recovery behavior depends on the operation.

### 2. Prefer idempotent operations

```text id="n5q2r8"
Safe to repeat
      ↓
Retry
```

### 3. Verify before repeating uncertain charges

```text id="w7m3x9"
Unknown Payment Result
      ↓
Verify
      ↓
Then Decide
```

### 4. Use backoff

```text id="k4p8n2"
Retry
  ↓
Wait
  ↓
Retry
```

### 5. Set retry limits

```text id="q6r3m7"
Retry
  ↓
Maximum Attempts
  ↓
Stop
```

### 6. Preserve transaction history

```text id="x9n5k2"
Attempt
  ↓
Result
  ↓
Retry
  ↓
Result
```

This makes recovery observable.

---

## Key Principle

> **Retries should recover temporary failures without creating new payment problems.**

For payment infrastructure, the safest retry strategy is:

```text id="m3q8v5"
Failure
   ↓
Identify Operation
   ↓
Classify Failure
   ↓
Is It Safe to Retry?
   ↓
 ┌──────────┴──────────┐
 ↓                     ↓
Yes                    No
 ↓                     ↓
Backoff                Verify / Resolve
 ↓
Retry
 ↓
Result
```

The goal is not to retry everything.

The goal is to retry **the right operation, at the right time, with enough information to avoid duplicate effects**.

