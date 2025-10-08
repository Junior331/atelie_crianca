"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { Card, CardContent } from "@/components/organisms/Card";
import { getProduto, produtos } from "@/assets/Produtos";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lista de todas as imagens usando as chaves do produtos
  const allImages = useMemo(() => {
    const images = Object.keys(produtos).filter(key => key !== 'fallback');
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

          <div className="flex flex-col px-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
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
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, allImages.length)} de {allImages.length} produtos
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
                          src={getProduto(imageKey as keyof typeof produtos)}
                          alt={`Produto ${imageKey}`}
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
                              Produto especial para decoração
                            </p>
                          </div>
                          {/* <Button
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
                          </Button> */}
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
                    src={getProduto(selectedImage as keyof typeof produtos)}
                    alt={`Produto ${selectedImage}`}
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