'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { ShieldCheck, UserRound, Users } from 'lucide-react';

type User = { id: number; name: string; email: string; roles?: Array<{ name?: string }>|string[] };

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data?.users || [])).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-7">
      <div><p className="text-xs font-black text-teal-600 m-0">ACCESS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">الفريق والصلاحيات</h2><p className="text-sm text-slate-500 m-0">الحسابات الإدارية والتشغيلية المسجلة في NOVAX.</p></div>
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-2 font-black"><Users className="text-teal-600" size={20}/>المستخدمون</div><span className="text-xs text-slate-400">{loading ? '...' : users.length}</span></div>
        {error ? <div className="p-10 text-center text-sm text-amber-700 bg-amber-50">سيظهر الفريق هنا فور اكتمال اتصال Backend.</div> : loading ? <div className="p-10 text-center text-sm text-slate-400">جاري التحميل...</div> : users.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">لا توجد حسابات لعرضها حاليًا.</div> : <div className="divide-y divide-slate-100">{users.map(user => {
          const roles = (user.roles || []).map((r:any) => typeof r === 'string' ? r : r.name).filter(Boolean);
          return <div key={user.id} className="p-4 md:px-6 flex items-center gap-4"><span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 grid place-items-center"><UserRound size={19}/></span><div className="flex-1 min-w-0"><strong className="text-sm block truncate">{user.name}</strong><span className="text-xs text-slate-400 block truncate">{user.email}</span></div><div className="flex gap-1 flex-wrap justify-end">{roles.length ? roles.map(role => <span key={role} className="text-[10px] font-black rounded-full bg-teal-50 text-teal-700 px-2.5 py-1">{role}</span>) : <span className="text-[10px] text-slate-400">بدون دور</span>}</div></div>;
        })}</div>}
      </section>
      <div className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck size={15} className="text-teal-600"/>إنشاء وتعديل الصلاحيات الحساسة يتم عبر API الخادم مع سجل تدقيق.</div>
    </div>
  );
}
