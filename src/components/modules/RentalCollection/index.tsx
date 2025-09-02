"use client";

import { Search, ChevronDown, ChevronRight, X, Filter } from "lucide-react";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";

import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useProducts } from "@/hooks/use-products";
import { CardContent } from "@/components/organisms/Card";
import { workshopFolders, foldersWithSubfolders, folderImageCounts, subfolderImageCounts } from "@/utils/workshop-categories";

const RentalCollection = () => {
  const ref = useRef(null);
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems, selectedWorkshopFilters, setSelectedWorkshopFilters } = useProducts();

  // Filtrar pastas baseado na busca
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

  const handleAddToCart = async (product: Product) => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addItem(product);
    setIsAdding(false);
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
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <SmartImage
                    basePath={item.workshopSubfolder ? `/images/oficinas/${item.workshopFolder}/${item.workshopSubfolder}` : `/images/oficinas/${item.workshopFolder}`}
                    imageName={item.image.split('/').pop()?.split('.')[0] || '1'}
                    alt={item.name}
                    fill={true}
                    className="rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Button
                      size="sm"
                      disabled={isAdding}
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-[#d9037d] hover:bg-[#c00270] text-white"
                    >
                      {isAdding ? `Adicionando...` : `Adicionar ao orçamento`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { RentalCollection };
