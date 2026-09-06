# 07 - Azure Key Vault Secret Management Terraform Script & Output Example

Documentation, exact Terraform HCL script, and **example output** for creating **Azure Key Vault** and secret records.

---

## 🏦 Resource Details

- **Terraform Resources**: `azurerm_key_vault.kv` & `azurerm_key_vault_secret.openai_key`, `azurerm_key_vault_secret.jwt_secret`

---

## 💻 Exact Terraform Code Script

```hcl
# Key Vault (RBAC Enabled)
resource "azurerm_key_vault" "kv" {
  name                       = "kv-${var.project_name}-${random_string.suffix.result}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  enable_rbac_authorization  = true
}
```

---

## 📋 Example Output Snippet (`terraform output key_vault_uri`)

```text
key_vault_uri = "https://kv-aistudio-a89k6d.vault.azure.net/"
```
