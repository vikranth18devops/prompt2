# 06 - Terraform Azure Infrastructure Creation Sequence & Implementation Guide

This guide provides the exact resource creation sequence, dependency graph, and step-by-step terminal commands for deploying the infrastructure on Microsoft Azure using Terraform.

---

## 🏗️ Resource Dependency Graph & Creation Sequence

When Terraform runs `terraform apply`, resources must be provisioned in a strict dependency sequence. Here is what goes first, second, third, and why:

```
                       [ 1. Provider & Client Config ]
                                      |
                                      v
                       [ 2. Azure Resource Group ]
                               (Foundation)
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
[ 3. Log Analytics & AppInsights ] [ 4. Storage Account ]   [ 5. Service Bus ]
         |                            |                            |
         v                            v                            v
[ 6. Azure Key Vault ]        [ 7. Blob Container ]         [ 8. Queue ]
         |
         v
[ 9. Key Vault Secrets ]
  & Postgres Server/DB
         |
         v
[ 10. App Service Plan & Web App ] (System-Assigned Managed Identity)
         |
         v
[ 11. RBAC Role Assignments ] (KV User, Storage Contributor, SB Sender)
```

---

## 🔢 What Goes First: Detailed Execution Sequence

### Phase 1: Foundational Provider & Base Resource Group (FIRST)
1. **`azurerm` Provider & Tenant Data (`azurerm_client_config`)**: Authenticates with Azure and fetches your Azure Tenant ID & Subscription ID.
2. **`azurerm_resource_group.rg`**: Creates the logical container (`rg-aistudio-prod`) holding all cloud resources. All subsequent resources depend on this Resource Group.

### Phase 2: Monitoring, Storage, and Messaging Backbones (SECOND)
3. **`azurerm_log_analytics_workspace.law` & `azurerm_application_insights.appinsights`**: Provisioned early so logging endpoints are available for telemetry.
4. **`azurerm_storage_account.sa`**: Storage account provisioned to host blob assets.
5. **`azurerm_servicebus_namespace.sb`**: Service Bus namespace provisioned for message queuing.

### Phase 3: Security Vault, Blob Containers & Queues (THIRD)
6. **`azurerm_key_vault.kv`**: Key Vault created with RBAC authorization enabled (`enable_rbac_authorization = true`).
7. **`azurerm_storage_container.images`**: Container `ai-images` created inside the Storage Account.
8. **`azurerm_servicebus_queue.jobs`**: Queue `ai-generation-jobs` created inside the Service Bus Namespace.

### Phase 4: Database Server & Secrets Storage (FOURTH)
9. **`azurerm_postgresql_flexible_server.postgres` & `azurerm_postgresql_flexible_server_database.db`**: PostgreSQL Flexible Server created with database `ai_platform` and Azure Firewall Rule (`0.0.0.0`).
10. **`azurerm_key_vault_secret` (`OPENAI-API-KEY` & `JWT-SECRET`)**: Secrets stored inside Key Vault (depends on deployer Key Vault Administrator role assignment).

### Phase 5: Web Application & System-Assigned Managed Identity (FIFTH)
11. **`azurerm_service_plan.plan` & `azurerm_linux_web_app.app`**: Linux Web App created with `identity { type = "SystemAssigned" }`. Azure generates a unique Principal ID for the Web App.

### Phase 6: RBAC Role Assignments (SIXTH / FINAL)
12. **`azurerm_role_assignment`**: Grants passwordless zero-credential permissions to the Web App's Principal ID:
    - **`Key Vault Secrets User`**: Allows Web App to read Key Vault secrets.
    - **`Storage Blob Data Contributor`**: Allows Web App to upload & read blobs.
    - **`Azure Service Bus Data Sender`**: Allows Web App to send job messages to the queue.

---

## 🚀 Step-by-Step Terminal Execution Process

Follow these steps in terminal to execute the Terraform code:

### Step 1: Open Terminal & Navigate to Terraform Folder
```bash
cd /Users/aarvik/Documents/prompt2/terraform
```

### Step 2: Log in to Azure CLI & Select Subscription
```bash
# 1. Log in to Azure
az login

# 2. Select subscription
az account set --subscription "YOUR_AZURE_SUBSCRIPTION_ID"
```

### Step 3: Create `terraform.tfvars` Variable File
```bash
cp terraform.tfvars.example terraform.tfvars
```
Open `terraform.tfvars` and set your desired production passwords:
```hcl
environment       = "prod"
location          = "eastus"
project_name      = "aistudio"
pg_admin_user     = "pgadmin"
pg_admin_password = "P@ssw0rd!Azure2026AI"
app_service_sku   = "B1"
openai_api_key    = "sk-proj-your-actual-openai-key"
jwt_secret        = "super-secret-admin-key-azure-ai-2026"
```

### Step 4: Initialize Terraform
```bash
terraform init
```

### Step 5: Validate Configuration Syntax
```bash
terraform validate
```

### Step 6: Generate & Review Execution Plan
```bash
terraform plan -out=tfplan
```

### Step 7: Apply Infrastructure Creation Plan
```bash
terraform apply tfplan
```

### Step 8: Verify Outputs
```bash
terraform output
```

---

## 🧹 Teardown Resources (When No Longer Needed)

To safely destroy all provisioned Azure resources in reverse sequence:

```bash
terraform destroy -auto-approve
```
