'use client';

import Link from 'next/link';

export default function LegalPage() {
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
          <span className="text-blue-900">Legales</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[100%] h-full bg-blue-950 rounded-full transition-all duration-300"></div>
        </div>
      </section>

      {/* Contenido Legal */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-2xl w-full border border-gray-200 my-8">
          <h1 className="text-4xl font-extrabold text-[#19396c] mb-7 text-center">
            Política de Privacidad y Términos de Uso
          </h1>

          {/* PRIVACIDAD */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#19396c] mb-4">Política de Privacidad</h2>
            <ul className="list-disc pl-6 text-base space-y-3">
              <li>
                <b>Información recopilada:</b> Nombre, apellido, correo electrónico, teléfono, información de viaje y pasaporte, datos de pago (no almacenados), e información técnica (IP, navegador, dispositivo).
              </li>
              <li>
                <b>Uso de la información:</b> Gestionar la solicitud ETA-IL, contactarte, mejorar el sitio y cumplir obligaciones legales.
              </li>
              <li>
                <b>Protección de datos:</b> Aplicamos medidas razonables de seguridad para proteger tu información personal.
              </li>
              <li>
                <b>Compartir información:</b> No compartimos tus datos personales con terceros salvo proveedores de servicios necesarios (por ejemplo, pagos), o requerimientos legales.
              </li>
              <li>
                <b>Derechos del usuario:</b> Podés acceder, rectificar o eliminar tus datos escribiendo a <a className="underline text-blue-700" href="mailto:contacto@israel-entrypiba.com">contacto@israel-entrypiba.com</a>.
              </li>
              <li>
                <b>Cookies:</b> Utilizamos cookies para mejorar tu experiencia en el sitio. Podés configurarlas desde tu navegador.
              </li>
              <li>
                <b>Cambios:</b> Los cambios a esta política serán publicados en esta página.
              </li>
            </ul>
            <p className="mt-4">
              Para cualquier consulta sobre privacidad, escribí a: <a className="underline text-blue-700" href="mailto:contacto@israel-entrypiba.com">contacto@israel-entrypiba.com</a>
            </p>
          </section>

          {/* TÉRMINOS */}
          <section>
            <h2 className="text-2xl font-bold text-[#19396c] mb-4">Términos y Condiciones</h2>
            <ul className="list-disc pl-6 text-base space-y-3">
              <li>
                <b>Servicio:</b> Este sitio ofrece gestión y asistencia para solicitar el permiso ETA-IL. No somos página oficial del Gobierno de Israel; actuamos como intermediarios privados.
              </li>
              <li>
                <b>Uso:</b> Debés brindar datos verídicos y autorizás el uso para gestionar el trámite.
              </li>
              <li>
                <b>Pagos:</b> El servicio implica un arancel por gestión y tasas oficiales. Los pagos son mediante plataformas seguras. No almacenamos datos de tarjetas.
              </li>
              <li>
                <b>Propiedad intelectual:</b> El contenido del sitio es propiedad de los titulares y no puede usarse sin autorización.
              </li>
              <li>
                <b>Responsabilidad:</b> No nos hacemos responsables por rechazos o demoras propias del Gobierno de Israel. La aprobación depende solo de la autoridad migratoria.
              </li>
              <li>
                <b>Modificaciones:</b> Podemos modificar estos términos en cualquier momento y serán publicados aquí.
              </li>
            </ul>
            <p className="mt-4">
              Consultas o reclamos: <a className="underline text-blue-700" href="mailto:contacto@israel-entrypiba.com">contacto@israel-entrypiba.com</a>
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">
          🔒 Tu información se transmite encriptada y es revisada por profesionales en viajes internacionales.
        </div>
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
