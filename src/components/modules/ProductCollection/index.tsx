"use client";

import { Search, X, ShoppingCart } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useProducts } from "@/hooks/use-products";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { CardContent } from "@/components/organisms/Card";
import {
  productFolders,
  productCategories,
  getProductCategory,
  categoryDescriptions,
  folderProductCounts,
  getTotalProducts,
} from "@/utils/product-categories";
import { Product } from "@/types/product";
import { produtos } from "@/assets/Produtos";

// Componente para o card de produto
const ProductCard = ({
  folder,
  productKey,
  onImageClick,
  onFavoriteClick,
  onCartClick,
  isFavorite,
  isInCart,
}: {
  folder: string;
  productKey: string;
  onImageClick: () => void;
  onFavoriteClick: () => void;
  onCartClick: () => void;
  isFavorite: boolean;
  isInCart: boolean;
}) => {
  const formatProductName = (key: string) => {
    return key
      .replace(/^(acessorios|arcos|brindes|fantasias)_/i, "")
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getProductDescription = (folder: string) => {
    const category = getProductCategory(folder);
    return categoryDescriptions[category] || "Produto especial";
  };

  const imageSrc =
    produtos[folder as keyof typeof produtos]?.[productKey as never] ||
    produtos.fallback;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div
          className="relative w-full h-64 overflow-hidden cursor-pointer bg-gray-100"
          onClick={onImageClick}
        >
          <Image
            src={imageSrc}
            alt={formatProductName(productKey)}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="mb-2 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#615C5C] truncate">
                  {formatProductName(productKey)}
                </h3>
                <p className="text-sm text-[#8A8A8A] mt-1">
                  {getProductDescription(folder)}
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteClick();
                }}
                className="border-none p-1 h-auto flex-shrink-0 min-w-5"
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

            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCartClick();
              }}
              className={`w-full ${
                isInCart
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-[#FC3C80]/85 hover:bg-[#FC3C80] text-white"
              } flex items-center justify-center gap-2`}
            >
              <ShoppingCart size={16} />
              {isInCart ? "Remover" : "Adicionar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProductCollection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem, removeItem, isInCart } = useCart();

  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    folder: string;
    key: string;
  } | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    selectedProductFilters,
    setSelectedProductFilters,
  } = useProducts();

  // Obter todos os produtos de todas as pastas
  const allProducts = useMemo(() => {
    const products: { folder: string; key: string }[] = [];

    productFolders.forEach((folder) => {
      const folderProducts = produtos[folder as keyof typeof produtos];
      if (folderProducts && typeof folderProducts === "object") {
        Object.keys(folderProducts).forEach((key) => {
          products.push({ folder, key });
        });
      }
    });

    return products;
  }, []);

  // Filtrar produtos baseado na busca e filtros selecionados
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Aplicar busca por termo
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.folder.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros selecionados
    if (selectedProductFilters.length > 0) {
      // Se "Todos" está selecionado, mostrar todos os produtos
      if (selectedProductFilters.includes("Todos")) {
        return filtered;
      }

      // Filtrar por categorias selecionadas
      filtered = filtered.filter((product) => {
        const category = getProductCategory(product.folder);
        return selectedProductFilters.includes(category);
      });
    }

    return filtered;
  }, [searchTerm, selectedProductFilters, allProducts]);

  // Filtrar categorias baseado na busca dos filtros
  const filteredCategories = useMemo(() => {
    const categories = Object.keys(productCategories);

    if (!filterSearchTerm) return categories;

    return categories.filter((category) =>
      category.toLowerCase().includes(filterSearchTerm.toLowerCase())
    );
  }, [filterSearchTerm]);

  const toggleAdvancedFilter = (filter: string) => {
    setSelectedProductFilters((prev) => {
      // Se é "Todos", marcar/desmarcar tudo
      if (filter === "Todos") {
        if (prev.includes("Todos")) {
          return [];
        } else {
          return ["Todos"];
        }
      }

      // Se estava marcado "Todos" e marcou outra categoria, desmarcar "Todos"
      const newFilters = prev.filter((f) => f !== "Todos");

      // Para outras categorias, comportamento normal
      if (newFilters.includes(filter)) {
        return newFilters.filter((f) => f !== filter);
      } else {
        return [...newFilters, filter];
      }
    });
  };

  const clearAllAdvancedFilters = () => {
    setSelectedProductFilters([]);
  };

  const getTotalAdvancedFilters = () => {
    return selectedProductFilters.length;
  };

  const handleImageClick = (folder: string, productKey: string) => {
    setSelectedImage({ folder, key: productKey });
  };

  const createProductObject = (folder: string, productKey: string): Product => {
    const getProductDescription = (folder: string) => {
      const category = getProductCategory(folder);
      return categoryDescriptions[category] || "Produto especial";
    };

    const imageSrc =
      produtos[folder as keyof typeof produtos]?.[productKey as never] ||
      produtos.fallback;

    return {
      id: `product-${folder}-${productKey}`,
      name: productKey,
      description: getProductDescription(folder),
      category: getProductCategory(folder),
      image: imageSrc,
      duration: "",
      ageRange: "",
    };
  };

  const handleFavoriteClick = (folder: string, productKey: string) => {
    const product = createProductObject(folder, productKey);
    toggleFavorite(product);
  };

  const handleCartClick = (folder: string, productKey: string) => {
    const product = createProductObject(folder, productKey);
    const productId = `product-${folder}-${productKey}`;

    if (isInCart(productId)) {
      removeItem(productId);
    } else {
      addItem(product);
    }
  };

  const isProductFavorite = (folder: string, productKey: string) => {
    const productId = `product-${folder}-${productKey}`;
    return isFavorite(productId);
  };

  const isProductInCart = (folder: string, productKey: string) => {
    const productId = `product-${folder}-${productKey}`;
    return isInCart(productId);
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
              {getTotalAdvancedFilters() > 0 && (
                <span className="bg-white/20 px-2 py-1 text-xs">
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
                <div className="bg-white border border-gray-200 p-6 shadow-sm min-h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-[#615C5C] mb-4">
                    Filtrar Produtos
                  </h3>

                  {/* Busca de filtros */}
                  <div className="relative mb-4">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="Buscar categorias..."
                      value={filterSearchTerm}
                      onChange={(e) => setFilterSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FC3C80] focus:border-transparent"
                    />
                  </div>

                  {/* Lista de categorias - com scroll */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {filteredCategories.map((category) => {
                      const folder =
                        productCategories[
                          category as keyof typeof productCategories
                        ];
                      const productCount =
                        category === "Todos"
                          ? getTotalProducts()
                          : folderProductCounts[folder] || 0;

                      return (
                        <div
                          key={category}
                          className="border-b border-gray-100 last:border-b-0 pb-2"
                        >
                          <label className="flex items-center justify-between gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                checked={selectedProductFilters.includes(
                                  category
                                )}
                                onChange={() => toggleAdvancedFilter(category)}
                                className="border-gray-300 text-[#FC3C80] focus:ring-[#FC3C80]"
                              />
                              <span className="text-sm text-[#615C5C] font-medium">
                                {category}
                              </span>
                            </div>
                            <span className="text-xs text-[#8A8A8A]">
                              ({productCount})
                            </span>
                          </label>
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
                  placeholder="Pesquisar produtos..."
                  className="w-full pl-4 pr-10 py-3 border border-[#eaeaea] text-sm"
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
                  <span className="text-sm text-[#8A8A8A] py-1">
                    Filtros ativos:
                  </span>
                  {selectedProductFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#FC3C80] text-black text-sm"
                    >
                      {filter}
                      <button
                        onClick={() => toggleAdvancedFilter(filter)}
                        className="hover:bg-[#FC3C80] p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Grid de produtos - com scroll */}
            <div className="flex-1 overflow-y-auto">
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-8"
                layout
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={`${product.folder}-${product.key}`}
                    folder={product.folder}
                    productKey={product.key}
                    onImageClick={() =>
                      handleImageClick(product.folder, product.key)
                    }
                    onFavoriteClick={() =>
                      handleFavoriteClick(product.folder, product.key)
                    }
                    onCartClick={() =>
                      handleCartClick(product.folder, product.key)
                    }
                    isFavorite={isProductFavorite(product.folder, product.key)}
                    isInCart={isProductInCart(product.folder, product.key)}
                  />
                ))}
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#8A8A8A] text-lg">
                    Nenhum produto encontrado com os filtros aplicados.
                  </p>
                </div>
              )}
            </div>
          </div>
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
                src={
                  produtos[selectedImage.folder as keyof typeof produtos]?.[
                    selectedImage.key as never
                  ] || produtos.fallback
                }
                alt={selectedImage.key}
                fill
                className="object-contain"
                sizes="90vw"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-6 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
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
    </section>
  );
};

export { ProductCollection };
