# 08 - GitOps Continuous Deployment Guide (ArgoCD)

Guide for managing automated continuous delivery pipelines using ArgoCD.

---

## 📁 ArgoCD Manifests (`argocd/`)

- [`argocd/application.yaml`](../argocd/application.yaml): ArgoCD `Application` resource with automated sync and pruning.
- [`argocd/application-set.yaml`](../argocd/application-set.yaml): Multi-environment ApplicationSet generator (`staging`, `prod`).
- [`argocd/project.yaml`](../argocd/project.yaml): ArgoCD `AppProject` RBAC isolation policy.

---

## 🚀 Execution Commands

```bash
# Apply security project policy
kubectl apply -f argocd/project.yaml

# Apply GitOps deployment pipeline
kubectl apply -f argocd/application.yaml
```
