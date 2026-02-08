import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

// ⚠️ IMPORTANTE: En producción, aquí debes agregar verificación de sesión (Auth)
// para que solo los administradores puedan ver esto.

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Obtenemos todas, ordenadas por fecha (más nuevas primero)
    const applications = await EtaIlApplication.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, data: applications });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}