# 03 - Azure App Service & Web App Configuration

Documentation for **Azure App Service** hosting the containerized Next.js application.

---

## ⚙️ Service Specifications

- **Terraform Resource**: `azurerm_linux_web_app.app`
- **Plan Resource**: `azurerm_service_plan.plan`
- **OS Type**: `Linux`
- **SKU Tier**: `B1` (Basic) or `P1v3` (Premium)
- **Container Port**: `3000` (`WEBSITES_PORT = 3000`)
- **Node Runtime**: `Node.js 22 LTS`

---

## 🪪 Identity & Authentication Settings

```hcl
identity {
  type = "SystemAssigned"
}
```

The System-Assigned Managed Identity generates a unique Azure Active Directory (AAD) Principal ID used for passwordless access to Azure Key Vault, Azure Storage, and Azure Service Bus.

---

## 🌐 Health Check Probe Settings

App Service automatically monitors application health using built-in HTTP probes:
- **Path**: `/api/health/liveness`
- **Interval**: 30s
- **Threshold**: 3 retries
