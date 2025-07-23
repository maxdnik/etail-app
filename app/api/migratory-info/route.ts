// @ts-nocheck
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; // Necesario para buscar por _id

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();

  const body = await req.json();
  const { id, ...migratoryData } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID de solicitud no recibido.' }, { status: 400 });
  }

  try {
    // Actualiza la aplicación sumando/actualizando el campo migratory
    const result = await db.collection('applications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { migratory: migratoryData } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'No se encontró la aplicación para ese ID.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error actualizando en la base.' }, { status: 500 });
  }
}
