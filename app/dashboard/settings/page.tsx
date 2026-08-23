'use client';

import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CheckCircle2, Database, Globe2, KeyRound, LockKeyhole, Plane, ShieldCheck } from 'lucide-react';

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
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ok:boolean;text:string}|null>(null);

  useEffect(() => {
    api.get('/travel/providers/status').then(r => setData(r.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const current_password = String(form.get('current_password') || '');
    const password = String(form.get('password') || '');
    const password_confirmation = String(form.get('password_confirmation') || '');
    if (password !== password_confirmation) {
      setPasswordMessage({ok:false,text:'كلمتا المرور الجديدتان غير متطابقتين.'});
      return;
    }
    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      await api.post('/auth/password/change', { current_password, password, password_confirmation });
      setPasswordMessage({ok:true,text:'تم تغيير كلمة المرور بنجاح.'});
      event.currentTarget.reset();
    } catch (error:any) {
      setPasswordMessage({ok:false,text:error?.response?.data?.message || 'تعذر تغيير كلمة المرور. تحقق من كلمة المرور الحالية.'});
    } finally {
      setSavingPassword(false);
    }
  };

  const tp = data?.providers?.travelpayouts;

  return (
    <div className="space-y-7">
      <div><p className="text-xs font-black text-teal-600 m-0">SETTINGS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">إعدادات المنصة</h2><p className="text-sm text-slate-500 m-0">حالة التكاملات الأساسية وأمان حساب الإدارة.</p></div>
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

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5"><span className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 grid place-items-center"><LockKeyhole size={21}/></span><div><h3 className="text-lg font-black m-0">تغيير كلمة المرور</h3><p className="text-xs text-slate-400 mt-1 mb-0">غيّر كلمة المرور المؤقتة فور أول دخول.</p></div></div>
        <form onSubmit={changePassword} className="grid md:grid-cols-3 gap-3">
          <input name="current_password" type="password" autoComplete="current-password" required placeholder="كلمة المرور الحالية" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"/>
          <input name="password" type="password" autoComplete="new-password" minLength={12} required placeholder="كلمة المرور الجديدة" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"/>
          <input name="password_confirmation" type="password" autoComplete="new-password" minLength={12} required placeholder="تأكيد كلمة المرور الجديدة" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"/>
          <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center gap-3"><button disabled={savingPassword} className="rounded-xl bg-[#0aa68f] text-white px-5 py-3 text-sm font-black disabled:opacity-50">{savingPassword ? 'جاري التغيير...' : 'حفظ كلمة المرور الجديدة'}</button>{passwordMessage && <span className={`text-xs font-bold ${passwordMessage.ok ? 'text-emerald-700' : 'text-red-600'}`}>{passwordMessage.text}</span>}</div>
        </form>
      </section>

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
