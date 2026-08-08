# Security Overview

Security is built into every layer of SolydFlow, from API authentication and credential management to webhook verification and encrypted data storage.

The platform provides secure mechanisms for integrating payment providers, protecting sensitive credentials, and verifying payment events while helping businesses operate reliably in both test and live environments.

## Security Features

SolydFlow includes:

* API Key authentication
* Secure credential management
* Webhook signature verification
* Encryption in transit
* Encryption at rest
* Operational audit logging

## Authentication

Every API request is authenticated using your project's API keys.

Separate keys are provided for:

* Test mode
* Live mode

Public and Secret keys are used for different integration scenarios and should be handled accordingly.

## Provider Credentials

Payment provider credentials are securely stored and managed through the SolydFlow dashboard.

Sensitive credentials are protected and never exposed through API responses.

## Webhook Security

Inbound and outbound webhooks are protected using signature verification to ensure events originate from trusted sources and have not been modified in transit.


## Related Documentation

* API Keys
* Credential Security
* Webhook Security
* Encryption
* Audit Logs
* Compliance

<!-- ## Next Step

Continue with:

**[API-Keys →](./api-keys.md)** -->