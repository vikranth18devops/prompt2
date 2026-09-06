# 10 - Terraform Step-by-Step Execution Guide & Output Examples

Step-by-step execution guide and **example output logs** for running the Terraform IaC module located in [`terraform/`](../../terraform).

---

## 💻 Complete Terraform Variables (`terraform/variables.tf`)

```hcl
variable "environment" {
  type        = string
  default     = "prod"
}

variable "location" {
  type        = string
  default     = "eastus"
}

variable "project_name" {
  type        = string
  default     = "aistudio"
}

variable "pg_admin_user" {
  type        = string
  default     = "pgadmin"
}

variable "pg_admin_password" {
  type        = string
  sensitive   = true
}

variable "app_service_sku" {
  type        = string
  default     = "B1"
}

variable "openai_api_key" {
  type        = string
  sensitive   = true
  default     = ""
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  default     = "super-secret-admin-key-azure-ai-2026"
}
```

---

## 🚀 Terminal Execution Commands

```bash
cd terraform

# 1. Log in to Azure
az login

# 2. Set active subscription
az account set --subscription "YOUR_AZURE_SUBSCRIPTION_ID"

# 3. Copy & configure variable file
cp terraform.tfvars.example terraform.tfvars

# 4. Initialize & Deploy
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

---

## 📋 Example Terminal Output (`terraform apply`)

```text
azurerm_resource_group.rg: Creating...
azurerm_resource_group.rg: Creation complete after 2s [id=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-aistudio-prod]
azurerm_log_analytics_workspace.law: Creating...
azurerm_storage_account.sa: Creating...
azurerm_servicebus_namespace.sb: Creating...
azurerm_key_vault.kv: Creating...
azurerm_postgresql_flexible_server.postgres: Creating...
...
azurerm_linux_web_app.app: Creation complete after 45s [id=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-aistudio-prod/providers/Microsoft.Web/sites/app-aistudio-prod-a89k6d]
azurerm_role_assignment.app_kv_user: Creating...
azurerm_role_assignment.app_blob_contributor: Creating...
azurerm_role_assignment.app_servicebus_sender: Creating...
azurerm_role_assignment.app_servicebus_sender: Creation complete after 5s

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.

Outputs:

app_insights_connection_string = <sensitive>
key_vault_uri = "https://kv-aistudio-a89k6d.vault.azure.net/"
managed_identity_principal_id = "e87f12bc-90a1-432d-8910-abcdef123456"
postgresql_fqdn = "psql-aistudio-a89k6d.postgres.database.azure.com"
resource_group_name = "rg-aistudio-prod"
service_bus_namespace = "sb-aistudio-a89k6d"
storage_account_name = "staistudioa89k6d"
web_app_url = "https://app-aistudio-a89k6d.azurewebsites.net"
```

---

## 🔍 Example `terraform output` JSON Inspection

```json
{
  "key_vault_uri": {
    "sensitive": false,
    "type": "string",
    "value": "https://kv-aistudio-a89k6d.vault.azure.net/"
  },
  "managed_identity_principal_id": {
    "sensitive": false,
    "type": "string",
    "value": "e87f12bc-90a1-432d-8910-abcdef123456"
  },
  "postgresql_fqdn": {
    "sensitive": false,
    "type": "string",
    "value": "psql-aistudio-a89k6d.postgres.database.azure.com"
  },
  "resource_group_name": {
    "sensitive": false,
    "type": "string",
    "value": "rg-aistudio-prod"
  },
  "storage_account_name": {
    "sensitive": false,
    "type": "string",
    "value": "staistudioa89k6d"
  },
  "web_app_url": {
    "sensitive": false,
    "type": "string",
    "value": "https://app-aistudio-a89k6d.azurewebsites.net"
  }
}
```
