import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    try {
      const updated = await prisma.promptCategory.update({
        where: { id },
        data: body,
      });
      return NextResponse.json({ success: true, category: updated });
    } catch {
      const cat = mockStore.categories.find((c) => c.id === id);
      if (cat) {
        Object.assign(cat, body, { updatedAt: new Date().toISOString() });
        return NextResponse.json({ success: true, category: cat, isFallback: true });
      }
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    try {
      await prisma.promptCategory.delete({ where: { id } });
    } catch {
      mockStore.categories = mockStore.categories.filter((c) => c.id !== id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
