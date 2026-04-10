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
    setIsScrolled(latest > 60);
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
      initial={false}
      // COPIANDO A LÓGICA DO PROJETO AGAPE:
      // Usamos inset-x-0 + mx-auto em vez de left-50%
      animate={{
        width: isScrolled ? "92%" : "100%",
        top: isScrolled ? 16 : 0,
        borderRadius: isScrolled ? 24 : 0,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 mx-auto z-[9999] flex justify-center items-center transition-colors duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border border-white/40 shadow-lg"
          : "bg-transparent border-transparent"
      }`}
      style={{
        maxWidth: "1200px", // Limite para telas grandes
        paddingTop: isScrolled ? "10px" : "calc(25px + env(safe-area-inset-top, 0px))",
        paddingBottom: isScrolled ? "10px" : "15px",
        paddingLeft: "20px",
        paddingRight: "20px",
        // TRUQUE PARA O CHROME: Força a renderização em uma camada isolada (hardware acceleration)
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className={`flex w-full items-center justify-between transition-all duration-500 ${
          isScrolled ? "max-md:flex-row" : "max-md:flex-col gap-4"
        }`}
      >
        <div className="flex items-center">
          <Link href="/convite" prefetch={false}>
            <Image
              src="/logo_casamento-aquarela.webp"
              alt="Davi & Camila"
              width={110}
              height={45}
              priority
              style={{ width: 'auto' }} 
              className={`transition-all duration-500 object-contain ${
                isScrolled ? "h-[28px] md:h-[32px]" : "h-[40px] md:h-[45px]"
              }`}
            />
          </Link>
        </div>

        <ul
          className={`flex list-none m-0 p-0 transition-all duration-500 ${
            isScrolled ? "gap-4 md:gap-8" : "gap-6 md:gap-10"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`text-[0.9rem] md:text-base font-semibold no-underline transition-colors duration-300 ${
                  pathname === link.path
                    ? "text-[#1278BC]"
                    : "text-[#1a2634]/70 hover:text-[#1278BC]"
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