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

const ABOUT_STRUCTURE: ImageSlot[] = [
  {
    id: "banner",
    key: "about_banner",
    currentImage: getImage("fallback").src,
    title: "Banner Principal (Quem Somos)",
    section: "banner"
  },
  {
    id: "mission_image",
    key: "about_mission_image",
    currentImage: getImage("fallback").src,
    title: "Imagem da Seção Missão",
    section: "mission"
  },
];

export default function AboutAdmin() {
  const router = useRouter();
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(ABOUT_STRUCTURE);
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
        .eq("page", "about")
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
        .eq("page", "about")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${slot.key}-${Date.now()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { url: publicUrl, error: uploadError } = await uploadFile(file, "images", filePath);

      if (uploadError) throw uploadError;

      type PageImageUpsert = { page: string; key: string; image_url: string; position: number };
      const values: PageImageUpsert[] = [
        {
          page: "about",
          key: slot.key,
          image_url: publicUrl,
          position: imageSlots.findIndex((s) => s.id === slot.id),
        },
      ];

      const { error: dbError } = await supabase
        .from("page_images")
        .upsert(values as unknown as never[], { onConflict: "page,key" });

      if (dbError) throw dbError;

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "about");
        } catch (error) {
          console.warn("Failed to delete old image:", error);
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
        .eq("page", "about")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      await supabase.from("page_images").delete().eq("page", "about").eq("key", slot.key);

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "about");
        } catch (error) {
          console.warn("Failed to delete image from storage:", error);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) => {
          if (s.id === slot.id) {
            const defaultSlot = ABOUT_STRUCTURE.find((ps) => ps.id === slot.id);
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
              <h1 className="text-xl font-bold text-gray-900">Editar Quem Somos</h1>
            </div>
            <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 cursor-pointer">Sair</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Clique em qualquer imagem</strong> para substituí-la. Total: 3 imagens.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-8">
          {/* Banner Principal */}
          {imageSlots.filter((s) => s.id === "banner").map((slot) => (
            <div key={slot.id}>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Banner Principal (Quem Somos)</h2>
              <div className="relative">
                <div className="relative h-[400px] flex items-center justify-center cursor-pointer group overflow-hidden" onClick={() => handleImageClick(slot.id)}>
                  <Image src={slot.currentImage} alt={slot.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                    <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploading === slot.id ? "Uploading..." : "Clique para alterar"}
                    </span>
                  </div>
                  <input type="file" ref={(el) => { fileInputRefs.current[slot.id] = el; }} onChange={(e) => handleFileChange(e, slot)} accept="image/*" className="hidden" />
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(slot); }} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Seção Missão */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-600 mb-3">Seção Missão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Background da Missão */}
              {imageSlots.filter((s) => s.id === "mission_bg").map((slot) => (
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

              {/* Imagem da Missão */}
              {imageSlots.filter((s) => s.id === "mission_image").map((slot) => (
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
