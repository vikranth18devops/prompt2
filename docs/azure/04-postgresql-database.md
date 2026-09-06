# 04 - Azure Database for PostgreSQL Flexible Server Terraform Script & Output Example

Documentation, exact Terraform HCL script, and **example output** for creating **Azure Database for PostgreSQL Flexible Server**.

---

## 🗄️ Resource Details

- **Terraform Resources**: `azurerm_postgresql_flexible_server.postgres`, `azurerm_postgresql_flexible_server_database.db`
- **Database Name**: `ai_platform`
- **PostgreSQL Version**: `15`

---

## 💻 Exact Terraform Code Script

```hcl
# 1. PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "postgres" {
  name                   = "psql-${var.project_name}-${random_string.suffix.result}"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "15"
  administrator_login    = var.pg_admin_user
  administrator_password = var.pg_admin_password
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
  zone                   = "1"
}

# 2. Database `ai_platform`
resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "ai_platform"
  server_id = azurerm_postgresql_flexible_server.postgres.id
  collation = "en_US.utf8"
  charset   = "utf8"
}
```

---

## 📋 Example Output Snippet (`terraform output postgresql_fqdn`)

```text
postgresql_fqdn = "psql-aistudio-a89k6d.postgres.database.azure.com"
```
