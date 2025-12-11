// @ts-nocheck
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ReviewPage() {
  const router = useRouter();

  // Hooks: SIEMPRE arriba del todo
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Confirmaciones locales
  const [confirmedSections, setConfirmedSections] = useState({
    travel: false,
    passport: false,
    personal: false,
    declaration: false,
  });

  const [open, setOpen] = useState({
    travel: true,
    passport: false,
    personal: false,
    declaration: false,
  });

  const PASSPORT_LABELS = {
  docType: 'Tipo de documento',
  number: 'Número de pasaporte',
  country: 'País de emisión',
  nationality: 'Nacionalidad',
  biometric: '¿Pasaporte biométrico?',
  surname: 'Apellido',
  name: 'Nombre/s',
  issueDate: 'Fecha de emisión',
  expiryDate: 'Fecha de vencimiento',
  birthDate: 'Fecha de nacimiento',
  birthCountry: 'Lugar de nacimiento',
  gender: 'Género',
};

const [editSection, setEditSection] = useState({
  travel: false,
  passport: false,
  personal: false,
});


const PERSONAL_LABELS = {
  nacionalidadAdicional: 'Otra nacionalidad o ciudadanía',
  numeroIdIsrael: 'Número de ID israelí',
  estadoCivil: 'Estado civil',
  padreNombre: 'Nombre del padre',
  padreApellido: 'Apellido del padre',
  madreNombre: 'Nombre de la madre',
  madreApellido: 'Apellido de la madre',
  telefonoMovil: 'Teléfono móvil',
  telefonoAdicional: 'Teléfono adicional',
  domicilioPais: 'País',
  domicilioCiudad: 'Ciudad',
  ocupacion: 'Situación laboral',
  orgNombre: 'Nombre de la empresa',
  puesto: 'Puesto / Cargo',
  telefonoTrabajo: 'Teléfono laboral',
  emailTrabajo: 'Email laboral'
};


  // Cargar los datos de la base según el ID guardado en localStorage
  useEffect(() => {
    const id = localStorage.getItem('etaIlId');
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/application?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          travel: {
            purpose: data.purpose || '',
            arrival: data.arrival || '',
            stay: data.duration || '',
          },
          passport: data.passport || {},
          personal: data.personal || {},
          declaration: data.declaration || {},
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Si está cargando, mostramos loader
  if (loading) return <div className="p-10 text-xl text-center">Cargando datos...</div>;
  if (!formData) return <div className="p-10 text-red-500 text-center">No se encontraron datos para mostrar.</div>;

  // Funciones para abrir/cerrar cada bloque
  const toggleSection = (section) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleConfirm = (section) => {
    setConfirmedSections(prev => ({
      ...prev,
      [section]: true,
    }));
    // Abrir la siguiente sección automáticamente (si existe)
    const order = ['travel', 'passport', 'personal', 'declaration'];
    const next = order[order.indexOf(section) + 1];
    if (next) {
      setOpen(prev => ({ ...prev, [section]: false, [next]: true }));
    } else {
      setOpen(prev => ({ ...prev, [section]: false }));
    }
  };
  const handleSaveTravel = async () => {
  setSaving(true);
  try {
    const id = localStorage.getItem('etaIlId'); // O el método que uses para obtener el ID
    const updatedTravel = editTravelForm; // tu objeto con los valores editados

    // Actualizá en frontend
    setFormData(prev => ({
      ...prev,
      travel: updatedTravel
    }));

    // Ahora actualizá en backend
    await fetch('/api/application', {
      method: 'PATCH', // o PUT según tu API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id, // el _id de la solicitud
        travel: updatedTravel,
      })
    });

    setEditSection(prev => ({ ...prev, travel: false }));
  } catch (e) {
    alert('Error guardando los cambios');
  }
  setSaving(false);
}


const handleSubmit = async (e) => {
  e.preventDefault();
  const id = localStorage.getItem('etaIlId');
  const payload = {
    applicationId: id,
    travel: formData.travel,
    passport: formData.passport,
    personal: formData.personal,
    declaration: formData.declaration,
  };
  try {
    const res = await fetch('/api/save-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert('No se pudo guardar en la base de datos. Intentá de nuevo.');
      return;
    }
    router.push('/apply/payment'); // Solo redirigí después de guardar exitosamente
  } catch (err) {
    alert('Error de red guardando los datos. Intentá de nuevo.');
  }
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
          <span>Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span className="text-blue-900">Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[90%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      {/* Formulario principal */}
      <form onSubmit={handleSubmit} className="max-w-3xl w-full mx-auto bg-white shadow-lg rounded-xl px-8 py-10 my-10">
        <h1 className="text-4xl font-extrabold text-[#19396c] mb-1">Revisión</h1>
        <p className="font-semibold text-lg text-[#19396c] mb-1">Revisá tu información</p>
        <p className="text-sm text-gray-700 mb-6">Leé y confirmá cada sección antes de continuar. No podrás editar los datos después de este paso.</p>

      {/* Información de viaje */}
      <section className="mb-5">
        <button
          type="button"
          onClick={() => toggleSection('travel')}
          className="w-full flex justify-between items-center bg-blue-50 border border-blue-200 rounded-t-lg px-6 py-4 font-bold text-xl text-[#19396c]"
        >
          Información de viaje
          <span className="flex items-center gap-2">
            {confirmedSections.travel ? (
              <span className="text-green-600 text-xl">✔️</span>
            ) : (
              <span className="text-gray-400 text-xl">○</span>
            )}
            {open.travel ? '▲' : '▼'}
          </span>
        </button>
        {open.travel && (
          <div className="bg-blue-50 border-x border-b border-blue-200 px-6 py-3 space-y-2 rounded-b-lg text-base">
            {!formData || !formData.travel ? (
              <div className="text-center py-6 text-gray-400">Cargando datos...</div>
            ) : editSection.travel ? (
              // --- MODO EDICIÓN ---
              <div>
                <div className="flex justify-between py-1 items-center">
                  <span>Motivo principal del viaje:</span>
                  <input
                    className="border border-[#19396c] rounded px-2 py-1"
                    value={formData.travel.purpose}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        travel: { ...prev.travel, purpose: e.target.value }
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex justify-between py-1 items-center">
                  <span>Fecha de llegada:</span>
                  <input
                    type="date"
                    className="border border-[#19396c] rounded px-2 py-1"
                    value={formData.travel.arrival}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        travel: { ...prev.travel, arrival: e.target.value }
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex justify-between py-1 items-center">
                  <span>Duración estimada de la estadía:</span>
                  <input
                    className="border border-[#19396c] rounded px-2 py-1"
                    value={formData.travel.stay}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        travel: { ...prev.travel, stay: e.target.value }
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="underline text-blue-800 mr-3"
                    onClick={() => setEditSection(prev => ({ ...prev, travel: false }))}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3"
                    onClick={async () => {
                      // --- GUARDAR EN LA BASE DE DATOS ---
                      const id = localStorage.getItem('etaIlId');
                      const res = await fetch('/api/application', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id,
                          travel: {
                            purpose: formData.travel.purpose,
                            arrival: formData.travel.arrival,
                            stay: formData.travel.stay,
                          }
                        })
                      });
                      if (res.ok) {
                        setEditSection(prev => ({ ...prev, travel: false }));
                      } else {
                        alert('No se pudo guardar en la base de datos.');
                      }
                    }}
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            ) : (
              // --- SOLO VISUALIZACIÓN ---
              <>
                <div className="flex justify-between py-1">
                  <span>Motivo principal del viaje:</span>
                  <span className="font-bold">{formData.travel.purpose}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Fecha de llegada:</span>
                  <span className="font-bold">{formData.travel.arrival}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Duración estimada de la estadía:</span>
                  <span className="font-bold">{formData.travel.stay}</span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="underline text-blue-800 mr-3"
                    onClick={() => setEditSection(prev => ({ ...prev, travel: true }))}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirm('travel')}
                    className="bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3"
                  >
                    Confirmar sección
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>


      {/* Pasaporte */}
      <section className="mb-5">
        <button
          type="button"
          onClick={() => toggleSection('passport')}
          className="w-full flex justify-between items-center bg-blue-50 border border-blue-200 rounded-t-lg px-6 py-4 font-bold text-xl text-[#19396c]"
        >
          Datos del pasaporte
          <span className="flex items-center gap-2">
            {confirmedSections.passport ? (
              <span className="text-green-600 text-xl">✔️</span>
            ) : (
              <span className="text-gray-400 text-xl">○</span>
            )}
            {open.passport ? '▲' : '▼'}
          </span>
        </button>
        {open.passport && (
          <div className="bg-blue-50 border-x border-b border-blue-200 px-6 py-3 space-y-2 rounded-b-lg text-base">
            {!formData || !formData.passport ? (
              <div className="text-center py-6 text-gray-400">Cargando datos...</div>
            ) : editSection.passport ? (
              // --- MODO EDICIÓN ---
              <div>
                {Object.entries(PASSPORT_LABELS).map(([k, label]) => (
                  <div className="flex justify-between py-1 items-center" key={k}>
                    <span>{label}:</span>
                    <input
                      className="border border-[#19396c] rounded px-2 py-1"
                      value={formData.passport[k] || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          passport: { ...prev.passport, [k]: e.target.value }
                        }))
                      }
                      required={k !== "biometric"} // Si querés, hacé que "biometric" no sea requerido
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="underline text-blue-800 mr-3"
                    onClick={() => setEditSection(prev => ({ ...prev, passport: false }))}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3"
                    onClick={async () => {
                      // --- GUARDAR EN LA BASE DE DATOS ---
                      const id = localStorage.getItem('etaIlId');
                      const res = await fetch('/api/application', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id,
                          passport: formData.passport
                        })
                      });
                      if (res.ok) {
                        setEditSection(prev => ({ ...prev, passport: false }));
                      } else {
                        alert('No se pudo guardar en la base de datos.');
                      }
                    }}
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            ) : (
              // --- SOLO VISUALIZACIÓN ---
              <>
                {Object.entries(PASSPORT_LABELS).map(([k, label]) => (
                  <div className="flex justify-between py-1" key={k}>
                    <span>{label}:</span>
                    <span className="font-bold">{formData.passport[k] || '-'}</span>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="underline text-blue-800 mr-3"
                    onClick={() => setEditSection(prev => ({ ...prev, passport: true }))}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirm('passport')}
                    className="bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3"
                  >
                    Confirmar sección
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

    {/* Datos personales */}
    <section className="mb-5">
      <button
        type="button"
        onClick={() => toggleSection('personal')}
        className="w-full flex justify-between items-center bg-blue-50 border border-blue-200 rounded-t-lg px-6 py-4 font-bold text-xl text-[#19396c]"
      >
        Datos personales
        <span className="flex items-center gap-2">
          {confirmedSections.personal ? (
            <span className="text-green-600 text-xl">✔️</span>
          ) : (
            <span className="text-gray-400 text-xl">○</span>
          )}
          {open.personal ? '▲' : '▼'}
        </span>
      </button>
      {open.personal && (
        <div className="bg-blue-50 border-x border-b border-blue-200 px-6 py-3 space-y-2 rounded-b-lg text-base">
          {!formData || !formData.personal ? (
            <div className="text-center py-6 text-gray-400">Cargando datos...</div>
          ) : editSection.personal ? (
            // --- MODO EDICIÓN ---
            <div>
              {Object.entries(PERSONAL_LABELS).map(([k, label]) => (
                <div className="flex justify-between py-1 items-center" key={k}>
                  <span>{label}:</span>
                  <input
                    className="border border-[#19396c] rounded px-2 py-1"
                    value={formData.personal[k] || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, [k]: e.target.value }
                      }))
                    }
                  />
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="underline text-blue-800 mr-3"
                  onClick={() => setEditSection(prev => ({ ...prev, personal: false }))}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3"
                  onClick={async () => {
                    // GUARDAR EN LA BASE DE DATOS
                    const id = localStorage.getItem('etaIlId');
                    const res = await fetch('/api/application', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id,
                        personal: formData.personal
                      })
                    });
                    if (res.ok) {
                      setEditSection(prev => ({ ...prev, personal: false }));
                    } else {
                      alert('No se pudo guardar en la base de datos.');
                    }
                  }}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          ) : (
            // --- SOLO VISUALIZACIÓN ---
            <>
              {Object.entries(PERSONAL_LABELS).map(([k, label]) => (
                <div className="flex justify-between py-1" key={k}>
                  <span>{label}:</span>
                  <span className="font-bold">{formData.personal[k] || '-'}</span>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="underline text-blue-800 mr-3"
                  onClick={() => setEditSection(prev => ({ ...prev, personal: true }))}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirm('personal')}
                  className="bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3"
                >
                  Confirmar sección
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>

        {/* Declaración jurada */}
        <section className="mb-5">
          <button
            type="button"
            onClick={() => toggleSection('declaration')}
            className="w-full flex justify-between items-center bg-blue-50 border border-blue-200 rounded-t-lg px-6 py-4 font-bold text-xl text-[#19396c]"
          >
            Declaración jurada
            <span className="flex items-center gap-2">
              {confirmedSections.declaration ? (
                <span className="text-green-600 text-xl">✔️</span>
              ) : (
                <span className="text-gray-400 text-xl">○</span>
              )}
              {open.declaration ? '▲' : '▼'}
            </span>
          </button>
          {open.declaration && (
            <div className="bg-blue-50 border-x border-b border-blue-200 px-6 py-3 space-y-2 rounded-b-lg text-base">
              <p className="mb-2">
                Declaro que la información provista es verídica, completa y correcta. Entiendo que la aprobación de la ETA-IL no garantiza el ingreso a Israel, sujeto a control migratorio.
                <br />
                Autorizo el uso de mis datos según los fines del trámite y certifico no tener impedimentos legales ni sanitarios para el ingreso.
              </p>
              <label className="flex items-center mt-4">
                <input
                  type="checkbox"
                  className="mr-2 h-5 w-5"
                  checked={!!formData.declaration?.confirmed}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    declaration: {
                      ...prev.declaration,
                      confirmed: e.target.checked,
                    }
                  }))}
                />
                <span className="font-semibold">Confirmo la declaración jurada</span>
              </label>
              <div className="flex justify-end mt-3">
                <button type="button" className="underline text-blue-800 mr-3">Editar</button>
                <button
                  type="button"
                  className={`bg-blue-950 text-white px-4 py-1 rounded-lg text-sm ml-3 transition ${!formData.declaration?.confirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!formData.declaration?.confirmed}
                  onClick={() => handleConfirm('declaration')}
                >
                  Confirmar sección
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Botón principal */}
        <div className="flex justify-end mt-6">
          <button type="submit" className="px-10 py-3 rounded-full bg-[#19396c] text-white font-bold text-lg hover:bg-[#162a4f] transition">
            Ir a pagar →
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">🔒 Tu información se transmite encriptada y es revisada por profesionales en viajes internacionales.</div>
        <div className="mb-2">
          *Brindamos asistencia para gestionar tu solicitud ETA-IL.
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA‑IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  )
}
