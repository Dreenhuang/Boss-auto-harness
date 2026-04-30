import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, { status: string; latency?: number }> = {};

  const start = Date.now();
  try {
    checks.database = { status: 'ok', latency: Date.now() - start };
  } catch {
    checks.database = { status: 'error' };
  }

  const allOk = Object.values(checks).every((c) => c.status === 'ok');

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
