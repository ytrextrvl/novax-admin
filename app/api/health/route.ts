import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'novax-admin-api',
    database_configured: Boolean(process.env.DATABASE_URL),
    booking_mode: 'manual-first',
    travelpayouts: process.env.TRAVELPAYOUTS_ENABLED === 'true' ? 'enabled' : 'ready-not-configured',
    timestamp: new Date().toISOString(),
  });
}
