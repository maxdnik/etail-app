'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Step3() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [surname, setSurname] = useState('');
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPassportFile(e.target.files[0]);
    }
  }

  function handleModalClose() {
    setShowModal(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!passportFile || !surname || surname.trim().length < 2) {
      alert('Por favor, completá tu apellido (mínimo 2 letras) y subí la imagen del pasaporte.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', passportFile);          // El campo SE DEBE llamar "file"
      formData.append('surname', surname.trim().toUpperCase());

      const res = await fetch('/api/upload-passport', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Error al subir el archivo');
        setUploading(false);
        return;
      }

      const { url } = await res.json();
      localStorage.setItem('passportImageUrl', url);
      localStorage.setItem('passportSurname', surname);

      router.push('/apply/step-3b'); // o el siguiente paso
    } catch (e) {
      alert('Error de red o inesperado.');
    } finally {
      setUploading(false);
    }
  }

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
          {/* 48% = step 3 */}
          <div className="w-[48%] h-full bg-blue-950 rounded-full transition-all duration-300"></div>
        </div>
      </section>

      {/* Modal popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-[#e7ebf3] border border-blue-200 rounded-2xl max-w-2xl w-full mx-4 p-10 shadow-xl">
            <h2 className="text-4xl font-extrabold text-[#19396c] mb-4">Por favor, subí tu pasaporte</h2>
            <ul className="text-lg text-[#19396c] list-disc ml-4 mb-8 space-y-1">
              <li>Para continuar con tu solicitud ETA-IL, debés subir una foto de la hoja biográfica de tu pasaporte (la que muestra tus datos personales).</li>
              <li>Asegurate de que la imagen sea clara y completa.</li>
              <li>Los datos deben coincidir exactamente con tu identidad.</li>
              <li>Podés tomar una foto o seleccionar una imagen desde tu galería.</li>
              <li>Formatos permitidos: PNG, JPG, JPEG.</li>
            </ul>
            <button
              className="bg-[#19396c] hover:bg-[#304c7a] text-white text-lg font-bold px-8 py-3 rounded-lg transition"
              onClick={handleModalClose}
            >
              Subir pasaporte
            </button>
          </div>
        </div>
      )}

      {/* Formulario principal */}
      {!showModal && (
        <div className="flex-1 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-10 max-w-2xl w-full border border-gray-200"
          >
            <h1 className="text-3xl font-extrabold text-[#19396c] mb-8">Carga tu pasaporte</h1>
            <div className="mb-6">
              <label className="block font-bold text-[#19396c] mb-2 text-lg">
                Apellido (igual que en tu pasaporte) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                placeholder="Ej: PÉREZ"
                className="block w-full text-lg border-2 border-[#19396c] rounded-lg py-3 px-4 bg-white"
                required
                minLength={2}
              />
            </div>
            <div className="mb-8">
              <label className="block font-bold text-[#19396c] mb-2 text-lg">
                Imagen del pasaporte <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                name="file"
                onChange={handleFileChange}
                className="block w-full text-lg border-2 border-[#19396c] rounded-lg py-3 px-4 bg-white"
                required
              />
              {passportFile && (
                <div className="mt-3 text-green-700 text-sm">
                  Archivo seleccionado: <span className="font-semibold">{passportFile.name}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 rounded-full font-bold text-lg border-2 border-[#19396c] text-[#19396c] bg-white hover:bg-[#f2f6fb] transition"
                disabled={uploading}
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={!passportFile || !surname || surname.trim().length < 2 || uploading}
                className={`px-8 py-3 rounded-full font-bold text-lg bg-[#818ead] text-white hover:bg-[#19396c] transition ${
                  passportFile && surname.trim().length >= 2 && !uploading ? '' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {uploading ? 'Subiendo...' : 'Cargar →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">🔒 Tu información se transmite encriptada y es revisada por profesionales en viajes internacionales.</div>
        <div className="mb-2">
          *Brindamos asistencia para gestionar tu solicitud <span className="font-semibold">ETA-IL</span>.
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}

