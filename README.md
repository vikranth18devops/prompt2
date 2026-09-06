# 🎨 AI Image Studio & Enterprise Admin Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Azure Managed Identity](https://img.shields.io/badge/Azure-Managed_Identity-0078D4?style=flat-square&logo=microsoftazure)](https://azure.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=flat-square&logo=terraform)](https://www.terraform.io/)
[![Helm](https://img.shields.io/badge/Helm-v3.0-0F1689?style=flat-square&logo=helm)](https://helm.sh/)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-EF6C00?style=flat-square&logo=argo)](https://argoproj.github.io/cd/)

An enterprise-ready, dual-application AI image generation studio and administrative control platform built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Azure Native Services**, **Docker**, **Terraform**, **Helm**, **ArgoCD**, and an **Observability Stack (Grafana/Prometheus/Loki/ELK)**.

---

## ❓ What is this Application?

The **AI Image Studio** allows users to upload original photos, select curated prompt presets (e.g. *Cyberpunk Neon*, *Studio Portrait*, *Makoto Anime*, *3D Vinyl Toy*, *Vintage Film*), fine-tune generation parameters (CFG Guidance Scale, Image Influence Strength, Inference Steps), and visually compare the input vs transformed output image using an interactive before/after slider.

Simultaneously, the platform includes a secure **Admin Control Center (`/admin`)** allowing administrators to manage prompt categories, create and version prompt templates with live animated card previews, monitor real-time telemetry metrics, and manage generation queues.

---

## 💡 Why Was it Built? (Key Problems Solved)

1. **Payload Size Optimization**: High-resolution uncompressed camera uploads often trigger `413 Payload Too Large` API errors. This app incorporates client-side HTML5 Canvas compression (`1200x1200 max`, `0.85 quality`), reducing base64 payloads to under 500KB without quality loss.
2. **Zero-Downtime Resilience (Quota Fallback)**: When third-party AI APIs (such as OpenAI DALL-E) return quota limits (`credit_balance_exhausted`) or network outages, the built-in [`lib/aiCanvasGenerator.ts`](lib/aiCanvasGenerator.ts) dynamically embeds the user's uploaded image inside high-resolution 1024x1024 SVG outputs and applies prompt-specific SVG color matrix filters, lighting overlays, and metadata badges.
3. **Passwordless Cloud Security**: Production deployments on Microsoft Azure utilize **System-Assigned Managed Identity (`DefaultAzureCredential`)** to authenticate with Azure Key Vault, Azure Storage, and Azure Service Bus without hardcoding passwords or secret keys in code.
4. **Complete Cloud & DevOps Pipeline**: Built-in production infrastructure code including multi-stage Docker containerization, Terraform IaC, Kubernetes Helm Charts, ArgoCD GitOps pipelines, and Grafana/Prometheus/ELK observability dashboards.

---

## ⭐ Core Features

### 🖌️ User AI Creative Studio (`/`)
- **Drag-and-Drop Image Uploader**: Canvas compression with real-time file size indicator.
- **Dynamic Category Tabs & Prompt Selector**: Filter prompts by category with smooth Framer Motion animations.
- **Fine-Tuning Controls**: Adjust Guidance Scale (CFG: 1.0 - 15.0), Image Influence Strength (0.1 - 0.95), Inference Steps, and custom prompt modifiers.
- **Processing Visualizer**: Animated status timeline tracking `PENDING` -> `PROCESSING` -> `COMPLETED`.
- **Interactive Before/After Slider**: Real-time image comparison tool.
- **Private History Gallery (`/gallery`)**: Private grid gallery of all past generations.

### 🛡️ Enterprise Admin Control Center (`/admin`)
- **Secure JWT Session Auth**: HttpOnly secure cookie authentication.
- **Category Governance (`/admin/categories`)**: CRUD categories, display ordering, and active toggles.
- **Prompt Management (`/admin/prompts`)**: Filter, search, and manage prompt templates.
- **Create Prompt with Live Preview (`/admin/prompts/create`)**: Real-time animated card preview updated dynamically as prompt title, description, and styles change.
- **Generation Monitoring (`/admin/generations`)**: Real-time job status telemetry and execution duration stats.

---

## 📖 Sequential Documentation Sitemap

Follow the step-by-step documentation in the [`docs/`](docs/) directory:

1. **[01 - Master Documentation Index](docs/01-INDEX.md)**: Sitemap & sequential execution guide.
2. **[02 - System Architecture](docs/02-ARCHITECTURE.md)**: Dual-app design, database schema, and Managed Identity flow.
3. **[03 - REST API Documentation](docs/03-API_DOCUMENTATION.md)**: Specifications for all endpoints & health probes.
4. **[04 - Docker Containerization Guide](docs/04-DOCKER_GUIDE.md)**: Multi-stage Docker building & Docker Compose.
5. **[05 - Step-by-Step Azure Deployment Guide](docs/05-AZURE_DEPLOYMENT_GUIDE.md)**: **Complete Azure Cloud Deployment Process**.
6. **[06 - Terraform IaC Guide](docs/06-TERRAFORM_IAC_GUIDE.md)**: Azure IaC automation details.
7. **[07 - Helm & Kubernetes Guide](docs/07-HELM_KUBERNETES_GUIDE.md)**: Deploying to Azure Kubernetes Service (AKS) with Helm.
8. **[08 - ArgoCD GitOps Guide](docs/08-GITOPS_ARGOCD_GUIDE.md)**: Declarative continuous delivery pipelines.
9. **[09 - Monitoring & Observability Guide](docs/09-MONITORING_OBSERVABILITY_GUIDE.md)**: Grafana, Prometheus, Loki & ELK Stack guide.

---

## 💻 How to Run the Application

### Option 1: Local Development Server

```bash
# 1. Install dependencies
npm install

# 2. Run local Prisma schema push & database seed
npx prisma db push
npx prisma db seed

# 3. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for User Studio, or [http://localhost:3000/admin](http://localhost:3000/admin) for Admin Panel (Credentials: `admin@azure-ai.com` / `AdminPass123!`).

---

### Option 2: Docker Containers (Turnkey Web + PostgreSQL)

```bash
# Start full containerized stack (Web + PostgreSQL)
npm run docker:up

# Tail container logs
npm run docker:logs

# Stop containers
npm run docker:down
```

---

### Option 3: Observability Stack (Grafana / Prometheus / ELK)

```bash
# Start Grafana, Prometheus, Loki, Promtail, and ELK Stack
npm run monitoring:up
```

Access Grafana at [http://localhost:3001](http://localhost:3001) (`admin` / `adminpassword123`) and Kibana (ELK) at [http://localhost:5601](http://localhost:5601).

---

## 🛠️ Testing & Verification

Run the automated test suite verifying JWT auth, blob storage, AI providers, and end-to-end workflows:

```bash
npm test
```

Run production build validation:

```bash
npm run build
```

---

## 📄 License

This project is open-source software licensed under the MIT License.
