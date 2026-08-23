import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'novax_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export type SessionPayload = {
  uid: number;
  email: string;
  role: 'admin';
  exp: number;
};

function encode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function sign(data: string, key: string): string {
  return createHmac('sha256', `novax-admin-session:${key}`).update(data).digest('base64url');
}

export function createAdminSession(userId: number, email: string, passwordHash: string): string {
  const payload: SessionPayload = {
    uid: userId,
    email,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, passwordHash)}`;
}

export function readSessionPayload(token?: string | null): SessionPayload | null {
  if (!token) return null;
  try {
    const [encoded] = token.split('.');
    if (!encoded) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (payload.role !== 'admin' || !payload.uid || !payload.email || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyAdminSession(token: string | null | undefined, passwordHash: string): SessionPayload | null {
  if (!token) return null;
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    const expected = sign(encoded, passwordHash);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return readSessionPayload(token);
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
