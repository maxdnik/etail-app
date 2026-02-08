'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const travelPurposes = [
  'Turismo',
  'Negocios',
  'Visita a familiares/amigos',
  'Tránsito',
  'Otros',
];

const stayDurations = [
  'Menos de 7 días',
  '7-14 días',
  '15-30 días',
  '31-60 días',
  '61-90 días (máx. permitido)',
];

type EtaIlDraft = {
  travel?: {
    purpose?: string;
    arrival?: string; // YYYY-MM-DD
    stay?: string;
  };
  [key: string]: any;
};

export default function TravelInfo() {
  const router = useRouter();
  const [purpose, setPurpose] = useState('');
  const [arrival, setArrival] = useState({ day: '', month: '', year: '' });
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const allValid =
    purpose &&
    arrival.day.length === 2 &&
    arrival.month.length === 2 &&
    arrival.year.length === 4 &&
    duration;

  // Guarda en localStorage SIN backend (merge simple)
  const updateDraft = (partial: Partial<EtaIlDraft>) => {
    try {
      const prev: EtaIlDraft = JSON.parse(localStorage.getItem('etaIlDraft') || '{}');
      const next: EtaIlDraft = {
        ...prev,
        ...partial,
        travel: {
          ...(prev.travel || {}),
          ...(partial.travel || {}),
        },
      };
      localStorage.setItem('etaIlDraft', JSON.stringify(next));
    } catch {
      // noop
    }
  };

  // Precarga desde draft (si existe)
  useEffect(() => {
    try {
      const d: EtaIlDraft = JSON.parse(localStorage.getItem('etaIlDraft') || '{}');

      if (d?.travel?.purpose) setPurpose(d.travel.purpose);

      if (d?.travel?.arrival) {
        const [yy, mm, dd] = String(d.travel.arrival).split('-');
        setArrival({
          day: dd || '',
          month: mm || '',
          year: yy || '',
        });
      }

      if (d?.travel?.stay) setDuration(d.travel.stay);
    } catch {
      // noop
    }
  }, []);

  const handleNext = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const arrivalStr = `${arrival.year}-${arrival.month}-${arrival.day}`; // formato simple

    setLoading(true);
    try {
      updateDraft({
        travel: {
          purpose,
          arrival: arrivalStr,
          stay: duration,
        },
      });

      router.push('/apply/step-3');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">
          Inicio
        </Link>
      </nav>

      {/* Barra de progreso */}
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium overflow-x-auto">
          <span>Disclaimers</span>
          <span className="text-blue-900">Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          {/* 32% = step 2 */}
          <div className="w-[32%] h-full bg-blue-950 rounded-full transition-all duration-300"></div>
        </div>
      </section>

      {/* Formulario centrado */}
      <div className="flex-1 flex justify-center items-center">
        <form
          onSubmit={handleNext}
          className="bg-white shadow-lg rounded-2xl p-10 max-w-2xl w-full border border-gray-200"
        >
          <h1 className="text-4xl font-extrabold text-[#19396c] mb-1">Información de viaje</h1>
          <p className="text-sm text-gray-600 mb-7">
            Campos obligatorios (<span className="text-red-500">*</span>)
          </p>

          <div className="mb-7">
            <label className="block font-bold text-[#19396c] mb-2 text-lg">
              ¿Cuál es el motivo principal de tu viaje? <span className="text-red-500">*</span>
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border-2 border-[#19396c] rounded-lg px-4 py-4 bg-white text-lg focus:ring-2 focus:ring-[#19396c] outline-none transition"
              required
            >
              <option value="">Seleccionar</option>
              {travelPurposes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-7">
            <label className="block font-bold text-[#19396c] mb-2 text-lg">
              ¿Cuándo planeás llegar a Israel? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="DD"
                maxLength={2}
                pattern="\d{2}"
                value={arrival.day}
                onChange={(e) =>
                  setArrival((a) => ({ ...a, day: e.target.value.replace(/\D/, '') }))
                }
                className="w-20 border-2 border-[#19396c] rounded-lg px-2 py-4 text-lg text-center bg-white focus:ring-2 focus:ring-[#19396c] outline-none transition"
                required
              />
              <input
                type="text"
                placeholder="MM"
                maxLength={2}
                pattern="\d{2}"
                value={arrival.month}
                onChange={(e) =>
                  setArrival((a) => ({ ...a, month: e.target.value.replace(/\D/, '') }))
                }
                className="w-20 border-2 border-[#19396c] rounded-lg px-2 py-4 text-lg text-center bg-white focus:ring-2 focus:ring-[#19396c] outline-none transition"
                required
              />
              <input
                type="text"
                placeholder="AAAA"
                maxLength={4}
                pattern="\d{4}"
                value={arrival.year}
                onChange={(e) =>
                  setArrival((a) => ({ ...a, year: e.target.value.replace(/\D/, '') }))
                }
                className="w-32 border-2 border-[#19396c] rounded-lg px-2 py-4 text-lg text-center bg-white focus:ring-2 focus:ring-[#19396c] outline-none transition"
                required
              />
            </div>
          </div>

          <div className="mb-10">
            <label className="block font-bold text-[#19396c] mb-2 text-lg">
              ¿Cuánto tiempo planeás quedarte en Israel? <span className="text-red-500">*</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border-2 border-[#19396c] rounded-lg px-4 py-4 bg-white text-lg focus:ring-2 focus:ring-[#19396c] outline-none transition"
              required
            >
              <option value="">Seleccionar</option>
              {stayDurations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 rounded-full font-bold text-lg border-2 border-[#19396c] text-[#19396c] bg-white hover:bg-[#f2f6fb] transition"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={!allValid || loading}
              className={`px-8 py-3 rounded-full font-bold text-lg bg-[#818ead] text-white hover:bg-[#19396c] transition ${
                allValid && !loading ? '' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              {loading ? 'Guardando...' : 'Ingresar datos de pasaporte →'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">
          🔒 Tu información se transmite encriptada.
        </div>
        <div className="mb-2">
          *<span className="font-semibold">ETA-IL</span>.
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}