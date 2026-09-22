export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  return Response.json({
    status: 'healthy',
    service: 'UWO Connect Frontend',
    environment: process.env.NODE_ENV || 'production',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
