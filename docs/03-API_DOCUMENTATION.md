# 03 - REST API Documentation Specification

Complete specification for all REST API endpoints implemented in the **AI Image Studio & Admin Platform**.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/generate` | Submit a new image generation job | No |
| `GET` | `/api/generate/[jobId]` | Poll generation job status and output image URL | No |
| `GET` | `/api/prompts` | List active prompts (user view) or all prompts (admin view) | Optional |
| `POST` | `/api/prompts` | Create a new prompt | Admin Cookie |
| `GET` | `/api/prompts/[id]` | Fetch prompt details and version history | No |
| `PUT` | `/api/prompts/[id]` | Update prompt parameters and create new version | Admin Cookie |
| `GET` | `/api/categories` | List active prompt categories | No |
| `POST` | `/api/categories` | Create a new prompt category | Admin Cookie |
| `PUT` | `/api/categories/[id]` | Update prompt category status or order | Admin Cookie |
| `POST` | `/api/upload` | Upload image file to Azure Blob Storage / Base64 fallback | No |
| `GET` | `/api/gallery` | Fetch user's generation history gallery | No |
| `POST` | `/api/auth/login` | Authenticate admin user and issue HttpOnly JWT cookie | No |
| `GET` | `/api/auth/me` | Verify current admin session | Cookie |
| `GET` | `/api/health` | Comprehensive system health dashboard | No |
| `GET` | `/api/health/liveness` | Container liveness probe | No |
| `GET` | `/api/health/readiness` | Database readiness probe | No |
