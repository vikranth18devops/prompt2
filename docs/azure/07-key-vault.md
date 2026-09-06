# 07 - Azure Key Vault Secret Management

Documentation for **Azure Key Vault** encrypting and storing application secrets.

---

## 🏦 Vault Specifications

- **Terraform Resource**: `azurerm_key_vault.kv`
- **Vault Name Pattern**: `kv-${var.project_name}-${random_string.suffix.result}`
- **SKU Name**: `standard`
- **Soft Delete Retention**: `7 days`
- **Authorization Model**: Azure RBAC (`enable_rbac_authorization = true`)

---

## 🔐 Vault Secrets Stored

1. **`OPENAI-API-KEY`**: Third-party OpenAI API authorization token.
2. **`JWT-SECRET`**: Secret signing key for Admin HttpOnly authentication tokens.
