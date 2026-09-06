import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getKeyVaultHealthStatus } from '@/lib/azure/keyVault';
import { getBlobStorageHealthStatus } from '@/lib/azure/blob';
import { getServiceBusHealthStatus } from '@/lib/azure/serviceBus';
import { getTelemetryHealthStatus } from '@/lib/azure/telemetry';

const startTime = Date.now();

export async function GET() {
  const timestamp = new Date().toISOString();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();

  let dbStatus = { isHealthy: false, detail: 'Database connection failed' };
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = { isHealthy: true, detail: 'PostgreSQL connection operational' };
  } catch (err: any) {
    dbStatus = { isHealthy: false, detail: err.message || 'Database query error' };
  }

  const keyVaultStatus = await getKeyVaultHealthStatus();
  const blobStorageStatus = await getBlobStorageHealthStatus();
  const serviceBusStatus = await getServiceBusHealthStatus();
  const telemetryStatus = getTelemetryHealthStatus();

  const isOverallHealthy = dbStatus.isHealthy && keyVaultStatus.isHealthy && blobStorageStatus.isHealthy && serviceBusStatus.isHealthy;
  const status = isOverallHealthy ? 'UP' : 'DEGRADED';

  return NextResponse.json(
    {
      status,
      timestamp,
      environment: process.env.NODE_ENV || 'development',
      system: {
        uptimeSeconds,
        nodeVersion: process.version,
        memoryUsageMb: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
      },
      services: {
        database: dbStatus,
        keyVault: keyVaultStatus,
        blobStorage: blobStorageStatus,
        serviceBus: serviceBusStatus,
        telemetry: telemetryStatus,
      },
    },
    { status: isOverallHealthy ? 200 : 503 }
  );
}
