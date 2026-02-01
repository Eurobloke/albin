
import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { Client } from '../types';

interface ClientsHistoryPageProps {
  archivedClients: Client[];
  onDeleteHistory?: (id: number) => void;
}

const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmG8hGr-zbMEUw4_XqO0tksMNayStHx_v-Z7VL76ULi6d8hhlYSRDhtmtIuWZm6c6OUuL6z3WiTSmCgE43moWXPGn32DpJ-cwCjb3G8mpiJHrkHNygIFcIKGWQG_jLf7khHnYUrSpX6EgHFOnlZnZQEWYFiNFi2SBTIXwuqrRgLo43v0K5s2S2b69Gm-wK4p7SIdSR2UAY9HA3p74Ff8luS_XM0c0s177RPLxnTJfPW-VG_H8V0gzm1wWBKXx_9jdDPyfnHYLF_A";

const ClientsHistoryPage: React.FC<ClientsHistoryPageProps> = ({ archivedClients, onDeleteHistory }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Client | null>(null);
  
  const filtered = archivedClients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.desc.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', currency: 'COP', maximumFractionDigits: 0 
  }).format(val);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (client: Client) => {
    const message = `🏢 *CERTIFICADO DE OBRA HARMONY GLASS*\n\nEstimado cliente *${client.name}*,\nAdjuntamos la factura final de su proyecto: *${client.desc}*.\n\n💰 *Inversión Total:* ${formatCurrency(client.total)}\n✅ *Estado:* TOTALMENTE PAGADO (ITBIS Incl.)\n\n_Gracias por elegir la calidad de Harmony Glass._`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Factura Harmony Glass',
          text: message,
          url: window.location.href
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      const wpUrl = `https://wa.me/${client.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(message)}`;
      window.open(wpUrl, '_blank');
    }
  };

  return (
    <div className="pb-40 min-h-screen bg-slate-50 dark:bg-[#020617] relative overflow-x-hidden print:bg-white">
      <style>{`
        @media print {
          @page { margin: 1cm; }
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 0;
            margin: 0;
            background: white !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print">
        <AppHeader />
        
        <div className="px-6 mt-10">
          <div className="relative group max-w-2xl mx-auto">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">search</span>
            <input 
              className="w-full h-14 bg-white dark:bg-slate-800 border-none rounded-[2rem] pl-14 pr-6 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium shadow-xl shadow-slate-200/50 dark:shadow-none" 
              placeholder="Buscar por cliente o ubicación..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="px-6 mt-12 animate-fade-up no-print max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10 px-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">Obras Entregadas</h2>
          <div className="flex items-center gap-3">
             <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} Registros</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client, i) => {
            const isExpanded = expandedId === client.id;
            const abonoReal = client.abonoTotal || (client.total * (parseInt(client.pct) / 100));
            const totalSpent = client.expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
            const profit = abonoReal - totalSpent;

            return (
              <div key={client.id} className="glass-card rounded-[3rem] p-8 animate-slide-in border-t-8 border-t-slate-900 dark:border-t-slate-700 hover:translate-y-[-5px] transition-all" style={{animationDelay: `${i * 0.05}s`}}>
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1.5">
                    <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">{client.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs text-primary">location_on</span> {client.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedInvoice(client)}
                    className="size-14 bg-primary text-white rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                  >
                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                  </button>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inversión</span>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">{formatCurrency(client.total)}</p>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-white/5"></div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cierre de Caja</span>
                    <p className={`${profit >= 0 ? 'text-green-500' : 'text-harmony-red'} font-black text-sm`}>
                      {formatCurrency(profit)}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setExpandedId(isExpanded ? null : client.id)}
                  className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">{isExpanded ? 'expand_less' : 'format_list_bulleted'}</span>
                  {isExpanded ? 'Cerrar Detalles' : 'Ver Detalle Obra'}
                </button>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 space-y-3 animate-fade-in">
                    {client.expenses?.map(exp => (
                      <div key={exp.id} className="flex justify-between items-center text-[10px] py-2">
                        <span className="font-bold text-slate-500 uppercase flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">label</span> {exp.item}
                        </span>
                        <span className="font-black text-harmony-red">-{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL DE FACTURA "MASTER HARMONY" */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="w-full max-w-4xl bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-up my-8">
            {/* Toolbar Modal */}
            <div className="px-12 py-8 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center no-print">
              <button onClick={() => setSelectedInvoice(null)} className="flex items-center gap-3 font-black text-[11px] uppercase text-slate-400 hover:text-slate-900 transition-colors group">
                <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">close</span> Cerrar Factura
              </button>
              <div className="flex gap-4">
                <button onClick={() => handleShare(selectedInvoice)} className="h-14 px-8 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black shadow-lg">
                  <span className="material-symbols-outlined">send</span> Compartir
                </button>
                <button onClick={handlePrint} className="h-14 px-8 bg-primary text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-2xl">print</span> Imprimir / PDF
                </button>
              </div>
            </div>

            {/* CONTENIDO DE FACTURA PREMIUM */}
            <div id="invoice-content" className="p-20 bg-white text-slate-900 relative">
              {/* Marca de Agua Estética */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
                <img src={LOGO_URL} alt="" className="w-[600px]" />
              </div>

              {/* Cabecera Corporativa */}
              <div className="flex justify-between items-start mb-24 relative">
                <div className="flex items-center gap-10">
                  <div className="size-36 bg-white border-2 border-slate-50 rounded-[3rem] p-5 shadow-2xl">
                    <img src={LOGO_URL} alt="Harmony Glass" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.85]">
                      <span className="text-primary">HARMONY</span><br/>
                      <span className="text-harmony-red">GLASS</span>
                    </h1>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mt-5">Sistemas de Alta Precisión</p>
                    <div className="mt-4 space-y-1">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NIT: 900.XXX.XXX-X</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medellín, Colombia</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-10 py-3 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] mb-6 shadow-2xl">
                    FACTURA OFICIAL
                  </div>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">DOCUMENTO No: <span className="text-primary">#HG-{selectedInvoice.id.toString().slice(-6)}</span></p>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">{new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Bloque de Información Cliente */}
              <div className="grid grid-cols-2 gap-20 mb-24 relative">
                <div className="space-y-8">
                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Información del Cliente</h3>
                    <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">{selectedInvoice.name}</p>
                    <p className="text-sm text-slate-500 font-bold uppercase mt-3 tracking-widest">Ubicación: {selectedInvoice.desc}</p>
                    <p className="text-sm text-slate-500 font-bold mt-1">Teléfono: {selectedInvoice.phone || 'No registrado'}</p>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-[3.5rem] p-12 border-2 border-primary/10 relative overflow-hidden flex flex-col items-center justify-center text-center">
                  <div className="relative z-10">
                    <div className="size-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl">
                      <span className="material-symbols-outlined text-4xl">verified_user</span>
                    </div>
                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-2">Estado de Transacción</h3>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">PAGO RECIBIDO</p>
                    <p className="text-[10px] text-primary font-black uppercase mt-3 tracking-[0.3em]">Cero Deudas Pendientes</p>
                  </div>
                  <div className="absolute -right-10 -bottom-10 size-48 bg-primary/10 rounded-full blur-[60px]"></div>
                </div>
              </div>

              {/* Tabla de Conceptos Técnica */}
              <div className="mb-24 relative">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-slate-900">
                      <th className="text-left py-6 text-[13px] font-black uppercase tracking-[0.3em]">Detalle de Servicios Técnicos</th>
                      <th className="text-right py-6 text-[13px] font-black uppercase tracking-[0.3em]">Monto Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-14 pr-10">
                        <p className="text-2xl font-black text-slate-900 uppercase leading-none mb-4">Instalación y Obra en {selectedInvoice.desc}</p>
                        <p className="text-sm text-slate-400 font-bold uppercase italic leading-relaxed max-w-xl opacity-80">
                          Suministro e instalación de sistemas de carpintería en aluminio y vidrio de alta seguridad. 
                          Mano de obra certificada bajo estándares de calidad Harmony Glass.
                        </p>
                      </td>
                      <td className="py-14 text-right align-top">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(selectedInvoice.total)}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totales y Liquidación */}
              <div className="flex justify-between items-end relative">
                <div className="max-w-md space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <h4 className="text-[11px] font-black uppercase mb-3 tracking-[0.2em] text-primary flex items-center gap-2">
                       <span className="material-symbols-outlined text-lg">policy</span> Certificado de Garantía
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-loose">
                      Harmony Glass garantiza todos sus productos por un periodo de 3 meses únicamente contra defectos de fábrica. 
                      Este documento es el único comprobante legal para cualquier reclamación técnica.
                    </p>
                  </div>
                </div>
                <div className="w-96">
                  <div className="space-y-4 mb-16">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                      <span>ITBIS (0%)</span>
                      <span>$ 0</span>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t-2 border-slate-900">
                      <span className="text-base font-black uppercase tracking-[0.4em]">Total Cobrado</span>
                      <span className="text-4xl font-black text-primary tracking-tighter">{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-24 text-center">
                    <div className="h-px bg-slate-900 mb-5 opacity-30"></div>
                    <p className="text-[12px] font-black uppercase tracking-[0.4em]">Dirección Técnica</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black mt-2 tracking-[0.5em]">Harmony Glass Quality Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="no-print">
        <BottomNav />
      </div>
    </div>
  );
};

export default ClientsHistoryPage;
