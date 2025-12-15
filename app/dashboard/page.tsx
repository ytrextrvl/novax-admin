'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, Plane, Hotel, Users, Settings } from 'lucide-react';
import api from '@/lib/axios';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

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
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // Fallback to zero if API fails
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-500">NOVAX ADMIN</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg border border-blue-600/20">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
            <Plane size={20} />
            <span>Flights</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
            <Hotel size={20} />
            <span>Hotels</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-400 mt-1">Welcome back, {user?.first_name}!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Total Users</h3>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{statsLoading ? '...' : stats?.users?.total || 0}</p>
            <p className="text-sm text-green-400 mt-2">Registered Users</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Total Bookings</h3>
              <Plane className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{statsLoading ? '...' : stats?.bookings?.total || 0}</p>
            <p className="text-sm text-green-400 mt-2">Flights & Hotels</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Total Revenue</h3>
              <span className="text-green-500 font-bold">$</span>
            </div>
            <p className="text-3xl font-bold">${statsLoading ? '...' : (stats?.revenue?.total || 0).toLocaleString()}</p>
            <p className="text-sm text-green-400 mt-2">Confirmed Transactions</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="font-bold">Recent Activity</h3>
          </div>
          <div className="p-6 text-center text-gray-500 py-12">
            No recent activity to display.
          </div>
        </div>
      </main>
    </div>
  );
}
