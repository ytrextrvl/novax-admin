'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CalendarDays, Car, Hotel, Plane, RefreshCcw } from 'lucide-react';

type Inquiry = { id:number; type:'flight'|'hotel'|'car'; name:string; phone:string; status:string; service_details?:Record<string,unknown>; created_at?:string };
const labels = { flight:'طيران', hotel:'فندق', car:'سيارة' };
const icons = { flight:Plane, hotel:Hotel, car:Car };

export default function BookingsPage() {
  const [items,setItems] = useState<Inquiry[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(false);

  const load = () => {
    setLoading(true); setError(false);
    api.get('/admin/inquiries').then(r => setItems(r.data?.inquiries || [])).catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(load,[]);

  return <div className="space-y-7">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black text-teal-600 m-0">BOOKINGS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">طلبات الحجز</h2><p className="text-sm text-slate-500 m-0">كل طلبات الطيران والفنادق والسيارات في قائمة واحدة.</p></div><button onClick={load} className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-600 hover:border-teal-300"><RefreshCcw size={15}/>تحديث</button></div>
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-2 font-black"><CalendarDays className="text-teal-600" size={20}/>قائمة الطلبات</div><span className="text-xs text-slate-400">{loading ? '...' : items.length}</span></div>
      {error ? <div className="p-12 text-center bg-amber-50 text-amber-700 text-sm">سيتم تحميل الطلبات هنا فور تشغيل Backend الإنتاجي.</div> : loading ? <div className="p-12 text-center text-sm text-slate-400">جاري تحميل الطلبات...</div> : items.length === 0 ? <div className="p-12 text-center text-sm text-slate-400">لا توجد طلبات حجز حتى الآن.</div> : <div className="divide-y divide-slate-100">{items.map(item => { const Icon=icons[item.type] || Plane; return <div key={item.id} className="p-4 md:px-6 flex items-center gap-4"><span className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 grid place-items-center"><Icon size={20}/></span><div className="flex-1 min-w-0"><div className="flex gap-2 items-center"><strong className="text-sm truncate">{item.name}</strong><span className="text-[10px] bg-slate-100 rounded-full px-2 py-1 text-slate-600 font-black">{labels[item.type] || item.type}</span></div><p className="text-xs text-slate-400 mt-1 mb-0">{item.phone} {item.created_at ? `• ${new Date(item.created_at).toLocaleString('ar')}` : ''}</p></div><span className="text-[10px] font-black rounded-full bg-amber-50 text-amber-700 px-3 py-1.5">{item.status || 'new'}</span></div>})}</div>}
    </section>
  </div>;
}
