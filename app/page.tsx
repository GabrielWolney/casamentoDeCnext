"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CapaConvite() {
  return (
    <main className="w-full min-h-[100dvh] bg-gradient-to-b from-white from-60% to-[#aecce4] flex flex-col items-center justify-center py-12 px-6 overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center mb-8"
      >
        <p className="font-[family-name:var(--font-crimson)] text-[0.8rem] md:text-sm tracking-[0.1em] text-[#333333]">
          CONVITE DE CASAMENTO
        </p>
        <h1 className="font-[family-name:var(--font-alex)] text-[3.5rem] md:text-8xl text-[#333333] leading-none mt-1">
          Camila & Davi
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-[320px] aspect-[4/3] max-h-[40vh]"
      >
        <Image
  src="/convite.webp"
  alt="Envelope do Convite"
  fill
  priority
  // ADICIONE ESTA LINHA
  sizes="(max-width: 768px) 100vw, 320px"
  className="object-contain drop-shadow-sm"
/>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-10"
      >
        <Link
          href="/convite"
          className="
            flex items-center justify-center 
            bg-white/20 backdrop-blur-[4px]             /* Refraction 80, Frost 4 */
            border border-white/40                      /* Borda de reflexo sutil */
            text-[#333333] 
            py-3 px-16 
            rounded-full 
            font-[family-name:var(--font-crimson)] 
            text-2xl 
            shadow-[0_20px_50px_0_rgba(0,0,0,0.1),inset_1px_1px_3px_rgba(255,255,255,0.8)] /* Depth 20, Disp 50, Light 80% */
            transition-all duration-300
            hover:bg-white/30 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.15),inset_1px_1px_3px_rgba(255,255,255,1)]
            active:scale-95 
            no-underline
          "
        >
          Abrir
        </Link>
      </motion.div>

    </main>
  );
}