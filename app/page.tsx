'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link
          href="/apply/step-1"
          className="underline hover:text-gray-200"
        >
          Iniciar solicitud
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative bg-blue-950 text-white py-8 px-6 text-center overflow-hidden min-h-[250px]">
        <div className="absolute inset-0 bg-[url('/bg-hero-israel.jpg')] bg-cover bg-center opacity-40 max-h-[300px]"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Autorización ETA-IL para viajar a Israel
          </h1>
          <p className="text-xl mb-8">
            Presentá tu solicitud en minutos. Servicio rápido, en español y con revisión personalizada.
          </p>
          <Link
            href="/apply/step-1"
            className="inline-block bg-white text-blue-950 font-bold px-8 py-3 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Iniciar solicitud
          </Link>
        </div>
      </section>

      {/* Paso a paso */}
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium overflow-x-auto">
          <span>Disclaimers</span>
          <span>Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[14%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      {/* ¿Qué es el ETA-IL? */}
      <section className="bg-white py-16 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">¿Qué es el ETA-IL?</h2>
          <p className="text-lg text-gray-700">
            El ETA-IL (Electronic Travel Authorization Israel) es una autorización electrónica obligatoria para ciudadanos de países exentos de visa, que desean ingresar a Israel por turismo, negocios o tránsito por hasta 90 días. Desde 2025, es requisito indispensable obtener el ETA-IL antes de abordar tu vuelo o crucero.
          </p>
        </div>
      </section>

      {/* Tarjetas de información */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-blue-950">¿Por qué usar nuestro servicio?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Asistencia en español paso a paso</li>
              <li>Respuesta 24/7</li>
              <li>Revisión personalizada antes de enviar</li>
              <li>Notificación por correo del estado</li>
              <li>Soporte ante errores o rechazos</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-blue-950">Procesamiento</h3>
            <p className="text-gray-700">
              Procesamos tu solicitud el mismo día hábil y te mantenemos informado por email. La aprobación suele demorar entre 24 y 72 horas.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white py-12 px-6 border-t text-center text-sm text-gray-600">
        <p className="mb-2">🔒 Tu información se transmite encriptada y es revisada por profesionales en viajes internacionales.</p>
        <p></p>
                <div className="mb-2">
          * Brindamos asistencia para gestionar tu solicitud <span className="font-semibold">ETA-IL</span>.
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-xs text-gray-500 border-t">
        <p>© {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados</p>
      </footer>

      {/* Botón móvil fijo */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-50">
        <Link
          href="/apply/step-1"
          className="bg-blue-950 text-white font-bold px-6 py-3 rounded-full shadow-lg"
        >
          Iniciar solicitud
        </Link>
      </div>
    </main>
  )
}


