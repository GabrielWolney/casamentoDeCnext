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
    // Safari as vezes reporta valores negativos no "bounce" do topo, o Math.max protege isso
    const current = Math.max(0, latest);
    if (current > 50 && !isScrolled) setIsScrolled(true);
    if (current <= 50 && isScrolled) setIsScrolled(false);
  });

  const navLinks = [
    { name: "Início", path: "/convite" },
    { name: "Cerimônia", path: "/convite#cerimonia" },
    { name: "Presentes", path: "/presentes" },
  ].filter(link => !(pathname === "/presentes" && link.name === "Cerimônia"));

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      // 'transform-gpu' e 'z-index' alto fixo ajudam o Safari a não "perder" a camada
      className={`fixed top-0 left-0 w-full z-[9999] flex justify-center items-center transition-all duration-500 ease-in-out transform-gpu ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-lg"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
      style={{
        // Forçamos o Safari a renderizar isso como uma camada de hardware
        WebkitBackfaceVisibility: "hidden",
        perspective: 1000,
        // Usamos padding fixo no Style para evitar que o Tailwind "tente" animar o env()
        paddingTop: isScrolled ? "calc(10px + env(safe-area-inset-top))" : "calc(25px + env(safe-area-inset-top))",
        paddingBottom: isScrolled ? "10px" : "20px",
        // Safari lida melhor com backdrop-filter isolado aqui
        WebkitBackdropFilter: isScrolled ? "blur(16px) saturate(180%)" : "none",
      }}
    >
      <div
        className={`flex w-full max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
          isScrolled ? "flex-row gap-2" : "flex-col gap-4 md:flex-row"
        }`}
      >
        <div className="flex items-center shrink-0">
          <Link href="/convite">
            <Image
              src="/logo_casamento-aquarela.PNG"
              alt="Davi & Camila"
              width={120}
              height={50}
              priority
              className={`w-auto transition-all duration-500 object-contain ${
                isScrolled ? "h-[30px]" : "h-[45px] md:h-[50px]"
              }`}
            />
          </Link>
        </div>

        <ul className={`flex list-none m-0 p-0 transition-all duration-500 ${
          isScrolled ? "gap-4 text-[0.85rem]" : "gap-6 text-[0.95rem] md:text-base"
        }`}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`no-underline font-medium transition-colors duration-300 ${
                  pathname === link.path ? "text-[#1278BC] font-bold" : "text-[#1a2634]/80"
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