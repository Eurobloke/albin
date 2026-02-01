import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import BottomNav from '../components/BottomNav.jsx';

const CATEGORIES = [
  { id: 'fuel', label: 'Gasolina', icon: 'local_gas_station', color: 'bg-amber-500' },
  { id: 'tools', label: 'Herramientas', icon: 'handyman', color: 'bg-blue-500' },
  { id: 'food', label: 'Alimentación', icon: 'restaurant', color: 'bg-green-500' },
  { id: 'other', label: 'Otros / Varios', icon: 'more_horiz', color: 'bg-slate-500' },
];

const BusinessExpensesPage = ({ username }) => {
  const navigate = useNavigate();
  const storageKey = `harmony_business_expenses_${username}`;
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  
  const [newExpense, setNewExpense] = useState({ 
    item: '', 
    amount: '', 
    ref: '', 
    category: 'other' 
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(expenses));
  }, [expenses, storageKey]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.item || !newExpense.amount) return;

    const categoryData = CATEGORIES.find(c => c.id === newExpense.category) || CATEGORIES[3];

    const expense = {
      id: Date.now(),
      item: newExpense.item,
      amount: parseFloat(newExpense.amount),
      ref: newExpense.ref || "Gasto de Empresa",
      icon: categoryData.icon,
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
      user: username
    };

    setExpenses([expense, ...expenses]);
    setShowModal(false);
    setNewExpense({ item: '', amount: '', ref: '', category: 'other' });
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      setExpenseToDelete(null);
    }
  };

  const handleClearAll = () => {
    setExpenses([]);
    setShowClearAllModal(false);
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', currency: 'COP', maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="pb-40 bg-slate-50 dark:bg-[#020617] min-h-screen relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] size-[400px] bg-harmony-red/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <AppHeader />

      <main className="px-6 mt-10 animate-fade-up">
        <div className="glass-card rounded-[2.5rem] p-8 space-y-4 mb-10 border-l-8 border-l-harmony-red shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-harmony-red text-sm">account_circle</span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                GASTOS {username.toUpperCase()}
              </p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {formatCurrency(totalSpent)}
            </h2>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-harmony-red/10 text-harmony-red text-[9px] font-black rounded-full uppercase tracking-widest border border-harmony-red/20">
                Caja Empresa
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-slate-200/20 dark:text-white/5 pointer-events-none">payments</span>
        </div>

        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Movimientos</h3>
          <div className="flex gap-2">
            {expenses.length > 0 && (
              <button 
                onClick={() => setShowClearAllModal(true)}
                className="size-12 bg-harmony-red/10 text-harmony-red rounded-2xl flex items-center justify-center border border-harmony-red/20 shadow-lg active:scale-95 transition-all"
                title="Vaciar Caja"
              >
                <span className="material-symbols-outlined">delete_sweep</span>
              </button>
            )}
            <button 
              onClick={() => setShowModal(true)}
              className="h-12 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Registrar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {expenses.map((exp) => (
            <div key={exp.id} className="glass-card rounded-[2rem] p-5 flex justify-between items-center group animate-slide-in relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-harmony-red group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">{exp.icon}</span>
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm group-hover:text-harmony-red transition-colors">{exp.item}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{exp.date}</span>
                    <span className="size-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[120px]">{exp.ref}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="text-right">
                  <p className="text-sm font-black text-harmony-red">-{formatCurrency(exp.amount)}</p>
                </div>
                <button 
                  onClick={() => setExpenseToDelete(exp)} 
                  className="size-10 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="py-24 text-center space-y-6">
              <div className="size-24 bg-slate-100 dark:bg-slate-900 mx-auto rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">receipt_long</span>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Caja Vacía</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 space-y-6 border-t-8 border-t-harmony-red animate-fade-up">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Nuevo Gasto</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewExpense({...newExpense, category: cat.id})}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${newExpense.category === cat.id ? 'bg-harmony-red text-white shadow-lg shadow-harmony-red/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                    <span className="text-[7px] font-black uppercase tracking-tighter">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Concepto</label>
                <input required className="w-full h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-5 text-sm outline-none border-none" placeholder="¿En qué se gastó?" value={newExpense.item} onChange={(e) => setNewExpense({...newExpense, item: e.target.value})}/>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valor</label>
                <input required className="w-full h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-5 text-lg font-black outline-none border-none" type="number" placeholder="$ 0" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}/>
              </div>

              <button type="submit" className="w-full h-16 bg-harmony-red text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-harmony-red/30 mt-4 transition-all active:scale-95">
                Confirmar Registro
              </button>
            </form>
          </div>
        </div>
      )}

      {expenseToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 space-y-6 animate-fade-up">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20 shadow-glow-red">
                <span className="material-symbols-outlined text-4xl">delete_forever</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase">Eliminar Gasto</h4>
                <p className="text-xs text-slate-500 font-bold">¿Seguro que deseas eliminar el registro de <span className="text-harmony-red font-black uppercase tracking-widest">{expenseToDelete.item}</span>?</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setExpenseToDelete(null)} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">Cancelar</button>
              <button onClick={confirmDeleteExpense} className="flex-[1.5] h-14 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {showClearAllModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 space-y-6 animate-fade-up border-b-8 border-b-red-600">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-20 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 border border-red-600/20 shadow-glow-red">
                <span className="material-symbols-outlined text-4xl">warning</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Vaciar Caja</h4>
                <p className="text-xs text-slate-500 font-bold">⚠️ Esta acción eliminará <span className="text-red-600 font-black">TODOS</span> los registros de gasto de tu cuenta de forma permanente.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowClearAllModal(false)} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase text-slate-500 hover:bg-slate-100 transition-all">Conservar</button>
              <button onClick={handleClearAll} className="flex-[1.5] h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Vaciar Todo</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};
