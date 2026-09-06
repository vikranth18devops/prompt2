# 02 - Azure Resource Group Configuration & Terraform Script

Documentation, exact Terraform HCL script, and **example output** for creating the foundational **Azure Resource Group**.

---

## 📋 Resource Details

- **Resource Type**: `Microsoft.Resources/resourceGroups`
- **Terraform Resource**: `azurerm_resource_group.rg`
- **Naming Pattern**: `rg-${var.project_name}-${var.environment}` (e.g. `rg-aistudio-prod`)
- **Default Region**: `eastus`

---

## 💻 Exact Terraform Code Script

```hcl
# 1. Azure Resource Group Foundation
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "AI Image Studio"
    ManagedBy   = "Terraform"
  }
}
```

---

## 📋 Example Output (Azure CLI / Portal Inspection)

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-aistudio-prod",
  "location": "eastus",
  "name": "rg-aistudio-prod",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": {
    "Environment": "prod",
    "ManagedBy": "Terraform",
    "Project": "AI Image Studio"
  }
}
```
