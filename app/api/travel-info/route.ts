// @ts-nocheck
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  const client = await clientPromise;
  const travelData = await req.json(); // ← Acá está el fix

  try {
    const db = client.db();
    const result = await db.collection('applications').insertOne(travelData); // Usás travelData
    return NextResponse.json({ id: result.insertedId }); // Devuelve el ID
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error guardando en la base" }, { status: 500 });
  }
}
