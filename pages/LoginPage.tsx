
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmG8hGr-zbMEUw4_XqO0tksMNayStHx_v-Z7VL76ULi6d8hhlYSRDhtmtIuWZm6c6OUuL6z3WiTSmCgE43moWXPGn32DpJ-cwCjb3G8mpiJHrkHNygIFcIKGWQG_jLf7khHnYUrSpX6EgHFOnlZnZQEWYFiNFi2SBTIXwuqrRgLo43v0K5s2S2b69Gm-wK4p7SIdSR2UAY9HA3p74Ff8luS_XM0c0s177RPLxnTJfPW-VG_H8V0gzm1wWBKXx_9jdDPyfnHYLF_A";

interface LoginPageProps {
  onLogin: (role: 'admin' | 'basic', username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const biometricEnabled = localStorage.getItem('harmony_biometric') === 'true';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const username = user.toLowerCase().trim();
    const password = pin.toLowerCase().trim();

    let role: 'admin' | 'basic' | null = null;
    let finalName = username;

    // Credenciales de administrador
    if (username === 'admin' && password === '1989') {
      role = 'admin';
      finalName = 'admin';
    } 
    // Credenciales de usuario básico (lector original)
    else if (username === 'lector' && password === '1234') {
      role = 'basic';
      finalName = 'lector';
    }
    // Nueva credencial de usuario básico solicitado: johan / 1111
    else if (username === 'johan' && password === '1111') {
      role = 'basic';
      finalName = 'johan';
    }

    if (role) {
      if (biometricEnabled) {
        startBiometricScan(role, finalName);
      } else {
        onLogin(role, finalName);
        navigate('/dashboard');
      }
    } else {
      setError("Usuario o PIN incorrecto");
    }
  };

  const startBiometricScan = (role: 'admin' | 'basic', name: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setScanComplete(true);
      setTimeout(() => {
        onLogin(role, name);
        navigate('/dashboard');
      }, 800);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center px-8 overflow-hidden">
      <div className="absolute top-[-100px] right-[-50px] size-[400px] bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-100px] left-[-50px] size-[400px] bg-harmony-red/20 rounded-full blur-[100px]"></div>

      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
          <div className="relative size-40 flex items-center justify-center">
            <div className={`absolute inset-0 border-4 border-primary/20 rounded-full ${!scanComplete ? 'animate-spin border-t-primary' : 'border-green-500'}`}></div>
            <span className={`material-symbols-outlined text-6xl transition-all duration-500 ${scanComplete ? 'text-green-500 scale-125' : 'text-primary animate-pulse'}`}>
              {scanComplete ? 'check_circle' : 'fingerprint'}
            </span>
          </div>
          <h2 className="mt-8 text-xl font-black uppercase tracking-[0.3em]">
            {scanComplete ? 'Identidad Verificada' : 'Escaneando Biometría'}
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Iniciando sesión segura...</p>
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col items-center animate-fade-up z-10">
        <div className="size-24 mb-6 bg-white rounded-3xl p-3 shadow-2xl flex items-center justify-center border border-slate-100">
          <img alt="Harmony" className="h-full w-full object-contain" src={LOGO_URL}/>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
          <span className="text-primary">HARMONY</span> <span className="text-harmony-red">GLASS</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase italic mb-12">Security Access</p>

        <form className="glass-card w-full rounded-[2.5rem] p-8 space-y-6 shadow-2xl" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-[10px] font-bold p-3 rounded-xl text-center uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Usuario</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">person</span>
              <input 
                className="w-full h-14 bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" 
                placeholder="usuario" 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Clave</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
              <input 
                className="w-full h-14 bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all tracking-[0.2em]" 
                placeholder="••••" 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>

          <button 
            className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4" 
            type="submit"
          >
            <span>Ingresar al Sistema</span>
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-2">
          {biometricEnabled && (
            <p className="text-primary text-[9px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <span className="material-symbols-outlined text-xs">fingerprint</span> 
              Biometría Activa
            </p>
          )}
          <p className="text-slate-600 text-[8px] uppercase tracking-[0.4em] mt-4 opacity-50 font-black">Powered by Harmony Tech</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
