// @ts-nocheck
import { NextResponse } from 'next/server';
import * as mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: Request) {
  try {
    // Parámetros de la preferencia
    // Si necesitás, recibí datos del body:
    // const body = await req.json();

    const preference = {
      items: [
        {
          title: 'Trámite ETA-IL',
          unit_price: 46,
          currency_id: 'AR',
          quantity: 1,
        },
      ],
      // Puedes sumar payer, back_urls, etc si lo necesitas
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/apply/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/apply/payment?error=true`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/apply/payment?pending=true`,
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);

    return NextResponse.json({ id: response.body.id });
  } catch (e: any) {
    console.error('Error al crear preferencia de MercadoPago', e);
    return NextResponse.json({ error: 'Error al crear preferencia de MercadoPago' }, { status: 500 });
  }
}
