// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";

export default function CardPaymentBrick({ onPaySuccess }) {
  const [rejectedMessage, setRejectedMessage] = useState("");
  const controllerRef = useRef(null); // ✅ Para controlar y limpiar la instancia

  useEffect(() => {
    const initBrick = async () => {
      // 1. Esperamos a que el SDK esté disponible en el objeto window
      if (typeof window !== "undefined" && window.MercadoPago) {
        
        // 2. Si ya hay una instancia activa (por navegación rápida), la cerramos
        if (controllerRef.current) {
          try { 
            controllerRef.current.unmount(); 
          } catch (e) { 
            console.log("Nada que desmontar"); 
          }
        }

        const mp = new window.MercadoPago(
          "APP_USR-b0c78531-504a-4a73-ad56-78c99032fc8a", 
          { locale: "es-AR" }
        );

        const bricksBuilder = mp.bricks();

        try {
          // 3. Creamos el Brick y guardamos el controlador en la Ref
          controllerRef.current = await bricksBuilder.create(
            "cardPayment", 
            "paymentBrick_container", 
            {
              initialization: { amount: 89500 },
              callbacks: {
                onReady: () => console.log("Brick listo"),
                onSubmit: async (cardFormData) => {
                  const fullDraft = JSON.parse(localStorage.getItem("etaIlDraft") || "{}");
                  const applicationId = localStorage.getItem("etaIlId");

                  const res = await fetch("/api/process-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...cardFormData,
                      applicationId,
                      formData: fullDraft 
                    }),
                  });

                  const result = await res.json();
                  if (result.status === "approved" || result.ok) {
                    localStorage.removeItem("etaIlDraft");
                    localStorage.removeItem("etaIlId");
                    onPaySuccess && onPaySuccess();
                  } else {
                    setRejectedMessage(`❌ Pago rechazado: ${result.error || "Intente con otra tarjeta"}`);
                  }
                },
                onError: (error) => {
                  console.error(error);
                  setRejectedMessage("❌ Error al cargar la pasarela.");
                },
              },
            }
          );
        } catch (e) {
          console.error("Error al crear Brick:", e);
        }
      }
    };

    // Pequeño retardo para asegurar que el div del DOM esté renderizado
    const timer = setTimeout(initBrick, 100);

    return () => {
      clearTimeout(timer);
      // ✅ IMPORTANTE: Desmontamos el brick al salir de la página
      if (controllerRef.current) {
        try { controllerRef.current.unmount(); } catch (e) {}
      }
    };
  }, [onPaySuccess]);

  return (
    <div className="w-full">
      {rejectedMessage && (
        <div className="mb-4 p-4 text-red-800 bg-red-50 border-l-4 border-red-600 rounded font-bold animate-pulse">
          {rejectedMessage}
        </div>
      )}
      {/* Contenedor del Brick */}
      <div id="paymentBrick_container" className="min-h-[450px]" />
    </div>
  );
}