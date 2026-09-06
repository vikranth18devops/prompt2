variable "environment" {
  type        = string
  description = "Deployment environment (prod, staging, dev)"
  default     = "prod"
}

variable "location" {
  type        = string
  description = "Azure region for resources"
  default     = "eastus"
}

variable "project_name" {
  type        = string
  description = "Base prefix for resource naming"
  default     = "aistudio"
}

variable "pg_admin_user" {
  type        = string
  description = "PostgreSQL Flexible Server admin username"
  default     = "pgadmin"
}

variable "pg_admin_password" {
  type        = string
  description = "PostgreSQL Flexible Server admin password"
  sensitive   = true
}

variable "app_service_sku" {
  type        = string
  description = "App Service Plan SKU (e.g. B1, P1v3)"
  default     = "B1"
}

variable "openai_api_key" {
  type        = string
  description = "OpenAI API Key to be stored in Azure Key Vault"
  sensitive   = true
  default     = ""
}

variable "jwt_secret" {
  type        = string
  description = "JWT Secret Key for Admin Authentication"
  sensitive   = true
  default     = "super-secret-admin-key-azure-ai-2026"
}
