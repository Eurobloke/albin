import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';

const ExpenseManagementPage = ({ readonly = false, clientData, onUpdateClient }) => {
  const navigate = useNavigate();
  
  if (!clientData) {
    useEffect(() => { navigate('/dashboard'); }, []);
    return null;
  }

  const [abonoTotal, setAbonoTotal] = useState(clientData.abonoTotal || (clientData.total * (parseInt(clientData.pct) / 100)));
  const [expenses, setExpenses] = useState(clientData.expenses || []);
  const [showModal, setShowModal] = useState(false);
  const [newExpenseData, setNewExpenseData] = useState({ item: '', ref: '', amount: '' });

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalanceFromAbono = abonoTotal - totalExpenses;
  const remainingCajaPct = abonoTotal > 0 ? Math.max(0, (currentBalanceFromAbono / abonoTotal) * 100) : 0;

  const totalUtility = clientData.total - totalExpenses;
  const utilityPct = Math.max(0, (totalUtility / clientData.total) * 100);
  const isLoss = totalUtility < 0;

  const getBarColorClass = (pct) => {
    if (pct <= 0) return "bg-slate-900 dark:bg-white shadow-none";
    if (pct <= 30) return "bg-red-500 shadow-glow-red";
    if (pct <= 60) return "bg-orange-500 shadow-glow-orange";
    return "bg-green-500 shadow-glow-green";
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = parseInt(newExpenseData.amount);
    if (!newExpenseData.item || isNaN(amount) || amount <= 0) return;

    const newExpense = {
      id: Date.now(),
      item: newExpenseData.item,
      ref: newExpenseData.ref || "General",
      amount,
      icon: "receipt_long"
    };

    setExpenses([...expenses, newExpense]);
    setShowModal(false);
    setNewExpenseData({ item: '', ref: '', amount: '' });
  };

  const handleSaveChanges = () => {
    if (readonly) return;
    const paymentPct = Math.round((abonoTotal / clientData.total) * 100);
    const barColorClass = getBarColorClass(remainingCajaPct);
    
    let status = "Activo";
    let color = "text-green-600";
    if (remainingCajaPct <= 0) { status = "Agotado"; color = "text-slate-900 dark:text-white"; }
    else if (remainingCajaPct <= 30) { status = "Crítico"; color = "text-red-600"; }
    else if (remainingCajaPct <= 60) { status = "Medio"; color = "text-orange-600"; }

    const updatedClient = {
      ...clientData,
      abonoTotal,
      expenses,
      pct: `${paymentPct}%`,
      progress: barColorClass,
      status,
      color
    };

    onUpdateClient(updatedClient);
    navigate('/dashboard');
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="pb-32 min-h-screen bg-slate-50 dark:bg-[#020617] max-w-md mx-auto relative overflow-hidden">
      <AppHeader showBack onBack={() => navigate(-1)} />

      <main className="p-6 space-y-8 animate-fade-up">
        <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${isLoss ? 'bg-harmony-red shadow-harmony-red/30' : 'bg-primary shadow-primary/20'}`}>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Control Financiero</p>
                 {isLoss && <span className="bg-white/20 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">Pérdida Crítica</span>}
              </div>
              <h1 className="text-3xl font-black tracking-tighter mb-6 leading-none">{clientData.name}</h1>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-sm">
                    <p className="text-[8px] font-bold uppercase opacity-60 mb-1 tracking-widest">Inversión Obra</p>
                    <p className="font-black text-base">{formatCurrency(clientData.total)}</p>
                 </div>
                 <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-sm">
                    <p className="text-[8px] font-bold uppercase opacity-60 mb-1 tracking-widest">Gasto Total</p>
                    <p className={`font-black text-base ${isLoss ? 'text-white' : 'text-white'}`}>{formatCurrency(totalExpenses)}</p>
                 </div>
              </div>
           </div>
           <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[10rem] text-white/10 rotate-12 pointer-events-none">analytics</span>
        </div>

        <div className={`glass-card rounded-[2.5rem] p-8 border-2 transition-all ${isLoss ? 'border-harmony-red shadow-glow-red bg-red-50/50 dark:bg-red-900/10' : 'border-transparent'}`}>
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Balance de Rentabilidad</h3>
              <span className={`text-xs font-black ${isLoss ? 'text-harmony-red' : 'text-green-500'}`}>
                {isLoss ? 'SALDO NEGATIVO' : `${utilityPct.toFixed(1)}% Margen`}
              </span>
           </div>
           
           <div className="flex justify-between items-end mb-4">
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Utilidad Final</p>
                 <p className={`text-4xl font-black tracking-tighter ${isLoss ? 'text-harmony-red' : 'text-slate-900 dark:text-white'}`}>
                   {formatCurrency(totalUtility)}
                 </p>
              </div>
           </div>
           
           <div className="relative h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${isLoss ? 'bg-harmony-red' : 'bg-green-500'}`} style={{ width: `${isLoss ? 100 : utilityPct}%` }}></div>
           </div>
           {isLoss && (
             <p className="mt-4 text-[9px] font-black text-harmony-red uppercase tracking-widest text-center animate-pulse">
               Has gastado {formatCurrency(Math.abs(totalUtility))} más del precio total.
             </p>
           )}
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
          <div className="flex justify-between items-end">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caja Actual (Abono)</p>
                <p className={`text-2xl font-black tracking-tighter ${remainingCajaPct <= 0 ? 'text-slate-900 dark:text-white' : 'text-primary'}`}>
                  {formatCurrency(currentBalanceFromAbono)}
                </p>
             </div>
             <div className="text-right pb-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Egresos Ejecutados</p>
                <p className="text-xs font-black text-harmony-red">-{formatCurrency(totalExpenses)}</p>
             </div>
          </div>
          <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${getBarColorClass(remainingCajaPct)}`} style={{ width: `${remainingCajaPct}%` }}></div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Gastos Registrados</h3>
              {!readonly && (
                <button onClick={() => setShowModal(true)} className="size-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all">
                  <span className="material-symbols-outlined">add</span>
                </button>
              )}
           </div>

           <div className="space-y-4 px-2">
              {expenses.map((g) => (
                <div key={g.id} className="glass-card rounded-3xl p-5 flex justify-between items-center animate-slide-in group border-l-4 border-l-transparent hover:border-l-harmony-red">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-harmony-red/10 group-hover:text-harmony-red transition-all">
                      <span className="material-symbols-outlined text-xl">{g.icon}</span>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm leading-none mb-1">{g.item}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{g.ref}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-black text-harmony-red">-{formatCurrency(g.amount)}</p>
                    {!readonly && (
                      <button onClick={() => setExpenses(expenses.filter(ex => ex.id !== g.id))} className="size-8 text-slate-300 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </main>

      {!readonly && (
        <div className="fixed bottom-0 left-0 right-0 p-8 z-50 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 to-transparent flex justify-center">
          <button onClick={handleSaveChanges} className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 text-xs">
            Guardar y Actualizar Balance
          </button>
        </div>
      )}

      {showModal && !readonly && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-10 space-y-8 border-t-8 border-t-primary animate-fade-up">
            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter text-center">Registrar Gasto</h4>
            <div className="space-y-4">
              <input className="w-full h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary/20" placeholder="Concepto del gasto" value={newExpenseData.item} onChange={(e) => setNewExpenseData({...newExpenseData, item: e.target.value})}/>
              <input className="w-full h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 text-sm font-bold outline-none border-2 border-transparent focus:border-primary/20" placeholder="Proveedor / Referencia" value={newExpenseData.ref} onChange={(e) => setNewExpenseData({...newExpenseData, ref: e.target.value})}/>
              <input className="w-full h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 text-lg font-black outline-none border-2 border-transparent focus:border-primary/20 text-primary" type="number" placeholder="Monto $ 0" value={newExpenseData.amount} onChange={(e) => setNewExpenseData({...newExpenseData, amount: e.target.value})}/>
              <div className="flex gap-4 pt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 font-black text-[10px] uppercase text-slate-400">Volver</button>
                <button onClick={handleAddExpense} className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">Agregar Gasto</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagementPage;
