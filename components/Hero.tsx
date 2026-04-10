"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-[70dvh] flex flex-col justify-center items-center text-center overflow-hidden text-white">
      
      {/* ── BACKGROUNDS OTIMIZADOS (Next.js Image) ── */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/hero-cll.PNG"
          alt="Davi & Camila"
          fill
          priority
          quality={90}
          className="object-cover object-top md:hidden"
        />
        <Image
          src="/hero-pc.PNG"
          alt="Davi & Camila"
          fill
          priority
          quality={90}
          className="object-cover object-top hidden md:block"
        />
      </motion.div>

      {/* ── CAMADAS DE VIDRO E SOMBRA ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/10 to-black/30" />
      <div className="absolute bottom-0 left-0 w-full h-[40%] z-[2] bg-gradient-to-b from-[#F4F9FD]/0 via-[#F4F9FD]/40 to-[#F4F9FD] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_90%)] -webkit-backdrop-filter-[blur(10px)]" />

      {/* ── CONTEÚDO ANIMADO ── */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-between items-center pt-[calc(140px+env(safe-area-inset-top))] pb-[70px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] pointer-events-none">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-[6rem] font-normal tracking-wide"
        >
          Davi & Camila
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-body text-[0.95rem] md:text-lg tracking-[0.3em] font-light"
        >
          04 . 07 . 2026
        </motion.p>
      </div>

      {/* ── INDICADOR DE SCROLL ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 z-[4] animate-bounce text-[#1a2634]/50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>

    </section>
  );
}