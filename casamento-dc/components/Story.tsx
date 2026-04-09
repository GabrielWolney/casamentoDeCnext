import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function Story() {
  // Busca os dados no servidor na hora que a página carrega
  const { data: info } = await supabase
    .from('home_info')
    .select('*')
    .eq('id', 1)
    .single();

  const texto = info?.texto_historia || "Escreva sua história aqui...";
  const imagemUrl = info?.imagem_historia || null;

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-[clamp(40px,8vw,80px)]">
      {/* Card do Texto */}
      <div className="glass-card flex flex-col justify-center relative">
        <h2 className="font-display text-4xl text-[#1a2634] mb-4">Nossa História</h2>
        <p className="text-[#1a2634]/90 whitespace-pre-line leading-relaxed">
          {texto}
        </p>
      </div>

      {/* Card da Imagem */}
      <div className="glass-card !p-0 relative overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-white/30 backdrop-blur-[10px] saturate-150">
        {imagemUrl ? (
          <Image
            src={imagemUrl}
            alt="Nossa História"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <p className="text-[#1a2634]/50 font-medium">Foto da História</p>
        )}
      </div>
    </section>
  );
}