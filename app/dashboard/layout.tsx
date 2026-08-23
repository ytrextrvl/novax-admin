import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect('/');
  return <DashboardShell>{children}</DashboardShell>;
}
