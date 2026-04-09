import type { Metadata, Viewport } from "next";
import { Crimson_Text, Alex_Brush } from "next/font/google";
import "./globals.css";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${crimson.variable} ${alexBrush.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}