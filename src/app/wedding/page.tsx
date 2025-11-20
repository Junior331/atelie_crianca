"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { supabase } from "@/lib/supabase";
import { getImage } from "@/assets/images";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageImage } from "@/types/database";

type PortfolioItem = {
  id: string;
  category: string;
  image: string;
};

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState(getImage("fallback").src);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from("page_images")
        .select("*")
        .eq("page", "wedding")
        .order("position");

      if (error) throw error;

      if (data && data.length > 0) {
        const imageMap: { [key: string]: string } = {};
        const carouselImages: PortfolioItem[] = [];

        (data as PageImage[]).forEach((img) => {
          imageMap[img.key] = img.image_url;

          // Se a chave começa com "wedding_carousel_", adicionar ao carrossel
          if (img.key.startsWith("wedding_carousel_")) {
            carouselImages.push({
              id: img.key,
              category: "weddings",
              image: img.image_url,
            });
          }
        });

        if (imageMap["wedding_banner"]) {
          setBannerImage(imageMap["wedding_banner"]);
        }

        // Ordenar imagens do carrossel pela posição
        carouselImages.sort((a, b) => {
          const numA = parseInt(a.id.replace("wedding_carousel_", "")) || 0;
          const numB = parseInt(b.id.replace("wedding_carousel_", "")) || 0;
          return numA - numB;
        });

        setPortfolioItems(carouselImages);
      }
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const featuresData = [
    {
      icon: "/images/entertainment.png",
      title: "ENTRETENIMENTO",
      description:
        "Levamos entretenimento para as crianças enquanto seus pais curtem a festa.",
    },
    {
      icon: "/images/trained-team.png",
      title: "EQUIPE TREINADA",
      description:
        "Nossos monitores são treinados para lidar com situações adversas.",
    },
    {
      icon: "/images/nap-space.png",
      title: "ESPAÇO SONINHO",
      description:
        "Temos um espaço dedicado a soneca dos bebês e das crianças.",
    },
    {
      icon: "/images/lamp.png",
      title: "SUA IDEIA",
      description:
        "Personalizamos as oficinas para refletir as suas ideias e o estilo do evento.",
    },
    {
      icon: "/images/turtle.png",
      title: "MENOS CORRERIA",
      description: "Conseguimos diminuir a correria delas durante a festa.",
    },
    {
      icon: "/images/bilingue.png",
      title: "MONITOR BILÍNGUE",
      description: "Temos o adicional de monitor bilíngue.",
    },
  ];

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const PortfolioCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const nextSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolioItems.length);
    }, []);

    const prevSlide = useCallback(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length
      );
    }, []);

    const goToSlide = useCallback((index: number) => {
      setCurrentIndex(index);
    }, []);

    // Mount effect
    useEffect(() => {
      setIsMounted(true);
      setIsAutoPlay(true);
    }, []);

    // Auto-play functionality
    useEffect(() => {
      if (!isAutoPlay || !isMounted) return;

      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }, [nextSlide, isAutoPlay, isMounted]);

    return (
      <div
        className="relative w-full  md:h-[500px] overflow-hidden bg-gray-100 group"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Main Image */}
        {portfolioItems.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={portfolioItems[currentIndex].image}
                alt={`imagem demonstrativa`}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronRight size={20} className="text-gray-800" />
        </button>

        {/* Dots Indicator */}
        {portfolioItems.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {portfolioItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
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
          <section className="relative min-h-screen flex flex-col">
            <div className="">
              <div className="ml-auto w-full ">
                <div className=" relative md:h-[600px] flex items-center justify-center">
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

              <div className="flex items-center justify-center flex-col gap-2 ml-4 mt-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Há 8 anos no mercado, somos especialistas em levar um toque
                  lúdico e criativo às celebrações através de oficinas infantis,
                  recreação e brinquedotecas personalizadas. Com a missão de
                  “personalizar o mundo” oferecemos soluções sob medida para
                  tornar eventos ainda mais acolhedores, permitindo que os
                  pequenos participem da festa com alegria e interação.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Já entregamos mais de 1.000 eventos e temos um acervo gigante
                  para o Espaço Infantil ornar com a sua decoração.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Casamentos são celebrações de amor e união, e quando há
                  crianças entre os convidados, contar com um espaço infantil
                  bem planejado é um entretenimento que faz toda a diferença.
                  Além de oferecer segurança e diversão, esse cuidado permite
                  que os pais aproveitem o evento com tranquilidade, enquanto os
                  pequenos vivem momentos de alegria e criatividade.
                </p>
                <a
                  className="shadow-md rounded-full py-4 px-8 text-blue-600 mt-2 w-fit"
                  href="https://www.instagram.com/ateliedecrianca.casamentos/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @ateliedecrianca.casamentos
                </a>
              </div>

              <div className="pt-8">
                <div className="container mx-auto max-w-6xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                    {featuresData.map((feature, index) => {
                      return (
                        <motion.div
                          key={index}
                          className="text-center bg-gray-50 p-5 w-full  h-[200px]"
                          viewport={{ once: true }}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <div className="flex justify-center ">
                            <Image
                              src={feature.icon} // caminho da imagem
                              alt={feature.title} // texto alternativo
                              width={48} // largura
                              height={48} // altura
                              className="object-contain"
                            />
                          </div>
                          <h3 className="text-lg font-medium text-gray-800  capitalize">
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

              <div className="bg-white px-[10px]  ">
                <div className="container max-w-none md:pt-8">
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <PortfolioCarousel />
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
