"use client";

import Navbar from "@/components/Navbar";
import GiftGrid from "@/components/GiftGrid";
import { motion } from "framer-motion";

export default function PresentesPage() {
  return (
    <>
    <Navbar />
      {/* ── FUNDO — gradiente CSS nativo, zero filter blur, zero stacking context extra ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[-1]"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 15% 15%, rgba(123,192,227,0.28) 0%, transparent 55%),
            radial-gradient(ellipse 55% 45% at 85% 40%, rgba(123,192,227,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 50% 55% at 20% 80%, rgba(174,204,228,0.32) 0%, transparent 55%),
            radial-gradient(ellipse 45% 50% at 80% 90%, rgba(179,212,233,0.2) 0%, transparent 55%),
            #FDFDFD
          `,
        }}
      />

      <main
  className="w-full min-h-screen pb-24 overflow-x-hidden relative z-10 bg-transparent"
  style={{
    // Creates a new stacking context that CONTAINS all child
    // compositor layers — they can no longer fight the Navbar
    isolation: "isolate",
    // Prevents Chrome from promoting this layer above the portal
    contain: "layout style",
  }}
>
        

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
              Ajude-nos a construir nossa casa e nossa lua de mel dos sonhos!
            </motion.p>
          </header>

          {/* Grid de Presentes */}
          <GiftGrid />
        </div>

        <footer className="w-full text-center pb-12 pt-8 mt-10 relative z-10 flex flex-col items-center">
  {/* Linha divisória suave com gradiente */}
  <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#1278BC]/30 to-transparent mb-6" />
  
  <p className="font-[family-name:var(--font-crimson)] text-2xl text-[#1a2634]/70 italic">
    Camila & Davi
  </p>
  <p className="font-sans text-[0.6rem] tracking-[0.3em] text-[#1278BC] uppercase mt-2 font-bold opacity-80">
    04 . 07 . 2026
  </p>
</footer>
      </main>
    </>
  );
}