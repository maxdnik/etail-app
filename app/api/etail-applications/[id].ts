// @ts-nocheck
// pages/api/etail-applications/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { id } = req.query;
    const data = req.body;

    const client = await clientPromise;
    const db = client.db();

    const updated = await db.collection('etailapplications').findOneAndUpdate(
      { _id: new ObjectId(id as string) },
      { $set: data },
      { returnDocument: 'after' }
    );

    return res.status(200).json(updated.value);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
