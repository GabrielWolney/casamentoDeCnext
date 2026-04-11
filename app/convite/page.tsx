"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { SiGooglemaps, SiWaze } from "react-icons/si";
import PhotoCarousel from "@/components/PhotoCarousel";

const SCRIPT_URL = process.env.NEXT_PUBLIC_RSVP_SCRIPT_URL!;

const normalizeText = (text: string) =>
  String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const LOCATIONS = {
  igreja: {
    maps: "https://maps.app.goo.gl/tQVxrVQzfXNncgEq7",
    waze: "https://ul.waze.com/ul?ll=-15.82619562%2C-48.00807595&navigate=yes&zoom=17&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
  },
  recepcao: {
    maps: "https://maps.app.goo.gl/HPc8DfiSkLbvVzycA",
    waze: "https://ul.waze.com/ul?ll=-15.79667214%2C-48.03066015&navigate=yes&zoom=17&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
  },
};

interface Foto {
  id: string;
  image_url: string;
}

export default function ConviteHome() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestDatabase, setGuestDatabase] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [carouselFotos, setCarouselFotos] = useState<Foto[]>([]);
  const [loadingFotos, setLoadingFotos] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const weddingDate = new Date(2026, 6, 4, 19, 0, 0).getTime();

    const tick = () => {
      const gap = weddingDate - Date.now();
      if (gap <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const s = Math.floor(gap / 1000);
      setTimeLeft({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(SCRIPT_URL, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setGuestDatabase(data))
      .catch((err) => {
        if (err.name !== "AbortError")
          console.error("Erro ao carregar convidados:", err);
      });

    supabase
      .from("galeria")
      .select("*")
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        if (data) setCarouselFotos(data);
        setLoadingFotos(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent | TouchEvent) => {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  useEffect(() => {
    const val = normalizeText(guestName);
    if (val.length < 2) {
      setMatches([]);
      setShowDropdown(false);
      return;
    }
    const found = guestDatabase.filter((name) =>
      normalizeText(name).includes(val),
    );
    setMatches(found);
    setShowDropdown(found.length > 0);
  }, [guestName, guestDatabase]);

  const handleConfirm = async () => {
    const dbName = guestDatabase.find(
      (guest: string) => normalizeText(guest) === normalizeText(guestName),
    );
    if (!dbName) return alert("Por favor, selecione seu nome na lista.");
    if (!guestEmail.includes("@"))
      return alert("Por favor, insira um e-mail válido.");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("nome", dbName);
    formData.append("email", guestEmail);

    try {
      const res = await fetch(SCRIPT_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (data.result === "success") {
        alert(`Presença confirmada! Enviamos um e-mail para ${guestEmail}.`);
        setGuestName("");
        setGuestEmail("");
      } else if (data.result === "already_confirmed") {
        alert("Você já está confirmado em nossa lista! Mal podemos esperar!");
        setGuestName("");
        setGuestEmail("");
      }
    } catch (error) {
      alert("Erro ao confirmar presença.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassStyle =
    "bg-white/20 backdrop-blur-[4px] border border-white/40 shadow-[0_20px_50px_0_rgba(0,0,0,0.08),inset_1px_1px_2px_0_rgba(255,255,255,0.8)]";

  return (
    <>
      {/* ── FUNDO — gradiente CSS nativo, zero blur filter, zero repaint no scroll ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 10% 10%, rgba(179,212,233,0.5) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 90% 30%, rgba(209,233,249,0.55) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 20% 80%, rgba(174,214,241,0.45) 0%, transparent 60%),
              radial-gradient(ellipse 65% 55% at 85% 85%, rgba(174,214,241,0.4) 0%, transparent 60%),
              #F9FBFE
            `,
          }}
        />
        {/* Noise texture sutil */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <main className="w-full min-h-screen pb-24 overflow-x-hidden relative z-10 bg-transparent">
        <div className="pt-36 md:pt-44 flex flex-col items-center">
          {/* 1. CONTADOR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassStyle} rounded-full px-10 py-5 flex gap-8 items-center justify-center z-10 relative mb-4`}
          >
            {[
              { label: "DIAS", val: timeLeft.days },
              { label: "HORAS", val: timeLeft.hours },
              { label: "MIN", val: timeLeft.minutes },
              { label: "SEG", val: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center min-w-11.25"
              >
                <span className="font-(family-name:--font-crimson) text-3xl text-[#333] leading-none">
                  {mounted ? item.val.toString().padStart(2, "0") : "00"}
                </span>
                <span className="text-[0.6rem] font-bold tracking-widest text-[#7BC0E3] mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* 2. CARROSSEL */}
          <section id="galeria" className="w-full">
            <PhotoCarousel />
          </section>

          {/* 3. RSVP */}
          <section className="w-full max-w-95 px-6 mb-16 relative">
            <div
              className={`${glassStyle} rounded-[35px] p-8 flex flex-col items-center`}
            >
              <h2 className="font-(family-name:--font-crimson) text-xl mb-6 text-[#333]">
                Confirme sua presença
              </h2>
              <div className="w-full space-y-4">
                {/* Campo nome com ref para fechar dropdown ao clicar fora */}
                <div ref={nameInputRef} className="relative">
                  <label className="text-[0.65rem] font-bold text-[#7BC0E3] tracking-widest block mb-2 ml-4 uppercase">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Busque seu nome..."
                    autoComplete="off"
                    className="w-full bg-white/40 backdrop-blur-sm rounded-full py-3 px-6 text-sm text-[#333] outline-none border border-white/60 focus:border-[#7BC0E3] transition-all"
                  />
                  {showDropdown && (
                    <ul className="absolute left-0 right-0 top-full z-[9999] bg-white/95 backdrop-blur-md mt-2 rounded-2xl shadow-2xl max-h-40 overflow-y-auto border border-white/80 py-2">
                      {matches.map((m, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setGuestName(m);
                            setShowDropdown(false);
                          }}
                          className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b last:border-none"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="text-[0.65rem] font-bold text-[#7BC0E3] tracking-widest block mb-2 ml-4 uppercase">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-white/40 backdrop-blur-sm rounded-full py-3 px-6 text-sm text-[#333] outline-none border border-white/60 focus:border-[#7BC0E3] transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="mt-8 bg-[#6B93B8] text-white rounded-full py-3 px-12 font-(family-name:--font-crimson) text-lg shadow-lg active:scale-95 disabled:opacity-50 transition-transform"
              >
                {isSubmitting ? "Confirmando..." : "Confirmar presença"}
              </button>
            </div>
          </section>

          {/* 4. ENVELOPE */}
          <section
            id="cerimonia"
            className="w-full max-w-130 px-4 mb-16 flex flex-col items-center relative scroll-mt-32"
            style={{ isolation: "isolate" }}
          >
            <motion.div
              layout
              onClick={() => setEnvelopeOpen(!envelopeOpen)}
              className="w-[82%] max-w-120 bg-white rounded-t-[20px] shadow-sm pt-12 pb-36 px-8 text-center relative z-10 cursor-pointer overflow-hidden border-t border-x border-gray-100"
              animate={{ height: envelopeOpen ? "auto" : 280 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {!envelopeOpen && (
                <p className="text-[0.6rem] tracking-widest text-gray-400 uppercase mb-2 font-semibold">
                  Clique e veja os
                </p>
              )}
              <h3 className="font-(family-name:--font-alex) text-5xl text-[#333] leading-[0.8] mb-8">
                {envelopeOpen ? (
                  "Cerimônia"
                ) : (
                  <>
                    Detalhes da
                    <br />
                    cerimônia
                  </>
                )}
              </h3>

              <AnimatePresence>
                {envelopeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-12 pb-10"
                  >
                    <div className="h-px bg-gray-100 w-full" />
                    <div className="flex flex-col items-center">
                      <p className="text-[0.65rem] font-bold text-[#7BC0E3] tracking-[0.2em] uppercase mb-2">
                        Acontecerá no dia
                      </p>
                      <p className="font-(family-name:--font-crimson) text-3xl text-gray-700 leading-none">
                        4 de Julho de 2026
                      </p>
                      <p className="font-(family-name:--font-crimson) text-xl text-gray-400 mt-2">
                        às 18:30
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-48 h-28 mb-4">
                        <Image
                          src="/aquarela-igreja.webp"
                          alt="Igreja"
                          fill
                          className="object-contain"
                          sizes="200px"
                        />
                      </div>
                      <p className="text-[0.6rem] tracking-widest text-[#7BC0E3] font-bold uppercase">
                        No Santuário
                      </p>
                      <p className="font-(family-name:--font-crimson) text-xl text-gray-700 leading-tight mb-6 text-center">
                        Imaculado Coração de Maria
                      </p>
                      <div className="flex gap-6">
                        <a
                          href={LOCATIONS.igreja.maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="p-3 rounded-full bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                            <SiGooglemaps className="text-2xl text-[#4285F4]" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            Maps
                          </span>
                        </a>
                        <a
                          href={LOCATIONS.igreja.waze}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="p-3 rounded-full bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                            <SiWaze className="text-2xl text-[#33CCFF]" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            Waze
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col items-center border-t border-gray-50 pt-10">
                      <div className="relative w-48 h-28 mb-4">
                        <Image
                          src="/oasis-aquarela.webp"
                          alt="Oasis"
                          fill
                          className="object-contain"
                          sizes="200px"
                        />
                      </div>
                      <p className="text-[0.6rem] tracking-widest text-[#7BC0E3] font-bold uppercase">
                        Recepção após a cerimônia
                      </p>
                      <p className="font-(family-name:--font-crimson) text-xl text-gray-700 mb-6 text-center">
                        Recanto Oásis
                      </p>
                      <div className="flex gap-6">
                        <a
                          href={LOCATIONS.recepcao.maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="p-3 rounded-full bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                            <SiGooglemaps className="text-2xl text-[#4285F4]" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            Maps
                          </span>
                        </a>
                        <a
                          href={LOCATIONS.recepcao.waze}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="p-3 rounded-full bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                            <SiWaze className="text-2xl text-[#33CCFF]" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            Waze
                          </span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="w-full relative -mt-45 z-20 pointer-events-none">
              <Image
                src="/convite-aberto.webp"
                alt="Papel"
                width={800}
                height={400}
                className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.12)]"
              />
            </div>
          </section>

          {/* 5. DRESS CODE */}
          <section className="w-full max-w-95 px-6 mb-16 relative">
            <div
              className={`${glassStyle} rounded-[35px] p-8 flex flex-col items-center text-center`}
            >
              <h2 className="font-(family-name:--font-crimson) text-2xl text-[#333] mb-1">
                Dress Code
              </h2>
              <p className="text-[0.65rem] font-bold text-[#7BC0E3] tracking-[0.2em] uppercase mb-6">
                Esporte Fino
              </p>
              <p className="font-sans text-sm text-gray-600 mb-6 leading-relaxed">
                Pedimos gentilmente que evitem <br />a cor das madrinhas:
              </p>
              <div className="flex items-center justify-center gap-6 md:gap-8">
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border-4 border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.05)] bg-[#C5D9EB]" />
                  <span className="text-[0.6rem] font-bold text-[#C5D9EB] tracking-widest uppercase mt-1">
                    Serenity Claro
                  </span>
                </div>

                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border-4 border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.05)] bg-[#B3CEE5]" />
                  <span className="text-[0.6rem] font-bold text-[#B3CEE5] tracking-widest uppercase mt-1">
                    Azul Serenity
                  </span>
                </div>

                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border-4 border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.05)] bg-[#9BBDE2]" />
                  <span className="text-[0.6rem] font-bold text-[#9BBDE2] tracking-widest uppercase mt-1">
                    Serenity Escuro
                  </span>
                </div>
              </div>
            </div>
          </section>

          <Link
            href="/presentes"
            className="bg-[#6B93B8] text-white rounded-full py-4 px-12 font-(family-name:--font-crimson) text-xl shadow-[0_10px_20px_rgba(107,147,184,0.3)] active:scale-95 no-underline transition-all hover:bg-[#5a80a3]"
          >
            Ver lista de presentes
          </Link>
        </div>

        <footer className="w-full text-center pb-12 pt-8 mt-10 relative z-10 flex flex-col items-center">
          {/* Linha divisória suave com gradiente */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#1278BC]/30 to-transparent mb-6" />

          <p className="font-[family-name:var(--font-crimson)] text-2xl text-[#1a2634]/70 italic">
            Camila & Davi
          </p>
          <p className="font-sans text-[0.6rem] tracking-[0.3em] text-[#1278BC] uppercase mt-2 font-bold opacity-80">
            04 . 07 . 2026
          </p>
        </footer>
      </main>
    </>
  );
}
