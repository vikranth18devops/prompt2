# 🗺️ Fresher End-to-End Master Deployment Roadmap

Welcome! This is the **complete, step-by-step master roadmap** for building, containerizing, provisioning, deploying, and monitoring the **AI Image Studio & Admin Platform** from zero to 100% production on Microsoft Azure.

---

## 🔢 Sequential Execution Guide (Step 01 to Step 12)

Follow these documents in exact numerical order:

```
STAGE 1: UNDERSTANDING & LOCAL PREPARATION (Steps 01 - 04)
---------------------------------------------------------
[Step 01] 01-GETTING_STARTED.md          --> Fresher Azure Cloud Primer & Everyday Analogies
[Step 02] 02-ARCHITECTURE.md             --> Full System Architecture & Data Flow
[Step 03] 03-API_SPECIFICATION.md        --> REST API Endpoints & Health Diagnostics
[Step 04] 04-LOCAL_DOCKER_GUIDE.md       --> Testing Locally with Docker Compose

STAGE 2: CLOUD INFRASTRUCTURE & TERRAFORM (Steps 05 - 08)
---------------------------------------------------------
[Step 05] 05-TERRAFORM_REMOTE_STATE.md   --> Azure Remote Backend State File Setup
[Step 06] 06-AZURE_TERRAFORM_DEPLOY.md  --> Azure Cloud Provisioning (What Goes 1st, 2nd, 3rd)
[Step 07] 07-MANAGED_IDENTITY_SECURITY.md--> Passwordless Managed Identity & Key Vault Security
[Step 08] 08-DATABASE_MIGRATIONS.md      --> PostgreSQL Prisma Auto-Schema & Admin Seeding

STAGE 3: CONTAINER REGISTRY & KUBERNETES GITOPS (Steps 09 - 11)
---------------------------------------------------------------
[Step 09] 09-CONTAINER_REGISTRY_GUIDE.md --> Building & Pushing Images to Azure ACR
[Step 10] 10-HELM_KUBERNETES_GUIDE.md    --> Kubernetes Deployment via Helm Charts
[Step 11] 11-ARGOCD_GITOPS_GUIDE.md      --> ArgoCD Automated GitOps Continuous Delivery

STAGE 4: OBSERVABILITY & MAINTENANCE (Step 12)
----------------------------------------------
[Step 12] 12-OBSERVABILITY_MONITORING.md --> Grafana, Prometheus, Loki & ELK Stack
```

---

## 📚 Master Sitemap Table

| Step | Document File | Focus & Target Action |
| :--- | :--- | :--- |
| **01** | **[01-GETTING_STARTED.md](01-GETTING_STARTED.md)** | Fresher Azure Cloud & DevOps Primer (What, Why, Everyday Analogies) |
| **02** | **[02-ARCHITECTURE.md](02-ARCHITECTURE.md)** | Dual-App System Architecture, Data Flow Diagrams & Component Duties |
| **03** | **[03-API_SPECIFICATION.md](03-API_SPECIFICATION.md)** | REST API Reference & Health Probe Diagnostic Specifications |
| **04** | **[04-LOCAL_DOCKER_GUIDE.md](04-LOCAL_DOCKER_GUIDE.md)** | Running local multi-container stack (`npm run docker:up`) |
| **05** | **[05-TERRAFORM_REMOTE_STATE.md](05-TERRAFORM_REMOTE_STATE.md)** | Creating Azure Blob Storage Remote Backend (`setup-remote-state.sh`) |
| **06** | **[06-AZURE_TERRAFORM_DEPLOY.md](06-AZURE_TERRAFORM_DEPLOY.md)** | Step-by-Step Azure Cloud Provisioning (Resource Creation Order) |
| **07** | **[07-MANAGED_IDENTITY_SECURITY.md](07-MANAGED_IDENTITY_SECURITY.md)** | Managed Identity OAuth Flow & Azure Key Vault Secrets Security |
| **08** | **[08-DATABASE_MIGRATIONS.md](08-DATABASE_MIGRATIONS.md)** | PostgreSQL Flexible Server schema synchronization & Admin seeding |
| **09** | **[09-CONTAINER_REGISTRY_GUIDE.md](09-CONTAINER_REGISTRY_GUIDE.md)** | Building & pushing production container images to Azure ACR |
| **10** | **[10-HELM_KUBERNETES_GUIDE.md](10-HELM_KUBERNETES_GUIDE.md)** | Deploying to Azure Kubernetes Service (AKS) via Helm Charts |
| **11** | **[11-ARGOCD_GITOPS_GUIDE.md](11-ARGOCD_GITOPS_GUIDE.md)** | ArgoCD Automated Continuous Delivery (`Application` & `ApplicationSet`) |
| **12** | **[12-OBSERVABILITY_MONITORING.md](12-OBSERVABILITY_MONITORING.md)** | Observability Stack (Grafana Dashboards, Prometheus Alerts, ELK) |

---

## 🏛️ Modular Azure Resource Guides ([`docs/azure/`](azure/README.md))

For in-depth explanations and exact Terraform code snippets for each individual Azure service:
- **[01-architecture.md](azure/01-architecture.md)** — Cloud Architecture & System Topology
- **[02-resource-group.md](azure/02-resource-group.md)** — Resource Group Design & Tags
- **[03-app-service.md](azure/03-app-service.md)** — App Service / Web App Container Hosting
- **[04-postgresql-database.md](azure/04-postgresql-database.md)** — Database for PostgreSQL Flexible Server
- **[05-storage-account.md](azure/05-storage-account.md)** — Storage Account & Blob Storage Partitioning
- **[06-service-bus.md](azure/06-service-bus.md)** — Service Bus Queues & Message Schemas
- **[07-key-vault.md](azure/07-key-vault.md)** — Key Vault Secret Management & Soft-Delete Settings
- **[08-managed-identity.md](azure/08-managed-identity.md)** — Passwordless System-Assigned Managed Identity & RBAC
- **[09-application-insights.md](azure/09-application-insights.md)** — Application Insights Telemetry & Alerts
- **[10-terraform-step-by-step.md](azure/10-terraform-step-by-step.md)** — Terminal Execution Commands & Output Snippets
- **[11-terraform-remote-state.md](azure/11-terraform-remote-state.md)** — Azure Remote Backend & State File Locking
