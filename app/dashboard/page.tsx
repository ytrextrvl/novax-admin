'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CalendarDays, Car, Hotel, Plane, Server, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [apiState, setApiState] = useState<'checking'|'online'|'offline'>('checking');
  const [provider, setProvider] = useState('manual');

  useEffect(() => {
    Promise.allSettled([
      api.get('/health'),
      api.get('/travel/providers/status'),
    ]).then(([health, providers]) => {
      setApiState(health.status === 'fulfilled' ? 'online' : 'offline');
      if (providers.status === 'fulfilled') setProvider(providers.value.data?.default_provider || 'manual');
    });
  }, []);

  const cards = [
    { title: 'الطيران', value: 'جاهز للطلبات', icon: Plane },
    { title: 'الفنادق', value: 'جاهز للطلبات', icon: Hotel },
    { title: 'السيارات', value: 'جاهز للطلبات', icon: Car },
    { title: 'مزود السفر', value: provider === 'manual' ? 'يدوي حاليًا' : provider, icon: Server },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div><p className="text-xs font-black text-teal-600 m-0">OPERATIONS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">نظرة عامة</h2><p className="text-sm text-slate-500 m-0">مركز تشغيل خدمات NOVAX Travel.</p></div>
        <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-black border ${apiState === 'online' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : apiState === 'offline' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-slate-600 bg-slate-50 border-slate-200'}`}><span className={`w-2 h-2 rounded-full ${apiState === 'online' ? 'bg-emerald-500' : apiState === 'offline' ? 'bg-amber-500' : 'bg-slate-400'}`}/>{apiState === 'online' ? 'API متصل' : apiState === 'offline' ? 'API يحتاج ربط' : 'فحص الاتصال...'}</div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({title,value,icon:Icon}) => <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"><div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 grid place-items-center mb-5"><Icon size={22}/></div><p className="text-xs font-bold text-slate-400 m-0">{title}</p><strong className="block text-lg text-slate-900 mt-1">{value}</strong></div>)}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_.6fr] gap-4">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5"><div><h3 className="font-black text-lg m-0">دورة الحجز</h3><p className="text-xs text-slate-400 mt-1 mb-0">العملية المعتمدة لكل الخدمات</p></div><CalendarDays className="text-teal-600"/></div>
          <div className="grid md:grid-cols-4 gap-3">{['طلب جديد','مراجعة وعرض','دفع وتأكيد','إكمال الحجز'].map((x,i)=><div key={x} className="rounded-xl bg-slate-50 border border-slate-100 p-4"><span className="text-[10px] text-teal-600 font-black">0{i+1}</span><p className="font-black text-sm mt-2 mb-0">{x}</p></div>)}</div>
        </section>
        <section className="bg-[#071d28] text-white rounded-2xl p-6 shadow-sm"><ShieldCheck className="text-teal-400 mb-5" size={30}/><h3 className="text-lg font-black m-0">Travelpayouts جاهز</h3><p className="text-xs leading-6 text-slate-300 mt-2 mb-0">يبقى معطلاً بأمان حتى توفر API Token وMarker. نظام الطلبات يعمل يدويًا الآن دون بيانات وهمية.</p></section>
      </div>
    </div>
  );
}
