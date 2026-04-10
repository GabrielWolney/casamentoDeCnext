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
      className={`fixed top-0 left-0 w-full z-[2000] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex justify-center items-center border-b ${
        isScrolled
          ? "bg-white/40 border-white/50 shadow-[0_8px_32px_-8px_rgba(18,120,188,0.15)] px-[5%]"
          : "bg-transparent border-transparent shadow-none px-[5%]"
      }`}
      style={{
        paddingTop: isScrolled
          ? "max(15px, calc(15px + env(safe-area-inset-top, 0px)))"
          : "max(20px, calc(20px + env(safe-area-inset-top, 0px)))",
        paddingBottom: isScrolled ? "15px" : "20px",
        backdropFilter: isScrolled ? "blur(16px) saturate(200%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(16px) saturate(200%)" : "none",
        transform: "translateZ(0)",
      }}
    >
      <div
        className={`flex w-full max-w-7xl transition-all duration-500 items-center justify-between max-md:flex-col ${
          isScrolled ? "max-md:flex-row max-md:gap-[10px]" : "max-md:gap-[15px]"
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
  // O SEGREDO ESTÁ AQUI:
  style={{ width: 'auto' }} 
  // Repare que eu tirei o "w-auto" do className abaixo para evitar conflito
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