'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CardPaymentBrick from './CardPaymentBrick';
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [showBrick, setShowBrick] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setShowBrick(true), 300);
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 font-sans flex flex-col">
      {/* ✅ NAVBAR PRESERVADO */}
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">Volver al inicio</Link>
      </nav>

      {/* ✅ BARRA DE PROGRESO PRESERVADA */}
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium overflow-x-auto">
          <span>Disclaimers</span>
          <span>Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span className="font-bold underline">Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[100%] h-full bg-blue-950 rounded-full transition-all duration-700"></div>
        </div>
      </section>

      {/* CONTENIDO REDISEÑADO: Layout de 2 Columnas */}
      <div className="flex-1 max-w-6xl w-full mx-auto py-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: Plataforma de Pago */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Pago Seguro
                </h2>
              </div>
              
              <div className="p-8">
                {showBrick ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardPaymentBrick onPaySuccess={() => router.push('/apply/success')} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-950"></div>
                    <p className="text-sm text-gray-500 mt-4 font-medium tracking-tight">Iniciando pasarela segura...</p>
                  </div>
                )}

                {/* Sellos de confianza */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 grayscale opacity-60">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Mercado_Pago_logo.svg" alt="Mercado Pago" className="h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Resumen de la Orden */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 sticky top-6">
              <div className="p-6 border-b border-gray-100 bg-blue-50/50">
                <h3 className="text-lg font-bold text-blue-950">Resumen del trámite</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Solicitud ETA-IL Israel</span>
                  <span className="font-semibold">$89.500</span>
                </div>
                
                <div className="pt-5 mt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800 tracking-tight">Total a pagar</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-900 block leading-none">89.500 AR$</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Pago único</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-100">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      El plazo estimado de resolución es de <b>24 a 72 horas</b> hábiles. Recibirá su confirmación vía email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pie del Resumen */}
              <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Transacción Encriptada SSL
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER PRESERVADO */}
      <footer className="bg-white border-t mt-8 py-8 px-4 text-center text-sm text-gray-600">
        <div className="mb-2 max-w-2xl mx-auto">
          🔒 Tu información se transmite encriptada.
        </div>
        <div className="mb-2 max-w-2xl mx-auto">
          <span className="font-semibold text-blue-900">ETA-IL</span>.
        </div>
        <div className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}