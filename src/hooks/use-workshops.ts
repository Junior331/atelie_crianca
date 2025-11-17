import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { WorkshopWithImages } from "@/types/database";

export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState<WorkshopWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("workshops")
        .select(`
          *,
          workshop_images(*),
          workshop_category:workshop_categories(*)
        `)
        .eq("is_active", true)
        .order("order_position", { ascending: true });

      if (fetchError) throw fetchError;

      // Carregar categorias para cada workshop
      const workshopsWithCategories = await Promise.all(
        (data as WorkshopWithImages[]).map(async (workshop) => {
          const { data: relations } = await supabase
            .from("workshop_category_relations")
            .select("category_id, workshop_categories(*)")
            .eq("workshop_id", workshop.id);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const categories = relations?.map((rel: any) => rel.workshop_categories).filter(Boolean) || [];

          return {
            ...workshop,
            workshop_images: workshop.workshop_images
              .filter(img => img.is_active)
              .sort((a, b) => a.order_position - b.order_position),
            workshop_categories: categories,
          };
        })
      );

      setWorkshops(workshopsWithCategories);
    } catch (err) {
      console.error("Erro ao carregar oficinas:", err);
      setError("Erro ao carregar oficinas");
    } finally {
      setLoading(false);
    }
  };

  const getWorkshopBySlug = (slug: string) => {
    return workshops.find(w => w.slug === slug);
  };

  const refetch = () => {
    fetchWorkshops();
  };

  return {
    workshops,
    loading,
    error,
    getWorkshopBySlug,
    refetch,
  };
};
