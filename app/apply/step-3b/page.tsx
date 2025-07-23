'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Tus listas:
const documentTypes = [
  { value: '', label: 'Seleccionar' },
  { value: 'regular', label: 'Pasaporte nacional' },
  { value: 'diplomatic', label: 'Pasaporte diplomático' },
  { value: 'service', label: 'Pasaporte de servicio' },
  { value: 'official', label: 'Pasaporte oficial' },
  { value: 'laissez_passer', label: 'Laissez passer' },
];

const countries = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita",
  "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés",
  "Baréin", "Barbados", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina",
  "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya",
  "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Colombia", "Comoras", "Congo",
  "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca",
  "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia",
  "Eslovenia", "España", "Estados Unidos de América", "Estonia", "Esuatini", "Etiopía", "Filipinas",
  "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia",
  "Guatemala", "Guyana", "Guinea", "Guinea-Bisáu", "Guinea Ecuatorial", "Haití", "Honduras",
  "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall",
  "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia",
  "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia",
  "Liechtenstein", "Lituania", "Luxemburgo", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí",
  "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco",
  "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger",
  "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina",
  "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana",
  "República Checa", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumania",
  "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía",
  "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria",
  "Somalia", "Sri Lanka", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam",
  "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago",
  "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán",
  "Vanuatu", "Vaticano", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

const generos = [
  { value: '', label: 'Seleccionar' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
];

export default function Step3b() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [passport, setPassport] = useState({
    docType: '',
    passportNumber: '',
    countryCode: '',
    nationality: '',
    biometric: '',
    surname: '',
    givenName: '',
    issueDay: '', issueMonth: '', issueYear: '',
    expiryDay: '', expiryMonth: '', expiryYear: '',
    birthDay: '', birthMonth: '', birthYear: '',
    placeOfBirth: '',
    gender: '',
  });

  const allValid = Object.values(passport).every(v => v && v !== '');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPassport({ ...passport, [e.target.name]: e.target.value });
  };

  // SOLO AQUÍ VA EL async
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);

    const id = localStorage.getItem('etaIlId');
    if (!id) {
      alert('No se encontró el id del proceso. Volvé al paso anterior.');
      setLoading(false);
      return;
    }

    const passportData = {
      docType: passport.docType,
      number: passport.passportNumber,
      country: passport.countryCode,
      nationality: passport.nationality,
      biometric: passport.biometric,
      surname: passport.surname,
      name: passport.givenName,
      issueDate: `${passport.issueYear}-${passport.issueMonth}-${passport.issueDay}`,
      expiryDate: `${passport.expiryYear}-${passport.expiryMonth}-${passport.expiryDay}`,
      birthDate: `${passport.birthYear}-${passport.birthMonth}-${passport.birthDay}`,
      birthCountry: passport.placeOfBirth,
      gender: passport.gender,
      id,
    };

    try {
      const res = await fetch('/api/passport-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passportData),
      });
      if (!res.ok) {
        const errorRes = await res.json().catch(() => ({}));
        alert(errorRes.error || 'Ocurrió un error guardando los datos.');
        setLoading(false);
        return;
      }
      router.push('/apply/step-4');
    } catch (e) {
      alert('Error de red. Reintentá.');
      setLoading(false);
    }
  };

  // ----------- EL RETURN, NO CIERRES LA FUNCIÓN ANTES -----------
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 font-sans flex flex-col">
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">
          Inicio
        </Link>
      </nav>
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium overflow-x-auto">
          <span>Disclaimers</span>
          <span>Información de viaje</span>
          <span className="text-blue-900">Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[48%] h-full bg-blue-950 rounded-full transition-all duration-300"></div>
        </div>
      </section>
      <div className="flex-1 flex justify-center items-start py-10">
        <form
          onSubmit={handleNext}
          className="bg-white shadow-lg rounded-2xl p-10 max-w-4xl w-full border border-gray-200"
        >
          <h1 className="text-3xl font-extrabold text-[#19396c] mb-1">Detalles del pasaporte</h1>
          <p className="text-sm text-red-600 mb-1">
            Campos obligatorios (<span className="text-red-500">*</span>)
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Tipo de documento *</label>
              <select
                name="docType"
                value={passport.docType}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              >
                {documentTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Número de pasaporte *</label>
              <input
                type="text"
                name="passportNumber"
                value={passport.passportNumber}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">País de emisión *</label>
              <select
                name="countryCode"
                value={passport.countryCode}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              >
                <option value="">Seleccionar</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Nacionalidad *</label>
              <select
                name="nationality"
                value={passport.nationality}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              >
                <option value="">Seleccionar</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Apellido *</label>
              <input
                type="text"
                name="surname"
                value={passport.surname}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Nombre/s *</label>
              <input
                type="text"
                name="givenName"
                value={passport.givenName}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">¿Pasaporte biométrico? *</label>
              <div className="flex gap-4">
                <button type="button"
                  className={`px-6 py-2 rounded-lg border-2 text-lg font-bold ${passport.biometric === 'No'
                    ? 'bg-[#19396c] text-white border-[#19396c]' : 'bg-white text-[#19396c] border-[#19396c]'
                  }`}
                  onClick={() => setPassport(f => ({ ...f, biometric: 'No' }))}
                >No</button>
                <button type="button"
                  className={`px-6 py-2 rounded-lg border-2 text-lg font-bold ${passport.biometric === 'Sí'
                    ? 'bg-[#19396c] text-white border-[#19396c]' : 'bg-white text-[#19396c] border-[#19396c]'
                  }`}
                  onClick={() => setPassport(f => ({ ...f, biometric: 'Sí' }))}
                >Sí</button>
              </div>
            </div>
            {/* Fechas */}
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Fecha de emisión *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="issueDay"
                  value={passport.issueDay}
                  onChange={handleInput}
                  placeholder="DD"
                  maxLength={2}
                  className="w-16 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
                <input
                  type="text"
                  name="issueMonth"
                  value={passport.issueMonth}
                  onChange={handleInput}
                  placeholder="MM"
                  maxLength={2}
                  className="w-16 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
                <input
                  type="text"
                  name="issueYear"
                  value={passport.issueYear}
                  onChange={handleInput}
                  placeholder="AAAA"
                  maxLength={4}
                  className="w-20 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Fecha de vencimiento *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="expiryDay"
                  value={passport.expiryDay}
                  onChange={handleInput}
                  placeholder="DD"
                  maxLength={2}
                  className="w-16 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
                <input
                  type="text"
                  name="expiryMonth"
                  value={passport.expiryMonth}
                  onChange={handleInput}
                  placeholder="MM"
                  maxLength={2}
                  className="w-16 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
                <input
                  type="text"
                  name="expiryYear"
                  value={passport.expiryYear}
                  onChange={handleInput}
                  placeholder="AAAA"
                  maxLength={4}
                  className="w-20 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Fecha de nacimiento *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="birthDay"
                  value={passport.birthDay}
                  onChange={handleInput}
                  placeholder="DD"
                  maxLength={2}
                  className="w-16 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
                <input
                  type="text"
                  name="birthMonth"
                  value={passport.birthMonth}
                  onChange={handleInput}
                  placeholder="MM"
                  maxLength={2}
                  className="w-16 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
                <input
                  type="text"
                  name="birthYear"
                  value={passport.birthYear}
                  onChange={handleInput}
                  placeholder="AAAA"
                  maxLength={4}
                  className="w-20 border-2 border-[#19396c] rounded-lg px-2 py-3 text-lg text-center"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Lugar de nacimiento *</label>
              <select
                name="placeOfBirth"
                value={passport.placeOfBirth}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              >
                <option value="">Seleccionar</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#19396c] mb-2 block">Género *</label>
              <select
                name="gender"
                value={passport.gender}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              >
                {generos.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-10">
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
              className={`px-8 py-3 rounded-full font-bold text-lg bg-[#19396c] text-white hover:bg-[#818ead] transition ${allValid && !loading ? '' : 'opacity-60 cursor-not-allowed'}`}
            >
              {loading ? 'Guardando...' : 'Siguiente →'}
            </button>
          </div>
        </form>
      </div>
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">🔒 Tu información se transmite encriptada y es revisada por profesionales en viajes internacionales.</div>
        <div className="mb-2">
          * Este sitio no pertenece al gobierno de <span className="italic text-blue-900">Israel</span>. Brindamos asistencia para gestionar tu solicitud <span className="font-semibold">ETA-IL</span> de manera independiente.
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}
