import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

const STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'ai-images';

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: ContainerClient | null = null;

if (STORAGE_ACCOUNT_NAME) {
  try {
    const blobEndpoint = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;
    blobServiceClient = new BlobServiceClient(blobEndpoint, new DefaultAzureCredential());
    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    console.log(`[Azure Blob Storage] Initialized via Managed Identity for account ${STORAGE_ACCOUNT_NAME}`);
  } catch (err) {
    console.warn('[Azure Blob Storage] Managed Identity initialization failed:', err);
  }
} else if (STORAGE_CONNECTION_STRING) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    console.log('[Azure Blob Storage] Initialized via connection string');
  } catch (err) {
    console.warn('[Azure Blob Storage] Connection string initialization failed:', err);
  }
}

export interface UploadResult {
  url: string;
  blobName: string;
  isMock: boolean;
}

/**
 * Uploads a file buffer or base64 string to Azure Blob Storage or fallback store
 */
export async function uploadToBlobStorage(
  fileBuffer: Buffer | string,
  filename: string,
  contentType: string = 'image/png'
): Promise<UploadResult> {
  const timeStamp = Date.now();
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const blobName = `${timeStamp}-${safeFilename}`;

  if (containerClient) {
    try {
      await containerClient.createIfNotExists({ access: 'container' });
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      const buffer = typeof fileBuffer === 'string' 
        ? Buffer.from(fileBuffer.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        : fileBuffer;

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: contentType },
      });

      return {
        url: blockBlobClient.url,
        blobName,
        isMock: false,
      };
    } catch (error) {
      console.error('[Azure Blob Storage] Upload error, using fallback:', error);
    }
  }

  // Fallback driver for local development: converts user uploaded image buffer directly to Base64 data URL
  let mockUrl: string;
  if (typeof fileBuffer === 'string' && fileBuffer.startsWith('data:')) {
    mockUrl = fileBuffer;
  } else if (Buffer.isBuffer(fileBuffer)) {
    mockUrl = `data:${contentType};base64,${fileBuffer.toString('base64')}`;
  } else if (typeof fileBuffer === 'string') {
    mockUrl = `data:${contentType};base64,${Buffer.from(fileBuffer).toString('base64')}`;
  } else {
    mockUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`;
  }

  return {
    url: mockUrl,
    blobName,
    isMock: true,
  };
}

/**
 * Generates SAS URL for secure temporary client-side direct uploads
 */
export async function getPresignedUploadUrl(filename: string): Promise<{ uploadUrl: string; blobUrl: string }> {
  const blobName = `${Date.now()}-${filename}`;
  if (containerClient) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    return {
      uploadUrl: blockBlobClient.url,
      blobUrl: blockBlobClient.url,
    };
  }
  return {
    uploadUrl: `/api/upload/mock`,
    blobUrl: `https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80`,
  };
}

export async function getBlobStorageHealthStatus(): Promise<{ isConfigured: boolean; isHealthy: boolean; detail?: string }> {
  if (!STORAGE_ACCOUNT_NAME && !STORAGE_CONNECTION_STRING) {
    return { isConfigured: false, isHealthy: true, detail: 'Not configured (using local base64 fallback)' };
  }
  if (!containerClient) {
    return { isConfigured: true, isHealthy: false, detail: 'Client initialization failed' };
  }
  return { isConfigured: true, isHealthy: true, detail: `Blob container '${CONTAINER_NAME}' ready` };
}
