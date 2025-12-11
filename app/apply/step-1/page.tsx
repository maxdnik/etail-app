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
      router.push("/apply/step-2");
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
        <div className="max-w-6xl mx-auto flex justify-between text-xs text-blue-950 font-medium">
          <span className="text-blue-900">Disclaimers</span>
          <span>Disclaimers</span>
          <span className="text-blue-900">Información de viaje</span>
          <span>Pasaporte</span>
          <span>Datos personales</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[16%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      {/* Disclaimers */}
      <form
        className="flex-1 flex flex-col justify-center items-center px-4"
        onSubmit={handleNext}
      >
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full space-y-6 border border-gray-100">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Términos y condiciones
          </h1>
          <div className="space-y-6">
            <div>
              <input
                id="disclaimer1"
                type="checkbox"
                checked={acceptDisclaimer1}
                onChange={(e) => setAcceptDisclaimer1(e.target.checked)}
                className="mr-3 accent-blue-950 w-5 h-5"
                required
              />
              <label
                htmlFor="disclaimer1"
                className="text-base font-medium cursor-pointer select-none"
              >
                <span className="font-bold">Acepto:</span> Debe obtener una
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
        </div>

        {/* Next button */}
        <button
          type="submit"
          disabled={!allAccepted}
          className={`mt-10 px-8 py-3 rounded-full font-bold text-lg shadow-md transition bg-blue-950 text-white ${
            allAccepted
              ? "hover:bg-blue-800"
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          Siguiente paso
        </button>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">
          🔒 Tu información se transmite encriptada y es revisada por
          profesionales en viajes internacionales.
        </div>
        <div className="mb-2">
          *  Brindamos
          asistencia para gestionar tu solicitud{" "}
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
