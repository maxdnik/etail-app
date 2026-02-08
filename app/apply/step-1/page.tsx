"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Step1() {
  const router = useRouter();
  const [acceptDisclaimer1, setAcceptDisclaimer1] = useState(false);

  const allAccepted = acceptDisclaimer1;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (allAccepted) {
      // ✅ Redirige a la página de confirmación de email
      router.push("/apply/email-confirmation");
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="underline hover:text-gray-200">
          Inicio
        </Link>
      </nav>

      {/* Progress */}
      <section className="bg-blue-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium overflow-x-auto">
          <span className="text-blue-900 font-bold">Disclaimers</span>
          <span>Inicio / Representante</span>
          <span>Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          {/* Primer paso: 8% aprox */}
          <div className="w-[8%] h-full bg-blue-950 rounded-full transition-all duration-300"></div>
        </div>
      </section>

      {/* Disclaimers */}
      <form
        className="flex-1 flex flex-col justify-center items-center px-4 my-10"
        onSubmit={handleNext}
      >
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full space-y-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold mb-4 text-center text-[#19396c]">
            Términos y condiciones
          </h1>
          
          <div className="space-y-6">
            <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-200 transition">
              <input
                id="disclaimer1"
                type="checkbox"
                checked={acceptDisclaimer1}
                onChange={(e) => setAcceptDisclaimer1(e.target.checked)}
                className="mt-1 mr-4 w-6 h-6 accent-[#19396c] cursor-pointer flex-shrink-0"
                required
              />
              <label
                htmlFor="disclaimer1"
                className="text-base text-gray-800 cursor-pointer select-none leading-relaxed"
              >
                <span className="font-bold text-[#19396c]">Acepto:</span> Debe obtener una
                Autorización Electrónica de Viaje (ETA-IL) antes de comprar
                cualquier pasaje a Israel. El Estado de Israel no se
                responsabiliza por daños derivados de la denegación o
                cancelación de la ETA-IL. Al enviar su solicitud, autoriza la
                transferencia de su información entre organismos públicos de
                Israel para fines migratorios. Si existen antecedentes penales,
                investigaciones, o prohibiciones migratorias, su solicitud podrá
                ser denegada o cancelada en cualquier momento. Toda la
                información brindada debe ser verdadera y exacta; proveer datos
                falsos puede resultar en sanciones legales. La ETA-IL solo
                permite llegar al control fronterizo y no garantiza el ingreso a
                Israel, quedando sujeto a la decisión del oficial en frontera.
              </label>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <button
                type="submit"
                disabled={!allAccepted}
                className={`px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                allAccepted
                    ? "bg-[#19396c] text-white hover:bg-[#102445]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:translate-y-0"
                }`}
            >
                Siguiente paso →
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">
          🔒 Tu información se transmite encriptada.
        </div>
        <div className="mb-2">
         {" "}
          <span className="font-semibold">ETA-IL</span>.
        </div>
        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos
          reservados
        </div>
      </footer>
    </main>
  );
}