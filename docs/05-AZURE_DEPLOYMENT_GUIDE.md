# 05 - Step-by-Step Azure Cloud Production Deployment Guide

Complete step-by-step instructions for deploying the **AI Image Studio & Admin Platform** on **Microsoft Azure**.

---

## 📋 Step-by-Step Deployment Process

### Step 1: Azure CLI Authentication
```bash
az login
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### Step 2: Configure Terraform Variables
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with production passwords & keys
```

### Step 3: Provision Infrastructure with Terraform
```bash
terraform init
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

### Step 4: Build & Push Container Image to Azure Container Registry (ACR)
```bash
az acr create --resource-group rg-aistudio-prod --name aistudioregistry --sku Basic
az acr login --name aistudioregistry
cd ..
docker build -f docker/Dockerfile -t aistudioregistry.azurecr.io/ai-studio:latest .
docker push aistudioregistry.azurecr.io/ai-studio:latest
```

### Step 5: Configure Web App Container Deployment
```bash
az webapp config container set \
  --resource-group rg-aistudio-prod \
  --name app-aistudio-xxxxxx \
  --docker-custom-image-name aistudioregistry.azurecr.io/ai-studio:latest \
  --docker-registry-server-url https://aistudioregistry.azurecr.io
```

### Step 6: Verify Database Auto-Migration
Container startup script `docker-entrypoint.sh` executes `prisma db push` and `prisma db seed` automatically on startup.

### Step 7: Verify Azure Health Check Probes
```bash
# Liveness Probe
curl -i https://app-aistudio-xxxxxx.azurewebsites.net/api/health/liveness

# Readiness Probe
curl -i https://app-aistudio-xxxxxx.azurewebsites.net/api/health/readiness

# Full Health Dashboard
curl -i https://app-aistudio-xxxxxx.azurewebsites.net/api/health
```
