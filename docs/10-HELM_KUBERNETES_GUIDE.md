# Step 10 - Helm & Azure Kubernetes Service (AKS) Deployment Guide

This guide details how to package and deploy the **AI Image Studio** platform to Kubernetes (AKS) using our production Helm Chart.

---

## ⛵ Helm Chart Structure (`helm/`)

- [`helm/Chart.yaml`](../helm/Chart.yaml): Helm metadata (`name: ai-studio`, `version: 0.1.0`).
- [`helm/values.yaml`](../helm/values.yaml): Default configurable settings (replicas, image, resource limits, probes).
- [`helm/templates/deployment.yaml`](../helm/templates/deployment.yaml): Kubernetes Deployment manifest.
- [`helm/templates/service.yaml`](../helm/templates/service.yaml): Kubernetes ClusterIP / LoadBalancer Service.
- [`helm/templates/ingress.yaml`](../helm/templates/ingress.yaml): NGINX Ingress controller configuration.
- [`helm/templates/hpa.yaml`](../helm/templates/hpa.yaml): Horizontal Pod Autoscaler (CPU/Memory scaling).
- [`helm/templates/secret.yaml`](../helm/templates/secret.yaml): Sensitive credentials & keys.

---

## 🚀 Execution Commands

### Step 1: Lint the Helm Chart
```bash
helm lint ./helm
```
*Output:*
```
==> Linting ./helm
1 chart(s) linted, 0 chart(s) failed
```

### Step 2: Test Render Helm Templates
```bash
helm template ai-studio ./helm --debug
```

### Step 3: Deploy to Kubernetes Cluster
```bash
helm upgrade --install ai-studio ./helm \
  --namespace ai-studio \
  --create-namespace \
  --set image.repository="aistudioacr.azurecr.io/ai-studio" \
  --set image.tag="latest"
```

### Step 4: Verify Kubernetes Pods & Services
```bash
kubectl get pods -n ai-studio
kubectl get svc -n ai-studio
```

---

## ➡️ Next Step

Proceed to **[Step 11 - 11-ARGOCD_GITOPS_GUIDE.md](11-ARGOCD_GITOPS_GUIDE.md)** to configure automated GitOps continuous delivery with ArgoCD!
