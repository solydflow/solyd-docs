# Signature Verification

Every webhook sent by SolydFlow is cryptographically signed to help you verify that the request originated from SolydFlow and was not modified during transmission.

Always verify the webhook signature before processing an event.

## How It Works

SolydFlow signs outbound webhook payloads using **HMAC-SHA256**.

Each webhook includes a signature generated using your webhook signing secret.

Your application should:

1. Read the raw request body.
2. Retrieve the signature from the request headers.
3. Compute an HMAC-SHA256 hash using your webhook signing secret.
4. Compare the computed signature with the received signature.
5. Reject the request if verification fails.

## Replay Protection

Webhook signatures include timestamp validation to help protect against replay attacks.

Requests that are outside the accepted time window or fail signature verification should be rejected.

## Best Practices

* Always verify webhook signatures.
* Use HTTPS endpoints.
* Process events idempotently.
* Return a successful response only after signature verification succeeds.

## Troubleshooting

If signature verification fails:

* Confirm you're using the correct webhook signing secret.
* Verify that the raw request body has not been modified before hashing.
* Check that the signature header is being read correctly.
* Ensure the request timestamp falls within the accepted verification window.

## Related Documentation

* **[Webhook Security →](../security/webhook-security.md)**
* **[Event Handling →](./event-handling.md)**
* **[Inbound Webhooks →](./inbound-webhooks.md)**

<!-- ## Next Step

**[Event Handling →](./event-handling.md)** -->
