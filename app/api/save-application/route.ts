// @ts-nocheck
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { applicationId, ...updateData } = body || {};

    // 1. Validar que tengamos datos para guardar
    if (!applicationId && Object.keys(updateData).length === 0) {
      return NextResponse.json({ ok: false, error: "No data provided" }, { status: 400 });
    }

    let result;

    if (applicationId) {
      // 2. ACTUALIZACIÓN INTELIGENTE: 
      // Usamos directamente updateData para no sobrescribir con objetos vacíos lo que no viene.
      result = await EtaIlApplication.findByIdAndUpdate(
        applicationId,
        { $set: updateData }, // Solo actualiza las claves presentes en el JSON enviado
        { new: true, upsert: false }
      ).lean();

      if (!result) {
        return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
      }
    } else {
      // 3. CREACIÓN:
      result = await EtaIlApplication.create(updateData);
    }

    return NextResponse.json({ 
      ok: true, 
      id: result._id?.toString?.() || result._id 
    });

  } catch (e: any) {
    console.error("save-application error:", e);
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}