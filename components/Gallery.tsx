"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Foto {
  id: string;
  image_url: string;
}

export default function Gallery() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      const { data } = await supabase
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setFotos(data);
      setLoading(false);
    }
    loadGallery();
  }, []);

  return (
    <section className="w-full mb-[clamp(40px,8vw,80px)]">
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl text-[#1a2634]">Galeria</h2>
        <p className="text-[#1a2634]/70 mt-2">Nossos momentos especiais.</p>
      </div>

      {loading ? (
        <p className="text-center text-[#1a2634]/50">Carregando memórias...</p>
      ) : fotos.length === 0 ? (
        <p className="text-center text-[#1a2634]/50">Nenhuma foto adicionada ainda.</p>
      ) : (
        /* O famoso Scroll Snap nativo para celular */
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scroll-smooth scrollbar-thin scrollbar-thumb-[#1278BC] scrollbar-track-black/5">
          {fotos.map((foto) => (
            <div 
              key={foto.id} 
              className="glass-card flex-none w-[85%] md:w-[320px] snap-start !p-2 relative min-h-[300px]"
            >
              <Image
                src={foto.image_url}
                alt="Momento especial"
                fill
                className="object-cover rounded-[20px]"
                sizes="(max-width: 768px) 85vw, 320px"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}