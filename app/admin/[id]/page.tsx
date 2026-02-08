// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Etiquetas originales ---
  const REPRESENTATIVE_LABELS = {
    surname: "Apellido", name: "Nombre", docNumber: "Pasaporte / ID", country: "País de emisión", phone: "Teléfono de contacto",
  };

  const PASSPORT_LABELS = {
    docType: "Tipo de documento", number: "Número de pasaporte", passportNumber: "Número de pasaporte (alt)",
    country: "País de emisión", countryCode: "Código País", nationality: "Nacionalidad", biometric: "¿Pasaporte biométrico?",
    surname: "Apellido", name: "Nombre/s", givenName: "Nombre/s (alt)", issueDate: "Fecha de emisión",
    expiryDate: "Fecha de vencimiento", birthDate: "Fecha de nacimiento", birthCountry: "Lugar de nacimiento", gender: "Género",
  };

  const PERSONAL_LABELS = {
    nacionalidadAdicional: "Otra nacionalidad", numeroIdIsrael: "ID Israelí", estadoCivil: "Estado civil",
    padreNombre: "Nombre del padre", padreApellido: "Apellido del padre", madreNombre: "Nombre de la madre",
    madreApellido: "Apellido de la madre", telefonoMovil: "Móvil", telefonoAdicional: "Teléfono Alt.",
    domicilioPais: "País Domicilio", domicilioCiudad: "Ciudad Domicilio", ocupacion: "Ocupación",
    orgNombre: "Empresa", puesto: "Puesto", telefonoTrabajo: "Tel. Trabajo", emailTrabajo: "Email Trabajo",
  };

  const MIGRATORY_LABELS = {
    visitedIsrael: "¿Visitó Israel?", recentVisitYear: "Año última visita", appliedVisa: "¿Solicitó Visa/ETA?", visaDetails: "Detalles Visa"
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/applications/${id}`)
      .then((res) => res.json())
      .then((json) => { if (json.ok) setData(json.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fc: data.fc || "No", 
          status: data.status || "PENDIENTE" 
        }),
      });
      const json = await res.json();
      if (json.ok) {
        alert("Cambios guardados correctamente.");
        setData(json.data);
      }
    } catch (err) {
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) return <div className="p-10 text-center text-gray-600">Cargando detalles...</div>;
  if (!data) return <div className="p-10 text-center text-red-500 font-bold">Solicitud no encontrada.</div>;

  const SectionCard = ({ title, obj, labels }: { title: string, obj: any, labels?: Record<string, string> }) => {
    if (!obj || Object.keys(obj).length === 0) return null;
    const content = labels 
      ? Object.entries(labels).map(([key, label]) => {
          const val = obj[key];
          if (!val) return null;
          return (
            <div key={key} className="border-b border-gray-100 pb-2">
              <span className="text-xs text-gray-500 uppercase block font-semibold">{label}</span>
              <span className="font-medium text-gray-800">{String(val)}</span>
            </div>
          );
        })
      : Object.entries(obj).map(([key, val]) => (
          <div key={key} className="border-b border-gray-100 pb-2">
            <span className="text-xs text-gray-500 uppercase block font-semibold">{key}</span>
            <span className="font-medium text-gray-800">{String(val)}</span>
          </div>
        ));

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="bg-blue-950 px-6 py-3"><h3 className="text-lg font-bold text-white">{title}</h3></div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">{content}</div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      {/* ✅ NAVBAR NUEVO */}
      <nav className="bg-blue-950 text-white py-4 px-8 flex justify-between items-center shadow-lg mb-8">
        <div className="flex items-center gap-8">
          <div className="text-xl font-black tracking-tighter">ETA-IL <span className="text-blue-400">ADMIN</span></div>
          <Link href="/admin" className="text-sm font-bold hover:text-blue-300 transition uppercase tracking-wider">
            Permisos
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-bold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition uppercase"
        >
          Cerrar Sesión
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pb-20">
        {/* Header con Botón de Guardar (Sin "Volver") */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-blue-950 uppercase">
                    {data.passport?.surname || "S/A"}, {data.passport?.name || "S/N"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{data._id}</span></p>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-10 py-3 rounded-full shadow-lg hover:bg-blue-700 font-black transition transform active:scale-95 disabled:opacity-50"
            >
              {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            </button>
        </div>

        {/* Controles de Administración */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-xl shadow-sm">
                <h4 className="text-orange-800 font-bold uppercase text-[10px]">Email de contacto:</h4>
                <p className="text-sm font-bold text-gray-900 break-all">{data.contactEmail || "No especificado"}</p>
            </div>

            <div className="bg-white border-l-4 border-purple-600 p-4 rounded-r-xl shadow-sm">
                <h4 className="text-purple-800 font-bold uppercase text-[10px]">Estado de Gestión:</h4>
                <select 
                  value={data.status || "PENDIENTE"}
                  onChange={(e) => setData({...data, status: e.target.value})}
                  className="w-full bg-transparent font-bold text-sm outline-none mt-1"
                >
                  <option value="PENDIENTE">⏳ PENDIENTE</option>
                  <option value="EN REVISION">🔍 EN REVISIÓN</option>
                  <option value="CARGADO">✅ CARGADO</option>
                  <option value="APROBADA">✔️ APROBADA</option>
                  <option value="RECHAZADA">❌ RECHAZADA</option>
                </select>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-4 rounded-r-xl shadow-sm flex items-center justify-between">
                <div>
                    <h4 className="text-blue-800 font-bold uppercase text-[10px]">FC (Facturación):</h4>
                    <p className={`font-black ${data.fc === "Sí" ? "text-green-600" : "text-gray-400"}`}>{data.fc || "No"}</p>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => setData({...data, fc: "Sí"})} className={`px-3 py-1 rounded text-[10px] font-bold ${data.fc === "Sí" ? "bg-green-600 text-white" : "bg-gray-100"}`}>SÍ</button>
                    <button onClick={() => setData({...data, fc: "No"})} className={`px-3 py-1 rounded text-[10px] font-bold ${data.fc === "No" ? "bg-red-600 text-white" : "bg-gray-100"}`}>NO</button>
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6">
            {data.applicantType === "representative" && (
              <SectionCard title="Datos del Representante" obj={data.representative} labels={REPRESENTATIVE_LABELS} />
            )}
            <SectionCard title="Información de Viaje" obj={data.travel} />
            <SectionCard title="Datos del Pasaporte" obj={data.passport} labels={PASSPORT_LABELS} />
            <SectionCard title="Datos Personales" obj={data.personal} labels={PERSONAL_LABELS} />
            <SectionCard title="Historial Migratorio" obj={data.migratory} labels={MIGRATORY_LABELS} />
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                <div className="bg-blue-950 px-6 py-3"><h3 className="text-lg font-bold text-white">Estado de la Declaración</h3></div>
                <div className="p-6">
                    <div className={`px-4 py-2 rounded-lg border font-bold text-lg inline-block ${data.declaration?.confirmed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {data.declaration?.confirmed ? "✔️ DECLARACIÓN CONFIRMADA" : "❌ NO CONFIRMADA"}
                    </div>
                </div>
            </div>

            <div className="text-xs text-gray-400 text-center mt-8 pb-10">
                Creado: {new Date(data.createdAt).toLocaleString()} | Última actualización: {new Date(data.updatedAt).toLocaleString()}
            </div>
        </div>
      </div>
    </main>
  );
}