import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';
import { getAdminFromCookies } from '@/lib/auth';
import { trackEvent } from '@/lib/azure/telemetry';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    const dbPrompts = await prisma.prompt.findMany({
      where: includeAll ? {} : { status: 'ACTIVE' },
      include: {
        category: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten to easy PromptItem format for UI consumption
    const formattedPrompts = dbPrompts.map((p) => {
      const latestVersion = p.versions[0];
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        categoryId: p.categoryId,
        isActive: p.status === 'ACTIVE',
        status: p.status,
        description: latestVersion?.promptTemplate || p.title,
        promptTemplate: latestVersion?.promptTemplate || '',
        negativePrompt: latestVersion?.negativePrompt,
        previewImageUrl: latestVersion?.previewImageUrl || '',
        defaultConfig: (latestVersion?.defaultConfig as any) || { guidanceScale: 7.5, strength: 0.75, steps: 30, style: 'Custom' },
        promptVersionId: latestVersion?.id,
      };
    });

    trackEvent('FetchPromptsDB', { count: formattedPrompts.length, includeAll });
    return NextResponse.json({ success: true, prompts: formattedPrompts });
  } catch (error) {
    const fallbackPrompts = includeAll
      ? mockStore.getAllPrompts()
      : mockStore.getActivePrompts();

    trackEvent('FetchPromptsMock', { count: fallbackPrompts.length, includeAll });
    return NextResponse.json({ success: true, prompts: fallbackPrompts, isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, promptTemplate, negativePrompt, previewImageUrl, categoryId, defaultConfig } = body;

    if (!title || !promptTemplate || !previewImageUrl || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    try {
      const newPrompt = await prisma.prompt.create({
        data: {
          title,
          slug,
          categoryId,
          status: 'ACTIVE',
          versions: {
            create: {
              versionNumber: 1,
              promptTemplate,
              negativePrompt: negativePrompt || null,
              previewImageUrl,
              defaultConfig: defaultConfig || { guidanceScale: 7.5, strength: 0.75, steps: 30, style: 'Custom' },
            },
          },
        },
        include: { versions: true },
      });

      const formatted = {
        id: newPrompt.id,
        title: newPrompt.title,
        slug: newPrompt.slug,
        categoryId: newPrompt.categoryId,
        isActive: newPrompt.status === 'ACTIVE',
        status: newPrompt.status,
        description: description || title,
        promptTemplate,
        negativePrompt,
        previewImageUrl,
        defaultConfig: defaultConfig || { guidanceScale: 7.5, strength: 0.75, steps: 30, style: 'Custom' },
        promptVersionId: newPrompt.versions[0]?.id,
      };

      trackEvent('CreatePromptDB', { id: newPrompt.id, title });
      return NextResponse.json({ success: true, prompt: formatted });
    } catch (dbErr) {
      const mockPrompt = mockStore.createPrompt({
        title,
        slug,
        description: description || title,
        promptTemplate,
        negativePrompt,
        previewImageUrl,
        categoryId,
        isActive: true,
        defaultConfig: defaultConfig || { guidanceScale: 7.5, strength: 0.75, steps: 30, style: 'Custom' },
      });
      trackEvent('CreatePromptMock', { id: mockPrompt.id, title });
      return NextResponse.json({ success: true, prompt: mockPrompt, isFallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create prompt' }, { status: 500 });
  }
}
