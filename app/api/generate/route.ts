import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';
import { queueGenerationJob } from '@/lib/azure/serviceBus';
import { trackEvent } from '@/lib/azure/telemetry';
import { defaultAiProvider } from '@/services/aiProvider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputImageUrl, promptId, promptVersionId, customPrompt, parameters } = body;

    if (!inputImageUrl || (!promptId && !promptVersionId)) {
      return NextResponse.json({ error: 'Missing inputImageUrl or prompt details' }, { status: 400 });
    }

    let targetPromptVersionId = promptVersionId;
    let promptTemplate = 'High detail AI art generation';
    let promptTitle = 'AI Image Transformation';
    let promptStyle = 'Cyberpunk Neon';
    let categoryId: string | undefined;

    try {
      if (promptId && !targetPromptVersionId) {
        const dbPrompt = await prisma.prompt.findUnique({
          where: { id: promptId },
          include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
        });
        if (dbPrompt) {
          promptTitle = dbPrompt.title;
          categoryId = dbPrompt.categoryId;
          if (dbPrompt.versions[0]) {
            targetPromptVersionId = dbPrompt.versions[0].id;
            promptTemplate = dbPrompt.versions[0].promptTemplate;
            promptStyle = (dbPrompt.versions[0].defaultConfig as any)?.style || 'Cyberpunk Neon';
          }
        }
      }
    } catch {}

    const mockPrompt = mockStore.getPromptById(promptId || '');
    if (mockPrompt) {
      promptTitle = mockPrompt.title;
      promptTemplate = mockPrompt.promptTemplate;
      promptStyle = mockPrompt.defaultConfig?.style || 'Cyberpunk Neon';
      categoryId = mockPrompt.categoryId;
    }

    let jobId: string;
    let initialJob: any;

    try {
      const dbJob = await prisma.generation.create({
        data: {
          promptVersionId: targetPromptVersionId || 'v-1',
          parameters: parameters || {},
          status: 'PENDING',
          progress: 5,
          assets: {
            create: [
              {
                type: 'INPUT',
                blobPath: `/uploads/${Date.now()}-input.png`,
                publicUrl: inputImageUrl,
                mimeType: 'image/png',
                sizeBytes: 1024 * 500,
              },
            ],
          },
        },
      });
      jobId = dbJob.id;
      initialJob = {
        ...dbJob,
        inputImageUrl,
      };
    } catch (err) {
      const mockJob = mockStore.createJob({
        inputImageUrl,
        promptId: promptId || 'p-1',
        customPrompt,
        parameters: parameters || {},
        status: 'QUEUED',
      });
      jobId = mockJob.id;
      initialJob = mockJob;
    }

    await queueGenerationJob({
      jobId,
      inputImageUrl,
      promptTemplate,
      customPrompt,
      parameters: parameters || {},
      createdAt: new Date().toISOString(),
    });

    trackEvent('SubmitGenerationJob', { jobId, promptId });
    simulateProgressPipeline(jobId, inputImageUrl, promptTemplate, {
      ...parameters,
      promptTitle,
      style: promptStyle,
      customPrompt,
    });

    return NextResponse.json({
      success: true,
      jobId,
      job: initialJob,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation request failed' }, { status: 500 });
  }
}

function simulateProgressPipeline(
  jobId: string,
  inputImageUrl: string,
  promptTemplate: string,
  options: any
) {
  setTimeout(async () => {
    try {
      await prisma.generation.update({
        where: { id: jobId },
        data: { status: 'PROCESSING', progress: 35 },
      });
    } catch {
      mockStore.updateJob(jobId, { status: 'PROCESSING', progress: 35 });
    }
  }, 500);

  setTimeout(async () => {
    try {
      await prisma.generation.update({
        where: { id: jobId },
        data: { progress: 70 },
      });
    } catch {
      mockStore.updateJob(jobId, { progress: 70 });
    }
  }, 1500);

  // Invoke AI Provider with full prompt metadata
  defaultAiProvider
    .generateImage(inputImageUrl, promptTemplate, options)
    .then(async ({ outputImageUrl, executionTimeMs }) => {
      try {
        await prisma.generation.update({
          where: { id: jobId },
          data: {
            status: 'COMPLETED',
            progress: 100,
            executionTimeMs,
            assets: {
              create: [
                {
                  type: 'OUTPUT',
                  blobPath: `/generated/${Date.now()}-output.png`,
                  publicUrl: outputImageUrl,
                  mimeType: 'image/png',
                  sizeBytes: 1024 * 1200,
                },
              ],
            },
          },
        });
      } catch {
        mockStore.updateJob(jobId, {
          status: 'COMPLETED',
          progress: 100,
          outputImageUrl,
          executionTimeMs,
        });
      }
      trackEvent('JobCompleted', { jobId, durationMs: executionTimeMs });
    })
    .catch(async (err) => {
      console.error('AI Provider generation failed:', err);
      try {
        await prisma.generation.update({
          where: { id: jobId },
          data: { status: 'FAILED', errorMessage: err.message },
        });
      } catch {
        mockStore.updateJob(jobId, { status: 'FAILED', errorMessage: err.message });
      }
    });
}
