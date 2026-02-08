// app/api/passport-info/route.ts
// @ts-nocheck

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const { id, ...passportData } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const updated = await EtaIlApplication.findByIdAndUpdate(
      id,
      {
        $set: {
          passport: passportData,
        },
      },
      {
        new: true,
        runValidators: false,
      }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      passport: updated.passport || {},
    });

  } catch (error: any) {

    console.error("passport-info error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}