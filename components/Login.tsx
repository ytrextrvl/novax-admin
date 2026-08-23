'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { AlertCircle, ArrowLeft, LockKeyhole, Mail, Plane, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('admin_token')) router.replace('/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      const roles = response.data?.user?.roles || [];
      if (!roles.includes('admin')) throw new Error('ADMIN_REQUIRED');
      localStorage.setItem('admin_token', response.data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      router.replace('/dashboard');
    } catch (err: any) {
      if (err?.message === 'ADMIN_REQUIRED') setError('هذا الحساب لا يملك صلاحية الإدارة.');
      else setError(err.response?.data?.message || err.response?.data?.error || 'تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.05fr_.95fr] bg-[#061923]">
      <section className="hidden lg:flex relative overflow-hidden p-14 text-white flex-col justify-between bg-[linear-gradient(135deg,rgba(5,28,39,.78),rgba(5,28,39,.45)),url('https://images.unsplash.com/photo-1767734715858-0b08e85224f6?auto=format&fit=crop&fm=jpg&q=82&w=1800')] bg-cover bg-center">
        <div className="flex items-center gap-3"><span className="w-12 h-12 rounded-2xl bg-teal-500 grid place-items-center shadow-xl shadow-teal-500/20"><Plane size={24}/></span><div><strong className="text-2xl tracking-wide">NOVAX</strong><span className="block text-[10px] tracking-[.35em] text-white/60">TRAVEL ADMIN</span></div></div>
        <div className="max-w-xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur"><ShieldCheck size={16}/>دخول إداري آمن</span><h1 className="text-5xl leading-tight font-black mt-5 mb-5">أدر الحجوزات والعملاء<br/>من مكان واحد.</h1><p className="text-white/70 leading-8 text-sm">لوحة تحكم موحدة للطيران والفنادق والسيارات، جاهزة للتوسع وربط مزودي السفر لاحقًا.</p></div>
        <p className="text-xs text-white/45">© NOVAX Travel</p>
      </section>

      <section className="bg-white min-h-screen flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10"><span className="w-11 h-11 rounded-2xl bg-teal-500 text-white grid place-items-center"><Plane size={22}/></span><strong className="text-2xl tracking-wide">NOVAX</strong></div>
          <span className="text-xs font-black text-teal-600 tracking-wide">NOVAX ADMIN</span>
          <h2 className="text-3xl font-black text-slate-950 mt-2 mb-2">تسجيل دخول الإدارة</h2>
          <p className="text-sm text-slate-500 mb-8">أدخل بيانات حساب المدير للوصول إلى مركز التحكم.</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0 mt-0.5"/><span>{error}</span></div>}
            <label className="block"><span className="block text-xs font-black text-slate-700 mb-2">البريد الإلكتروني</span><div className="relative"><Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input type="email" required autoComplete="username" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" placeholder="admin@novaxtravel.com" value={email} onChange={e => setEmail(e.target.value)}/></div></label>
            <label className="block"><span className="block text-xs font-black text-slate-700 mb-2">كلمة المرور</span><div className="relative"><LockKeyhole className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input type="password" required autoComplete="current-password" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)}/></div></label>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#0aa68f] hover:bg-[#078d7a] text-white py-3.5 px-4 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/15 transition disabled:opacity-50">{loading ? 'جاري التحقق...' : <>دخول لوحة الإدارة <ArrowLeft size={18}/></>}</button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400"><ShieldCheck size={15}/>هذه الصفحة مخصصة للإدارة المصرح لها فقط.</div>
        </div>
      </section>
    </main>
  );
}
