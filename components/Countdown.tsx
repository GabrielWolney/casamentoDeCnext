"use client";

import { useState, useEffect } from "react";

// 1. RESOLVIDO: O subcomponente foi movido para FORA do componente principal
// Assim ele é criado apenas 1 vez na memória e reutilizado.
const Separator = () => (
  <div className="w-[1px] h-[30px] bg-[#1a2634]/10 self-center mx-[5px]" />
);

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // 2. RESOLVIDO: Efeito focado apenas em disparar a "montagem" do cliente
  useEffect(() => {
    // Usar um setTimeout de 0 joga a atualização para o final da fila (macro-task)
    // Evitando o "cascading render" síncrono que o linter reclamou.
    const mountTimeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(mountTimeout);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Só inicia a matemática pesada depois de montar

    const weddingDate = new Date(2026, 6, 4, 16, 0, 0).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const gap = weddingDate - now;

      if (gap < 0) {
        setTimeLeft((prev) => ({ ...prev, isOver: true }));
        return;
      }

      setTimeLeft({
        days: Math.floor(gap / (1000 * 60 * 60 * 24)),
        hours: Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((gap % (1000 * 60)) / 1000),
        isOver: false,
      });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [mounted]);

  if (!mounted) {
    return (
      <section className="countdown-bar opacity-0 pointer-events-none">
        <div className="h-[60px] w-full" />
      </section>
    );
  }

  if (timeLeft.isOver) {
    return (
      <section className="countdown-bar">
        <div className="countdown-container">
          <span className="time-number text-center">Chegou o Grande Dia!</span>
        </div>
      </section>
    );
  }

  return (
    <section className="countdown-bar">
      <div className="countdown-container flex justify-center items-center gap-2">
        <div className="time-box px-[10px] min-w-[55px] flex flex-col items-center">
          <span className="time-number text-[2.2rem] block">{timeLeft.days}</span>
          <span className="time-label text-[0.65rem] tracking-[1px]">Dias</span>
        </div>

        <Separator />

        <div className="time-box px-[10px] min-w-[55px] flex flex-col items-center">
          <span className="time-number text-[2.2rem] block">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="time-label text-[0.65rem] tracking-[1px]">Horas</span>
        </div>

        <Separator />

        <div className="time-box px-[10px] min-w-[55px] flex flex-col items-center">
          <span className="time-number text-[2.2rem] block">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="time-label text-[0.65rem] tracking-[1px]">Min</span>
        </div>

        <Separator />

        <div className="time-box px-[10px] min-w-[55px] flex flex-col items-center">
          <span className="time-number text-[2.2rem] block">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="time-label text-[0.65rem] tracking-[1px]">Seg</span>
        </div>
      </div>
    </section>
  );
}