/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/utils/upload-helpers";
import { deleteImageFromStorage } from "@/utils/storage-helpers";
import Image from "next/image";
import Link from "next/link";
import { getImage } from "@/assets/images";
import type { PageImage } from "@/types/database";

interface ImageSlot {
  id: string;
  key: string;
  currentImage: string;
  title: string;
}

const WEDDING_STRUCTURE: ImageSlot[] = [
  {
    id: "banner",
    key: "wedding_banner",
    currentImage: getImage("fallback").src,
    title: "Banner Principal",
  },
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `carousel_${i + 1}`,
    key: `wedding_carousel_${String(i + 1).padStart(2, "0")}`,
    currentImage: getImage("fallback").src,
    title: `Imagem Carrossel ${i + 1}`,
  })),
];

export default function WeddingAdmin() {
  const router = useRouter();
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(WEDDING_STRUCTURE);
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
        .eq("page", "wedding")
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
        .eq("page", "wedding")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${slot.key}-${Date.now()}.${fileExt}`;

      const { url, error: uploadError } = await uploadFile(file, "images", `wedding/${fileName}`);

      if (uploadError) throw new Error(uploadError);

      const { error: dbError } = await (supabase.from("page_images") as any).upsert(
        {
          page: "wedding",
          key: slot.key,
          image_url: url,
          position: imageSlots.findIndex((s) => s.id === slot.id),
        },
        { onConflict: "page,key" }
      );

      if (dbError) throw dbError;

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "wedding");
        } catch (deleteError) {
          console.warn("Erro ao deletar imagem antiga:", deleteError);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, currentImage: url } : s))
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
        .eq("page", "wedding")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      await supabase.from("page_images").delete().eq("page", "wedding").eq("key", slot.key);

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "wedding");
        } catch (deleteError) {
          console.warn("Erro ao deletar imagem:", deleteError);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) => {
          if (s.id === slot.id) {
            const defaultSlot = WEDDING_STRUCTURE.find((ws) => ws.id === slot.id);
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
              <h1 className="text-xl font-bold text-gray-900">Editar Casamentos</h1>
            </div>
            <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 cursor-pointer">Sair</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Clique em qualquer imagem</strong> para substituí-la. Total: 1 banner + 6 imagens de carrossel.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-8">
          {/* Banner */}
          {imageSlots.filter((s) => s.id === "banner").map((slot) => (
            <div key={slot.id}>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Banner Principal</h2>
              <div className="relative">
                <div className="relative md:h-[600px] flex items-center justify-center cursor-pointer group overflow-hidden" onClick={() => handleImageClick(slot.id)}>
                  <Image width={1200} height={600} src={slot.currentImage} alt="Banner" className="w-full h-auto object-contain" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                    <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploading === slot.id ? "Uploading..." : "Clique para alterar"}
                    </span>
                  </div>
                  <input type="file" ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }} onChange={(e) => handleFileChange(e, slot)} accept="image/*" className="hidden" />
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(slot); }} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Carrossel */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-600 mb-3">Imagens do Carrossel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {imageSlots.filter((s) => s.id !== "banner").map((slot) => (
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
        </div>
      </main>
    </div>
  );
}
