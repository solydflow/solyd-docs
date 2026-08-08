# Provider Failover

Provider failover allows SolydFlow to move a payment operation away from an unavailable or unsuitable payment provider when another eligible provider can safely handle it.

The important word is **safely**.

A provider failure does not always mean that the payment failed. A timeout, connection failure, or missing response may occur after the provider has already processed the transaction.

Therefore, failover is not simply:

```text
Provider A failed
      ↓
Use Provider B
```

It is:

```text
Provider A
    ↓
Unexpected Outcome
    ↓
Determine Transaction State
    ↓
Is another attempt safe?
    ↓
Provider B
```

This distinction helps protect applications from duplicate payments.

---

# Why Provider Failover Matters

Applications that depend on a single payment provider inherit that provider's availability.

For example:

```text
Application
     ↓
Provider A
     X
Unavailable
```

The application may be unable to accept payments even though another configured provider could process them.

With SolydFlow:

```text
                 SolydFlow
                    │
              ┌─────┴─────┐
              ↓           ↓
         Provider A   Provider B
```

If Provider A becomes unavailable, SolydFlow can evaluate whether Provider B can safely take over.

---

# Failover Is Not a Simple Retry

A retry sends another attempt through the same provider.

```text
Retry:

Provider A
   ↓
Attempt 1
   X
Attempt 2
```

Failover changes the provider:

```text
Failover:

Provider A
   ↓
Attempt
   X
   ↓
Provider B
   ↓
New Attempt
```

These are different operations and carry different risks.

---

# The Most Important Failover Problem

Consider this situation:

```text
Application
    ↓
Provider A
    ↓
Payment Request
    ↓
Timeout
```

The application receives no useful response.

There are at least two possibilities:

```text
Possibility 1
Provider A did not process the payment.

Possibility 2
Provider A processed the payment,
but the response was lost.
```

If SolydFlow immediately sends the same payment to Provider B:

```text
Provider A → Successful
Provider B → Successful
```

the customer may be charged twice.

Therefore, SolydFlow must distinguish between:

```text
Known Failure
```

and:

```text
Unknown Outcome
```

before performing failover.

---

# Failover and Truth

Truth provides the transaction state that failover decisions depend on.

The relationship is:

```text
Provider Event
      ↓
Transaction Evidence
      ↓
Truth
      ↓
Known State
      ↓
Failover Decision
```

For example:

```text
Provider A
   ↓
Timeout
   ↓
Recovery / Verification
   ↓
Truth
   ↓
Payment Failed
   ↓
Failover Safe
```

But:

```text
Provider A
   ↓
Timeout
   ↓
Verification
   ↓
Payment Successful
   ↓
Do Not Fail Over
```

Truth therefore protects the failover process from making assumptions about uncertain transactions.

---

# Known Failure vs Unknown Outcome

This distinction is central to provider failover.

## Known Failure

The provider definitively reports that the payment was not completed.

```text
Provider A
   ↓
Payment Declined
   ↓
Known Failure
```

If another provider is eligible, failover may be possible.

```text
Known Failure
      ↓
Failover Evaluation
      ↓
Provider B
```

---

## Unknown Outcome

The system cannot determine whether the provider completed the payment.

```text
Provider A
   ↓
Timeout
   ↓
Unknown Outcome
```

The correct next step is not necessarily another payment attempt.

```text
Unknown Outcome
      ↓
Recovery
      ↓
Verification
      ↓
Truth
```

Only after the outcome is sufficiently established should another payment attempt be considered.

---

# Failover Decision Flow

A simplified decision process is:

```text
Payment Attempt
      ↓
Provider Problem
      ↓
Determine Outcome
      │
      ├── Successful
      │      ↓
      │   Stop
      │
      ├── Known Failure
      │      ↓
      │   Evaluate Failover
      │
      └── Unknown
             ↓
          Recover
             ↓
          Verify
             ↓
           Truth
             ↓
       Evaluate Failover
```

This is safer than blindly switching providers after every error.

---

# When Failover Can Be Useful

Failover can be useful when a provider:

* Is unavailable
* Experiences an infrastructure failure
* Cannot process the requested payment method
* Cannot support the required currency or region
* Returns a known non-completion outcome
* Becomes temporarily unsuitable for the transaction

The exact conditions depend on the provider integration and SolydFlow's routing configuration.

---

# Provider Availability

A provider may be configured but temporarily unavailable.

For example:

```text
Provider A
└── Configured
└── Unavailable

Provider B
└── Configured
└── Available
```

Failover can evaluate Provider B as a possible alternative.

```text
Provider A
    X
    ↓
Failover
    ↓
Provider B
```

However, availability alone does not make a provider eligible.

The provider must also support the transaction requirements.

---

# Provider Eligibility

Suppose:

```text
Provider A
└── Unavailable

Provider B
└── Available
└── Supports NGN

Provider C
└── Available
└── Does not support NGN
```

For an NGN transaction:

```text
Eligible:

Provider B
```

Provider C should not be selected merely because it is operational.

The failover process should therefore use the same provider capability and routing principles established by Smart Routing.

See:

[Smart Routing →](./smart-routing.md)

---

# Failover and Smart Routing

Smart Routing and failover work together.

### Smart Routing

Chooses the initial provider.

```text
Payment
   ↓
Smart Routing
   ↓
Provider A
```

### Failover

Handles the situation where the selected provider cannot safely complete the operation.

```text
Provider A
   ↓
Provider Problem
   ↓
Failover
   ↓
Provider B
```

The combined flow is:

```text
Payment
   ↓
Smart Routing
   ↓
Provider A
   ↓
Problem
   ↓
Truth / Recovery
   ↓
Failover Evaluation
   ↓
Provider B
```

---

# Failover and Recovery

Recovery is particularly important when the first provider's outcome is uncertain.

For example:

```text
Provider A
   ↓
Timeout
   ↓
Unknown
```

Recovery can attempt to establish what actually happened.

```text
Unknown
   ↓
Recovery
   ↓
Verification
   ↓
Truth
```

The result may be:

```text
Successful
```

or:

```text
Failed
```

or another valid transaction state.

Only then can SolydFlow determine whether another provider should be used.

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

# Failover and Transaction Finality

Finality determines whether a transaction has reached a state where another payment attempt should no longer occur.

For example:

```text
Provider A
   ↓
Successful
   ↓
Final
```

There should be no failover payment.

By contrast:

```text
Provider A
   ↓
Known Failure
   ↓
Not Final as a Successful Payment
```

may permit a new attempt, subject to the configured rules.

See:

[Transaction Finality →](./transaction-finality.md)

---

# Failover and Duplicate Payments

Duplicate payment prevention is one of the most important considerations in failover.

Consider:

```text
Attempt 1
Provider A
   ↓
Timeout
```

If SolydFlow assumes failure:

```text
Attempt 2
Provider B
```

But Provider A actually completed:

```text
Provider A → Successful
Provider B → Successful
```

The customer has two successful transactions.

Therefore:

> **Failover should not be triggered solely because the original request returned an error or timeout.**

The transaction outcome must be considered.

---

# Transaction Identity During Failover

A failover attempt should remain associated with the appropriate application transaction.

Conceptually:

```text
Application Transaction
       │
       ├── Provider A Attempt
       │
       └── Provider B Attempt
```

This is different from creating two unrelated application transactions.

The transaction history should allow the system to understand:

```text
One Payment Intent
      ↓
Provider Attempt A
      ↓
Provider Attempt B
```

The exact transaction model depends on the SolydFlow implementation.

---

# Provider Attempt vs Transaction

It is useful to distinguish between:

```text
Transaction
```

and:

```text
Provider Attempt
```

For example:

```text
Transaction: TX-123

Attempts:
├── Provider A
│   └── Timeout
│
└── Provider B
    └── Successful
```

This allows the system to preserve the history of what happened without treating every provider attempt as a separate customer purchase.

---

# Failover and Webhooks

A provider may send a webhook after a timeout or other failed response.

For example:

```text
Provider A
   ↓
Payment Request
   ↓
Timeout
```

SolydFlow begins investigating:

```text
Timeout
   ↓
Recovery
```

Then the provider webhook arrives:

```text
Provider A
   ↓
Successful Webhook
```

The webhook may provide evidence that the original provider actually completed the transaction.

```text
Webhook
   ↓
Truth
   ↓
Successful
   ↓
Do Not Fail Over
```

This is why failover must work with webhook processing rather than operating independently.

See:

[Provider Webhooks →](../webhooks/provider-webhooks.md)

---

# Failover and Reconciliation

Sometimes the provider outcome cannot be established immediately.

Reconciliation can later compare the provider record with the SolydFlow transaction.

```text
Provider Record
      +
SolydFlow Record
      ↓
Reconciliation
      ↓
Transaction State
```

For example:

```text
SolydFlow
└── Unknown

Provider
└── Successful
```

The reconciliation result can prevent an unnecessary failover or help resolve a transaction after an earlier provider failure.

See:

[Reconciliation →](../truth/reconciliation.md)

---

# Failover and Webhook Failures

A provider may process a payment successfully while its webhook fails to reach SolydFlow.

```text
Provider
   ↓
Successful
   X
Webhook
```

SolydFlow may temporarily see:

```text
Pending
```

This is not necessarily a reason to fail over.

Instead:

```text
Pending
   ↓
Recovery
   ↓
Verification / Reconciliation
   ↓
Truth
```

This prevents missing webhook delivery from turning into a duplicate payment.

See:

[Failed Webhooks →](../recover/failed-webhooks.md)

---

# Failover and Provider Errors

Provider errors can have different meanings.

For example:

```text
Payment Declined
```

may indicate that the payment was not completed.

While:

```text
Request Timeout
```

may indicate that the outcome is unknown.

The failover system should therefore distinguish between error categories rather than treating every provider error identically.

See:

[Provider Errors →](../troubleshooting/provider-errors.md)

---

# Failover and Payment Methods

A fallback provider must support the payment method being used.

For example:

```text
Original Payment
└── Mobile Money
```

If Provider A fails, Provider B must be able to process the required mobile-money transaction before it can become a valid failover candidate.

```text
Provider A
   X
   ↓
Eligible Providers
   ↓
Provider B
```

Provider availability and payment-method compatibility should both be evaluated.

---

# Failover and Currency

The same principle applies to currency.

For example:

```text
Transaction
└── NGN
```

A provider that cannot process NGN should not become the failover provider merely because it is available.

```text
Available ≠ Eligible
```

The failover candidate must satisfy the transaction requirements.

---

# Failover and Region

Regional availability can also affect failover.

For example:

```text
Customer
└── Kenya

Provider A
└── Unavailable

Provider B
└── Supports Kenya

Provider C
└── Does not support Kenya
```

Provider B may be an eligible alternative.

```text
Kenya
  ↓
Provider A unavailable
  ↓
Provider B
```

---

# Failover Should Be Controlled

Failover should not continue indefinitely.

A simplified model is:

```text
Provider A
   ↓
Failure
   ↓
Provider B
   ↓
Failure
   ↓
Provider C
   ↓
Failure
   ↓
Stop
```

The application needs a bounded and observable process rather than an uncontrolled chain of payment attempts.

The exact limits depend on SolydFlow configuration.

---

# Failover and Customer Experience

A well-designed failover mechanism can reduce the impact of provider outages.

Without failover:

```text
Provider A
   X
   ↓
Customer
└── Payment unavailable
```

With safe failover:

```text
Provider A
   X
   ↓
SolydFlow
   ↓
Provider B
   ↓
Payment
```

The customer can potentially complete the payment without needing to understand which provider processed it.

---

# Failover Should Be Transparent to the Application

The application should ideally interact with the unified SolydFlow payment layer rather than implementing provider-specific failover logic.

Instead of:

```text
try Provider A
if timeout:
    verify Provider A
    try Provider B
if Provider B fails:
    try Provider C
```

the application can work with:

```text
SolydFlow
   ↓
Routing
   ↓
Failover
   ↓
Transaction
```

This keeps provider complexity inside the revenue infrastructure layer.

---

# Failover and Entitlements

Failover should not grant an entitlement simply because a provider attempt was made.

For example:

```text
Provider A
   ↓
Failed
   ↓
Provider B
   ↓
Successful
```

The entitlement should be based on the resulting trusted transaction state.

```text
Provider Attempts
       ↓
Truth
       ↓
Final Transaction
       ↓
Entitlement
```

This prevents provider attempts from being confused with successful purchases.

See:

[Entitlement Enforcement →](./entitlement-enforcement.md)

---

# Failover and the Transaction Ledger

Provider attempts should remain traceable.

For example:

```text
Transaction TX-123

Created
   ↓
Provider A Selected
   ↓
Provider A Timeout
   ↓
Verification
   ↓
Failover Approved
   ↓
Provider B Selected
   ↓
Provider B Successful
```

This provides useful context for investigating the transaction later.

See:

[Transaction Ledger →](../truth/transaction-ledger.md)

---

# Example: Safe Failover

Consider a customer making a payment.

### Initial routing

```text
Payment
   ↓
Smart Routing
   ↓
Provider A
```

### Provider failure

```text
Provider A
   ↓
Known Decline
```

### Failover evaluation

```text
Known Failure
   ↓
Provider B Eligible?
   ↓
Yes
```

### Second attempt

```text
Provider B
   ↓
Payment
   ↓
Successful
```

### Truth

```text
Provider Evidence
      ↓
Truth
      ↓
Successful
```

### Enforcement

```text
Successful
   ↓
Final
   ↓
Entitlement
```

The customer's payment was completed through Provider B without requiring the application to implement the provider-switching logic itself.

---

# Example: Unsafe Immediate Failover

Consider another payment.

### Initial attempt

```text
Provider A
   ↓
Payment Request
   ↓
Timeout
```

A naive system does:

```text
Timeout
   ↓
Provider B
```

But later:

```text
Provider A
   ↓
Successful Webhook
```

Now:

```text
Provider A → Successful
Provider B → Successful
```

This creates a duplicate payment risk.

A safer system does:

```text
Timeout
   ↓
Unknown Outcome
   ↓
Recovery
   ↓
Verification / Reconciliation
   ↓
Truth
```

Only after the transaction outcome is sufficiently established should failover be considered.

---

# Example: Provider Outage Before Processing

Consider a provider that is known to be unavailable before a payment request is sent.

```text
Provider A
└── Unavailable
```

No payment has been attempted through Provider A.

Routing can therefore select another eligible provider:

```text
Provider A
   X
   ↓
Smart Routing / Failover
   ↓
Provider B
```

This is simpler and safer than failing over after an uncertain payment attempt.

---

# Failover Decision Matrix

Conceptually:

| Provider condition                  | Transaction outcome    | Failover                 |
| ----------------------------------- | ---------------------- | ------------------------ |
| Provider unavailable before attempt | No transaction started | Potentially yes          |
| Known payment failure               | Failed                 | Potentially yes          |
| Timeout                             | Unknown                | Verify first             |
| Network error after request         | Unknown                | Verify first             |
| Successful response                 | Successful             | No                       |
| Successful webhook                  | Successful             | No                       |
| Provider reports pending            | Pending                | Do not blindly fail over |
| Final successful transaction        | Final                  | No                       |

The exact behavior depends on the provider and transaction configuration.

---

# The Failover Model

The overall process is:

```text
Payment
   ↓
Smart Routing
   ↓
Provider A
   ↓
Provider Problem
   ↓
Classify Outcome
      │
      ├── Successful
      │      ↓
      │     Stop
      │
      ├── Known Failure
      │      ↓
      │   Check Eligibility
      │      ↓
      │   Failover
      │
      └── Unknown
             ↓
          Recovery
             ↓
         Verification
             ↓
            Truth
             ↓
       Failover Decision
```

---

# Key Principles

### 1. Failover is not blind retry

Changing providers requires a separate decision from retrying the same provider.

### 2. Unknown is not failed

A timeout or missing response may mean the provider processed the payment.

### 3. Protect against duplicates

Never assume a payment failed simply because the client did not receive a successful response.

### 4. Use Truth before switching providers

Transaction evidence should inform the failover decision.

### 5. Consider provider eligibility

The alternative provider must support the transaction's requirements.

### 6. Keep failover bounded

Do not create an uncontrolled chain of payment attempts.

### 7. Preserve transaction history

Provider attempts and failover decisions should remain traceable.

### 8. Keep the application simple

Provider failover should be handled by the revenue infrastructure layer rather than duplicated across every application.

---

# The Core Principle

> **Provider failover is not about finding another provider quickly; it is about finding another provider safely.**

The essential flow is:

```text
Provider Problem
      ↓
What happened?
      ↓
Truth
      ↓
Is another attempt safe?
      ↓
Eligible Provider
      ↓
Failover
      ↓
Final Transaction State
```

This is what allows SolydFlow to improve payment resilience without turning provider outages into duplicate-payment problems.

---

## Related Documentation

### Enforce

[Enforce Overview →](./overview.md)

[Smart Routing →](./smart-routing.md)

[Transaction Finality →](./transaction-finality.md)

[Entitlement Enforcement →](./entitlement-enforcement.md)

### Truth

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Transaction Ledger →](../truth/transaction-ledger.md)

[State Mismatches →](../truth/state-mismatches.md)

[Reconciliation →](../truth/reconciliation.md)

### Recover

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

### Webhooks

[Provider Webhooks →](../webhooks/provider-webhooks.md)

[Event Handling →](../webhooks/event-handling.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

### Troubleshooting

[Provider Errors →](../troubleshooting/provider-errors.md)
