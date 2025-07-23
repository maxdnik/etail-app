// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';

export default function CardPaymentBrick({ preferenceId, onReady, onError }) {
  const brickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preferenceId || !window.MercadoPago) return;
    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'es-AR' });

    mp.bricks().create('cardPayment', 'cardPaymentBrick_container', {
      initialization: {
        amount: 46, // USD, o lo que corresponda
        preferenceId,
      },
      customization: {
        visual: { style: { theme: 'dark' } }
      },
      callbacks: {
        onReady,
        onError,
        onSubmit: async (formData) => {
          // El pago se maneja desde el backend de Mercado Pago automáticamente
        },
      },
    });

    return () => {
      // Cleanup si hace falta
      if (brickRef.current) brickRef.current.innerHTML = '';
    };
  }, [preferenceId]);

  return <div id="cardPaymentBrick_container" ref={brickRef} />;
}
