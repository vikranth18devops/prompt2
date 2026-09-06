# 02 - Azure Resource Group Configuration

Documentation for the foundational **Azure Resource Group** powering the AI Image Studio infrastructure.

---

## 📋 Resource Details

- **Resource Type**: `Microsoft.Resources/resourceGroups`
- **Terraform Resource**: `azurerm_resource_group.rg`
- **Naming Pattern**: `rg-${var.project_name}-${var.environment}` (e.g. `rg-aistudio-prod`)
- **Default Region**: `eastus`

---

## 🏷️ Tagging Strategy

All resources provisioned inside this resource group inherit standardized environment tags:

```hcl
tags = {
  Environment = "prod"
  Project     = "AI Image Studio"
  ManagedBy   = "Terraform"
}
```

---

## 🧹 Resource Group Lifecycle Management

Deleting the resource group removes all contained Azure resources cleanly:

```bash
az group delete --name rg-aistudio-prod --yes --no-wait
```
