'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CheckCircle2, Database, Globe2, KeyRound, Plane, ShieldCheck } from 'lucide-react';

type ProviderState = {
  default_provider?: string;
  providers?: {
    manual?: { enabled?: boolean; mode?: string };
    travelpayouts?: { enabled?: boolean; configured?: boolean; mode?: string };
  };
};

export default function SettingsPage() {
  const [data, setData] = useState<ProviderState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/travel/providers/status').then(r => setData(r.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  const tp = data?.providers?.travelpayouts;

  return (
    <div className="space-y-7">
      <div><p className="text-xs font-black text-teal-600 m-0">SETTINGS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">إعدادات المنصة</h2><p className="text-sm text-slate-500 m-0">حالة التكاملات الأساسية بدون إظهار أي مفاتيح سرية.</p></div>
      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between"><span className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 grid place-items-center"><Plane size={22}/></span><span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">مفعّل</span></div>
          <h3 className="text-lg font-black mt-5 mb-1">الحجز اليدوي</h3><p className="text-sm text-slate-500 leading-7 m-0">المزود الافتراضي الحالي. يدعم طلبات الطيران والفنادق والسيارات حتى تفعيل API خارجي.</p>
        </section>
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between"><span className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 grid place-items-center"><Globe2 size={22}/></span><span className={`text-xs font-black px-3 py-1.5 rounded-full ${tp?.enabled ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>{loading ? 'فحص...' : tp?.enabled ? 'مفعّل' : 'جاهز للتفعيل لاحقًا'}</span></div>
          <h3 className="text-lg font-black mt-5 mb-1">Travelpayouts</h3><p className="text-sm text-slate-500 leading-7 m-0">{tp?.configured ? 'بيانات التكامل موجودة في الخادم.' : 'لا يوجد API Token حاليًا. لن يتم استخدام أي بيانات تجريبية أو وهمية.'}</p>
        </section>
      </div>
      <section className="bg-[#071d28] text-white rounded-2xl p-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="flex gap-3"><ShieldCheck className="text-teal-400 shrink-0"/><div><strong className="text-sm">الأسرار محمية</strong><p className="text-xs leading-6 text-slate-400 m-0 mt-1">لا تظهر مفاتيح API في لوحة التحكم.</p></div></div>
          <div className="flex gap-3"><Database className="text-teal-400 shrink-0"/><div><strong className="text-sm">قاعدة البيانات</strong><p className="text-xs leading-6 text-slate-400 m-0 mt-1">الاتصال يدار من الخادم فقط.</p></div></div>
          <div className="flex gap-3"><KeyRound className="text-teal-400 shrink-0"/><div><strong className="text-sm">التفعيل لاحقًا</strong><p className="text-xs leading-6 text-slate-400 m-0 mt-1">إضافة Token وMarker ثم تفعيل المزود.</p></div></div>
        </div>
      </section>
      <div className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={15} className="text-teal-600"/>إعدادات الإنتاج الحساسة تُدار عبر Environment Variables فقط.</div>
    </div>
  );
}
