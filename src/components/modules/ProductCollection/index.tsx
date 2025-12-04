"use client";

import { Search, X } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { CardContent } from "@/components/organisms/Card";
import { useProductsDB } from "@/hooks/use-products-db";
import type { ProductWithImages } from "@/types/database";
import type { Product } from "@/types/product";

const ProductImageCard = ({
  product,
  imageUrl,
  imageIndex,
  imageName,
  imageDescription,
  onFavoriteClick,
  onCartClick,
  onImageClick,
  isFavorite,
  isInCart,
}: {
  product: ProductWithImages;
  imageUrl: string;
  imageIndex: number;
  imageId: string;
  imageName: string | null;
  imageDescription: string | null;
  onFavoriteClick: () => void;
  onCartClick: () => void;
  onImageClick: () => void;
  isFavorite: boolean;
  isInCart: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div
          className="relative w-full h-64 overflow-hidden bg-gray-100 cursor-pointer"
          onClick={onImageClick}
        >
          <Image
            src={imageUrl}
            alt={imageName || `${product.name} ${imageIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="mb-2 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#615C5C] truncate">
                  {imageName || product.name}
                </h3>
                <p className="text-sm text-[#8A8A8A] mt-1">
                  {imageDescription ||
                    product.description ||
                    product.product_category?.description ||
                    "Produto especial"}
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
                  : "bg-[#b42165] text-white"
              } flex items-center justify-center gap-2`}
            >
              <Image
                src="/images/sacola branca.png"
                alt="Carrinho"
                width={16}
                height={16}
                className="mr-1"
              />
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
  const { products, loading } = useProductsDB();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Extrair categorias únicas dos produtos
  const categories = useMemo(() => {
    const categoryMap = new Map();
    products.forEach((product) => {
      if (product.product_category) {
        categoryMap.set(product.product_category.id, product.product_category);
      }
    });
    return Array.from(categoryMap.values()).sort(
      (a, b) => a.order_position - b.order_position
    );
  }, [products]);

  // Filtrar produtos baseado na busca e categorias selecionadas
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Aplicar busca por termo
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros de categoria
    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category_id &&
          selectedCategoryIds.includes(product.category_id)
      );
    }

    return filtered;
  }, [products, searchTerm, selectedCategoryIds]);

  // Contar total de imagens dos produtos filtrados
  const totalImages = useMemo(() => {
    return filteredProducts.reduce(
      (acc, product) => acc + product.product_images.length,
      0
    );
  }, [filteredProducts]);

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

  const createProductForCart = (
    product: ProductWithImages,
    imageUrl: string,
    imageId: string
  ): Product => {
    return {
      id: `product-${product.slug}-${imageId}`,
      name: product.name,
      description: product.description || "Produto especial",
      category: product.product_category?.name || "Produtos",
      image: imageUrl,
      duration: "Sob consulta",
      ageRange: "Todas as idades",
      highlights: ["Produto de qualidade", "Disponível para locação"],
    };
  };

  const handleFavoriteClick = (
    product: ProductWithImages,
    imageUrl: string,
    imageId: string
  ) => {
    const cartProduct = createProductForCart(product, imageUrl, imageId);
    toggleFavorite(cartProduct);
  };

  const handleCartClick = (
    product: ProductWithImages,
    imageUrl: string,
    imageId: string
  ) => {
    const cartProduct = createProductForCart(product, imageUrl, imageId);
    const productId = `product-${product.slug}-${imageId}`;

    if (isInCart(productId)) {
      removeItem(productId);
    } else {
      addItem(cartProduct);
    }
  };

  const isProductFavorite = (product: ProductWithImages, imageId: string) => {
    const productId = `product-${product.slug}-${imageId}`;
    return isFavorite(productId);
  };

  const isProductInCart = (product: ProductWithImages, imageId: string) => {
    const productId = `product-${product.slug}-${imageId}`;
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
              className="w-full bg-[#b42165] text-white flex items-center justify-center gap-3 py-4 rounded-lg shadow-md hover:shadow-lg transition-all relative"
            >
              <Search size={20} />
              <span className="font-semibold">
                {isFiltersOpen
                  ? "Esconder Categorias"
                  : "Filtrar por Categoria"}
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
                    Selecione uma ou mais categorias para filtrar os produtos
                  </p>

                  {/* Lista de categorias */}
                  <div className="space-y-3 flex-1">
                    {categories.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-[#8A8A8A]">
                          Nenhuma categoria disponível
                        </p>
                      </div>
                    ) : (
                      categories.map((category) => {
                        // Contar total de imagens dos produtos nesta categoria
                        const imagesInCategory = products
                          .filter((p) => p.category_id === category.id)
                          .reduce((acc, p) => acc + p.product_images.length, 0);
                        const isSelected = selectedCategoryIds.includes(
                          category.id
                        );

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
                                onChange={() =>
                                  toggleCategoryFilter(category.id)
                                }
                                className="w-5 h-5 border-2 border-gray-300 text-[#b42165] focus:ring-2 focus:ring-[#b42165] focus:ring-offset-0 rounded cursor-pointer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span
                                className={`block text-base font-semibold truncate ${
                                  isSelected ? "text-white" : "text-[#615C5C]"
                                }`}
                              >
                                {category.name}
                              </span>
                              {category.description && (
                                <span
                                  className={`block text-xs truncate mt-0.5 ${
                                    isSelected
                                      ? "text-white/80"
                                      : "text-[#8A8A8A]"
                                  }`}
                                >
                                  {category.description}
                                </span>
                              )}
                            </div>
                            <div
                              className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                isSelected
                                  ? "bg-white text-[#b42165]"
                                  : "bg-gray-100 text-[#615C5C]"
                              }`}
                            >
                              {imagesInCategory}
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
                  placeholder="Pesquisar produtos..."
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
                    const category = categories.find(
                      (c) => c.id === categoryId
                    );
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
            {!loading && totalImages > 0 && (
              <motion.div
                className="mb-4 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-[#8A8A8A]">
                  Mostrando{" "}
                  <span className="font-bold text-[#615C5C]">
                    {totalImages}
                  </span>{" "}
                  {totalImages === 1 ? "produto" : "produtos"}
                  {selectedCategoryIds.length > 0 && (
                    <span>
                      {" "}
                      na{selectedCategoryIds.length > 1 ? "s" : ""} categoria
                      {selectedCategoryIds.length > 1 ? "s" : ""} selecionada
                      {selectedCategoryIds.length > 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </motion.div>
            )}

            {/* Grid de produtos */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b42165] mb-4 mx-auto"></div>
                    <p className="text-[#8A8A8A]">Carregando produtos...</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-[#615C5C] mb-2">
                      {products.length === 0
                        ? "Nenhum produto cadastrado"
                        : "Nenhum produto encontrado"}
                    </h3>
                    <p className="text-[#8A8A8A] mb-6">
                      {products.length === 0
                        ? "Ainda não há produtos disponíveis no momento."
                        : selectedCategoryIds.length > 0
                        ? "Não encontramos produtos nesta categoria. Tente selecionar outras categorias ou limpar os filtros."
                        : "Não encontramos produtos com este termo de busca. Tente pesquisar por outro termo."}
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
                  {filteredProducts.flatMap((product) =>
                    product.product_images.map((image, imageIndex) => (
                      <ProductImageCard
                        key={`${product.id}-${image.id}`}
                        product={product}
                        imageUrl={image.image_url}
                        imageIndex={imageIndex}
                        imageId={image.id}
                        imageName={image.name}
                        imageDescription={image.description}
                        onFavoriteClick={() =>
                          handleFavoriteClick(
                            product,
                            image.image_url,
                            image.id
                          )
                        }
                        onCartClick={() =>
                          handleCartClick(product, image.image_url, image.id)
                        }
                        onImageClick={() => setSelectedImage(image.image_url)}
                        isFavorite={isProductFavorite(product, image.id)}
                        isInCart={isProductInCart(product, image.id)}
                      />
                    ))
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagem */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Imagem ampliada"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export { ProductCollection };
