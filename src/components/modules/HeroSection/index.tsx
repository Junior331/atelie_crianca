"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Footer } from "../Footer";
import { getIcon } from "@/assets/icons";
import { Header } from "@/components/organisms";
import { CardContent } from "@/components/organisms/Card";
import { getProduto } from "@/assets/Produtos";

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

const cardsData = [
  {
    href: "/about",
    title: "QUEM SOMOS",
    image: "/images/who-we-are.jpeg",
  },
  {
    href: "/workshops",
    title: "OFICINAS",
    image: "/images/oficinas.jpeg",
  },
  {
    href: "/playroom",
    title: "BRINQUEDOTECA",
    image: "/images/toy-library.jpeg",
  },
  {
    href: "/wedding",
    title: "CASAMENTO",
    image: "/images/wedding.jpeg",
  },
  {
    href: "/products",
    title: "PRODUTOS",
    image: getProduto('arcos', 'arco_disney_personalizado'),
  },

  // {
  //   href: "/portfolio",
  //   title: "portfolio",
  //   image: "https://picsum.photos/seed/107/200/300",
  // },
  {
    href: "/souvenirstable",
    title: "MESA DE LANCHINHO",
    image: "/images/snack-table.jpeg",
  },
  // {
  //   href: "/ateliegroup",
  //   title: "Grupo Ateliê",
  //   image: "https://picsum.photos/seed/106/200/300",
  // },
];

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
// Services Carousel Component for Desktop
const ServicesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerView = 5; // Show 4 cards at a time on desktop

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % cardsData.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % cardsData.length;
      cards.push(cardsData[index]);
    }
    return cards;
  };

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50"
      >
        <ChevronLeft size={20} className="text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50"
      >
        <ChevronRight size={20} className="text-gray-800" />
      </button>

      {/* Cards Container */}
      <div className="">
        <motion.div
          className="flex gap-4 "
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {getVisibleCards().map((card, index) => (
            <motion.div
              key={`${currentIndex}-${index}`}
              className="flex-none w-1/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={card.href}>
                <CardContent className="flex flex-col flex-grow h-full">
                  <div className="mb-2 flex flex-col">
                    <div className="mt-auto flex flex-col gap-2 items-center">
                      <div className="relative w-full h-[300px]">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <h3 className="font-semibold text-[#444242] text-center">
                          {card.title}
                        </h3>
                        <p className="text-sm text-[#8A8A8A] mt-1">
                          Saiba mais
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Portfolio Carousel Component
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
              currentIndex === index
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <>
      <Header isSecundary={false} />
      <section className="relative min-h-screen flex flex-col">
        {/* Hero Banner */}

        {/* Portfolio Carousel Section */}
        <div className="bg-white  mt-[100px]">
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

        <div className="relative flex-1 flex flex-col items-center px-4 py-8">
          <div className="hidden md:block w-full max-w-6xl">
            <ServicesCarousel />
          </div>

          {/* Mobile Grid */}
          <div className="md:hidden grid grid-cols-2 gap-4 justify-center items-center">
            {cardsData.map((card, index) => (
              <Link key={index} href={card.href}>
                <CardContent className="flex flex-col flex-grow">
                  <div className="mb-2 flex flex-col">
                    <div className="mt-auto flex flex-col gap-2 items-center">
                      <div className="relative w-full h-[300px]">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <h3 className="font-semibold text-[#444242]">
                          {card.title}
                        </h3>
                        <p className="text-sm text-[#8A8A8A] mt-1">
                          Saiba mais
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Grid Section */}
        <div className="md:py-16 px-4 py-8">
          <div className="container mx-auto max-w-6xl">
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
        <div
          className="relative  bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/mission-bg.jpg')" }}
        >
          <div className="relative z-10 flex items-center px-4">
            <div className="container mx-auto flex items-center">
              <div className="container mx-auto relative md:py-24">
                {/* Desktop Layout */}
                <div className="hidden lg:block relative max-w-7xl mx-auto">
                  <div className="flex items-center justify-center relative">
                    {/* Mission Card - Overlapping the image */}
                    <div className="absolute left-0 top-[150px] z-10 w-full max-w-xl">
                      <div className="mission-card text-center">
                        <div className="mission-subtitle">MAS AFINAL,</div>
                        <h2 className="mission-title">QUAL A NOSSA MISSÃO?</h2>
                        <p className="mission-description">
                          Nossa missão é proporcionar momentos extremamente
                          divertidos longe dos aparelhos eletrônicos, estimular
                          os talentos das crianças e criar laços afetivos entre
                          pais e filhos.
                        </p>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="ml-auto w-full max-w-3xl">
                      <div className="mission-image-container">
                        <Image
                          width={1200}
                          height={500}
                          src="/images/mission-bg2.jpeg"
                          alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                          className="mission-image h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden max-w-2xl mx-auto">
                  {/* Mission Card */}
                  <div className="mission-card mission-card-mobile text-center mb-8">
                    <div className="mission-subtitle">MAS AFINAL,</div>
                    <h2 className="mission-title">QUAL A NOSSA MISSÃO?</h2>
                    <p className="mission-description">
                      Nossa missão é proporcionar momentos extremamente
                      divertidos longe dos aparelhos eletrônicos, estimular os
                      talentos das crianças e criar laços afetivos entre pais e
                      filhos.
                    </p>
                  </div>

                  {/* Image with overlap */}
                  <div className="relative -mt-10">
                    <div className="mission-image-container">
                      <Image
                        width={1200}
                        height={800}
                        src="/images/mission-bg2.jpeg"
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
        <Footer />
      </section>
    </>
  );
};

export { HeroSection };
