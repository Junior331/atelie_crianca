"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/modules";
import { SmartImage } from "@/components/atoms/SmartImage";
import { Button, LoadingSpinner } from "@/components/atoms";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types/product";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, isLoaded } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleRemoveFavorite = (productId: string) => {
    removeFromFavorites(productId);
  };

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <Header />

        <div className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Meus Favoritos
              </h1>
              <p className="text-xl text-gray-600">
                {favorites.length === 0 
                  ? "Você ainda não tem itens favoritos"
                  : `${favorites.length} ${favorites.length === 1 ? 'item favorito' : 'itens favoritos'}`
                }
              </p>
            </motion.div>

            {favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center py-16"
              >
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum favorito ainda
                </h3>
                <p className="text-gray-500 mb-6">
                  Explore nossas oficinas e adicione suas favoritas!
                </p>
                <Link href="/workshops">
                  <Button className="bg-[rgb(255,147,186)] hover:bg-[rgb(245,137,176)] text-white">
                    Explorar Oficinas
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {item.workshopFolder && (
                        <Link 
                          href={`/workshop/${item.workshopFolder.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block h-full"
                        >
                          <SmartImage
                            basePath={
                              item.workshopSubfolder 
                                ? `/images/workshops/${item.workshopFolder}/${item.workshopSubfolder}`
                                : `/images/workshops/${item.workshopFolder}`
                            }
                            imageName="1"
                            alt={item.name}
                            fill={true}
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      )}
                      
                      {/* Remove from favorites button */}
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link 
                        href={`/workshop/${item.workshopFolder?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        className="block"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-[rgb(255,147,186)] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="space-y-2">
                        {item.duration && (
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium">Duração:</span>
                            <span className="ml-1">{item.duration}</span>
                          </div>
                        )}
                        {item.ageRange && (
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium">Idade:</span>
                            <span className="ml-1">{item.ageRange}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-[rgb(255,147,186)] hover:bg-[rgb(245,137,176)] text-white text-sm"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Adicionar
                        </Button>
                        
                        <Link 
                          href={`/workshop/${item.workshopFolder?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        >
                          <Button
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:border-[rgb(255,147,186)] hover:text-[rgb(255,147,186)] text-sm"
                            size="sm"
                          >
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </motion.main>
    </AnimatePresence>
  );
}