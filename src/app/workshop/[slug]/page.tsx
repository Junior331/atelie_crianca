"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { Button, LoadingSpinner } from "@/components/atoms";
import { Header } from "@/components/organisms/Header";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types/product";
import { Footer } from "@/components/modules";
import Image from "next/image";
import { useWorkshops } from "@/hooks/use-workshops";
import type { WorkshopWithImages } from "@/types/database";

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem } = useCart();
  const { workshops, loading } = useWorkshops();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [workshop, setWorkshop] = useState<WorkshopWithImages | null>(null);

  const slug = params.slug as string;

  // Encontrar a oficina pelo slug
  useEffect(() => {
    if (!loading && workshops.length > 0) {
      const foundWorkshop = workshops.find((w) => w.slug === slug);
      setWorkshop(foundWorkshop || null);
    }
  }, [slug, workshops, loading]);

  // Se a oficina não for encontrada após carregar
  if (!loading && !workshop) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#615C5C] mb-4">
              Oficina não encontrada
            </h1>
            <p className="text-[#8A8A8A] mb-4">
              A oficina que você está procurando não existe.
            </p>
            <Button onClick={() => router.push("/workshops")}>
              Voltar para Oficinas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const imageCount = workshop?.workshop_images.length || 0;

  // Criar produto baseado na oficina atual
  const currentProduct: Product | null = workshop
    ? {
        id: `workshop-${workshop.slug}`,
        name: workshop.title,
        description:
          workshop.description ||
          `Oficina de ${workshop.title.toLowerCase()} com múltiplas opções disponíveis`,
        category: "favorites",
        image: workshop.workshop_images[0]?.image_url || "/images/fallback.png",
        workshopFolder: workshop.title,
        duration: "1-2 horas",
        ageRange: "5-12 anos",
        highlights: [
          "Materiais inclusos",
          "Atividade criativa",
          "Lembrança especial",
        ],
      }
    : null;

  const handleAddToCart = () => {
    if (!currentProduct) return;
    addItem(currentProduct);
  };

  const handleToggleFavorite = () => {
    if (!currentProduct) return;
    toggleFavorite(currentProduct);
  };

  const isWorkshopFavorite = currentProduct
    ? isFavorite(currentProduct.id)
    : false;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  return (
    <AnimatePresence mode="wait">
      {loading || !workshop ? (
        <LoadingSpinner key="loading" />
      ) : (
        <motion.main
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <Header />

          <div className="py-4">
            <div className="container max-w-none">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#8A8A8A] hover:text-[#615C5C]"
              >
                <ArrowLeft size={20} />
                Voltar
              </Button>
            </div>
          </div>

          <div className="container px-4 pb-8 max-w-none">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Galeria de Imagens */}
              <div className="space-y-4">
                {/* Imagem principal */}
                <div className="relative w-full h-96 bg-gray-50 overflow-hidden">
                  {imageCount > 0 ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={
                              workshop.workshop_images[currentImageIndex]
                                .image_url
                            }
                            alt={`${workshop.title} - Imagem ${
                              currentImageIndex + 1
                            }`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Navegação de imagens */}
                      {imageCount > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                          >
                            <ChevronLeft />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                          >
                            <ChevronRight />
                          </button>

                          {/* Indicador com bolinhas */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {workshop.workshop_images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  currentImageIndex === index
                                    ? "bg-white w-4"
                                    : "bg-white/50 hover:bg-white/75"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <p className="text-gray-400">Sem imagens disponíveis</p>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {imageCount > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {workshop.workshop_images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square overflow-hidden border-2 ${
                          currentImageIndex === index
                            ? "border-[#FC3C80]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.image_url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="20vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#615C5C] mb-2">
                    {workshop.title}
                  </h1>
                  <p className="text-[#8A8A8A] text-lg">
                    {workshop.description ||
                      "Oficina criativa completa com materiais inclusos"}
                  </p>
                </div>

                {/* Descrição */}
                <div className="border-gray-200 pt-6">
                  <h3 className="font-semibold text-[#615C5C] mb-3">
                    Descrição
                  </h3>
                  <p className="text-[#8A8A8A] leading-relaxed">
                    {workshop.description ||
                      `A oficina de ${workshop.title.toLowerCase()} é uma experiência única e criativa para
                    crianças. Com ${imageCount} ${
                        imageCount === 1 ? "opção" : "opções"
                      } ${
                        imageCount === 1 ? "disponível" : "disponíveis"
                      }, cada
                    participante pode explorar sua criatividade de forma única. Todos os materiais necessários estão
                    inclusos, garantindo uma experiência completa e memorável.`}
                  </p>
                </div>

                {/* Quantidade e Ações */}
                <div className="space-y-4 border-gray-200 pt-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#FC3C80] hover:bg-[#d6aeb2] py-3"
                    >
                      <span className="text-[#FFF] ">Adicionar à sacola</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleToggleFavorite}
                      className={`p-3 border-none ${
                        isWorkshopFavorite
                          ? "text-[#FC3C80] border-[#FC3C80]"
                          : "text-[#8A8A8A]"
                      }`}
                    >
                      <Image
                        width={20}
                        height={20}
                        alt="Coração"
                        src={
                          isWorkshopFavorite
                            ? "/images/coracao_solid.png"
                            : "/images/coracao.png"
                        }
                        className={isWorkshopFavorite ? "opacity-100" : "opacity-50"}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Items Similares */}
          {imageCount > 1 && (
            <div className="py-2">
              <div className="container px-4">
                <h2 className="text-2xl font-bold text-[#8A8A8A] mb-8 text-center">
                  Veja também
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {workshop.workshop_images.map((image, index) => (
                    <motion.button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-[#FC3C80] ring-2 ring-[#FC3C80]/20"
                          : "border-gray-200 hover:border-[#FC3C80]/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image.image_url}
                        alt={`${workshop.title} - Opção ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />

                      {/* Indicador atual */}
                      {currentImageIndex === index && (
                        <div className="absolute top-2 right-2 bg-[#FC3C80] text-white text-xs px-2 py-1 font-semibold">
                          Atual
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
