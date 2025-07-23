// @ts-nocheck
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // tu helper de conexión
import EtaIlApplication from '@/lib/etaIlApplication'; // tu modelo mongoose

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  try {
    await EtaIlApplication.create(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error guardando en la base" }, { status: 500 });
  }
}
