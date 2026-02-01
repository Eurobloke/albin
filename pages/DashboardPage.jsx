import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import AppHeader from '../components/AppHeader.jsx';

const DashboardPage = ({ readonly = false, clients, onSelectClient, onDeleteClient }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleCardClick = (client) => {
    onSelectClient(client.id);
    navigate('/expense-management');
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBudgetInfo = (client) => {
    const abono = client.abonoTotal || 0;
    const spent = client.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
    
    const remainingInCaja = abono - spent;
    const cajaPct = abono > 0 ? Math.max(0, (remainingInCaja / abono) * 100) : 0;
    
    const utility = client.total - spent;
    const isOverBudget = spent > client.total;
    
    let colorClass = "bg-green-500 shadow-glow-green";
    if (cajaPct <= 0) colorClass = "bg-slate-900 dark:bg-white";
    else if (cajaPct <= 30) colorClass = "bg-red-500 shadow-glow-red";
    else if (cajaPct <= 60) colorClass = "bg-orange-500 shadow-glow-orange";
    
    return { cajaPct, colorClass, remainingInCaja, utility, isOverBudget };
  };

  return (
    <div className="pb-40 min-h-screen bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] size-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <AppHeader />

      <main className="px-6 mt-8 animate-fade-up max-w-2xl mx-auto">
        <div className="relative mb-10">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">search</span>
          <input 
            className="w-full h-14 bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-3xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none shadow-sm transition-all"
            placeholder="Buscar proyectos activos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Obras en Curso</h2>
          <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-widest">{filteredClients.length} Activos</span>
        </div>

        <div className="grid gap-6">
          {filteredClients.map((item) => {
            const { cajaPct, colorClass, remainingInCaja, utility, isOverBudget } = getBudgetInfo(item);
            return (
              <div 
                key={item.id} 
                className={`glass-card rounded-[2.5rem] p-7 group transition-all animate-fade-up relative overflow-hidden border-l-8 ${isOverBudget ? 'border-l-harmony-red shadow-glow-red' : 'border-l-primary hover:translate-x-1'}`}
              >
                <div onClick={() => handleCardClick(item)} className="cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black text-xl leading-tight ${isOverBudget ? 'text-harmony-red' : 'text-slate-900 dark:text-white group-hover:text-primary'}`}>{item.name}</h3>
                        {isOverBudget && <span className="material-symbols-outlined text-harmony-red animate-pulse">report</span>}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border ${isOverBudget ? 'bg-harmony-red text-white border-harmony-red shadow-lg' : (cajaPct <= 0 ? 'bg-black text-white border-black' : 'bg-primary/5 text-primary border-primary/20')} uppercase tracking-widest`}>
                        {isOverBudget ? 'SOBRECOSTO' : (cajaPct <= 0 ? 'Caja Agotada' : item.status)}
                      </span>
                      {!readonly && onDeleteClient && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setClientToDelete(item); }}
                          className="size-10 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                          <span className="material-symbols-outlined text-xl">archive</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-3xl p-5 mb-6 grid grid-cols-2 gap-4 border ${isOverBudget ? 'bg-harmony-red/5 border-harmony-red/20' : 'bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5'}`}>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Precio Venta</span>
                      <span className={`text-base font-black ${isOverBudget ? 'text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>$ {item.total.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Margen Final</span>
                      <span className={`text-base font-black ${utility < 0 ? 'text-harmony-red' : 'text-green-500'}`}>$ {utility.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Disponible (Abono)</span>
                      <span className={`text-sm font-black ${cajaPct <= 30 ? 'text-harmony-red animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                        $ {remainingInCaja.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${cajaPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredClients.length === 0 && (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">analytics</span>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin datos sincronizados</p>
            </div>
          )}
        </div>
      </main>

      {!readonly && (
        <div className="fixed bottom-32 left-0 right-0 px-6 flex justify-center z-40">
          <button 
            onClick={() => navigate('/new-client')}
            className="h-16 px-10 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">add_business</span>
            Nueva Obra
          </button>
        </div>
      )}

      {clientToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-10 space-y-8 animate-fade-up border-t-8 border-t-primary">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-4xl">inventory</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase">Finalizar Obra</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">¿Confirmas que el proyecto de <span className="text-primary font-black">{clientToDelete.name}</span> ha concluido? Se moverá al historial para facturación.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setClientToDelete(null)} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase text-slate-400">Volver</button>
              <button 
                onClick={() => { onDeleteClient?.(clientToDelete.id); setClientToDelete(null); }}
                className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Sí, Archivar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
