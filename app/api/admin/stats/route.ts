// @ts-nocheck
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EtaIlApplication from "@/lib/etaIlApplication";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const today = startOfDay(now);
    const thisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const thisMonth = startOfMonth(now);

    const PRICE_PER_APP = 89500; // Tu precio por trámite

    // ✅ Filtro estricto: Solo lo que ya está "CARGADO"
    const queryCargado = { status: "CARGADO" };

    // 1. Cálculos de contadores
    const [dayCount, weekCount, monthCount, totalCount] = await Promise.all([
      EtaIlApplication.countDocuments({ ...queryCargado, updatedAt: { $gte: today } }),
      EtaIlApplication.countDocuments({ ...queryCargado, updatedAt: { $gte: thisWeek } }),
      EtaIlApplication.countDocuments({ ...queryCargado, updatedAt: { $gte: thisMonth } }),
      EtaIlApplication.countDocuments(queryCargado),
    ]);

    // 2. ✅ Agregación Mes a Mes (Historial)
    const monthlyHistory = await EtaIlApplication.aggregate([
      { $match: queryCargado },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 } // Últimos 6 meses
    ]);

    // Mapear nombres de meses
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const historyFormatted = monthlyHistory.map(item => ({
      label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      qty: item.count,
      income: item.count * PRICE_PER_APP
    })).reverse();

    return NextResponse.json({
      ok: true,
      stats: {
        qty: {
          day: dayCount,
          week: weekCount,
          month: monthCount,
          total: totalCount
        },
        income: {
          day: dayCount * PRICE_PER_APP,
          week: weekCount * PRICE_PER_APP,
          month: monthCount * PRICE_PER_APP,
          total: totalCount * PRICE_PER_APP
        },
        history: historyFormatted // ✅ Enviamos el historial al frontend
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}