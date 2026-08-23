import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_ORIGINS = new Set([
  'https://novaxtravel.com',
  'https://www.novaxtravel.com',
  'http://localhost:3000',
]);

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://novaxtravel.com';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: cors(request.headers.get('origin')) });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const headers = cors(origin);

  try {
    const body = await request.json().catch(() => null);
    const type = String(body?.type || '');
    const name = String(body?.name || '').trim();
    const phone = String(body?.phone || '').trim();
    const details = body?.details && typeof body.details === 'object' && !Array.isArray(body.details) ? body.details : {};
    const honeypot = String(body?.website || '').trim();

    if (honeypot) {
      return NextResponse.json({ ok: true }, { headers });
    }

    if (!['flight', 'hotel', 'car'].includes(type)) {
      return NextResponse.json({ error: 'INVALID_SERVICE' }, { status: 422, headers });
    }
    if (name.length < 2 || name.length > 120 || phone.length < 5 || phone.length > 40) {
      return NextResponse.json({ error: 'INVALID_CONTACT' }, { status: 422, headers });
    }

    const serializedDetails = JSON.stringify(details);
    if (serializedDetails.length > 12000) {
      return NextResponse.json({ error: 'DETAILS_TOO_LARGE' }, { status: 413, headers });
    }

    const sql = getDb();
    const systemUsers = await sql<{ id: number }[]>`
      SELECT id::int AS id FROM users WHERE email = 'public-intake@novax.local' LIMIT 1
    `;
    if (!systemUsers[0]) {
      return NextResponse.json({ error: 'INTAKE_USER_MISSING' }, { status: 503, headers });
    }

    const meta = {
      source: 'novaxtravel.com',
      contact: { name, phone },
      service_details: details,
      origin,
      user_agent: request.headers.get('user-agent')?.slice(0, 500) || null,
      received_at: new Date().toISOString(),
    };

    const passengers = [{ name, phone }];
    const notes = typeof details?.notes === 'string' ? details.notes.slice(0, 4000) : null;

    const inserted = await sql<{ id: number; created_at: string }[]>`
      INSERT INTO travel_requests (
        user_id, agency_id, type, flight_id, passengers, status,
        amount, currency, payment_status, payment_reference, notes, meta,
        created_at, updated_at
      ) VALUES (
        ${systemUsers[0].id}, NULL, ${type}, NULL, ${JSON.stringify(passengers)}::json, 'new',
        0, 'USD', 'pending', NULL, ${notes}, ${JSON.stringify(meta)}::json,
        now(), now()
      )
      RETURNING id::int AS id, created_at::text AS created_at
    `;

    const id = inserted[0].id;
    return NextResponse.json({
      ok: true,
      id,
      reference: `NVX-${String(id).padStart(6, '0')}`,
      status: 'new',
      created_at: inserted[0].created_at,
    }, { status: 201, headers });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    if (code === 'DATABASE_URL_MISSING') {
      return NextResponse.json({ error: 'SERVICE_CONFIGURATION_PENDING' }, { status: 503, headers });
    }
    console.error('public_inquiry_failed', error);
    return NextResponse.json({ error: 'REQUEST_FAILED' }, { status: 500, headers });
  }
}
