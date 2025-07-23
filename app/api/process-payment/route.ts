// @ts-nocheck
import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  const mercadopago = require('mercadopago');
  mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
  });

  try {
    const data = await req.json();

    let applicationData = null;
    if (data.applicationId) {
      const client = await clientPromise;
      const db = client.db();
      applicationData = await db.collection('etailapplications').findOne({ _id: new ObjectId(data.applicationId) });
      console.log('DEBUG applicationData:', applicationData); // Para debug
    }

    const payment_data = {
      transaction_amount: Number(data.transaction_amount) || 46,
      token: data.token,
      description: 'Trámite ETA-IL',
      installments: data.installments || 1,
      payment_method_id: data.payment_method_id,
      issuer_id: data.issuer_id,
      payer: {
        email: data.payer?.email,
        identification: data.payer?.identification,
      }
    };

    // Realizar el pago
    const mpRes = await mercadopago.payment.save(payment_data);

    // Si el pago fue aprobado, mandá el email
    if (
      mpRes.body?.status === "approved" ||
      mpRes.status === "approved"
    ) {
      // ------------ AJUSTE CLAVE: Campos anidados -----------------
      const nombreCompleto = `${applicationData?.passport?.name || ''} ${applicationData?.passport?.surname || ''}`.trim();
      const pasaporte = applicationData?.passport?.number || '-';
      const emailPersona = applicationData?.personal?.workEmail || data.payer?.email || '-';
      const pago = "Sí";
      const idApp = applicationData?._id?.toString() || data.applicationId || '-';

      // Podés sumar más datos relevantes, ejemplo:
      const fechaNacimiento = applicationData?.passport?.birthDate || '-';
      const paisEmision = applicationData?.passport?.country || '-';
      const telefono = applicationData?.personal?.mobile || '-';

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      });

      const subject = `🆕 Nueva Solicitud #${idApp}`;
      const html = `
        <div style="font-family: sans-serif; color: #222;">
          <h2 style="color: #1b3a6b;">¡Solicitud recibida!</h2>
          <p>Tu solicitud para obtener el permiso <b>ETA-IL</b> ha sido recibida correctamente y ya está siendo procesada.</p>
          <p><b>ID de solicitud:</b> #${idApp}</p>
          <p>En el transcurso de las próximas <b>24 horas</b> vas a recibir en este mismo correo electrónico el permiso correspondiente.</p>
          <p>Ante cualquier consulta, podés responder a este correo o escribirnos a <a href="mailto:contacto@israel-entrypiba.com">contacto@israel-entrypiba.com</a>.</p>
          <p style="margin-top:2em; color:#888; font-size:12px;">Este mensaje es automático, no requiere respuesta.</p>
        </div>
      `;

      const text =
        `¡Solicitud recibida!\n\n` +
        `Tu solicitud para obtener el permiso ETA-IL ha sido recibida correctamente y ya está siendo procesada.\n\n` +
        `ID de solicitud: #${idApp}\n\n` +
        `En el transcurso de las próximas 24 horas vas a recibir en este mismo correo electrónico el permiso correspondiente.\n\n` +
        `Ante cualquier consulta, podés responder a este correo o escribirnos a contacto@israel-entrypiba.com.\n\n` +
        `---\nEste mensaje es automático, no requiere respuesta.`;

      await transporter.sendMail({
        from: '"ETA-IL Notificación" <contacto@israel-entrypiba.com>',
        to: [
          "contacto@israel-entrypiba.com",
          emailPersona
        ],
        subject,
        text:
          `Nueva solicitud cargada en el sistema:\n` +
          `Nombre y Apellido: ${nombreCompleto}\n` +
          `Pasaporte: ${pasaporte}\n` +
          `Email: ${emailPersona}\n` +
          `Pago: ${pago}\n` +
          `ID: #${idApp}\n` +
          `País de emisión del pasaporte: ${paisEmision}\n` +
          `Fecha de nacimiento: ${fechaNacimiento}\n` +
          `Teléfono: ${telefono}\n`,
        html,
      });
    }

    return new Response(JSON.stringify(mpRes), { status: 200 });
  } catch (err: any) {
    console.error("Error en process-payment:", err);
    return new Response(JSON.stringify({ error: true, message: err.message || err }), { status: 500 });
  }
}
