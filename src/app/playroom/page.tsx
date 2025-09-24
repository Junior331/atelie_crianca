"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
type CarouselItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
};
export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Dados para Brinquedoteca
  const playroomItems = [
    {
      id: "1",
      title: "ÁREA DE JOGOS",
      subtitle: "Espaço seguro e divertido",
      category: "playroom",
      image: "/images/carousel-image.jpeg",
    },
    {
      id: "2",
      title: "PISCINA DE BOLINHAS",
      subtitle: "Diversão garantida",
      category: "playroom",
      image: "/images/carousel-image2.jpeg",
    },
    {
      id: "3",
      title: "CANTINHO DA LEITURA",
      subtitle: "Estímulo à imaginação",
      category: "playroom",
      image: "/images/carousel-image3.jpeg",
    },
    {
      id: "4",
      title: "ZONA CRIATIVA",
      subtitle: "Arte e criatividade",
      category: "playroom",
      image: "/images/carousel-image4.jpeg",
    },
  ];

  // Dados para Mesa de Lanches
  const snackItems = [
    {
      id: "1",
      title: "MESA TEMÁTICA",
      subtitle: "Lanches saudáveis e divertidos",
      category: "snacks",
      image: "/images/snack-table.jpeg",
    },
    {
      id: "2",
      title: "DOCES ARTESANAIS",
      subtitle: "Feitos com carinho",
      category: "snacks",
      image: "/images/carousel-image.jpeg",
    },
    {
      id: "3",
      title: "SUCOS NATURAIS",
      subtitle: "Sabores da estação",
      category: "snacks",
      image: "/images/carousel-image2.jpeg",
    },
    {
      id: "4",
      title: "FRUTAS DECORADAS",
      subtitle: "Nutrição com diversão",
      category: "snacks",
      image: "/images/carousel-image3.jpeg",
    },
  ];

  // Dados para Biblioteca de Brinquedos
  const toyLibraryItems = [
    {
      id: "1",
      title: "BRINQUEDOS EDUCATIVOS",
      subtitle: "Aprender brincando",
      category: "toys",
      image: "/images/toy-library.jpeg",
    },
    {
      id: "2",
      title: "JOGOS DE MONTAR",
      subtitle: "Desenvolvimento motor",
      category: "toys",
      image: "/images/carousel-image4.jpeg",
    },
    {
      id: "3",
      title: "LIVROS INTERATIVOS",
      subtitle: "Histórias encantadas",
      category: "toys",
      image: "/images/carousel-image.jpeg",
    },
    {
      id: "4",
      title: "FANTASIAS E TEATRO",
      subtitle: "Imaginação sem limites",
      category: "toys",
      image: "/images/carousel-image2.jpeg",
    },
  ];

  const PlayroomCard = () => (
    <div className="bg-gray-50 h-[300px] p-6 rounded-lg  text-gray-800 flex flex-col justify-center">
      <h3 className="text-lg flex flex-col font-bold uppercase mb-2">
        BRINQUEDOTECA <span className="italic font-normal">MONOCROÁTICA</span>
      </h3>
      <p className="text-sm  text-gray-800">
        As oficinas infantis são uma forma de encantar os pequenos e trazer tranquilidade para os pais durante a festa.
        Nosso espaço é planejado para se compor com a
      </p>
    </div>
  );

  const SnackCard = () => (
    <div className="bg-gray-50 h-[300px] p-6 rounded-lg  text-gray-800 flex flex-col justify-center">
      <h3 className="text-lg flex flex-col font-bold uppercase mb-2">
        BRINQUEDOTECA<span className="italic font-normal">CANDY COLOR</span>
      </h3>
      <p className="text-sm  text-gray-800">
        As oficinas infantis são uma forma de encantar os pequenos e trazer tranquilidade para os pais durante a festa.
        Nosso espaço é planejado para se compor com a
      </p>
    </div>
  );

  const ToyLibraryCard = () => (
    <div className="bg-gray-50 h-[300px] p-6 rounded-lg text-gray-800 flex flex-col justify-center">
      <h3 className="text-lg font-bold uppercase mb-2">
        BRINQUEDOTECA <span className="italic font-normal">COLORIDONA</span>
      </h3>
      <p className="text-sm text-gray-700">
        As oficinas infantis são uma forma de encantar os pequenos e trazer tranquilidade para os pais durante a festa.
        Nosso espaço é planejado para se compor com a
      </p>
    </div>
  );

  const Carousel = ({ items }: { items: CarouselItem[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const nextSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

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
        className="relative w-full h-[300px] overflow-hidden bg-gray-100 group rounded-lg"
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
              src={items[currentIndex]?.image}
              alt={items[currentIndex]?.title}
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
          {items.map((_, index) => (
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
          <section className="relative  min-h-screen flex flex-col">
            <div className="">
              <div className="ml-auto w-full ">
                <div className=" relative h-[600px] flex items-center justify-center">
                  {/* Imagem de fundo */}
                  <Image
                    width={1200}
                    height={500}
                    src="/images/playroom-cover.png"
                    alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                    className="mission-image"
                  />
                </div>
              </div>

              <div className="bg-white pt-[150px] px-8">
                <div className="w-full  mx-auto space-y-12">
                  {/* Primeira seção - Brinquedoteca */}
                  <motion.div
                    className="flex flex-col lg:flex-row gap-8 items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="w-full lg:w-2/3">
                      <Carousel items={playroomItems} />
                    </div>
                    <div className="w-full lg:w-1/3">
                      <PlayroomCard />
                    </div>
                  </motion.div>

                  {/* Segunda seção - Mesa de Lanches */}
                  <motion.div
                    className="flex flex-col lg:flex-row-reverse gap-8 items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="w-full  lg:w-2/3">
                      <Carousel items={snackItems} />
                    </div>
                    <div className="w-full lg:w-1/3">
                      <SnackCard />
                    </div>
                  </motion.div>

                  {/* Terceira seção - Biblioteca de Brinquedos */}
                  <motion.div
                    className="flex flex-col lg:flex-row gap-8 items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="w-full lg:w-2/3">
                      <Carousel items={toyLibraryItems} />
                    </div>
                    <div className="w-full lg:w-1/3">
                      <ToyLibraryCard />
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
