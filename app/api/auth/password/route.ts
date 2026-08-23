import { compare, hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const body = await request.json().catch(() => null);
    const currentPassword = String(body?.current_password || '');
    const newPassword = String(body?.new_password || '');

    if (newPassword.length < 12 || newPassword.length > 200) {
      return NextResponse.json({ error: 'PASSWORD_TOO_WEAK' }, { status: 422 });
    }

    const sql = getDb();
    const rows = await sql<{ password: string }[]>`SELECT password FROM users WHERE id = ${admin.id} LIMIT 1`;
    if (!rows[0] || !(await compare(currentPassword, rows[0].password))) {
      return NextResponse.json({ error: 'CURRENT_PASSWORD_INVALID' }, { status: 422 });
    }

    const passwordHash = await hash(newPassword, 12);
    await sql`UPDATE users SET password = ${passwordHash}, updated_at = now() WHERE id = ${admin.id}`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('password_change_failed', error);
    return NextResponse.json({ error: 'PASSWORD_CHANGE_FAILED' }, { status: 500 });
  }
}
