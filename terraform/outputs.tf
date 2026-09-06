output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "Azure Resource Group name"
}

output "web_app_url" {
  value       = "https://${azurerm_linux_web_app.app.default_hostname}"
  description = "Production Web Application URL"
}

output "key_vault_uri" {
  value       = azurerm_key_vault.kv.vault_uri
  description = "Azure Key Vault URI"
}

output "storage_account_name" {
  value       = azurerm_storage_account.sa.name
  description = "Azure Storage Account Name"
}

output "service_bus_namespace" {
  value       = azurerm_servicebus_namespace.sb.name
  description = "Azure Service Bus Namespace"
}

output "postgresql_fqdn" {
  value       = azurerm_postgresql_flexible_server.postgres.fqdn
  description = "PostgreSQL Flexible Server FQDN"
}

output "app_insights_connection_string" {
  value       = azurerm_application_insights.appinsights.connection_string
  sensitive   = true
  description = "Application Insights Connection String"
}

output "managed_identity_principal_id" {
  value       = azurerm_linux_web_app.app.identity[0].principal_id
  description = "System-Assigned Managed Identity Principal ID"
}
