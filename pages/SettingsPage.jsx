import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import BottomNav from '../components/BottomNav.jsx';

const SettingsPage = ({ onLogout, role }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [biometric, setBiometric] = useState(() => localStorage.getItem('harmony_biometric') === 'true');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipeConfirmText, setWipeConfirmText] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleBiometric = () => {
    const newVal = !biometric;
    setBiometric(newVal);
    localStorage.setItem('harmony_biometric', String(newVal));
  };

  const confirmLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleWipeData = () => {
    if (role !== 'admin' || wipeConfirmText !== 'ELIMINAR') return;
    localStorage.removeItem('harmony_glass_clients_v4');
    localStorage.removeItem('harmony_glass_history_v4');
    alert("Base de datos restablecida con éxito.");
    window.location.reload();
  };

  return (
    <div className="pb-40 bg-slate-50 dark:bg-[#020617] min-h-screen relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] size-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <AppHeader />

      <main className="px-6 mt-10 animate-fade-up">
        <div className="glass-card rounded-[2.5rem] p-8 space-y-6 mb-8 border-l-8 border-l-primary">
          <div className="flex items-center gap-5">
            <div className={`size-20 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl border border-white/20 ${role === 'admin' ? 'bg-primary shadow-primary/40' : 'bg-amber-500 shadow-amber-500/40'}`}>
              {role === 'admin' ? 'AD' : 'JO'}
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                {role === 'admin' ? 'Administrador Pro' : 'Johan / Operativo'}
              </h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                Estado: Conectado como {role.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-4">Seguridad y Preferencias</h3>
        <div className="glass-card rounded-[2.5rem] overflow-hidden space-y-0 shadow-xl mb-10">
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-2xl">contrast</span>
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">Modo Noche</span>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 rounded-full transition-all duration-500 relative ${darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
            >
              <div className={`absolute top-1 size-5 rounded-full bg-white shadow-md transition-all duration-500 ${darkMode ? 'left-8' : 'left-1'}`}></div>
            </button>
          </div>
          
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-2xl">fingerprint</span>
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">Acceso Biométrico</span>
            </div>
            <button 
              onClick={toggleBiometric}
              className={`w-14 h-7 rounded-full transition-all duration-500 relative ${biometric ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
            >
              <div className={`absolute top-1 size-5 rounded-full bg-white shadow-md transition-all duration-500 ${biometric ? 'left-8' : 'left-1'}`}></div>
            </button>
          </div>

          {role === 'admin' && (
            <div 
              onClick={() => setShowWipeModal(true)}
              className="p-6 flex items-center justify-between hover:bg-red-500/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-harmony-red text-2xl">database_off</span>
                <span className="text-sm font-black text-harmony-red">Restablecer Sistema</span>
              </div>
              <span className="text-[8px] font-black text-slate-400 group-hover:text-harmony-red transition-colors uppercase tracking-widest">WIPE DATA</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full h-16 bg-red-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Cerrar Sesión
        </button>

        <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-12 mb-8">
          Harmony Glass Security v2.5.0
        </p>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 space-y-6 animate-fade-up border-b-8 border-b-primary">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shadow-glow-blue">
                <span className="material-symbols-outlined text-4xl">power_settings_new</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Cerrar Sesión</h4>
                <p className="text-xs text-slate-500 font-bold">¿Deseas salir de Harmony Glass y volver a la pantalla de acceso?</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">Cancelar</button>
              <button onClick={confirmLogout} className="flex-[1.5] h-14 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">Sí, Salir</button>
            </div>
          </div>
        </div>
      )}

      {showWipeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 space-y-6 animate-fade-up border-t-8 border-t-harmony-red">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 border border-red-600/20">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase">Acción Crítica</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-4">Esta acción borrará todos los proyectos, historial y gastos de empresa. Escribe <span className="text-red-600 font-black">ELIMINAR</span> para confirmar.</p>
            </div>
            
            <input 
              className="w-full h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 text-center text-sm font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-red-500/50"
              placeholder="Escribe aquí..."
              value={wipeConfirmText}
              onChange={(e) => setWipeConfirmText(e.target.value.toUpperCase())}
            />

            <div className="flex gap-4">
              <button onClick={() => { setShowWipeModal(false); setWipeConfirmText(''); }} className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase text-slate-500">Volver</button>
              <button 
                onClick={handleWipeData}
                disabled={wipeConfirmText !== 'ELIMINAR'}
                className={`flex-[1.5] h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${wipeConfirmText === 'ELIMINAR' ? 'bg-red-600 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Borrar Todo
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};
