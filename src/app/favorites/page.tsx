"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
              <h1 className="text-4xl font-bold text-[#615C5C] mb-4">
                Meus Favoritos
              </h1>
              <p className="text-xl text-[#8A8A8A]">
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
                <div 
                  className="w-16 h-16 mx-auto mb-4 bg-gray-300"
                  style={{
                    maskImage: "url('/images/coracao.png')",
                    WebkitMaskImage: "url('/images/coracao.png')",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                  }}
                />
                <h3 className="text-xl font-semibold text-[#8A8A8A] mb-2">
                  Nenhum favorito ainda
                </h3>
                <p className="text-[#8A8A8A] mb-6">
                  Explore nossas oficinas e adicione suas favoritas!
                </p>
                <Link href="/workshops">
                  <Button className="bg-[#ecced1] hover:bg-[#ecced1] text-[#615C5C]">
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
                        <Trash2 className="w-4 h-4 text-[#ecced1]" />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link 
                        href={`/workshop/${item.workshopFolder?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        className="block"
                      >
                        <h3 className="font-semibold text-[#615C5C] mb-2 hover:text-[#ecced1] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-[#8A8A8A] mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="space-y-2">
                        {item.duration && (
                          <div className="flex items-center text-xs text-[#8A8A8A]">
                            <span className="font-medium">Duração:</span>
                            <span className="ml-1">{item.duration}</span>
                          </div>
                        )}
                        {item.ageRange && (
                          <div className="flex items-center text-xs text-[#8A8A8A]">
                            <span className="font-medium">Idade:</span>
                            <span className="ml-1">{item.ageRange}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-[#ecced1] hover:bg-[#ecced1] text-white text-sm"
                          size="sm"
                        >
                          <Image 
                            src="/images/sacola.png" 
                            alt="Sacola" 
                            width={16} 
                            height={16} 
                            className="mr-1"
                          />
                          Adicionar
                        </Button>
                        
                        <Link 
                          href={`/workshop/${item.workshopFolder?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                        >
                          <Button
                            variant="outline"
                            className="border-gray-300 text-[#8A8A8A] hover:border-[#ecced1] hover:text-[#ecced1] text-sm"
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