// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Draft local “sí o sí” (sin backend). Mergea en localStorage bajo migratory.
function updateDraftLocal(patch) {
  try {
    const prev = JSON.parse(localStorage.getItem("etaIlDraft") || "{}");

    const next = {
      ...prev,
      ...patch,
      migratory: {
        ...(prev.migratory || {}),
        ...(patch?.migratory || {}),
      },
    };

    localStorage.setItem("etaIlDraft", JSON.stringify(next));
  } catch {}
}

export default function Step4b() {
  const router = useRouter();

  const [visitedIsrael, setVisitedIsrael] = useState("");
  const [recentVisitYear, setRecentVisitYear] = useState("");
  const [appliedVisa, setAppliedVisa] = useState("");
  const [visaDetails, setVisaDetails] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Precargar desde draft si existe
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem("etaIlDraft") || "{}");
      if (d?.migratory) {
        if (typeof d.migratory.visitedIsrael === "string") setVisitedIsrael(d.migratory.visitedIsrael);
        if (typeof d.migratory.recentVisitYear === "string") setRecentVisitYear(d.migratory.recentVisitYear);
        if (typeof d.migratory.appliedVisa === "string") setAppliedVisa(d.migratory.appliedVisa);
        if (typeof d.migratory.visaDetails === "string") setVisaDetails(d.migratory.visaDetails);
      }
    } catch {}
  }, []);

  // ✅ Guardar en draft cada vez que cambia algo (sí o sí)
  useEffect(() => {
    updateDraftLocal({
      migratory: {
        visitedIsrael,
        recentVisitYear,
        appliedVisa,
        visaDetails,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitedIsrael, recentVisitYear, appliedVisa, visaDetails]);

  // Helpers para botones Sí/No que también limpian campos condicionales
  const setVisitedIsraelAndClean = (val) => {
    setVisitedIsrael(val);
    if (val === "No") setRecentVisitYear("");
  };

  const setAppliedVisaAndClean = (val) => {
    setAppliedVisa(val);
    if (val === "No") setVisaDetails("");
  };

  const handleNext = async (e) => {
    e.preventDefault();

    // ✅ Mensajes claros (validaciones manuales)
    if (!visitedIsrael) {
      alert("Respondé si visitaste Israel anteriormente (No / Sí).");
      return;
    }
    if (visitedIsrael === "Sí" && !recentVisitYear) {
      alert("Completá el año de tu visita más reciente.");
      return;
    }
    if (!appliedVisa) {
      alert("Respondé si alguna vez solicitaste una visa / ETA-IL (No / Sí).");
      return;
    }
    if (appliedVisa === "Sí" && !visaDetails) {
      alert("Completá qué solicitaste y en qué año.");
      return;
    }

    // ✅ Guardar draft ANTES de cualquier cosa
    updateDraftLocal({
      migratory: {
        visitedIsrael,
        recentVisitYear: visitedIsrael === "Sí" ? String(recentVisitYear) : "",
        appliedVisa,
        visaDetails: appliedVisa === "Sí" ? String(visaDetails) : "",
      },
    });

    // ✅ FIX: NO bloquear por id en step4-b
    const id = localStorage.getItem("etaIlId");
    if (!id) {
      // Si no hay ID, igual avanzamos (comportamiento defensivo)
      router.push("/apply/step-5");
      return;
    }

    // Si hay id, intentamos postear, pero aunque falle: avanzamos igual
    setLoading(true);

    const body = {
      id,
      visitedIsrael,
      recentVisitYear: visitedIsrael === "Sí" ? recentVisitYear : null,
      appliedVisa,
      visaDetails: appliedVisa === "Sí" ? visaDetails : null,
    };

    try {
      await fetch("/api/migratory-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push("/apply/step-5");
    } catch (e) {
      // Si falla la API, avanzamos igual
      router.push("/apply/step-5");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/apply/step4");
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
          <span className="text-blue-900">Historial migratorio</span>
          <span>Revisión</span>
          <span>Pago</span>
        </div>
        <div className="max-w-6xl mx-auto h-2 bg-blue-200 rounded-full mt-2">
          <div className="w-[84%] h-full bg-blue-950 rounded-full"></div>
        </div>
      </section>

      <form
        onSubmit={handleNext}
        className="max-w-3xl w-full mx-auto bg-white shadow-lg rounded-xl px-8 py-10 my-10"
      >
        <h1 className="text-4xl font-extrabold text-[#19396c] mb-4">Historial migratorio</h1>
        <p className="text-red-600 mb-6 text-sm">
          Los campos marcados con <span className="font-bold">*</span> son obligatorios.
        </p>

        {/* PREGUNTA 1: ¿Visitaste Israel? */}
        <div className="border-l-4 border-orange-300 pl-4 mb-8">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">
            ¿Visitaste Israel anteriormente? <span className="text-red-500">*</span>
          </h2>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setVisitedIsraelAndClean("No")}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                visitedIsrael === "No"
                  ? "bg-blue-950 text-white border-blue-950"
                  : "border-blue-950 text-blue-950 bg-white"
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setVisitedIsraelAndClean("Sí")}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                visitedIsrael === "Sí"
                  ? "bg-blue-950 text-white border-blue-950"
                  : "border-blue-950 text-blue-950 bg-white"
              }`}
            >
              Sí
            </button>
          </div>

          {visitedIsrael === "Sí" && (
            <div className="mb-4">
              <label className="block mb-1 text-[#19396c] font-semibold">
                ¿En qué año fue tu visita más reciente? <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="recentVisitYear"
                placeholder="AAAA"
                value={recentVisitYear}
                onChange={(e) => setRecentVisitYear(e.target.value)}
                className="w-40 border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                min={1950}
                max={new Date().getFullYear()}
                required
              />
            </div>
          )}
        </div>

        {/* PREGUNTA 2: ¿Solicitaste Visa? */}
        <div className="border-l-4 border-orange-300 pl-4 mb-8">
          <h2 className="text-2xl font-bold text-[#19396c] mb-2">
            ¿Alguna vez solicitaste una visa israelí, ETA-IL o un permiso para visitar, vivir, trabajar o estudiar en Israel?{" "}
            <span className="text-red-500">*</span>
          </h2>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setAppliedVisaAndClean("No")}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                appliedVisa === "No"
                  ? "bg-blue-950 text-white border-blue-950"
                  : "border-blue-950 text-blue-950 bg-white"
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setAppliedVisaAndClean("Sí")}
              className={`px-6 py-3 rounded-lg border-2 font-bold text-lg ${
                appliedVisa === "Sí"
                  ? "bg-blue-950 text-white border-blue-950"
                  : "border-blue-950 text-blue-950 bg-white"
              }`}
            >
              Sí
            </button>
          </div>

          {appliedVisa === "Sí" && (
            <div className="mb-4">
              <label className="block mb-1 text-[#19396c] font-semibold">
                ¿Qué solicitaste? Contanos sobre tu solicitud <span className="text-red-500">*</span>
              </label>
              <textarea
                name="visaDetails"
                rows={3}
                placeholder="Describí qué tipo de visa, permiso o ETA-IL solicitaste y en qué año"
                value={visaDetails}
                onChange={(e) => setVisaDetails(e.target.value)}
                className="w-full border-2 border-[#19396c] rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="px-8 py-3 rounded-full border border-[#19396c] text-[#19396c] font-bold text-lg hover:bg-blue-50"
            onClick={handleBack}
            disabled={loading}
          >
            ← Volver
          </button>
          
          {/* BOTÓN ARREGLADO: Solo se deshabilita si está cargando. */}
          <button
            type="submit"
            className={`px-8 py-3 rounded-full font-bold text-lg transition ${
              loading 
                ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                : "bg-[#19396c] text-white hover:bg-[#162a4f]"
            }`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Siguiente →"}
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6 px-4 text-center text-sm text-gray-600">
        <div className="mb-2">🔒 Tu información se transmite encriptada</div>
        <div className="mb-2"></div>
        <div className="text-xs text-gray-400 mt-3">© {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados</div>
      </footer>
    </main>
  );
}