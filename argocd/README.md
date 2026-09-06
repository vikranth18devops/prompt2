# ArgoCD GitOps Continuous Deployment

Declarative GitOps configuration for automated deployment of the **AI Image Studio** platform using **ArgoCD**.

---

## 📁 Directory Structure (`argocd/`)

- **`argocd/application.yaml`**: ArgoCD `Application` resource defining GitOps sync policies (automated prune & self-heal) for production.
- **`argocd/application-set.yaml`**: ArgoCD `ApplicationSet` generator for multi-environment deployments (`staging`, `prod`).
- **`argocd/project.yaml`**: ArgoCD `AppProject` RBAC security policies isolating cluster and namespace access.
- **`argocd/values-override-staging.yaml`**: Staging environment Helm values override.
- **`argocd/values-override-prod.yaml`**: Production environment Helm values override.

---

## 🚀 How to Apply ArgoCD Configurations

### 1. Install ArgoCD on Kubernetes Cluster (if not installed)
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2. Apply ArgoCD AppProject
```bash
kubectl apply -f argocd/project.yaml
```

### 3. Deploy Production Application via ArgoCD
```bash
kubectl apply -f argocd/application.yaml
```

### 4. Or Deploy Multi-Environment ApplicationSet (Staging + Prod)
```bash
kubectl apply -f argocd/application-set.yaml
```

---

## 🔍 Checking Application Sync Status

```bash
# View applications in ArgoCD CLI
argocd app list

# Sync application manually if needed
argocd app sync ai-studio-prod

# Check health status
argocd app get ai-studio-prod
```
