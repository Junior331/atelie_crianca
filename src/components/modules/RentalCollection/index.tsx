"use client";

import Image from "next/image";
import { Search, ChevronDown, ChevronRight, X, Filter } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";

import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useProducts } from "@/hooks/use-products";
import { CardContent } from "@/components/organisms/Card";

// Dados organizados por categorias
const filterCategories = {
  "Personagens & Temas": [
    "ARCO DISNEY",
    "ASA DE BORBOLETA",
    "BIJU COM CHAVEIROS",
    "CAPA FROZEN",
    "CAPA HARRY POTTER",
    "CAPAS...",
    "VARINHA HARRY...",
    "TOTEM MDF",
  ],
  "Decoração & Festa": [
    "BELEZA",
    "BOLHAS DE SABÃO",
    "BUCKET",
    "CADERNINHOS",
    "CARTOLA",
    "COLAGEM E...",
    "DONUTS",
    "FANTOCHES",
    "JARDINAGEM",
    "MONTAGEM DE...",
    "RECREAÇÕES",
  ],
  "Doces & Culinária": [
    "BISCOTOS...",
    "BISCUIT",
    "BONE",
    "CUPCAKE",
    "MARSHMALLOW DO...",
    "VARINHA E COROA",
  ],
  "Artesanato & Pintura": [
    "BOLSAS DE PALHA",
    "BRINCADEIRAS RAIZ",
    "CIENTISTA",
    "ESMALTAÇÃO",
    "ESTOJO",
    "MASCARA",
    "PINTURA ARTÍSTICA",
    "PINTURA EM BOBBIE...",
    "PINTURA EM TELA",
    "PINTURA NO CAVALETE",
    "RECICLAGEM",
  ],
  "Brinquedos & Jogos": [
    "BRINQUEDOTECA",
    "CAMISAS",
    "ESPAÇO SONINHO",
    "SLIME",
    "SLIME NEON",
    "SPA",
    "VISEIRA",
  ],
  "Acessórios & Moda": ["BODYS", "PERSONALIZADAS"],
};

const RentalCollection = () => {
  const ref = useRef(null);
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Estados do sistema de filtros avançado
  const [selectedAdvancedFilters, setSelectedAdvancedFilters] = useState<
    string[]
  >([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems } = useProducts();

  // Filtrar categorias e itens baseado na busca
  const filteredCategories = useMemo(() => {
    if (!filterSearchTerm) return filterCategories;

    const filtered: Record<string, string[]> = {};
    Object.entries(filterCategories).forEach(([category, items]) => {
      const filteredItems = items.filter((item) =>
        item.toLowerCase().includes(filterSearchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    return filtered;
  }, [filterSearchTerm]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAdvancedFilter = (filter: string) => {
    setSelectedAdvancedFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((f) => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  const clearAllAdvancedFilters = () => {
    setSelectedAdvancedFilters([]);
  };

  const getTotalAdvancedFilters = () => {
    return selectedAdvancedFilters.length;
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
                {Object.entries(filteredCategories).map(([category, items]) => (
                  <div
                    key={category}
                    className="border-b border-gray-200 last:border-b-0 pb-2"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex items-center justify-between w-full py-2 text-left hover:bg-gray-100 rounded px-2"
                    >
                      <span className="font-medium text-gray-900">
                        {category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          ({items.length})
                        </span>
                        {expandedCategories[category] ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedCategories[category] && (
                      <div className="ml-4 mt-2 space-y-1">
                        {items.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAdvancedFilters.includes(item)}
                              onChange={() => toggleAdvancedFilter(item)}
                              className="rounded border-gray-300 text-[ focus:ring-["
                            />
                            <span className="text-sm text-gray-700">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
                {selectedAdvancedFilters.map((filter) => (
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
                {item.image ? (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      fill
                      alt={item.name}
                      src={item.image}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <div className="text-6xl opacity-20">📸</div>
                  </div>
                )}
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
