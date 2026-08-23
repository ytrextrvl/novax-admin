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
    const rows = await sql`
      SELECT
        id::int AS id,
        type,
        status,
        amount::text AS amount,
        currency,
        payment_status,
        notes,
        meta,
        created_at::text AS created_at,
        updated_at::text AS updated_at
      FROM travel_requests
      WHERE type IN ('flight','hotel','car')
      ORDER BY created_at DESC NULLS LAST, id DESC
      LIMIT 300
    `;

    const inquiries = rows.map((row: any) => ({
      id: row.id,
      reference: `NVX-${String(row.id).padStart(6, '0')}`,
      type: row.type,
      name: row.meta?.contact?.name || 'بدون اسم',
      phone: row.meta?.contact?.phone || '',
      status: row.status,
      amount: Number(row.amount || 0),
      currency: row.currency,
      payment_status: row.payment_status,
      notes: row.notes,
      service_details: row.meta?.service_details || {},
      source: row.meta?.source || 'internal',
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('admin_inquiries_failed', error);
    return NextResponse.json({ error: 'INQUIRIES_FAILED' }, { status: 500 });
  }
}
