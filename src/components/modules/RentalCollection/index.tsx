// NOVA VERSÃO - Usando dados do banco Supabase
// Este arquivo é uma alternativa ao index.tsx que usa dados dinâmicos do banco
// Para ativar, renomeie index.tsx para index-old.tsx e este arquivo para index.tsx

"use client";

import { Search, X } from "lucide-react";
import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { CardContent } from "@/components/organisms/Card";
import { useWorkshops } from "@/hooks/use-workshops";
import { useFavorites } from "@/hooks/use-favorites";
import type { WorkshopWithImages } from "@/types/database";
import type { Product } from "@/types/product";

// Componente para o card de oficina com hover infinito
const WorkshopCard = ({
  workshop,
  onDetailsClick,
  onFavoriteClick,
  isFavorite,
}: {
  workshop: WorkshopWithImages;
  onDetailsClick: () => void;
  onFavoriteClick: () => void;
  isFavorite: boolean;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const imageCount = workshop.workshop_images.length;

  // Função para alternar imagens
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };

  // Iniciar/parar o intervalo baseado no hover
  useEffect(() => {
    if (isHovered && imageCount > 1) {
      intervalRef.current = setInterval(nextImage, 2000);
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
  }, [isHovered, imageCount]);

  // Reset para primeira imagem quando sai do hover
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

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
        <div className="relative w-full h-64 overflow-hidden cursor-pointer">
          {imageCount > 0 ? (
            <>
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
                  <Image
                    src={workshop.workshop_images[currentImageIndex].image_url}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </motion.div>
              </AnimatePresence>
              {imageCount > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {workshop.workshop_images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index
                          ? "bg-white w-4"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400">Sem imagem</p>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <div className="mt-auto flex gap-2 items-end justify-between">
              <div>
                <h3 className="font-semibold text-[#615C5C]">{workshop.title}</h3>
                <p className="text-sm text-[#8A8A8A] mt-1">
                  {workshop.description || "Oficina criativa"}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteClick();
                }}
                className="border-none p-0 min-w-5"
              >
                <Image
                  width={20}
                  height={20}
                  alt="Coração"
                  className="size-5 object-contain"
                  src={
                    isFavorite
                      ? "/images/coracao_solid.png"
                      : "/images/coracao.png"
                  }
                />
              </Button>
            </div>
          </div>
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
  const { workshops, loading } = useWorkshops();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Filtrar oficinas baseado na busca e filtros
  const filteredWorkshops = useMemo(() => {
    let filtered = workshops;

    // Aplicar busca por termo
    if (searchTerm) {
      filtered = filtered.filter((workshop) =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros selecionados
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((workshop) =>
        selectedFilters.includes(workshop.id)
      );
    }

    return filtered;
  }, [workshops, searchTerm, selectedFilters]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const handleDetailsClick = (workshop: WorkshopWithImages) => {
    router.push(`/workshop/${workshop.slug}`);
  };

  const createWorkshopProduct = (workshop: WorkshopWithImages): Product => {
    return {
      id: `workshop-${workshop.slug}`,
      name: workshop.title,
      description: workshop.description || "Oficina criativa",
      category: "favorites",
      image: workshop.workshop_images[0]?.image_url || "/images/fallback.png",
      workshopFolder: workshop.title,
      duration: "1-2 horas",
      ageRange: "5-12 anos",
      highlights: [
        "Materiais inclusos",
        "Atividade criativa",
        "Lembrança especial",
      ],
    };
  };

  const handleFavoriteClick = (workshop: WorkshopWithImages) => {
    const product = createWorkshopProduct(workshop);
    toggleFavorite(product);
  };

  const isWorkshopFavorite = (workshop: WorkshopWithImages) => {
    const productId = `workshop-${workshop.slug}`;
    return isFavorite(productId);
  };

  return (
    <section ref={ref} className="bg-white">
      <div className="min-h-screen flex flex-col lg:flex-row mt-4">
        <div className="w-full container max-w-none px-4 flex flex-col lg:flex-row md:gap-8 min-h-full">
          {/* Botão de Filtros Mobile */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full bg-[#FC3C80] hover:bg-[#FC3C80] text-white flex items-center justify-center gap-2"
            >
              <Search size={16} />
              {isFiltersOpen ? "Esconder Filtros" : "Mostrar Filtros"}
              {selectedFilters.length > 0 && (
                <span className="bg-white/20 px-2 py-1 text-xs">
                  {selectedFilters.length}
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
                <div className="bg-white border border-gray-200 p-6 shadow-sm min-h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-[#615C5C] mb-4">
                    Filtrar Oficinas
                  </h3>

                  {/* Lista de oficinas - com scroll */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {workshops.map((workshop) => (
                      <label
                        key={workshop.id}
                        className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(workshop.id)}
                          onChange={() => toggleFilter(workshop.id)}
                          className="border-gray-300 text-[#FC3C80] focus:ring-[#FC3C80]"
                        />
                        <span className="text-sm text-[#615C5C]">
                          {workshop.title}
                        </span>
                        <span className="text-xs text-[#8A8A8A] ml-auto">
                          ({workshop.workshop_images.length})
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Limpar filtros */}
                  {selectedFilters.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="text-sm text-[#FC3C80] hover:text-[#FC3C80] font-medium w-full"
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
                  className="w-full pl-4 pr-10 py-3 border border-[#eaeaea] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#787885]" />
              </div>
            </motion.div>

            {/* Filtros ativos */}
            {selectedFilters.length > 0 && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-[#8A8A8A] py-1">
                    Filtros ativos:
                  </span>
                  {selectedFilters.map((filterId) => {
                    const workshop = workshops.find((w) => w.id === filterId);
                    return (
                      <span
                        key={filterId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#FC3C80] text-black text-sm"
                      >
                        {workshop?.title}
                        <button
                          onClick={() => toggleFilter(filterId)}
                          className="hover:bg-[#FC3C80] p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Grid de oficinas */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC3C80] mb-4 mx-auto"></div>
                    <p className="text-[#8A8A8A]">Carregando oficinas...</p>
                  </div>
                </div>
              ) : filteredWorkshops.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#8A8A8A] text-lg">
                    {workshops.length === 0
                      ? "Nenhuma oficina cadastrada ainda."
                      : "Nenhuma oficina encontrada com os filtros aplicados."}
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid custom_grid_cols md:grid-cols-3 gap-2 md:gap-6 pb-8"
                  layout
                >
                  {filteredWorkshops.map((workshop) => (
                    <WorkshopCard
                      key={workshop.id}
                      workshop={workshop}
                      onDetailsClick={() => handleDetailsClick(workshop)}
                      onFavoriteClick={() => handleFavoriteClick(workshop)}
                      isFavorite={isWorkshopFavorite(workshop)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { RentalCollection };
