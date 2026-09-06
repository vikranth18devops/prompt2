# 01 - Master Documentation Execution Index

Welcome to the sequential documentation suite for the **AI Image Studio & Admin Platform**. Follow these documents in order (01 through 09) to understand, build, containerize, provision, deploy, and monitor the application.

---

## 🔢 Sequential Execution & Implementation Order

| Step | Document | Focus & Purpose |
| :--- | :--- | :--- |
| **01** | **[01-INDEX.md](01-INDEX.md)** | Master Documentation Sitemap & Sequential Execution Guide |
| **02** | **[02-ARCHITECTURE.md](02-ARCHITECTURE.md)** | System Architecture, Dual-App Boundaries, Data Models & Managed Identity Flow |
| **03** | **[03-API_DOCUMENTATION.md](03-API_DOCUMENTATION.md)** | Complete REST API Specifications & Health Probe Specifications |
| **04** | **[04-DOCKER_GUIDE.md](04-DOCKER_GUIDE.md)** | Multi-Stage Docker Building, Entrypoint Auto-Migrations & Compose Setup |
| **05** | **[05-AZURE_DEPLOYMENT_GUIDE.md](05-AZURE_DEPLOYMENT_GUIDE.md)** | **Step-by-Step Azure Cloud Production Deployment Guide** |
| **06** | **[06-TERRAFORM_IAC_GUIDE.md](06-TERRAFORM_IAC_GUIDE.md)** | Terraform IaC Automation for Azure App Service, Postgres, KV, Storage & Service Bus |
| **07** | **[07-HELM_KUBERNETES_GUIDE.md](07-HELM_KUBERNETES_GUIDE.md)** | Azure Kubernetes Service (AKS) Helm Chart Deployment & Workload Identity |
| **08** | **[08-GITOPS_ARGOCD_GUIDE.md](08-GITOPS_ARGOCD_GUIDE.md)** | ArgoCD Automated GitOps Continuous Delivery (`Application` & `ApplicationSet`) |
| **09** | **[09-MONITORING_OBSERVABILITY_GUIDE.md](09-MONITORING_OBSERVABILITY_GUIDE.md)** | Observability Stack (Grafana Dashboards, Prometheus Alerts, Loki & ELK Stack) |

---

## 🚀 Execution Workflow Overview

1. Read **[02-ARCHITECTURE.md](02-ARCHITECTURE.md)** to understand the dual-app structure and database schema.
2. Review **[03-API_DOCUMENTATION.md](03-API_DOCUMENTATION.md)** for endpoint details.
3. Test locally using **[04-DOCKER_GUIDE.md](04-DOCKER_GUIDE.md)** (`npm run docker:up`).
4. Follow **[05-AZURE_DEPLOYMENT_GUIDE.md](05-AZURE_DEPLOYMENT_GUIDE.md)** & **[06-TERRAFORM_IAC_GUIDE.md](06-TERRAFORM_IAC_GUIDE.md)** to provision Azure resources and deploy to Azure Cloud.
5. Deploy to AKS or Kubernetes using **[07-HELM_KUBERNETES_GUIDE.md](07-HELM_KUBERNETES_GUIDE.md)** and automate with **[08-GITOPS_ARGOCD_GUIDE.md](08-GITOPS_ARGOCD_GUIDE.md)**.
6. Monitor health & performance using **[09-MONITORING_OBSERVABILITY_GUIDE.md](09-MONITORING_OBSERVABILITY_GUIDE.md)**.
