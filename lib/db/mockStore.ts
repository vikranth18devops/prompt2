export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptData {
  id: string;
  title: string;
  slug: string;
  description: string;
  promptTemplate: string;
  negativePrompt?: string | null;
  previewImageUrl: string;
  categoryId: string;
  isActive: boolean;
  defaultConfig: {
    guidanceScale: number;
    strength: number;
    steps: number;
    style: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobData {
  id: string;
  inputImageUrl: string;
  outputImageUrl?: string;
  promptId: string;
  customPrompt?: string;
  parameters: Record<string, any>;
  status: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  errorMessage?: string;
  executionTimeMs?: number;
  createdAt: string;
  updatedAt: string;
}

class MockStore {
  public categories: CategoryData[] = [
    {
      id: 'cat-1',
      name: 'Photorealistic & Portrait',
      slug: 'photorealistic-portrait',
      description: 'Ultra-realistic lighting, 8k render, professional headshots and cinematic portraits.',
      icon: 'Camera',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-2',
      name: 'Cyberpunk & Sci-Fi',
      slug: 'cyberpunk-scifi',
      description: 'Futuristic neon aesthetic, holographic glows, metallic reflections, high-tech visuals.',
      icon: 'Zap',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-3',
      name: 'Anime & Fantasy Art',
      slug: 'anime-fantasy',
      description: 'Studio Ghibli inspired landscapes, vibrant anime character designs, ethereal magic.',
      icon: 'Sparkles',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-4',
      name: '3D Render & Claymation',
      slug: '3d-render',
      description: 'Cute Octane 3D render, Pixar style characters, glossy textures, volumetric lighting.',
      icon: 'Box',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-5',
      name: 'Editorial & Vintage',
      slug: 'editorial-vintage',
      description: 'Vogue cover style, 35mm film grain, moody shadows, minimalist high fashion aesthetics.',
      icon: 'Palette',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  public prompts: PromptData[] = [
    {
      id: 'p-1',
      title: 'Neon Cyberpunk Avatar',
      slug: 'neon-cyberpunk-avatar',
      description: 'Transform your image into a glowing cyberpunk runner in a futuristic neon city street.',
      promptTemplate: 'A futuristic cyberpunk character avatar, neon rain reflections, glowing cyan and magenta accents, high detail, octane render 8k',
      negativePrompt: 'blurry, low quality, distorted features, artifacts, noise',
      previewImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      categoryId: 'cat-2',
      isActive: true,
      defaultConfig: {
        guidanceScale: 8.0,
        strength: 0.75,
        steps: 35,
        style: 'Cyberpunk Neon',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p-2',
      title: 'Studio Portrait Masterpiece',
      slug: 'studio-portrait-masterpiece',
      description: 'Professional high-fashion Rembrandt lighting with ultra-sharp skin texture and Bokeh background.',
      promptTemplate: 'Professional studio portrait photography, soft rembrandt lighting, sharp focus on eyes, 85mm lens f/1.4, cinematic color grade',
      negativePrompt: 'overexposed, grainy, harsh flash, plastic skin',
      previewImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      categoryId: 'cat-1',
      isActive: true,
      defaultConfig: {
        guidanceScale: 7.5,
        strength: 0.65,
        steps: 30,
        style: 'Studio Portrait',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p-3',
      title: 'Ethereal Anime Landscape',
      slug: 'ethereal-anime-landscape',
      description: 'Vibrant hand-drawn anime aesthetic with dramatic clouds and glowing sunset horizon.',
      promptTemplate: 'Anime art style portrait, Makoto Shinkai aesthetic, starry twilight sky, sakura petals floating, vibrant pastel lighting',
      negativePrompt: 'photorealistic, dull colors, dark, muddy',
      previewImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      categoryId: 'cat-3',
      isActive: true,
      defaultConfig: {
        guidanceScale: 9.0,
        strength: 0.8,
        steps: 40,
        style: 'Makoto Anime',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p-4',
      title: '3D Cute Toy Collectible',
      slug: '3d-cute-toy-collectible',
      description: 'Stylized 3D vinyl toy character with glossy reflections and soft ambient occlusion shadows.',
      promptTemplate: 'Adorable 3D figurine, Pop Mart vinyl toy style, smooth clay texture, pastel background, soft studio lighting, Octane render',
      negativePrompt: 'flat, 2d, rough texture, horror',
      previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      categoryId: 'cat-4',
      isActive: true,
      defaultConfig: {
        guidanceScale: 7.0,
        strength: 0.7,
        steps: 30,
        style: '3D Vinyl Toy',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p-5',
      title: 'Vogue Editorial Film 35mm',
      slug: 'vogue-editorial-film-35mm',
      description: 'High-end fashion magazine cover aesthetic with subtle Kodak Portra film grain.',
      promptTemplate: 'High fashion editorial photography, Vogue magazine style, dramatic shadow play, 35mm kodak portra 400 grain, minimalist elegance',
      negativePrompt: 'oversaturated, digital look, noisy',
      previewImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      categoryId: 'cat-5',
      isActive: true,
      defaultConfig: {
        guidanceScale: 8.5,
        strength: 0.6,
        steps: 35,
        style: 'Vintage Film',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  public jobs: Map<string, JobData> = new Map();

  public getActivePrompts(): PromptData[] {
    return this.prompts.filter((p) => p.isActive);
  }

  public getAllPrompts(): PromptData[] {
    return [...this.prompts];
  }

  public getPromptById(id: string): PromptData | undefined {
    return this.prompts.find((p) => p.id === id);
  }

  public createPrompt(data: Omit<PromptData, 'id' | 'createdAt' | 'updatedAt'>): PromptData {
    const newPrompt: PromptData = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.prompts.unshift(newPrompt);
    return newPrompt;
  }

  public updatePrompt(id: string, updates: Partial<PromptData>): PromptData | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.prompts[index] = {
      ...this.prompts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.prompts[index];
  }

  public deletePrompt(id: string): boolean {
    const initialLength = this.prompts.length;
    this.prompts = this.prompts.filter((p) => p.id !== id);
    return this.prompts.length < initialLength;
  }

  public createJob(data: Omit<JobData, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): JobData {
    const newJob: JobData = {
      ...data,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  public getJob(id: string): JobData | undefined {
    return this.jobs.get(id);
  }

  public updateJob(id: string, updates: Partial<JobData>): JobData | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    const updated = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(id, updated);
    return updated;
  }
}

// Global singleton instance for memory persistence during hot-reloads
const globalForMock = globalThis as unknown as { mockStore?: MockStore };
export const mockStore = globalForMock.mockStore || new MockStore();
if (process.env.NODE_ENV !== 'production') globalForMock.mockStore = mockStore;
