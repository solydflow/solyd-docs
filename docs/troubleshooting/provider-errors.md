---
id: provider-errors
title: "Troubleshooting: Payment Provider Errors"
sidebar_label: Provider Errors
---

# Troubleshooting: Payment Provider Errors

Provider errors occur when an upstream payment rail (Paystack, Flutterwave, Stripe, or Safaricom M-Pesa) rejects a payment request due to invalid credentials, malformed parameters, or bank downtime.

```text
[1. Capture Raw Provider Error] ➔ [2. Verify Vault Credentials] ➔ [3. Check Formatting (E.164 / Currency)] ➔ [4. Failover to Backup Rail]
```

---

## Gateway Error Triage Matrix

Find the specific provider error code below to resolve it:

| Provider | Raw Error Code / Message | Root Cause | How to Fix |
| :--- | :--- | :--- | :--- |
| **Paystack** | `401 Unauthorized: Invalid Secret Key` | Stale or incorrect key in Vault. | Copy `sk_live_...` or `sk_test_...` fresh from Paystack and re-save in the Vault. |
| **Paystack** | `Currency not supported` | Attempting to charge non-African currency without USD approval. | Contact Paystack to enable international currency collections on your account. |
| **Stripe** | `card_declined` / `insufficient_funds` | Customer's issuing bank rejected the charge. | Prompt user to try another card or use Apple Pay / Google Pay. |
| **M-Pesa** | `Invalid Access Token` | Bad Daraja Consumer Key or Secret. | Verify your Safaricom Consumer Key and Secret in the Credentials Vault. |
| **M-Pesa** | `Invalid MSISDN` / `Bad Request` | Phone number formatted incorrectly (e.g. `0712...`). | Pass phone numbers in strict **E.164 format** (`+2547XXXXXXXX` or `2547XXXXXXXX`). |
| **Flutterwave**| `Invalid Secret Key` | Test and Live keys swapped. | Confirm `FLWSECK_TEST...` is in Sandbox and `FLWSECK_LIVE...` is in Live. |
| **Monnify** | `Contract Code Not Found` | Typo in Contract Code parameter. | Check your Monnify Dashboard and re-enter your numeric Contract Code in the Vault. |

---

## The 3 Most Common Setup Mistakes

### 1. M-Pesa Phone Number Formatting
Safaricom's Daraja API strictly rejects local Kenyan numbers starting with `07...` or `01...`:

```text
❌ Bad Format: 0712345678  (Throws "Invalid MSISDN")
✅ Correct Format: +254712345678 or 254712345678
```

Ensure your Flutter or Web application passes the phone number with country code during `SolydFlow.configure()`.

---

### 2. Mixing Test and Live Keys
If you paste a Live key (`sk_live_...`) into the Test Vault or use a Test key (`sk_test_...`) in a release mobile build, the provider returns an immediate `401 Unauthorized` or `Invalid Key` error.

* **Test Mode:** Uses `sf_pk_test_...` on client + `sk_test_...` in Vault.
* **Live Mode:** Uses `sf_pk_live_...` on client + `sk_live_...` in Vault.

---

### 3. Unactivated Gateway Channels
Even with valid API keys, gateways block transactions if specific channels are not toggled on:
* **Paystack:** Ensure **Bank Transfer**, **USSD**, and **Card** are enabled under **Paystack Dashboard → Settings → Preferences**.
* **Stripe:** Ensure **Cards** and **Apple Pay** are enabled under **Stripe Dashboard → Payment Methods**.

---

## Eliminating Downtime with Provider Failover

If a payment provider experiences an outage in a specific region, configure a backup payment rail in **SolydFlow Console → Payment Routing Rules**:

```text
┌───────────────────────────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Target Market & Currency              │ Primary Provider              │ Automated Backup Failover     │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🇳🇬 Nigeria (`NGN`)                    │ Paystack (Cards / USSD)       │ Monnify (Virtual Accounts)    │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🇰🇪 Kenya (`KES`)                      │ M-Pesa STK Push (Daraja)      │ Paystack (Cards / M-Pesa)     │
├───────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ 🌍 Global (`USD`)                     │ Stripe (Credit Cards)         │ Paystack (International Cards)│
└───────────────────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

SolydFlow evaluates gateway health and automatically routes checkouts to the backup rail if the primary provider fails pre-flight pings.

---

## Related Documentation

* **[Troubleshooting Overview →](./overview.md)**
* **[Provider Failover Architecture →](../enforce/provider-failover.md)**
* **[Connecting Payment Providers →](../payment-providers/overview.md)**
* **[Credential Vault Security (BYOK) →](../security/credential-security.md)**
