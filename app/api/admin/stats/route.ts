import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const sql = getDb();
    const rows = await sql<any[]>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status IN ('new','reviewing'))::int AS open,
        COUNT(*) FILTER (WHERE status = 'quoted')::int AS quoted,
        COUNT(*) FILTER (WHERE status IN ('confirmed','completed'))::int AS confirmed,
        COUNT(*) FILTER (WHERE type = 'flight')::int AS flights,
        COUNT(*) FILTER (WHERE type = 'hotel')::int AS hotels,
        COUNT(*) FILTER (WHERE type = 'car')::int AS cars
      FROM travel_requests
      WHERE type IN ('flight','hotel','car')
    `;

    return NextResponse.json({ stats: rows[0] || {} });
  } catch (error) {
    console.error('admin_stats_failed', error);
    return NextResponse.json({ error: 'STATS_FAILED' }, { status: 500 });
  }
}
