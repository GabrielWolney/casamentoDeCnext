"use client";

import { useState, useEffect, useRef } from "react";

// SUAS CONFIGURAÇÕES
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrsdUK6pVUkZvx4Zs6nckV4LOBu8tpw990FG9c94HZ-hB9DD22sFIMsHDiE5Bi6rHfKg/exec';

const normalizeText = (text: string) => 
  String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export default function RsvpForm() {
  const [guestName, setGuestName] = useState("");
  const [guestDatabase, setGuestDatabase] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Carrega a lista do Google Sheets ao montar
  useEffect(() => {
    async function loadGuests() {
      try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        setGuestDatabase(data);
      } catch (err) {
        console.error("Erro ao carregar convidados:", err);
      }
    }
    loadGuests();
  }, []);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica do Autocomplete (Debounced Sênior)
  useEffect(() => {
    const val = normalizeText(guestName);
    
    if (val.length < 2) {
      setMatches([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      const found = guestDatabase.filter(name => normalizeText(name).includes(val));
      setMatches(found);
      setShowDropdown(found.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [guestName, guestDatabase]);

  const handleSelectGuest = (name: string) => {
    setGuestName(name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSubmit = normalizeText(guestName);

    if (!nameToSubmit) return alert("Por favor, digite seu nome.");

    const dbName = guestDatabase.find(guest => normalizeText(guest) === nameToSubmit);
    
    if (!dbName) {
      return alert("Nome não encontrado na lista ou já confirmado.");
    }

    setIsSubmitting(true);
    setStatusMessage("Confirmando...");

    const formData = new FormData();
    formData.append("nome", dbName);

    try {
      const response = await fetch(SCRIPT_URL, { method: "POST", body: formData });
      const data = await response.json();

      if (data.result === "success") {
        alert(`Presença confirmada! Obrigado, ${dbName}.`);
        setGuestName("");
        setStatusMessage("Confirmado!");
        // Remove da lista local para não confirmar de novo sem recarregar a página
        setGuestDatabase(prev => prev.filter(g => g !== dbName));
      } else {
        throw new Error(data.message || "Erro no servidor");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão. Tente novamente.");
      setStatusMessage("Erro ao confirmar");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusMessage("");
      }, 3000);
    }
  };

  return (
    <section className="glass-card shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.3)] border border-white/60 p-8 max-w-[500px] mx-auto w-full mb-[clamp(40px,8vw,80px)]">
      <h2 className="text-center font-display text-3xl md:text-4xl text-deep-blue mb-6">
        Confirme sua Presença
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative w-full" ref={containerRef}>
          <label htmlFor="guestName" className="block font-body text-xs font-semibold uppercase tracking-[1px] text-primary-blue mb-2 ml-1">
            Nome
          </label>
          
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onFocus={() => { if (matches.length > 0) setShowDropdown(true); }}
            placeholder="Digite seu nome para buscar..."
            autoComplete="off"
            required
            className="w-full p-3 px-5 rounded-xl bg-white/40 border border-white/60 backdrop-blur-md font-body text-base text-deep-blue outline-none transition-all duration-400 focus:bg-white/80 focus:border-primary-blue focus:shadow-[0_0_15px_rgba(18,120,188,0.15)] focus:-translate-y-[1px]"
          />

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <ul className="absolute top-full left-0 right-0 z-[99] bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-h-[200px] overflow-y-auto mt-2 py-1 list-none scrollbar-thin scrollbar-thumb-primary-blue/30 scrollbar-track-black/5">
              {matches.map((name, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectGuest(name)}
                  className="p-3 px-5 cursor-pointer border-b border-black/5 text-[0.95rem] text-deep-blue transition-colors duration-200 hover:bg-primary-blue/10 hover:text-primary-blue last:border-none"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3.5 mt-2 rounded-[50px] border-none bg-[linear-gradient(135deg,#1C8BD1_0%,#1278BC_100%)] text-white font-body font-semibold text-base tracking-[1px] uppercase cursor-pointer transition-all duration-400 shadow-[0_10px_20px_-5px_rgba(18,120,188,0.4)] hover:-translate-y-[2px] hover:shadow-[0_15px_30px_-5px_rgba(18,120,188,0.5)] hover:bg-[linear-gradient(135deg,#2F9BDC_0%,#1C8BD1_100%)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? statusMessage : statusMessage || "Confirmar Presença"}
        </button>
      </form>
    </section>
  );
}