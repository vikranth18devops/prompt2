# 04 - Azure Database for PostgreSQL Flexible Server

Documentation for **Azure Database for PostgreSQL Flexible Server** hosting the relational database layer.

---

## 🗄️ Database Server Specifications

- **Terraform Resource**: `azurerm_postgresql_flexible_server.postgres`
- **Database Resource**: `azurerm_postgresql_flexible_server_database.db`
- **Database Name**: `ai_platform`
- **PostgreSQL Version**: `15`
- **SKU Tier**: `B_Standard_B1ms` (Burstable General Purpose)
- **Storage**: `32 GB` (32768 MB)
- **Collation / Charset**: `en_US.utf8` / `utf8`

---

## 🔒 Security & Firewall Access

SSL enforcement is enabled (`sslmode=require`).

Azure Firewall Rule (`azurerm_postgresql_flexible_server_firewall_rule.azure_access`) allows secure connection from Azure App Service instances (`start_ip_address = 0.0.0.0`, `end_ip_address = 0.0.0.0`).
