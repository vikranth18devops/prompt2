# 10 - Terraform Step-by-Step Execution Guide

Step-by-step instructions for executing the Terraform module located in `terraform/`.

---

## 🚀 Execution Steps

### 1. Authenticate with Azure CLI
```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### 2. Configure Terraform Variables
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

### 3. Initialize & Deploy Infrastructure
```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

### 4. Inspect Outputs
```bash
terraform output
```

### 5. Destroy Infrastructure (Teardown)
```bash
terraform destroy -auto-approve
```
