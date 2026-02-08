// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setApps(data.data);
      })
      .catch(err => console.error("Error al cargar aplicaciones:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Helper para los colores de las etiquetas de estado (Mantenido y actualizado)
  const getStatusStyle = (status) => {
    switch (status) {
      case 'APROBADA': return 'bg-green-100 text-green-800 border-green-200';
      case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-200';
      case 'CARGADO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EN REVISION': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return (
    <div className="p-10 text-center text-gray-500 font-bold animate-pulse uppercase tracking-widest">
      Cargando listado...
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      {/* ✅ NAVBAR UNIFICADO CON LINK A DASHBOARD */}
      <nav className="bg-blue-950 text-white py-4 px-8 flex justify-between items-center shadow-lg mb-8">
        <div className="flex items-center gap-8">
          <div className="text-xl font-black tracking-tighter">ETA-IL <span className="text-blue-400">ADMIN</span></div>
          <div className="flex gap-6">
            <Link href="/admin" className="text-sm font-bold border-b-2 border-blue-400 transition uppercase tracking-wider">
              Permisos
            </Link>
            <Link href="/admin/dashboard" className="text-sm font-bold text-gray-300 hover:text-white transition uppercase tracking-wider">
              Dashboard
            </Link>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-bold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition uppercase tracking-wider"
        >
          Cerrar Sesión
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pb-20">
        {/* Header de la sección */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tight">Gestión de Solicitudes</h1>
            <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Listado de permisos registrados</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200 text-center">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Registros</span>
            <span className="text-2xl font-black text-blue-950">{apps.length}</span>
          </div>
        </div>

        {/* Tabla de Aplicaciones */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Fecha / Ref</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Viajero</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Pasaporte</th>
                <th className="px-6 py-5 text-center text-xs font-black text-gray-500 uppercase tracking-widest">FC</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {apps.map((app: any) => (
                <tr key={app._id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{new Date(app.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">#{app._id.substring(app._id.length - 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-black text-blue-950 uppercase group-hover:text-blue-700">
                      {app.passport?.surname || 'S/A'}, {app.passport?.name || 'S/N'}
                    </div>
                    <div className="text-[11px] text-gray-500 italic lowercase">{app.contactEmail || "Sin email registrado"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-700">{app.passport?.number || "---"}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{app.passport?.country || "---"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg transition shadow-sm ${app.fc === 'Sí' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {app.fc === 'Sí' ? 'SÍ' : 'NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-4 py-1.5 inline-flex text-[10px] leading-5 font-black rounded-full border shadow-sm ${getStatusStyle(app.status || 'PENDIENTE')}`}>
                      {app.status || "PENDIENTE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/${app._id}`}
                      className="bg-blue-950 text-white hover:bg-blue-800 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all shadow-md active:scale-95 uppercase tracking-widest"
                    >
                      Gestionar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {apps.length === 0 && (
            <div className="p-24 text-center">
              <div className="text-5xl mb-6">📂</div>
              <div className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">No hay solicitudes para mostrar en este momento</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer del Panel */}
      <footer className="max-w-7xl mx-auto px-8 py-10 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Sistema de Gestión Interna • {new Date().getFullYear()} • ETA-IL ADMIN PANEL
        </p>
      </footer>
    </main>
  );
}