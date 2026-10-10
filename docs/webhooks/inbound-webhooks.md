---
id: inbound-webhooks
title: Inbound Gateway Webhooks
sidebar_label: Inbound Webhooks
---

# Inbound Gateway Webhooks

**Inbound Webhooks** are HTTPS endpoints exposed by SolydFlow to receive real-time transaction notifications from external payment providers (Paystack, Flutterwave, Stripe, and M-Pesa).

```text
[1. Gateway Fires Webhook] ➔ [2. Validate Signature & Schema] ➔ [3. Deduplicate via Event ID] ➔ [4. Trigger Consensus Engine]
```

These endpoints bridge the gap between third-party payment rails and your SolydFlow project, ensuring settlements (such as USSD confirmations or 3D-Secure card charges) are received the moment they clear.

---

## Your Dedicated Inbound Webhook URLs

Every SolydFlow project receives cryptographically isolated inbound webhook URLs for each connected provider:

```text
https://api.solydflow.com/api/v1/webhook/{provider}/{your_solydflow_api_key}
```

### Configured Endpoint Examples:
* **Paystack:** `https://api.solydflow.com/api/v1/webhook/paystack/sf_pk_live_44019283bc918237fa`
* **Flutterwave:** `https://api.solydflow.com/api/v1/webhook/flutterwave/sf_pk_live_44019283bc918237fa`
* **Stripe:** `https://api.solydflow.com/api/v1/webhook/stripe/sf_pk_live_44019283bc918237fa`
* **M-Pesa (Daraja):** `https://api.solydflow.com/api/v1/webhook/mpesa/sf_pk_live_44019283bc918237fa`

You copy these URLs directly from **SolydFlow Console → Project Settings → Inbound Gateway Webhooks** and paste them into your provider dashboards.

---

## Gateway Signature Verification Matrix

SolydFlow verifies incoming requests using your encrypted Vault keys before parsing event data:

| Provider | Signature Header | Verification Method |
| :--- | :--- | :--- |
| **Paystack** | `x-paystack-signature` | HMAC-SHA512 hash computed using your Paystack Secret Key. |
| **Stripe** | `stripe-signature` | Timestamped HMAC-SHA256 signature compared against endpoint secret. |
| **Flutterwave** | `verif-hash` | Secret hash header match against configured vault credentials. |
| **M-Pesa** | Direct SSL / Mutual TLS | Validates Daraja initiator credentials and origin IP block. |

:::danger{title="Zero-Trust Rule"}
Any incoming request with an invalid, expired, or missing signature is rejected immediately with HTTP `401 Unauthorized`. It is never written to your ledger or passed to the Consensus Engine.
:::

---

## The Fast Acknowledgment Rule (Instant 200 OK)

Payment gateways require webhook endpoints to return an HTTP `200 OK` response within **2 to 5 seconds**. If an endpoint is slow, gateways assume delivery failed and spam retries.

SolydFlow decouples ingestion from verification:

```text
[Webhook Arrives] ➔ [Verify Signature] ➔ [Deduplicate Event ID] ➔ [Return 200 OK (<100ms)]
                                                                           │
                                                                           ▼
                                                    [Consensus Engine Queries Bank Asynchronously]
```

1. **Ingestion (\<100ms):** SolydFlow verifies the cryptographic header, checks for duplicate `event_id`, enqueues the payload, and returns `200 OK`.
2. **Consensus Verification:** The engine independently queries the gateway's REST API using your Vault keys, confirms the amount in kobo/cents, and settles the ledger.

---

## Duplicate Delivery & Idempotency

Gateways frequently retry deliveries due to transient internet lag:

```text
Paystack fires charge.success (ID: evt_102938) ➔ Processed & Settled ✅
Paystack retries charge.success (ID: evt_102938) ➔ Matched in Deduplication Cache ➔ Skipped (NOOP) ✅
```

SolydFlow tracks event identifiers and transaction references. If the same event arrives multiple times, SolydFlow acknowledges with `200 OK` but prevents duplicate ledger entries or double entitlement grants.

---

## Inspecting Inbound Webhooks in the Console

To monitor and troubleshoot incoming events:
1. Open the [SolydFlow Console](https://console.solydflow.com).
2. Navigate to **Project Settings → Inbound Gateway Webhooks → Activity Log**.
3. View real-time logs including:
   * **Provider** (Paystack, Stripe, Flutterwave)
   * **HTTP Status Code** (e.g. `200 OK`, `401 Unauthorized`)
   * **Payload Reference** (`ref_pstk_...`)
   * **Consensus Engine Result** (`SETTLED_CONSENSUS` or `REJECTED`)

---

## Related Documentation

* **[Provider Webhooks →](./provider-webhooks.md)**
* **[Signature Verification →](./signature-verification.md)**
* **[Handling Failed Webhooks →](../recover/failed-webhooks.md)**
* **[Truth & Consensus Engine →](../truth/consensus-engine.md)**

