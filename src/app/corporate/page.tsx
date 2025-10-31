"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { getImage } from "@/assets/images";
import { supabase } from "@/lib/supabase";
import { PageImage } from "@/types/database";

interface ImageData {
  id: number;
  src: string;
  colSpan?: string;
}

// Array fixo que define a estrutura do grid (6 posições)
const GALLERY_STRUCTURE = [
  { id: 1, colSpan: "md:col-span-2" },
  { id: 2, colSpan: undefined },
  { id: 3, colSpan: undefined },
  { id: 4, colSpan: "md:col-span-2" },
  { id: 5, colSpan: "md:col-span-2" },
  { id: 6, colSpan: undefined },
];

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState(getImage("fallback").src);
  const [galleryImages, setGalleryImages] = useState<ImageData[]>(
    GALLERY_STRUCTURE.map((item) => ({
      ...item,
      src: getImage("fallback").src,
    }))
  );

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "corporate")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        // Mapear imagens do banco
        const imageMap: { [key: string]: string } = {};
        (data as PageImage[]).forEach((img) => {
          imageMap[img.key] = img.image_url;
        });

        // Atualizar banner se existir
        if (imageMap["corporate_banner"]) {
          setBannerImage(imageMap["corporate_banner"]);
        }

        // Atualizar galeria - usar setGalleryImages com função callback
        setGalleryImages((prevImages) =>
          prevImages.map((img, index) => {
            const key = `corporate_foto_0${index + 1}`;
            return imageMap[key] ? { ...img, src: imageMap[key] } : img;
          })
        );
      }
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingSpinner key="loading" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
        >
          <Header />
          <section className="relative min-h-screen flex flex-col">
              <div className="ml-auto w-full ">
                <div className="relative h-auto lg:h-[600px] flex items-center justify-center">
                  {/* Imagem de fundo */}
                  <Image
                    width={1200}
                    height={500}
                    className="mission-image"
                    src={bannerImage}
                    alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                  />
                </div>
              </div>

              <div className=" grid grid-cols-1 gap-2 p-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 sm:p-4">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className={`flex items-center justify-center min-h-auto md:h-[300px] overflow-hidden ${img.colSpan}`}
                  >
                    <Image
                      width={600}
                      height={200}
                      src={img.src}
                      alt={`Imagem ${img.id}`}
                      className="mission-image"
                    />
                  </div>
                ))}
              </div>
          </section>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
