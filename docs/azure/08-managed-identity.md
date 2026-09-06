# 08 - Azure Managed Identity & RBAC Role Assignments Terraform Script

Documentation and exact Terraform HCL code script for creating **RBAC Role Assignments** linking the Web App's **System-Assigned Managed Identity** to Azure services.

---

## 🪪 Role Assignment Details

- **Terraform Resources**: `azurerm_role_assignment.deployer_kv_admin`, `azurerm_role_assignment.app_kv_user`, `azurerm_role_assignment.app_blob_contributor`, `azurerm_role_assignment.app_servicebus_sender`
- **Target Principal**: `azurerm_linux_web_app.app.identity[0].principal_id`

---

## 💻 Exact Terraform Code Script

```hcl
# 1. Grant Terraform Deployer Admin Rights on Key Vault (to write secrets)
resource "azurerm_role_assignment" "deployer_kv_admin" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

# 2. Grant Web App Managed Identity Access to Key Vault Secrets
resource "azurerm_role_assignment" "app_kv_user" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.app.identity[0].principal_id
}

# 3. Grant Web App Managed Identity Access to Blob Storage (Upload/Read Blobs)
resource "azurerm_role_assignment" "app_blob_contributor" {
  scope                = azurerm_storage_account.sa.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_web_app.app.identity[0].principal_id
}

# 4. Grant Web App Managed Identity Access to Service Bus Queue (Send Messages)
resource "azurerm_role_assignment" "app_servicebus_sender" {
  scope                = azurerm_servicebus_namespace.sb.id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = azurerm_linux_web_app.app.identity[0].principal_id
}
```
