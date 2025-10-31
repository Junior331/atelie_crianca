"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { supabase } from "@/lib/supabase";
import { getImage } from "@/assets/images";
import Image from "next/image";
import { PageImage } from "@/types/database";

type CarouselItem = {
  id: string;
  image: string;
  category: string;
};

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState(getImage("fallback").src);

  // Dados para Brinquedoteca
  const [playroomItems, setPlayroomItems] = useState<CarouselItem[]>([
    { id: "1", category: "playroom", image: getImage("fallback").src },
    { id: "2", category: "playroom", image: getImage("fallback").src },
    { id: "3", category: "playroom", image: getImage("fallback").src },
    { id: "4", category: "playroom", image: getImage("fallback").src },
    { id: "5", category: "playroom", image: getImage("fallback").src },
    { id: "6", category: "playroom", image: getImage("fallback").src },
  ]);

  // Dados para Mesa de Lanches (Candy Color)
  const [snackItems, setSnackItems] = useState<CarouselItem[]>([
    { id: "1", category: "snacks", image: getImage("fallback").src },
    { id: "2", category: "snacks", image: getImage("fallback").src },
    { id: "3", category: "snacks", image: getImage("fallback").src },
    { id: "4", category: "snacks", image: getImage("fallback").src },
    { id: "5", category: "snacks", image: getImage("fallback").src },
    { id: "6", category: "snacks", image: getImage("fallback").src },
  ]);

  // Dados para Biblioteca de Brinquedos (Colorida)
  const [toyLibraryItems, setToyLibraryItems] = useState<CarouselItem[]>([
    { id: "1", category: "toys", image: getImage("fallback").src },
    { id: "2", category: "toys", image: getImage("fallback").src },
    { id: "3", category: "toys", image: getImage("fallback").src },
    { id: "4", category: "toys", image: getImage("fallback").src },
    { id: "5", category: "toys", image: getImage("fallback").src },
    { id: "6", category: "toys", image: getImage("fallback").src },
  ]);

  // Dados para Personalizada
  const [customizedItems, setCustomizedItems] = useState<CarouselItem[]>([
    { id: "1", category: "toys", image: getImage("fallback").src },
    { id: "2", category: "toys", image: getImage("fallback").src },
    { id: "3", category: "toys", image: getImage("fallback").src },
  ]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "playroom")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        const imageMap: { [key: string]: string } = {};
        (data as PageImage[]).forEach((img) => {
          imageMap[img.key] = img.image_url;
        });

        // Atualizar banner
        if (imageMap["playroom_banner"]) {
          setBannerImage(imageMap["playroom_banner"]);
        }

        // Atualizar Casamentos (playroom)
        setPlayroomItems((prev) =>
          prev.map((item, index) => {
            const key = `playroom_playroom_${String(index + 1).padStart(2, '0')}`;
            return imageMap[key] ? { ...item, image: imageMap[key] } : item;
          })
        );

        // Atualizar Candy Color (snack)
        setSnackItems((prev) =>
          prev.map((item, index) => {
            const key = `playroom_snack_${String(index + 1).padStart(2, '0')}`;
            return imageMap[key] ? { ...item, image: imageMap[key] } : item;
          })
        );

        // Atualizar Colorida (toyLibrary)
        setToyLibraryItems((prev) =>
          prev.map((item, index) => {
            const key = `playroom_toyLibrary_${String(index + 1).padStart(2, '0')}`;
            return imageMap[key] ? { ...item, image: imageMap[key] } : item;
          })
        );

        // Atualizar Personalizada
        setCustomizedItems((prev) =>
          prev.map((item, index) => {
            const key = `playroom_customized_${String(index + 1).padStart(2, '0')}`;
            return imageMap[key] ? { ...item, image: imageMap[key] } : item;
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

  const PlayroomCard = () => (
    <div className="bg-gray-50 h-auto p-6 rounded-lg  text-gray-800 flex flex-col justify-center items-center text-center">
      <h3 className="text-lg flex flex-col font-bold uppercase mb-2">
        BRINQUEDOTECA <span className="italic font-normal">Casamentos</span>
      </h3>
      <p className="text-sm  text-gray-800">
        Diversão para crianças em harmonia com a decoração do casamento.
      </p>
    </div>
  );

  const SnackCard = () => (
    <div className="bg-gray-50 h-auto p-6 rounded-lg  text-gray-800 flex flex-col justify-center items-center text-center">
      <h3 className="text-lg flex flex-col font-bold uppercase mb-2">
        BRINQUEDOTECA<span className="italic font-normal">Candy Color</span>
      </h3>
      <p className="text-sm  text-gray-800">
        Delicada e charmosa, a brinquedoteca candy color se integra à paleta do
        evento sem perder a diversão.
      </p>
    </div>
  );

  const ToyLibraryCard = () => (
    <div className="bg-gray-50 h-auto p-6 rounded-lg text-gray-800 flex flex-col justify-center items-center text-center">
      <h3 className="text-lg font-bold uppercase mb-2">
        BRINQUEDOTECA <span className="italic font-normal">Colorida</span>
      </h3>
      <p className="text-sm text-gray-700">
        A versão colorida traz alegria e energia, garantindo entretenimento e
        harmonia na decoração.
      </p>
    </div>
  );
  const Customized = () => (
    <div className="bg-gray-50 h-auto p-6 rounded-lg text-gray-800 flex flex-col justify-center items-center text-center">
      <h3 className="text-lg font-bold uppercase mb-2">
        BRINQUEDOTECA <span className="italic font-normal">Personalizada</span>
      </h3>
      <p className="text-sm text-gray-700">
        A brinquedoteca temática é personalizada para encantar as crianças e
        harmonizar com o estilo do seu evento.
      </p>
    </div>
  );

  const ImageGrid = ({ items }: { items: CarouselItem[] }) => {
    return (
      <div className="flex flex-col gap-4">
        {/* Primeira linha: 30% - 70% */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[200px]">
          <div className="relative w-full md:w-[30%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[0]?.image}
              alt={`imagem demonstrativa 1`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full md:w-[70%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[1]?.image}
              alt={`imagem demonstrativa 2`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Segunda linha: 70% - 30% */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[200px]">
          <div className="relative w-full md:w-[70%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[2]?.image}
              alt={`imagem demonstrativa 3`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full md:w-[30%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[3]?.image}
              alt={`imagem demonstrativa 4`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Terceira linha: 30% - 70% */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[200px]">
          <div className="relative w-full md:w-[30%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[4]?.image}
              alt={`imagem demonstrativa 5`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full md:w-[70%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[5]?.image}
              alt={`imagem demonstrativa 6`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  const ColorfulGrid = ({ items }: { items: CarouselItem[] }) => {
    return (
      <div className="flex flex-col gap-4">
        {/* Primeira linha: 30% - 70% */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[200px]">
          <div className="relative w-full md:w-[30%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[0]?.image}
              alt={`imagem demonstrativa 1`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full md:w-[70%] h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[1]?.image}
              alt={`imagem demonstrativa 2`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Segunda linha: 100% - Uma imagem */}
        <div className="flex gap-4 h-[200px]">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src={items[2]?.image}
              alt={`imagem demonstrativa 3`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Terceira linha: 3 imagens iguais */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[200px]">
          <div className="relative w-full md:w-1/3 h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[3]?.image}
              alt={`imagem demonstrativa 4`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full md:w-1/3 h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[4]?.image}
              alt={`imagem demonstrativa 5`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full md:w-1/3 h-[200px] overflow-hidden rounded-lg">
            <Image
              src={items[5]?.image}
              alt={`imagem demonstrativa 6`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  const PersonalizedGrid = ({ items }: { items: CarouselItem[] }) => {
    return (
      <div className="flex flex-col gap-4">
        {/* Primeira linha: 100% */}
        <div className="flex gap-4 h-[200px]">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src={items[0]?.image}
              alt={`imagem demonstrativa 1`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Segunda linha: 100% */}
        <div className="flex gap-4 h-[200px]">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src={items[1]?.image}
              alt={`imagem demonstrativa 2`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Terceira linha: 100% */}
        <div className="flex gap-4 h-[200px]">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src={items[2]?.image}
              alt={`imagem demonstrativa 3`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
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
          <section className="relative  min-h-screen flex flex-col">
            <div className="">
              <div className="ml-auto w-full ">
                <div className=" relative md:h-[600px] flex items-center justify-center">
                  <Image
                    width={1200}
                    height={500}
                    src={bannerImage}
                    alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                    className="playroom-image"
                  />
                </div>
              </div>

              <div className="bg-white py-14 px-8">
                <div className="w-full  mx-auto space-y-12">
                  {/* Primeira seção - Brinquedoteca Casamento */}
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="w-full">
                      <PlayroomCard />
                    </div>
                    <div className="w-full">
                      <ImageGrid items={playroomItems} />
                    </div>
                  </motion.div>

                  {/* Segunda seção - Candy Color */}
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="w-full">
                      <SnackCard />
                    </div>
                    <div className="w-full">
                      <ImageGrid items={snackItems} />
                    </div>
                  </motion.div>

                  {/* Terceira seção - Colorida */}
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="w-full">
                      <ToyLibraryCard />
                    </div>
                    <div className="w-full">
                      <ColorfulGrid items={toyLibraryItems} />
                    </div>
                  </motion.div>
                  {/* Quarta seção - Personalizada */}
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="w-full">
                      <Customized />
                    </div>
                    <div className="w-full">
                      <PersonalizedGrid items={customizedItems} />
                    </div>
                  </motion.div>
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
