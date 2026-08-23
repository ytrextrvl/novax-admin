import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'novax-admin-api',
    database_configured: Boolean(process.env.DATABASE_URL),
    session_secret_configured: Boolean(process.env.ADMIN_SESSION_SECRET),
    booking_mode: 'manual-first',
    travelpayouts: 'ready-not-configured',
    timestamp: new Date().toISOString(),
  });
}
