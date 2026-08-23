import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LoginRow = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password || email.length > 190 || password.length > 200) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const sql = getDb();
    const rows = await sql<LoginRow[]>`
      SELECT u.id::int AS id, u.name, u.email, u.password
      FROM users u
      JOIN model_has_roles m ON m.model_id = u.id
        AND m.model_type = 'App\\Models\\User'
      JOIN roles r ON r.id = m.role_id
      WHERE lower(u.email) = ${email}
        AND r.name = 'admin'
      LIMIT 1
    `;

    const user = rows[0];
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    await sql`UPDATE users SET last_login_at = now(), updated_at = now() WHERE id = ${user.id}`;

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, roles: ['admin'] },
    });

    response.cookies.set(ADMIN_COOKIE, createAdminSession(user.id, user.email, user.password), adminCookieOptions());
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    if (code === 'DATABASE_URL_MISSING') {
      return NextResponse.json({ error: 'SERVER_CONFIGURATION_PENDING' }, { status: 503 });
    }
    console.error('admin_login_failed', error);
    return NextResponse.json({ error: 'LOGIN_FAILED' }, { status: 500 });
  }
}
