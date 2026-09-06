# Helm & Azure Kubernetes Service (AKS) Deployment Guide

Guide for deploying the **AI Image Studio** platform to Kubernetes / AKS using Helm.

---

## ⛵ Helm Chart Structure (`helm/`)

- [`helm/Chart.yaml`](../helm/Chart.yaml): Chart metadata (`ai-studio:0.1.0`).
- [`helm/values.yaml`](../helm/values.yaml): Default configurable values.
- `helm/templates/`: Deployment, Service, Ingress, Secret, ConfigMap, ServiceAccount, and HPA.

---

## 🚀 Deployment Commands

```bash
# 1. Lint chart
helm lint ./helm

# 2. Deploy or upgrade release
helm upgrade --install ai-studio ./helm \
  --namespace ai-studio \
  --create-namespace \
  --set image.repository="aistudio.azurecr.io/ai-studio" \
  --set image.tag="latest"
```
