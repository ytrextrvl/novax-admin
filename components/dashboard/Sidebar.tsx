'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Settings, Calendar, Plane } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Calendar, label: 'Bookings', href: '/bookings' },
  { icon: CreditCard, label: 'Payments', href: '/payments' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
      <div className="p-6 flex items-center justify-center border-b border-border">
        <img src="/images/logo-light.png" alt="NOVAX Logo" className="h-12 w-auto object-contain" />
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@novaxtravel.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
