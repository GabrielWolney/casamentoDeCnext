"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Mantendo o seu threshold original de 50
    setIsScrolled(latest > 50);
  });

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
      // A mágica aqui é o 'transform-gpu' para não dar lag no blur
      className={`fixed top-0 left-0 w-full z-[2000] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex justify-center items-center border-b transform-gpu will-change-transform ${
        isScrolled
          ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.15)_100%)] backdrop-blur-md saturate-[220%] border-white/50 shadow-[0_24px_48px_-12px_rgba(18,120,188,0.12)] pt-[15px] pb-[15px] px-[5%]"
          : "bg-transparent border-transparent shadow-none pt-[30px] pb-[20px] px-[5%]"
      }`}
      // Removido o env() apenas do estilo de transição para evitar o "salto" do navegador
      style={{ paddingTop: isScrolled ? 'calc(15px + env(safe-area-inset-top))' : 'calc(30px + env(safe-area-inset-top))' }}
    >
      <div
        className={`flex w-full max-w-7xl transition-all duration-500 items-center justify-between ${
          isScrolled ? "max-md:flex-row max-md:gap-[10px]" : "max-md:flex-col max-md:gap-[15px]"
        }`}
      >
        <div className="flex items-center">
          <Link href="/convite">
            <Image
              src="/logo_casamento-aquarela.webp"
              alt="Davi & Camila"
              width={120}
              height={50}
              priority
              className={`w-auto transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] object-contain ${
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
                className={`no-underline font-medium transition-colors duration-300 ${
                  pathname === link.path
                    ? "text-[#1278BC] font-semibold" // Corrigido para sua cor primária
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