import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    return NextResponse.json({ user: { ...user, roles: ['admin'] } });
  } catch (error) {
    console.error('admin_me_failed', error);
    return NextResponse.json({ error: 'SERVER_CONFIGURATION_PENDING' }, { status: 503 });
  }
}
