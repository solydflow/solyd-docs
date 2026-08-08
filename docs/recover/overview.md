# Recover

SolydFlow Recover is the recovery layer for payment transactions that do not complete cleanly.

Real-world payment systems are not always synchronous or predictable. A customer can complete a payment while your application misses the confirmation. A provider can temporarily fail to respond. A webhook can arrive late or not arrive at all. A transaction can remain pending even though the underlying payment has already changed state.

Recover is designed to help applications resolve these situations without requiring developers to build provider-specific recovery logic themselves.

```text id="8p4j6k"
Customer
    ↓
Payment Provider
    ↓
   SolydFlow
    ↓
Transaction
    ↓
   Recover
    ↓
Resolved State
    ↓
Entitlement
```

---

## Why Recovery Matters

A successful payment does not always mean that every system involved immediately knows that the payment succeeded.

For example:

```text id="7z3m2q"
Customer
   ↓
Payment Provider
   ↓
Payment Successful
   ↓
Webhook
   X
```

The provider may have completed the payment while your application is still waiting for confirmation.

This can result in:

```text id="4k8x1p"
Provider
└── Successful

Application
└── Pending
```

Without a recovery mechanism, the customer may have paid successfully but still not receive the entitlement they purchased.

Recover exists to help close this gap.

---

## What Recover Does

Recover provides mechanisms for detecting and resolving transactions that have not reached a reliable final state.

Depending on the situation, this can involve:

* Detecting transactions that need attention
* Retrying failed operations
* Recovering transactions when webhooks are missing
* Verifying provider-side transaction state
* Resolving incomplete payment flows
* Handling transactions that appear inconsistent
* Updating the resulting entitlement

Conceptually:

```text id="5jv7wn"
Unresolved Transaction
        ↓
     Detect
        ↓
     Recover
        ↓
    Verify
        ↓
 Resolve State
        ↓
   Entitlement
```

---

## Recover Is Not a Payment Provider

Recover does not replace your payment providers.

Your providers remain responsible for processing the underlying payment.

```text id="9w2r6c"
             SolydFlow
                 │
        ┌────────┴────────┐
        ↓                 ↓
   Payment Layer      Recover
        ↓                 ↓
Payment Provider    Recovery Logic
```

For example:

```text id="1x6v4m"
Your Application
       ↓
   SolydFlow
       ↓
Paystack / Flutterwave / Stripe /
M-Pesa / Monnify / Apple / Google Play
```

Recover operates around those providers to make the application-facing transaction lifecycle more resilient.

---

## The Problem Recover Solves

Without a shared recovery layer, each application may need to implement logic for situations such as:

```text id="0q9m3b"
Payment initiated
       ↓
Provider processes payment
       ↓
Webhook fails
       ↓
Application remains pending
       ↓
Developer investigates
       ↓
Manual recovery
```

With SolydFlow:

```text id="6c2w8n"
Payment initiated
       ↓
Provider processes payment
       ↓
Expected event missing
       ↓
SolydFlow detects issue
       ↓
Recovery
       ↓
Verification
       ↓
Resolved transaction
       ↓
Entitlement
```

This moves recovery from application-specific code into the revenue infrastructure.

---

## Common Recovery Scenarios

Recover is designed around several common failure scenarios.

### Failed Webhooks

A provider completes a transaction but the expected webhook is not successfully delivered.

```text id="4v7k2p"
Provider
   ↓
Payment Successful
   ↓
Webhook
   X
   ↓
SolydFlow
   ↓
Recovery
```

See:

**[Failed Webhooks →](./failed-webhooks.md)**

---

### Pending Transactions

A transaction remains pending even though its underlying state may have changed.

```text id="3n8x5q"
Transaction
   ↓
Pending
   ↓
Provider State Changes
   ↓
Recovery / Verification
   ↓
Resolved
```

Recovery works together with transaction state handling to prevent transactions from remaining unresolved unnecessarily.

See:

**[Transaction Recovery →](./transaction-recovery.md)**

---

### Zombie Transactions

A zombie transaction is a transaction that remains in an unresolved application state even though there may be evidence that the underlying payment has progressed or completed.

```text id="7p2m9x"
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
```

See:

**[Zombie Transactions →](./zombie-transactions.md)**

---

### Failed Operations

An operation involved in the payment lifecycle can fail temporarily.

For example:

```text id="6r4w1k"
SolydFlow
    ↓
Provider Request
    ↓
Temporary Failure
    ↓
Retry
    ↓
Success
```

Retries can help recover from transient failures without requiring the customer to start the entire purchase again.

See:

**[Retries →](./retries.md)**

---

## Recover and Transaction States

Recovery works closely with the transaction lifecycle.

A transaction can move through states such as:

```text id="2m8q5v"
Created
  ↓
Pending
  ↓
Processing
  ↓
Successful
```

But real-world failures can interrupt this flow:

```text id="8x4k1n"
Created
  ↓
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

Recover should therefore be understood as a mechanism that helps transactions move toward a reliable state.

See:

**[Transaction States →](../concepts/transaction-states.md)**

---

## Recover and Verification

Recovery should not blindly assume that a payment succeeded.

For example, if a webhook is missing:

```text id="5q7m3z"
Webhook Missing
      ↓
   Recovery
      ↓
Provider Verification
      ↓
 ┌────┴────┐
 ↓         ↓
Paid     Not Paid
 ↓         ↓
Success   Failed
```

This distinction is important.

A missing event does not necessarily mean that the payment succeeded, and a delayed response does not necessarily mean that it failed.

Recovery therefore works together with verification to determine what actually happened.

See:

**[Transaction Verification →](../truth/transaction-verification.md)**

---

## Recover and Entitlements

The final goal of recovering a payment is not simply to change a transaction status.

The transaction may determine whether the customer receives or retains access to a product or package.

```text id="1v6n8c"
Payment
   ↓
Transaction
   ↓
Recovery
   ↓
Verification
   ↓
Resolved State
   ↓
Entitlement
   ↓
Application Access
```

For example, if a customer's payment was successful but the application never received the confirmation, recovery can allow the transaction to be resolved and the appropriate entitlement to be granted.

See:

**[Entitlements →](../concepts/entitlements.md)**

---

## Recover and Multiple Providers

SolydFlow may connect multiple payment providers to the same application.

Each provider can have different:

* Payment flows
* Event mechanisms
* Failure modes
* Transaction states
* Response times
* Recovery requirements

Without an infrastructure layer, your application would need to understand these differences.

Recover provides a common recovery model above the provider layer.

```text id="9c4w7m"
                  SolydFlow Recover
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Paystack       Flutterwave     Stripe
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                   Recovery Layer
```

This allows your application to consume a consistent transaction lifecycle.

---

## Recover and the Transaction Ledger

Recovery can also affect the transaction record maintained by SolydFlow.

For example:

```text id="3k9p6x"
Initial State
└── Pending

Recovery
└── Provider Verification

Updated State
└── Successful

Ledger
└── Transaction Updated
```

This helps maintain a coherent history of what happened to the transaction.

See:

**[Transaction Ledger →](../truth/transaction-ledger.md)**

---

## Recovery Does Not Mean Recharging the Customer

Recovery should not be confused with automatically attempting another payment.

For example:

```text id="w5x8m2"
Payment
   ↓
Provider
   ↓
Confirmation Missing
```

The correct response may be to verify the existing transaction rather than initiate another charge.

```text id="7n4q9p"
Existing Transaction
       ↓
    Verify
       ↓
 ┌─────┴─────┐
 ↓           ↓
Paid       Not Paid
 ↓           ↓
Resolve     Handle Failure
```

This is especially important when a customer may already have been charged.

---

## Recovery Workflows

Recovery can involve several mechanisms working together.

A simplified workflow is:

```text id="2q7m4x"
Transaction Created
       ↓
Payment Processing
       ↓
Provider Response
       ↓
 ┌─────┴─────┐
 ↓           ↓
Success    Uncertain
 ↓           ↓
Resolve    Recover
             ↓
          Verify
             ↓
       ┌─────┴─────┐
       ↓           ↓
    Success      Failed
       ↓           ↓
    Resolve     Resolve
```

More advanced recovery workflows can combine retries, event recovery, transaction verification, and state reconciliation.

See:

**[Recovery Workflows →](./recovery-workflows.md)**

---

## Recover and SolydFlow Truth

Recover and Truth have different responsibilities.

**Recover** focuses on getting an unresolved transaction back into a reliable state.

**Truth** focuses on determining and maintaining the authoritative state of the transaction.

Conceptually:

```text id="6m3v8q"
             Transaction
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
      Recover              Truth
        ↓                   ↓
 Resolve Issue       Determine State
        └─────────┬─────────┘
                  ↓
          Reliable Transaction
```

This separation allows recovery mechanisms to work together with SolydFlow's transaction verification, consensus, ledger, and reconciliation capabilities.

---

## Recover and Enforce

Recover resolves payment uncertainty.

Enforce uses reliable transaction and entitlement state to ensure that application access follows the configured rules.

```text id="8k5m2v"
Payment
   ↓
Recover
   ↓
Truth
   ↓
Transaction State
   ↓
Entitlement
   ↓
Enforce
   ↓
Application Access
```

This creates a broader revenue infrastructure flow:

```text id="4x9q7n"
Payment
   ↓
Recover
   ↓
Truth
   ↓
Entitlement
   ↓
Enforce
   ↓
Access
```

---

## Designing for Failure

SolydFlow assumes that payment failures are not exceptional edge cases.

They are part of the normal operating environment of distributed payment systems.

Your application should therefore be prepared for:

```text id="3v6k1m"
✓ Delayed responses
✓ Missing events
✓ Duplicate events
✓ Temporary provider failures
✓ Pending transactions
✓ State mismatches
✓ Interrupted payment flows
✓ Provider outages
```

Recover provides infrastructure for handling these conditions without forcing every application to build the same mechanisms independently.

---

## Recommended Application Architecture

Your application should generally rely on SolydFlow for the payment transaction lifecycle rather than attempting to determine payment success solely from client-side behavior.

```text id="7m2x8q"
                    Your Application
                           │
                           ↓
                       SolydFlow
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
          Payment        Recover        Truth
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                      Transaction
                           ↓
                       Entitlement
                           ↓
                          Access
```

This architecture allows payment processing, recovery, transaction verification, and entitlement management to remain centralized.

---

## Key Principle

> **A payment is not truly resolved simply because a payment request was sent or a single event was received.**

Recover helps SolydFlow deal with the gap between what should have happened and what the application currently knows.

```text id="1q8m4v"
What happened?
      ↓
What does the application know?
      ↓
     Recover
      ↓
   Verification
      ↓
Reliable State
      ↓
Entitlement
```

The objective is simple:

**Help customers receive what they paid for, while giving developers a reliable way to handle payment failures and uncertainty.**

