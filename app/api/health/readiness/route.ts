import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'not_ready',
        database: 'disconnected',
        error: error.message || 'Database ping failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
