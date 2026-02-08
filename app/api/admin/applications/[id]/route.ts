import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const app = await EtaIlApplication.findById(id).lean();
    return NextResponse.json({ ok: true, data: app });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json(); 

    const updated = await EtaIlApplication.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).lean();

    return NextResponse.json({ ok: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}