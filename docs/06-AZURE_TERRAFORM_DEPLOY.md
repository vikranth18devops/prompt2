# Step 06 - Step-by-Step Azure Cloud Provisioning (Resource Order 1st to Last)

This document provides freshers with the exact step-by-step sequence for provisioning Azure resources using Terraform.

---

## 🏗️ Execution Order: What Goes 1st, 2nd, 3rd?

When creating cloud infrastructure, resources MUST be provisioned in strict dependency order:

```
[ 1st: Resource Group ]
        |
        +---> [ 2nd: PostgreSQL Flexible Server ]
        |
        +---> [ 3rd: Storage Account & Container ]
        |
        +---> [ 4th: Service Bus Namespace & Queue ]
        |
        +---> [ 5th: Application Insights ]
        |
        +---> [ 6th: Key Vault & Secrets ]
        |
        +---> [ 7th: App Service Plan & Web App (with Managed Identity) ]
        |
        +---> [ 8th: RBAC Role Assignments (Key Vault Secrets User, Blob Data Contributor) ]
```

---

## 💻 Terraform Execution Commands

Run these commands inside the `terraform/` directory:

### Step 1: Initialize Terraform & Download Azure Provider Plugins
```bash
cd terraform
terraform init
```

### Step 2: Format & Validate HCL Code
```bash
terraform fmt
terraform validate
```

### Step 3: Run Dry-Run Execution Plan
```bash
terraform plan -out=tfplan
```
*Review the execution plan output. Terraform will output 12+ resources to be created.*

### Step 4: Apply & Provision Resources
```bash
terraform apply tfplan
```

---

## 📝 Expected Terminal Output Example

```
Terraform will perform the following actions:

  # azurerm_resource_group.rg will be created
  + resource "azurerm_resource_group" "rg" {
      + id       = (known after apply)
      + location = "eastus"
      + name     = "rg-aistudio-prod-eastus"
    }

  # azurerm_postgresql_flexible_server.db will be created
  + resource "azurerm_postgresql_flexible_server" "db" { ... }

  # azurerm_storage_account.sa will be created
  + resource "azurerm_storage_account" "sa" { ... }

  # azurerm_linux_web_app.app will be created
  + resource "azurerm_linux_web_app" "app" {
      + identity {
          + principal_id = (known after apply)
          + type         = "SystemAssigned"
        }
    }

Plan: 12 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

azurerm_resource_group.rg: Creating...
azurerm_resource_group.rg: Creation complete after 3s [id=/subscriptions/.../resourceGroups/rg-aistudio-prod-eastus]
...
Apply complete! Resources: 12 added, 0 changed, 0 destroyed.

Outputs:
app_service_default_hostname = "app-aistudio-prod-eastus.azurewebsites.net"
storage_account_name = "staistudioprodeastus"
postgresql_server_fqdn = "psql-aistudio-prod-eastus.postgres.database.azure.com"
```

---

## ➡️ Next Step

Proceed to **[Step 07 - 07-MANAGED_IDENTITY_SECURITY.md](07-MANAGED_IDENTITY_SECURITY.md)** to verify passwordless security and Key Vault integration!
