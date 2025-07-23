"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product } from "@/types/product";
import { products_mock } from "@/utils/products";

export const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(products_mock);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchProducts = async (category: string = "all") => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("products").select("*");

      const categoryMap: Record<string, string | undefined> = {
        essentials: "essentials",
        favorites: "favorites",
        weddings: "weddings",
        souvenir: "souvenir",
        all: "all",
      };

      const dbCategory = categoryMap[category];

      if (dbCategory && dbCategory !== "all") {
        query = query.eq("category", dbCategory);
      } else if (dbCategory !== "all") {
        // Se não for uma categoria mapeada, retorna vazio ou todos os produtos
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const formattedProducts = data?.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        category: item.category,
        duration: item.duration,
        ageRange: item.age_range,
        highlights: item.highlights || [],
        isPopular: item.is_popular || false,
      })) as Product[];

      // setProducts(formattedProducts || products_mock);
      setFilteredProducts(formattedProducts || products_mock);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      setProducts(products_mock);
      setFilteredProducts(products_mock);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
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
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    fetchProducts(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return {
    error,
    loading,
    isCartOpen,
    searchTerm,
    filteredItems,
    fetchProducts,
    setSearchTerm,
    setIsCartOpen,
    selectedCategory,
    setSelectedCategory,
    products: filteredProducts,
  };
};
