import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'novax_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

type SessionPayload = {
  uid: number;
  email: string;
  role: 'admin';
  exp: number;
};

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET_MISSING');
  return value;
}

function encode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function sign(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

export function createAdminSession(userId: number, email: string): string {
  const payload: SessionPayload = {
    uid: userId,
    email,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminSession(token?: string | null): SessionPayload | null {
  if (!token) return null;
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    const expected = sign(encoded);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (payload.role !== 'admin' || !payload.uid || !payload.email || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
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
