"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// import { Button } from "@/components/atoms";
import { Header } from "@/components/organisms";
import { CardContent } from "@/components/organisms/Card";
import Link from "next/link";

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
// Portfolio Carousel Component
const PortfolioCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % portfolioItems.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length);
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
              currentIndex === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#615C5C] mb-4">Nossos serviços</h2>
          </div>
          <div className="flex flex-wrap  justify-center">
            {cardsData.map((card, index) => (
              <Link key={index} href={card.href} className=" ">
                <CardContent className=" flex flex-col flex-grow">
                  <div className="mb-2 flex flex-col">
                    <div className="mt-auto flex flex-col gap-2 items-center">
                      <Image src={card.image} alt={card.title} width={300} height={300} />
                      <div className="flex flex-col gap-2 items-center">
                        <h3 className="font-semibold text-[#444242]">{card.title}</h3>
                        <p className="text-sm text-[#8A8A8A] mt-1">Saiba mais</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { HeroSection };
