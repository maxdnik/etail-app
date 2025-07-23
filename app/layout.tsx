import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EtaIlProvider } from "@/lib/EtaIlContext"; // Ajusta el path si tu carpeta difiere

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
        {/* ...otros metatags */}
        <script src="https://sdk.mercadopago.com/js/v2"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EtaIlProvider>
          {children}
        </EtaIlProvider>
      </body>
    </html>
  );
}
