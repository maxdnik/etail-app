// @ts-nocheck

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    
    // ✅ Extraemos también 'migratory' del body
    const { applicationId, travel, passport, personal, migratory, declaration } = body || {};

    let result;

    if (applicationId) {
      // CASO 1: Ya existe un ID, actualizamos el documento existente
      result = await EtaIlApplication.findByIdAndUpdate(
        applicationId,
        {
          $set: {
            travel: travel || {},
            passport: passport || {},
            personal: personal || {},
            migratory: migratory || {}, // ✅ Guardamos la sección migratoria
            declaration: declaration || {},
          },
        },
        { new: true, upsert: false } // upsert: false porque si envían un ID invalido, preferimos que falle a crear uno raro
      ).lean();

      if (!result) {
        return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
      }

    } else {
      // CASO 2: No hay ID (es la primera vez que se guarda en BD), creamos uno nuevo
      result = await EtaIlApplication.create({
        travel: travel || {},
        passport: passport || {},
        personal: personal || {},
        migratory: migratory || {}, // ✅
        declaration: declaration || {},
      });
    }

    // Devolvemos ok: true y el ID (sea el viejo o el nuevo generado)
    return NextResponse.json({ 
      ok: true, 
      id: result._id?.toString?.() || result._id 
    });

  } catch (e: any) {
    console.error("save-application error:", e);
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}