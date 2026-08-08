# Production Checklist

Before switching your project to production, verify that your payment configuration, products, and integrations are ready to accept live transactions.

## Checklist

Complete the following before going live:

* Create your production project (or switch to Live Mode).
* Configure production payment provider credentials.
* Verify your Products and Packages.
* Configure production API keys.
* Configure webhook endpoints.
* Verify webhook signature validation.
* Test your purchase flow in the Sandbox.
* Verify entitlement granting.
* Review recovery and reconciliation workflows.

## Payment Providers

Ensure every payment provider has:

* Valid production credentials
* Required webhook endpoints
* Correct callback URLs

## Products

Verify:

* Products are correctly configured.
* Currency Packages contain the correct prices.
* Entitlements are mapped correctly.

## Final Verification

Run one complete purchase flow before accepting customer payments.

## Related Documentation

* Sandbox
* API Keys
* Payment Providers
* Webhook Security
<!-- 
## Next Step

Go live with your project.

**[Going Live →](./going-live.md)** -->
