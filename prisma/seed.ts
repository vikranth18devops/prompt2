import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for expanded models...');

  // Create Admin User
  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@azure-ai.com' },
    update: {},
    create: {
      email: 'admin@azure-ai.com',
      passwordHash,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });
  console.log(`👤 Admin created: ${admin.email}`);

  // Create Categories
  const categoriesData = [
    {
      name: 'Photorealistic & Portrait',
      slug: 'photorealistic-portrait',
      description: 'Ultra-realistic lighting, 8k render, professional headshots and cinematic portraits.',
      icon: 'Camera',
      displayOrder: 1,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Cyberpunk & Sci-Fi',
      slug: 'cyberpunk-scifi',
      description: 'Futuristic neon aesthetic, holographic glows, metallic reflections, high-tech visuals.',
      icon: 'Zap',
      displayOrder: 2,
      status: 'ACTIVE' as const,
    },
    {
      name: 'Anime & Fantasy Art',
      slug: 'anime-fantasy',
      description: 'Studio Ghibli inspired landscapes, vibrant anime character designs, ethereal magic.',
      icon: 'Sparkles',
      displayOrder: 3,
      status: 'ACTIVE' as const,
    },
  ];

  for (const cat of categoriesData) {
    const createdCat = await prisma.promptCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`📁 Category: ${createdCat.name}`);

    // Create Prompts with PromptVersion
    if (cat.slug === 'cyberpunk-scifi') {
      await prisma.prompt.upsert({
        where: { slug: 'neon-cyberpunk-avatar' },
        update: {},
        create: {
          title: 'Neon Cyberpunk Avatar',
          slug: 'neon-cyberpunk-avatar',
          categoryId: createdCat.id,
          status: 'ACTIVE',
          versions: {
            create: {
              versionNumber: 1,
              promptTemplate: 'A futuristic cyberpunk character avatar, neon rain reflections, glowing cyan and magenta accents, high detail, octane render 8k',
              negativePrompt: 'blurry, low quality, distorted features, artifacts',
              previewImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
              defaultConfig: { guidanceScale: 8.0, strength: 0.75, steps: 35, style: 'Cyberpunk Neon' },
            },
          },
        },
      });
    } else if (cat.slug === 'photorealistic-portrait') {
      await prisma.prompt.upsert({
        where: { slug: 'studio-portrait-masterpiece' },
        update: {},
        create: {
          title: 'Studio Portrait Masterpiece',
          slug: 'studio-portrait-masterpiece',
          categoryId: createdCat.id,
          status: 'ACTIVE',
          versions: {
            create: {
              versionNumber: 1,
              promptTemplate: 'Professional studio portrait photography, soft rembrandt lighting, sharp focus on eyes, 85mm lens f/1.4, cinematic color grade',
              negativePrompt: 'overexposed, grainy, harsh flash, plastic skin',
              previewImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              defaultConfig: { guidanceScale: 7.5, strength: 0.65, steps: 30, style: 'Studio Portrait' },
            },
          },
        },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
