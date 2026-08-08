# Transaction Finality

Transaction finality defines when a payment transaction has reached a state that SolydFlow can safely treat as settled for a particular decision.

A payment can move through several states before its outcome becomes clear:

```text
Created
   ↓
Pending
   ↓
Processing
   ↓
Successful
```

But reaching a provider-reported state is not always enough to determine whether SolydFlow should:

* Grant an entitlement
* Stop retrying
* Stop recovery
* Prevent another payment attempt
* Allow provider failover
* Treat the transaction as complete

Finality provides the boundary between an outcome that may still change and an outcome that can safely drive enforcement.

---

# Why Finality Matters

Consider a payment that is currently pending:

```text id="a7m3k8"
Payment
   ↓
Pending
```

The payment may eventually become:

```text
Successful
```

or:

```text
Failed
```

If the application treats `Pending` as final, it could make an incorrect decision.

For example:

```text id="q5r8m2"
Pending
   ↓
Grant Premium Access
```

The customer could receive access before the payment is actually established as successful.

Finality helps prevent this kind of premature enforcement.

---

# Finality and Transaction State

Transaction state describes **where the transaction currently is**.

Finality describes whether that state is sufficiently established for the decision being made.

Conceptually:

```text id="m8q3v5"
Transaction State
       ↓
Is the state final?
      / \
    No   Yes
    ↓     ↓
Continue  Enforce
evaluation
```

This means that state and finality should not be treated as the same concept.

See:

[Transaction States →](../concepts/transaction-states.md)

---

# A Transaction Can Be Non-Final

A transaction can have a known state while still being subject to change.

For example:

```text id="x7m4q8"
Transaction
└── Pending
```

The state is known:

```text
Pending
```

But the final outcome is not yet established.

```text id="r3n8m5"
Pending
   ↓
?
```

It may later become:

```text id="k8q3m2"
Successful
```

or:

```text id="v5m7r3"
Failed
```

Therefore, a non-final state should not automatically trigger actions that require a final outcome.

---

# Finality and Successful Transactions

A successful transaction may eventually become final for the relevant enforcement decision.

Conceptually:

```text id="m4q8r3"
Provider
   ↓
Successful
   ↓
Verification
   ↓
Final
```

Once the transaction has reached the required finality condition:

```text id="q7m3n8"
Final
   ↓
Entitlement Enforcement
```

The application can use the resulting transaction outcome with greater confidence.

The exact definition of finality depends on the transaction model and provider behavior supported by SolydFlow.

---

# Finality and Failed Transactions

Finality is not limited to successful transactions.

A transaction can also reach a final failed outcome.

For example:

```text id="x8m3q5"
Payment
   ↓
Declined
   ↓
Verified
   ↓
Final Failure
```

A final failure may allow SolydFlow to stop recovery or determine that another eligible payment attempt can be considered.

Conceptually:

```text id="m5r8k3"
Final Failure
     ↓
No Successful Entitlement
```

Whether a new attempt is permitted depends on the transaction and retry/failover rules.

---

# Finality and Unknown Outcomes

An unknown outcome should not normally be treated as final.

For example:

```text id="q3m8r5"
Payment Request
      ↓
Timeout
      ↓
Unknown
```

The system does not yet know whether the provider completed the transaction.

Therefore:

```text id="k7n4m2"
Unknown
   ↓
Recovery
   ↓
Verification
   ↓
Truth
```

The transaction should remain unresolved until sufficient evidence exists to establish its state.

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

# Finality and Truth

Truth determines the transaction state that can be relied upon from the available evidence.

Finality builds on that result.

```text id="v8m3q5"
Provider Evidence
      ↓
Verification
      ↓
Truth
      ↓
Transaction State
      ↓
Finality
```

For example:

```text id="m4q8r3"
Provider A → Successful
Provider B → Successful
Ledger     → Successful
      ↓
Truth
      ↓
Successful
      ↓
Final
```

The exact evidence and consensus rules are handled by the Truth layer.

See:

[Truth Overview →](../truth/overview.md)

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

---

# Finality and Provider Failover

Finality is particularly important when deciding whether another provider should process a payment.

Consider:

```text id="x7m3q8"
Provider A
   ↓
Timeout
```

The transaction is not necessarily failed.

Therefore:

```text id="r5m8n3"
Timeout
   ↓
Not Final
   ↓
Do Not Blindly Fail Over
```

Instead:

```text id="q8m3r5"
Timeout
   ↓
Recovery / Verification
   ↓
Truth
   ↓
Final State
   ↓
Failover Decision
```

This helps prevent duplicate payments.

See:

[Provider Failover →](./provider-failover.md)

---

# Finality and Smart Routing

Smart Routing selects the initial provider.

Finality helps determine when the resulting transaction should no longer be treated as an opportunity for another payment attempt.

For example:

```text id="m3q8r5"
Smart Routing
      ↓
Provider A
      ↓
Payment
      ↓
Successful
      ↓
Final
```

Once the transaction has reached the required final state, routing should not create another payment attempt for the same transaction.

See:

[Smart Routing →](./smart-routing.md)

---

# Finality and Recovery

Recovery deals with transactions whose outcomes need further investigation.

For example:

```text id="k8m3q5"
Pending
   ↓
Recovery
   ↓
Verification
   ↓
Successful
```

The transaction can then move toward finality.

```text id="v4m8r2"
Successful
   ↓
Final
```

If recovery instead establishes a failure:

```text id="q7m3n5"
Pending
   ↓
Recovery
   ↓
Failed
   ↓
Final Failure
```

Finality allows the recovery process to know when further investigation is no longer necessary for that outcome.

---

# Finality and Webhooks

Webhooks are an important source of transaction evidence, but webhook delivery itself does not necessarily define finality.

For example:

```text id="m8q3r5"
Provider
   ↓
Successful
   ↓
Webhook
```

SolydFlow can process the webhook and evaluate the transaction through the appropriate verification and Truth processes.

```text id="x5m7q3"
Webhook
   ↓
Verification
   ↓
Truth
   ↓
Finality
```

A missing webhook also does not necessarily mean the transaction failed.

```text id="r8q3m5"
Payment
   ↓
Webhook Missing
   ↓
Recovery / Verification
   ↓
Truth
```

See:

[Provider Webhooks →](../webhooks/provider-webhooks.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

---

# Finality and Entitlements

Entitlements represent what a customer is allowed to access.

A transaction should not grant a final entitlement merely because a payment attempt occurred.

For example:

```text id="k5m8q3"
Payment Attempt
      ↓
Pending
      ↓
No Final Entitlement
```

Once the transaction reaches the required final successful state:

```text id="m7q3r8"
Successful
      ↓
Final
      ↓
Entitlement
      ↓
Active
```

This creates a clear relationship between trusted revenue state and customer access.

See:

[Entitlement Enforcement →](./entitlement-enforcement.md)

---

# Finality and Entitlement Revocation

Finality can also matter when a transaction changes in a way that affects an existing entitlement.

For example:

```text id="q8m3r5"
Active Entitlement
      ↓
Transaction State Changes
      ↓
Verified Final Outcome
      ↓
Enforcement Decision
```

The application should not assume that every transaction state change immediately requires the same access decision.

The relevant final state should determine the enforcement action.

---

# Finality and Duplicate Prevention

One of the most important uses of finality is preventing multiple payment attempts from being treated as independent purchases.

Consider:

```text id="x7m4q8"
Transaction TX-123
       ↓
Provider A
       ↓
Timeout
```

If the transaction is still unresolved:

```text id="m5r8k3"
TX-123
└── Unknown
```

SolydFlow should investigate the transaction rather than automatically creating another successful purchase.

Once the outcome becomes final:

```text id="v8q3m5"
TX-123
└── Successful / Final
```

The system knows that another payment attempt should not be treated as a separate completion of the same transaction.

---

# Finality and Transaction Identity

Finality applies to the transaction being evaluated, not merely to an individual provider response.

Consider:

```text id="q4m8r3"
Transaction TX-123
       │
       ├── Provider A Attempt
       │
       └── Provider B Attempt
```

The transaction can contain multiple provider attempts while still representing one application payment operation.

The final transaction outcome should therefore be determined from the complete transaction evidence rather than from one isolated provider response.

---

# Finality and Provider Attempts

A provider attempt may have its own outcome:

```text id="m7q3r5"
Provider A
└── Timeout
```

while the overall transaction remains unresolved:

```text id="x8m4q2"
Transaction
└── Unknown
```

Later:

```text id="k5m8r3"
Provider A
└── Successful Webhook
```

The transaction can then be evaluated again:

```text id="q7n3m5"
Transaction
└── Successful
└── Final
```

This is why provider-attempt status and transaction finality should not be treated as interchangeable.

---

# Finality and Reconciliation

Reconciliation can provide evidence that helps resolve a transaction.

For example:

```text id="v8m3q5"
SolydFlow
└── Pending

Provider
└── Successful
```

Reconciliation may identify the discrepancy.

```text id="m4q8r3"
Reconciliation
      ↓
Evidence
      ↓
Truth
      ↓
Successful
      ↓
Final
```

See:

[Reconciliation →](../truth/reconciliation.md)

---

# Finality and the Transaction Ledger

The transaction ledger provides a history of transaction activity.

For example:

```text id="q5m8r3"
Transaction TX-123

Created
   ↓
Pending
   ↓
Provider Timeout
   ↓
Verification
   ↓
Successful
   ↓
Final
```

This history helps explain why SolydFlow reached a particular final state.

See:

[Transaction Ledger →](../truth/transaction-ledger.md)

---

# Finality Is Contextual

A transaction does not necessarily have one universal concept of finality for every possible operation.

For example, a state may be sufficient to:

```text
Stop a retry
```

while another decision may require stronger confirmation before:

```text
Granting an entitlement
```

Therefore, documentation and implementation should distinguish between:

* Transaction state
* Evidence
* Finality requirements
* Enforcement decision

The exact finality rules depend on the SolydFlow transaction model and the operation being performed.

---

# Finality Does Not Mean Immutability

Finality should not automatically be interpreted as meaning that a record can never change under any circumstances.

Instead, it means that the transaction has reached the required state for a particular system decision.

For example:

```text id="x8m3q5"
Final for payment enforcement
```

does not necessarily mean:

```text
Impossible for any later provider event to exist
```

A later event may still need to be recorded, investigated, or reconciled.

The important distinction is between:

```text id="m7q3r5"
Final for a decision
```

and:

```text
Historically impossible to receive new information
```

These are not necessarily the same thing.

---

# Finality and State Changes

A transaction may move through several states:

```text id="q4m8r3"
Created
  ↓
Pending
  ↓
Processing
  ↓
Successful
```

The system should evaluate each transition according to the rules for that transaction.

For example:

```text id="k8m3q5"
Pending
   ↓
Successful
   ↓
Finality Evaluation
   ↓
Enforcement
```

The finality evaluation is what determines whether the new state can drive the relevant downstream action.

---

# Finality Decision Flow

A simplified model is:

```text id="v5m8r3"
Transaction State
       ↓
Evidence Available?
      / \
    No   Yes
    ↓     ↓
Recover  Truth
          ↓
      Reliable State
          ↓
     Finality Check
          ↓
   ┌──────┴──────┐
   ↓             ↓
 Non-Final      Final
   ↓             ↓
 Continue      Enforce
 Evaluation
```

---

# Finality and Application Integration

The application should not need to reconstruct finality from raw provider responses.

Instead, it should consume the transaction state and enforcement result exposed by SolydFlow.

Conceptually:

```text id="m7q3r5"
Payment Infrastructure
       ↓
SolydFlow
       ↓
Transaction State
       ↓
Finality
       ↓
Application
```

This reduces provider-specific payment logic inside the application.

---

# Finality and Production Operations

When investigating a transaction, operators should be able to distinguish:

```text id="q8m3r5"
Current State
```

from:

```text
Final State
```

For example:

```text
Current:
Pending

Final:
Not established
```

versus:

```text
Current:
Successful

Final:
Established
```

This distinction makes operational debugging much clearer.

---

# Example: Pending Transaction

A customer starts a payment:

```text id="k5m8q3"
Customer
   ↓
Payment
   ↓
Provider
   ↓
Pending
```

SolydFlow should not immediately assume:

```text
Successful
```

Instead:

```text id="m8r3q5"
Pending
   ↓
Monitor / Recover
   ↓
Verify
   ↓
Truth
```

If the provider eventually confirms success:

```text id="x7q3m5"
Successful
   ↓
Final
   ↓
Entitlement
```

---

# Example: Timeout

A payment request times out:

```text id="v4m8q3"
Application
   ↓
Provider
   ↓
Timeout
```

The outcome is unknown:

```text id="q5r8m3"
Unknown
```

SolydFlow investigates:

```text id="m7n3q5"
Recovery
   ↓
Provider Verification
   ↓
Truth
```

If the provider did not process the payment:

```text id="x8q3m5"
Failed
   ↓
Final Failure
```

A safe retry or failover may then be considered according to the applicable rules.

---

# Example: Successful Payment

A provider reports success:

```text id="k4m8r3"
Provider
   ↓
Successful
```

SolydFlow evaluates the available evidence:

```text id="q7m3n5"
Successful
   ↓
Truth
   ↓
Finality
```

Once finality is established for entitlement enforcement:

```text id="m8q3r5"
Final
   ↓
Entitlement Enforcement
   ↓
Access Granted
```

---

# Example: Provider Failure

A provider becomes unavailable before processing begins:

```text id="x5m8q3"
Provider A
└── Unavailable
```

Because the payment has not been attempted through Provider A:

```text id="v7q3m5"
No Uncertain Transaction
```

SolydFlow can evaluate another eligible provider:

```text id="q8m3r5"
Provider B
   ↓
Payment
```

This is different from failing over after an uncertain payment attempt.

---

# Example: Provider Success After Timeout

A payment times out:

```text id="m4q8r3"
Provider A
   ↓
Timeout
```

Recovery begins:

```text id="k7m3q5"
Timeout
   ↓
Recovery
```

Later, the provider sends confirmation:

```text id="x8q3m5"
Provider A
   ↓
Successful Webhook
```

Truth establishes:

```text id="v5m8r3"
Successful
```

Finality is then evaluated:

```text id="q7n3m5"
Successful
   ↓
Final
```

The transaction should not be failed over merely because its original response was delayed.

---

# Finality and Enforce

The relationship between finality and Enforce is:

```text id="m8q3r5"
Truth
  ↓
Reliable Transaction State
  ↓
Finality
  ↓
Enforce
```

Enforce can then apply the appropriate action:

```text id="x5m8q3"
Final Successful
      ↓
Entitlement

Final Failure
      ↓
No Successful Entitlement

Non-Final
      ↓
Continue Evaluation
```

The exact enforcement behavior depends on the transaction and entitlement configuration.

---

# Key Principles

### 1. State is not automatically final

A transaction can have a known state while still being unresolved for an enforcement decision.

### 2. Unknown is not failure

A timeout or missing response may represent an unknown outcome.

### 3. Truth precedes finality

Finality should be evaluated using the transaction state established from appropriate evidence.

### 4. Finality protects against duplicate payments

An unresolved transaction should not automatically generate another payment attempt.

### 5. Finality protects entitlements

Customer access should be based on the appropriate final transaction outcome.

### 6. Finality supports failover

Provider switching should account for whether the original transaction is still unresolved or has reached a final outcome.

### 7. Finality is decision-oriented

A transaction being final for one operation does not necessarily mean that no later evidence can ever exist.

### 8. Preserve the transaction history

Finality decisions should remain traceable through the transaction record and ledger.

---

# The Core Principle

> **Finality is the point at which a transaction state is sufficiently established to safely drive the decision being made.**

The simplified flow is:

```text id="q8m3r5"
Provider Evidence
      ↓
Truth
      ↓
Transaction State
      ↓
Finality
      ↓
Enforce
      ↓
Application / Entitlement
```

This allows SolydFlow to make revenue and access decisions without treating every intermediate payment state as a completed outcome.

---

## Related Documentation

### Enforce

[Enforce Overview →](./overview.md)

[Smart Routing →](./smart-routing.md)

[Provider Failover →](./provider-failover.md)

[Entitlement Enforcement →](./entitlement-enforcement.md)

### Truth

[Truth Overview →](../truth/overview.md)

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Transaction Ledger →](../truth/transaction-ledger.md)

[Reconciliation →](../truth/reconciliation.md)

### Recover

[Recovery Overview →](../recover/overview.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

### Webhooks

[Webhooks Overview →](../webhooks/overview.md)

[Provider Webhooks →](../webhooks/provider-webhooks.md)

[Event Handling →](../webhooks/event-handling.md)

### Concepts

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

---

<!-- ## Related Content

Continue with Entitlement Enforcement:

[Entitlement Enforcement →](./entitlement-enforcement.md) -->

