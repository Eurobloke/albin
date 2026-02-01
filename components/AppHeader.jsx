import React from 'react';

const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmG8hGr-zbMEUw4_XqO0tksMNayStHx_v-Z7VL76ULi6d8hhlYSRDhtmtIuWZm6c6OUuL6z3WiTSmCgE43moWXPGn32DpJ-cwCjb3G8mpiJHrkHNygIFcIKGWQG_jLf7khHnYUrSpX6EgHFOnlZnZQEWYFiNFi2SBTIXwuqrRgLo43v0K5s2S2b69Gm-wK4p7SIdSR2UAY9HA3p74Ff8luS_XM0c0s177RPLxnTJfPW-VG_H8V0gzm1wWBKXx_9jdDPyfnHYLF_A";

const AppHeader = ({ size = "sm", showBack, onBack }) => (
  <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 px-6 py-4 transition-all duration-500">
    <div className="max-w-5xl mx-auto flex items-center justify-between">
      <div className="flex-1">
        {showBack && (
          <button onClick={onBack} className="size-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-all hover:bg-primary/10 hover:text-primary">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        )}
      </div>

      <div className="flex flex-col items-center flex-1">
        <div className={`${size === 'lg' ? 'size-24' : 'size-16'} bg-white rounded-[1.75rem] p-2 shadow-2xl border border-slate-100 flex items-center justify-center transition-all transform hover:scale-110`}>
          <img 
            alt="Harmony Glass Logo" 
            className="h-full w-full object-contain" 
            src={LOGO_URL}
          />
        </div>
        <div className="mt-2.5 text-center">
          <h1 className="text-[14px] font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase leading-none">
            <span className="text-primary">HARMONY</span> <span className="text-harmony-red">GLASS</span>
          </h1>
          <p className="text-[7px] font-black text-slate-400 mt-1.5 uppercase tracking-[0.5em] italic opacity-60">High Precision Engineering</p>
        </div>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="size-11 rounded-full bg-primary/5 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-xl">verified</span>
        </div>
      </div>
    </div>
  </header>
);
