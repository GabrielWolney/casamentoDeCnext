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

  // 1. Hooks no topo (Obrigatório no React)
  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(latest > 50);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);

  // 2. Bloqueio para a Capa (Depois dos Hooks)
  if (pathname === "/") return null;

  const navLinks = [
    { name: "Início", path: "/convite" },
    { name: "Cerimônia", path: "/convite#cerimonia" },
    { name: "Presentes", path: "/presentes" },
  ].filter(link => {
    if (pathname === "/presentes" && link.name === "Cerimônia") return false;
    return true;
  });

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isScrolled ? "92%" : "100%",
        top: isScrolled ? 16 : 0,
        borderRadius: isScrolled ? 30 : 0,
      }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      // RESTAURADO: Vidro perfeito com blur alto e saturação
      className={`fixed inset-x-0 mx-auto z-[99999] flex justify-center items-center transition-all duration-500 ${
        isScrolled
          ? "bg-white/45 backdrop-blur-xl saturate-[180%] border border-white/50 shadow-[0_12px_40px_-12px_rgba(18,120,188,0.2)]"
          : "bg-transparent border-transparent"
      }`}
      style={{
        maxWidth: "1100px",
        padding: isScrolled ? "10px 24px" : "25px 5%",
        // Garantia contra o "esconde-esconde" do Chrome
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: "1000px"
      }}
    >
      <div className={`flex w-full items-center justify-between transition-all duration-500 ${isScrolled ? "" : "max-md:flex-col gap-4"}`}>
        <Link href="/convite" className="shrink-0">
          <Image
            src="/logo_casamento-aquarela.webp"
            alt="Logo"
            width={110}
            height={45}
            priority
            style={{ width: 'auto' }}
            className={`transition-all duration-500 object-contain ${isScrolled ? "h-[30px] md:h-[35px]" : "h-[45px] md:h-[50px]"}`}
          />
        </Link>

        <ul className="flex gap-5 md:gap-10 m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.name} className="list-none">
              <Link
                href={link.path}
                className={`text-[0.9rem] md:text-base font-bold no-underline transition-colors duration-300 ${
                  pathname === link.path 
                    ? "text-[#1278BC]" 
                    : "text-[#1a2634] opacity-70 hover:opacity-100 hover:text-[#1278BC]"
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