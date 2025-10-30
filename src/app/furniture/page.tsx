"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { getImage } from "@/assets/images";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

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
            <div className="">
              {/* Banner */}
              <div className="ml-auto w-full p-6">
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] flex items-center justify-center">
                  <Image
                    src={getImage("capa_mobiliario")}
                    alt="Nossos Mobiliários"
                    fill
                    className="mission-image"
                  />
                </div>
              </div>

              {/* Nosso Mobiliário - Diversas Cores */}
              <div className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">NOSSO MOBILIÁRIO</h2>
                <p className="text-lg text-gray-700 mb-8">DIVERSAS CORES</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                  {/* Coluna 1 - Cadeiras e Bancos */}
                  <div className="space-y-8">
                    {/* Cadeiras plásticas coloridas */}
                    <div>
                      <Image
                        src="/images/mobiliario/cadeiras-plasticas.png"
                        alt="Cadeiras plásticas coloridas"
                        width={600}
                        height={200}
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Cadeiras de madeira */}
                    <div>
                      <Image
                        src="/images/mobiliario/cadeiras-madeira.png"
                        alt="Cadeiras de madeira coloridas"
                        width={600}
                        height={200}
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Cadeiras brancas */}
                    <div>
                      <Image
                        src="/images/mobiliario/cadeiras-brancas.png"
                        alt="Cadeiras brancas variadas"
                        width={600}
                        height={200}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>

                  {/* Coluna 2 - Mesas */}
                  <div className="space-y-8">
                    {/* Mesa de piquenique rosa */}
                    <div>
                      <Image
                        src="/images/mobiliario/mesa-piquenique.png"
                        alt="Mesa de piquenique rosa"
                        width={600}
                        height={200}
                        className="w-full h-auto"
                      />
                      <div className="flex gap-2 mt-2 justify-center">
                        <div className="w-6 h-6 rounded-full bg-purple-200"></div>
                        <div className="w-6 h-6 rounded-full bg-pink-200"></div>
                        <div className="w-6 h-6 rounded-full bg-yellow-300"></div>
                        <div className="w-6 h-6 rounded-full bg-teal-300"></div>
                        <div className="w-6 h-6 rounded-full bg-red-300"></div>
                        <div className="w-6 h-6 rounded-full bg-green-700"></div>
                        <div className="w-6 h-6 rounded-full bg-red-700"></div>
                        <div className="w-6 h-6 rounded-full bg-blue-700"></div>
                      </div>
                    </div>

                    {/* Mesa de madeira */}
                    <div>
                      <Image
                        src="/images/mobiliario/mesa-madeira.png"
                        alt="Mesa de madeira"
                        width={600}
                        height={200}
                        className="w-full h-auto"
                      />
                      <div className="flex gap-2 mt-2 justify-center">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
                        <div className="w-6 h-6 rounded-full bg-blue-400"></div>
                        <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                        <div className="w-6 h-6 rounded-full bg-pink-400"></div>
                        <div className="w-6 h-6 rounded-full bg-purple-300"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                        <div className="w-6 h-6 rounded-full bg-red-800"></div>
                        <div className="w-6 h-6 rounded-full bg-orange-400"></div>
                      </div>
                    </div>

                    {/* Mesa redonda branca */}
                    <div>
                      <Image
                        src="/images/mobiliario/mesa-redonda.png"
                        alt="Mesa redonda branca"
                        width={600}
                        height={150}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Nossa Estrutura */}
                <h2 className="text-3xl font-bold text-gray-900 mb-8">NOSSA ESTRUTURA</h2>

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
                    <p className="text-gray-700">Nosso acervo conta com várias opções</p>
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
                    <h3 className="text-xl font-bold text-gray-900">Simplicidade</h3>
                    <p className="text-gray-700">Acervo que se adequa ao seu evento</p>
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
                    <h3 className="text-xl font-bold text-gray-900">Personalidade</h3>
                    <p className="text-gray-700">Temos um acervo personalizável</p>
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
                    <p className="text-gray-700">Nossa estrutura ocupou um campo de futebol</p>
                  </div>
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
