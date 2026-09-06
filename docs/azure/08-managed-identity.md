# 08 - Azure Managed Identity & RBAC Security

Documentation for **Azure System-Assigned Managed Identity** eliminating hardcoded passwords and credentials in source code.

---

## 🪪 Managed Identity Architecture

```
[ Next.js App Service ] 
         |
         | (System-Assigned Managed Identity AAD Principal)
         v
 +-------+---------------------------+---------------------------+
 |                                   |                           |
 v                                   v                           v
Key Vault Secrets User      Storage Blob Contributor    Service Bus Sender
(Key Vault access)          (Blob uploads & reads)      (Queue messaging)
```

---

## 🛡️ RBAC Role Assignments (Terraform)

- **Key Vault Secrets User**: Assigned on `azurerm_key_vault.kv.id`.
- **Storage Blob Data Contributor**: Assigned on `azurerm_storage_account.sa.id`.
- **Azure Service Bus Data Sender**: Assigned on `azurerm_servicebus_namespace.sb.id`.

All role assignments target `azurerm_linux_web_app.app.identity[0].principal_id`.
