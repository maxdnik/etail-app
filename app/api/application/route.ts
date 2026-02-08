// app/api/application/route.ts
// @ts-nocheck

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const doc = await EtaIlApplication.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
    }

    // 🔥 Normalizar: soporta docs guardados con distintos nombres
    const travel =
      doc.travel ??
      doc.travelInfo ??
      doc.travel_info ??
      doc.travelData ??
      doc.travel_data ??
      {};

    const passport =
      doc.passport ??
      doc.passportInfo ??
      doc.passport_info ??
      doc.passportData ??
      doc.passport_data ??
      {};

    const personal =
      doc.personal ??
      doc.personalInfo ??
      doc.personal_info ??
      doc.personalData ??
      doc.personal_data ??
      {};

    const declaration =
      doc.declaration ??
      doc.declarationInfo ??
      doc.declaration_info ??
      doc.declarationData ??
      doc.declaration_data ??
      {};

    return NextResponse.json({
      ok: true,
      data: {
        _id: doc._id?.toString?.() || doc._id,
        travel,
        passport,
        personal,
        declaration,
      },
    });
  } catch (error: any) {
    console.error("GET /api/application error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}