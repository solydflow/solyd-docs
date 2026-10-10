---
id: edtech
title: EdTech & E-Learning Platforms Guide
sidebar_label: EdTech & E-Learning
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EdTech & E-Learning Platforms Guide

This guide walks you through building a resilient monetization architecture for learning management systems (LMS), online exam prep apps, and digital classrooms across Africa and global markets.

```text
[1. Configure Academic / Exam Passes] ➔ [2. Localized PPP Pricing (NGN / KES)] ➔ [3. Native Mobile Rails (M-Pesa / USSD)] ➔ [4. Offline Lesson Gating (<5ms)]
```

---

## The 3 EdTech Monetization Models

EdTech apps rarely fit a standard monthly SaaS model. SolydFlow supports the three primary educational purchasing structures:

| Educational Model | Billing Behavior | Product Type in SolydFlow | Example Offering |
| :--- | :--- | :--- | :--- |
| **1. Academic Term Passes** | 3-Month or Annual access tied to school calendar terms. | **Non-Renewing Pass** | Primary School Term Pass (`term_pass_ngn` @ `₦25,000` / 90 days). |
| **2. Exam Prep Bundles** | Fixed access until national exam date (WAEC, JAMB, KCSE). | **Non-Renewing Pass** | JAMB 2026 Past Questions Pack (`jamb_2026_pass` @ `₦3,500`). |
| **3. AI Tutoring Credits** | Consumable tokens depleted per query or mock test taken. | **Consumable Pack** | 500 Mock Exam Credits (`exam_tokens_500` @ `KSh 300`). |

---

## Real-World African EdTech Setup

Below is an exam prep catalog operating across Nigeria and Kenya:

```text
📦 Product: "Senior Secondary Prep" ➔ Entitlement: "ssce_exam_access"
│
├── 🇳🇬 Package: ssce_prep_ngn
│   ├── Price: ₦7,500 (Full Academic Session)
│   ├── Rails: Paystack (Cards, USSD *737#), Monnify Virtual Account
│   └── Entitlement Unlocked: ssce_exam_access
│
└── 🇰🇪 Package: kcse_prep_kes
    ├── Price: KSh 1,200 (Full Year Access)
    ├── Rails: Safaricom M-Pesa STK Push
    └── Entitlement Unlocked: ssce_exam_access
```

:::tip{title="Single Unified Entitlement"}
Whether a student's parent pays via **USSD bank transfer in Nigeria** or an **M-Pesa PIN prompt in Kenya**, your mobile app only checks `hasEntitlement("ssce_exam_access")` to unlock video lessons and past questions.
:::

---

## Gating Offline Lessons (Flutter Mobile)

In emerging markets, students frequently download video lessons and quiz banks on school Wi-Fi and study offline at home. 

SolydFlow's hardware-encrypted cache enables instant access verification even when cellular data is turned off:

<Tabs>
<TabItem value="flutter" label="Flutter (Offline Video Gating)" default>

```dart title="lib/screens/lesson_player.dart"
import 'package:flutter/material.dart';
import 'package:solydflow_flutter/solydflow_flutter.dart';

class LessonPlayerScreen extends StatelessWidget {
  final String lessonId;
  const LessonPlayerScreen({super.key, required this.lessonId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Mathematics: Calculus Intro")),
      body: FutureBuilder<bool>(
        // 1. Instant check (<5ms) from encrypted local storage
        // 100% functional without internet connectivity
        future: SolydFlow.hasEntitlement("ssce_exam_access"),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());

          final bool hasAccess = snapshot.data ?? false;

          if (hasAccess) {
            return const Center(
              child: Text("🎬 Playing Downloaded Lesson Video..."),
            );
          }

          // 2. Lock screen with clear call to action
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.lock, size: 64, color: Colors.orange),
                  const SizedBox(height: 16),
                  const Text(
                    "Exam Pass Required",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Unlock all video lessons, mock exams, and answers for the 2026 academic session.",
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => _openPaywall(context),
                    child: const Text("Buy Exam Pass (₦7,500 / KSh 1,200)"),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _openPaywall(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => SolydPaywall(
        onPurchaseSuccess: (info) => Navigator.pop(ctx),
        onClose: () => Navigator.pop(ctx),
      ),
    );
  }
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript / Web Portal">

```typescript title="src/guards/courseGuard.ts"
import { SolydFlow } from "solydflow-js";

export async function canAccessQuiz(courseId: string): Promise<boolean> {
  // Check if learner has active course or exam access
  const isEnrolled = await SolydFlow.hasEntitlement("ssce_exam_access");
  
  if (!isEnrolled) {
    window.location.href = `/checkout?course=${courseId}`;
    return false;
  }
  return true;
}
```

</TabItem>
</Tabs>

---

## School Enterprise & B2B Invoicing

If your platform sells bulk access to entire schools or corporate training academies:
1. Initialize the student accounts with an alias tied to their school organization ID.
2. When the school pays an annual invoice, your backend can grant entitlements across all student IDs via SolydFlow's direct server-to-server REST API.

---

## Related Documentation

* **[Products & Packages Architecture →](../concepts/products-and-packages.md)**
* **[Regional Pricing & Purchasing Power Parity →](../monetization/regional-pricing.md)**
* **[Connecting M-Pesa (Kenya) →](../payment-providers/mpesa.md)**
* **[Connecting Monnify (Nigeria Virtual Accounts) →](../payment-providers/monnify.md)**
Please share your current version of this file whenever you are ready.