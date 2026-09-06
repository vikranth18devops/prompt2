# AI Image Studio Helm Chart

Production-grade Kubernetes Helm Chart for deploying the **AI Image Studio & Admin Platform** on Azure Kubernetes Service (AKS) or any standard Kubernetes cluster.

---

## 🏗️ Chart Components

- **Deployment**: Next.js App Router standalone container with non-root security context, Workload Identity support, and health checks.
- **Service**: `ClusterIP` on port 80 routing to container targetPort 3000.
- **Ingress**: TLS-enabled Nginx ingress with cert-manager support and 20MB payload limit for high-res images.
- **ConfigMap & Secret**: Managed configuration parameters and sensitive credentials.
- **ServiceAccount**: Azure Workload Identity integration (`azure.workload.identity/client-id`).
- **HPA**: HorizontalPodAutoscaler scaling dynamically based on CPU/Memory thresholds.
- **Probes**:
  - Liveness: `GET /api/health/liveness`
  - Readiness: `GET /api/health/readiness`

---

## 🚀 Quick Start Deployment

### 1. Install or Upgrade Chart
```bash
helm upgrade --install ai-studio ./helm \
  --namespace ai-studio \
  --create-namespace \
  --set image.repository="aistudio.azurecr.io/ai-studio" \
  --set image.tag="latest" \
  --set secrets.databaseUrl="postgresql://user:pass@host:5432/ai_platform?sslmode=require"
```

### 2. Lint and Validate Chart
```bash
helm lint ./helm
helm template ai-studio ./helm --debug
```

### 3. Dry-Run Installation
```bash
helm install ai-studio ./helm --dry-run --debug
```

---

## ⚙️ Configuration Overrides

Override default values by creating a custom `values-prod.yaml`:

```yaml
replicaCount: 3

image:
  repository: "myregistry.azurecr.io/ai-studio"
  tag: "v1.0.0"

ingress:
  enabled: true
  hosts:
    - host: studio.mycompany.com
      paths:
        - path: /
          pathType: Prefix

secrets:
  databaseUrl: "postgresql://pguser:password@psql-server.postgres.database.azure.com:5432/ai_platform?sslmode=require"
  adminEmail: "admin@mycompany.com"
  adminPassword: "SecurePassword123!"
  jwtSecret: "your-jwt-production-secret"
```

Then run:
```bash
helm upgrade --install ai-studio ./helm -f values-prod.yaml -n ai-studio
```
