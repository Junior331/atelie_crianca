/* eslint-disable @typescript-eslint/no-unused-vars */
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
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_position: number;
}

const mesaPiqueniqueColors = [
  {
    name: "Lilás",
    hueRotate: "-30deg",
    saturate: "0.8",
    brightness: "1.1",
    bgClass: "bg-purple-200",
  },
  {
    name: "Rosa Claro",
    hueRotate: "-10deg",
    saturate: "0.7",
    brightness: "1.2",
    bgClass: "bg-pink-200",
  },
  {
    name: "Amarelo",
    hueRotate: "50deg",
    saturate: "1.5",
    brightness: "1.3",
    bgClass: "bg-yellow-300",
  },
  {
    name: "Verde Água",
    hueRotate: "140deg",
    saturate: "0.9",
    brightness: "1.2",
    bgClass: "bg-teal-300",
  },
  {
    name: "Salmão",
    hueRotate: "180deg",
    saturate: "0.8",
    brightness: "1.15",
    bgClass: "bg-red-300",
  },
  {
    name: "Verde Escuro",
    hueRotate: "100deg",
    saturate: "1.3",
    brightness: "0.7",
    bgClass: "bg-green-700",
  },
  {
    name: "Vermelho",
    hueRotate: "-30deg",
    saturate: "1.5",
    brightness: "0.8",
    bgClass: "bg-red-700",
  },
  {
    name: "Azul",
    hueRotate: "220deg",
    saturate: "1.4",
    brightness: "0.9",
    bgClass: "bg-blue-700",
  },

];

const mesaMadeiraColors = [
  {
    name: "Branco",
    hueRotate: "0deg",
    saturate: "0.3",
    brightness: "1.5",
    bgClass: "bg-white border border-gray-300",
  },
  {
    name: "Azul Claro",
    hueRotate: "170deg",
    saturate: "1.2",
    brightness: "1.1",
    bgClass: "bg-blue-400",
  },
  {
    name: "Azul Escuro",
    hueRotate: "180deg",
    saturate: "1.5",
    brightness: "0.85",
    bgClass: "bg-blue-600",
  },
  {
    name: "Rosa",
    hueRotate: "-10deg",
    saturate: "1.1",
    brightness: "1.15",
    bgClass: "bg-pink-400",
  },
  {
    name: "Roxo",
    hueRotate: "-30deg",
    saturate: "0.9",
    brightness: "1.1",
    bgClass: "bg-purple-300",
  },
  {
    name: "Cinza",
    hueRotate: "0deg",
    saturate: "0",
    brightness: "1.2",
    bgClass: "bg-gray-300",
  },
  {
    name: "Vinho",
    hueRotate: "-30deg",
    saturate: "1.6",
    brightness: "0.5",
    bgClass: "bg-red-800",
  },
  {
    name: "Laranja",
    hueRotate: "20deg",
    saturate: "1.4",
    brightness: "1.1",
    bgClass: "bg-orange-400",
  },
];

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMesaPiqueniqueColor, setSelectedMesaPiqueniqueColor] =
    useState<(typeof mesaPiqueniqueColors)[0] | null>(null);
  const [selectedMesaMadeiraColor, setSelectedMesaMadeiraColor] = useState<
    (typeof mesaMadeiraColors)[0] | null
  >(null);
  const [furnitureImages, setFurnitureImages] = useState<ImageData[]>([]);

  // Estados para imagens personalizáveis
  const [bannerImage, setBannerImage] = useState(getImage("fallback").src);
  const [cadeirasPlasticas, setCadeirasPlasticas] = useState(getImage("fallback").src);
  const [mesaPiquenique, setMesaPiquenique] = useState(getImage("fallback").src);
  const [cadeirasMadeira, setCadeirasMadeira] = useState(getImage("fallback").src);
  const [mesaMadeira, setMesaMadeira] = useState(getImage("fallback").src);
  const [cadeirasBrancas, setCadeirasBrancas] = useState(getImage("fallback").src);
  const [mesaRedonda, setMesaRedonda] = useState(getImage("fallback").src);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Buscar imagens personalizáveis da página
        const { data: pageImages } = await supabase
          .from('page_images')
          .select('*')
          .eq('page', 'furniture')
          .order('position');

        if (pageImages && pageImages.length > 0) {
          const imageMap: { [key: string]: string } = {};
          (pageImages as PageImage[]).forEach((img) => {
            imageMap[img.key] = img.image_url;
          });

          // Atualizar estados com imagens do banco
          if (imageMap['furniture_banner']) setBannerImage(imageMap['furniture_banner']);
          if (imageMap['furniture_cadeiras_plasticas']) setCadeirasPlasticas(imageMap['furniture_cadeiras_plasticas']);
          if (imageMap['furniture_mesa_piquenique']) setMesaPiquenique(imageMap['furniture_mesa_piquenique']);
          if (imageMap['furniture_cadeiras_madeira']) setCadeirasMadeira(imageMap['furniture_cadeiras_madeira']);
          if (imageMap['furniture_mesa_madeira']) setMesaMadeira(imageMap['furniture_mesa_madeira']);
          if (imageMap['furniture_cadeiras_brancas']) setCadeirasBrancas(imageMap['furniture_cadeiras_brancas']);
          if (imageMap['furniture_mesa_redonda']) setMesaRedonda(imageMap['furniture_mesa_redonda']);
        }

        // Buscar imagens da seção "Nossa Estrutura"
        type CategoryRow = { id: string };

        const categoryResult = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'furniture')
          .single();

        const categoryId = (categoryResult.data as CategoryRow | null)?.id;

        let imagesData: ImageData[] = [];
        if (categoryId) {
          const { data } = await supabase
            .from('images')
            .select('id, title, description, image_url, order_position')
            .eq('category_id', categoryId)
            .eq('is_active', true)
            .order('order_position');

          if (data) imagesData = data as ImageData[];
        }

        setFurnitureImages(imagesData);
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

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
            {/* Banner */}
              <div className="relative w-full h-auto max-h-[640px] flex items-center justify-center overflow-hidden">
                <Image
                  width={1200}
                  height={500}
                  src={bannerImage}
                  alt="Nossos Mobiliários"
                  className="mission-image"
                />
              </div>

            {/* Nosso Mobiliário - Diversas Cores */}
            <div className="w-full p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                NOSSO MOBILIÁRIO
              </h2>
              <p className="text-lg text-gray-700 mb-8">DIVERSAS CORES</p>

              <div className="space-y-12 mb-16">
                {/* Par 1 - Cadeiras plásticas + Mesa piquenique */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div >
                    <Image
                      width={600}
                      height={200}
                      src={cadeirasPlasticas}
                      alt="Cadeiras plásticas coloridas"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={mesaPiquenique}
                      alt="Mesa de piquenique rosa"
                      width={600}
                      height={200}
                      
                      className="transition-all duration-300 "
                      style={{
                        filter: selectedMesaPiqueniqueColor
                          ? `hue-rotate(${selectedMesaPiqueniqueColor.hueRotate}) saturate(${selectedMesaPiqueniqueColor.saturate}) brightness(${selectedMesaPiqueniqueColor.brightness})`
                          : "none",
                      }}
                    />
                    {/* <div className="flex gap-2 mt-4 justify-center flex-wrap">
                      {mesaPiqueniqueColors.map((colorOption) => (
                        <button
                          key={colorOption.name}
                          onClick={() =>
                            setSelectedMesaPiqueniqueColor(
                              selectedMesaPiqueniqueColor?.name ===
                                colorOption.name
                                ? null
                                : colorOption
                            )
                          }
                          className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                            colorOption.bgClass
                          } ${
                            selectedMesaPiqueniqueColor?.name ===
                            colorOption.name
                              ? "ring-4 ring-gray-400 scale-110"
                              : "hover:scale-105"
                          }`}
                          title={colorOption.name}
                        />
                      ))}
                    </div> */}
                  </div>
                </div>

                {/* Par 2 - Cadeiras madeira + Mesa madeira */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <Image
                      src={cadeirasMadeira}
                      alt="Cadeiras de madeira coloridas"
                      width={600}
                      height={200}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Image
                        src={mesaMadeira}
                        alt="Mesa de madeira"
                        width={600}
                        height={200}
                        className="transition-all duration-300"
                        style={{
                          filter: selectedMesaMadeiraColor
                            ? `hue-rotate(${
                                selectedMesaMadeiraColor.hueRotate
                              }) saturate(${
                                selectedMesaMadeiraColor.saturate || "1.2"
                              }) brightness(${
                                selectedMesaMadeiraColor.brightness || "1"
                              })`
                            : "none",
                        }}
                      />
                    </div>
                    {/* <div className="flex gap-2 mt-4 justify-center flex-wrap">
                      {mesaMadeiraColors.map((colorOption) => (
                        <button
                          key={colorOption.name}
                          onClick={() =>
                            setSelectedMesaMadeiraColor(
                              selectedMesaMadeiraColor?.name ===
                                colorOption.name
                                ? null
                                : colorOption
                            )
                          }
                          className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                            colorOption.bgClass
                          } ${
                            selectedMesaMadeiraColor?.name === colorOption.name
                              ? "ring-4 ring-gray-400 scale-110"
                              : "hover:scale-105"
                          }`}
                          title={colorOption.name}
                        />
                      ))}
                    </div> */}
                  </div>
                </div>

                {/* Par 3 - Cadeiras brancas + Mesa redonda */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <Image
                      src={cadeirasBrancas}
                      alt="Cadeiras brancas variadas"
                      width={600}
                      height={200}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={mesaRedonda}
                      alt="Mesa redonda branca"
                      width={600}
                      height={150}
                    />
                  </div>
                </div>
              </div>

              {/* Nossa Estrutura - Imagens do Supabase */}
              {furnitureImages.length > 0 && (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    NOSSA ESTRUTURA
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {furnitureImages.map((img) => (
                      <div key={img.id} className="space-y-4">
                        <div className="relative h-64 overflow-hidden rounded-lg">
                          <Image
                            src={img.image_url}
                            alt={img.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{img.title}</h3>
                        {img.description && (
                          <p className="text-gray-700">{img.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
