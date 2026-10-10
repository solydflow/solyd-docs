---
id: kotlin
title: Kotlin SDK (Android)
sidebar_label: Kotlin (Android)
---

# Kotlin SDK (Android)

:::info{title="Status: Under Active Development 🚧"}
The native **`com.solydflow.android`** package is currently in private beta testing. 

If you are shipping an Android application today, full Android production support is available through our **[Flutter Mobile SDK](./flutter.md)**.
:::

---

## What to Expect

The native Kotlin SDK will bring SolydFlow's billing infrastructure directly to modern Android applications, featuring:

* **Jetpack Compose Ready:** Reactive UI state bindings and lifecycle-aware composables.
* **Kotlin Coroutines & Flow:** Idiomatic `suspend` functions for seamless background network execution.
* **EncryptedSharedPreferences Caching:** Hardware-backed AES-256 local storage for instant `<5ms` offline gating.
* **Google Play Billing & African Rails:** Unifies Google Play In-App Billing alongside Pan-African gateways (M-Pesa, Paystack, Monnify).

---

## Planned API Preview

The Kotlin SDK is designed around modern Android Jetpack architecture:

```kotlin title="Planned Kotlin Interface Preview"
package com.example.myapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.solydflow.android.SolydFlow
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            // 1. Initialize SolydFlow
            SolydFlow.configure(
                context = applicationContext,
                apiKey = "sf_pk_live_44019283bc918237fa",
                userID = "usr_supabase_991823",
                userEmail = "customer@example.com",
                userPhone = "+2348012345678"
            )

            // 2. Fast Offline Check (<5ms from Encrypted Storage)
            val isPro = SolydFlow.hasEntitlement("pro_access")
            if (isPro) {
                unlockProFeatures()
            }
        }
    }

    private fun handleUpgrade() {
        lifecycleScope.launch {
            try {
                // 3. Launch Native Purchase Flow
                val customerInfo = SolydFlow.purchasePackage(this@MainActivity, "pro_monthly")
                if (customerInfo?.activeEntitlements?.get("pro_access") == true) {
                    unlockProFeatures()
                }
            } catch (e: Exception) {
                // Handle decline or network error
            }
        }
    }
}
```

---

## Production Alternatives for Android Today

If you are building for Android today:

* **[Flutter Mobile SDK →](./flutter.md)** (Production-ready for Android API Level 21+ with local caching and Smart Routing).
* **[JavaScript SDK →](./javascript.md)** (Production-ready for web portals and hybrid apps).
* **[Google Play Billing Overview →](../payment-providers/google-play.md)**
