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
      // Alteramos para inset-x-0 e mx-auto para centralizar sem precisar de translate-x (que causa bugs no Chrome)
      animate={{
        width: isScrolled ? "92%" : "100%",
        top: isScrolled ? 16 : 0,
        borderRadius: isScrolled ? 999 : 0,
      }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed inset-x-0 mx-auto z-[9999] flex justify-center items-center transition-all duration-500 ${
        isScrolled
          ? "bg-white/75 backdrop-blur-md saturate-[180%] border border-white/50 shadow-[0_12px_40px_-12px_rgba(18,120,188,0.2)]"
          : "bg-transparent border-transparent shadow-none"
      }`}
      style={{
        paddingTop: isScrolled ? "12px" : "calc(30px + env(safe-area-inset-top, 0px))",
        paddingBottom: isScrolled ? "12px" : "20px",
        paddingLeft: isScrolled ? "24px" : "5%",
        paddingRight: isScrolled ? "24px" : "5%",
        // FORÇA O CHROME A MANTER A NAVBAR FIXA E FLUIDA
        willChange: "transform, top, width",
        transform: "translateZ(0)", 
      }}
    >
      <div
        className={`flex w-full max-w-7xl transition-all duration-500 items-center justify-between ${
          isScrolled ? "max-md:flex-row max-md:gap-[10px]" : "max-md:flex-col max-md:gap-[15px]"
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
                isScrolled ? "h-[30px] md:h-[35px]" : "h-[45px] md:h-[50px]"
              }`}
            />
          </Link>
        </div>

        <ul
          className={`flex list-none transition-all duration-500 m-0 p-0 ${
            isScrolled
              ? "gap-[15px] text-[0.85rem] md:gap-[30px] md:text-base"
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