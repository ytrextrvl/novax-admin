import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const configured = Boolean(process.env.TRAVELPAYOUTS_API_TOKEN && process.env.TRAVELPAYOUTS_MARKER);
    const enabled = configured && process.env.TRAVELPAYOUTS_ENABLED === 'true';

    return NextResponse.json({
      default_provider: enabled ? 'travelpayouts' : 'manual',
      providers: {
        manual: { enabled: true, mode: 'manual-first' },
        travelpayouts: {
          enabled,
          configured,
          mode: 'future-api',
        },
      },
    });
  } catch (error) {
    console.error('provider_status_failed', error);
    return NextResponse.json({ error: 'PROVIDER_STATUS_FAILED' }, { status: 500 });
  }
}
