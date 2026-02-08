// @ts-nocheck
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EtaIlProvider } from "@/lib/EtaIlContext";
import Script from "next/script"; // ✅ Importación necesaria para optimizar scripts

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ETAIL",
  description: "Permisos de entrada a Israel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* ✅ Cargamos el SDK de Mercado Pago con prioridad máxima */}
        <Script
          src="https://sdk.mercadopago.com/js/v2"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EtaIlProvider>
          {children}
        </EtaIlProvider>
      </body>
    </html>
  );
}