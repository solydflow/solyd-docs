# API Keys

Every SolydFlow project is issued API keys for authenticating requests.

Separate keys are generated for test and live environments.

## Key Types

Each project includes:

* Test Public Key
* Test Secret Key
* Live Public Key
* Live Secret Key

Public keys are intended for client-side integrations where appropriate, while Secret keys must only be used from trusted server environments.

## Managing Keys

Developers can:

* Generate keys
* Regenerate keys
* Revoke keys

When a key is regenerated, SolydFlow provides a rolling transition window that allows existing integrations to continue operating while applications are updated to use the new key. This helps reduce downtime during key rotation.

## Best Practices

* Never expose Secret keys in client applications.
* Store Secret keys using a secure secrets manager or environment variables.
* Rotate keys periodically.
* Immediately revoke keys that are suspected to be compromised.


## Related Documentation

* Credential Security
* Webhook Security
* Production Checklist

<!-- ## Next Step

Continue with:

**[Credential Security →](./credential-security.md)**
 -->