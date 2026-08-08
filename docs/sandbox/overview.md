# Sandbox

The Solyd Simulator lets you test a project's product revenue flow before exposing the flow to customers.

The simulator is **project-specific** and is tied to the selected product and its configured revenue setup. It uses SolydFlow's existing routing engine, so the routing behavior tested in the simulator follows the same currency-to-provider routing configured for the project.

The simulator supports both test and live execution modes:

* **Test (Sandbox)** — uses the test environment and test payment credentials.
* **Live (Real Money)** — runs the flow using the live environment and can process real transactions.

## How the Simulator Works

The simulator allows you to select the environment and simulate the customer's location before testing a purchase.

```text
Project
   ↓
Solyd Simulator
   ↓
Execution Mode
   ↓
Simulated Location
   ↓
Packages for the Region
   ↓
Simulate Checkout
   ↓
SolydFlow Routing
   ↓
Payment Provider Checkout
   ↓
Transaction Result
   ↓
User Test Environment
```

The simulator does not select a provider independently. It uses the project's existing routing configuration to determine which provider handles the payment.

## Execution Mode

The simulator provides two execution modes.

### Test (Sandbox)

Test mode is intended for safely testing the revenue flow.

Transactions are processed using the project's test environment and test provider configuration.

Test transactions and their resulting data are available in the project's test environment.

### Live (Real Money)

Live mode runs the same revenue flow against the live environment.

Because this mode can process real payments, use it only when you intentionally want to test the live revenue flow.

## Simulated Location

The simulator allows you to select a simulated Geo-IP/currency context.

The available currency options depend on the project configuration. For example:

* NGN
* KES
* USD
* ZAR

The selected location determines which packages are loaded and which routing path is used.

For example:

```text
NGN
 ↓
NGN Packages
 ↓
Checkout
 ↓
NGN Routing
 ↓
Configured Provider
```

## Package Selection

After the simulated location is selected, the simulator loads the packages available for that region.

The customer-facing portion of the simulator displays the available packages, including:

* Package name
* Package ID
* Price
* Billing period

Where applicable, you can switch between billing periods such as monthly and yearly.

## Simulate Checkout

Select **Simulate Checkout** on the package you want to test.

SolydFlow then runs the checkout through the project's existing routing engine.

The simulator does not directly choose a payment provider. The routing engine determines the provider according to the project's configured routing rules.

The routing log records the routing activity.

For example:

```text
INITIATED: Checkout requested for starter (NGN 300)
ROUTER DECISION: Smart Routing selected [PAYSTACK]
ACTION: Redirecting to https://checkout.paystack.com/...
```

The simulator then redirects the customer to the selected provider's checkout.

## Payment Provider Checkout

The provider's checkout handles the payment itself.

In test mode, the provider's test checkout can expose its available test payment outcomes.

For example, a Paystack test checkout can provide options such as:

* Success
* Bank Authentication
* Declined

The provider returns the resulting payment status to the SolydFlow flow.

## Transaction Result

After the provider checkout completes, the simulator processes the resulting transaction.

The result is reflected in the project:

1. The transaction is detected.
2. The transaction state is updated.
3. The customer's entitlement is updated where applicable.
4. The resulting data appears in the project's test environment when running in Test mode.

This allows you to verify not only the checkout experience but the complete revenue flow.

## Routing Engine Log

The simulator provides a routing engine log that records important activity during the flow.

The log can show:

* Environment initialization
* Selected project
* Simulated Geo-IP/currency
* Packages loaded
* Checkout initiation
* Routing decision
* Selected provider
* Checkout redirect

The log provides visibility into how SolydFlow arrived at the provider used for the transaction.

## Test Environment Data

Transactions completed through the simulator in Test mode appear in the project's test environment.

This allows you to continue testing the transaction after checkout and verify the resulting application state.

The simulator therefore provides a complete path from:

```text
Revenue Configuration
        ↓
Routing
        ↓
Checkout
        ↓
Payment
        ↓
Transaction
        ↓
Entitlement
        ↓
Test Environment
```

## Live Testing

The same simulator can be switched to **Live (Real Money)** mode.

Live mode uses the live configuration and can process real payments through the project's configured routing.

Because live transactions involve real money, verify the selected project, package, price, currency, and routing configuration before initiating a live checkout.

## Related Documentation

[Test Transactions →](./test-transactions.md)

[Simulate Failures →](./simulate-failures.md)

[Testing Recovery →](./testing-recovery.md)

[Projects →](../concepts/projects.md)

[Packages →](../concepts/packages.md)

[Pricing →](../concepts/pricing.md)

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Payment Providers →](../payment-providers/overview.md)

[Smart Routing →](../enforce/smart-routing.md)
