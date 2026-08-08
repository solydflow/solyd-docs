# Testing Recovery

Use the Solyd Simulator together with the Test environment to verify how a completed payment is reflected in the customer's transaction and entitlement state.

Recovery testing is particularly important when testing payment flows where the application does not immediately receive the final payment result.

## Test Environment

Run recovery tests in:

**Test (Sandbox)**

Do not use Live mode for recovery testing unless you intentionally need to test the live recovery path with real money.

## Recovery Flow

A recovery test should verify that a payment that has completed at the provider is eventually reflected correctly in SolydFlow.

The expected flow is:

```text
Checkout
   ↓
Payment Provider
   ↓
Payment Completed
   ↓
SolydFlow Processes Result
   ↓
Transaction Updated
   ↓
Entitlement Updated
   ↓
Test Environment
```

## Verify the Result

After completing the test payment, verify the resulting data in the project's Test environment.

Check:

* The transaction exists.
* The transaction has the expected state.
* The package is associated with the transaction.
* The customer's entitlement reflects the successful purchase.

## Routing Visibility

The routing engine log provides visibility into the beginning of the transaction flow.

For example:

```text
INITIATED: Checkout requested for starter (NGN 300)
ROUTER DECISION: Smart Routing selected [PAYSTACK]
ACTION: Redirecting to https://checkout.paystack.com/...
```

Use the transaction and customer data in the Test environment to verify the resulting state after checkout.

## Recovery Testing and Provider Behavior

The exact recovery behavior depends on the payment flow and the configured provider.

For provider-specific or SolydFlow recovery scenarios, see:

[Transaction Recovery →](../recover/transaction-recovery.md)

[Zombie Transactions →](../recover/zombie-transactions.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Retries →](../recover/retries.md)

## Related Documentation

[Sandbox Overview →](./overview.md)

[Test Transactions →](./test-transactions.md)

[Simulate Failures →](./simulate-failures.md)

[Transaction Recovery →](../recover/transaction-recovery.md)

[Zombie Transactions →](../recover/zombie-transactions.md)

[Failed Webhooks →](../recover/failed-webhooks.md)

[Entitlements →](../concepts/entitlements.md)

[Transactions →](../concepts/transactions.md)
