// app/apply/success/page.tsx
'use client';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 flex flex-col">
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">Volver al inicio</Link>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="bg-white border border-green-200 shadow-lg rounded-2xl p-10 max-w-2xl w-full flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <h1 className="text-4xl font-bold mb-3 text-green-800 text-center">¡Pago realizado con éxito!</h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Recibimos tu pago. Tu solicitud de ETA-IL será procesada y te notificaremos por email apenas haya novedades.
          </p>
          <Link href="/" className="mt-4 px-8 py-3 bg-blue-950 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition">
            Volver al inicio
          </Link>
        </div>
      </div>
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div>© {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados</div>
      </footer>
    </main>
  );
}
