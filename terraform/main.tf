# Random suffix for globally unique resource names
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

data "azurerm_client_config" "current" {}

# 1. Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "AI Image Studio"
    ManagedBy   = "Terraform"
  }
}

# 2. Log Analytics & Application Insights
resource "azurerm_log_analytics_workspace" "law" {
  name                = "law-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appinsights" {
  name                = "appi-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.law.id
  application_type    = "web"
}

# 3. Azure Storage Account & Blob Container
resource "azurerm_storage_account" "sa" {
  name                     = "st${var.project_name}${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    cors_rule {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "POST", "PUT", "HEAD"]
      allowed_origins = ["*"]
      exposed_headers = ["*"]
      max_age_in_seconds = 3600
    }
  }

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_storage_container" "images" {
  name                  = "ai-images"
  storage_account_id    = azurerm_storage_account.sa.id
  container_access_type = "blob"
}

# 4. Azure Service Bus Namespace & Queue
resource "azurerm_servicebus_namespace" "sb" {
  name                = "sb-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard"
}

resource "azurerm_servicebus_queue" "jobs" {
  name         = "ai-generation-jobs"
  namespace_id = azurerm_servicebus_namespace.sb.id

  enable_partitioning = false
}

# 5. Azure Key Vault
resource "azurerm_key_vault" "kv" {
  name                       = "kv-${var.project_name}-${random_string.suffix.result}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  enable_rbac_authorization = true
}

resource "azurerm_key_vault_secret" "openai_key" {
  name         = "OPENAI-API-KEY"
  value        = var.openai_api_key != "" ? var.openai_api_key : "placeholder-key-to-update"
  key_vault_id = azurerm_key_vault.kv.id

  depends_on = [azurerm_role_assignment.deployer_kv_admin]
}

resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "JWT-SECRET"
  value        = var.jwt_secret
  key_vault_id = azurerm_key_vault.kv.id

  depends_on = [azurerm_role_assignment.deployer_kv_admin]
}

# 6. Azure Database for PostgreSQL Flexible Server
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

  tags = {
    Environment = var.environment
  }
}

resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "ai_platform"
  server_id = azurerm_postgresql_flexible_server.postgres.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# Allow Azure Services firewall access to PostgreSQL
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure_access" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# 7. App Service Plan & Linux Web App (Container App ready)
resource "azurerm_service_plan" "plan" {
  name                = "asp-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = var.app_service_sku
}

resource "azurerm_linux_web_app" "app" {
  name                = "app-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  # Enable System-Assigned Managed Identity for Zero-Credential Azure SDK Access
  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = var.app_service_sku == "B1" || var.app_service_sku == "P1v3" ? true : false
    
    application_stack {
      node_version = "20-lts"
    }

    cors {
      allowed_origins     = ["*"]
      support_credentials = false
    }
  }

  app_settings = {
    "NODE_ENV"                                    = "production"
    "WEBSITES_PORT"                               = "3000"
    "DATABASE_URL"                                = "postgresql://${var.pg_admin_user}:${var.pg_admin_password}@${azurerm_postgresql_flexible_server.postgres.fqdn}:5432/ai_platform?sslmode=require"
    "AZURE_KEYVAULT_URL"                          = azurerm_key_vault.kv.vault_uri
    "AZURE_STORAGE_ACCOUNT_NAME"                  = azurerm_storage_account.sa.name
    "AZURE_STORAGE_CONTAINER_NAME"                = azurerm_storage_container.images.name
    "AZURE_SERVICE_BUS_FULLY_QUALIFIED_NAMESPACE" = "${azurerm_servicebus_namespace.sb.name}.servicebus.windows.net"
    "AZURE_SERVICE_BUS_QUEUE_NAME"                = azurerm_servicebus_queue.jobs.name
    "APPLICATIONINSIGHTS_CONNECTION_STRING"      = azurerm_application_insights.appinsights.connection_string
    "ADMIN_EMAIL"                                 = "admin@azure-ai.com"
    "ADMIN_PASSWORD"                              = "AdminPass123!"
  }
}

# 8. RBAC Role Assignments for Managed Identity
resource "azurerm_role_assignment" "deployer_kv_admin" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "app_kv_user" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_web_app.app.identity[0].principal_id
}

resource "azurerm_role_assignment" "app_blob_contributor" {
  scope                = azurerm_storage_account.sa.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_web_app.app.identity[0].principal_id
}

resource "azurerm_role_assignment" "app_servicebus_sender" {
  scope                = azurerm_servicebus_namespace.sb.id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = azurerm_linux_web_app.app.identity[0].principal_id
}
