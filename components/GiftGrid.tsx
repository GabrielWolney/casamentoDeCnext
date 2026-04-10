"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import PaymentModal from "./PaymentModal";

interface Gift {
  id: string;
  title: string;
  price: number;
  image_url: string;
  payment_link_mp: string | null;
  pix_code: string | null;
  is_custom: boolean;
  created_at: string;
}

export default function GiftGrid() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

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
        setGifts([...cotas, ...normais]);
      }
      setLoading(false);
    }
    loadGifts();
  }, []);

  const openModal = (gift: Gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <p className="text-center col-span-full opacity-60">
        Embrulhando presentes...
      </p>
    );
  }

  if (gifts.length === 0) {
    return (
      <p className="text-center col-span-full opacity-60">
        Nenhum presente na lista ainda.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gifts.map((gift) => (
          <div key={gift.id} className="glass-card relative flex flex-col">

            {/* Imagem do Presente */}
            <div className="h-[180px] bg-white/40 rounded-[16px] mb-5 relative overflow-hidden">
              <Image
                src={gift.image_url}
                alt={gift.title}
                fill
                className="object-cover"
                // sizes correto: considera padding lateral e colunas reais
                sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1280px) calc(50vw - 48px), 400px"
              />
            </div>

            {/* Info */}
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-[#1a2634]">
              {gift.title}
            </h3>
            <p className="font-semibold text-[1.1rem] my-[5px] mb-[15px] text-[#1a2634]">
              {gift.is_custom ? "Valor Livre" : formatCurrency(gift.price)}
            </p>

            {/* Ações / Botões */}
            <div className="mt-auto pt-4 flex gap-2">
              {gift.is_custom ? (
                <button
                  onClick={() => openModal(gift)}
                  className="bg-transparent text-[#1a2634] border border-[#1a2634] py-2 px-4 rounded-[14px] font-medium w-full hover:bg-black/5 transition-colors"
                >
                  Definir Valor
                </button>
              ) : (
                <>
                  {gift.payment_link_mp &&
                    gift.payment_link_mp !== "null" && (
                      <a
                        href={gift.payment_link_mp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[linear-gradient(135deg,#1C8BD1_0%,#1278BC_100%)] text-white border-none py-2 px-4 rounded-[14px] font-semibold text-center flex-1 shadow-[0_8px_20px_rgba(91,141,184,0.25)] hover:scale-[0.98] transition-transform"
                      >
                        Cartão
                      </a>
                    )}
                  <button
                    onClick={() => openModal(gift)}
                    className="bg-transparent text-[#1a2634] border border-[#1a2634] py-2 px-4 rounded-[14px] font-medium flex-1 hover:bg-black/5 transition-colors"
                  >
                    Pix
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gift={selectedGift}
      />
    </>
  );
}