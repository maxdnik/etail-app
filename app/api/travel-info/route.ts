// app/api/travel-info/route.ts
// @ts-nocheck

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { id, ...travelData } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const updated = await EtaIlApplication.findByIdAndUpdate(
      id,
      { $set: { travel: travelData } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("travel-info error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}