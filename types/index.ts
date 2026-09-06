export type UserRole = 'USER' | 'ADMIN';
export type PromptStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';
export type CategoryStatus = 'ACTIVE' | 'INACTIVE';
export type GenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type AssetType = 'INPUT' | 'OUTPUT' | 'PREVIEW';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: CategoryStatus;
  displayOrder: number;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  status: PromptStatus;
  categoryId: string;
  category?: PromptCategory;
  versions?: PromptVersion[];
  currentVersion?: PromptVersion;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  promptTemplate: string;
  negativePrompt?: string | null;
  previewImageUrl: string;
  defaultConfig: {
    guidanceScale: number;
    strength: number;
    steps: number;
    style: string;
  };
  createdAt: string;
}

export interface GenerationAsset {
  id: string;
  generationId: string;
  type: AssetType;
  blobPath: string; // /uploads/, /generated/, /prompt-previews/
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface Generation {
  id: string;
  userId?: string | null;
  promptVersionId: string;
  promptVersion?: PromptVersion;
  status: GenerationStatus;
  progress: number;
  parameters: {
    guidanceScale: number;
    strength: number;
    steps: number;
    customPrompt?: string;
  };
  errorMessage?: string | null;
  executionTimeMs?: number | null;
  assets?: GenerationAsset[];
  inputImageUrl?: string;
  outputImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Azure Service Interfaces (Phase 6)
export interface UploadOptions {
  folder: 'uploads' | 'generated' | 'prompt-previews';
  mimeType: string;
  filename: string;
}

export interface IBlobStorageService {
  uploadFile(buffer: Buffer | string, options: UploadOptions): Promise<{ blobPath: string; publicUrl: string }>;
  deleteFile(blobPath: string): Promise<boolean>;
  getPresignedUrl(blobPath: string): Promise<string>;
}

export interface IServiceBusService {
  dispatchGenerationJob(payload: {
    generationId: string;
    promptTemplate: string;
    parameters: Record<string, any>;
  }): Promise<{ success: boolean; messageId: string }>;
}

export interface IKeyVaultService {
  getSecret(secretName: string, defaultValue?: string): Promise<string>;
}

export interface ITelemetryService {
  trackEvent(name: string, properties?: Record<string, any>, metrics?: Record<string, number>): void;
  trackException(error: Error, customProperties?: Record<string, any>): void;
}
