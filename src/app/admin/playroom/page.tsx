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
  title: string;
  section: string;
}

// Banner + 4 seções: Casamentos(6), CandyColor(6), Colorida(6), Personalizada(3) = 22 imagens
const PLAYROOM_STRUCTURE: ImageSlot[] = [
  // Casamentos - 6 imagens
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `playroom_${i + 1}`,
    key: `playroom_playroom_${String(i + 1).padStart(2, '0')}`,
    currentImage: getImage("fallback").src,
    title: `Casamentos Imagem ${i + 1}`,
    section: "casamentos"
  })),
  // Candy Color - 6 imagens
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `snack_${i + 1}`,
    key: `playroom_snack_${String(i + 1).padStart(2, '0')}`,
    currentImage: getImage("fallback").src,
    title: `Candy Color Imagem ${i + 1}`,
    section: "candy"
  })),
  // Colorida - 6 imagens
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `toyLibrary_${i + 1}`,
    key: `playroom_toyLibrary_${String(i + 1).padStart(2, '0')}`,
    currentImage: getImage("fallback").src,
    title: `Colorida Imagem ${i + 1}`,
    section: "colorida"
  })),
  // Personalizada - 3 imagens
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `customized_${i + 1}`,
    key: `playroom_customized_${String(i + 1).padStart(2, '0')}`,
    currentImage: getImage("fallback").src,
    title: `Personalizada Imagem ${i + 1}`,
    section: "personalizada"
  })),
];

export default function PlayroomAdmin() {
  const router = useRouter();
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    {
      id: "banner",
      key: "playroom_banner",
      currentImage: getImage("fallback").src,
      title: "Banner",
      section: "banner"
    },
    ...PLAYROOM_STRUCTURE,
  ]);

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
        .eq("page", "playroom")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        setImageSlots((prev) =>
          prev.map((slot) => {
            const dbImage = data.find((img) => img.key === slot.key);
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
        .eq("page", "playroom")
        .eq("key", slot.key)
        .single();

      const fileExt = file.name.split(".").pop();
      const fileName = `${slot.key}-${Date.now()}.${fileExt}`;
      const filePath = `playroom/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("page_images").upsert(
        {
          page: "playroom",
          key: slot.key,
          image_url: publicUrl,
          position: imageSlots.findIndex((s) => s.id === slot.id),
        },
        { onConflict: "page,key" }
      );

      if (dbError) throw dbError;

      if (existingImage?.image_url && existingImage.image_url.includes("playroom/")) {
        const oldPath = existingImage.image_url.split("/playroom/")[1];
        if (oldPath) await supabase.storage.from("images").remove([`playroom/${oldPath}`]);
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
        .eq("page", "playroom")
        .eq("key", slot.key)
        .single();

      await supabase.from("page_images").delete().eq("page", "playroom").eq("key", slot.key);

      if (existingImage?.image_url && existingImage.image_url.includes("playroom/")) {
        const oldPath = existingImage.image_url.split("/playroom/")[1];
        if (oldPath) await supabase.storage.from("images").remove([`playroom/${oldPath}`]);
      }

      setImageSlots((prev) =>
        prev.map((s) => {
          if (s.id === slot.id) {
            const defaultSlot = PLAYROOM_STRUCTURE.find((ps) => ps.id === slot.id);
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

  const sections = [
    { name: "casamentos", title: "Brinquedoteca Casamentos", count: 6 },
    { name: "candy", title: "Brinquedoteca Candy Color", count: 6 },
    { name: "colorida", title: "Brinquedoteca Colorida", count: 6 },
    { name: "personalizada", title: "Brinquedoteca Personalizada", count: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">← Voltar</Link>
              <h1 className="text-xl font-bold text-gray-900">Editar Brinquedoteca</h1>
            </div>
            <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900">Sair</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Clique em qualquer imagem</strong> para substituí-la. Total: 1 banner + 21 imagens.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-8">
          {/* Banner */}
          {imageSlots.filter((s) => s.section === "banner").map((slot) => (
            <div key={slot.id}>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Banner Principal</h2>
              <div className="relative">
                <div className="relative md:h-[600px] flex items-center justify-center cursor-pointer group overflow-hidden" onClick={() => handleImageClick(slot.id)}>
                  <Image width={1200} height={600} src={slot.currentImage} alt="Banner" className="w-full h-auto object-contain" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                    <span className="text-white text-xl font-bold opacity-0 group-hover:opacity-100">{uploading === slot.id ? "Uploading..." : "Clique para alterar"}</span>
                  </div>
                  <input type="file" ref={(el) => (fileInputRefs.current[slot.id] = el)} onChange={(e) => handleFileChange(e, slot)} accept="image/*" className="hidden" />
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(slot); }} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Seções */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.name}>
                <h3 className="text-md font-medium text-gray-600 mb-3">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {imageSlots.filter((s) => s.section === section.name).map((slot) => (
                    <div key={slot.id} className="relative">
                      <div
                        className="aspect-square relative cursor-pointer group overflow-hidden rounded shadow"
                        onClick={() => handleImageClick(slot.id)}
                      >
                        <Image
                          src={slot.currentImage}
                          alt={slot.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all flex items-center justify-center">
                          <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploading === slot.id ? "Uploading..." : "Alterar"}
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
