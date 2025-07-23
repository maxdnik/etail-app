// @ts-nocheck
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Buscar aplicación por ID
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  try {
    const data = await db.collection('applications').findOne({ _id: new ObjectId(id) });
    if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    // Podés ocultar el _id si no lo querés exponer
    // delete data._id;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Error trayendo la aplicación.' }, { status: 500 });
  }
}

// PATCH: Actualizar cualquier campo de la aplicación
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();

    // Construimos el $set dinámico según qué campos quieras actualizar
    let setObj = {};
    if (fields.travel) {
      // Si recibís travel, mapeá a tus campos correctos
      setObj.purpose = fields.travel.purpose;
      setObj.arrival = fields.travel.arrival;
      setObj.duration = fields.travel.stay;
    }
    if (fields.passport) setObj.passport = fields.passport;
    if (fields.personal) setObj.personal = fields.personal;
    if (fields.migratory) setObj.migratory = fields.migratory;
    // Agregá más según tu estructura

    // Validación simple
    if (Object.keys(setObj).length === 0) {
      return NextResponse.json({ error: 'No se enviaron campos a actualizar' }, { status: 400 });
    }

    const result = await db.collection('applications').updateOne(
      { _id: new ObjectId(id) },
      { $set: setObj }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No se encontró la aplicación para actualizar.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error actualizando la aplicación.' }, { status: 500 });
  }
}
