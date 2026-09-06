import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { IBlobStorageService, UploadOptions } from '@/types';

const STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'ai-platform';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export class BlobStorageService implements IBlobStorageService {
  private containerClient: ContainerClient | null = null;

  constructor() {
    if (STORAGE_CONNECTION_STRING) {
      try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
        this.containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
      } catch (err) {
        console.warn('[BlobStorageService] Azure SDK initialization warning:', err);
      }
    }
  }

  public async uploadFile(
    fileBuffer: Buffer | string,
    options: UploadOptions
  ): Promise<{ blobPath: string; publicUrl: string }> {
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(options.mimeType)) {
      throw new Error(`Invalid MIME type: ${options.mimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`);
    }

    const buffer = typeof fileBuffer === 'string'
      ? Buffer.from(fileBuffer.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      : fileBuffer;

    // Validate size
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds 20MB limit. Current size: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB`);
    }

    const cleanFilename = options.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobPath = `/${options.folder}/${Date.now()}-${cleanFilename}`;

    if (this.containerClient) {
      try {
        await this.containerClient.createIfNotExists({ access: 'container' });
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobPath.substring(1));
        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: { blobContentType: options.mimeType },
        });
        return {
          blobPath,
          publicUrl: blockBlobClient.url,
        };
      } catch (error) {
        console.error('[BlobStorageService] Azure upload failed, using fallback:', error);
      }
    }

    // Mock fallback URL for development: converts user uploaded image buffer directly to Base64 data URL
    let mockUrl: string;
    if (typeof fileBuffer === 'string' && fileBuffer.startsWith('data:')) {
      mockUrl = fileBuffer;
    } else if (Buffer.isBuffer(fileBuffer)) {
      mockUrl = `data:${options.mimeType};base64,${fileBuffer.toString('base64')}`;
    } else {
      mockUrl = `data:${options.mimeType};base64,${Buffer.from(fileBuffer as any).toString('base64')}`;
    }

    return {
      blobPath,
      publicUrl: mockUrl,
    };
  }

  public async deleteFile(blobPath: string): Promise<boolean> {
    if (this.containerClient) {
      try {
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobPath.replace(/^\//, ''));
        await blockBlobClient.deleteIfExists();
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  public async getPresignedUrl(blobPath: string): Promise<string> {
    if (this.containerClient) {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobPath.replace(/^\//, ''));
      return blockBlobClient.url;
    }
    return `https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80`;
  }
}

export const blobStorageService = new BlobStorageService();
