import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ProductWithImages } from "@/types/database";

export const useProductsDB = () => {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select(`
          *,
          product_images(*),
          product_category:product_categories(*)
        `)
        .eq("is_active", true)
        .order("order_position", { ascending: true });

      if (fetchError) throw fetchError;

      // Ordenar imagens de cada produto
      const productsWithSortedImages = (data as ProductWithImages[]).map(product => ({
        ...product,
        product_images: product.product_images
          .filter(img => img.is_active)
          .sort((a, b) => a.order_position - b.order_position)
      }));

      setProducts(productsWithSortedImages);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug);
  };

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    getProductBySlug,
    refetch,
  };
};
