// @ts-nocheck
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getDraft, updateDraft } from "@/lib/draft";

export default function ReviewPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    travel: {},
    passport: {},
    personal: {},
    migratory: {},
    declaration: {},
  });

  const [loading, setLoading] = useState(true);

  // Estados de confirmación visual
  const [confirmedSections, setConfirmedSections] = useState({
    travel: false,
    passport: false,
    personal: false,
    migratory: false,
    declaration: false,
  });

  // Estados de acordeón (abierto/cerrado)
  const [open, setOpen] = useState({
    travel: true,
    passport: true,
    personal: true,
    migratory: true,
    declaration: true,
  });

  const PASSPORT_LABELS = {
    docType: "Tipo de documento",
    number: "Número de pasaporte",
    country: "País de emisión",
    nationality: "Nacionalidad",
    biometric: "¿Pasaporte biométrico?",
    surname: "Apellido",
    name: "Nombre/s",
    issueDate: "Fecha de emisión",
    expiryDate: "Fecha de vencimiento",
    birthDate: "Fecha de nacimiento",
    birthCountry: "Lugar de nacimiento",
    gender: "Género",
  };

  const PERSONAL_LABELS = {
    nacionalidadAdicional: "Otra nacionalidad o ciudadanía",
    numeroIdIsrael: "Número de ID israelí",
    estadoCivil: "Estado civil",
    padreNombre: "Nombre del padre",
    padreApellido: "Apellido del padre",
    madreNombre: "Nombre de la madre",
    madreApellido: "Apellido de la madre",
    telefonoMovil: "Teléfono móvil",
    telefonoAdicional: "Teléfono adicional",
    domicilioPais: "País",
    domicilioCiudad: "Ciudad",
    ocupacion: "Situación laboral",
    orgNombre: "Nombre de la empresa",
    puesto: "Puesto / Cargo",
    telefonoTrabajo: "Teléfono laboral",
    emailTrabajo: "Email laboral",
  };

  useEffect(() => {
    const draft = getDraft();
    setFormData({
      travel: draft.travel || {},
      passport: draft.passport || {},
      personal: draft.personal || {},
      migratory: draft.migratory || {},
      declaration: draft.declaration || {},
    });
    setLoading(false);
  }, []);

  const toggleSection = (section) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleConfirm = (section) => {
    setConfirmedSections((prev) => ({ ...prev, [section]: true }));
    setOpen((prev) => ({ ...prev, [section]: false }));
  };

  // ---------- helpers ----------
  const pad2 = (v) => String(v || "").padStart(2, "0");

  const normalizeISODateLoose = (raw) => {
    if (!raw) return "";
    const s = String(raw).trim();
    if (!s) return "";
    const cleaned = s.replace(/[./]/g, "-");
    const parts = cleaned.split("-").filter(Boolean);
    if (parts.length !== 3) return "";
    const [yy, mm, dd] = parts;
    const y = parseInt(yy, 10);
    const m = parseInt(mm, 10);
    const d = parseInt(dd, 10);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return "";
    if (y < 1900 || y > 2100) return "";
    if (m < 1 || m > 12) return "";
    if (d < 1 || d > 31) return "";
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
      return "";
    }
    return `${y}-${pad2(m)}-${pad2(d)}`;
  };

  const buildISODateFromParts = (yy, mm, dd) => {
    const y = String(yy || "").trim();
    const m = String(mm || "").trim();
    const d = String(dd || "").trim();
    if (!y || !m || !d) return "";
    return normalizeISODateLoose(`${y}-${m}-${d}`);
  };

  const display = (v) => {
    const s = String(v ?? "").trim();
    return s ? s : "-";
  };

  // ---------- normalize payload ----------
  const normalized = useMemo(() => {
    const travel = formData.travel || {};
    const passport = formData.passport || {};
    const personal = formData.personal || {};
    const migratory = formData.migratory || {};
    const declaration = formData.declaration || {};

    // TRAVEL
    const travelArrival = normalizeISODateLoose(travel.arrival);
    const normalizedTravel = {
      purpose: travel.purpose || "",
      arrival: travelArrival || "",
      stay: travel.stay || "",
    };

    // PASSPORT
    const issueDate =
      normalizeISODateLoose(passport.issueDate) ||
      buildISODateFromParts(passport.issueYear, passport.issueMonth, passport.issueDay) ||
      "";
    const expiryDate =
      normalizeISODateLoose(passport.expiryDate) ||
      buildISODateFromParts(passport.expiryYear, passport.expiryMonth, passport.expiryDay) ||
      "";
    const birthDate =
      normalizeISODateLoose(passport.birthDate) ||
      buildISODateFromParts(passport.birthYear, passport.birthMonth, passport.birthDay) ||
      "";

    const normalizedPassport = {
      docType: passport.docType || passport.type || "",
      number: passport.number || passport.passportNumber || "",
      country: passport.country || passport.countryCode || "",
      nationality: passport.nationality || "",
      biometric: passport.biometric || "",
      surname: passport.surname || "",
      name: passport.name || passport.givenName || "",
      issueDate,
      expiryDate,
      birthDate,
      birthCountry: passport.birthCountry || passport.placeOfBirth || passport.birthPlace || "",
      gender: passport.gender || "",
    };

    // PERSONAL
    const normalizedPersonal = { ...personal };

    // MIGRATORY
    const normalizedMigratory = {
       visitedIsrael: migratory.visitedIsrael || "No",
       recentVisitYear: migratory.recentVisitYear || "",
       appliedVisa: migratory.appliedVisa || "No",
       visaDetails: migratory.visaDetails || ""
    };

    return {
      travel: normalizedTravel,
      passport: normalizedPassport,
      personal: normalizedPersonal,
      migratory: normalizedMigratory,
      declaration,
    };
  }, [formData]);

  // ✅ AJUSTE: No guardamos en el Backend aquí. Solo actualizamos el LocalStorage y vamos al pago.
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Actualizamos el draft en el navegador con la declaración jurada aceptada
    updateDraft({
        ...formData,
        travel: normalized.travel,
        passport: normalized.passport,
        personal: normalized.personal,
        migratory: normalized.migratory,
        declaration: normalized.declaration
    });

    // Redirigimos directamente a la página de pago. 
    // Los datos se enviarán a la base de datos desde /api/process-payment solo si el cobro es exitoso.
    router.push("/apply/payment");
  };

  const ocupacion = String(normalized.personal?.ocupacion || "").trim();
  const showWorkFields = ocupacion === "Empleado" || ocupacion === "Autónomo";
  const showIsraelIdField = normalized.personal?.nacionalidadAdicional === "Israel";

  if (loading) return <div className="p-10 text-xl text-center">Cargando datos...</div>;

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-gray-800 font-sans flex flex-col">
      <nav className="bg-blue-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">ETA-IL</div>
        <Link href="/" className="hover:underline text-sm">
          Volver al inicio
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-3xl font-bold text-blue-950 mb-2 text-center">Revisar y confirmar solicitud</h1>
        <p className="text-center text-gray-600 mb-10">
          Verificá que toda la información esté correcta antes de continuar al pago.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TRAVEL */}
          <div className="bg-[#eef4ff] border border-blue-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => toggleSection("travel")}>
              <div className="text-2xl font-semibold text-blue-950">Información de viaje</div>
              <div className="flex items-center gap-4">
                {confirmedSections.travel && <span className="w-4 h-4 bg-green-500 rounded-full inline-block" />}
                <span className="text-blue-950 text-2xl">{open.travel ? "▲" : "▼"}</span>
              </div>
            </div>
            {open.travel && (
              <div className="px-6 pb-6 pt-2 border-t border-blue-100">
                <div className="space-y-3 text-lg">
                  <div><b>Motivo principal del viaje:</b> {display(normalized.travel?.purpose)}</div>
                  <div><b>Fecha de llegada:</b> {display(normalized.travel?.arrival)}</div>
                  <div><b>Duración estimada de la estadía:</b> {display(normalized.travel?.stay)}</div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => handleConfirm("travel")} className="bg-blue-950 text-white px-6 py-2 rounded-full font-semibold">Confirmar sección</button>
                </div>
              </div>
            )}
          </div>

          {/* PASSPORT */}
          <div className="bg-[#eef4ff] border border-blue-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => toggleSection("passport")}>
              <div className="text-2xl font-semibold text-blue-950">Datos del pasaporte</div>
              <div className="flex items-center gap-4">
                {confirmedSections.passport && <span className="w-4 h-4 bg-green-500 rounded-full inline-block" />}
                <span className="text-blue-950 text-2xl">{open.passport ? "▲" : "▼"}</span>
              </div>
            </div>
            {open.passport && (
              <div className="px-6 pb-6 pt-2 border-t border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  {Object.entries(PASSPORT_LABELS).map(([key, label]) => (
                    <div key={key} className="flex justify-between items-center border-b border-blue-100 pb-2">
                      <span>{label}:</span>
                      <span className="font-semibold text-right">{display(normalized.passport?.[key])}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => handleConfirm("passport")} className="bg-blue-950 text-white px-6 py-2 rounded-full font-semibold">Confirmar sección</button>
                </div>
              </div>
            )}
          </div>

          {/* PERSONAL */}
          <div className="bg-[#eef4ff] border border-blue-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => toggleSection("personal")}>
              <div className="text-2xl font-semibold text-blue-950">Datos personales</div>
              <div className="flex items-center gap-4">
                {confirmedSections.personal && <span className="w-4 h-4 bg-green-500 rounded-full inline-block" />}
                <span className="text-blue-950 text-2xl">{open.personal ? "▲" : "▼"}</span>
              </div>
            </div>
            {open.personal && (
              <div className="px-6 pb-6 pt-2 border-t border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  {Object.entries(PERSONAL_LABELS)
                    .filter(([key]) => {
                      if (key === "numeroIdIsrael" && !showIsraelIdField) return false;
                      if (!showWorkFields && ["orgNombre", "puesto", "telefonoTrabajo", "emailTrabajo"].includes(key)) return false;
                      return true;
                    })
                    .map(([key, label]) => (
                      <div key={key} className="flex justify-between items-center border-b border-blue-100 pb-2">
                        <span>{label}:</span>
                        <span className="font-semibold text-right">{display(normalized.personal?.[key])}</span>
                      </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => handleConfirm("personal")} className="bg-blue-950 text-white px-6 py-2 rounded-full font-semibold">Confirmar sección</button>
                </div>
              </div>
            )}
          </div>

          {/* MIGRATORY */}
          <div className="bg-[#eef4ff] border border-blue-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => toggleSection("migratory")}>
              <div className="text-2xl font-semibold text-blue-950">Historial Migratorio</div>
              <div className="flex items-center gap-4">
                {confirmedSections.migratory && <span className="w-4 h-4 bg-green-500 rounded-full inline-block" />}
                <span className="text-blue-950 text-2xl">{open.migratory ? "▲" : "▼"}</span>
              </div>
            </div>
            {open.migratory && (
              <div className="px-6 pb-6 pt-2 border-t border-blue-100">
                <div className="space-y-3 text-lg">
                  <div><b>Visitó Israel antes:</b> {normalized.migratory?.visitedIsrael}</div>
                  {normalized.migratory?.visitedIsrael === "Sí" && (
                     <div><b>Año última visita:</b> {normalized.migratory?.recentVisitYear}</div>
                  )}
                  <div><b>Solicitó Visa antes:</b> {normalized.migratory?.appliedVisa}</div>
                  {normalized.migratory?.appliedVisa === "Sí" && (
                     <div><b>Detalles:</b> {normalized.migratory?.visaDetails}</div>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => handleConfirm("migratory")} className="bg-blue-950 text-white px-6 py-2 rounded-full font-semibold">Confirmar sección</button>
                </div>
              </div>
            )}
          </div>

          {/* DECLARATION */}
          <div className="bg-[#eef4ff] border border-blue-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => toggleSection("declaration")}>
              <div className="text-2xl font-semibold text-blue-950">Declaración jurada</div>
              <div className="flex items-center gap-4">
                {confirmedSections.declaration && <span className="w-4 h-4 bg-green-500 rounded-full inline-block" />}
                <span className="text-blue-950 text-2xl">{open.declaration ? "▲" : "▼"}</span>
              </div>
            </div>

            {open.declaration && (
              <div className="px-6 pb-6 pt-2 border-t border-blue-100">
                <p className="mb-4 text-lg text-gray-800 leading-relaxed">
                  Declaro que la información provista es verídica, completa y correcta. Entiendo que la aprobación de la ETA-IL no garantiza el ingreso a Israel, sujeto a control migratorio.
                  <br /><br />
                  Autorizo el uso de mis datos según los fines del trámite y certifico no tener impedimentos legales ni sanitarios para el ingreso.
                </p>
                
                <label className="flex items-center mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="checkbox"
                    className="mr-3 h-5 w-5 accent-blue-950"
                    checked={!!formData.declaration?.confirmed}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      declaration: {
                        ...prev.declaration,
                        confirmed: e.target.checked,
                      },
                    }))}
                  />
                  <span className="font-bold text-[#19396c] text-lg">Confirmo la declaración jurada</span>
                </label>

                <div className="flex justify-end items-center gap-4 mt-6">
                  <button 
                    type="button" 
                    className="underline text-blue-800 text-sm hover:text-blue-950" 
                    onClick={() => alert("Debes volver al inicio para reiniciar el trámite.")}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={`bg-blue-950 text-white px-6 py-2 rounded-full font-semibold transition ${!formData.declaration?.confirmed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#162a4f]'}`}
                    disabled={!formData.declaration?.confirmed}
                    onClick={() => handleConfirm('declaration')}
                  >
                    Confirmar sección
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={!confirmedSections.travel || !confirmedSections.passport || !confirmedSections.personal || !confirmedSections.migratory || !confirmedSections.declaration}
              className="bg-blue-950 disabled:opacity-40 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-md transition hover:scale-105 disabled:hover:scale-100"
            >
              Continuar al pago
            </button>
          </div>
        </form>
      </section>

      <footer className="bg-blue-950 text-white py-6 px-6 text-center">
        <div className="text-sm">
          ¿Necesitás ayuda? Escribinos a{" "}
          <a className="underline" href="mailto:contacto@israel-entrypiba.com">
            contacto@israel-entrypiba.com
          </a>
        </div>
        <div className="text-xs text-gray-400 mt-3">© {new Date().getFullYear()} ETA-IL Ayuda | Todos los derechos reservados</div>
      </footer>
    </main>
  );
}