'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CalendarDays, Car, Hotel, Plane, Server, ShieldCheck } from 'lucide-react';

type Stats = { total?:number; open?:number; quoted?:number; confirmed?:number; flights?:number; hotels?:number; cars?:number };

export default function Dashboard() {
  const [apiState, setApiState] = useState<'checking'|'online'|'offline'>('checking');
  const [provider, setProvider] = useState('manual');
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    Promise.allSettled([
      api.get('/health'),
      api.get('/travel/providers/status'),
      api.get('/admin/stats'),
    ]).then(([health, providers, metrics]) => {
      setApiState(health.status === 'fulfilled' && health.value.data?.database_configured ? 'online' : 'offline');
      if (providers.status === 'fulfilled') setProvider(providers.value.data?.default_provider || 'manual');
      if (metrics.status === 'fulfilled') setStats(metrics.value.data?.stats || {});
    });
  }, []);

  const cards = [
    { title: 'طلبات الطيران', value: stats.flights ?? 0, icon: Plane },
    { title: 'طلبات الفنادق', value: stats.hotels ?? 0, icon: Hotel },
    { title: 'طلبات السيارات', value: stats.cars ?? 0, icon: Car },
    { title: 'الطلبات المفتوحة', value: stats.open ?? 0, icon: CalendarDays },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div><p className="text-xs font-black text-teal-600 m-0">OPERATIONS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">نظرة عامة</h2><p className="text-sm text-slate-500 m-0">مؤشرات حقيقية من قاعدة بيانات NOVAX.</p></div>
        <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-black border ${apiState === 'online' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : apiState === 'offline' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-slate-600 bg-slate-50 border-slate-200'}`}><span className={`w-2 h-2 rounded-full ${apiState === 'online' ? 'bg-emerald-500' : apiState === 'offline' ? 'bg-amber-500' : 'bg-slate-400'}`}/>{apiState === 'online' ? 'Neon متصل' : apiState === 'offline' ? 'إعداد قاعدة البيانات مطلوب' : 'فحص الاتصال...'}</div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({title,value,icon:Icon}) => <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"><div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 grid place-items-center mb-5"><Icon size={22}/></div><p className="text-xs font-bold text-slate-400 m-0">{title}</p><strong className="block text-3xl text-slate-900 mt-1">{value}</strong></div>)}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_.6fr] gap-4">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5"><div><h3 className="font-black text-lg m-0">دورة الحجز</h3><p className="text-xs text-slate-400 mt-1 mb-0">نفس الدورة للطيران والفنادق والسيارات</p></div><CalendarDays className="text-teal-600"/></div>
          <div className="grid md:grid-cols-4 gap-3">{[
            ['طلب جديد', stats.open ?? 0],
            ['عرض سعر', stats.quoted ?? 0],
            ['مؤكد', stats.confirmed ?? 0],
            ['إجمالي الطلبات', stats.total ?? 0],
          ].map(([label,value],i)=><div key={String(label)} className="rounded-xl bg-slate-50 border border-slate-100 p-4"><span className="text-[10px] text-teal-600 font-black">0{i+1}</span><p className="font-black text-sm mt-2 mb-1">{label}</p><strong className="text-2xl">{value}</strong></div>)}</div>
        </section>
        <section className="bg-[#071d28] text-white rounded-2xl p-6 shadow-sm"><ShieldCheck className="text-teal-400 mb-5" size={30}/><h3 className="text-lg font-black m-0">{provider === 'manual' ? 'الحجز اليدوي مفعّل' : `المزود: ${provider}`}</h3><p className="text-xs leading-6 text-slate-300 mt-2 mb-0">Travelpayouts جاهز في البنية لكنه يبقى معطلاً حتى توفر API Token وMarker حقيقيين.</p><div className="mt-5 inline-flex items-center gap-2 text-[11px] text-teal-300"><Server size={15}/>لا توجد بيانات أسعار وهمية</div></section>
      </div>
    </div>
  );
}
