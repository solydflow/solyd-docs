# Smart Routing

Smart Routing determines which payment provider should handle a payment based on the transaction, customer, application, and provider configuration.

Instead of requiring your application to decide:

```text id="m7q3k8"
Which provider?
     ↓
Paystack?
Flutterwave?
Stripe?
Other?
```

SolydFlow can provide a unified routing layer:

```text id="q8r4m2"
Payment Request
      ↓
   SolydFlow
      ↓
 Smart Routing
      ↓
Selected Provider
      ↓
Payment
```

This allows the application to work with SolydFlow rather than implementing provider-selection logic independently.

---

# Why Smart Routing Matters

Different payment providers can have different strengths.

A provider may support:

* A particular country
* A particular currency
* A particular payment method
* A particular transaction type
* A particular customer region

For an application operating across multiple markets, choosing the right provider can become application logic.

Without a routing layer:

```text id="x5m8r3"
Your Application
      │
      ├── Nigeria → Provider A
      ├── Kenya → Provider B
      ├── International → Provider C
      └── Fallback → Provider D
```

With SolydFlow:

```text id="v7q3n5"
Your Application
      ↓
   SolydFlow
      ↓
 Smart Routing
      ↓
Appropriate Provider
```

---

# Routing Is Separate From Transaction Truth

Smart Routing decides **where a payment should be attempted**.

Truth determines **what happened to the transaction**.

These are different responsibilities.

```text id="k4m8q2"
Routing
"What provider should handle this?"

Truth
"What actually happened?"
```

For example:

```text id="m8q3r5"
Payment Request
      ↓
Smart Routing
      ↓
Provider A
      ↓
Payment
      ↓
Truth
      ↓
Transaction State
```

This separation becomes especially important when a provider becomes unavailable after receiving a payment request.

---

# Routing and Provider Availability

A provider may be configured but temporarily unavailable.

For example:

```text id="q7n3m8"
Provider A
└── Available

Provider B
└── Available

Provider C
└── Unavailable
```

The routing layer can take provider availability into account when selecting a route.

Conceptually:

```text id="x4m8r3"
Payment
   ↓
Available Providers
   ↓
Routing Rules
   ↓
Selected Provider
```

Availability should not be confused with transaction success.

A provider being available does not guarantee that a particular transaction will succeed.

---

# Routing Inputs

The exact routing inputs depend on SolydFlow's supported provider configuration, but routing can conceptually consider information such as:

* Country or region
* Currency
* Payment method
* Product or package
* Provider availability
* Application configuration
* Provider capabilities
* Transaction requirements

For example:

```text id="m5q8k3"
Country: Nigeria
Currency: NGN
Payment Method: Card
       ↓
Routing
       ↓
Compatible Provider
```

The routing decision should be based on supported configuration rather than assumptions about a provider.

---

# Routing by Region

Different providers may be appropriate for different markets.

For example:

```text id="r8m3q5"
Nigeria
   ↓
Provider A

Kenya
   ↓
Provider B

International
   ↓
Provider C
```

The application should not need to maintain a separate provider-selection implementation for each region.

Instead:

```text id="k7q3m8"
Application
    ↓
SolydFlow
    ↓
Region
    ↓
Provider Selection
```

This becomes particularly useful as applications expand into additional markets.

---

# Routing by Currency

Currency can also influence provider selection.

For example:

```text id="v4m8q2"
NGN
 ↓
Provider A

KES
 ↓
Provider B

USD
 ↓
Provider C
```

The important principle is that the selected provider must support the requested transaction requirements.

A routing decision should not simply choose a provider that is available; it should choose one that can actually process the intended transaction.

---

# Routing by Payment Method

Payment method availability can differ between providers.

For example:

```text id="q5n8m3"
Payment Method
      ↓
Provider Capabilities
      ↓
Compatible Provider
```

A routing configuration may therefore distinguish between:

* Card
* Bank transfer
* Mobile money
* Other supported payment methods

The actual available methods depend on the connected providers and SolydFlow's current integrations.

---

# Routing by Provider Capabilities

A provider may support a particular combination of:

```text id="m7r3q8"
Country
Currency
Payment Method
Transaction Type
```

The routing layer can use provider capability information to determine whether a provider is eligible for the transaction.

Conceptually:

```text id="x8m4k2"
Payment Requirements
       ↓
Provider Capabilities
       ↓
Eligible Providers
       ↓
Routing
```

---

# Eligible Providers

Before selecting a provider, SolydFlow can conceptually narrow the provider list.

For example:

```text id="q3m8r5"
Configured Providers
        ↓
Capability Check
        ↓
Eligible Providers
        ↓
Routing Rules
        ↓
Selected Provider
```

This prevents routing a transaction to a provider that cannot support its requirements.

---

# Routing Rules

Routing rules determine how SolydFlow selects between eligible providers.

A simplified example:

```text id="k8q3m5"
IF country = Nigeria
AND currency = NGN
THEN Provider A
```

Another example:

```text id="m4r8n2"
IF country = Kenya
AND payment_method = mobile_money
THEN Provider B
```

The actual configuration and syntax depend on the SolydFlow implementation.

The important concept is that routing decisions are centralized rather than embedded throughout the application.

---

# Default Provider

An application may have a preferred provider.

For example:

```text id="v7m3q8"
Payment
   ↓
Preferred Provider
   ↓
Provider A
```

If that provider is eligible and available, the routing system can use it according to the configured routing rules.

A default provider should not necessarily override capability or availability requirements.

---

# Provider Priority

Multiple providers can potentially satisfy the same requirements.

For example:

```text id="q8m4r3"
Eligible Providers

1. Provider A
2. Provider B
3. Provider C
```

Routing rules can establish which provider should be preferred.

```text id="x5n8m2"
Eligible Providers
       ↓
Priority
       ↓
Provider A
```

Provider priority should remain configurable rather than hard-coded into the application.

---

# Smart Routing and Failover

Smart Routing and Provider Failover are related but different.

### Smart Routing

Determines the provider to use before the payment is attempted.

```text id="m7q3r8"
Payment
   ↓
Routing
   ↓
Provider A
```

### Provider Failover

Determines what to do when the selected provider cannot successfully complete the intended operation.

```text id="k4m8q3"
Provider A
   ↓
Failure / Unavailability
   ↓
Failover Decision
   ↓
Provider B
```

See:

[Provider Failover →](./provider-failover.md)

---

# Failover Requires Transaction Awareness

A provider failure does not always mean that the payment did not happen.

Consider:

```text id="q8r3m5"
Application
   ↓
Provider A
   ↓
Payment Request
   ↓
Timeout
```

The application does not necessarily know whether Provider A processed the payment.

Blindly routing the same payment to Provider B could result in:

```text id="x7m4n2"
Provider A → Payment Successful
Provider B → Payment Successful

        ↓

Potential Duplicate Payment
```

Therefore:

```text id="v5m8q3"
Provider Failure
      ↓
Transaction Investigation
      ↓
Truth
      ↓
Routing / Failover Decision
```

This is one of the key reasons SolydFlow separates routing from transaction truth.

---

# Smart Routing and Recover

When the outcome of a provider request is uncertain, recovery may need to establish the transaction state before another provider is selected.

```text id="m3q8r5"
Provider A
   ↓
Uncertain Outcome
   ↓
Recover
   ↓
Truth
   ↓
Routing Decision
```

This helps prevent duplicate payment attempts.

See:

[Transaction Recovery →](../recover/transaction-recovery.md)

---

# Smart Routing and Transaction States

Routing decisions can depend on the current transaction state.

For example:

```text id="k8m3q5"
Created
   ↓
Routing
   ↓
Provider Selected
   ↓
Processing
```

Once a transaction is already being processed by a provider, changing providers requires additional care.

A transaction that is:

```text id="q7r3m8"
Pending
```

should not automatically be treated as:

```text id="x5m8q2"
Failed
```

and routed to another provider.

---

# Smart Routing and Finality

Transaction finality helps determine when a transaction should no longer be rerouted.

For example:

```text id="m4q8r3"
Provider A
   ↓
Successful
   ↓
Final
```

Once the transaction has reached the relevant final state, routing should not create another payment attempt for the same transaction.

See:

[Transaction Finality →](./transaction-finality.md)

---

# Smart Routing and Multi-Provider Applications

Consider an application that supports three providers:

```text id="v8m3q5"
                 SolydFlow
                /    |    \
               ↓     ↓     ↓
          Provider A B     C
```

The application can make a single request:

```text id="q5r8m3"
Create Payment
```

SolydFlow can then determine the appropriate provider.

```text id="k7m3q8"
Create Payment
      ↓
Smart Routing
      ↓
Provider B
      ↓
Payment
```

This keeps provider-selection logic out of the application.

---

# Smart Routing and the Developer Experience

Without a unified routing layer, an application may need logic such as:

```text id="m8q3r5"
if country == "NG":
    use_provider_a()

elif country == "KE":
    use_provider_b()

elif currency == "USD":
    use_provider_c()
```

As the number of providers and markets grows, this logic becomes increasingly difficult to maintain.

With SolydFlow:

```text id="x4m8n2"
Application
      ↓
SolydFlow Payment API
      ↓
Smart Routing
```

The application can remain focused on its product.

---

# Routing Configuration

Routing behavior should be controlled through configuration rather than requiring application code changes for every provider-selection change.

Conceptually:

```text id="q8m3r5"
Application
      ↓
SolydFlow Configuration
      ↓
Routing Rules
      ↓
Providers
```

This allows a team to change supported providers or routing preferences without rebuilding the application's payment integration.

The exact configuration mechanism depends on the SolydFlow implementation.

---

# Routing and Products

Different products may have different payment requirements.

For example:

```text id="m7r3q8"
Product A
└── Local payments

Product B
└── International payments
```

Routing can take product requirements into account where supported.

This allows the same application to use different payment infrastructure for different revenue flows.

---

# Routing and Packages

Packages can also represent different commercial configurations.

For example:

```text id="k5m8q3"
Basic Package
└── Local Currency

Premium Package
└── International Currency
```

The routing layer can use the resulting transaction requirements to identify eligible providers.

See:

[Packages →](../concepts/packages.md)

---

# Routing and Regional Commerce

Smart Routing becomes increasingly important when an application operates across multiple countries.

For example:

```text id="q7n3m8"
                    Application
                        ↓
                    SolydFlow
                        ↓
                    Routing
              ┌─────────┼─────────┐
              ↓         ↓         ↓
           Nigeria    Kenya    International
              ↓         ↓         ↓
           Provider A Provider B Provider C
```

This allows the payment infrastructure to evolve as the application's geographic footprint grows.

---

# Routing and Provider Credentials

A provider can only be used if it has been properly configured for the project.

Conceptually:

```text id="x8m4r2"
Project
   ↓
Provider Configuration
   ↓
Credentials
   ↓
Provider Available for Routing
```

Routing should therefore operate only on providers that are configured and eligible for the relevant project.

See:

[Credential Security →](../security/credential-security.md)

---

# Routing and Security

Routing decisions should not expose provider credentials to the client application.

A simplified architecture is:

```text id="m5q8n3"
Client
   ↓
SolydFlow API
   ↓
Routing
   ↓
Provider Credentials
   ↓
Provider
```

Provider credentials should remain protected within the appropriate server-side infrastructure.

See:

[API Keys →](../security/api-keys.md)

[Credential Security →](../security/credential-security.md)

---

# Routing Does Not Mean Random Provider Selection

Smart Routing is not simply:

```text id="q3m8r5"
Choose Random Provider
```

It is closer to:

```text id="k8n4m2"
Payment Requirements
       ↓
Provider Eligibility
       ↓
Provider Availability
       ↓
Routing Rules
       ↓
Selected Provider
```

The purpose is to make a deliberate provider-selection decision.

---

# Routing Does Not Guarantee Payment Success

Even a correctly routed payment can fail.

For example:

```text id="v7m3q8"
Routing
   ↓
Provider A
   ↓
Payment
   ↓
Declined
```

Smart Routing determines where the payment should be attempted.

It does not guarantee that the provider will approve or complete the payment.

Recovery, retries, failover, and Truth handle the consequences of payment outcomes.

---

# A Complete Routing Example

Consider a customer making a payment from Nigeria.

### Payment request

```text id="m4q8r3"
Customer
   ↓
Application
   ↓
SolydFlow
```

### Requirements

```text id="x7m3n5"
Country: Nigeria
Currency: NGN
Payment Method: Card
```

### Provider eligibility

```text id="q8m2r4"
Provider A → Eligible
Provider B → Eligible
Provider C → Not Eligible
```

### Routing

```text id="k5r8m3"
Provider A
   ↓
Preferred Route
```

### Payment

```text id="v3q7m8"
Provider A
   ↓
Payment Request
```

### Result

```text id="m8n3r5"
Provider A
   ↓
Successful
   ↓
Truth
   ↓
Enforce
```

The application does not need to implement the provider-selection logic itself.

---

# Routing When a Provider Becomes Unavailable

Suppose the preferred provider is unavailable:

```text id="q7m4k8"
Provider A
└── Unavailable
```

SolydFlow can evaluate the remaining eligible providers:

```text id="x5r8m3"
Provider A → Unavailable
Provider B → Available
Provider C → Available
```

The routing decision can then select the appropriate alternative according to the configured rules.

```text id="v8m3q5"
Eligible Providers
       ↓
Routing Rules
       ↓
Provider B
```

If the original payment request has already been sent to Provider A, however, the system must first account for the transaction's uncertain state before safely failing over.

That situation belongs to:

[Provider Failover →](./provider-failover.md)

---

# Observability

Routing decisions should be observable.

When investigating a payment, it can be useful to know:

```text id="m3q8r5"
Transaction
   ↓
Routing Decision
   ↓
Selected Provider
   ↓
Reason / Rule
   ↓
Payment Result
```

This makes it easier to understand why a particular provider was selected.

The exact observability features depend on the SolydFlow implementation.

---

# Routing and Auditability

A routing decision can become important when investigating a transaction.

For example:

```text id="k8m3q4"
Transaction TX-123

Selected Provider:
Provider A

Routing Context:
Nigeria / NGN / Card

Result:
Successful
```

Keeping this information associated with the transaction can make operational investigations easier.

---

# The Smart Routing Model

The overall process is:

```text id="q7m3r8"
Payment Request
       ↓
Determine Requirements
       ↓
Find Eligible Providers
       ↓
Check Availability
       ↓
Apply Routing Rules
       ↓
Select Provider
       ↓
Create / Process Payment
       ↓
Observe Result
       ↓
Truth
```

If the selected provider cannot safely complete the payment:

```text id="x4m8n3"
Provider Problem
       ↓
Is Outcome Known?
      / \
    Yes  No
     ↓    ↓
   Truth Recover
          ↓
        Truth
          ↓
      Failover
```

---

# Key Principles

### 1. Centralize provider selection

The application should not need to maintain provider-selection logic for every market.

### 2. Route only to eligible providers

The provider must support the transaction requirements.

### 3. Consider provider availability

An unavailable provider should not be treated as an available route.

### 4. Separate routing from truth

Selecting a provider is different from determining what happened to the payment.

### 5. Do not blindly fail over

An uncertain provider response may mean the original payment was actually processed.

### 6. Keep routing configurable

Provider-selection rules should not require application code changes whenever possible.

### 7. Make routing observable

Important routing decisions should be traceable to the transaction.

### 8. Protect provider credentials

Routing should happen within secure infrastructure rather than exposing provider credentials to clients.

---

# The Core Principle

> **Smart Routing chooses the right payment path before a transaction is processed; Truth determines what happened after the transaction is processed.**

The simplified model is:

```text id="m8q3r5"
Payment
   ↓
Requirements
   ↓
Eligibility
   ↓
Routing
   ↓
Provider
   ↓
Transaction
   ↓
Truth
   ↓
Enforce
```

This allows applications to integrate with multiple payment providers without turning provider selection into application-specific payment logic.

---

## Related Documentation

### Enforce

[Enforce Overview →](./overview.md)

[Provider Failover →](./provider-failover.md)

[Transaction Finality →](./transaction-finality.md)

[Entitlement Enforcement →](./entitlement-enforcement.md)

### Truth

[Truth Overview →](../truth/overview.md)

[Transaction Verification →](../truth/transaction-verification.md)

[Consensus Engine →](../truth/consensus-engine.md)

[Reconciliation →](../truth/reconciliation.md)

### Recovery

[Recovery Overview →](../recover/overview.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Retries →](../recover/retries.md)

### Concepts

[Projects →](../concepts/projects.md)

[Products →](../concepts/products.md)

[Packages →](../concepts/packages.md)

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

### Security

[API Keys →](../security/api-keys.md)

[Credential Security →](../security/credential-security.md)

---

<!-- ## Related Content

Continue with Provider Failover:

[Provider Failover →](./provider-failover.md) -->

