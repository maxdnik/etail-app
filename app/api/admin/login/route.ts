// @ts-nocheck
import { NextResponse } from "next/server";
import { SignJWT } from "jose"; // Necesitas instalarlo: npm install jose
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validar contra variables de entorno
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Crear un token JWT simple
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2h") // El acceso dura 2 horas
        .sign(secret);

      // Guardar en cookie HTTP-only (segura)
      const response = NextResponse.json({ ok: true });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7200, // 2 horas en segundos
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { ok: false, error: "Credenciales inválidas" },
      { status: 401 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}