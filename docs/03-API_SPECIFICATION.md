# Step 03 - REST API Specifications & Diagnostic Health Probes

This document provides complete specifications for all REST API endpoints implemented in the **AI Image Studio & Admin Platform**, including request/response formats, authentication rules, and health probe diagnostics.

---

## 📡 Complete REST API Endpoint Reference

| Method | Endpoint | Description | Auth Required | Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/generate` | Submit a new image generation job | No | `{ promptId, promptTemplate, inputImageUrl, parameters: { strength, cfgScale, qualitySteps } }` |
| `GET` | `/api/generate/[jobId]` | Poll status and output image URL | No | URL param `jobId` |
| `GET` | `/api/prompts` | List active prompts (user) or all (admin) | Optional | Query `category`, `status` |
| `POST` | `/api/prompts` | Create a new prompt | Admin Cookie | `{ title, description, categoryId, previewImageUrl, template, parameters }` |
| `GET` | `/api/prompts/[id]` | Fetch prompt details and version history | No | URL param `id` |
| `PUT` | `/api/prompts/[id]` | Update prompt & bump version | Admin Cookie | `{ title, description, template, parameters }` |
| `GET` | `/api/categories` | List active prompt categories | No | Query `includeInactive=true` |
| `POST` | `/api/categories` | Create prompt category | Admin Cookie | `{ name, description, icon, displayOrder }` |
| `PUT` | `/api/categories/[id]` | Update category order or status | Admin Cookie | `{ name, status, displayOrder }` |
| `POST` | `/api/upload` | Upload image to Blob Storage or Base64 | No | `multipart/form-data` with `file` |
| `GET` | `/api/gallery` | Fetch generation history gallery | No | Query `limit`, `offset` |
| `POST` | `/api/auth/login` | Authenticate admin & set HttpOnly cookie | No | `{ email, password }` |
| `GET` | `/api/auth/me` | Verify admin session | Cookie | None |
| `GET` | `/api/health` | Comprehensive health dashboard | No | None |
| `GET` | `/api/health/liveness` | Container liveness probe | No | None |
| `GET` | `/api/health/readiness` | Database readiness probe | No | None |

---

## 🩺 Diagnostic Probes & Expected JSON Outputs

### 1. Main System Health Probe (`GET /api/health`)
Used by monitoring dashboards and cloud load balancers.
```json
{
  "status": "healthy",
  "timestamp": "2026-09-06T22:52:21.000Z",
  "uptimeSeconds": 14502.3,
  "environment": "production",
  "checks": {
    "database": { "status": "UP", "responseTimeMs": 4 },
    "storage": { "status": "UP", "provider": "Azure Blob Storage" },
    "serviceBus": { "status": "UP", "provider": "Azure Service Bus" },
    "keyVault": { "status": "UP", "provider": "Azure Key Vault" }
  }
}
```

### 2. Container Liveness Probe (`GET /api/health/liveness`)
Used by Kubernetes & Azure App Service container engine to restart dead containers.
```json
{
  "status": "UP",
  "component": "livenessProbe"
}
```

### 3. Database Readiness Probe (`GET /api/health/readiness`)
Used by Kubernetes services to route traffic only when database connection is ready.
```json
{
  "status": "UP",
  "component": "readinessProbe",
  "database": "connected"
}
```

---

## ➡️ Next Step

Proceed to **[Step 04 - 04-LOCAL_DOCKER_GUIDE.md](04-LOCAL_DOCKER_GUIDE.md)** to run the full application stack locally using Docker Compose!
