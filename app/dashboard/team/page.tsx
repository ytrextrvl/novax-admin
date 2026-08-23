'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { ShieldCheck, UserRound, Users } from 'lucide-react';

type User = { id: number; name: string; email: string; roles?: string[] };

export default function TeamPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data?.user || null)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-7">
      <div><p className="text-xs font-black text-teal-600 m-0">ACCESS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">الفريق والصلاحيات</h2><p className="text-sm text-slate-500 m-0">الحساب الإداري المعتمد حاليًا في NOVAX.</p></div>
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-2 font-black"><Users className="text-teal-600" size={20}/>الحسابات المصرح بها</div><span className="text-xs text-slate-400">{loading ? '...' : user ? '1' : '0'}</span></div>
        {loading ? <div className="p-10 text-center text-sm text-slate-400">جاري التحقق...</div> : !user ? <div className="p-10 text-center text-sm text-red-600">تعذر التحقق من الحساب الحالي.</div> : <div className="p-4 md:px-6 flex items-center gap-4"><span className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 grid place-items-center"><UserRound size={20}/></span><div className="flex-1 min-w-0"><strong className="text-sm block truncate">{user.name}</strong><span className="text-xs text-slate-400 block truncate">{user.email}</span></div><span className="text-[10px] font-black rounded-full bg-teal-50 text-teal-700 px-3 py-1.5">مدير النظام</span></div>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex gap-3"><ShieldCheck className="text-teal-600 shrink-0"/><div><strong className="text-sm">RBAC آمن</strong><p className="text-xs text-slate-500 leading-6 m-0 mt-1">إضافة موظفين وصلاحيات متعددة مؤجلة إلى المرحلة التالية حتى لا نفتح مسار وصول إداري غير مكتمل. الحساب الحالي فقط يملك إدارة الـMVP.</p></div></div></section>
    </div>
  );
}
