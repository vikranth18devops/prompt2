# 11 - Terraform Remote State Storage & State File Management

Guide for managing the **Terraform State File (`terraform.tfstate`)** securely using Azure Blob Storage Remote Backend and State Locking.

---

## ❓ What is the Terraform State File?

The Terraform state file (`terraform.tfstate`) is a database mapping your local Terraform code to actual live Azure cloud resources. It records resource IDs, metadata, dependencies, and private attributes.

---

## 🔒 Why Use Remote State Storage in Azure?

1. **Team Collaboration**: Prevents two team members from updating infrastructure at the same time.
2. **State Locking**: Uses Azure Blob Leases to lock the state file during `terraform apply`, preventing state corruption.
3. **Security & Encryption**: Encrypts sensitive resource attributes at rest in Azure Storage rather than plain text on a local laptop.
4. **Disaster Recovery**: Protects state from accidental deletion or disk failures.

---

## 🚀 Step-by-Step Setup: Azure Remote Backend

### Step 1: Run the Remote State Storage Provisioning Script
Run the helper script to create a dedicated Azure Storage Account for state storage:

```bash
cd terraform
./setup-remote-state.sh
```

*Terminal Output Example:*
```text
1️⃣ Creating Resource Group 'rg-terraform-state'...
2️⃣ Creating Storage Account 'tfstateaistudioa89k6d'...
3️⃣ Creating Blob Container 'tfstate'...
✅ Remote State Backend Storage Ready!
```

---

### Step 2: Configure `backend "azurerm"` in `terraform/providers.tf`
Uncomment and update the backend block in [`terraform/providers.tf`](../../terraform/providers.tf):

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  # Azure Blob Storage Remote Backend Configuration
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "tfstateaistudioa89k6d"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
```

---

### Step 3: Initialize & Migrate Local State to Azure
Run `terraform init` to copy your local state file to Azure Blob Storage:

```bash
terraform init -migrate-state
```

*Terminal Prompt:*
```text
Do you want to copy existing state to the new backend?
  Enter a value: yes

Successfully configured the backend "azurerm"! Terraform will now
use this backend for all future state operations.
```

---

## 🛠️ Useful Terraform State Management Commands

### 1. List All Managed Resources in State
```bash
terraform state list
```
*Example Output:*
```text
azurerm_resource_group.rg
azurerm_linux_web_app.app
azurerm_postgresql_flexible_server.postgres
azurerm_storage_account.sa
azurerm_key_vault.kv
```

### 2. Inspect Details of a Specific Resource
```bash
terraform state show azurerm_linux_web_app.app
```

### 3. Re-Sync State File with Live Cloud Infrastructure
If someone modifies a resource manually in Azure Portal, update your state file:
```bash
terraform refresh
```

### 4. Force Unlock a Stuck State Lease (If a Build Crashing Left State Locked)
```bash
terraform force-unlock <LOCK-ID>
```
