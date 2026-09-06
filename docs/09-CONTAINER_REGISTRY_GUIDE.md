# Step 09 - Azure Container Registry (ACR) Image Build & Push

This guide details how to build production Docker images and push them to Azure Container Registry (ACR) for deployment to Azure App Service or Azure Kubernetes Service (AKS).

---

## 📦 What is Azure Container Registry (ACR)?

Azure Container Registry is a private Docker image registry hosted inside your Azure cloud subscription.

---

## 🚀 Building & Pushing Container Images

### Step 1: Create or Get ACR Name
```bash
ACR_NAME="aistudioacr"
az acr create --resource-group rg-aistudio-prod-eastus --name $ACR_NAME --sku Basic
```

### Step 2: Login to ACR
```bash
az acr login --name $ACR_NAME
```

### Step 3: Build & Tag Local Docker Image
```bash
docker build -t $ACR_NAME.azurecr.io/ai-studio:latest -f docker/Dockerfile .
```

### Step 4: Push Image to ACR
```bash
docker push $ACR_NAME.azurecr.io/ai-studio:latest
```

### Step 5: Configure App Service to Use ACR Image
```bash
az webapp config container set \
  --name app-aistudio-prod-eastus \
  --resource-group rg-aistudio-prod-eastus \
  --docker-custom-image-name $ACR_NAME.azurecr.io/ai-studio:latest \
  --docker-registry-server-url https://$ACR_NAME.azurecr.io
```

---

## ➡️ Next Step

Proceed to **[Step 10 - 10-HELM_KUBERNETES_GUIDE.md](10-HELM_KUBERNETES_GUIDE.md)** to deploy to Azure Kubernetes Service (AKS) using Helm!
