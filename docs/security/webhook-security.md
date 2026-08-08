# Webhook Security

SolydFlow signs outbound webhooks to help you verify that webhook events originate from SolydFlow and have not been modified during transmission.

Webhook verification should always be performed before processing an event.

## Signature Verification

Outbound webhook payloads are signed using HMAC-SHA256.

Applications should verify the signature using the webhook signing secret before processing the event.

## Replay Protection

Webhook verification also validates request freshness to help protect against replay attacks.

Events that fail signature verification or freshness checks should be rejected.

## Best Practices

* Verify every webhook request.
* Use HTTPS endpoints.
* Respond quickly before performing long-running work.
* Process webhook events idempotently.


## Related Documentation

* Signature Verification
* Event Handling
* Failed Webhooks

<!-- ## Next Step

Continue with:

**[Encryption →](./encryption.md)** -->