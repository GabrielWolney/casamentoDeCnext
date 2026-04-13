import type { Metadata, Viewport } from "next";
import { Crimson_Text, Alex_Brush, Poppins } from "next/font/google"; // 1. Adicionamos a Poppins aqui
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

// 2. Configuramos a Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
  metadataBase: new URL('https://davi-e-camila.vercel.app'), 
  title: "Camila & Davi — Casamento",
  description: "Temos a alegria de convidar você para o nosso casamento. 04 de Julho de 2026.",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Camila & Davi — Nosso Casamento",
    description: "Você é nosso convidado especial! Confirme sua presença e veja os detalhes do nosso grande dia.",
    siteName: "Casamento Camila & Davi",
    images: [{
      url: '/share-image.webp', 
      width: 1200,
      height: 630,
      alt: 'Convite de Casamento - Camila & Davi',
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Camila & Davi — Nosso Casamento",
    description: "Confirme sua presença e veja os detalhes do nosso grande dia.",
    images: ['/share-image.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      // 3. Injetamos a variável da Poppins no HTML
      className={`${crimson.variable} ${alexBrush.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-hidden w-full h-[100dvh] relative">
          <Navbar />
          <main id="main-scroll-container" className="w-full h-full overflow-y-auto overflow-x-hidden relative">
            {children}
          </main>
      </body>
    </html>
  );
}