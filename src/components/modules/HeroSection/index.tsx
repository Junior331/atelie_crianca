"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Palette,
  Armchair,
  TrendingUp,
  Star,
  User,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/organisms";
import { CardContent } from "@/components/organisms/Card";

// Portfolio items data
const portfolioItems = [
  {
    id: "1",
    title: "RECEPÇÃO DE CASAMENTO",
    subtitle: "Elegante celebração noturna",
    category: "weddings",
    image: "/images/wedding-elegant.png",
  },
  {
    id: "2",
    title: "JANTAR DE GALA CORPORATIVO",
    subtitle: "Gala anual da empresa",
    category: "corporate",
    image: "/images/corporate-event.png",
  },
  {
    id: "3",
    title: "CASAMENTO AO AR LIVRE",
    subtitle: "Preparação da cerimónia no jardim",
    category: "weddings",
    image: "/images/outdoor-wedding-ceremony.jpg",
  },
  {
    id: "4",
    title: "FESTA DE ANIVERSÁRIO",
    subtitle: "Celebração doce",
    category: "birthdays",
    image: "/images/birthday-party-pink.jpg",
  },
];

const cardsData = [
  {
    href: "/about",
    title: "QUEM SOMOS",
    image: "https://picsum.photos/seed/101/200/300",
  },
  {
    href: "/workshops",
    title: "OFICINAS",
    image: "https://picsum.photos/seed/102/200/300",
  },
  {
    href: "/brinquedoteca",
    title: "BRINQUEDOTECA",
    image: "https://picsum.photos/seed/103/200/300",
  },
  {
    href: "/casamento",
    title: "CASAMENTO",
    image: "https://picsum.photos/seed/104/200/300",
  },
  {
    href: "/products",
    title: "PRODUTOS",
    image: "https://picsum.photos/seed/105/200/300",
  },
  {
    href: "/MESA DE LANCHINHO",
    title: "souvenirstable",
    image: "https://picsum.photos/seed/106/200/300",
  },
  {
    href: "/PORTIFOLIO",
    title: "portfolio",
    image: "https://picsum.photos/seed/107/200/300",
  },
  {
    href: "/MOBILIARIO",
    title: "furniture",
    image: "https://picsum.photos/seed/108/200/300",
  },
  {
    href: "/GRUPO ATELIÊ",
    title: "ateliegroup",
    image: "https://picsum.photos/seed/109/200/300",
  },
];

const featuresData = [
  {
    icon: Users,
    title: "nossa equipe",
    description: "Mais de 120 colaboradores no Rio e 6 fixos no escritório.",
  },
  {
    icon: Palette,
    title: "paleta de cores",
    description:
      "Mobiliário, suportes e uniformes combinam com as cores do evento.",
  },
  {
    icon: Armchair,
    title: "mobiliário próprio",
    description:
      "Acervo variado de móveis personalizados que seguem a paleta do evento.",
  },
  {
    icon: TrendingUp,
    title: "treinamento",
    description:
      "Equipe em constante capacitação para serviços mais eficientes e exclusivos.",
  },
  {
    icon: Star,
    title: "experiência",
    description: "7 anos de atuação no mercado.",
  },
  {
    icon: User,
    title: "escritório",
    description:
      "Estrutura com 6 pessoas dedicadas ao atendimento antes, durante e depois do evento.",
  },
  {
    icon: Clock,
    title: "agilidade",
    description:
      "Entregas rápidas, com qualidade e pontualidade; mais de 100 eventos fechados em menos de 48h",
  },
  {
    icon: MapPin,
    title: "+ de 1000 eventos",
    description:
      "Já realizaramos mais de 1.000 eventos no RJ, incluindo festas, casamentos e corporativos.",
  },
];
// Portfolio Carousel Component
const PortfolioCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlay]);

  return (
    <div
      className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gray-100 group"
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
          <div className="container max-w-none px-4 py-10">
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

        <div className=" relative flex-1 flex flex-col items-center ">
          <div className=" ">
            <h2 className="text-3xl md:text-4xl font-bold text-[#615C5C] mb-4">
              Nossos serviços
            </h2>
          </div>
          <div className="flex flex-wrap  justify-center">
            {cardsData.map((card, index) => (
              <Link key={index} href={card.href} className=" ">
                <CardContent className=" flex flex-col flex-grow">
                  <div className="mb-2 flex flex-col">
                    <div className="mt-auto flex flex-col gap-2 items-center">
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={300}
                        height={300}
                      />
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
        <div className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuresData.map((feature, index) => {
                const Icon = feature.icon;
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
                      <Icon size={48} className="text-gray-600" />
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
          className="relative min-h-[500px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/mission-bg.jpg')" }}
        >
          <div className="relative z-10 flex items-center min-h-[500px] px-4">
            <div className="container mx-auto flex items-center">
              {/* Text Card - Left Side */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/95 p-8 rounded-lg shadow-lg max-w-md flex flex-col items-center justify-center"
                >
                  <h2 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wider text-center">
                    MAS AFINAL
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center max-w-72">
                    QUAL A NOSSA MISSÃO?
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-center">
                    Nossa missão é proporcionar momentos extremamente divertidos
                    longe dos aparelhos eletrônicos, estimular os talentos das
                    crianças e criar laços afetivos entre pais e filhos.
                  </p>
                </motion.div>
              </div>

              <div className="container mx-auto px-4 relative py-16 md:py-24">
                {/* Desktop Layout */}
                <div className="hidden lg:block relative max-w-7xl mx-auto">
                  <div className="flex items-center justify-center relative">
                    {/* Mission Card - Overlapping the image */}
                    <div className="absolute left-0 z-10 w-full max-w-xl">
                      <div className="mission-card text-center">
                        <div className="mission-subtitle">MAS A FINAL,</div>
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
                    <div className="ml-auto w-full max-w-4xl">
                      <div className="mission-image-container">
                        <Image
                          width={1200}
                          height={800}
                          src="../../../assets/images/children-play-area.jpg"
                          alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                          className="mission-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden max-w-2xl mx-auto">
                  {/* Mission Card */}
                  <div className="mission-card mission-card-mobile text-center mb-8">
                    <div className="mission-subtitle">MAS A FINAL,</div>
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
                        src="../../../assets/images/children-play-area.jpg"
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
      </section>
    </>
  );
};

export { HeroSection };
