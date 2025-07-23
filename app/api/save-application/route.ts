// @ts-nocheck
// app/api/save-application/route.ts
import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Ajusta el import si tu path es diferente
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { applicationId, ...fields } = data;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('etailapplications');

    let result;
    if (applicationId) {
      // Actualizar datos existentes
      result = await collection.updateOne(
        { _id: new ObjectId(applicationId) },
        { $set: fields }
      );
    } else {
      // Crear nueva aplicación
      result = await collection.insertOne(fields);
    }

    return new Response(JSON.stringify({
      ok: true,
      applicationId: applicationId || result.insertedId,
    }), { status: 200 });
  } catch (err: any) {
    console.error("Error en save-application:", err);
    return new Response(JSON.stringify({ error: true, message: err.message || err }), { status: 500 });
  }
}

