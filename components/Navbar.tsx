"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(Math.max(0, latest) > 50);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);

  const allLinks = [
    { name: "Início", path: "/convite" },
    { name: "Cerimônia", path: "/convite#cerimonia" },
    { name: "Presentes", path: "/presentes" },
  ];

  const navLinks = allLinks.filter(link => {
    if (pathname === "/presentes" && link.name === "Cerimônia") return false;
    return true;
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      // 1. SOLUÇÃO CHROME: Removi o transform-gpu e translateZ(0). 
      // Agora o Chrome respeita o position: fixed quando a barra de endereços some.
      className={`fixed top-0 left-0 w-full z-[2000] transition-all duration-500 border-b ${
        isScrolled
          ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.15)_100%)] backdrop-blur-md saturate-[220%] border-white/50 shadow-[0_8px_32px_-8px_rgba(18,120,188,0.15)]"
          : "bg-transparent border-transparent shadow-none"
      }`}
      style={{
        // 2. SOLUÇÃO SAFARI NOTCH: A Nav sempre começa no topo absoluto da tela.
        // O padding-top joga o conteúdo para baixo do Notch, mas o fundo de vidro preenche o topo.
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* 3. CONTEÚDO SEPARADO: Quem lida com o "engolir" ou "expandir" é essa div interna */}
      <div
        className={`flex w-full max-w-7xl mx-auto transition-all duration-500 items-center justify-between px-[5%] ${
          isScrolled ? "py-3 max-md:flex-row max-md:gap-[10px]" : "py-5 md:py-8 max-md:flex-col max-md:gap-[15px]"
        }`}
      >
        <div className="flex items-center">
          <Link href="/convite" prefetch={false}>
            <Image
              src="/logo_casamento-aquarela.webp"
              alt="Davi & Camila"
              width={120}
              height={50}
              priority
              style={{ width: 'auto' }} 
              className={`transition-all duration-500 object-contain ${
                isScrolled ? "h-[32px]" : "h-[45px] md:h-[50px]"
              }`}
            />
          </Link>
        </div>

        <ul
          className={`flex list-none transition-all duration-500 ${
            isScrolled
              ? "gap-[12px] text-[0.85rem] md:gap-[40px] md:text-base"
              : "gap-[20px] text-[0.95rem] md:gap-[40px] md:text-base"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                prefetch={false}
                className={`no-underline font-medium transition-colors duration-300 ${
                  pathname === link.path
                    ? "text-[#1278BC] font-semibold"
                    : "text-[#1a2634] opacity-80 hover:opacity-100 hover:text-[#1278BC]"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}