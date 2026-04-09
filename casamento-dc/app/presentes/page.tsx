"use client";

import Navbar from "@/components/Navbar";
import GiftGrid from "@/components/GiftGrid";
import { motion } from "framer-motion";

export default function PresentesPage() {
  return (
    <>
      {/* ── FUNDO ESTÁTICO UNIFICADO ── */}
      <div 
        className="fixed inset-0 z-[-1] bg-[#FDFDFD]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 15%, rgba(123, 192, 227, 0.25) 0%, transparent 40%),
            radial-gradient(circle at 85% 40%, rgba(123, 192, 227, 0.2) 0%, transparent 45%),
            radial-gradient(circle at 20% 80%, rgba(174, 204, 228, 0.3) 0%, transparent 50%)
          `,
          filter: 'blur(60px)'
        }}
      />

      <main className="w-full min-h-screen pb-24 overflow-x-hidden relative z-0 bg-transparent">
        <Navbar />

        <div className="pt-36 md:pt-44 max-w-7xl mx-auto px-6">
          <header className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-[family-name:var(--font-crimson)] text-5xl text-[#333] mb-4"
            >
              Lista de Presentes
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#7BC0E3] font-sans tracking-[0.2em] text-xs font-bold uppercase"
            >
              Ajude-nos a construir nossa Lua de Mel
            </motion.p>
          </header>

          {/* Grid de Presentes */}
          <GiftGrid />
        </div>

        <footer className="w-full text-center py-16 opacity-40 text-sm font-sans tracking-widest text-[#333]">
          CAMILA & DAVI 2026
        </footer>
      </main>
    </>
  );
}