import type { Metadata, Viewport } from "next";
import { Crimson_Text, Alex_Brush } from "next/font/google";
import "./globals.css";
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
        {/*
          Navbar lives OUTSIDE the isolation wrapper so Chrome's compositor
          never groups it with the 3D-transform layers inside pages.
          The fixed + backdrop-filter layer is now in its own top-level
          compositor slot, immune to children stacking context promotions.
        */}
        <Navbar />

        {/*
          isolation:isolate creates a new stacking context that CONTAINS
          every z-index, perspective, rotateX/Y layer inside pages.
          Chrome cannot promote those child layers above this boundary,
          which means they can never occlude the Navbar above.
        */}
        <div
          style={{
            isolation: "isolate",
            position: "relative",
            zIndex: 0,
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}