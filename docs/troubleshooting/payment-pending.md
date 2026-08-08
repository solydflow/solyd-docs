# Payment Pending

A payment may remain pending while confirmation is still being received from the payment provider.

## Verify

Check:

* Transaction status
* Provider response
* Webhook delivery
* Recovery activity

## Resolution

In many cases, SolydFlow Recover automatically retries failed callbacks and continues monitoring the transaction until a final state is reached.

Avoid granting entitlements while the payment remains pending.

## Related Documentation

* **[Transaction Recovery →](../recover/transaction-recovery.md)**
* **[Transaction States →](../concepts/transaction-states.md)**

<!-- ## Next Step

**[Webhook Not Received →](./webhook-not-received.md)**
 -->