"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { SmartImage } from "@/components/atoms/SmartImage";
import { Button, LoadingSpinner } from "@/components/atoms";
import { Header } from "@/components/organisms/Header";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { Product } from "@/types/product";
import {
  workshopFolders,
  folderImageCounts,
} from "@/utils/workshop-categories";
import { Footer } from "@/components/modules";
import Image from "next/image";

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const slug = params.slug as string;

  // Extrair o nome da oficina e índice do item (se houver) da URL
  // Formato: oficina-name ou oficina-name-item-2
  const itemMatch = slug?.match(/-item-(\d+)$/);
  const itemIndex = itemMatch ? parseInt(itemMatch[1]) - 1 : 0;

  // Remover a parte "-item-X" do slug para obter apenas o nome da oficina
  const workshopSlug = itemMatch ? slug.replace(/-item-\d+$/, "") : slug;

  // Decodificar URL e encontrar a oficina correspondente
  const decodedSlug = decodeURIComponent(workshopSlug);
  const workshop = workshopFolders.find((folder) => {
    const normalizedFolder = folder
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
    const normalizedSlug = decodedSlug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos

    return (
      normalizedFolder === normalizedSlug ||
      folder.toLowerCase().replace(/\s+/g, "-") === decodedSlug.toLowerCase()
    );
  });

  // Definir o índice inicial da imagem baseado na URL
  useEffect(() => {
    if (itemMatch && itemIndex >= 0) {
      setCurrentImageIndex(itemIndex);
    }
  }, [itemMatch, itemIndex]);

  const imageCount = workshop ? folderImageCounts[workshop] || 1 : 1;
  const imageIndices = Array.from({ length: imageCount }, (_, i) => i + 1);

  // Se a oficina não for encontrada após um tempo, mostrar erro
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Dar um tempo para decodificar a URL

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || (!workshop && slug)) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ecced1] mb-4"></div>
                <p className="text-[#8A8A8A]">Carregando oficina...</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[#615C5C] mb-4">
                  Oficina não encontrada
                </h1>
                <p className="text-[#8A8A8A] mb-4">
                  A oficina que você está procurando não existe.
                </p>
                <Button onClick={() => router.push("/workshops")}>
                  Voltar para Oficinas
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const getImageBasePath = () => {
    if (workshop === "BRINQUEDOTECA") {
      return "/images/workshops/BRINQUEDOTECA/COLORIDA";
    }
    return `/images/workshops/${workshop}`;
  };

  const formatWorkshopName = (name?: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Criar produto baseado na oficina atual
  const currentProduct: Product | null = workshop
    ? {
        id: `workshop-${workshop.toLowerCase().replace(/\s+/g, "-")}`,
        name: formatWorkshopName(workshop),
        description: `Oficina de ${formatWorkshopName(
          workshop.toLowerCase()
        )} com múltiplas opções disponíveis`,
        category: "favorites",
        image: `/images/workshops/${workshop}/1.jpg`,
        workshopFolder: workshop,
        workshopSubfolder:
          workshop === "BRINQUEDOTECA" ? "COLORIDA" : undefined,
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

    // Adicionar a quantidade especificada
    for (let i = 0; i < quantity; i++) {
      addItem(currentProduct);
    }
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
      {isLoading ? (
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
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <SmartImage
                        basePath={getImageBasePath()}
                        imageName={imageIndices[currentImageIndex].toString()}
                        alt={`${formatWorkshopName(workshop)} - Imagem ${
                          currentImageIndex + 1
                        }`}
                        fill={true}
                        className="object-cover"
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

                      {/* Indicador */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {imageCount}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {imageCount > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {imageIndices.map((imageIndex, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square overflow-hidden border-2 ${
                          currentImageIndex === index
                            ? "border-[#ecced1]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <SmartImage
                          basePath={getImageBasePath()}
                          imageName={imageIndex.toString()}
                          alt={`Thumbnail ${index + 1}`}
                          fill={true}
                          className="object-cover"
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
                    {formatWorkshopName(workshop)}
                  </h1>
                  <p className="text-[#8A8A8A] text-lg">
                    Oficina criativa completa com materiais inclusos
                  </p>
                </div>

                {/* Preço */}
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-2xl font-bold text-[#615C5C]">
                    Sob consulta
                  </p>
                  <p className="text-sm text-[#8A8A8A] mt-1">
                    Preços variam conforme duração e número de participantes
                  </p>
                </div>

                {/* Detalhes */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-[#615C5C]">Duração</h3>
                      <p className="text-[#8A8A8A]">1-2 horas</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#615C5C]">Idade</h3>
                      <p className="text-[#8A8A8A]">5-12 anos</p>
                    </div>
                  </div>
                </div>

                {/* Destaques */}
                <div>
                  <h3 className="font-semibold text-[#615C5C] mb-3">Inclui:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#ecced1]"></div>
                      Materiais inclusos
                    </li>
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#ecced1]"></div>
                      Atividade criativa
                    </li>
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#ecced1]"></div>
                      Lembrança especial
                    </li>
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#ecced1]"></div>
                      {imageCount}{" "}
                      {imageCount === 1
                        ? "opção disponível"
                        : "opções disponíveis"}
                    </li>
                  </ul>
                </div>

                {/* Quantidade e Ações */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#615C5C]">
                      Quantidade:
                    </span>
                    <div className="flex items-center bg-[#ecced1] rounded-sm !text-[rgb(81, 78, 85)]">
                      <button
                        disabled
                        className="p-2"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus size={16} fill="rgb(81, 78, 85)" />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center !text-[rgb(81, 78, 85)]">
                        {quantity}
                      </span>
                      <button
                        disabled
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2"
                      >
                        <Plus size={16} className="!text-[rgb(81, 78, 85)]" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#ecced1] hover:bg-[#ecced1] !text-[rgb(81, 78, 85)] py-3"
                    >
                      Adicionar à sacola
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleToggleFavorite}
                      className={`p-3 border-none ${
                        isWorkshopFavorite
                          ? "text-[#ecced1] border-[#ecced1]"
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
                        className={
                          isWorkshopFavorite ? "opacity-100" : "opacity-50"
                        }
                      />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-[#615C5C] mb-3">
                    Descrição
                  </h3>
                  <p className="text-[#8A8A8A] leading-relaxed">
                    A oficina de {formatWorkshopName(workshop?.toLowerCase())} é
                    uma experiência única e criativa para crianças. Com{" "}
                    {imageCount} {imageCount === 1 ? "opção" : "opções"}{" "}
                    diferentes disponíveis, cada participante pode explorar sua
                    criatividade de forma única. Todos os materiais necessários
                    estão inclusos, garantindo uma experiência completa e
                    memorável.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Items Similares */}
          {imageCount > 1 && (
            <div className="py-2">
              <div className="container px-4">
                <h2 className="text-2xl font-bold text-[#615C5C] mb-8 text-center">
                  Outras opções de {formatWorkshopName(workshop)}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imageIndices.map((imageIndex, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        const newSlug =
                          workshopSlug +
                          (index > 0 ? `-item-${index + 1}` : "");
                        router.push(`/workshop/${newSlug}`);
                      }}
                      className={`relative aspect-square overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-[#ecced1] ring-2 ring-[#ecced1]/20"
                          : "border-gray-200 hover:border-[#ecced1]/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SmartImage
                        basePath={getImageBasePath()}
                        imageName={imageIndex.toString()}
                        alt={`${formatWorkshopName(workshop)} - Opção ${
                          index + 1
                        }`}
                        fill={true}
                        className="object-cover"
                      />

                      {/* Indicador atual */}
                      {currentImageIndex === index && (
                        <div className="absolute top-2 right-2 bg-[#ecced1] text-white text-xs px-2 py-1 font-semibold">
                          Atual
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={() => router.push("/workshops")}
                    variant="outline"
                    className="border-[#ecced1] text-[rgb(81,78,85)] hover:bg-[#ecced1] "
                  >
                    Ver Todas as Oficinas
                  </Button>
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
