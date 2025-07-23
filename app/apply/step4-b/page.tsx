// @ts-nocheck
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step4b() {
  const router = useRouter();
  const [visitedIsrael, setVisitedIsrael] = useState('');
  const [recentVisitYear, setRecentVisitYear] = useState('');
  const [appliedVisa, setAppliedVisa] = useState('');
  const [visaDetails, setVisaDetails] = useState('');
  const [loading, setLoading] = useState(false);

  // Validación básica para continuar
  const allValid =
    visitedIsrael &&
    (visitedIsrael === 'No' || recentVisitYear) &&
    appliedVisa &&
    (appliedVisa === 'No' || visaDetails);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!allValid) {
      alert('Por favor completá todos los campos obligatorios.');
      return;
    }
    setLoading(true);

    const id = localStorage.getItem('etaIlId');
    const body = {
      id,
      visitedIsrael,
      recentVisitYear: visitedIsrael === 'Sí' ? recentVisitYear : null,
      appliedVisa,
      visaDetails: appliedVisa === 'Sí' ? visaDetails : null,
    };

    try {
      const res = await fetch('/api/migratory-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorRes = await res.json().catch(() => ({}));
        alert(errorRes.error || 'Ocurrió un error guardando los datos.');
        setLoading(false);
        return;
      }
      router.push('/apply/step-5');
    } catch (e) {
      alert("Error de red. Reintentá.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/apply/step4');
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA‑IL</div>
        <Link href="/" className="underline hover:text-gray-200">
          Inicio
        </Link>
      </nav>

      {/* Barra de pasos */}
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium">
          <span>Disclaimers</span>
          <span className="text-blue-900">Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span className="text-blue-900">Historial migratorio</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[84%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      <form
        onSubmit={handleNext}
        className="max-w-3xl w-full mx-auto bg-white shadow-lg rounded-xl px-8 py-10 my-10"
      >
        <h1 className="text-4xl font-extrabold text-[#19396c] mb-4">Historial migratorio</h1>
        <p className="text-red-600 mb-6 text-sm">
          Los campos marcados con <span className="font-bold">*</span> son obligatorios.
        </p>
        <div className="border-l-4 border-orange-300 pl-4 mb-8">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">¿Visitaste Israel anteriormente? <span className="text-red-500">*</span></h2>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setVisitedIsrael('No')}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                visitedIsrael === 'No'
                  ? 'bg-blue-950 text-white border-blue-950'
                  : 'border-blue-950 text-blue-950 bg-white'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setVisitedIsrael('Sí')}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                visitedIsrael === 'Sí'
                  ? 'bg-blue-950 text-white border-blue-950'
                  : 'border-blue-950 text-blue-950 bg-white'
              }`}
            >
              Sí
            </button>
          </div>
          {visitedIsrael === 'Sí' && (
            <div className="mb-4">
              <label className="block mb-1 text-[#19396c] font-semibold">
                ¿En qué año fue tu visita más reciente? <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="recentVisitYear"
                placeholder="AAAA"
                value={recentVisitYear}
                onChange={e => setRecentVisitYear(e.target.value)}
                className="w-40 border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                min={1950}
                max={new Date().getFullYear()}
                required
              />
            </div>
          )}
        </div>

        <div className="border-l-4 border-orange-300 pl-4 mb-8">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">
            ¿Alguna vez solicitaste una visa israelí, ETA-IL o un permiso para visitar, vivir, trabajar o estudiar en Israel? <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setAppliedVisa('No')}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                appliedVisa === 'No'
                  ? 'bg-blue-950 text-white border-blue-950'
                  : 'border-blue-950 text-blue-950 bg-white'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setAppliedVisa('Sí')}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                appliedVisa === 'Sí'
                  ? 'bg-blue-950 text-white border-blue-950'
                  : 'border-blue-950 text-blue-950 bg-white'
              }`}
            >
              Sí
            </button>
          </div>
          {appliedVisa === 'Sí' && (
            <div className="mb-4">
              <label className="block mb-1 text-[#19396c] font-semibold">
                ¿Qué solicitaste? Contanos sobre tu solicitud <span className="text-red-500">*</span>
              </label>
              <textarea
                name="visaDetails"
                rows={3}
                placeholder="Describí qué tipo de visa, permiso o ETA-IL solicitaste y en qué año"
                value={visaDetails}
                onChange={e => setVisaDetails(e.target.value)}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="px-8 py-3 rounded-full border border-[#19396c] text-[#19396c] font-bold text-lg hover:bg-blue-50"
            onClick={handleBack}
            disabled={loading}
          >
            ← Volver
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#19396c] text-white font-bold text-lg hover:bg-[#162a4f] transition"
            disabled={!allValid || loading}
          >
            {loading ? 'Guardando...' : 'Siguiente →'}
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">🔒 Tu información se transmite encriptada y es revisada por profesionales en viajes internacionales.</div>
        <div className="mb-2">
          * Este sitio no pertenece al gobierno de Israel. Brindamos asistencia para gestionar tu solicitud ETA-IL de manera independiente.
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA‑IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  )
}
