// @ts-nocheck

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  const client = await clientPromise;
  const body = await req.json();
  const { id, ...passportData } = body;
  try {
    const db = client.db();
    // El id recibido debería ser string, convertir a ObjectId:
    const { ObjectId } = require('mongodb');
    await db.collection('applications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { passport: passportData } }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error guardando en la base" }, { status: 500 });
  }
}

