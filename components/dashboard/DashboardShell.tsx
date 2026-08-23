'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { LayoutDashboard, CalendarDays, Users, Settings, LogOut, Plane, Menu, X } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'طلبات الحجز', icon: CalendarDays },
  { href: '/dashboard/team', label: 'الفريق', icon: Users },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try { await api.post('/auth/logout'); } catch { /* cookie expires client-side on next auth check */ }
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-slate-900">
      <header className="md:hidden sticky top-0 z-40 h-16 px-4 flex items-center justify-between bg-[#071d28] text-white">
        <div className="flex items-center gap-2 font-black"><span className="w-9 h-9 rounded-xl bg-teal-500 grid place-items-center"><Plane size={18}/></span>NOVAX</div>
        <button onClick={() => setOpen(!open)} aria-label="القائمة">{open ? <X/> : <Menu/>}</button>
      </header>
      <div className="flex min-h-screen">
        <aside className={`${open ? 'flex' : 'hidden'} md:flex fixed md:sticky top-16 md:top-0 right-0 z-30 w-72 h-[calc(100vh-4rem)] md:h-screen bg-[#071d28] text-white flex-col shadow-2xl`}>
          <div className="hidden md:flex h-24 px-6 items-center gap-3 border-b border-white/10">
            <span className="w-11 h-11 rounded-2xl bg-teal-500 grid place-items-center shadow-lg shadow-teal-500/20"><Plane size={22}/></span>
            <div><strong className="block text-xl tracking-wide">NOVAX</strong><span className="text-[10px] tracking-[.3em] text-slate-400">ADMIN</span></div>
          </div>
          <nav className="p-4 space-y-2 flex-1">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
              return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition ${active ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/15' : 'text-slate-300 hover:bg-white/7 hover:text-white'}`}><Icon size={19}/>{label}</Link>;
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button disabled={loggingOut} onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"><LogOut size={18}/>{loggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</button>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <div className="h-20 px-5 md:px-8 bg-white border-b border-slate-200 flex items-center justify-between">
            <div><p className="m-0 text-xs text-slate-400 font-bold">NOVAX TRAVEL</p><h1 className="m-0 mt-1 text-lg font-black">مركز الإدارة</h1></div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-2 rounded-full"><span className="w-2 h-2 rounded-full bg-teal-500"/>جلسة آمنة</span>
          </div>
          <div className="p-4 md:p-8 max-w-[1500px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
