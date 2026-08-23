import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/session';

export type AdminIdentity = {
  id: number;
  name: string;
  email: string;
};

export async function requireAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) return null;

  const sql = getDb();
  const rows = await sql<AdminIdentity[]>`
    SELECT u.id::int AS id, u.name, u.email
    FROM users u
    JOIN model_has_roles m ON m.model_id = u.id
      AND m.model_type = 'App\\Models\\User'
    JOIN roles r ON r.id = m.role_id
    WHERE u.id = ${session.uid}
      AND lower(u.email) = lower(${session.email})
      AND r.name = 'admin'
    LIMIT 1
  `;

  return rows[0] ?? null;
}
