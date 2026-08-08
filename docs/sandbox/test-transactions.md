# Test Transactions

The Solyd Simulator provides a way to run a project's product revenue flow in the Test environment before processing live customer transactions.

A test transaction follows the same routing path configured for the project.

## Before Testing

Make sure the project has:

* A product configured for the revenue flow
* Packages configured for the product
* Pricing configured for the applicable region
* A payment provider configured for the selected currency
* Test provider credentials configured for Test mode

## Start a Test Transaction

Open the project's **Solyd Simulator**.

Select:

**Test (Sandbox)**

Then select the simulated location/currency you want to test.

The simulator loads the packages available for that region.

For example:

```text
Simulated Location: NGN

starter     NGN 300 / month
basic       NGN 600 / month
pro         NGN 900 / month
```

Select the desired billing period where multiple billing periods are available.

## Start Checkout

Select **Simulate Checkout** for the package you want to test.

The simulator sends the checkout request through SolydFlow's existing routing engine.

The routing engine determines the provider according to the project's configured routing.

The simulator log records the decision.

```text
Checkout requested
       ↓
Routing decision
       ↓
Provider selected
       ↓
Provider checkout
```

## Complete the Test Payment

The selected provider's test checkout opens.

Use the payment provider's available test options to complete the transaction.

The available options depend on the provider.

For example, a Paystack test checkout can expose test outcomes such as:

* Success
* Bank Authentication
* Declined

## Verify the Transaction

After the provider returns the result, SolydFlow processes the transaction.

The transaction data becomes available in the project's Test environment.

Verify:

* The transaction was created.
* The transaction has the expected state.
* The correct package is associated with the transaction.
* The expected amount and currency were used.
* The expected provider handled the payment.

## Verify the Entitlement

For a successful test purchase, verify that the customer's entitlement has been updated as expected.

The test environment should reflect the resulting customer state.

This lets you verify the complete relationship:

```text
Package
   ↓
Purchase
   ↓
Transaction
   ↓
Entitlement
```

## Verify Routing

Use the routing engine log to verify that the transaction followed the expected provider route.

For example:

```text
ROUTER DECISION: Smart Routing selected [PAYSTACK]
```

If the selected provider is unexpected, review the project's routing configuration and the simulated location/currency.

## Testing Different Regions

Repeat the test with different simulated locations where the project supports multiple regional configurations.

For example:

```text
NGN → configured NGN provider
KES → configured KES provider
USD → configured USD provider
ZAR → configured ZAR provider
```

The actual provider depends on the project's routing configuration.

## Test Before Live

Complete the required test transactions before switching the simulator to Live mode.

The purpose of the test is to verify the complete revenue flow:

```text
Product
   ↓
Package
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
```

## Related Documentation

[Sandbox Overview →](./overview.md)

[Simulate Failures →](./simulate-failures.md)

[Testing Recovery →](./testing-recovery.md)

[Packages →](../concepts/packages.md)

[Pricing →](../concepts/pricing.md)

[Transactions →](../concepts/transactions.md)

[Transaction States →](../concepts/transaction-states.md)

[Entitlements →](../concepts/entitlements.md)

[Smart Routing →](../enforce/smart-routing.md)
