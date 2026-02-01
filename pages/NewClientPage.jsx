import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';

const NewClientPage = ({ onAddClient }) => {
  const navigate = useNavigate();
  const [abono, setAbono] = useState(50);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    total: ''
  });

  const handleSave = () => {
    if (!formData.name || !formData.total) return alert("Complete los campos obligatorios");
    
    const newClient = {
      id: Date.now(),
      name: formData.name,
      desc: formData.location || "General",
      status: "Iniciado",
      progress: "bg-green-500",
      pct: `${abono}%`,
      start: new Date().toLocaleDateString(),
      end: "TBD",
      color: "text-primary",
      total: parseFloat(formData.total),
      phone: formData.phone,
      location: formData.location,
      abonoPercent: abono,
      abonoTotal: parseFloat(formData.total) * (abono / 100),
      expenses: []
    };

    onAddClient(newClient);
    navigate('/expense-management');
  };

  return (
    <div className="pb-40 min-h-screen bg-slate-50 dark:bg-[#020617] max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-50px] size-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <AppHeader showBack onBack={() => navigate(-1)} />

      <main className="p-6 space-y-6 animate-fade-up">
        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 ml-2">Nuevo Proyecto</h2>
        
        <div className="glass-card rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cliente</label>
              <input 
                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="Nombre del Cliente"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contacto</label>
                <input 
                  className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="300..." 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Monto Total</label>
                <input 
                  className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl px-5 text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder="$ 0.00" 
                  type="number"
                  value={formData.total}
                  onChange={(e) => setFormData({...formData, total: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ubicación / Proyecto</label>
              <input 
                className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="Dirección u Obra"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6 space-y-4 border-t border-slate-100 dark:border-white/5">
             <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Porcentaje de Abono</p>
                <span className="text-lg font-black text-primary">{abono}%</span>
             </div>
             <input 
               className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary" 
               max="100" min="0" step="5" type="range" 
               value={abono} 
               onChange={(e) => setAbono(parseInt(e.target.value))}
             />
             <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase text-center leading-relaxed">
                  Calculado: $ {((parseFloat(formData.total || '0')) * (abono/100)).toLocaleString()} para iniciar materiales.
                </p>
             </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 z-50 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 dark:via-slate-950/90 to-transparent">
        <button 
          onClick={handleSave} 
          className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs"
        >
          <span className="material-symbols-outlined">rocket_launch</span>
          Lanzar Proyecto
        </button>
      </div>
    </div>
  );
};
