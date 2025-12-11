// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

export default function CardPaymentBrick({ onPaySuccess }) {
  const [rejectedMessage, setRejectedMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.MercadoPago) {
        const mp = new window.MercadoPago(
          "APP_USR-b0c78531-504a-4a73-ad56-78c99032fc8a", // Usá tu key o process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
          { locale: "es-AR" }
        );

        mp.bricks().create("cardPayment", "paymentBrick_container", {
          initialization: {
            amount: 46,
          },
          callbacks: {
            onReady: () => {},
            onSubmit: async (cardFormData) => {
              try {
                const applicationId = localStorage.getItem("etaIlId");
                if (!applicationId) {
                  setRejectedMessage("No se encontró el ID de la aplicación. Recargá la página.");
                  return;
                }

                // ---- (1) Obtené TODOS los datos completos del usuario del localStorage ----
                const applicationData = JSON.parse(localStorage.getItem("applicationData") || "{}");

                // (2) PATCH: actualizá la aplicación en la base si lo necesitás (opcional)
                await fetch(`/api/etail-applications/${applicationId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(applicationData),
                });

                // ---- (3) Enviá el pago Y los datos completos al backend ----
                const res = await fetch("/api/process-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...cardFormData,
                    applicationId,
                    applicant: applicationData, // <<---- ESTE ES EL CAMBIO CLAVE!!
                  }),
                });

                const result = await res.json();

                if (result.status === "approved" || result.body?.status === "approved") {
                  onPaySuccess && onPaySuccess();
                } else {
                  setRejectedMessage(`❌ El pago fue rechazado: ${result.status_detail || "desconocido"}`);
                  setTimeout(() => location.reload(), 4000);
                }
              } catch (err) {
                setRejectedMessage("❌ Hubo un error al procesar el pago.");
                setTimeout(() => location.reload(), 4000);
              }
            },
            onError: (err) => {
              setRejectedMessage("❌ Error en el Brick.");
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
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
          {rejectedMessage}
        </div>
      )}
      <div id="paymentBrick_container" />
    </div>
  );
}
