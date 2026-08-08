# Simulate Failures

The Solyd Simulator can be used to test payment outcomes exposed by the configured payment provider's test environment.

The exact outcomes available depend on the payment provider.

For example, a Paystack test checkout can provide test outcomes including:

* Success
* Bank Authentication
* Declined

These outcomes allow you to observe how the SolydFlow revenue flow behaves when the provider does not immediately complete a successful payment.

## Provider Test Outcomes

When a test checkout is opened, select the available test outcome provided by the payment provider.

The simulator records the checkout activity and routes the transaction through the project's configured provider.

The routing log can be used to confirm which provider handled the checkout.

## Important Distinction

Provider test outcomes and SolydFlow failure simulation are different.

A provider may expose a test outcome such as `Declined`, while SolydFlow may have additional failure-handling and recovery behavior elsewhere in the platform.

Use the provider's test environment to test provider-specific payment outcomes.

Use the SolydFlow recovery and webhook testing tools to test the corresponding SolydFlow failure-handling workflows.

## Related Documentation

[Sandbox Overview →](./overview.md)

[Test Transactions →](./test-transactions.md)

[Testing Recovery →](./testing-recovery.md)

[Transaction States →](../concepts/transaction-states.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Failed Webhooks →](../recover/failed-webhooks.md)
