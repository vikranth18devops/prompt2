# Step 07 - Passwordless Managed Identity & Key Vault RBAC Security

This guide explains how passwordless authentication operates using Azure Managed Identity (`DefaultAzureCredential`) and Key Vault RBAC.

---

## 🔒 What is System-Assigned Managed Identity?

In traditional legacy applications, developers stored database passwords and connection strings directly in `.env` files or hardcoded inside source code.

With **Azure System-Assigned Managed Identity**:
1. Azure App Service is automatically assigned an identity inside Azure Active Directory (Microsoft Entra ID).
2. The Node.js application uses the `@azure/identity` SDK's `DefaultAzureCredential()`.
3. Azure issues short-lived OAuth2 access tokens automatically in the background.
4. **No passwords or connection strings are written anywhere in code or configuration files!**

---

## 🔑 Key Vault Secret Integration Flow

```
[ Next.js App Service ] 
       |
       |-- (1. System-Assigned Managed Identity sends OAuth Token Request)
       v
[ Azure Key Vault ]
       |-- (2. Validates RBAC Role: "Key Vault Secrets User")
       v
[ Return Encrypted Secret Value ]
```

---

## 🛠️ Code Implementation Verification

Our application SDK wrappers in `lib/azure/` use `DefaultAzureCredential()`:

### Key Vault (`lib/azure/keyVault.ts`)
```typescript
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);
```

### Storage Blob (`lib/azure/blob.ts`)
```typescript
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const client = new BlobServiceClient(storageAccountUrl, new DefaultAzureCredential());
```

---

## ➡️ Next Step

Proceed to **[Step 08 - 08-DATABASE_MIGRATIONS.md](08-DATABASE_MIGRATIONS.md)** to perform PostgreSQL database migrations and seed default admin credentials!
