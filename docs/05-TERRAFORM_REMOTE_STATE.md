# Step 05 - Terraform Remote Backend State File Setup

Before deploying infrastructure with Terraform, beginners MUST set up an Azure Storage Account to store the Terraform State File (`.tfstate`) securely with state locking.

---

## ❓ Why Remote State is Required Before Running Terraform

1. **State Locking**: Prevents two team members or CI/CD pipelines from corrupting infrastructure by running `terraform apply` simultaneously.
2. **Security**: Keeps secrets (connection strings, identity IDs) stored securely in Azure Blob Storage rather than on local laptops.
3. **Collaboration**: Enables team members to share infrastructure state seamlessly.

---

## 🛠️ Automated Setup Script (`terraform/setup-remote-state.sh`)

We provide an automated bash script that provisions the Azure Storage Account and Blob Container for state storage.

```bash
#!/bin/bash
set -e

# Configuration Variables
RESOURCE_GROUP_NAME="rg-aistudio-tfstate"
LOCATION="eastus"
STORAGE_ACCOUNT_NAME="tfaistudiostate$RANDOM"
CONTAINER_NAME="tfstate"

echo "=== 1. Creating Resource Group for State File ==="
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION

echo "=== 2. Creating Azure Storage Account ==="
az storage account create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $STORAGE_ACCOUNT_NAME \
  --sku Standard_LRS \
  --encryption-services blob

echo "=== 3. Creating Blob Container ==="
az storage container create \
  --name $CONTAINER_NAME \
  --account-name $STORAGE_ACCOUNT_NAME

echo "=== SUCCESS! Remote State Backend Configured ==="
echo "Update terraform/main.tf backend block with storage_account_name: $STORAGE_ACCOUNT_NAME"
```

---

## 🚀 Execution Steps for Beginners

### Step 1: Login to Azure CLI
```bash
az login
az account set --subscription "YOUR_AZURE_SUBSCRIPTION_ID"
```

### Step 2: Run the Remote State Helper Script
```bash
chmod +x terraform/setup-remote-state.sh
./terraform/setup-remote-state.sh
```

### Step 3: Configure Backend Block in `terraform/main.tf`
```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-aistudio-tfstate"
    storage_account_name = "tfaistudiostate12345" # Replace with generated name
    container_name       = "tfstate"
    key                  = "aistudio.terraform.tfstate"
  }
}
```

---

## ➡️ Next Step

Proceed to **[Step 06 - 06-AZURE_TERRAFORM_DEPLOY.md](06-AZURE_TERRAFORM_DEPLOY.md)** to provision all Azure Cloud infrastructure resources in exact sequence!
