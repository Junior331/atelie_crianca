"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { getImage } from "@/assets/images";

interface ImageSlot {
  id: string;
  key: string;
  currentImage: string;
  width?: number;
  height?: number;
  isBanner?: boolean;
  title?: string;
}

// Estrutura fixa das 6 imagens de mobiliário + banner
const FURNITURE_STRUCTURE: ImageSlot[] = [
  {
    id: "cadeiras_plasticas",
    key: "furniture_cadeiras_plasticas",
    currentImage: getImage("fallback").src,
    width: 600,
    height: 200,
    title: "Cadeiras Plásticas",
  },
  {
    id: "mesa_piquenique",
    key: "furniture_mesa_piquenique",
    currentImage: getImage("fallback").src,
    width: 600,
    height: 200,
    title: "Mesa Piquenique",
  },
  {
    id: "cadeiras_madeira",
    key: "furniture_cadeiras_madeira",
    currentImage: getImage("fallback").src,
    width: 600,
    height: 200,
    title: "Cadeiras de Madeira",
  },
  {
    id: "mesa_madeira",
    key: "furniture_mesa_madeira",
    currentImage: getImage("fallback").src,
    width: 600,
    height: 200,
    title: "Mesa de Madeira",
  },
  {
    id: "cadeiras_brancas",
    key: "furniture_cadeiras_brancas",
    currentImage: getImage("fallback").src,
    width: 600,
    height: 200,
    title: "Cadeiras Brancas",
  },
  {
    id: "mesa_redonda",
    key: "furniture_mesa_redonda",
    currentImage: getImage("fallback").src,
    width: 600,
    height: 150,
    title: "Mesa Redonda",
  },
];

export default function FurnitureAdmin() {
  const router = useRouter();
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    {
      id: "banner",
      key: "furniture_banner",
      currentImage: getImage("fallback").src,
      isBanner: true,
      width: 1200,
      height: 500,
    },
    ...FURNITURE_STRUCTURE,
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
        .eq("page", "furniture")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        setImageSlots((prev) =>
          prev.map((slot) => {
            const dbImage = data.find((img) => img.key === slot.key);
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
      // Buscar imagem antiga no banco para deletar do storage
      const { data: existingImage } = await supabase
        .from("page_images")
        .select("image_url")
        .eq("page", "furniture")
        .eq("key", slot.key)
        .single();

      // Upload para o Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${slot.key}-${Date.now()}.${fileExt}`;
      const filePath = `furniture/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // Salvar ou atualizar no banco de dados
      const { error: dbError } = await supabase.from("page_images").upsert(
        {
          page: "furniture",
          key: slot.key,
          image_url: publicUrl,
          position: imageSlots.findIndex((s) => s.id === slot.id),
        },
        {
          onConflict: "page,key",
        }
      );

      if (dbError) throw dbError;

      // Deletar imagem antiga do storage (se existir e não for imagem padrão)
      if (
        existingImage?.image_url &&
        existingImage.image_url.includes("furniture/")
      ) {
        const oldPath = existingImage.image_url.split("/furniture/")[1];
        if (oldPath) {
          await supabase.storage.from("images").remove([`furniture/${oldPath}`]);
        }
      }

      // Atualizar estado local
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
      // Buscar imagem no banco
      const { data: existingImage } = await supabase
        .from("page_images")
        .select("image_url")
        .eq("page", "furniture")
        .eq("key", slot.key)
        .single();

      // Deletar do banco
      const { error: dbError } = await supabase
        .from("page_images")
        .delete()
        .eq("page", "furniture")
        .eq("key", slot.key);

      if (dbError) throw dbError;

      // Deletar do storage (se não for imagem padrão)
      if (
        existingImage?.image_url &&
        existingImage.image_url.includes("furniture/")
      ) {
        const oldPath = existingImage.image_url.split("/furniture/")[1];
        if (oldPath) {
          await supabase.storage.from("images").remove([`furniture/${oldPath}`]);
        }
      }

      // Resetar para imagem padrão do FURNITURE_STRUCTURE
      setImageSlots((prev) =>
        prev.map((s) => {
          if (s.id === slot.id) {
            // Buscar a imagem padrão do FURNITURE_STRUCTURE
            const defaultSlot = FURNITURE_STRUCTURE.find((fs) => fs.id === slot.id);
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Editar Mobiliário
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

      {/* Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Clique em qualquer imagem</strong> abaixo para
            substituí-la. O layout é idêntico à página pública.
          </p>
        </div>
      </div>

      {/* Content */}
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
                    className="relative w-full h-auto max-h-[640px] flex items-center justify-center cursor-pointer group overflow-hidden"
                    onClick={() => handleImageClick(slot.id)}
                  >
                    <Image
                      width={slot.width}
                      height={slot.height}
                      src={slot.currentImage}
                      alt="Banner Mobiliário"
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
                      ref={(el) => (fileInputRefs.current[slot.id] = el)}
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

          {/* Mobiliário - 6 imagens em pares */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            NOSSO MOBILIÁRIO
          </h2>
          <p className="text-lg text-gray-700 mb-8">DIVERSAS CORES</p>

          <div className="space-y-12 mb-16">
            {[0, 2, 4].map((startIndex) => (
              <div
                key={startIndex}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                {imageSlots
                  .filter((slot) => !slot.isBanner)
                  .slice(startIndex, startIndex + 2)
                  .map((slot) => (
                    <div key={slot.id} className="relative">
                      <div className="mb-2 bg-blue-100 border border-blue-300 rounded p-2">
                        <p className="text-sm font-medium text-blue-800">
                          {slot.title}
                        </p>
                      </div>
                      <div
                        className="relative cursor-pointer group"
                        onClick={() => handleImageClick(slot.id)}
                      >
                        <Image
                          width={slot.width}
                          height={slot.height}
                          src={slot.currentImage}
                          alt={slot.title || ""}
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                          <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploading === slot.id
                              ? "Uploading..."
                              : "Clique para alterar"}
                          </span>
                        </div>
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[slot.id] = el)}
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
                        className="absolute top-14 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all z-10"
                        title="Remover imagem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                  ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
