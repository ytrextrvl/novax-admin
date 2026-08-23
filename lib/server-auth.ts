import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { ADMIN_COOKIE, readSessionPayload, verifyAdminSession } from '@/lib/session';

export type AdminIdentity = {
  id: number;
  name: string;
  email: string;
};

type AdminAuthRow = AdminIdentity & { password: string };

export async function requireAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const candidate = readSessionPayload(token);
  if (!candidate) return null;

  const sql = getDb();
  const rows = await sql<AdminAuthRow[]>`
    SELECT u.id::int AS id, u.name, u.email, u.password
    FROM users u
    JOIN model_has_roles m ON m.model_id = u.id
      AND m.model_type = 'App\\Models\\User'
    JOIN roles r ON r.id = m.role_id
    WHERE u.id = ${candidate.uid}
      AND lower(u.email) = lower(${candidate.email})
      AND r.name = 'admin'
    LIMIT 1
  `;

  const user = rows[0];
  if (!user || !verifyAdminSession(token, user.password)) return null;
  return { id: user.id, name: user.name, email: user.email };
}
