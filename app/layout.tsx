import type { Metadata, Viewport } from "next";
import { Crimson_Text, Alex_Brush } from "next/font/google";
import "./globals.css";
// IMPORTA ELA AQUI 👇
import Navbar from "@/components/Navbar"; 

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://casamento-dc.vercel.app"),
  title: "Camila & Davi — Casamento",
  description: "Convite de casamento — 04 de Julho de 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${crimson.variable} ${alexBrush.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
          {/* RENDERIZA ELA AQUI 👇 */}
          <Navbar />
          {children}
      </body>
    </html>
  );
}