"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const featuresData = [
    {
      icon: "/images/entertainment.png",
      title: "ENTRETENIMENTO",
      description: "Levamos entretenimento para as crianças enquanto seus pais curtem a festa.",
    },
    {
      icon: "/images/trained-team.png",
      title: "EQUIPE TREINADA",
      description: "Nossos monitores são treinados para lidar com situações adversas.",
    },
    {
      icon: "/images/nap-space.png",
      title: "ESPAÇO SONINHO",
      description: "Temos um espaço dedicado a soneca dos bebês e das crianças.",
    },
    {
      icon: "/images/lamp.png",
      title: "SUA IDEIA",
      description: "Personalizamos as oficinas para refletir as suas ideias e o estilo do evento.",
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

  const portfolioItems = [
    {
      id: "1",
      title: "RECEPÇÃO DE CASAMENTO",
      subtitle: "Elegante celebração noturna",
      category: "weddings",
      image: "/images/carousel-image.jpeg",
    },
    {
      id: "2",
      title: "JANTAR DE GALA CORPORATIVO",
      subtitle: "Gala anual da empresa",
      category: "corporate",
      image: "/images/carousel-image2.jpeg",
    },
    {
      id: "3",
      title: "CASAMENTO AO AR LIVRE",
      subtitle: "Preparação da cerimónia no jardim",
      category: "weddings",
      image: "/images/carousel-image3.jpeg",
    },
    {
      id: "4",
      title: "FESTA DE ANIVERSÁRIO",
      subtitle: "Celebração doce",
      category: "birthdays",
      image: "/images/carousel-image4.jpeg",
    },
  ];

  const PortfolioCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const nextSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolioItems.length);
    }, []);

    const prevSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length);
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
              alt={portfolioItems[currentIndex].title}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {portfolioItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
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
          <section className="relative min-h-screen flex flex-col">
            <div className="">
              <div className="ml-auto w-full ">
                <div className=" relative h-[600px] flex items-center justify-center">
                  {/* Imagem de fundo */}
                  <Image
                    width={1200}
                    height={500}
                    className="mission-image"
                    src="/images/wedding-cover.png"
                    alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                  />
                </div>
              </div>
              <div className="pt-[100px]">
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
                          <h3 className="text-lg font-medium text-gray-800  capitalize">{feature.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
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
