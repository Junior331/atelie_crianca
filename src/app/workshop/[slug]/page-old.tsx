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
import { workshopFolders } from "@/utils/workshop-categories";
import { Footer } from "@/components/modules";
import Image from "next/image";
import { getWorkshopImage, getWorkshopImageCount } from "@/assets/workshop";

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slug = params.slug as string;

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
      normalizedFolder === normalizedSlug || folder.toLowerCase().replace(/\s+/g, "-") === decodedSlug.toLowerCase()
    );
  });

  // Mapear nome da oficina para pasta correspondente
  const getFolderName = (name?: string) => {
    if (!name) return "";
    const mapping: Record<string, string> = {
      "OFICINA DE ARCO DISNEY": "ARCO DISNEY",
      "OFICINA DE ASA DE BORBOLETA": "ASA DE BORBOLETA",
      "OFICINA DE BELEZA": "BELEZA",
      "OFICINA DE BIJU": "BIJU COM CHAVEIROS",
      "OFICINA DE BISCOITOS DECORADOS": "BISCOITOS DECORADOS",
      "OFICINA DE BODYS DE BEBÊ": "BODYS",
      "OFICINA DE BOLHAS DE SABAO": "BOLHAS DE SABAO",
      "OFICINA DE BOLSAS DE PALHA": "BOLSAS DE PALHA",
      "OFICINA DE BONE": "BONE",
      "OFICINA DE BUCKET": "BUCKET",
      "OFICINA DE CADERNINHOS": "CADERNINHOS",
      "OFICINA DE CAMISAS": "CAMISAS",
      "OFICINA DE CAPA DE SUPER-HERÓI": "CAPAS HEROIS",
      "OFICINA DE CARTINHAS": "CARTINHAS",
      "OFICINA DE CARTOLA": "CARTOLA",
      "OFICINA DE COLAGEM E CRIATIVIDADE": "COLAGEM E CRIATIVIDADE",
      "OFICINA DE CUPCAKE": "CUPCAKE",
      "OFICINA DE ESMALTAÇAO": "ESMALTAÇAO",
      "OFICINA DE ESTOJO": "ESTOJO",
      "OFICINA DE FANTOCHES": "FANTOCHES",
      "OFICINA DE JARDINAGEM": "JARDINAGEM",
      "OFICINA DE MASCARA": "MASCARA",
      "OFICINA DE PINTURA NA TELA": "PINTURA EM TELA",
      "OFICINA DE PINTURA NO CAVALETE": "PINTURA NO CAVALETE",
      "OFICINA DE RECICLAGEM": "RECICLAGEM",
      "OFICINA DE SLIME": "SLIME",
      "OFICINA DE VARINHA DE CONDÃO": "VARINHA E COROA",
      "OFICINA DE VARINHA HARRY POTTER": "VARINHA HARRY POTTER",
      "OFICINA DE VISEIRA": "VISEIRA",
    };
    return mapping[name] || name;
  };

  const folderName = getFolderName(workshop);
  const subfolder = folderName === "BRINQUEDOTECA" ? "COLORIDA" : undefined;

  // Definir o índice inicial da imagem baseado na URL
  useEffect(() => {
    if (itemMatch && itemIndex >= 0) {
      setCurrentImageIndex(itemIndex);
    }
  }, [itemMatch, itemIndex]);

  const imageCount = workshop ? getWorkshopImageCount(folderName, subfolder) : 1;
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b42165] mb-4"></div>
                <p className="text-[#8A8A8A]">Carregando oficina...</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[#615C5C] mb-4">Oficina não encontrada</h1>
                <p className="text-[#8A8A8A] mb-4">A oficina que você está procurando não existe.</p>
                <Button onClick={() => router.push("/workshops")}>Voltar para Oficinas</Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

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
        description: `Oficina de ${formatWorkshopName(workshop.toLowerCase())} com múltiplas opções disponíveis`,
        category: "favorites",
        image: getWorkshopImage(folderName, 1, subfolder),
        workshopFolder: workshop,
        workshopSubfolder: subfolder,
        duration: "1-2 horas",
        ageRange: "5-12 anos",
        highlights: ["Materiais inclusos", "Atividade criativa", "Lembrança especial"],
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

  const isWorkshopFavorite = currentProduct ? isFavorite(currentProduct.id) : false;

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
      <Image
        src={getWorkshopImage(folderName, imageIndices[currentImageIndex], subfolder)}
        alt={`${formatWorkshopName(workshop)} - Imagem ${currentImageIndex + 1}`}
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
        {imageIndices.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation(); // evita abrir clique do card
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
</div>


                {/* Thumbnails */}
                {imageCount > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {imageIndices.map((imageIndex, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square overflow-hidden border-2 ${
                          currentImageIndex === index ? "border-[#b42165]" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={getWorkshopImage(folderName, imageIndex, subfolder)}
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
                  <h1 className="text-3xl font-bold text-[#615C5C] mb-2">{formatWorkshopName(workshop)}</h1>
                  <p className="text-[#8A8A8A] text-lg">Oficina criativa completa com materiais inclusos</p>
                </div>

                {/* Preço */}
                <div className=" border-gray-200 pt-6">
                  <h3 className="font-semibold text-[#615C5C] mb-3">Descrição</h3>
                  <p className="text-[#8A8A8A] leading-relaxed">
                    A oficina de {formatWorkshopName(workshop?.toLowerCase())} é uma experiência única e criativa para
                    crianças. Com {imageCount} {imageCount === 1 ? "opção" : "opções"} diferentes disponíveis, cada
                    participante pode explorar sua criatividade de forma única. Todos os materiais necessários estão
                    inclusos, garantindo uma experiência completa e memorável.
                  </p>
                </div>

                {/* Detalhes */}
                {/* <div className="space-y-4">
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
                {/* <div>
                  <h3 className="font-semibold text-[#615C5C] mb-3">Inclui:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#b42165]"></div>
                      Materiais inclusos
                    </li>
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#b42165]"></div>
                      Atividade criativa
                    </li>
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#b42165]"></div>
                      Lembrança especial
                    </li>
                    <li className="flex items-center gap-2 text-[#8A8A8A]">
                      <div className="w-1.5 h-1.5 bg-[#b42165]"></div>
                      {imageCount}{" "}
                      {imageCount === 1
                        ? "opção disponível"
                        : "opções disponíveis"}
                    </li>
                  </ul>
                </div> */}

                {/* Quantidade e Ações */}
                <div className="space-y-4  border-gray-200 pt-6">
                  {/* <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#615C5C]">
                      Quantidade:
                    </span>
                    <div className="flex items-center bg-[#b42165] rounded-sm !text-[rgb(81, 78, 85)]">
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
                  </div> */}

                  <div className="flex gap-3">
                    <Button onClick={handleAddToCart} className="flex-1 bg-[#b42165] py-3">
                      <span className="text-[#FFF] ">Adicionar à sacola</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleToggleFavorite}
                      className={`p-3 border-none ${
                        isWorkshopFavorite ? "text-[#b42165] border-[#b42165]" : "text-[#8A8A8A]"
                      }`}
                    >
                      <Image
                        width={20}
                        height={20}
                        alt="Coração"
                        src={isWorkshopFavorite ? "/images/coracao_solid.png" : "/images/coracao.png"}
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
                  {imageIndices.map((imageIndex, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        const newSlug = workshopSlug + (index > 0 ? `-item-${index + 1}` : "");
                        router.push(`/workshop/${newSlug}`);
                      }}
                      className={`relative aspect-square overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-[#b42165] ring-2 ring-[#b42165]/20"
                          : "border-gray-200 hover:border-[#b42165]/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={getWorkshopImage(folderName, imageIndex, subfolder)}
                        alt={`${formatWorkshopName(workshop)} - Opção ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />

                      {/* Indicador atual */}
                      {currentImageIndex === index && (
                        <div className="absolute top-2 right-2 bg-[#b42165] text-white text-xs px-2 py-1 font-semibold">
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
