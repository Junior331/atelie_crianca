// NOVA VERSÃO - Usando dados do banco Supabase
// Este arquivo é uma alternativa ao index.tsx que usa dados dinâmicos do banco
// Para ativar, renomeie index.tsx para index-old.tsx e este arquivo para index.tsx

"use client";

import { Search, X } from "lucide-react";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
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
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
  }, [imageCount]);

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
  }, [isHovered, imageCount, nextImage]);

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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Extrair categorias únicas das oficinas
  const categories = useMemo(() => {
    const categoryMap = new Map();
    workshops.forEach((workshop) => {
      if (workshop.workshop_category) {
        categoryMap.set(workshop.workshop_category.id, workshop.workshop_category);
      }
    });
    return Array.from(categoryMap.values()).sort((a, b) => a.order_position - b.order_position);
  }, [workshops]);

  // Filtrar oficinas baseado na busca e categorias selecionadas
  const filteredWorkshops = useMemo(() => {
    let filtered = workshops;

    // Aplicar busca por termo
    if (searchTerm) {
      filtered = filtered.filter((workshop) =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros de categoria
    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter((workshop) =>
        workshop.category_id && selectedCategoryIds.includes(workshop.category_id)
      );
    }

    return filtered;
  }, [workshops, searchTerm, selectedCategoryIds]);

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategoryIds([]);
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
              className="w-full bg-[#b42165] text-white flex items-center justify-center gap-3 py-4 rounded-lg shadow-md hover:shadow-lg transition-all relative"
            >
              <Search size={20} />
              <span className="font-semibold">
                {isFiltersOpen ? "Esconder Categorias" : "Filtrar por Categoria"}
              </span>
              {selectedCategoryIds.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#b42165] font-bold px-2.5 py-1 text-xs rounded-full shadow-md border-2 border-[#b42165]">
                  {selectedCategoryIds.length}
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
                <div className="bg-white border border-gray-200 p-6 shadow-sm min-h-full flex flex-col rounded-lg">
                  <h3 className="text-xl font-bold text-[#615C5C] mb-2">
                    Filtrar por Categoria
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mb-6">
                    Selecione uma ou mais categorias para filtrar as oficinas
                  </p>

                  {/* Lista de categorias */}
                  <div className="space-y-3 flex-1">
                    {categories.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-[#8A8A8A]">Nenhuma categoria disponível</p>
                      </div>
                    ) : (
                      categories.map((category) => {
                        const workshopsInCategory = workshops.filter(
                          (w) => w.category_id === category.id
                        ).length;
                        const isSelected = selectedCategoryIds.includes(category.id);

                        return (
                          <label
                            key={category.id}
                            className={`flex items-center gap-3 py-3 px-4 cursor-pointer rounded-lg transition-all duration-200 border-2 ${
                              isSelected
                                ? "bg-[#b42165] border-[#b42165] shadow-md"
                                : "bg-white border-gray-200 hover:border-[#b42165] hover:bg-pink-50"
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleCategoryFilter(category.id)}
                                className="w-5 h-5 border-2 border-gray-300 text-[#b42165] focus:ring-2 focus:ring-[#b42165] focus:ring-offset-0 rounded cursor-pointer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`block text-base font-semibold truncate ${
                                isSelected ? "text-white" : "text-[#615C5C]"
                              }`}>
                                {category.name}
                              </span>
                              {category.description && (
                                <span className={`block text-xs truncate mt-0.5 ${
                                  isSelected ? "text-white/80" : "text-[#8A8A8A]"
                                }`}>
                                  {category.description}
                                </span>
                              )}
                            </div>
                            <div className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              isSelected
                                ? "bg-white text-[#b42165]"
                                : "bg-gray-100 text-[#615C5C]"
                            }`}>
                              {workshopsInCategory}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>

                  {/* Limpar filtros */}
                  {selectedCategoryIds.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="text-sm text-[#b42165] hover:text-white hover:bg-[#b42165] font-semibold w-full py-3 rounded-lg border-2 border-[#b42165] transition-all"
                      >
                        Limpar Filtros ({selectedCategoryIds.length})
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
            {selectedCategoryIds.length > 0 && (
              <motion.div
                className="mb-6 bg-pink-50 border border-pink-200 rounded-lg p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[#615C5C]">
                    Filtrando por:
                  </span>
                  {selectedCategoryIds.map((categoryId) => {
                    const category = categories.find((c) => c.id === categoryId);
                    return (
                      <motion.span
                        key={categoryId}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#b42165] text-white text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all"
                      >
                        {category?.name}
                        <button
                          onClick={() => toggleCategoryFilter(categoryId)}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors"
                          aria-label={`Remover filtro ${category?.name}`}
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </motion.span>
                    );
                  })}
                  <button
                    onClick={clearAllFilters}
                    className="ml-auto text-sm text-[#b42165] hover:text-[#615C5C] font-semibold underline transition-colors"
                  >
                    Limpar tudo
                  </button>
                </div>
              </motion.div>
            )}

            {/* Contador de resultados */}
            {!loading && filteredWorkshops.length > 0 && (
              <motion.div
                className="mb-4 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-[#8A8A8A]">
                  Mostrando <span className="font-bold text-[#615C5C]">{filteredWorkshops.length}</span> {filteredWorkshops.length === 1 ? "oficina" : "oficinas"}
                  {selectedCategoryIds.length > 0 && (
                    <span> na{selectedCategoryIds.length > 1 ? 's' : ''} categoria{selectedCategoryIds.length > 1 ? 's' : ''} selecionada{selectedCategoryIds.length > 1 ? 's' : ''}</span>
                  )}
                </p>
              </motion.div>
            )}

            {/* Grid de oficinas */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b42165] mb-4 mx-auto"></div>
                    <p className="text-[#8A8A8A]">Carregando oficinas...</p>
                  </div>
                </div>
              ) : filteredWorkshops.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-[#615C5C] mb-2">
                      {workshops.length === 0
                        ? "Nenhuma oficina cadastrada"
                        : "Nenhuma oficina encontrada"}
                    </h3>
                    <p className="text-[#8A8A8A] mb-6">
                      {workshops.length === 0
                        ? "Ainda não há oficinas disponíveis no momento."
                        : selectedCategoryIds.length > 0
                        ? "Não encontramos oficinas nesta categoria. Tente selecionar outras categorias ou limpar os filtros."
                        : "Não encontramos oficinas com este termo de busca. Tente pesquisar por outro termo."}
                    </p>
                    {(selectedCategoryIds.length > 0 || searchTerm) && (
                      <Button
                        onClick={() => {
                          clearAllFilters();
                          setSearchTerm("");
                        }}
                        className="bg-[#b42165] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                      >
                        Limpar Filtros e Busca
                      </Button>
                    )}
                  </div>
                </motion.div>
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
