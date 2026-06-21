/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { getImage } from "@/assets/images";
import type { PageImage } from "@/types/database";
import { uploadFile } from "@/utils/upload-helpers";
import { deleteImageFromStorage } from "@/utils/storage-helpers";

interface ImageSlot {
  id: string;
  key: string;
  currentImage: string;
  title: string;
  section: string;
}

const HOME_STRUCTURE: ImageSlot[] = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `carousel_${i + 1}`,
    key: `home_carousel_${String(i + 1).padStart(2, "0")}`,
    currentImage: getImage("fallback").src,
    title: `Carrossel Principal - Imagem ${i + 1}`,
    section: "carousel",
  })),
  {
    id: "card_quem_somos",
    key: "home_card_quem_somos",
    currentImage: getImage("fallback").src,
    title: "Card: Quem Somos",
    section: "cards",
  },
  {
    id: "card_oficinas",
    key: "home_card_oficinas",
    currentImage: getImage("fallback").src,
    title: "Card: Oficinas",
    section: "cards",
  },
  {
    id: "card_brinquedoteca",
    key: "home_card_brinquedoteca",
    currentImage: getImage("fallback").src,
    title: "Card: Brinquedoteca",
    section: "cards",
  },
  {
    id: "card_casamento",
    key: "home_card_casamento",
    currentImage: getImage("fallback").src,
    title: "Card: Casamento",
    section: "cards",
  },
  {
    id: "card_produtos",
    key: "home_card_produtos",
    currentImage: getImage("fallback").src,
    title: "Card: Produtos",
    section: "cards",
  },
  {
    id: "card_mesa_lanchinho",
    key: "home_card_mesa_lanchinho",
    currentImage: getImage("fallback").src,
    title: "Card: Mesa de Lanchinho",
    section: "cards",
  },
  {
    id: "mission_image",
    key: "home_mission_image",
    currentImage: getImage("fallback").src,
    title: "Imagem da Seção Missão",
    section: "mission",
  },
];

export default function HomeAdmin() {
  const router = useRouter();
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(HOME_STRUCTURE);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    checkAuth();
    loadImagesFromDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/admin/login");
  };

  const loadImagesFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "home")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        setImageSlots((prev) =>
          prev.map((slot) => {
            const dbImage = (data as PageImage[]).find((img) => img.key === slot.key);
            return dbImage ? { ...slot, currentImage: dbImage.image_url } : slot;
          })
        );
      }
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    }
  };

  const handleImageClick = (slotId: string) => {
    fileInputRefs.current[slotId]?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    slot: ImageSlot
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(slot.id);

    try {
      const { data: existingImage } = await supabase
        .from("page_images")
        .select("image_url")
        .eq("page", "home")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${slot.key}-${Date.now()}.${fileExt}`;
      const filePath = `home/${fileName}`;

      const { url: publicUrl, error: uploadError } = await uploadFile(file, "images", filePath);

      if (uploadError) throw uploadError;

      const { error: dbError } = await (supabase.from("page_images") as any).upsert(
        {
          page: "home",
          key: slot.key,
          image_url: publicUrl,
          position: imageSlots.findIndex((s) => s.id === slot.id),
        },
        { onConflict: "page,key" }
      );

      if (dbError) throw dbError;

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "home");
        } catch (deleteError) {
          console.warn("Erro ao deletar imagem antiga:", deleteError);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, currentImage: publicUrl } : s))
      );

      alert("Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (slot: ImageSlot) => {
    if (!confirm("Tem certeza que deseja remover esta imagem?")) return;

    setUploading(slot.id);

    try {
      const { data: existingImage } = await supabase
        .from("page_images")
        .select("image_url")
        .eq("page", "home")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      await supabase.from("page_images").delete().eq("page", "home").eq("key", slot.key);

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "home");
        } catch (deleteError) {
          console.warn("Erro ao deletar imagem:", deleteError);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) => {
          if (s.id === slot.id) {
            const defaultSlot = HOME_STRUCTURE.find((hs) => hs.id === slot.id);
            return defaultSlot ? { ...s, currentImage: defaultSlot.currentImage } : { ...s, currentImage: getImage("fallback").src };
          }
          return s;
        })
      );

      alert("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      alert("Erro ao remover imagem");
    } finally {
      setUploading(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "supabase-auth-token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">← Voltar</Link>
              <h1 className="text-xl font-bold text-gray-900">Editar Página Inicial</h1>
            </div>
            <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 cursor-pointer">Sair</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Clique em qualquer imagem</strong> para substituí-la.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-12">
          {/* === SEÇÃO 1: CARROSSEL PRINCIPAL === */}
          <div className="border-t-4 border-blue-500 pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">SEÇÃO 1: CARROSSEL PRINCIPAL</h2>
            <p className="text-sm text-gray-600 mb-4">Carrossel de imagens grande no topo da página</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {imageSlots.filter((s) => s.section === "carousel").map((slot) => (
                <div key={slot.id} className="relative">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">{slot.title}</h4>
                  <div className="relative h-[250px] cursor-pointer group overflow-hidden rounded shadow" onClick={() => handleImageClick(slot.id)}>
                    <Image src={slot.currentImage} alt={slot.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                      <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploading === slot.id ? "Uploading..." : "Alterar"}
                      </span>
                    </div>
                    <input type="file" ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }} onChange={(e) => handleFileChange(e, slot)} accept="image/*" className="hidden" />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(slot); }} className="absolute top-8 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg z-10" title="Remover">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* === SEÇÃO 2: CARDS DE SERVIÇOS === */}
          <div className="border-t-4 border-green-500 pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">SEÇÃO 2: CARDS DE SERVIÇOS</h2>
            <p className="text-sm text-gray-600 mb-4">Cards clicáveis que levam para cada seção do site</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {imageSlots.filter((s) => s.section === "cards").map((slot) => (
                <div key={slot.id} className="relative">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">{slot.title}</h4>
                  <div className="relative h-[200px] cursor-pointer group overflow-hidden rounded shadow" onClick={() => handleImageClick(slot.id)}>
                    <Image src={slot.currentImage} alt={slot.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                      <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploading === slot.id ? "Uploading..." : "Alterar"}
                      </span>
                    </div>
                    <input type="file" ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }} onChange={(e) => handleFileChange(e, slot)} accept="image/*" className="hidden" />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(slot); }} className="absolute top-8 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg z-10" title="Remover">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* === SEÇÃO 3: MISSÃO === */}
          <div className="border-t-4 border-purple-500 pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">SEÇÃO 3: NOSSA MISSÃO</h2>
            <p className="text-sm text-gray-600 mb-4">Seção final com background e imagem sobreposta</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {imageSlots.filter((s) => s.section === "mission").map((slot) => (
                <div key={slot.id} className="relative">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">{slot.title}</h4>
                  <div className="relative h-[300px] cursor-pointer group overflow-hidden rounded shadow" onClick={() => handleImageClick(slot.id)}>
                    <Image src={slot.currentImage} alt={slot.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                      <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploading === slot.id ? "Uploading..." : "Alterar"}
                      </span>
                    </div>
                    <input type="file" ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }} onChange={(e) => handleFileChange(e, slot)} accept="image/*" className="hidden" />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(slot); }} className="absolute top-8 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg z-10" title="Remover">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
