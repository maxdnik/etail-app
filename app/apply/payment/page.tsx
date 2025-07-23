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
      {/* Navbar */}
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">Volver al inicio</Link>
      </nav>

      {/* Barra de progreso */}
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
          <div className="w-[100%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      {/* Formulario centrado */}
      <div className="flex-1 flex flex-col items-center py-10">
        {/* Card resumen */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow-lg p-10 max-w-2xl w-full mb-8">
          <h2 className="text-3xl font-bold text-yellow-900 mb-6">Resumen del pago</h2>
          <p className="mb-6 text-gray-800 text-lg">
            Estás por abonar el trámite de <span className="font-semibold">ETA-IL</span> para viajar a Israel bajo el Programa de Exención de Visa.
          </p>
          <div className="mb-2">
            <span className="font-bold text-lg">Total a pagar:</span>
          </div>
          <div className="text-4xl font-bold text-blue-900 mb-6 text-center">46 U$D</div>
          <p className="mt-4 text-sm text-gray-700">
            Una vez realizado el pago, la autorización suele resolverse entre <b>24 y 72 horas</b>.<br />
            Te notificaremos por email apenas haya novedades.
          </p>
        </div>

        {/* Card de pago */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-10 max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-950">Pago con Mercado Pago</h1>
          {showBrick ? (
            <CardPaymentBrick onPaySuccess={() => router.push('/apply/success')} />
          ) : (
            <div className="text-center text-gray-600 py-10">Cargando...</div>
          )}
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
