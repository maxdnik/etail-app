// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function POST(req: NextRequest) {
  const mercadopago = require("mercadopago");
  mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
  });

  try {
    const data = await req.json();
    const { formData, applicationId, token, transaction_amount, installments, payment_method_id, issuer_id, payer } = data;

    await dbConnect();

    const payment_data = {
      transaction_amount: Number(transaction_amount) || 89500,
      token: token,
      description: "Trámite ETA-IL Israel",
      installments: installments || 1,
      payment_method_id: payment_method_id,
      issuer_id: issuer_id,
      payer: {
        email: payer?.email,
        identification: payer?.identification,
      },
    };

    const mpRes = await mercadopago.payment.save(payment_data);
    const isApproved = mpRes?.body?.status === "approved" || mpRes?.status === "approved";

    if (isApproved) {
      const finalData = {
        ...formData,
        status: "PENDIENTE",
        paymentId: mpRes?.body?.id || mpRes?.id,
        updatedAt: new Date()
      };

      let savedApp = null;

      // ✅ MEJORA DE PERSISTENCIA:
      if (applicationId) {
        // Intentamos actualizar
        savedApp = await EtaIlApplication.findByIdAndUpdate(
          applicationId, 
          { $set: finalData }, 
          { new: true }
        );
      }

      // ✅ SI EL REGISTRO NO EXISTÍA (o el ID era viejo), LO CREAMOS DE CERO
      if (!savedApp) {
        console.log("ID no encontrado o inexistente, creando nuevo registro...");
        savedApp = await EtaIlApplication.create(finalData);
      }

      // 4. Preparar datos para el Email (Usamos el ID REAL de la base de datos)
      const idApp = savedApp._id.toString(); 
      const shortId = idApp.substring(idApp.length - 5); // ✅ Ajuste para mostrar solo 5 dígitos
      const nombreCompleto = `${formData?.passport?.name || ""} ${formData?.passport?.surname || ""}`.trim();
      const emailDeRegistro = formData?.contactEmail || "-";
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const subject = `🆕 Nueva Solicitud #${shortId}`; // ✅ ID corto en el asunto
      
      const html = `
        <div style="font-family: sans-serif; color: #222; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #19396c; border-bottom: 2px solid #19396c; padding-bottom: 10px;">¡Solicitud recibida!</h2>
          <p>Hola <b>${nombreCompleto}</b>,</p>
          <p>Tu solicitud para obtener el permiso <b>ETA-IL</b> ha sido recibida y pagada correctamente.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 14px;"><b>ID de solicitud:</b> <span style="font-family: monospace;">#${shortId}</span></p>
            <p style="margin: 5px 0; font-size: 14px;"><b>Email de contacto:</b> ${emailDeRegistro}</p>
          </div>

          <p>En el transcurso de las próximas <b>24 a 72 horas</b> vas a recibir novedades en este mismo correo.</p>
          <p>Ante cualquier consulta, escribinos a <a href="mailto:contacto@israel-entrypiba.com" style="color: #19396c; font-weight: bold; text-decoration: none;">contacto@israel-entrypiba.com</a>.</p>
        </div>
      `;

      await transporter.sendMail({
        from: '"ETA-IL Notificación" <contacto@israel-entrypiba.com>',
        to: ["contacto@israel-entrypiba.com", emailDeRegistro], 
        subject,
        html,
        text: `Solicitud recibida para ${nombreCompleto}. ID: ${shortId}. Email Registro: ${emailDeRegistro}. Pago: Aprobado.` // ✅ ID corto en texto plano
      });
    }

    return NextResponse.json(mpRes.body || mpRes);

  } catch (err: any) {
    console.error("Error en process-payment:", err);
    return NextResponse.json(
      { error: true, message: err?.message || "Error al procesar el pago" },
      { status: 500 }
    );
  }
}