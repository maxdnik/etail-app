// @ts-nocheck
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
]

const occupationOptions = [
  { value: '', label: 'Seleccionar' },
  { value: 'Empleado', label: 'Empleado' },
  { value: 'Desempleado', label: 'Desempleado' },
  { value: 'Estudiante', label: 'Estudiante' },
  { value: 'Jubilado', label: 'Jubilado' },
  { value: 'Autónomo', label: 'Autónomo' },
];

const maritalStatusOptions = [
  { value: '', label: 'Seleccionar' },
  { value: 'Soltero/a', label: 'Soltero/a' },
  { value: 'Casado/a', label: 'Casado/a' },
  { value: 'Divorciado/a', label: 'Divorciado/a' },
  { value: 'Viudo/a', label: 'Viudo/a' },
];

// ✅ Draft local “sí o sí” (sin backend). Mergea en localStorage bajo personal.
function updateDraftLocal(patch) {
  try {
    const prev = JSON.parse(localStorage.getItem('etaIlDraft') || '{}');
    const next = {
      ...prev,
      ...patch,
      personal: {
        ...(prev.personal || {}),
        ...(patch?.personal || {}),
      },
    };
    localStorage.setItem('etaIlDraft', JSON.stringify(next));
  } catch {}
}

export default function StepDatosPersonales() {
  const router = useRouter();

  const [form, setForm] = useState({
    nacionalidadAdicional: '',
    numeroIdIsrael: '',
    estadoCivil: '',
    padreNombre: '',
    padreApellido: '',
    madreNombre: '',
    madreApellido: '',
    telefonoMovil: '',
    telefonoAdicional: '',
    domicilioPais: '',
    domicilioCiudad: '',
    ocupacion: '',
    orgNombre: '',
    puesto: '',
    telefonoTrabajo: '',
    emailTrabajo: '',
  });

  const [loading, setLoading] = useState(false);

  // ✅ Precargar desde draft
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem('etaIlDraft') || '{}');
      if (d?.personal) setForm((prev) => ({ ...prev, ...d.personal }));
    } catch {}
  }, []);

  // ✅ Autosave en cada cambio
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      updateDraftLocal({ personal: next });
      return next;
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (form.nacionalidadAdicional === 'Israel' && !form.numeroIdIsrael) {
      alert("Debés ingresar el Número de ID israelí.");
      return;
    }

    // ✅ Guardar draft sí o sí antes de navegar o postear
    updateDraftLocal({ personal: { ...form } });

    // ✅ FIX: no bloquear por etaIlId en Step-4
    const id = localStorage.getItem('etaIlId');

    // Si no hay id: avanzar igual
    if (!id) {
      router.push('/apply/step4-b');
      return;
    }

    setLoading(true);

    const body = { ...form, id };

    try {
      const res = await fetch('/api/personal-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // ✅ aunque falle backend, avanzamos (ya quedó draft guardado)
      router.push('/apply/step4-b');
    } catch (e) {
      // ✅ error de red: igual avanzamos
      router.push('/apply/step4-b');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/apply/step-3b');
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

      {/* Barra de pasos */}
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium">
          <span>Disclaimers</span>
          <span className="text-blue-900">Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[72%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      <form
        onSubmit={handleNext}
        className="max-w-3xl w-full mx-auto bg-white shadow-lg rounded-xl px-8 py-10 my-10"
      >
        <h1 className="text-4xl font-extrabold text-[#19396c] mb-6">Datos personales</h1>
        <p className="text-red-600 mb-2 text-sm">
          Los campos marcados con <span className="font-bold">*</span> son obligatorios.
        </p>

        {/* Nacionalidad adicional */}
        <div className="border-l-4 border-orange-300 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">¿Tenés otra nacionalidad o ciudadanía?</h2>
          <p className="mb-3 text-gray-700">
            Seleccioná si tenés ciudadanía de otro país además de la que figura en tu pasaporte.
          </p>
          <select
            name="nacionalidadAdicional"
            value={form.nacionalidadAdicional}
            onChange={handleInput}
            className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg mb-2"
          >
            <option value="">Seleccionar</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {form.nacionalidadAdicional === 'Israel' && (
            <div className="mt-3">
              <label className="block mb-1 text-[#19396c] font-semibold">
                Número de ID israelí <span className="text-red-500">*</span>
              </label>
              <input
                name="numeroIdIsrael"
                value={form.numeroIdIsrael}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
          )}
        </div>

        {/* Estado civil */}
        <div className="border-l-4 border-orange-300 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">Estado civil <span className="text-red-500">*</span></h2>
          <select
            name="estadoCivil"
            value={form.estadoCivil}
            onChange={handleInput}
            className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
            required
          >
            {maritalStatusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Datos de padres */}
        <div className="border-l-4 border-orange-300 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">Datos de los padres <span className="text-red-500">*</span></h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                Nombre del padre <span className="text-red-500">*</span>
              </label>
              <input
                name="padreNombre"
                value={form.padreNombre}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                Apellido del padre <span className="text-red-500">*</span>
              </label>
              <input
                name="padreApellido"
                value={form.padreApellido}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                Nombre de la madre <span className="text-red-500">*</span>
              </label>
              <input
                name="madreNombre"
                value={form.madreNombre}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                Apellido de la madre <span className="text-red-500">*</span>
              </label>
              <input
                name="madreApellido"
                value={form.madreApellido}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="border-l-4 border-orange-300 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">Información de contacto <span className="text-red-500">*</span></h2>
          <p className="mb-3 text-gray-700">
            Ingresá tu número de contacto actual. Lo utilizaremos solo si surge alguna consulta urgente.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                Teléfono móvil <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-[#19396c] bg-blue-50 text-[#19396c] font-bold rounded-l-lg text-lg select-none"></span>
                <input
                  name="telefonoMovil"
                  value={form.telefonoMovil}
                  onChange={handleInput}
                  className="w-full border-2 border-[#19396c] rounded-r-lg px-4 py-3 text-lg border-l-0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                Teléfono adicional
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-[#19396c] bg-blue-50 text-[#19396c] font-bold rounded-l-lg text-lg select-none"></span>
                <input
                  name="telefonoAdicional"
                  value={form.telefonoAdicional}
                  onChange={handleInput}
                  className="w-full border-2 border-[#19396c] rounded-r-lg px-4 py-3 text-lg border-l-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Domicilio */}
        <div className="border-l-4 border-orange-300 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">Domicilio</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-[#19396c] font-semibold">
                País <span className="text-red-500">*</span>
              </label>
              <select
                name="domicilioPais"
                value={form.domicilioPais}
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
              <label className="block mb-1 text-[#19396c] font-semibold">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <input
                name="domicilioCiudad"
                value={form.domicilioCiudad}
                onChange={handleInput}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Ocupación */}
        <div className="border-l-4 border-orange-300 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">Ocupación</h2>
          <label className="block mb-1 text-[#19396c] font-semibold">
            Situación laboral <span className="text-red-500">*</span>
          </label>
          <select
            name="ocupacion"
            value={form.ocupacion}
            onChange={handleInput}
            className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg mb-3"
            required
          >
            {occupationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {(form.ocupacion === 'Empleado' || form.ocupacion === 'Autónomo') && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-[#19396c] font-semibold">
                  Nombre de la empresa <span className="text-red-500">*</span>
                </label>
                <input
                  name="orgNombre"
                  value={form.orgNombre}
                  onChange={handleInput}
                  className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[#19396c] font-semibold">
                  Puesto / Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  name="puesto"
                  value={form.puesto}
                  onChange={handleInput}
                  className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-[#19396c] font-semibold">
                  Teléfono laboral <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-[#19396c] bg-blue-50 text-[#19396c] font-bold rounded-l-lg text-lg select-none"></span>
                  <input
                    name="telefonoTrabajo"
                    value={form.telefonoTrabajo}
                    onChange={handleInput}
                    className="w-full border-2 border-[#19396c] rounded-r-lg px-4 py-3 text-lg border-l-0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-[#19396c] font-semibold">
                  Email laboral
                </label>
                <input
                  name="emailTrabajo"
                  value={form.emailTrabajo}
                  onChange={handleInput}
                  className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                />
              </div>
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
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Siguiente →'}
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">🔒 Tu información se transmite encriptada.</div>
        <div className="mb-2">
          
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  )
}