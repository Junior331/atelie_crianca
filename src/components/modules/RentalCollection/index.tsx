"use client";

import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Heart,
  ChevronLeft,
} from "lucide-react";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useProducts } from "@/hooks/use-products";
import { useFavorites } from "@/hooks/use-favorites";
import { CardContent } from "@/components/organisms/Card";
import {
  workshopFolders,
  foldersWithSubfolders,
  folderImageCounts,
  subfolderImageCounts,
} from "@/utils/workshop-categories";
import { Product } from "@/types/product";

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
      className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg bg-gray-100 group"
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

// Componente para o card de oficina com hover infinito
const WorkshopCard = ({
  workshopName,
  onImageClick,
  onDetailsClick,
  onFavoriteClick,
  isFavorite,
}: {
  workshopName: string;
  onImageClick: (itemIndex: number) => void;
  onDetailsClick: () => void;
  onFavoriteClick: () => void;
  isFavorite: boolean;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Obter o número de imagens para esta oficina
  const imageCount = folderImageCounts[workshopName] || 1;

  // Array com os índices das imagens (1, 2, 3, etc.)
  const imageIndices = Array.from({ length: imageCount }, (_, i) => i + 1);

  // Função para alternar imagens
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
  }, [imageCount]);

  // Iniciar/parar o intervalo baseado no hover
  useEffect(() => {
    if (isHovered && imageCount > 1) {
      intervalRef.current = setInterval(nextImage, 2000); // Troca a cada 2.8s (800ms + 2s)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, imageCount, nextImage]);

  // Reset para primeira imagem quando sai do hover
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  // Lidar com subpastas especiais (como BRINQUEDOTECA)
  const getImageBasePath = () => {
    if (workshopName === "BRINQUEDOTECA") {
      // Para BRINQUEDOTECA, usar a subpasta COLORIDA que tem mais imagens
      return "/images/workshops/BRINQUEDOTECA/COLORIDA";
    }
    return `/images/workshops/${workshopName}`;
  };

  const formatWorkshopName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onDetailsClick}
      >
        <div
          className="relative h-48 overflow-hidden rounded-t-lg cursor-pointer"
          onClick={() => onImageClick(currentImageIndex)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-0"
            >
              <SmartImage
                basePath={getImageBasePath()}
                imageName={imageIndices[currentImageIndex].toString()}
                alt={workshopName}
                fill={true}
                className="rounded-t-lg object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {imageCount > 1 && (
            <motion.div
              className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentImageIndex + 1}/{imageCount}
            </motion.div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <div className="mt-auto flex gap-2 items-end justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {formatWorkshopName(workshopName)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Oficina de {formatWorkshopName(workshopName.toLowerCase())}{" "}
                  com {imageCount} {imageCount === 1 ? "opção" : "opções"}{" "}
                  disponíveis
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={onFavoriteClick}
                className={`border-none ${
                  isFavorite
                    ? "text-red-500 hover:bg-red-50"
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart fill={isFavorite ? "currentColor" : "none"} className="!w-6 !h-6" />
              </Button>
            </div>
          </div>
          {/* <div className="mt-auto flex gap-2">
            <Button
              size="sm"
              onClick={onDetailsClick}
              className="flex-1 bg-[#d9037d] hover:bg-[#c00270] text-white"
            >
              Ver Detalhes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onFavoriteClick}
              className={`p-2 ${
                isFavorite
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-gray-500 border-gray-300 hover:text-red-500 hover:border-red-300"
              }`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RentalCollection = () => {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toggleFavorite, isFavorite } = useFavorites();

  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    selectedWorkshopFilters,
    setSelectedWorkshopFilters,
  } = useProducts();

  // Filtrar oficinas baseado na busca e filtros selecionados
  const filteredWorkshops = useMemo(() => {
    let filtered = workshopFolders;

    // Aplicar busca por termo
    if (searchTerm) {
      filtered = filtered.filter((workshop) =>
        workshop.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros selecionados
    if (selectedWorkshopFilters.length > 0) {
      filtered = filtered.filter((workshop) => {
        // Verificar se a oficina está nos filtros selecionados
        if (selectedWorkshopFilters.includes(workshop)) {
          return true;
        }

        // Verificar se é uma subpasta da BRINQUEDOTECA
        if (workshop === "BRINQUEDOTECA") {
          const subfolders = foldersWithSubfolders["BRINQUEDOTECA"] || [];
          const subfoldersFilters = subfolders.map(
            (sub) => `BRINQUEDOTECA-${sub}`
          );
          return subfoldersFilters.some((filter) =>
            selectedWorkshopFilters.includes(filter)
          );
        }

        return false;
      });
    }

    return filtered;
  }, [searchTerm, selectedWorkshopFilters]);

  // Filtrar pastas baseado na busca dos filtros
  const filteredFolders = useMemo(() => {
    if (!filterSearchTerm) return workshopFolders;

    return workshopFolders.filter((folder) =>
      folder.toLowerCase().includes(filterSearchTerm.toLowerCase())
    );
  }, [filterSearchTerm]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const toggleAdvancedFilter = (filter: string) => {
    setSelectedWorkshopFilters((prev) => {
      // Se é BRINQUEDOTECA, marcar/desmarcar todas as subpastas
      if (filter === "BRINQUEDOTECA") {
        const subfolders = foldersWithSubfolders["BRINQUEDOTECA"] || [];
        const subfoldersFilters = subfolders.map(
          (sub) => `BRINQUEDOTECA-${sub}`
        );

        if (prev.includes(filter)) {
          // Desmarcar BRINQUEDOTECA e todas as suas subpastas
          return prev.filter(
            (f) => f !== filter && !subfoldersFilters.includes(f)
          );
        } else {
          // Marcar BRINQUEDOTECA e todas as suas subpastas
          const newFilters = [...prev, filter];
          subfoldersFilters.forEach((subFilter) => {
            if (!newFilters.includes(subFilter)) {
              newFilters.push(subFilter);
            }
          });
          return newFilters;
        }
      }

      // Se é uma subpasta da BRINQUEDOTECA
      if (filter.startsWith("BRINQUEDOTECA-")) {
        let newFilters: string[];
        if (prev.includes(filter)) {
          newFilters = prev.filter((f) => f !== filter);
          // Se desmarcar uma subpasta, desmarcar também a pasta principal
          newFilters = newFilters.filter((f) => f !== "BRINQUEDOTECA");
        } else {
          newFilters = [...prev, filter];

          // Verificar se todas as subpastas estão marcadas para marcar a principal
          const subfolders = foldersWithSubfolders["BRINQUEDOTECA"] || [];
          const subfoldersFilters = subfolders.map(
            (sub) => `BRINQUEDOTECA-${sub}`
          );
          const allSubfoldersSelected = subfoldersFilters.every((subFilter) =>
            newFilters.includes(subFilter)
          );

          if (allSubfoldersSelected && !newFilters.includes("BRINQUEDOTECA")) {
            newFilters.push("BRINQUEDOTECA");
          }
        }
        return newFilters;
      }

      // Para outras pastas, comportamento normal
      if (prev.includes(filter)) {
        return prev.filter((f) => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  const clearAllAdvancedFilters = () => {
    setSelectedWorkshopFilters([]);
  };

  const getTotalAdvancedFilters = () => {
    return selectedWorkshopFilters.length;
  };

  const handleImageClick = (workshopName: string, itemIndex: number) => {
    // Navegar para página de detalhes da oficina com item específico
    const workshopSlug = encodeURIComponent(
      workshopName.toLowerCase().replace(/\s+/g, "-")
    );
    router.push(`/workshop/${workshopSlug}-item-${itemIndex + 1}`);
  };

  const handleDetailsClick = (workshopName: string) => {
    // Navegar para página de detalhes da oficina (primeiro item)
    const workshopSlug = encodeURIComponent(
      workshopName.toLowerCase().replace(/\s+/g, "-")
    );
    router.push(`/workshop/${workshopSlug}`);
  };

  const createWorkshopProduct = (workshopName: string): Product => {
    const formatWorkshopName = (name: string) => {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    return {
      id: `workshop-${workshopName.toLowerCase().replace(/\s+/g, "-")}`,
      name: formatWorkshopName(workshopName),
      description: `Oficina de ${formatWorkshopName(
        workshopName.toLowerCase()
      )} com múltiplas opções disponíveis`,
      category: "favorites",
      image: `/images/workshops/${workshopName}/1.jpg`,
      workshopFolder: workshopName,
      workshopSubfolder:
        workshopName === "BRINQUEDOTECA" ? "COLORIDA" : undefined,
      duration: "1-2 horas",
      ageRange: "5-12 anos",
      highlights: [
        "Materiais inclusos",
        "Atividade criativa",
        "Lembrança especial",
      ],
    };
  };

  const handleFavoriteClick = (workshopName: string) => {
    const product = createWorkshopProduct(workshopName);
    toggleFavorite(product);
  };

  const isWorkshopFavorite = (workshopName: string) => {
    const productId = `workshop-${workshopName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
    return isFavorite(productId);
  };

  return (
    <section ref={ref} className="bg-white">
      <div className="pt-10 bg-white">
        <div className="container max-w-none px-4">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <PortfolioCarousel />
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="w-full container max-w-none px-4 flex flex-col lg:flex-row md:gap-8 min-h-full">
          {/* Botão de Filtros Mobile */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full bg-[#d9037d] hover:bg-[#c00270] text-white flex items-center justify-center gap-2"
            >
              <Search size={16} />
              {isFiltersOpen ? "Esconder Filtros" : "Mostrar Filtros"}
              {getTotalAdvancedFilters() > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {getTotalAdvancedFilters()}
                </span>
              )}
            </Button>
          </div>

          {/* Sidebar com Filtros */}
          <div
            className={`w-full lg:max-w-80 lg:w-full flex-shrink-0 lg:min-h-full ${
              isFiltersOpen ? "block" : "hidden"
            } lg:block`}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="min-h-full">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Filtrar Oficinas
                  </h3>

                  {/* Busca de filtros */}
                  <div className="relative mb-4">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="Buscar oficinas..."
                      value={filterSearchTerm}
                      onChange={(e) => setFilterSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9037d] focus:border-transparent"
                    />
                  </div>

                  {/* Lista de oficinas - com scroll */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {filteredFolders.map((folder) => {
                      const hasSubfolders =
                        folder === "BRINQUEDOTECA"
                          ? foldersWithSubfolders["BRINQUEDOTECA"]
                          : null;

                      return (
                        <div
                          key={folder}
                          className="border-b border-gray-100 last:border-b-0 pb-2"
                        >
                          {/* Pasta principal */}
                          <div
                            className={`flex items-center justify-between ${
                              hasSubfolders ? "cursor-pointer" : ""
                            }`}
                            onClick={
                              hasSubfolders
                                ? () => toggleFolder(folder)
                                : undefined
                            }
                          >
                            <label
                              className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2 flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedWorkshopFilters.includes(
                                  folder
                                )}
                                onChange={() => toggleAdvancedFilter(folder)}
                                className="rounded border-gray-300 text-[#d9037d] focus:ring-[#d9037d]"
                              />
                              <span className="text-sm text-gray-700 font-medium">
                                {folder}
                              </span>
                              <span className="text-xs text-gray-500 ml-auto">
                                ({folderImageCounts[folder] || 1})
                              </span>
                            </label>

                            {hasSubfolders && (
                              <div className="p-1">
                                {expandedFolders[folder] ? (
                                  <ChevronDown
                                    size={16}
                                    className="text-gray-400"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Subpastas */}
                          {hasSubfolders && expandedFolders[folder] && (
                            <div className="ml-6 mt-2 space-y-1">
                              {hasSubfolders.map((subfolder) => (
                                <label
                                  key={`${folder}-${subfolder}`}
                                  className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedWorkshopFilters.includes(
                                      `${folder}-${subfolder}`
                                    )}
                                    onChange={() =>
                                      toggleAdvancedFilter(
                                        `${folder}-${subfolder}`
                                      )
                                    }
                                    className="rounded border-gray-300 text-[#d9037d] focus:ring-[#d9037d]"
                                  />
                                  <span className="text-sm text-gray-600">
                                    {subfolder}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-auto">
                                    (
                                    {subfolderImageCounts[
                                      `${folder}-${subfolder}`
                                    ] || 0}
                                    )
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Limpar filtros */}
                  {getTotalAdvancedFilters() > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        onClick={clearAllAdvancedFilters}
                        className="text-sm text-red-600 hover:text-red-800 font-medium w-full"
                      >
                        Limpar todos os filtros
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 w-full min-h-full flex flex-col">
            {/* Barra de busca principal */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pesquisar oficinas..."
                  className="w-full pl-4 pr-10 py-3 border border-[#eaeaea] rounded-lg text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#787885]" />
              </div>
            </motion.div>

            {/* Filtros ativos */}
            {getTotalAdvancedFilters() > 0 && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 py-1">
                    Filtros ativos:
                  </span>
                  {selectedWorkshopFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#d9037d] text-white rounded-full text-sm"
                    >
                      {filter}
                      <button
                        onClick={() => toggleAdvancedFilter(filter)}
                        className="hover:bg-[#c00270] rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Grid de oficinas - com scroll */}
            <div className="flex-1 overflow-y-auto">
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
                layout
              >
                {filteredWorkshops.map((workshopName) => (
                  <WorkshopCard
                    key={workshopName}
                    workshopName={workshopName}
                    onImageClick={(itemIndex) =>
                      handleImageClick(workshopName, itemIndex)
                    }
                    onDetailsClick={() => handleDetailsClick(workshopName)}
                    onFavoriteClick={() => handleFavoriteClick(workshopName)}
                    isFavorite={isWorkshopFavorite(workshopName)}
                  />
                ))}
              </motion.div>

              {filteredWorkshops.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-lg">
                    Nenhuma oficina encontrada com os filtros aplicados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { RentalCollection };
