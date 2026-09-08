export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const uptime = process.uptime();
  const memoryUsage = typeof process.memoryUsage === 'function' ? process.memoryUsage() : null;

  const payload = {
    status: 'healthy',
    service: 'UWOConnect Frontend API',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(uptime),
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: memoryUsage ? {
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
      } : null,
    },
  };

  return Response.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
