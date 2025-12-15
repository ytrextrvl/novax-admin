import { Users, Calendar, CreditCard, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Dashboard Overview</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard 
          title="Total Users" 
          value="1,234" 
          trend="+12%" 
          icon={<Users className="text-primary" size={24} />} 
        />
        <KPICard 
          title="Total Bookings" 
          value="856" 
          trend="+5%" 
          icon={<Calendar className="text-secondary" size={24} />} 
        />
        <KPICard 
          title="Revenue" 
          value="$45,231" 
          trend="+8%" 
          icon={<CreditCard className="text-blue-500" size={24} />} 
        />
        <KPICard 
          title="Active Agents" 
          value="42" 
          trend="+2%" 
          icon={<TrendingUp className="text-emerald-500" size={24} />} 
        />
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-novax">
        <h3 className="text-lg font-bold text-navy mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">New user registration</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-novax">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-navy mt-1">{value}</p>
    </div>
  );
}
