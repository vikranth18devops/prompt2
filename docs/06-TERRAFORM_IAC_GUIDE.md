# 06 - Terraform Infrastructure-as-Code (IaC) Guide

Documentation for the Terraform module located in the [`terraform/`](../terraform) folder.

---

## 🛠️ Terraform Infrastructure Resources

- **`azurerm_resource_group`**: Resource group container.
- **`azurerm_linux_web_app`**: App Service container web host with System-Assigned Managed Identity.
- **`azurerm_postgresql_flexible_server`**: PostgreSQL 15 database server & `ai_platform` database.
- **`azurerm_storage_account`**: Storage account & `ai-images` blob container.
- **`azurerm_servicebus_namespace`**: Service Bus & `ai-generation-jobs` queue.
- **`azurerm_key_vault`**: Key Vault storing secrets with RBAC authorization.
- **`azurerm_application_insights`**: Telemetry logger.
- **`azurerm_role_assignment`**: Managed Identity RBAC roles (`Key Vault Secrets User`, `Storage Blob Data Contributor`, `Azure Service Bus Data Sender`).

---

## 🚀 Execution Commands

```bash
cd terraform
./deploy-terraform.sh
```
