import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  try {
    try {
      const dbJob = await prisma.generation.findUnique({
        where: { id: jobId },
        include: {
          promptVersion: { include: { prompt: true } },
          assets: true,
        },
      });
      if (dbJob) {
        const inputAsset = dbJob.assets.find((a) => a.type === 'INPUT');
        const outputAsset = dbJob.assets.find((a) => a.type === 'OUTPUT');

        return NextResponse.json({
          success: true,
          job: {
            ...dbJob,
            inputImageUrl: inputAsset?.publicUrl,
            outputImageUrl: outputAsset?.publicUrl,
          },
        });
      }
    } catch {}

    const mockJob = mockStore.getJob(jobId);
    if (!mockJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: mockJob, isFallback: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch job status' }, { status: 500 });
  }
}
