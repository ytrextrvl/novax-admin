'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AICopilot from '@/components/dashboard/AICopilot';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Plane, 
  Hotel, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search,
  TrendingUp,
  CreditCard,
  Calendar
} from 'lucide-react';
import api from '@/lib/axios';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');

    if (!token || !userData) {
      router.push('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      router.push('/');
    } finally {
      setLoading(false);
    }

    // Auto-logout logic
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 10 * 60 * 1000); // 10 minutes
    };

    // Events to monitor for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Attach listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial timer start
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({
          users: { total: 0 },
          bookings: { total: 0 },
          revenue: { total: 0 }
        });
      } finally {
        setStatsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight">NOVAX</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 hidden lg:flex items-center gap-3 border-b border-slate-800/50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-xl text-white">N</span>
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-white">NOVAX</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wider">ADMIN PANEL</p>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Overview</div>
              <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
              <NavItem icon={<TrendingUp size={20} />} label="Analytics" />
              
              <div className="px-4 py-2 mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</div>
              <NavItem icon={<Users size={20} />} label="Users" />
              <NavItem icon={<Plane size={20} />} label="Flights" />
              <NavItem icon={<Hotel size={20} />} label="Hotels" />
              <NavItem icon={<Calendar size={20} />} label="Bookings" />
              
              <div className="px-4 py-2 mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
              <NavItem icon={<CreditCard size={20} />} label="Payments" />
              
              <div className="px-4 py-2 mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</div>
              <NavItem icon={<Users size={20} />} label="Team" href="/dashboard/team" />
              <NavItem icon={<Settings size={20} />} label="Settings" href="/dashboard/settings" />
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center border-2 border-slate-800 shadow-sm">
                  <User size={18} className="text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative w-full">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white hidden md:block">Dashboard Overview</h2>
            
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-slate-900 border border-slate-800 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
              </button>
            </div>
          </header>

          <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {user?.first_name}! 👋</h1>
                <p className="text-blue-100 text-lg max-w-2xl">Here's what's happening with your platform today. You have <span className="font-semibold text-white">12 new notifications</span>.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Total Users" 
                value={statsLoading ? '...' : stats?.users?.total || 0}
                subtitle="Registered Users"
                icon={<Users className="text-blue-400" size={24} />}
                trend="+12% this week"
                color="blue"
              />
              <StatCard 
                title="Total Bookings" 
                value={statsLoading ? '...' : stats?.bookings?.total || 0}
                subtitle="Flights & Hotels"
                icon={<Plane className="text-purple-400" size={24} />}
                trend="+5% this week"
                color="purple"
              />
              <StatCard 
                title="Total Revenue" 
                value={`$${statsLoading ? '...' : (stats?.revenue?.total || 0).toLocaleString()}`}
                subtitle="Confirmed Transactions"
                icon={<CreditCard className="text-emerald-400" size={24} />}
                trend="+8% this week"
                color="emerald"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">Recent Activity</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">View All</button>
              </div>
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-slate-600" size={32} />
                </div>
                <h4 className="text-slate-300 font-medium mb-1">No recent activity</h4>
                <p className="text-slate-500 text-sm">New bookings and user registrations will appear here.</p>
              </div>
            </div>
          </div>

          <footer className="mt-auto py-8 text-center border-t border-slate-800/50">
            <p className="text-xs text-slate-500 font-medium">
              Novax Admin Panel <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 ml-1">v1.0.0 Stable</span>
            </p>
          </footer>
        </main>
      </div>
      <AICopilot />
    </div>
  );
}

function NavItem({ icon, label, active = false, href = "#" }: { icon: any, label: string, active?: boolean, href?: string }) {
  return (
    <a 
      href={href} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }
      `}
    >
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>}
    </a>
  );
}

function StatCard({ title, value, subtitle, icon, trend, color }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-sm hover:shadow-md group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]} border`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          {trend}
        </span>
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tight mb-1">{value}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
