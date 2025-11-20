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

interface ImageState {
  [key: string]: string;
}

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<ImageState>({
    banner: getImage("fallback").src,
    logo_atelie: "/images/logo-atelie.png",
    atelie_1: getImage("fallback").src,
    atelie_2: getImage("fallback").src,
    atelie_3: getImage("fallback").src,
    logo_casamentos: "/images/logo-casamentos.png",
    casamentos_1: getImage("fallback").src,
    casamentos_2: getImage("fallback").src,
    casamentos_3: getImage("fallback").src,
    logo_produtos: "/images/logo-produtos.png",
    produtos_1: getImage("fallback").src,
    produtos_2: getImage("fallback").src,
    produtos_3: getImage("fallback").src,
    logo_brinquedoteca: "/images/logo-brinquedoteca.png",
    brinquedoteca_1: getImage("fallback").src,
    brinquedoteca_2: getImage("fallback").src,
    brinquedoteca_3: getImage("fallback").src,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "ateliegroup")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        const imageMap: { [key: string]: string } = {};
        (data as PageImage[]).forEach((img) => {
          // Remover prefixo "group_" da key para mapear corretamente
          const cleanKey = img.key.replace("group_", "");
          imageMap[cleanKey] = img.image_url;
        });

        setImages((prev) => ({ ...prev, ...imageMap }));
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
                <Image
                  width={1200}
                  height={600}
                  src={images.banner}
                  alt="Conheça o grupo Ateliê de Criança"
                  className="mission-image"
                />
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-8 max-w-6xl m-auto text-center">
              Nosso grupo ateliê conta com 4 frentes da empresa, são elas:
              Ateliê de Criança com a parte das oficinas e recreação para
              eventos infantis; Ateliê de Criança Brinquedoteca com a parte
              aluguéis de brinquedotecas itinerantes e personalizadas; Ateliê de
              Criança Produtos com a parte de lembranças e fantasias; Ateliê de
              Criança Casamentos com a parte de eventos sociais como casamentos
              e corporativos. Uma empresa completa e personalizada para você.
            </p>

            {/* Grid de serviços */}
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Linha 1 - Ateliê */}
                <div className="flex items-center justify-center">
                  <Image
                    src={images.logo_atelie}
                    alt="Ateliê de Criança"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.atelie_1}
                    alt="Ateliê serviço 1"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.atelie_2}
                    alt="Ateliê serviço 2"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.atelie_3}
                    alt="Ateliê serviço 3"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>

                {/* Linha 2 - Casamentos */}
                <div className="flex items-center justify-center">
                  <Image
                    src={images.logo_casamentos}
                    alt="Ateliê de Criança Casamentos"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.casamentos_1}
                    alt="Casamentos serviço 1"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.casamentos_2}
                    alt="Casamentos serviço 2"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.casamentos_3}
                    alt="Casamentos serviço 3"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>

                {/* Linha 3 - Produtos */}
                <div className="flex items-center justify-center">
                  <Image
                    src={images.logo_produtos}
                    alt="Ateliê de Criança Produtos"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.produtos_1}
                    alt="Produtos 1"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.produtos_2}
                    alt="Produtos 2"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.produtos_3}
                    alt="Produtos 3"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>

                {/* Linha 4 - Brinquedoteca */}
                <div className="flex items-center justify-center">
                  <Image
                    src={images.logo_brinquedoteca}
                    alt="Brinquedoteca"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.brinquedoteca_1}
                    alt="Brinquedoteca 1"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.brinquedoteca_2}
                    alt="Brinquedoteca 2"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative">
                  <Image
                    src={images.brinquedoteca_3}
                    alt="Brinquedoteca 3"
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
