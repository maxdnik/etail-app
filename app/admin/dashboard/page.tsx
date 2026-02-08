// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminStatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setStats(data.stats);
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 font-bold animate-pulse uppercase tracking-widest">
          Cargando Estadísticas...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-950 text-white py-4 px-8 flex justify-between items-center shadow-lg mb-8">
        <div className="flex items-center gap-8">
          <div className="text-xl font-black tracking-tighter">ETA-IL <span className="text-blue-400">ADMIN</span></div>
          <Link href="/admin" className="text-sm font-bold hover:text-blue-300 transition uppercase tracking-wider">
            Permisos
          </Link>
          <Link href="/admin/dashboard" className="text-sm font-bold border-b-2 border-blue-400 transition uppercase tracking-wider">
            Dashboard
          </Link>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition uppercase">
          Cerrar Sesión
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pb-20">
        <h1 className="text-3xl font-black text-blue-950 mb-8 uppercase tracking-tight">Balance de Gestión (Solo Cargados)</h1>

        {/* SECCIÓN 1: CANTIDAD DE PERMISOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Cargados Hoy" value={stats.qty.day} sub="Gestiones finalizadas" color="blue" />
          <StatCard title="Cargados esta Semana" value={stats.qty.week} sub="Gestiones finalizadas" color="blue" />
          <StatCard title="Cargados este Mes" value={stats.qty.month} sub="Gestiones finalizadas" color="blue" />
        </div>

        {/* SECCIÓN 2: INGRESOS POR CARGADOS */}
        <h2 className="text-xl font-black text-blue-950 mb-4 uppercase tracking-tight flex items-center gap-2">
            <span className="bg-green-600 text-white p-1 rounded text-xs font-bold">USD</span> Ingresos Netos (Por Cargados)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Ingresos Hoy" value={`$${stats.income.day}`} sub="Facturación real" color="green" />
          <StatCard title="Ingresos Semana" value={`$${stats.income.week}`} sub="Facturación real" color="green" />
          <StatCard title="Ingresos Mes" value={`$${stats.income.month}`} sub="Facturación real" color="green" />
        </div>

        {/* ✅ NUEVA SECCIÓN: HISTORIAL MES A MES */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
            <h3 className="text-lg font-black text-blue-950 mb-6 uppercase">Historial Mensual</h3>
            <div className="space-y-6">
                {stats.history.map((m, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-gray-600">{m.label}</span>
                            <span className="text-sm font-black text-blue-950">{m.qty} Permisos - <span className="text-green-600">${m.income}</span></span>
                        </div>
                        {/* Barra visual simple */}
                        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                            <div 
                                className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min((m.qty / (stats.qty.total || 1)) * 100 + 5, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
                {stats.history.length === 0 && <p className="text-gray-400 italic">No hay historial de meses anteriores.</p>}
            </div>
        </div>

        {/* TOTAL HISTÓRICO */}
        <div className="bg-blue-950 rounded-3xl p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl border-b-8 border-green-500">
            <div>
                <h3 className="text-blue-300 font-bold uppercase tracking-widest text-xs mb-2">Total Histórico Cargado</h3>
                <p className="text-6xl font-black">${stats.income.total}</p>
            </div>
            <div className="text-right mt-6 md:mt-0">
                <p className="text-5xl font-light">{stats.qty.total}</p>
                <span className="text-xs font-bold uppercase opacity-50 tracking-tighter">Total Permisos con estado CARGADO</span>
            </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, sub, color }) {
  const borderCol = color === "blue" ? "border-blue-600" : "border-green-600";
  const textCol = color === "blue" ? "text-blue-900" : "text-green-700";

  return (
    <div className={`bg-white p-8 rounded-2xl shadow-sm border-t-4 ${borderCol} flex flex-col`}>
      <span className="text-gray-400 font-bold uppercase text-[10px] mb-1 tracking-widest">{title}</span>
      <span className={`text-4xl font-black mb-1 ${textCol}`}>{value}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{sub}</span>
    </div>
  );
}