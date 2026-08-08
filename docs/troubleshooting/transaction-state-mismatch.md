# Transaction State Mismatch

A transaction state mismatch occurs when different systems report conflicting payment states.

For example, a provider may report a transaction as successful while another system still reports it as pending.

## Resolution

SolydFlow Truth evaluates available transaction evidence and determines the authoritative transaction state.

Review the reconciliation result before taking action.

## Related Documentation

* **[Consensus Engine →](../truth/consensus-engine.md)**
* **[Reconciliation →](../truth/reconciliation.md)**

<!-- ## Next Step

**[Provider Errors →](./provider-errors.md)**
 -->