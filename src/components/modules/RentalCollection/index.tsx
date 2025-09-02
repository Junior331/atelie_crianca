"use client";

import { Search, ChevronDown, ChevronRight, X, Filter } from "lucide-react";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useProducts } from "@/hooks/use-products";
import { CardContent } from "@/components/organisms/Card";
import { workshopFolders, foldersWithSubfolders, folderImageCounts, subfolderImageCounts } from "@/utils/workshop-categories";

// Componente para o card de oficina com hover infinito
const WorkshopCard = ({ workshopName, onAddToCart }: { workshopName: string, onAddToCart: () => void }) => {
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
      return "/images/oficinas/BRINQUEDOTECA/COLORIDA";
    }
    return `/images/oficinas/${workshopName}`;
  };

  const formatWorkshopName = (name: string) => {
    return name.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
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
            <h3 className="font-semibold text-gray-900">{formatWorkshopName(workshopName)}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Oficina de {formatWorkshopName(workshopName.toLowerCase())} com {imageCount} {imageCount === 1 ? 'opção' : 'opções'} disponíveis
            </p>
          </div>
          <div className="mt-auto">
            <Button
              size="sm"
              onClick={onAddToCart}
              className="w-full bg-[#d9037d] hover:bg-[#c00270] text-white"
            >
              Adicionar ao orçamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RentalCollection = () => {
  const ref = useRef(null);
  const { addItem } = useCart();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { searchTerm, setSearchTerm, selectedWorkshopFilters, setSelectedWorkshopFilters } = useProducts();

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
          const subfoldersFilters = subfolders.map(sub => `BRINQUEDOTECA-${sub}`);
          return subfoldersFilters.some(filter => selectedWorkshopFilters.includes(filter));
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
        const subfoldersFilters = subfolders.map(sub => `BRINQUEDOTECA-${sub}`);
        
        if (prev.includes(filter)) {
          // Desmarcar BRINQUEDOTECA e todas as suas subpastas
          return prev.filter(f => f !== filter && !subfoldersFilters.includes(f));
        } else {
          // Marcar BRINQUEDOTECA e todas as suas subpastas
          const newFilters = [...prev, filter];
          subfoldersFilters.forEach(subFilter => {
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
          newFilters = newFilters.filter(f => f !== "BRINQUEDOTECA");
        } else {
          newFilters = [...prev, filter];
          
          // Verificar se todas as subpastas estão marcadas para marcar a principal
          const subfolders = foldersWithSubfolders["BRINQUEDOTECA"] || [];
          const subfoldersFilters = subfolders.map(sub => `BRINQUEDOTECA-${sub}`);
          const allSubfoldersSelected = subfoldersFilters.every(subFilter => 
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

  const handleAddToCart = async (workshopName: string) => {
    // Criar um produto temporário baseado na oficina
    const workshop: Product = {
      id: `workshop-${workshopName.toLowerCase().replace(/\s+/g, '-')}`,
      name: workshopName.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: `Oficina de ${workshopName.toLowerCase()} com múltiplas opções disponíveis`,
      category: "favorites",
      image: `/images/oficinas/${workshopName}/1.jpg`,
      workshopFolder: workshopName,
      workshopSubfolder: workshopName === "BRINQUEDOTECA" ? "COLORIDA" : undefined,
      duration: "1-2 horas",
      ageRange: "5-12 anos",
      highlights: ["Materiais inclusos", "Atividade criativa", "Lembrança especial"]
    };
    
    addItem(workshop);
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-start mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oficinas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Navegue pela nossa extensa coleção de Oficinas de alta qualidade
            para tornar o seu evento especial.
          </p>
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <div className="flex items-center justify-end gap-4 mb-4">
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pesquisar oficinas..."
                  className="w-full pl-4 pr-10 py-2 border border-[#eaeaea] rounded-md text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#787885]" />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="border-0 flex items-center gap-2 px-4 py-2 bg-[#d9037d] hover:bg-[#c00270] text-white font-medium"
            >
              <Filter size={16} />
              Filtros{" "}
              {getTotalAdvancedFilters() > 0 &&
                `(${getTotalAdvancedFilters()})`}
            </Button>
          </div>

          <div className={`${isFilterOpen ? "block" : "hidden"}`}>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Buscar filtros..."
                  value={filterSearchTerm}
                  onChange={(e) => setFilterSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9037d] focus:border-transparent"
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredFolders.map((folder) => {
                  const hasSubfolders = folder === "BRINQUEDOTECA" ? foldersWithSubfolders["BRINQUEDOTECA"] : null;
                  
                  return (
                    <div
                      key={folder}
                      className="border-b border-gray-200 last:border-b-0 pb-2"
                    >
                      {/* Pasta principal */}
                      <div 
                        className={`flex items-center justify-between ${hasSubfolders ? 'cursor-pointer' : ''}`}
                        onClick={hasSubfolders ? () => toggleFolder(folder) : undefined}
                      >
                        <label 
                          className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100 rounded px-2 flex-1"
                          onClick={(e) => e.stopPropagation()} // Evita conflito com o clique da div pai
                        >
                          <input
                            type="checkbox"
                            checked={selectedWorkshopFilters.includes(folder)}
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
                        
                        {/* Ícone para indicar subpastas */}
                        {hasSubfolders && (
                          <div className="p-1">
                            {expandedFolders[folder] ? (
                              <ChevronDown size={16} className="text-gray-400" />
                            ) : (
                              <ChevronRight size={16} className="text-gray-400" />
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
                              className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedWorkshopFilters.includes(`${folder}-${subfolder}`)}
                                onChange={() => toggleAdvancedFilter(`${folder}-${subfolder}`)}
                                className="rounded border-gray-300 text-[#d9037d] focus:ring-[#d9037d]"
                              />
                              <span className="text-sm text-gray-600">
                                {subfolder}
                              </span>
                              <span className="text-xs text-gray-500 ml-auto">
                                ({subfolderImageCounts[`${folder}-${subfolder}`] || 0})
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {getTotalAdvancedFilters() > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={clearAllAdvancedFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Limpar todos os filtros
                  </Button>
                </div>
              )}
            </div>
          </div>

          {getTotalAdvancedFilters() > 0 && (
            <div className="mt-4">
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
            </div>
          )}
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" layout>
          {filteredWorkshops.map((workshopName) => (
            <WorkshopCard
              key={workshopName}
              workshopName={workshopName}
              onAddToCart={() => handleAddToCart(workshopName)}
            />
          ))}
        </motion.div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhuma oficina encontrada com os filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export { RentalCollection };
