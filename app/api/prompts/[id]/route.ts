import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';
import { trackEvent } from '@/lib/azure/telemetry';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { isActive, ...rest } = body;

    try {
      const updated = await prisma.prompt.update({
        where: { id },
        data: {
          ...(isActive !== undefined ? { status: isActive ? 'ACTIVE' : 'INACTIVE' } : {}),
          ...rest,
        },
      });
      trackEvent('UpdatePromptDB', { id, status: updated.status });
      return NextResponse.json({ success: true, prompt: updated });
    } catch (dbErr) {
      const updatedMock = mockStore.updatePrompt(id, body);
      if (!updatedMock) {
        return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
      }
      trackEvent('UpdatePromptMock', { id, isActive: updatedMock.isActive });
      return NextResponse.json({ success: true, prompt: updatedMock, isFallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update prompt' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    try {
      await prisma.prompt.delete({ where: { id } });
      trackEvent('DeletePromptDB', { id });
      return NextResponse.json({ success: true });
    } catch (dbErr) {
      const deleted = mockStore.deletePrompt(id);
      trackEvent('DeletePromptMock', { id, success: deleted });
      return NextResponse.json({ success: deleted });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete prompt' }, { status: 500 });
  }
}
