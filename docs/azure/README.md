# Azure Architecture & Cloud Component Documentation (`docs/azure/`)

Modular documentation detailing each Azure service, security role, database, container configuration, and Terraform IaC step for the **AI Image Studio & Admin Platform**.

---

## 📚 Azure Documentation Catalogue

| Step | Document | Topic & Focus |
| :--- | :--- | :--- |
| **01** | **[01-architecture.md](01-architecture.md)** | High-Level Cloud Architecture & Topology Diagram |
| **02** | **[02-resource-group.md](02-resource-group.md)** | Azure Resource Group design, naming conventions & tags |
| **03** | **[03-app-service.md](03-app-service.md)** | Azure App Service / Web App container hosting & scale settings |
| **04** | **[04-postgresql-database.md](04-postgresql-database.md)** | Azure Database for PostgreSQL Flexible Server & SSL |
| **05** | **[05-storage-account.md](05-storage-account.md)** | Azure Storage Account & Blob Container folder partitioning |
| **06** | **[06-service-bus.md](06-service-bus.md)** | Azure Service Bus namespace, queues & JSON payload schema |
| **07** | **[07-key-vault.md](07-key-vault.md)** | Azure Key Vault secret management & soft-delete settings |
| **08** | **[08-managed-identity.md](08-managed-identity.md)** | Passwordless System-Assigned Managed Identity & RBAC roles |
| **09** | **[09-application-insights.md](09-application-insights.md)** | Application Insights monitoring, telemetry & custom events |
| **10** | **[10-terraform-step-by-step.md](10-terraform-step-by-step.md)** | Terminal execution commands for Terraform IaC deployment |
