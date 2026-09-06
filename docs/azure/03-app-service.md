# 03 - Azure App Service & Web App Terraform Script & Output Example

Documentation, exact Terraform HCL script, and **example output** for creating **Azure App Service Plan** and **Linux Web App** with **System-Assigned Managed Identity**.

---

## ⚙️ Resource Details

- **Terraform Resources**: `azurerm_service_plan.plan` & `azurerm_linux_web_app.app`
- **Container Port**: `3000` (`WEBSITES_PORT = 3000`)
- **OS Type**: `Linux`
- **Identity**: System-Assigned Managed Identity (`type = "SystemAssigned"`)

---

## 💻 Exact Terraform Code Script

```hcl
# 1. App Service Plan (Linux Sizing)
resource "azurerm_service_plan" "plan" {
  name                = "asp-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = var.app_service_sku
}

# 2. Linux Web App (Container Execution Host)
resource "azurerm_linux_web_app" "app" {
  name                = "app-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = var.app_service_sku == "B1" || var.app_service_sku == "P1v3" ? true : false

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    "NODE_ENV"     = "production"
    "WEBSITES_PORT" = "3000"
  }
}
```

---

## 📋 Example Output Snippet (`terraform output web_app_url`)

```text
web_app_url = "https://app-aistudio-a89k6d.azurewebsites.net"
managed_identity_principal_id = "e87f12bc-90a1-432d-8910-abcdef123456"
```
