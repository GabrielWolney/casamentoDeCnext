"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { PixPayload } from "@/lib/pix";

// SUAS CHAVES DO PIX AQUI
const CHAVE_PIX = "07737349103";
const NOME_NOIVOS = "CAMILA E DAVI";
const CIDADE_NOIVOS = "BRASILIA";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift: {
    title: string;
    price: number | null;
    is_custom: boolean;
    pix_code?: string | null;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, gift }: PaymentModalProps) {
  const [customValue, setCustomValue] = useState<string>("");
  const [currentPixCode, setCurrentPixCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Zera os estados de forma assíncrona para evitar "cascading renders" no React 19
  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setCustomValue("");
      setCopied(false);
      if (gift && !gift.is_custom && gift.pix_code) {
        setCurrentPixCode(gift.pix_code);
      } else {
        setCurrentPixCode("");
      }
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [gift, isOpen]);

  // Atualiza o Pix dinamicamente ao digitar, também protegido com setTimeout
  useEffect(() => {
    if (gift?.is_custom) {
      const updatePix = setTimeout(() => {
        const val = parseFloat(customValue);
        if (val > 0) {
          const pix = new PixPayload(CHAVE_PIX, NOME_NOIVOS, CIDADE_NOIVOS, "COTA", val);
          setCurrentPixCode(pix.getPayload());
        } else {
          setCurrentPixCode("");
        }
      }, 0);
      
      return () => clearTimeout(updatePix);
    }
  }, [customValue, gift]);

  if (!isOpen || !gift) return null;

  const handleCopy = async () => {
    if (!currentPixCode) return alert("Código inválido ou valor não definido!");
    try {
      await navigator.clipboard.writeText(currentPixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      alert("Pix copiado com sucesso! \n\nEnvie o comprovante de pagamento no WhatsApp do Davi ou da Camila!");
    } catch (err) {
      console.error("Falha ao copiar:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-2000 flex items-end md:items-center justify-center backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-125 md:max-w-112.5 bg-white rounded-t-3xl md:rounded-3xl p-10 pt-10 px-8 relative shadow-[0_-10px_40px_rgba(0,0,0,0.1)] text-center animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-5 right-5 bg-transparent border-none text-3xl cursor-pointer text-deep-blue"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="font-display text-2xl text-deep-blue mb-2">{gift.title}</h2>

        {/* COTA LIVRE */}
        {gift.is_custom ? (
          <div className="my-5">
            <p className="mb-2 text-[#555]">Qual valor deseja presentear?</p>
            <div className="inline-flex items-center justify-center bg-white/70 border border-black/10 rounded-xl py-2 px-4 transition-all duration-400 focus-within:border-[#8ab4f8] focus-within:shadow-[0_0_10px_rgba(138,180,248,0.3)]">
              <span className="text-2xl font-bold mr-2 text-[#333]">R$</span>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="bg-transparent border-none outline-none text-[1.8rem] font-semibold text-[#333] w-30 text-center p-0 m-0 leading-none h-auto"
              />
            </div>
          </div>
        ) : (
          /* PREÇO FIXO */
          <p className="text-[1.8rem] text-primary-blue mb-5 font-semibold">
            {formatCurrency(gift.price || 0)}
          </p>
        )}

        {/* CAIXA DO CÓDIGO PIX */}
        <div className="bg-[#F4F9FD] p-5 rounded-xl mt-4 border border-dashed border-[#7BC0E3] break-all font-mono text-deep-blue">
          <span className="text-[0.8rem] font-bold block mb-1">Copie e Cole no App do Banco:</span>
          <div className="text-[0.8rem] text-[#555] max-h-20 overflow-y-auto">
            {currentPixCode ? currentPixCode : "Aguardando valor..."}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="bg-[linear-gradient(135deg,#1C8BD1_0%,#1278BC_100%)] text-white border-none py-3 px-8 rounded-[14px] font-semibold cursor-pointer w-full shadow-[0_8px_20px_rgba(91,141,184,0.25)] transition-transform active:scale-95 mt-5 flex items-center justify-center gap-2"
        >
          {copied ? "Copiado!" : "Copiar Código Pix"}
        </button>
      </div>
    </div>
  );
}