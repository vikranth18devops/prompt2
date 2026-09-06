# 01 - Azure Cloud Architecture & System Topology

Detailed documentation for the **Azure Cloud Architecture** of the **AI Image Studio & Admin Platform**.

---

## 🏛️ High-Level Cloud Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                  AZURE RESOURCE GROUP                                 |
|                               (rg-aistudio-prod - East US)                            |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                 Azure App Service / Linux Web App (Container)                 |   |
|   |                            (app-aistudio-prod)                                |   |
|   |                                                                               |   |
|   |    +---------------------------------------------------------------------+    |   |
|   |    |         SYSTEM-ASSIGNED MANAGED IDENTITY (OAuth 2.0 Principal)      |    |   |
|   |    +-------+-----------------------------+-----------------------+-------+    |   |
|   +------------|-----------------------------|-----------------------|------------+   |
|                | RBAC Secrets User           | RBAC Blob Contributor | SB Sender      |
|                v                             v                       v                |
|   +-------------------------+   +------------------------+  +---------------------+   |
|   |     Azure Key Vault     |   |  Azure Storage Account |  |  Azure Service Bus  |   |
|   |   (kv-aistudio-prod)    |   |   (staistudioprod)     |  |  (sb-aistudio-prod) |   |
|   |  - OPENAI-API-KEY       |   |  - Container: ai-images|  |  - Queue:           |   |
|   |  - JWT-SECRET           |   |    (/uploads/,         |  |    ai-generation-   |   |
|   |                         |   |     /generated/)       |  |    jobs             |   |
|   +-------------------------+   +------------------------+  +---------------------+   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                   Azure Database for PostgreSQL Flexible Server               |   |
|   |                          (psql-aistudio-prod - Database: ai_platform)          |   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                     Azure Log Analytics & Application Insights                |   |
|   |                             (appi-aistudio-prod)                              |   |
|   +-------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------+
```

---

## 🔑 Key Component Functions

1. **App Service (`app-aistudio-prod`)**: Runs the Next.js standalone application container exposing port 3000.
2. **PostgreSQL Flexible Server (`psql-aistudio-prod`)**: Houses the database `ai_platform` for users, prompts, categories, and logs.
3. **Storage Account (`staistudioprod`)**: Stores user uploaded images and generated artwork assets under `/ai-images`.
4. **Service Bus (`sb-aistudio-prod`)**: Message queue (`ai-generation-jobs`) decoupling Web App from background workers.
5. **Key Vault (`kv-aistudio-prod`)**: Passwordless encrypted vault storing API keys and authentication secrets.
6. **Managed Identity**: System-assigned identity handling authentication without hardcoded credentials.
7. **Application Insights (`appi-aistudio-prod`)**: Real-time request telemetry and performance diagnostics.
