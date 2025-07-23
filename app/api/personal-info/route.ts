// @ts-nocheck
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  const client = await clientPromise
  const body = await req.json()
  const { id, ...personalData } = body

  if (!id) return NextResponse.json({ error: 'ID de aplicación no recibido' }, { status: 400 })

  try {
    const db = client.db()
    // Actualiza la app agregando "personal" como subdocumento
    await db.collection('applications').updateOne(
      { _id: typeof id === 'string' ? new (require('mongodb').ObjectId)(id) : id },
      { $set: { personal: personalData } }
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error guardando en la base' }, { status: 500 })
  }
}
