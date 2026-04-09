"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult, 
  DroppableProvided, 
  DraggableProvided 
} from "@hello-pangea/dnd";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

// ── INTERFACES ──
interface Foto {
  id: string;
  image_url: string;
  ordem: number;
}

interface Presente {
  id?: string;
  title: string;
  price: number;
  image_url: string;
  is_custom: boolean;
  link?: string;
}

const INITIAL_GIFT: Presente = { 
  title: "", 
  price: 0, 
  image_url: "", 
  is_custom: false,
  link: ""
};

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"fotos" | "presentes">("fotos");
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [editingGift, setEditingGift] = useState<Presente>(INITIAL_GIFT);

  // O nome do seu bucket no Supabase
  const BUCKET_NAME = "casamento-imagens";

  // ── BUSCA DE DADOS ──
  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      if (activeTab === "fotos") {
        const { data, error } = await supabase.from("galeria").select("*").order("ordem", { ascending: true });
        if (error) throw error;
        setFotos((data as Foto[]) || []);
      } else {
        const { data, error } = await supabase.from("gifts").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        setPresentes((data as Presente[]) || []);
      }
    } catch (err: unknown) {
      console.error("Erro na busca:", err instanceof Error ? err.message : "Desconhecido");
    }
  }, [activeTab]);

  useEffect(() => {
    setIsMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  // ── AUTH ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erro: " + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setFotos([]);
    setPresentes([]);
  };

  // ── AÇÕES ──
  const deleteItem = async (table: string, id: string | undefined) => {
    if (!id || !confirm("Quer mesmo apagar?")) return;
    try {
      await supabase.from(table).delete().eq("id", id);
      fetchData();
    } catch (err) {
      alert("Erro ao apagar.");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFotos(items); // Mudança visual imediata
    
    try {
      const updates = items.map((item, index) => 
        supabase.from("galeria").update({ ordem: index }).eq("id", item.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
    }
  };

  // ── UPLOADS MELHORADOS (Usando o bucket 'casamento-imagens') ──
  const handleUploadFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    
    const files = Array.from(e.target.files);
    let currentLength = fotos.length;
    
    for (const file of files) {
      try {
        const compressed = await imageCompression(file, { maxSizeMB: 0.7, maxWidthOrHeight: 1200 });
        const cleanName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "");
        const fileName = `foto-${Date.now()}-${cleanName}`;
        
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, compressed, {
            contentType: compressed.type || 'image/jpeg',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

        await supabase.from("galeria").insert([{ image_url: publicUrl, ordem: currentLength }]);
        currentLength++;
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
    fetchData();
  };

  const handleUploadGiftImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const file = e.target.files[0];
      const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 800 });
      const cleanName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "");
      const fileName = `gift-${Date.now()}-${cleanName}`;
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, compressed, {
          contentType: compressed.type || 'image/jpeg',
          upsert: false
        });
        
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
      setEditingGift({ ...editingGift, image_url: publicUrl });
    } catch (err) {
      alert("Erro ao subir a imagem do presente.");
    } finally {
      setLoading(false);
    }
  };

  const saveGift = async () => {
    if (!editingGift.image_url) return alert("Por favor, carregue uma imagem para o presente.");
    setLoading(true);
    try {
      if (editingGift.id) {
        await supabase.from("gifts").update(editingGift).eq("id", editingGift.id);
      } else {
        await supabase.from("gifts").insert([editingGift]);
      }
      setEditingGift(INITIAL_GIFT);
      fetchData();
    } catch (err) {
      alert("Erro ao guardar o presente.");
    } finally {
      setLoading(false);
    }
  };

  const glassStyle = "bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-[30px] p-8";

  if (!isMounted) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FBFE] p-6 text-center">
         <form onSubmit={handleLogin} className={glassStyle}>
            <h1 className="font-[family-name:var(--font-crimson)] text-3xl mb-6">Login Admin</h1>
            <input type="email" placeholder="E-mail" className="w-full p-3 rounded-full border mb-4 outline-none" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" className="w-full p-3 rounded-full border mb-4 outline-none" onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-[#6B93B8] text-white px-10 py-3 rounded-full w-full font-bold shadow-md">Entrar</button>
         </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-20 overflow-x-hidden">
      <Navbar />
      <div className="pt-32 max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
           <div className="flex gap-4">
              <button onClick={() => setActiveTab("fotos")} className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === "fotos" ? "bg-[#6B93B8] text-white shadow-lg" : "bg-white text-gray-400 border"}`}>Fotos</button>
              <button onClick={() => setActiveTab("presentes")} className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === "presentes" ? "bg-[#6B93B8] text-white shadow-lg" : "bg-white text-gray-400 border"}`}>Presentes</button>
           </div>
           <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-bold underline">Sair</button>
        </div>

        {activeTab === "fotos" ? (
          <div className={glassStyle}>
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-[family-name:var(--font-crimson)]">Organizar Carrossel</h2>
                <label className="bg-[#7BC0E3] text-white px-6 py-2 rounded-full cursor-pointer font-bold text-sm shadow-md">
                  {loading ? "A carregar..." : "+ Adicionar Fotos"}
                  <input type="file" multiple hidden accept="image/*" onChange={handleUploadFotos} disabled={loading} />
                </label>
             </div>
             
             <DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="fotos" direction="horizontal">
    {(provided: DroppableProvided) => (
      <div 
        {...provided.droppableProps} 
        ref={provided.innerRef} 
        // 1. Removido o 'gap-6' que quebrava o cálculo. Adicionado '-m-3' para compensar a margem dos filhos.
        className="flex flex-wrap justify-start min-h-[200px] pt-4 -m-3"
      >
        {fotos.map((foto, index) => (
          <Draggable key={foto.id} draggableId={foto.id} index={index}>
            {(providedDrag: DraggableProvided, snapshot) => (
              <div 
                ref={providedDrag.innerRef} 
                {...providedDrag.draggableProps} 
                {...providedDrag.dragHandleProps} 
                // 2. Adicionado 'm-3' aqui. 
                // 3. Efeito visual extra quando está segurando a foto (snapshot.isDragging)
                className={`relative group w-28 h-36 m-3 cursor-grab active:cursor-grabbing transition-transform ${
                  snapshot.isDragging ? 'scale-110 shadow-2xl z-50' : 'hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gray-50 relative pointer-events-none">
                  <Image src={foto.image_url} alt="Foto" fill className="object-cover" sizes="112px" />
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteItem("galeria", foto.id); }} 
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full text-xs flex items-center justify-center shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  ✕
                </button>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
             <p className="text-xs text-gray-400 mt-8 italic">* Arraste as fotos para mudar a ordem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`${glassStyle} h-fit`}>
              <h3 className="text-xl mb-6 font-[family-name:var(--font-crimson)]">{editingGift.id ? "Editar" : "Novo"} Presente</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/50 p-3 rounded-xl border border-white/60">
                  {editingGift.image_url ? (
                     <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <Image src={editingGift.image_url} fill className="object-cover" alt="Presente" />
                     </div>
                  ) : (
                     <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300">Sem Foto</div>
                  )}
                  <label className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer text-xs font-bold w-full text-center hover:bg-gray-700">
                    {loading ? "A processar..." : (editingGift.image_url ? "Trocar Imagem" : "Subir Imagem")}
                    <input type="file" accept="image/*" hidden onChange={handleUploadGiftImage} disabled={loading} />
                  </label>
                </div>

                <input placeholder="Título (Ex: Jogo de Panelas)" value={editingGift.title} onChange={e => setEditingGift({...editingGift, title: e.target.value})} className="w-full p-3 rounded-xl border text-sm outline-none focus:border-[#6B93B8]" />
                
                <label className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-100 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#6B93B8]" checked={editingGift.is_custom} onChange={e => setEditingGift({...editingGift, is_custom: e.target.checked})} />
                  É cota livre? (Valor livre em PIX)
                </label>

                {!editingGift.is_custom && (
                  <>
                    <input placeholder="Preço (R$)" type="number" value={editingGift.price || ""} onChange={e => setEditingGift({...editingGift, price: Number(e.target.value)})} className="w-full p-3 rounded-xl border text-sm outline-none focus:border-[#6B93B8]" />
                    <input placeholder="Link mercado pago" value={editingGift.link || ""} onChange={e => setEditingGift({...editingGift, link: e.target.value})} className="w-full p-3 rounded-xl border text-sm outline-none focus:border-[#6B93B8]" />
                  </>
                )}
                
                <div className="flex flex-col gap-2 pt-4">
                  <button onClick={saveGift} className="w-full bg-[#6B93B8] text-white py-3 rounded-full font-bold shadow-md hover:bg-[#5a81a3]">Guardar Presente</button>
                  {editingGift.id && (
                    <button onClick={() => setEditingGift(INITIAL_GIFT)} className="w-full bg-gray-200 text-gray-600 py-3 rounded-full font-bold">Cancelar Edição</button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {presentes.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-gray-100">
                      {p.image_url && <Image src={p.image_url} alt="" fill className="object-cover" sizes="56px" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{p.title}</p>
                      <p className="text-xs text-[#7BC0E3] font-semibold mt-1">
                        {p.is_custom ? "Cota (PIX/Livre)" : `R$ ${p.price}`}
                      </p>
                      {!p.is_custom && p.link && (
                        <a href={p.link} target="_blank" className="text-[10px] text-gray-400 underline mt-1 block">Ver na loja</a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingGift(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#6B93B8] bg-blue-50 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-100">Editar</button>
                    <button onClick={() => deleteItem("gifts", p.id)} className="text-red-500 bg-red-50 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-100">Apagar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}