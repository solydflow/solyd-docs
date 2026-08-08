# Payment Providers

SolydFlow connects your applications to payment providers while keeping provider-specific payment logic out of your application.

Instead of building your application around a single payment provider, you can configure supported providers through SolydFlow.

```text
Your Application
       ↓
   SolydFlow
       ↓
Payment Providers
├── Stripe
├── Paystack
├── Flutterwave
├── M-Pesa
├── Monnify
├── Apple
└── Google Play
```

This gives your application a consistent revenue layer while allowing the underlying payment infrastructure to vary by market and use case.

---

## Why Use Payment Providers Through SolydFlow?

Payment providers handle the actual payment processing.

However, integrating multiple providers directly into every application can create significant complexity.

For example:

```text
Application
├── Paystack Integration
├── Flutterwave Integration
├── Stripe Integration
├── Webhook Handling
├── Retry Logic
├── Transaction Reconciliation
└── Provider-specific Error Handling
```

When multiple applications need the same providers, the same complexity gets repeated.

```text
App A → Paystack + Stripe + Flutterwave

App B → Paystack + Stripe + Flutterwave

App C → Paystack + Stripe + Flutterwave
```

SolydFlow provides a layer between your applications and those providers.

```text
             Your Applications
                    │
                    ↓
                SolydFlow
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Paystack     Flutterwave     Stripe
```

---

## SolydFlow Is Not the Payment Provider

SolydFlow does not replace the underlying payment provider.

The provider remains responsible for processing the payment.

For example:

```text
Customer
   ↓
Your Application
   ↓
SolydFlow
   ↓
Payment Provider
   ↓
Payment Network
```

The provider handles the payment transaction.

SolydFlow manages the revenue infrastructure surrounding that transaction.

This distinction is important.

---

## What the Provider Handles

Depending on the provider, the payment provider may handle things such as:

* Payment processing
* Payment methods
* Provider-specific checkout
* Card processing
* Bank payments
* Mobile money
* Provider-side customer records
* Provider-side payment status
* Provider webhooks
* Provider compliance requirements

The exact capabilities depend on the provider.

See the documentation for the provider you intend to use.

---

## What SolydFlow Handles

SolydFlow sits above the provider layer to manage the application-facing revenue flow.

This can include:

* Connecting payment providers
* Associating purchases with your products and packages
* Tracking transactions
* Handling provider callbacks
* Recovering failed or incomplete transaction flows
* Verifying transaction state
* Maintaining a unified transaction view
* Managing entitlements
* Supporting provider routing and failover where configured

```text
Payment Provider
       ↓
Provider Transaction
       ↓
     SolydFlow
       ↓
Application Revenue State
       ↓
Entitlement
       ↓
Application Access
```

---

## One Application, Multiple Providers

You can connect multiple providers to the same project where supported.

For example:

```text
                  SolydFlow
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      Paystack    Flutterwave   Stripe
          │           │           │
          └───────────┼───────────┘
                      ↓
                 Transactions
```

This can be useful when serving customers across different markets.

For example:

```text
Nigeria
   ↓
Paystack / Flutterwave

United States
   ↓
Stripe

Kenya
   ↓
M-Pesa
```

The appropriate provider depends on your market, payment methods, business requirements, and configuration.

---

## Provider Configuration

A typical provider integration follows this pattern:

```text
1. Create or access your provider account
2. Obtain the required credentials
3. Connect the provider to SolydFlow
4. Configure the provider for your project
5. Configure your products and packages
6. Test the payment flow
7. Move to production
```

Your provider credentials should be handled securely.

See:

**[API Keys →](../security/api-keys.md)**

**[Credential Security →](../security/credential-security.md)**

---

## Provider Credentials

Payment providers generally require credentials to authenticate API requests.

Examples may include:

```text
API Key
Secret Key
Public Key
Merchant ID
Webhook Secret
```

The exact credentials depend on the provider.

Never expose secret credentials in frontend application code.

```text
❌ Browser
   ↓
Secret API Key

✅ Secure Server / SolydFlow Configuration
   ↓
Provider Credentials
```

See:

**[Credential Security →](../security/credential-security.md)**

---

## Provider Webhooks

Payment providers communicate payment events through webhooks.

For example:

```text
Payment Provider
      │
      │ Webhook
      ↓
   SolydFlow
      ↓
Transaction State
      ↓
Entitlement
      ↓
Application
```

This allows SolydFlow to process provider-side events and keep the transaction lifecycle synchronized.

See:

**[Provider Webhooks →](../webhooks/provider-webhooks.md)**

---

## Why Webhook Handling Matters

A customer may complete a payment while your application does not immediately receive the expected callback.

For example:

```text
Customer
   ↓
Payment
   ↓
Provider
   ↓
Webhook
   X
Application
```

The payment may have succeeded even though the callback was not received.

This is one of the situations SolydFlow is designed to handle.

```text
Provider
   ↓
Successful Payment
   ↓
Webhook Missing
   ↓
SolydFlow Recovery / Verification
   ↓
Correct Transaction State
   ↓
Entitlement
```

See:

**[Failed Webhooks →](../recover/failed-webhooks.md)**

**[Transaction Recovery →](../recover/transaction-recovery.md)**

---

## Provider-Specific Behavior

Every payment provider has its own APIs, payment methods, statuses, webhook formats, and operational behavior.

For example:

```text
Paystack
   ↓
Provider-specific API

Flutterwave
   ↓
Provider-specific API

Stripe
   ↓
Provider-specific API
```

SolydFlow abstracts these provider differences where possible so that your application does not need to implement every provider's behavior independently.

However, provider-specific capabilities and requirements still apply.

Always check the provider-specific documentation before enabling a provider in production.

---

## Supported Providers

SolydFlow's payment-provider layer is organized around the providers supported by your project and current platform capabilities.

### Stripe

Stripe provides payment infrastructure for international markets and supports a wide range of payment methods.

**[Stripe →](./stripe.md)**

### Paystack

Paystack provides payment infrastructure widely used across African markets.

**[Paystack →](./paystack.md)**

### Flutterwave

Flutterwave provides payment infrastructure and payment methods across multiple African markets and beyond.

**[Flutterwave →](./flutterwave.md)**

### M-Pesa

M-Pesa provides mobile-money payment infrastructure used extensively in several African markets.

**[M-Pesa →](./mpesa.md)**

### Monnify

Monnify provides payment infrastructure including collections and related payment capabilities.

**[Monnify →](./monnify.md)**

### Apple

Apple payment infrastructure is relevant to applications distributed through Apple's ecosystem.

**[Apple →](./apple.md)**

### Google Play

Google Play billing is relevant to applications distributed through the Google Play ecosystem.

**[Google Play →](./google-play.md)**

> Provider availability and supported capabilities can change. Confirm the current provider capabilities in the corresponding provider documentation before relying on a feature in production.

---

## Choosing a Provider

The right provider depends on your application and target market.

Consider:

### Market

Where are your customers located?

```text
Nigeria
Ghana
Kenya
United States
United Kingdom
Global
```

### Payment Methods

What payment methods do your customers expect?

```text
Cards
Bank Transfer
USSD
Mobile Money
In-App Billing
```

### Currency

Which currencies do you need to support?

### Availability

Is the provider available to your business and target customers?

### Business Requirements

Consider:

* Settlement
* Fees
* Supported payment methods
* Refunds
* Recurring payments
* Provider limits
* Compliance requirements

SolydFlow can help unify the revenue flow, but the underlying provider capabilities still matter.

---

## Using Multiple Providers

Using multiple providers can give your application more flexibility.

For example:

```text
                 SolydFlow
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   Provider A     Provider B    Provider C
       │             │             │
    Market A      Market B      Market C
```

This can allow you to select providers based on market or payment method.

It can also provide additional resilience where provider failover is supported.

See:

**[Smart Routing →](../enforce/smart-routing.md)**

**[Provider Failover →](../enforce/provider-failover.md)**

---

## Provider Failover

A payment provider can experience downtime or degraded service.

For applications that depend on a single provider, this can directly affect revenue.

```text
Customer
   ↓
Provider A
   X
Downtime
```

With multiple providers configured appropriately, SolydFlow can support a more resilient payment architecture.

```text
                 SolydFlow
                     │
                Payment Request
                     │
             ┌───────┴───────┐
             ↓               ↓
         Provider A       Provider B
             X               ↓
         Unavailable       Payment
```

The exact routing and failover behavior depends on your project configuration and supported provider capabilities.

See:

**[Provider Failover →](../enforce/provider-failover.md)**

---

## Provider Routing

Different providers may be better suited to different markets or payment methods.

For example:

```text
Nigeria
   ↓
Provider A

Kenya
   ↓
Provider B

United States
   ↓
Provider C
```

A centralized revenue layer allows these provider decisions to remain separate from your application's core payment logic.

See:

**[Smart Routing →](../enforce/smart-routing.md)**

---

## Provider Transactions and SolydFlow Transactions

A payment provider has its own transaction or payment record.

SolydFlow maintains its own revenue representation around that event.

Conceptually:

```text
Provider
└── Provider Transaction
          │
          ↓
      SolydFlow
          │
          ↓
    SolydFlow Transaction
          │
          ↓
      Entitlement
```

This separation is important because provider-side state and application-side revenue state are not always guaranteed to arrive at the same time.

SolydFlow's recovery and truth layers exist to help resolve these differences.

---

## Provider State vs SolydFlow State

For example, a provider may report:

```text
Provider
└── Successful
```

while your application has not yet received the corresponding callback.

```text
Application
└── Pending
```

SolydFlow can use provider information and its transaction lifecycle to determine the appropriate state.

```text
Provider State
      +
SolydFlow State
      ↓
Transaction Truth
      ↓
Application Outcome
```

See:

**[Transaction Verification →](../truth/transaction-verification.md)**

**[State Mismatches →](../truth/state-mismatches.md)**

---

## Provider Webhooks and Recovery

A provider webhook is an important event source, but your revenue system should not assume that every webhook will arrive successfully.

For example:

```text
Provider
   ↓
Webhook
   X
Not received
```

SolydFlow can use recovery mechanisms to investigate and resolve the transaction.

```text
Transaction
   ↓
Expected Event Missing
   ↓
Recovery
   ↓
Verification
   ↓
Correct State
```

This reduces the amount of provider-specific recovery logic you need to implement in every application.

---

## Provider Security

Payment credentials and webhook events must be handled securely.

Your provider integration should account for:

* Secret credentials
* Webhook signatures
* HTTPS
* Access control
* Credential rotation
* Auditability

See:

**[Security →](../security/overview.md)**

**[Webhook Security →](../security/webhook-security.md)**

---

## Testing Providers

Do not begin with production transactions.

Use the provider's supported test or sandbox environment where available and configure SolydFlow for testing.

```text
Development
    ↓
Sandbox / Test
    ↓
Test Transactions
    ↓
Recovery Tests
    ↓
Production
```

You should test:

* Successful payments
* Failed payments
* Pending payments
* Webhook delivery
* Missing webhooks
* Provider errors
* Recovery behavior
* Entitlement updates

See:

**[Sandbox →](../sandbox/overview.md)**

---

## Moving to Production

Before using a provider in production, verify:

* Production credentials are configured
* Test credentials are not being used
* Webhook endpoints are correctly configured
* Webhook signatures are verified
* Products and packages are configured
* Prices are correct
* Supported currencies are correct
* Payment methods are enabled
* Recovery behavior has been tested
* Monitoring is available

See:

**[Going Live →](../production/going-live.md)**

---

## Adding a New Provider

When adding another provider to your application, the architecture remains:

```text
Your Application
       ↓
   SolydFlow
       ↓
   New Provider
```

You should not need to redesign your application's entire revenue model simply because another payment provider is introduced.

Configure the provider, map it to the appropriate market or payment flow, and test the resulting transaction lifecycle.

---

## The Provider Abstraction

The purpose of SolydFlow's provider layer is not to make all providers identical.

Instead, it gives your application a consistent revenue infrastructure while preserving provider-specific capabilities underneath.

```text
                    Your Application
                           │
                           ↓
                       SolydFlow
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
      Paystack         Flutterwave        Stripe
          │                │                │
     Provider API     Provider API     Provider API
```

Your application can therefore focus on:

```text
Product
Users
Features
Experience
```

while SolydFlow handles the revenue infrastructure connecting those concerns to payment providers.

---

## Key Principle

> **Use payment providers for payment processing. Use SolydFlow to manage the revenue flow around them.**

Your application should not need to understand every provider's API, webhook format, recovery behavior, or failure mode just to support multiple payment options.

```text
Your Application
       ↓
   SolydFlow
       ↓
Payment Providers
       ↓
Payment Networks
```

This gives you a more consistent foundation for building applications that need reliable payments across markets.

<!-- ---

## Next Steps

Choose the provider you want to configure:

* **[Stripe →](./stripe.md)**
* **[Paystack →](./paystack.md)**
* **[Flutterwave →](./flutterwave.md)**
* **[M-Pesa →](./mpesa.md)**
* **[Monnify →](./monnify.md)**
* **[Apple →](./apple.md)**
* **[Google Play →](./google-play.md)**

After configuring a provider, continue with the SolydFlow revenue lifecycle:

**[Recover →](../recover/overview.md)**

**[Truth →](../truth/overview.md)**

**[Enforce →](../enforce/overview.md)** -->