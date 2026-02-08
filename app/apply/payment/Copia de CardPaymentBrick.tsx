// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

export default function CardPaymentBrick({ onPaySuccess }) {
  const [rejectedMessage, setRejectedMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.MercadoPago) {
        const mp = new window.MercadoPago(
          "APP_USR-b0c78531-504a-4a73-ad56-78c99032fc8a", 
          { locale: "es-AR" }
        );

        mp.bricks().create("cardPayment", "paymentBrick_container", {
          initialization: {
            amount: 150, // ✅ Monto actualizado según tu resumen
          },
          callbacks: {
            onReady: () => {},
            onSubmit: async (cardFormData) => {
              try {
                // 1. Obtenemos el draft completo del localStorage
                const fullDraft = JSON.parse(localStorage.getItem("etaIlDraft") || "{}");
                const applicationId = localStorage.getItem("etaIlId");

                // 2. Enviamos el pago Y la información completa al backend
                const res = await fetch("/api/process-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...cardFormData, // Datos del pago (token, etc)
                    applicationId,   // ID por si ya existe un draft
                    formData: fullDraft // ✅ TODO EL FORMULARIO
                  }),
                });

                const result = await res.json();

                // 3. Verificamos aprobación
                if (result.status === "approved" || result.ok) {
                  // Limpiamos el draft si el pago fue exitoso
                  localStorage.removeItem("etaIlDraft");
                  localStorage.removeItem("etaIlId");
                  
                  onPaySuccess && onPaySuccess();
                } else {
                  setRejectedMessage(`❌ El pago fue rechazado: ${result.error || "Verificá los datos de la tarjeta"}`);
                }
              } catch (err) {
                setRejectedMessage("❌ Error al procesar el pago o guardar datos.");
              }
            },
            onError: (err) => {
              console.error(err);
              setRejectedMessage("❌ Error en el sistema de pagos.");
            },
          },
        });

        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onPaySuccess]);

  return (
    <div>
      {rejectedMessage && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-xl font-bold animate-shake">
          {rejectedMessage}
        </div>
      )}
      <div id="paymentBrick_container" />
    </div>
  );
}