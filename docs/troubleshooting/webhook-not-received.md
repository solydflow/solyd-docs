# Webhook Not Received

If your application does not receive a webhook, verify that your endpoint is correctly configured and accessible.

## Verify

* Webhook URL
* HTTPS availability
* Signature verification
* Provider webhook configuration

## Recovery

If webhook delivery fails, SolydFlow Recover automatically retries delivery according to the configured recovery workflow.

Review Events & Logs to determine whether delivery attempts were successful.

## Related Documentation

* **[Failed Webhooks →](../recover/failed-webhooks.md)**
* **[Webhook Security →](../security/webhook-security.md)**

<!-- ## Next Step

**[Entitlement Not Granted →](./entitlement-not-granted.md)**
 -->