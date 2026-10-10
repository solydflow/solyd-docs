---
id: swift
title: Swift SDK (iOS)
sidebar_label: Swift (iOS)
---

# Swift SDK (iOS)

:::info{title="Status: Under Active Development 🚧"}
The native **`SolydFlowSwift`** package is currently in private beta testing. 

If you are shipping an iOS application today, full iOS production support is available through our **[Flutter Mobile SDK](./flutter.md)**.
:::

---

## What to Expect

The native Swift SDK will bring SolydFlow's revenue engine directly to native iOS and iPadOS applications, featuring:

* **Swift Package Manager (SPM):** Frictionless integration directly inside Xcode.
* **Modern Swift Concurrency:** Native `async/await` API design with zero callback pyramid complexity.
* **Keychain-Backed Offline Caching:** Hardware-encrypted on-device storage for instant `<5ms` entitlement gating.
* **StoreKit 2 & African Rails:** Unifies Apple In-App Purchases alongside Pan-African gateways (Paystack, Flutterwave, M-Pesa).

---

## Planned API Preview

The Swift SDK leverages modern Swift language features:

```swift title="Planned Swift Interface Preview"
import SwiftUI
import SolydFlowSwift

@main
struct MyApp: App {
    init() {
        // 1. Initialize SolydFlow
        Task {
            try await SolydFlow.configure(
                apiKey: "sf_pk_live_44019283bc918237fa",
                userID: "usr_supabase_991823",
                userEmail: "customer@example.com",
                userPhone: "+2348012345678"
            )
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ProFeatureView: View {
    @State private var isPro = false

    var body: some View {
        VStack {
            if isPro {
                Text("🚀 Pro Access Unlocked!")
            } else {
                Button("Upgrade to Pro") {
                    Task {
                        // 2. Native Purchase Flow
                        let info = try await SolydFlow.purchasePackage("pro_monthly")
                        isPro = info.activeEntitlements["pro_access"] == true
                    }
                }
            }
        }
        .task {
            // 3. Fast Keychain-Backed Check (<5ms)
            isPro = await SolydFlow.hasEntitlement("pro_access")
        }
    }
}
```

---

## Production Alternatives for iOS Today

If you are building for iOS today:

* **[Flutter Mobile SDK →](./flutter.md)** (Production-ready for iOS & Android with local caching and Smart Routing).
* **[JavaScript SDK →](./javascript.md)** (Production-ready for web portals and hybrid apps).
* **[Apple In-App Purchases Overview →](../payment-providers/apple.md)**


