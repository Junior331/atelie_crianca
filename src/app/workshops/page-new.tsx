"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/organisms";
import { LoadingSpinner, Button } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { Card, CardContent } from "@/components/organisms/Card";
import { getImageOficinas, images_menores } from "@/assets/fotos_menores";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];

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

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Lista de todas as imagens usando as chaves do getImageOficinas
  const allImages = useMemo(() => {
    const images = [
      "img007", "img008", "img009", "img010", "img012", "img013", "img015", "img017", "img018", "img019",
      "img021", "img022", "img028", "img029", "img030", "img031", "img032", "img039", "img040", "img041",
      "img042", "img044", "img045", "img046", "img047", "img048", "img049", "img050", "img052", "img057",
      "img103", "img104", "img109", "img112", "img113", "img118", "img119", "img120", "img121", "img125",
      "img126", "img127", "img128", "img129", "img130", "img133", "img134", "img135", "img137", "img144",
      "img145", "img150", "img151", "img153", "img154", "img165", "img166", "img168", "img170", "img171",
      "img173", "img174", "img175", "img176", "img177", "img178", "img179", "img180", "img181", "img182",
      "img184", "img186", "img187", "img188", "img189", "img190", "img191", "img192", "img193", "img194",
      "img195", "img196", "img197", "img198", "img199", "img200", "img201", "img202", "img203", "img206",
      "img207", "img208", "img209", "img210", "img211", "img212", "img213", "img214", "img215", "img216",
      "img217", "img218", "img219", "img220", "img221", "img222", "img223", "img225", "img226", "img227",
      "img228", "img229", "img230", "img250", "img252", "img253", "img254", "img288", "img305", "img306",
      "img307", "img308", "img309", "img310", "img311", "img312", "img313", "img314", "img342", "img343",
      "img344", "img345", "img346", "img347", "img350", "img351", "img353", "img361", "img365", "img366",
      "img367", "img368", "img372", "img373", "img374", "img375", "img379", "img382", "img413", "img424",
      "img441", "img442", "img450", "img455", "img456", "img463", "img468", "img469", "img494", "img495",
      "img496", "img501", "img505", "img507", "img508", "img519", "img521", "img525", "img526", "img527",
      "img528", "img529", "img530", "img531", "img532", "img536", "img537", "img546", "img548", "img549",
      "img550", "img551", "img552", "img553", "img554", "img555", "img556", "img557", "img558", "img559",
      "img560", "img561", "img562", "img563", "img564", "img565", "img570", "img575", "img584", "img589",
      "img590", "img591", "img594", "img597", "img598", "img599", "img600", "img602", "img603", "img604",
      "img605", "img606", "img607", "img608", "img609", "img610", "img611", "img612", "img613", "img614",
      "img615", "img616", "img617", "img618", "img619", "img620", "img621", "img622", "img623", "img624",
      "img625", "img626", "img627", "img628", "img629", "img630", "img631", "img632", "img638", "img640",
      "img641", "img642", "img643", "img645", "img646", "img647", "img649", "img650", "img651", "img655",
      "img657", "img658", "img659", "img661", "img664", "img667", "img681", "img682", "img683", "img684",
      "img685", "img686", "img688", "img689", "img691", "img692", "img693", "img694", "img695", "img696",
      "img697", "img711", "img712", "img713", "img714", "img715", "img719", "img720", "img721", "img722",
      "img723", "img724", "img725", "img726", "img727", "img728", "img729", "img730", "img748", "img750",
      "img752", "img753", "img754", "img755", "img756", "img757", "img758", "img759", "img760", "img761",
      "img762", "img763", "img764", "img765", "img766", "img768", "img769", "img770", "img771", "img772",
      "img773", "img774", "img775", "img776", "img777", "img778", "img780", "img781", "img783", "img786",
      "img787", "img791", "img792", "img793", "img794", "img799", "img800", "img802", "img804", "img805",
      "img806", "img809", "img810", "img811", "img812", "img813", "img815", "img816", "img817", "img818",
      "img819", "img820", "img821", "img822", "img832", "img833", "img834", "img837", "img839", "img840",
      "img841", "img842", "img843", "img844", "img845", "img846", "img847", "img848", "img849", "img850",
      "img851", "img852", "img853", "img854", "img855", "img856", "img857", "img859", "img860", "img868",
      "img869", "img875", "img876", "img877", "img878", "img879", "img885", "img886", "img887", "img889",
      "img900", "img901", "IMG_0002", "IMG_0005", "IMG_0010", "IMG_0011", "IMG_0012", "IMG_0013", "IMG_0014",
      "IMG_0016", "IMG_0017", "IMG_0021", "IMG_0045", "IMG_0046", "IMG_0049", "IMG_0050", "IMG_0051", "IMG_0053",
      "IMG_0054", "IMG_0059", "IMG_0062", "IMG_0063", "IMG_0066", "IMG_0067", "IMG_0071", "IMG_0073", "IMG_0075",
      "IMG_0078", "IMG_0079", "IMG_0080", "IMG_0082", "IMG_0087", "IMG_0089", "IMG_0090", "IMG_0091", "IMG_0093",
      "IMG_0094", "IMG_0095", "IMG_0098", "IMG_0100", "IMG_0102", "IMG_0103", "IMG_0104", "IMG_0105", "IMG_0111",
      "IMG_0112", "IMG_0121", "IMG_0127", "IMG_0128", "IMG_0130", "IMG_0132", "IMG_0133", "IMG_0134", "IMG_0135",
      "IMG_0136", "IMG_0142", "IMG_0143", "IMG_0147", "IMG_0151", "IMG_0158", "IMG_0161", "IMG_0163", "IMG_0164",
      "IMG_0165", "IMG_0169", "IMG_0171", "IMG_0179", "IMG_0181", "IMG_0182", "IMG_0184", "IMG_0189", "IMG_0190",
      "IMG_0193", "IMG_0197", "IMG_0200", "IMG_0202", "IMG_0226", "IMG_0233", "IMG_0250", "IMG_0251", "IMG_0252",
      "IMG_0259", "IMG_0260", "IMG_0262", "IMG_0264", "IMG_0267", "IMG_9786", "IMG_9804", "IMG_9825", "IMG_9826",
      "IMG_9827", "IMG_9828", "IMG_9829", "IMG_9844", "IMG_9845", "IMG_9849", "IMG_9851", "IMG_9853", "IMG_9855",
      "IMG_9856", "IMG_9859", "IMG_9860", "IMG_9894", "IMG_9895", "IMG_9896", "IMG_9897", "IMG_9898", "IMG_9910",
      "IMG_9912", "IMG_9915", "IMG_9917", "IMG_9919", "IMG_9921", "IMG_9922", "IMG_9923", "IMG_9928", "IMG_9929",
      "IMG_9931", "IMG_9932", "IMG_9938", "IMG_9942", "IMG_9945", "IMG_9949", "IMG_9951", "IMG_9952", "IMG_9957",
      "IMG_9958", "IMG_9962", "IMG_9964", "IMG_9969", "IMG_9971", "IMG_9974", "IMG_9980", "IMG_9981", "IMG_9982",
      "IMG_9984", "IMG_9985", "IMG_9987", "IMG_9992", "IMG_9994", "IMG_9996", "IMG_9998", "IMG_9999"
    ];
    return images;
  }, []);

  const totalPages = Math.ceil(allImages.length / itemsPerPage);

  const currentImages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allImages.slice(startIndex, endIndex);
  }, [allImages, currentPage, itemsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const toggleFavorite = (imageKey: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(imageKey)) {
        newFavorites.delete(imageKey);
      } else {
        newFavorites.add(imageKey);
      }
      return newFavorites;
    });
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
          className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50"
        >
          <Header />

          {/* Carrossel */}
          <div className="container max-w-none px-0 mb-8">
            <PortfolioCarousel />
          </div>

          <div className="flex flex-col px-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Itens por página:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, allImages.length)} de {allImages.length} fotos
              </div>
            </div>

            {/* Image Grid */}
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12"
            >
              <AnimatePresence mode="popLayout">
                {currentImages.map((imageKey, index) => (
                  <motion.div
                    key={`${currentPage}-${imageKey}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer overflow-hidden">
                      <div
                        className="relative h-48 overflow-hidden bg-gray-100"
                        onClick={() => setSelectedImage(imageKey)}
                      >
                        <Image
                          src={getImageOficinas(imageKey as keyof typeof images_menores)}
                          alt={`Foto ${imageKey}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                        {/* Skeleton loading state */}
                        <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10" />
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#615C5C] text-sm truncate">{imageKey}</h3>
                            <p className="text-xs text-[#8A8A8A] mt-1">
                              Montagem e decoração temáticos
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(imageKey);
                            }}
                            className="border-none p-1 h-auto flex-shrink-0"
                          >
                            <Image
                              width={20}
                              height={20}
                              alt="Coração"
                              src={favorites.has(imageKey) ? "/images/coracao_solid.png" : "/images/coracao.png"}
                            />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-pink-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>

          {/* Image Modal */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="relative max-w-6xl max-h-[90vh] w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={getImageOficinas(selectedImage as keyof typeof images_menores)}
                    alt={`Foto ${selectedImage}`}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
