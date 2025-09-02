"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { products_mock } from "@/utils/products";

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(products_mock);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products_mock);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWorkshopFilters, setSelectedWorkshopFilters] = useState<string[]>([]);

  // Inicializar produtos na montagem
  useEffect(() => {
    setProducts(products_mock);
  }, []);

  useEffect(() => {
    let filtered = products;
    
    // Filtro por busca de texto
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (product.highlights &&
            product.highlights.some((highlight) =>
              highlight.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }
    
    // Filtro por pastas de oficina selecionadas
    if (selectedWorkshopFilters.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.workshopFolder) return false;
        
        return selectedWorkshopFilters.some((filter) => {
          // Verifica se é um filtro de pasta principal
          if (filter === product.workshopFolder) return true;
          
          // Verifica se é um filtro de subpasta (formato: PASTA-SUBPASTA)
          if (filter.includes('-') && product.workshopSubfolder) {
            const [folder, subfolder] = filter.split('-');
            return product.workshopFolder === folder && product.workshopSubfolder === subfolder;
          }
          
          return false;
        });
      });
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedWorkshopFilters]);

  return {
    error,
    loading,
    setError,
    isCartOpen,
    searchTerm,
    setLoading,
    filteredItems: filteredProducts,
    setSearchTerm,
    setIsCartOpen,
    selectedCategory,
    setSelectedCategory,
    products: filteredProducts,
    selectedWorkshopFilters,
    setSelectedWorkshopFilters,
  };
};
