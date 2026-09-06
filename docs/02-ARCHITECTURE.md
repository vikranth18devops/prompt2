# 02 - Full-Stack System Architecture

This document describes the high-level system architecture, dual-application design, database schemas, Azure cloud integrations, and Managed Identity security models for the **AI Image Studio & Admin Platform**.

---

## 🏛️ System Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                             Next.js App Router                                |
|                                                                               |
|   +-------------------------------+       +-------------------------------+   |
|   |    User AI Creative Studio    |       |      Admin Control Center     |   |
|   |         (App /)               |       |         (App /admin)          |   |
|   | - Image Upload & Compression  |       | - Category Management         |   |
|   | - Prompt Selection & Filters  |       | - Prompt Creation & Versioning|   |
|   | - Processing Visualizer       |       | - Real-time Telemetry Metrics |   |
|   | - Comparison Slider           |       | - Job Queue Monitoring        |   |
|   +---------------+---------------+       +---------------+---------------+   |
+-------------------|---------------------------------------|-------------------+
                    |                                       |
                    +-------------------+-------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                            API Layer & Middleware                             |
|                                                                               |
|  - JWT HttpOnly Cookie Authorization (/middleware.ts)                          |
|  - Health Diagnostics (/api/health, /api/health/liveness, /api/health/readiness)|
|  - AI Service Dispatcher (/api/generate, /services/aiProvider.ts)             |
+---------------------------------------+---------------------------------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
        +-------------------+   +---------------+   +---------------+
        | PostgreSQL (Prisma|   |  Azure Blob   |   | Azure Service |
        | Database ORM)     |   | Storage       |   | Bus Queue     |
        +-------------------+   +---------------+   +---------------+
```

---

## 🔑 Architectural Highlights

1. **Dual-Application Boundary**: User Studio (`/`) and Admin Panel (`/admin`) cleanly separated with HttpOnly JWT auth cookies.
2. **Azure Managed Identity**: Zero hardcoded credentials via `DefaultAzureCredential`.
3. **Artwork Synthesizer Fallback**: Dynamic SVG/Canvas synthesis when OpenAI quota is exhausted.
4. **Prisma Models**: `User`, `PromptCategory`, `Prompt`, `PromptVersion`, `Generation`, `GenerationAsset`.
