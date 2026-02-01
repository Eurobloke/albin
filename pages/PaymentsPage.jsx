
import React from 'react';
import AppHeader from './components/AppHeader.jsx';
import BottomNav from './components/BottomNav.jsx';

const PaymentsPage = ({ clients }) => {
  const totalContracted = clients.reduce((acc, c) => acc + c.total, 0);
  const totalCollected = clients.reduce((acc, c) => {
    const abonoReal = c.abonoTotal || (c.total * (parseInt(c.pct) / 100));
    return acc + abonoReal;
  }, 0);
  const pendingCollection = totalContracted - totalCollected;

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', currency: 'COP', maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="pb-40 bg-slate-50 dark:bg-[#020617] min-h-screen relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-100px] size-[400px] bg-primary/10 rounded-full blur-[80px]"></div>
      <AppHeader />
      
      <main className="px-6 mt-10 animate-fade-up max-w-4xl mx-auto">
        <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 ml-2">Análisis Financiero Global</h2>
        
        <div className="grid gap-6 mb-12">
          <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] size-32 bg-white/10 rounded-full blur-3xl"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Total Contratado (Ventas)</p>
            <p className="text-4xl font-black tracking-tighter">{formatCurrency(totalContracted)}</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="glass-card rounded-[2rem] p-6 border-l-4 border-l-green-500">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Recaudado (Abonos)</span>
              <p className="text-xl font-black text-green-500">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="glass-card rounded-[2rem] p-6 border-l-4 border-l-harmony-red">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Por Recaudar</span>
              <p className="text-xl font-black text-harmony-red">{formatCurrency(pendingCollection)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {clients.map(client => {
            const totalSpent = client.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
            const utility = client.total - totalSpent;
            const isLoss = utility < 0;

            return (
              <div 
                key={client.id} 
                className={`glass-card rounded-[2.5rem] p-7 group transition-all relative overflow-hidden border-2 ${
                  isLoss 
                  ? 'border-harmony-red bg-red-500/10 dark:bg-red-950/40 shadow-glow-red scale-[1.02]' 
                  : 'border-transparent hover:border-primary/20'
                }`}
              >
                {isLoss && (
                  <div className="absolute top-0 right-0 p-3 bg-harmony-red text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl">
                    ALERTA DE SOBRECOSTO
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className={`font-black text-xl transition-colors ${isLoss ? 'text-harmony-red' : 'text-slate-900 dark:text-white'}`}>
                      {client.name}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{client.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      isLoss ? 'bg-harmony-red text-white shadow-lg shadow-harmony-red/30' : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {isLoss ? 'Pérdida Registrada' : 'Operación Rentable'}
                    </span>
                  </div>
                </div>

                <div className={`grid grid-cols-3 gap-6 p-5 rounded-3xl ${isLoss ? 'bg-harmony-red/10 border border-harmony-red/20' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10'}`}>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Inversión Obra</span>
                    <p className={`text-sm font-black ${isLoss ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{formatCurrency(client.total)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Gastos Reales</span>
                    <p className={`text-sm font-black ${isLoss ? 'text-harmony-red animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                      {formatCurrency(totalSpent)}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Utilidad Final</span>
                    <p className={`text-lg font-black ${isLoss ? 'text-harmony-red' : 'text-green-500'}`}>
                      {formatCurrency(utility)}
                    </p>
                  </div>
                </div>

                {isLoss && (
                  <div className="mt-6 flex items-start gap-3 bg-harmony-red text-white p-4 rounded-2xl animate-fade-in">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest">Atención Gerencial:</p>
                      <p className="text-[9px] font-bold opacity-90 uppercase leading-relaxed">
                        Los costos operativos superan el precio de venta en {formatCurrency(Math.abs(utility))}. 
                        Se recomienda revisar la obra de {client.desc} inmediatamente.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {clients.length === 0 && (
            <div className="text-center py-24 opacity-30">
               <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">account_balance</span>
               <p className="text-xs font-black uppercase tracking-widest">Sin proyectos para analizar</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

