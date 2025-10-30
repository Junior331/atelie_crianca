/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { getImage } from "@/assets/images";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
                  src={getImage("capa_mobiliario")}
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
                      src={getImage("cadeirs")}
                      alt="Cadeiras plásticas coloridas"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={getImage("mesa")}
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
                      src={getImage("cadeira02")}
                      alt="Cadeiras de madeira coloridas"
                      width={600}
                      height={200}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Image
                        src={getImage("mesa2")}
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
                      src={getImage("cadeira03")}
                      alt="Cadeiras brancas variadas"
                      width={600}
                      height={200}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={getImage("mesa3")}
                      alt="Mesa redonda branca"
                      width={600}
                      height={150}
                    />
                  </div>
                </div>
              </div>

              {/* Nossa Estrutura */}
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                NOSSA ESTRUTURA
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Variedade */}
                <div className="space-y-4">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src="/images/mobiliario/variedade.jpg"
                      alt="Variedade"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Variedade</h3>
                  <p className="text-gray-700">
                    Nosso acervo conta com várias opções
                  </p>
                </div>

                {/* Simplicidade */}
                <div className="space-y-4">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src="/images/mobiliario/simplicidade.jpg"
                      alt="Simplicidade"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Simplicidade
                  </h3>
                  <p className="text-gray-700">
                    Acervo que se adequa ao seu evento
                  </p>
                </div>

                {/* Personalidade */}
                <div className="space-y-4">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src="/images/mobiliario/personalidade.jpg"
                      alt="Personalidade"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Personalidade
                  </h3>
                  <p className="text-gray-700">
                    Temos um acervo personalizável
                  </p>
                </div>

                {/* Tamanho */}
                <div className="space-y-4">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src="/images/mobiliario/tamanho.jpg"
                      alt="Tamanho"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Tamanho</h3>
                  <p className="text-gray-700">
                    Nossa estrutura ocupou um campo de futebol
                  </p>
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
