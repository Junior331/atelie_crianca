import type { Product } from "@/types/product";
import { getAllKnownImages, type ImageFile } from "./file-system";

// Função para converter ImageFile em Product
const imageToProduct = (image: ImageFile, index: number): Product => {
  const workshopName = image.subfolder 
    ? `${image.folder} ${image.subfolder}` 
    : image.folder;
  
  const displayName = workshopName.replace(/_/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  const workshopDescriptions: Record<string, { description: string; duration: string; ageRange: string; highlights: string[] }> = {
    "BRINQUEDOTECA CLEAN": {
      description: "Espaço organizado com brinquedos educativos e atividades livres em ambiente clean.",
      duration: "livre",
      ageRange: "2-12 anos",
      highlights: ["Ambiente limpo", "Brinquedos educativos", "Atividade livre"]
    },
    "BRINQUEDOTECA COLORIDA": {
      description: "Brinquedoteca vibrante e colorida com jogos e atividades estimulantes.",
      duration: "livre", 
      ageRange: "2-12 anos",
      highlights: ["Cores vibrantes", "Jogos variados", "Estimula criatividade"]
    },
    "BRINQUEDOTECA PRINCESAS": {
      description: "Espaço temático das princesas com fantasias e atividades mágicas.",
      duration: "livre",
      ageRange: "3-10 anos", 
      highlights: ["Tema princesas", "Fantasias disponíveis", "Atividades mágicas"]
    },
    "AQUÁRIO": {
      description: "Construa seu próprio aquário com peixes coloridos e decorações aquáticas.",
      duration: "2 horas",
      ageRange: "6-14 anos",
      highlights: ["Peixes artificiais", "Decorações temáticas", "Aquário personalizado"]
    },
    "SLIME": {
      description: "Diversão garantida criando slimes coloridos e brilhantes com texturas incríveis.",
      duration: "1 hora",
      ageRange: "5-14 anos",
      highlights: ["Materiais seguros", "Cores vibrantes", "Leva para casa"]
    }
  };

  const info = workshopDescriptions[workshopName] || {
    description: `Oficina criativa de ${displayName.toLowerCase()} com atividades divertidas e educativas.`,
    duration: "1-2 horas",
    ageRange: "5-12 anos", 
    highlights: ["Materiais inclusos", "Atividade criativa", "Lembrança especial"]
  };

  return {
    id: `${image.folder.toLowerCase().replace(/ /g, '-')}${image.subfolder ? `-${image.subfolder.toLowerCase()}` : ''}-${index}`,
    name: displayName,
    description: info.description,
    image: image.path,
    category: "",
    duration: info.duration,
    ageRange: info.ageRange,
    highlights: info.highlights,
    isPopular: ["SLIME", "SPA", "ARCO DISNEY", "BRINQUEDOTECA", "FANTOCHES"].includes(image.folder),
    workshopFolder: image.folder,
    workshopSubfolder: image.subfolder
  };
};

// Gera produtos baseados nas imagens reais das pastas
export const products_mock: Product[] = (() => {
  const allImages = getAllKnownImages();
  return allImages.map((image, index) => imageToProduct(image, index + 1));
})();
