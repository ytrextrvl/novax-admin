import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUSES = new Set(['new','reviewing','quoted','awaiting_payment','confirmed','completed','cancelled']);
const PAYMENT_STATUSES = new Set(['pending','paid','failed','refunded']);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'INVALID_ID' }, { status: 422 });

    const body = await request.json().catch(() => null);
    const sql = getDb();
    const current = await sql<any[]>`
      SELECT id::int AS id, status, amount::text AS amount, currency, payment_status, notes
      FROM travel_requests WHERE id = ${id} LIMIT 1
    `;
    if (!current[0]) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

    const status = body?.status !== undefined ? String(body.status) : current[0].status;
    const paymentStatus = body?.payment_status !== undefined ? String(body.payment_status) : current[0].payment_status;
    const currency = body?.currency !== undefined ? String(body.currency).trim().toUpperCase() : current[0].currency;
    const notes = body?.notes !== undefined ? String(body.notes).trim().slice(0, 4000) : current[0].notes;
    const amount = body?.amount !== undefined ? Number(body.amount) : Number(current[0].amount || 0);

    if (!STATUSES.has(status) || !PAYMENT_STATUSES.has(paymentStatus)) {
      return NextResponse.json({ error: 'INVALID_STATE' }, { status: 422 });
    }
    if (!Number.isFinite(amount) || amount < 0 || amount > 100000000) {
      return NextResponse.json({ error: 'INVALID_AMOUNT' }, { status: 422 });
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json({ error: 'INVALID_CURRENCY' }, { status: 422 });
    }

    const rows = await sql<any[]>`
      UPDATE travel_requests
      SET status = ${status},
          amount = ${amount},
          currency = ${currency},
          payment_status = ${paymentStatus},
          notes = ${notes || null},
          updated_at = now()
      WHERE id = ${id}
      RETURNING id::int AS id, status, amount::text AS amount, currency, payment_status, notes, updated_at::text AS updated_at
    `;

    return NextResponse.json({ ok: true, inquiry: rows[0] });
  } catch (error) {
    console.error('admin_inquiry_update_failed', error);
    return NextResponse.json({ error: 'UPDATE_FAILED' }, { status: 500 });
  }
}
