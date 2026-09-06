# Step 02 - Full-Stack System Architecture & Data Flow

This document describes the high-level system architecture, dual-application design, database schemas, and Azure cloud integrations.

---

## 🏛️ System Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                      USER BROWSER / CLIENT UI                                     |
|                                                                                                   |
|   1. Upload Photo ----> 2. HTML5 Canvas Compression ----> 3. Select Prompt & Fine-Tune Sliders      |
|   (Drag & Drop)          (1200x1200 max, 0.85 quality)     (CFG Guidance, Strength, Quality Steps) |
+---------------------------------------------------+-----------------------------------------------+
                                                    |
                                                    v POST /api/generate
+---------------------------------------------------------------------------------------------------+
|                                       NEXT.JS APP ROUTER API                                      |
|                                                                                                   |
|   4. Authenticate & Validate Request      5. Create PENDING Job Record      6. Queue Job Message   |
|   (HttpOnly Cookie / Validation)        (Prisma DB / Mock Store)          (Azure Service Bus Queue)|
+---------------------------------------------------+-----------------------------------------------+
                                                    |
                                                    v
+---------------------------------------------------------------------------------------------------+
|                                 AI TRANSFORMATION DISPATCH ENGINE                                 |
|                                                                                                   |
|   7. Try OpenAI Image Models (gpt-image-1, dall-e-3, dall-e-2)                                    |
|      +-- [SUCCESS] --> Generate High-Res Image URL                                                |
|      +-- [API QUOTA / FAIL] --> 8. Invoke Adaptive Artwork Synthesizer                             |
|                                 (Embeds Uploaded Image inside SVG + Prompt Filter Overlays)        |
+---------------------------------------------------+-----------------------------------------------+
                                                    |
                                                    v
+---------------------------------------------------------------------------------------------------+
|                                    PERSISTENCE & REAL-TIME UI                                     |
|                                                                                                   |
|   9. Save Output Asset      10. Update Job Status       11. Client Polls /api/generate/[jobId]        |
|   (Azure Blob Storage)          (COMPLETED, 100%)           (Renders Before/After Comparison Slider)|
+---------------------------------------------------------------------------------------------------+
```

---

## 🔑 Dual-App Boundaries

- **User Studio (`/`)**: Drag & drop uploader, canvas compression, prompt filters, before/after slider.
- **Admin Panel (`/admin`)**: Category management, prompt creation with live animated card previews, telemetry.

---

## ➡️ Next Step

Proceed to **[Step 03 - 03-API_SPECIFICATION.md](03-API_SPECIFICATION.md)** for endpoint details!
