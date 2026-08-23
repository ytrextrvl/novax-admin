'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import { CalendarDays, Car, Hotel, Plane, RefreshCcw, Save, ChevronDown, ChevronUp } from 'lucide-react';

type Inquiry = {
  id:number;
  reference:string;
  type:'flight'|'hotel'|'car';
  name:string;
  phone:string;
  status:string;
  amount:number;
  currency:string;
  payment_status:string;
  notes?:string|null;
  service_details?:Record<string,unknown>;
  created_at?:string;
};

const labels = { flight:'طيران', hotel:'فندق', car:'سيارة' };
const icons = { flight:Plane, hotel:Hotel, car:Car };
const statusLabels: Record<string,string> = {
  new:'جديد', reviewing:'قيد المراجعة', quoted:'تم التسعير', awaiting_payment:'بانتظار الدفع', confirmed:'مؤكد', completed:'مكتمل', cancelled:'ملغي',
};
const paymentLabels: Record<string,string> = { pending:'معلق', paid:'مدفوع', failed:'فشل', refunded:'مسترد' };

export default function BookingsPage() {
  const [items,setItems] = useState<Inquiry[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [selected,setSelected] = useState<number|null>(null);
  const [saving,setSaving] = useState<number|null>(null);
  const [typeFilter,setTypeFilter] = useState('all');
  const [statusFilter,setStatusFilter] = useState('all');

  const load = () => {
    setLoading(true); setError('');
    api.get('/admin/inquiries').then(r => setItems(r.data?.inquiries || [])).catch(() => setError('تعذر تحميل الطلبات.')).finally(() => setLoading(false));
  };
  useEffect(load,[]);

  const filtered = useMemo(() => items.filter(item => (typeFilter === 'all' || item.type === typeFilter) && (statusFilter === 'all' || item.status === statusFilter)), [items,typeFilter,statusFilter]);

  const updateLocal = (id:number, patch:Partial<Inquiry>) => setItems(prev => prev.map(x => x.id === id ? {...x,...patch} : x));

  const save = async (item:Inquiry) => {
    setSaving(item.id); setError('');
    try {
      const res = await api.patch(`/admin/inquiries/${item.id}`, {
        status:item.status,
        amount:item.amount,
        currency:item.currency,
        payment_status:item.payment_status,
        notes:item.notes || '',
      });
      updateLocal(item.id, res.data?.inquiry || {});
    } catch {
      setError('تعذر حفظ التعديل. حاول مرة أخرى.');
    } finally {
      setSaving(null);
    }
  };

  return <div className="space-y-7">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"><div><p className="text-xs font-black text-teal-600 m-0">BOOKINGS</p><h2 className="text-3xl font-black text-slate-950 mt-1 mb-1">طلبات الحجز</h2><p className="text-sm text-slate-500 m-0">استقبال ومراجعة وتسعير ومتابعة الطيران والفنادق والسيارات.</p></div><button onClick={load} className="inline-flex self-start items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-600 hover:border-teal-300"><RefreshCcw size={15}/>تحديث</button></div>

    <div className="flex flex-wrap gap-2">
      <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold"><option value="all">كل الخدمات</option><option value="flight">الطيران</option><option value="hotel">الفنادق</option><option value="car">السيارات</option></select>
      <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold"><option value="all">كل الحالات</option>{Object.entries(statusLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
    </div>

    {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-2 font-black"><CalendarDays className="text-teal-600" size={20}/>قائمة الطلبات</div><span className="text-xs text-slate-400">{loading ? '...' : filtered.length}</span></div>
      {loading ? <div className="p-12 text-center text-sm text-slate-400">جاري تحميل الطلبات...</div> : filtered.length === 0 ? <div className="p-12 text-center text-sm text-slate-400">لا توجد طلبات مطابقة.</div> : <div className="divide-y divide-slate-100">{filtered.map(item => {
        const Icon=icons[item.type] || Plane;
        const open = selected === item.id;
        const details = item.service_details || {};
        return <div key={item.id}>
          <button type="button" onClick={()=>setSelected(open?null:item.id)} className="w-full text-right p-4 md:px-6 flex items-center gap-4 hover:bg-slate-50 transition">
            <span className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 grid place-items-center shrink-0"><Icon size={20}/></span>
            <div className="flex-1 min-w-0"><div className="flex flex-wrap gap-2 items-center"><strong className="text-sm">{item.name}</strong><span className="text-[10px] bg-slate-100 rounded-full px-2 py-1 text-slate-600 font-black">{labels[item.type] || item.type}</span><span className="text-[10px] text-slate-400 font-mono">{item.reference}</span></div><p className="text-xs text-slate-400 mt-1 mb-0">{item.phone} {item.created_at ? `• ${new Date(item.created_at).toLocaleString('ar')}` : ''}</p></div>
            {item.amount > 0 && <strong className="hidden sm:block text-sm">{item.amount.toLocaleString()} {item.currency}</strong>}
            <span className="text-[10px] font-black rounded-full bg-amber-50 text-amber-700 px-3 py-1.5">{statusLabels[item.status] || item.status}</span>
            {open?<ChevronUp size={17}/>:<ChevronDown size={17}/>} 
          </button>
          {open && <div className="bg-slate-50 border-t border-slate-100 p-5 md:p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border border-slate-200 p-4"><h4 className="font-black text-sm mt-0">تفاصيل الطلب</h4><div className="space-y-2">{Object.entries(details).filter(([,v])=>v!==''&&v!==null&&v!==undefined).map(([k,v])=><div key={k} className="flex justify-between gap-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400">{k}</span><strong className="text-left break-words">{String(v)}</strong></div>)}</div></div>
              <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold">الحالة<select value={item.status} onChange={e=>updateLocal(item.id,{status:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-white">{Object.entries(statusLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label><label className="text-xs font-bold">الدفع<select value={item.payment_status} onChange={e=>updateLocal(item.id,{payment_status:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 bg-white">{Object.entries(paymentLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label></div>
                <div className="grid grid-cols-[1fr_100px] gap-3"><label className="text-xs font-bold">السعر<input type="number" min="0" step="0.01" value={item.amount} onChange={e=>updateLocal(item.id,{amount:Number(e.target.value)})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"/></label><label className="text-xs font-bold">العملة<input maxLength={3} value={item.currency} onChange={e=>updateLocal(item.id,{currency:e.target.value.toUpperCase()})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 uppercase"/></label></div>
                <label className="text-xs font-bold block">ملاحظات الإدارة<textarea rows={3} value={item.notes || ''} onChange={e=>updateLocal(item.id,{notes:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 resize-y"/></label>
                <button onClick={()=>save(item)} disabled={saving===item.id} className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2.5 font-black text-xs inline-flex justify-center items-center gap-2 disabled:opacity-50"><Save size={15}/>{saving===item.id?'جاري الحفظ...':'حفظ التحديث'}</button>
              </div>
            </div>
          </div>}
        </div>;
      })}</div>}
    </section>
  </div>;
}
