"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";

const FAVORITES_STORAGE_KEY = "atelie-crianca-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar favoritos no localStorage sempre que a lista mudar
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Erro ao salvar favoritos:", error);
      }
    }
  }, [favorites, isLoaded]);

  // Adicionar item aos favoritos
  const addToFavorites = useCallback((product: Product) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((item) => item.id === product.id);
      if (isAlreadyFavorite) {
        return prev; // Não adicionar duplicados
      }
      return [...prev, product];
    });
  }, []);

  // Remover item dos favoritos
  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // Toggle favorito (adicionar se não estiver, remover se estiver)
  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((item) => item.id === product.id);
      if (isAlreadyFavorite) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  // Verificar se um item está nos favoritos
  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.some((item) => item.id === productId);
    },
    [favorites]
  );

  // Limpar todos os favoritos
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isLoaded,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
};