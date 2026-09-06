# Step 11 - GitOps Automated Continuous Delivery with ArgoCD

This guide details how to configure declarative, automated continuous deployment for the application using ArgoCD on Kubernetes.

---

## 📁 ArgoCD GitOps Manifests (`argocd/`)

- [`argocd/application.yaml`](../argocd/application.yaml): ArgoCD `Application` CRD with self-healing, automated sync, and resource pruning.
- [`argocd/application-set.yaml`](../argocd/application-set.yaml): Multi-environment `ApplicationSet` generator (`staging` and `prod`).
- [`argocd/project.yaml`](../argocd/project.yaml): ArgoCD `AppProject` RBAC isolation policy.

---

## 🔄 GitOps Synchronization Architecture

```
[ Developer Pushes Code to GitHub (main) ]
                   |
                   v
[ GitHub Repository: vikranth18devops/prompt2 ]
                   |
                   v (ArgoCD Polls / Receives Webhook)
[ ArgoCD Controller in Kubernetes ]
                   |
                   v (Compares Live Cluster vs Git State)
[ Automatically Syncs Helm Chart to Kubernetes Pods ]
```

---

## 🚀 Execution Commands

### Step 1: Apply ArgoCD RBAC Security Project
```bash
kubectl apply -f argocd/project.yaml
```

### Step 2: Deploy ArgoCD Application
```bash
kubectl apply -f argocd/application.yaml
```

### Step 3: Check Sync Status in ArgoCD CLI
```bash
argocd app get ai-studio-prod
```
*Output:*
```
Name:               argocd/ai-studio-prod
Project:            ai-studio-project
Server:             https://kubernetes.default.svc
Target:             HEAD
Sync Status:        Synced to HEAD (a1b2c3d)
Health Status:      Healthy
```

---

## ➡️ Next Step

Proceed to **[Step 12 - 12-OBSERVABILITY_MONITORING.md](12-OBSERVABILITY_MONITORING.md)** to configure monitoring dashboards with Grafana, Prometheus, Loki & ELK Stack!
