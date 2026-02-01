
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const active = location.pathname;

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Panel' },
    { path: '/business-expenses', icon: 'receipt_long', label: 'Caja' }, // Added Business Expenses link
    { path: '/clients', icon: 'history', label: 'Historial' },
    { path: '/payments', icon: 'payments', label: 'Pagos' },
    { path: '/settings', icon: 'tune', label: 'Ajustes' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-50 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/80 dark:via-background-dark/80 to-transparent flex justify-center">
      <nav className="glass-card rounded-[2rem] p-2 flex items-center gap-1 shadow-2xl border border-white/20 dark:border-white/10 overflow-x-auto max-w-[95vw]">
        {navItems.map((item) => {
          const isActive = active === item.path || (item.path === '/dashboard' && active === '/expense-management');
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-2 px-4 py-3 rounded-[1.5rem] transition-all duration-300 whitespace-nowrap ${
                isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-slate-400 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {isActive && <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
