import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { mockStore } from '@/lib/db/mockStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    const dbCategories = await prisma.promptCategory.findMany({
      where: includeAll ? {} : { status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, categories: dbCategories });
  } catch (error) {
    return NextResponse.json({
      success: true,
      categories: mockStore.categories,
      isFallback: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, icon, displayOrder, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      const category = await prisma.promptCategory.create({
        data: {
          name,
          slug,
          description,
          icon: icon || 'Sparkles',
          displayOrder: displayOrder ?? 0,
          status: status || 'ACTIVE',
        },
      });
      return NextResponse.json({ success: true, category });
    } catch (dbErr) {
      const mockCat = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description: description || '',
        icon: icon || 'Sparkles',
        status: status || 'ACTIVE',
        displayOrder: displayOrder ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockStore.categories.push(mockCat);
      return NextResponse.json({ success: true, category: mockCat, isFallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}
