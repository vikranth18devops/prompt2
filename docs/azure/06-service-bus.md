# 06 - Azure Service Bus Queue Terraform Script

Documentation and exact Terraform HCL code script for creating **Azure Service Bus Namespace** and Queue `ai-generation-jobs`.

---

## 📮 Resource Details

- **Terraform Resources**: `azurerm_servicebus_namespace.sb` & `azurerm_servicebus_queue.jobs`
- **Queue Name**: `ai-generation-jobs`
- **Namespace SKU**: `Standard`

---

## 💻 Exact Terraform Code Script

```hcl
# 1. Service Bus Namespace
resource "azurerm_servicebus_namespace" "sb" {
  name                = "sb-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard"
}

# 2. Queue `ai-generation-jobs`
resource "azurerm_servicebus_queue" "jobs" {
  name         = "ai-generation-jobs"
  namespace_id = azurerm_servicebus_namespace.sb.id

  enable_partitioning = false
}
```
