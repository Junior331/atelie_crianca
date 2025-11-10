/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Footer } from "@/components/modules";
import { LoadingSpinner } from "@/components/atoms";
import { Header } from "@/components/organisms";
import { supabase } from "@/lib/supabase";
import { getImage } from "@/assets/images";
import Image from "next/image";
import { getIcon } from "@/assets/icons";

const featuresData = [
  {
    icon: getIcon("equipe"),
    title: "nossa equipe",
    description: "Mais de 120 colaboradores no Rio e 6 fixos no escritório.",
  },
  {
    icon: getIcon("paleta_de_cores"),
    title: "paleta de cores",
    description:
      "Mobiliário, suportes e uniformes combinam com as cores do evento.",
  },
  {
    icon: getIcon("mobiliario"),
    title: "mobiliário próprio",
    description:
      "Acervo variado de móveis personalizados que seguem a paleta do evento.",
  },
  {
    icon: getIcon("treinamento"),
    title: "treinamento",
    description:
      "Equipe em constante capacitação para serviços mais eficientes e exclusivos.",
  },
  {
    icon: getIcon("experiencia"),

    title: "experiência",
    description: "7 anos de atuação no mercado.",
  },
  {
    icon: getIcon("ecritorio"),

    title: "escritório",
    description:
      "Estrutura com 6 pessoas dedicadas ao atendimento antes, durante e depois do evento.",
  },
  {
    icon: getIcon("agilidade"),
    title: "agilidade",
    description:
      "Entregas rápidas, com qualidade e pontualidade; mais de 100 eventos fechados em menos de 48h",
  },
  {
    icon: getIcon("eventos_100"),
    title: "+ de 1000 eventos",
    description:
      "Já realizaramos mais de 1.000 eventos no RJ, incluindo festas, casamentos e corporativos.",
  },
];

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState(getImage("fallback").src);
  const [missionImage, setMissionImage] = useState(getImage("fallback").src);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "about")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        const imageMap: { [key: string]: string } = {};
        data.forEach((img: any) => {
          imageMap[img.key] = img.image_url;
        });

        if (imageMap["about_banner"]) {
          setBannerImage(imageMap["about_banner"]);
        }
        if (imageMap["about_mission_image"]) {
          setMissionImage(imageMap["about_mission_image"]);
        }
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
        <motion.main
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <Header />
          <div className=" bg-background">
            <div className="flex flex-col md:flex-row w-full md:h-[600px]">
              <Image
                fill
                src={bannerImage}
                alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                className="object-cover !relative"
              />

              <div className="relative md:!absolute inset-2 text-center md:text-start top-auto bottom-0 md:top-0 flex items-center -mt-[110px] md:mt-0 pr-4 md:pr-0">
                <div className="max-w-2xl px-8 mission-card md:ml-6">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    QUEM SOMOS?
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Há 7 anos, nossa empresa se destaca no mercado de
                    entretenimento. Somos conhecidos por criar celebrações
                    únicas e personalizadas. Nosso objetivo principal é trazer
                    diversão e originalidade para cada evento, garantindo
                    momentos inesqueciveis.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center  py-8">
              <div className=" max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuresData.map((feature, index) => {
                    return (
                      <motion.div
                        key={index}
                        className="text-center bg-gray-50 p-5"
                        viewport={{ once: true }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="flex justify-center mb-4">
                          <Image
                            src={feature.icon}
                            alt="Whatsapp"
                            width={48}
                            height={48}
                            className="mr-2"
                          />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3 capitalize">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mission Statement Section */}
            <div className="relative min-h-[500px] bg-cover bg-center bg-no-repeat">
              <div className="relative z-10 flex items-center min-h-[500px] px-4">
                <div className="container mx-auto flex items-center">
                  <div className="container mx-auto relative md:py-24">
                    {/* Desktop Layout */}
                    <div className="hidden xl:block relative max-w-full mx-auto">
                      <div className="flex items-center justify-center relative">
                        {/* Mission Card - Overlapping the image */}
                        <div className="absolute left-[0] z-10 w-full max-w-xl">
                          <div className="mission-card text-center">
                            <div className="mission-subtitle">MAS AFINAL,</div>
                            <h2 className="mission-title">
                              QUAL A NOSSA MISSÃO?
                            </h2>
                            <p className="mission-description">
                              Nossa missão é proporcionar momentos extremamente
                              divertidos longe dos aparelhos eletrônicos,
                              estimular os talentos das crianças e criar laços
                              afetivos entre pais e filhos.
                            </p>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="ml-auto w-full flex justify-end ">
                          <div className="mission-image-container  ">
                            <Image
                              width={1200}
                              height={500}
                              src={missionImage}
                              alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                              className="mission-image"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="xl:hidden max-w-2xl mx-auto">
                      {/* Mission Card */}
                      <div className="mission-card mission-card-mobile text-center mb-8">
                        <div className="mission-subtitle">MAS AFINAL,</div>
                        <h2 className="mission-title">QUAL A NOSSA MISSÃO?</h2>
                        <p className="mission-description">
                          Nossa missão é proporcionar momentos extremamente
                          divertidos longe dos aparelhos eletrônicos, estimular
                          os talentos das crianças e criar laços afetivos entre
                          pais e filhos.
                        </p>
                      </div>

                      {/* Image with overlap */}
                      <div className="relative -mt-10">
                        <div className="mission-image-container">
                          <Image
                            width={1200}
                            height={800}
                            src={missionImage}
                            alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                            className="mission-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
