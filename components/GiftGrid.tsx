"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import PaymentModal from "./PaymentModal";

// ── INTERFACES ──
interface Gift {
  id: string;
  title: string;
  price: number;
  image_url: string;
  link: string | null;
  is_custom: boolean;
  category: string;
  created_at: string;
}

// ── 1. SKELETON DO CARD INTEIRO (Enquanto o banco carrega) ──
function SkeletonGiftCard() {
  return (
    <div className="glass-card relative flex flex-col h-full overflow-hidden">
      {/* Imagem Fake */}
      <div className="h-[180px] bg-gray-200/60 rounded-[16px] mb-5 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Título Fake */}
      <div className="h-6 w-3/4 bg-gray-200/60 rounded-md mb-2 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Preço Fake */}
      <div className="h-5 w-1/3 bg-gray-200/60 rounded-md mb-[15px] relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Botões Fake */}
      <div className="mt-auto pt-4 flex gap-2">
        <div className="h-10 w-full bg-gray-200/60 rounded-[14px] relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// ── 2. CARD DO PRESENTE REAL (Com Skeleton só na Imagem) ──
function GiftCard({ gift, openModal }: { gift: Gift; openModal: (g: Gift) => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // MÁGICA AQUI: Garante que o link do Mercado Pago sempre comece com https://
  // Sem isso, se o link for cadastrado apenas como "mpago.la/xyz", o Next.js quebra a nova aba.
  const formatLink = (url: string | null) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="glass-card relative flex flex-col h-full animate-[fadeIn_0.5s_ease-out]">
      {/* Tag de Categoria */}
      <span className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-wider font-bold text-[#1278BC] shadow-sm">
        {gift.category || "casa"}
      </span>

      {/* Container da Imagem com Skeleton Netflix */}
      {/* No mobile: h-[180px]. No PC: h-[220px] */}
      <div className="h-[180px] md:h-[220px] bg-gray-200/50 rounded-[16px] mb-5 relative overflow-hidden shrink-0">
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        )}
        
        <Image
          src={gift.image_url}
          alt={gift.title}
          fill
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, 400px"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Informações */}
      <h3 className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-semibold text-[#1a2634] leading-tight">
        {gift.title}
      </h3>
      <p className="font-semibold text-[1.1rem] my-[5px] mb-[15px] text-[#1278BC]">
        {gift.is_custom ? "Valor Livre" : formatCurrency(gift.price)}
      </p>

      {/* Botões */}
      <div className="mt-auto pt-4 flex gap-2">
        {/* Usamos a função formatLink e MANTEMOS o target="_blank" para abrir em nova aba */}
        {gift.link && (
          <a 
            href={formatLink(gift.link)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#1278BC] text-white py-2 px-4 rounded-[14px] font-semibold text-center flex-1 shadow-md hover:scale-[0.98] transition-transform flex items-center justify-center"
          >
            Cartão
          </a>
        )}
        
        {/* O botão do PIX se adapta: se tiver Cartão ele divide o espaço (flex-1), se não tiver, ele ocupa tudo (w-full) */}
        <button 
          onClick={() => openModal(gift)} 
          className={`bg-transparent text-[#1a2634] border border-[#1a2634] py-2 px-4 rounded-[14px] font-medium transition-colors hover:bg-[#1a2634] hover:text-white ${gift.link ? 'flex-1' : 'w-full'}`}
        >
          {gift.is_custom ? "Pix (Valor Livre)" : "Pix"}
        </button>
      </div>
    </div>
  );
}

// ── 3. GRID PRINCIPAL ──
export default function GiftGrid() {
  const [allGifts, setAllGifts] = useState<Gift[]>([]);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  // Busca inicial no Supabase
  useEffect(() => {
    async function loadGifts() {
      const { data } = await supabase
        .from("gifts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const cotas = data.filter((g) => g.is_custom);
        const normais = data
          .filter((g) => !g.is_custom)
          .sort((a, b) => b.price - a.price);
        
        setAllGifts([...cotas, ...normais]);
      }
      setLoading(false);
    }
    loadGifts();
  }, []);

  // Filtro Derivado (Sem useEffect para evitar o erro do ESLint)
  const filteredGifts = activeFilter === "todos" 
    ? allGifts 
    : allGifts.filter(gift => gift.category === activeFilter);

  const openModal = (gift: Gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* CSS embutido para garantir que a animação shimmer exista nesta página */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />

      {/* SELETOR DE FILTROS (Aparece mesmo enquanto carrega) */}
      <div className="flex justify-center gap-3 mb-10">
        {["todos", "casa", "lua de mel"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            disabled={loading} // Evita cliques ansiosos durante o load
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize ${
              activeFilter === filter
                ? "bg-[#1278BC] text-white shadow-md"
                : "bg-white/50 text-[#1a2634] hover:bg-white/80"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {filter === "todos" ? "Todos" : filter}
          </button>
        ))}
      </div>

      {/* GRID DE PRESENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Renderiza 6 esqueletos enquanto busca os dados
          <>
            <SkeletonGiftCard />
            <SkeletonGiftCard />
            <SkeletonGiftCard />
            <SkeletonGiftCard />
            <SkeletonGiftCard />
            <SkeletonGiftCard />
          </>
        ) : filteredGifts.length > 0 ? (
          // Renderiza os presentes reais
          filteredGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} openModal={openModal} />
          ))
        ) : (
          // Caso a categoria esteja vazia
          <div className="col-span-full text-center py-10 opacity-60">
            Nenhum presente encontrado nesta categoria.
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        gift={selectedGift} 
      />
    </>
  );
}