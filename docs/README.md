# AI Image Studio Documentation Suite

Welcome to the documentation suite for the **AI Image Studio & Admin Platform**.

---

## 🏛️ Azure Cloud Architecture & Infrastructure Guide (`docs/azure/`)

All modular Azure Cloud documentation is organized under the **[`docs/azure/`](azure/README.md)** directory:

- **[01-architecture.md](azure/01-architecture.md)** — High-Level Azure Architecture & System Topology Diagram
- **[02-resource-group.md](azure/02-resource-group.md)** — Azure Resource Group Design & Tags
- **[03-app-service.md](azure/03-app-service.md)** — Azure App Service / Web App Container Hosting
- **[04-postgresql-database.md](azure/04-postgresql-database.md)** — Azure Database for PostgreSQL Flexible Server
- **[05-storage-account.md](azure/05-storage-account.md)** — Azure Storage Account & Blob Storage Partitioning
- **[06-service-bus.md](azure/06-service-bus.md)** — Azure Service Bus Queues & Message Payload Schema
- **[07-key-vault.md](azure/07-key-vault.md)** — Azure Key Vault Secret Management & RBAC Policies
- **[08-managed-identity.md](azure/08-managed-identity.md)** — Passwordless System-Assigned Managed Identity
- **[09-application-insights.md](azure/09-application-insights.md)** — Application Insights Monitoring & Telemetry
- **[10-terraform-step-by-step.md](azure/10-terraform-step-by-step.md)** — Step-by-Step Terraform IaC Execution Guide

---

## 🛠️ Application, API, DevOps & Monitoring Modules

- **[API Specifications (`docs/api.md`)](api.md)** — REST API Specifications & Health Probe Diagnostics (`/api/generate`, `/api/prompts`, `/api/health`)
- **[Docker Guide (`docs/docker.md`)](docker.md)** — Multi-Stage Docker Container Building & Local Compose Setup
- **[Helm & Kubernetes (`docs/helm.md`)](helm.md)** — Kubernetes & Azure Kubernetes Service (AKS) Deployment via Helm
- **[ArgoCD GitOps (`docs/argocd.md`)](argocd.md)** — Declarative ArgoCD Continuous Delivery Pipelines (`Application` & `ApplicationSet`)
- **[Observability Stack (`docs/monitoring.md`)](monitoring.md)** — Grafana Dashboards, Prometheus Alerts, Loki & ELK Stack Guide
