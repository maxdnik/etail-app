// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const countries = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "España", "Estados Unidos", "Israel", "México", "Paraguay", "Perú", "Uruguay", "Venezuela", "Otro"
];

function updateDraftLocal(patch) {
  try {
    const prev = JSON.parse(localStorage.getItem('etaIlDraft') || '{}');
    const next = { ...prev, ...patch };
    localStorage.setItem('etaIlDraft', JSON.stringify(next));
  } catch (err) {
    console.error("Error updating local draft:", err);
  }
}

export default function EmailConfirmationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [applicantType, setApplicantType] = useState('self');
  const [contactEmail, setContactEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [repData, setRepData] = useState({
    surname: '',
    name: '',
    docNumber: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem('etaIlDraft') || '{}');
      if (d.applicantType) setApplicantType(d.applicantType);
      if (d.contactEmail) {
        setContactEmail(d.contactEmail);
        setConfirmEmail(d.contactEmail);
      }
      // ✅ Fix: Aseguramos que repData siempre tenga sus llaves para evitar el error de "uncontrolled input"
      if (d.representative) {
        setRepData({
          surname: d.representative.surname || '',
          name: d.representative.name || '',
          docNumber: d.representative.docNumber || '',
          country: d.representative.country || '',
          phone: d.representative.phone || '',
        });
      }
    } catch (err) {}
  }, []);

  const handleRepChange = (e) => {
    const { name, value } = e.target;
    setRepData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (contactEmail.toLowerCase() !== confirmEmail.toLowerCase()) {
      setEmailError('Los correos electrónicos no coinciden.');
      return;
    }

    if (applicantType === 'representative') {
      const { surname, name, docNumber, country, phone } = repData;
      if (!surname || !name || !docNumber || !country || !phone) {
        alert("Por favor completá todos los datos personales del representante.");
        return;
      }
    }

    setLoading(true);

    const stepPayload = {
      applicantType,
      contactEmail: contactEmail.toLowerCase(),
      representative: applicantType === 'representative' ? repData : {},
    };

    // ✅ AJUSTE: Guardamos ÚNICAMENTE en local. 
    // No llamamos a la API para evitar crear el registro DRAFT en la base de datos.
    updateDraftLocal(stepPayload);

    // Simulamos una pequeña carga para mejorar la UX y redirigimos
    setTimeout(() => {
      setLoading(false);
      router.push('/apply/step-2');
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 font-sans flex flex-col">
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">Inicio</Link>
      </nav>

      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium overflow-x-auto">
          <span className="text-blue-900 font-bold">Inicio / Representante</span>
          <span>Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[16%] h-full bg-blue-950 rounded-full transition-all duration-500"></div>
        </div>
      </section>

      <div className="flex-1 flex justify-center items-center my-10 px-4">
        <form onSubmit={handleNext} className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl w-full border border-gray-200">
          <h1 className="text-3xl font-extrabold text-[#19396c] mb-6 text-center">Inicia tu solicitud</h1>
          
          <div className="mb-8">
            <p className="text-lg text-[#19396c] mb-4 font-bold text-center">¿Para quién estás presentando la solicitud?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${applicantType === 'self' ? 'border-[#19396c] bg-blue-50 ring-1 ring-[#19396c]' : 'border-gray-200'}`}>
                <input type="radio" name="applicantType" value="self" checked={applicantType === 'self'} onChange={() => setApplicantType('self')} className="w-5 h-5 accent-[#19396c]" />
                <span className="ml-3 text-lg font-medium text-[#19396c]">Para mí</span>
              </label>
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${applicantType === 'representative' ? 'border-[#19396c] bg-blue-50 ring-1 ring-[#19396c]' : 'border-gray-200'}`}>
                <input type="radio" name="applicantType" value="representative" checked={applicantType === 'representative'} onChange={() => setApplicantType('representative')} className="w-5 h-5 accent-[#19396c]" />
                <span className="ml-3 text-lg font-medium text-[#19396c]">Para otra persona</span>
              </label>
            </div>
          </div>

          {applicantType === 'representative' && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
              <h3 className="text-xl font-bold text-[#19396c] mb-2">Tus datos personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-bold text-[#19396c] mb-2">Apellido <span className="text-red-500">*</span></label>
                  <input type="text" name="surname" value={repData.surname || ''} onChange={handleRepChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#19396c]" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#19396c] mb-2">Nombre <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={repData.name || ''} onChange={handleRepChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#19396c]" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-bold text-[#19396c] mb-2">Pasaporte / DNI <span className="text-red-500">*</span></label>
                  <input type="text" name="docNumber" value={repData.docNumber || ''} onChange={handleRepChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#19396c]" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#19396c] mb-2">País de emisión <span className="text-red-500">*</span></label>
                  <select name="country" value={repData.country || ''} onChange={handleRepChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-white focus:border-[#19396c]" required>
                    <option value="">Seleccionar país</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#19396c] mb-2">Número de teléfono <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={repData.phone || ''} onChange={handleRepChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#19396c]" required />
              </div>
            </div>
          )}

          <div className="mb-8 border-t pt-8">
            <h3 className="text-xl font-bold text-[#19396c] mb-2">Correo de contacto</h3>
            <div className="mb-5">
              <label className="block font-bold text-[#19396c] mb-2">Email <span className="text-red-500">*</span></label>
              <input type="email" value={contactEmail || ''} onChange={(e) => setContactEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#19396c]" required />
            </div>
            <div className="mb-2">
              <label className="block font-bold text-[#19396c] mb-2">Confirmar Email <span className="text-red-500">*</span></label>
              <input type="email" value={confirmEmail || ''} onChange={(e) => setConfirmEmail(e.target.value)} className={`w-full border rounded-lg p-3 outline-none ${emailError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#19396c]'}`} required />
            </div>
            {emailError && <p className="text-red-600 text-xs font-semibold mt-2 flex items-center">⚠️ {emailError}</p>}
          </div>

          <div className="flex justify-between items-center mt-10 pt-6 border-t">
            <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-full font-bold border-2 border-[#19396c] text-[#19396c] hover:bg-gray-50 transition">← Volver</button>
            <button type="submit" disabled={loading} className="px-10 py-3 rounded-full font-bold bg-[#19396c] text-white hover:bg-[#102445] transition shadow-lg disabled:opacity-50">
              {loading ? 'Procesando...' : 'Siguiente →'}
            </button>
          </div>
        </form>
      </div>
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <p className="text-[10px] text-gray-400 mt-2">© {new Date().getFullYear()} ETA-IL Asistencia. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}