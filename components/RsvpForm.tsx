"use client";

import { useState, useEffect, useRef } from "react";

// SUAS CONFIGURAÇÕES
const SCRIPT_URL = process.env.NEXT_PUBLIC_RSVP_SCRIPT_URL!;

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
  const nameInputRef = useRef<HTMLDivElement>(null);

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

  // Fecha o dropdown se clicar fora (agora usando a ref correta do container)
  useEffect(() => {
    const close = (e: MouseEvent | TouchEvent) => {
      if (nameInputRef.current && !nameInputRef.current.contains(e.target as Node)) {
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

  // Lógica do Autocomplete (Debounced)
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
        
        {/* Usando o nameInputRef corretamente aqui para o clique fora funcionar */}
        <div ref={nameInputRef} className="relative w-full">
          <label htmlFor="guestName" className="block font-body text-xs font-semibold uppercase tracking-[1px] text-primary-blue mb-2 ml-1">
            Nome
          </label>
          
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onFocus={() => { if (matches.length > 0) setShowDropdown(true); }}
            placeholder="Busque seu nome..."
            /* Impede o navegador de tentar jogar o autocompletar feio do sistema por cima */
            autoComplete="new-password" 
            required
            /* text-[16px] É A REGRA DE OURO PARA O IPHONE NÃO DAR ZOOM */
            className="w-full p-3.5 px-5 rounded-xl bg-white/50 border border-white/60 backdrop-blur-md font-body text-[16px] text-deep-blue outline-none transition-all duration-400 focus:bg-white/80 focus:border-[#7BC0E3] focus:shadow-[0_0_15px_rgba(123,192,227,0.25)] focus:-translate-y-[1px]"
          />

          {/* Autocomplete Dropdown - Redesenhado */}
          {showDropdown && (
            <ul 
              className="absolute top-[105%] left-0 right-0 z-[9999] bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] max-h-[220px] overflow-y-auto py-2 list-none m-0"
              style={{ border: "1px solid rgba(255,255,255,0.6)" }}
            >
              {matches.map((name, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectGuest(name)}
                  className="px-5 py-3 cursor-pointer text-[16px] text-gray-700 transition-colors duration-200 hover:bg-[#F4F9FD] hover:text-[#1278BC] font-medium"
                  /* O style inline esmaga qualquer linha preta global que tenha ficado presa no cache */
                  style={{ border: "none", borderBottom: "none", outline: "none" }}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Esse div vazio estava gerando uma margem desnecessária, vamos garantir que o botão fique bem posicionado */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-4 mt-4 rounded-full border-none bg-[#6B93B8] text-white font-body font-bold text-base tracking-[1px] uppercase cursor-pointer transition-all duration-400 shadow-[0_10px_20px_-5px_rgba(107,147,184,0.4)] hover:-translate-y-[2px] hover:shadow-[0_15px_30px_-5px_rgba(107,147,184,0.5)] hover:bg-[#5a81a3] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? statusMessage : statusMessage || "Confirmar Presença"}
        </button>
      </form>
    </section>
  );
}