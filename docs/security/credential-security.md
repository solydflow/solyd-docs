# Credential Security

SolydFlow securely stores credentials used to connect external payment providers.

Examples include:

* Paystack
* Flutterwave
* Stripe
* Monnify
* Apple
* Google Play

## Secure Storage

Sensitive credentials are encrypted before storage.

Credential values are masked throughout the dashboard and are never returned through public API responses.

## Viewing Credentials

Sensitive values remain hidden by default.

Authorized administrators can temporarily reveal stored values when required for maintenance or verification.

## Best Practices

* Grant dashboard access only to trusted administrators.
* Remove unused provider credentials.
* Rotate provider credentials according to your organization's security policy.


## Related Documentation

* API Keys
* Payment Providers

<!-- ## Next Step

Continue with:

**[Webhook Security →](./webhook-security.md)** -->