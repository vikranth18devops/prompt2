import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const KEY_VAULT_URL =
  process.env.AZURE_KEYVAULT_URL ||
  process.env.AZURE_KEY_VAULT_URL ||
  process.env.KEY_VAULT_URL;

let secretClient: SecretClient | null = null;

if (KEY_VAULT_URL) {
  try {
    const credential = new DefaultAzureCredential();
    secretClient = new SecretClient(KEY_VAULT_URL, credential);
    console.log(`[Azure Key Vault] Initialized client for ${KEY_VAULT_URL} via Managed Identity / DefaultAzureCredential`);
  } catch (err) {
    console.warn('[Azure Key Vault] Init failed:', err);
  }
}

/**
 * Retrieve secret from Azure Key Vault or fallback to process.env
 */
export async function getSecret(secretName: string, defaultValue: string = ''): Promise<string> {
  if (secretClient) {
    try {
      const secret = await secretClient.getSecret(secretName);
      if (secret.value) return secret.value;
    } catch (err) {
      console.warn(`[Azure Key Vault] Could not fetch secret ${secretName}, falling back to env:`, err);
    }
  }

  // Fallback to local environment variable
  const envKey = secretName.replace(/-/g, '_').toUpperCase();
  return process.env[envKey] || process.env[secretName] || defaultValue;
}

export async function getKeyVaultHealthStatus(): Promise<{ isConfigured: boolean; isHealthy: boolean; detail?: string }> {
  if (!KEY_VAULT_URL) {
    return { isConfigured: false, isHealthy: true, detail: 'Not configured (using environment variables)' };
  }
  if (!secretClient) {
    return { isConfigured: true, isHealthy: false, detail: 'Client initialization failed' };
  }
  return { isConfigured: true, isHealthy: true, detail: 'Key Vault client active via DefaultAzureCredential' };
}
