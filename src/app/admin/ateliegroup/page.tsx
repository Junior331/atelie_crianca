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
  width?: number;
  height?: number;
  isBanner?: boolean;
  isLogo?: boolean;
  title?: string;
  section?: string;
}

// Estrutura fixa: 1 banner + 4 logos + 12 imagens (3 por seção)
const GROUP_STRUCTURE: ImageSlot[] = [
  // Ateliê
  { id: "logo_atelie", key: "group_logo_atelie", currentImage: "/images/logo-atelie.png", isLogo: true, width: 150, height: 80, title: "Logo Ateliê", section: "atelie" },
  { id: "atelie_1", key: "group_atelie_1", currentImage: getImage("fallback").src, title: "Ateliê Imagem 1", section: "atelie" },
  { id: "atelie_2", key: "group_atelie_2", currentImage: getImage("fallback").src, title: "Ateliê Imagem 2", section: "atelie" },
  { id: "atelie_3", key: "group_atelie_3", currentImage: getImage("fallback").src, title: "Ateliê Imagem 3", section: "atelie" },

  // Casamentos
  { id: "logo_casamentos", key: "group_logo_casamentos", currentImage: "/images/logo-casamentos.png", isLogo: true, width: 150, height: 80, title: "Logo Casamentos", section: "casamentos" },
  { id: "casamentos_1", key: "group_casamentos_1", currentImage: getImage("fallback").src, title: "Casamentos Imagem 1", section: "casamentos" },
  { id: "casamentos_2", key: "group_casamentos_2", currentImage: getImage("fallback").src, title: "Casamentos Imagem 2", section: "casamentos" },
  { id: "casamentos_3", key: "group_casamentos_3", currentImage: getImage("fallback").src, title: "Casamentos Imagem 3", section: "casamentos" },

  // Produtos
  { id: "logo_produtos", key: "group_logo_produtos", currentImage: "/images/logo-produtos.png", isLogo: true, width: 150, height: 80, title: "Logo Produtos", section: "produtos" },
  { id: "produtos_1", key: "group_produtos_1", currentImage: getImage("fallback").src, title: "Produtos Imagem 1", section: "produtos" },
  { id: "produtos_2", key: "group_produtos_2", currentImage: getImage("fallback").src, title: "Produtos Imagem 2", section: "produtos" },
  { id: "produtos_3", key: "group_produtos_3", currentImage: getImage("fallback").src, title: "Produtos Imagem 3", section: "produtos" },

  // Brinquedoteca
  { id: "logo_brinquedoteca", key: "group_logo_brinquedoteca", currentImage: "/images/logo-brinquedoteca.png", isLogo: true, width: 150, height: 80, title: "Logo Brinquedoteca", section: "brinquedoteca" },
  { id: "brinquedoteca_1", key: "group_brinquedoteca_1", currentImage: getImage("fallback").src, title: "Brinquedoteca Imagem 1", section: "brinquedoteca" },
  { id: "brinquedoteca_2", key: "group_brinquedoteca_2", currentImage: getImage("fallback").src, title: "Brinquedoteca Imagem 2", section: "brinquedoteca" },
  { id: "brinquedoteca_3", key: "group_brinquedoteca_3", currentImage: getImage("fallback").src, title: "Brinquedoteca Imagem 3", section: "brinquedoteca" },
];

export default function AtelieGroupAdmin() {
  const router = useRouter();
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    {
      id: "banner",
      key: "group_banner",
      currentImage: getImage("fallback").src,
      isBanner: true,
      width: 1200,
      height: 600,
    },
    ...GROUP_STRUCTURE,
  ]);

  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    checkAuth();
    loadImagesFromDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin/login");
    }
  };

  const loadImagesFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "ateliegroup")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        setImageSlots((prev) =>
          prev.map((slot) => {
            const dbImage = (data as PageImage[]).find((img) => img.key === slot.key);
            return dbImage
              ? { ...slot, currentImage: dbImage.image_url }
              : slot;
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
        .eq("page", "ateliegroup")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${slot.key}-${Date.now()}.${fileExt}`;
      const filePath = `ateliegroup/${fileName}`;

      const { url: publicUrl, error: uploadError } = await uploadFile(
        file,
        "images",
        filePath
      );

      if (uploadError) throw uploadError;

      const { error: dbError } = await (supabase.from("page_images") as any).upsert(
        {
          page: "ateliegroup",
          key: slot.key,
          image_url: publicUrl,
          position: imageSlots.findIndex((s) => s.id === slot.id),
        },
        {
          onConflict: "page,key",
        }
      );

      if (dbError) throw dbError;

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "ateliegroup");
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id ? { ...s, currentImage: publicUrl } : s
        )
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
        .eq("page", "ateliegroup")
        .eq("key", slot.key)
        .single();

      const existing = existingImage as PageImage | null;

      const { error: dbError } = await supabase
        .from("page_images")
        .delete()
        .eq("page", "ateliegroup")
        .eq("key", slot.key);

      if (dbError) throw dbError;

      if (existing?.image_url) {
        try {
          await deleteImageFromStorage(existing.image_url, "ateliegroup");
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }

      setImageSlots((prev) =>
        prev.map((s) => {
          if (s.id === slot.id) {
            const defaultSlot = GROUP_STRUCTURE.find((gs) => gs.id === slot.id);
            return defaultSlot
              ? { ...s, currentImage: defaultSlot.currentImage }
              : { ...s, currentImage: getImage("fallback").src };
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

  const groupBySection = () => {
    const sections = ["atelie", "casamentos", "produtos", "brinquedoteca"];
    return sections.map((section) => ({
      name: section,
      slots: imageSlots.filter((slot) => !slot.isBanner && slot.section === section),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Editar Ateliê Group
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Clique em qualquer imagem ou logo</strong> abaixo para
            substituí-la. O layout é idêntico à página pública.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Banner */}
          {imageSlots
            .filter((slot) => slot.isBanner)
            .map((slot) => (
              <div key={slot.id} className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  Banner Principal
                </h2>
                <div className="relative">
                  <div
                    className="relative h-auto lg:h-[600px] flex items-center justify-center cursor-pointer group overflow-hidden"
                    onClick={() => handleImageClick(slot.id)}
                  >
                    <Image
                      width={slot.width}
                      height={slot.height}
                      src={slot.currentImage}
                      alt="Banner Ateliê Group"
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                      <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploading === slot.id
                          ? "Uploading..."
                          : "Clique para alterar"}
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }}
                      onChange={(e) => handleFileChange(e, slot)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(slot);
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all z-10"
                    title="Remover imagem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

          {/* Grid 4x4 - 4 seções */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Grid de Serviços (4 linhas x 4 colunas)
          </h2>
          <div className="space-y-8">
            {groupBySection().map((section) => (
              <div key={section.name}>
                <h3 className="text-md font-medium text-gray-600 mb-3 capitalize">
                  {section.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {section.slots.map((slot) => (
                    <div key={slot.id} className="relative">
                      {slot.isLogo ? (
                        <div className="flex items-center justify-center h-full bg-white p-4 rounded shadow">
                          <div
                            className="relative cursor-pointer group"
                            onClick={() => handleImageClick(slot.id)}
                          >
                            <Image
                              src={slot.currentImage}
                              alt={slot.title || ""}
                              width={slot.width}
                              height={slot.height}
                              className="object-contain"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                              <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                {uploading === slot.id
                                  ? "Uploading..."
                                  : "Alterar Logo"}
                              </span>
                            </div>
                            <input
                              type="file"
                              ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }}
                              onChange={(e) => handleFileChange(e, slot)}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(slot);
                            }}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-all z-10"
                            title="Remover logo"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div
                          className="aspect-square relative cursor-pointer group overflow-hidden rounded shadow"
                          onClick={() => handleImageClick(slot.id)}
                        >
                          <Image
                            src={slot.currentImage}
                            alt={slot.title || ""}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                            <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              {uploading === slot.id
                                ? "Uploading..."
                                : "Clique para alterar"}
                            </span>
                          </div>
                          <input
                            type="file"
                            ref={(el) => { if (el) fileInputRefs.current[slot.id] = el; }}
                            onChange={(e) => handleFileChange(e, slot)}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(slot);
                            }}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-all z-10"
                            title="Remover imagem"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
