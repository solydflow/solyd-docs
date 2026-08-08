# Transaction States

A **transaction state** describes the current stage of a payment as it moves through the SolydFlow revenue lifecycle.

Understanding transaction states helps your application distinguish between payments that are still being resolved and those that have reached a final outcome.


```text
Payment Attempt
      ↓
 Transaction
      ↓
Transaction State
      ↓
Pending
      ↓
Processing
      ↓
┌───────────────┐
│ Final Outcome │
└──────┬────────┘
       │
 ┌─────┴─────┐
 ↓           ↓
Success    Failure
```

## Why Transaction States Matter

A payment is not always immediately successful or failed.

A transaction can be temporarily unresolved because of:

* Network interruptions
* Delayed provider responses
* Missing webhooks
* Payment provider processing
* Interrupted payment sessions
* Other conditions affecting the payment flow

Your application therefore needs to distinguish between a transaction that is **still being resolved** and one that has reached a final outcome.

---

## Transaction Lifecycle

A simplified transaction lifecycle looks like this:

```text
Initiated
   ↓
Pending
   ↓
Processing
   ↓
Succeeded / Failed
```

Some transactions may require additional processing:

```text
Pending
   ↓
Unresolved
   ↓
Recovery
   ↓
Verification
   ↓
Final State
```

The purpose of the transaction lifecycle is to prevent your application from treating an uncertain transaction as a final result.

---

## Pending

A transaction is pending while SolydFlow is waiting for a final payment outcome.

Depending on the payment method, this may include:

- Provider processing
- Customer interaction
- Awaiting confirmation
- Internal verification

Pending transactions should not be treated as either successful or failed.

---

## Succeeded

A transaction is succeeded when the payment outcome has been established as successful.

```text
Transaction
    ↓
Succeeded
    ↓
Enforce
    ↓
Entitlement
    ↓
Customer Access
```

A successful transaction can therefore result in the customer receiving the entitlement associated with the purchased package.

---

## Failed

A transaction is failed when the payment outcome has been established as unsuccessful.

```text
Transaction
    ↓
Failed
    ↓
No Successful Entitlement
```

A failed transaction should not grant access that depends on successful payment.

The customer may be allowed to initiate another payment attempt, depending on your application's flow.

---

## Unresolved Transactions

An unresolved transaction is one where SolydFlow cannot yet determine the correct financial outcome.

Rather than assuming failure, SolydFlow investigates the transaction through its recovery process as these transactions cannot immediately be classified as successful or failed.

For example:

```text
Payment
   ↓
Provider Processing
   ↓
Network Interruption
   ↓
Callback Missing
```

The transaction may remain unresolved until SolydFlow can determine its actual state.

```text
Unresolved
    ↓
Recovery
    ↓
Verification
    ↓
Final State
```

This is one of the situations where SolydFlow's recovery infrastructure becomes important.

---

## Why You Should Not Treat Missing Webhooks as Failure

A missing webhook does not necessarily mean that a payment failed.

Consider:

```text
Customer
   ↓
Payment Provider
   ↓
Payment Successful
   X
Webhook not received
```

Your application has no confirmation, but that does not prove the payment failed.

Instead:

```text
No Webhook
    ↓
Transaction May Be Unresolved
    ↓
Recovery / Verification
    ↓
Final Transaction State
```

This distinction helps prevent legitimate payments from being incorrectly rejected.

---

## Final vs Non-Final States

A useful way to think about transaction states is to separate them into **non-final** and **final** outcomes.

### Non-final

The transaction has not yet reached an authoritative outcome.

```text
Pending
Processing
Unresolved
```

### Final

The transaction has reached an established outcome.

```text
Successful
Failed
```

The exact states exposed by SolydFlow may depend on the implementation and payment provider.

---

## State Transitions

A transaction can move from one state to another as more information becomes available.

For example:

```text
Pending
   ↓
Processing
   ↓
Succeeded
```

Or:

```text
Pending
   ↓
Processing
   ↓
Failed
```

Or when recovery is required:

```text
Pending
   ↓
Unresolved
   ↓
Recovery
   ↓
Verification
   ↓
Successful
```

The important principle is that the final state should be based on the established transaction outcome rather than an early assumption.

---

## Transaction States and Entitlements

Transaction state determines whether a payment can produce the corresponding revenue outcome.

For example:

```text
Successful Transaction
        ↓
     Enforce
        ↓
   Entitlement
        ↓
      Access
```

Whereas:

```text
Pending Transaction
        ↓
     Continue
     Processing
```

and:

```text
Failed Transaction
        ↓
 No Successful Access
```

This keeps application access connected to the actual transaction outcome.

---

## Transaction States and Recovery

Recovery is relevant when a transaction does not have a reliable final state.

```text
Transaction
     ↓
Is the state final?
     │
 ┌───┴────┐
 │        │
Yes       No
 │        │
 ↓        ↓
Outcome  Recovery
          ↓
      Verification
          ↓
      Final State
```

Recovery should resolve uncertainty rather than simply create another payment attempt.

---

## Transaction States and Multiple Providers

Different payment providers may use different terminology for similar payment conditions.

SolydFlow provides a unified transaction model so your application does not have to build separate payment-state logic for every provider.

Conceptually:

```text
Paystack ──────┐
Flutterwave ───┤
Stripe ────────┤
Other Providers┘
       ↓
   SolydFlow
       ↓
Transaction State
       ↓
Your Application
```

This allows your application to work with the SolydFlow transaction lifecycle instead of coupling its business logic directly to each provider's terminology.

---

## Example

Suppose a customer purchases a premium package.

### 1. Payment starts

```text
Customer
   ↓
Premium Package
   ↓
Payment Started
```

### 2. Transaction is created

```text
Transaction
   ↓
Pending
```

### 3. Provider processes the payment

```text
Pending
   ↓
Processing
```

### 4. Payment succeeds

```text
Processing
   ↓
Successful
```

### 5. Revenue outcome is enforced

```text
Successful
   ↓
Enforce
   ↓
Premium Entitlement
   ↓
Premium Access
```

If the payment instead cannot be completed:

```text
Processing
   ↓
Failed
```

The application does not grant the paid entitlement.

---

## Designing Your Application Around Transaction States

Your application should avoid embedding provider-specific assumptions into its business logic.

Instead of:

```text
"If Paystack returns X, unlock the product."
"If Flutterwave returns Y, unlock the product."
"If Stripe returns Z, unlock the product."
```

Use the SolydFlow transaction and entitlement model:

```text
Payment Provider
       ↓
   SolydFlow
       ↓
Transaction State
       ↓
   Enforce
       ↓
 Entitlement
       ↓
Application Access
```

This keeps your payment infrastructure separate from your product logic.

---

## Key Principle

> **A transaction without a final outcome should never be treated as a failed payment.**

Your application should wait for the transaction to reach an established outcome before making decisions that depend on successful payment.

The SolydFlow model is:

```text
Payment
   ↓
Transaction
   ↓
State
   ↓
Recover when necessary
   ↓
Verify
   ↓
Final Outcome
   ↓
Enforce
   ↓
Entitlement
```

This is how SolydFlow helps keep payment state and customer access aligned.

---

<!-- ## Related Content

Learn how customers are represented within a SolydFlow project:

**[Users →](./users.md)**

Or continue exploring the revenue lifecycle:

**[Recover →](../recover/overview.md)** -->
