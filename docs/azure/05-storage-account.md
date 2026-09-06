# 05 - Azure Storage Account & Blob Storage Terraform Script & Output Example

Documentation, exact Terraform HCL script, and **example output** for creating **Azure Storage Account** and **Blob Container** (`ai-images`).

---

## 🖼️ Resource Details

- **Terraform Resources**: `azurerm_storage_account.sa` & `azurerm_storage_container.images`
- **Container Name**: `ai-images`

---

## 💻 Exact Terraform Code Script

```hcl
# 1. Storage Account
resource "azurerm_storage_account" "sa" {
  name                     = "st${var.project_name}${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
}

# 2. Blob Container `ai-images`
resource "azurerm_storage_container" "images" {
  name                  = "ai-images"
  storage_account_id    = azurerm_storage_account.sa.id
  container_access_type = "blob"
}
```

---

## 📋 Example Output Snippet (`terraform output storage_account_name`)

```text
storage_account_name = "staistudioa89k6d"
```
