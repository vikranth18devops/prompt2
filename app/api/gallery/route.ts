import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';

export async function GET() {
  try {
    try {
      const dbGenerations = await prisma.generation.findMany({
        include: {
          promptVersion: { include: { prompt: true } },
          assets: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const formatted = dbGenerations.map((g) => {
        const inputAsset = g.assets.find((a) => a.type === 'INPUT');
        const outputAsset = g.assets.find((a) => a.type === 'OUTPUT');
        return {
          ...g,
          inputImageUrl: inputAsset?.publicUrl,
          outputImageUrl: outputAsset?.publicUrl,
        };
      });

      return NextResponse.json({ success: true, generations: formatted });
    } catch {}

    const mockJobs = Array.from(mockStore.jobs.values()).map((job) => ({
      id: job.id,
      status: job.status,
      progress: job.progress,
      inputImageUrl: job.inputImageUrl,
      outputImageUrl: job.outputImageUrl,
      createdAt: job.createdAt,
      executionTimeMs: job.executionTimeMs,
      promptVersion: {
        promptTemplate: 'Cyberpunk avatar transformation',
        prompt: { title: 'Neon Cyberpunk Avatar' },
      },
    }));

    return NextResponse.json({ success: true, generations: mockJobs, isFallback: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery' }, { status: 500 });
  }
}
