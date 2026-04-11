"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Evita o erro de hidratação e garante que o document.body exista no navegador
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(latest > 50);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);

  // Se não montou ainda ou está na capa "/", não renderiza nada
  if (!mounted || pathname === "/") return null;

  const navLinks = [
    { name: "Início", path: "/convite" },
    { name: "Cerimônia", path: "/convite#cerimonia" },
    { name: "Presentes", path: "/presentes" },
  ].filter((link) => {
    if (pathname === "/presentes" && link.name === "Cerimônia") return false;
    return true;
  });

  // Salvei o visual e o vidro perfeito que você já tinha construído
  const navContent = (
    <nav
      className={[
        "fixed inset-x-0 mx-auto z-[99999]",
        "flex justify-center items-center",
        "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        isScrolled
          ? "bg-white/45 backdrop-blur-xl saturate-[180%] border border-white/50 shadow-[0_12px_40px_-12px_rgba(18,120,188,0.2)] rounded-[30px] top-4 max-w-[92%]"
          : "bg-transparent border-transparent rounded-none top-0 max-w-[1100px]",
      ].join(" ")}
      style={{
        padding: isScrolled ? "10px 24px" : "25px 5%",
      }}
    >
      <div
        className={`flex w-full items-center justify-between transition-all duration-500 ${
          isScrolled ? "" : "max-md:flex-col gap-4"
        }`}
      >
        <Link href="/convite" className="shrink-0">
          <Image
            src="/logo_casamento-aquarela.webp"
            alt="Logo Camila e Davi"
            width={110}
            height={45}
            priority
            style={{ width: "auto" }}
            className={`transition-all duration-500 object-contain ${
              isScrolled ? "h-[30px] md:h-[35px]" : "h-[45px] md:h-[50px]"
            }`}
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
    </nav>
  );

  // MÁGICA: Teletransporta a Navbar direto para o <body> do site. O Chrome chora.
  return createPortal(navContent, document.body);
}