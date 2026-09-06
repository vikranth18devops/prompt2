# 09 - Azure Application Insights & Log Analytics Terraform Script

Documentation and exact Terraform HCL code script for creating **Log Analytics Workspace** and **Application Insights** telemetry logger.

---

## 📹 Resource Details

- **Terraform Resources**: `azurerm_log_analytics_workspace.law` & `azurerm_application_insights.appinsights`
- **Retention**: `30 days`
- **Application Type**: `web`

---

## 💻 Exact Terraform Code Script

```hcl
# 1. Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "law" {
  name                = "law-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# 2. Application Insights Telemetry Logger
resource "azurerm_application_insights" "appinsights" {
  name                = "appi-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.law.id
  application_type    = "web"
}
```
