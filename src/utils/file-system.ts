/* eslint-disable @typescript-eslint/no-unused-vars */
export interface ImageFile {
  name: string;
  path: string;
  folder: string;
  subfolder?: string;
}

// Função para gerar lista de imagens baseada na estrutura conhecida
export const getImagesFromFolder = async (folder: string, subfolder?: string): Promise<ImageFile[]> => {
  const basePath = subfolder ? `/images/workshops/${folder}/${subfolder}` : `/images/workshops/${folder}`;
  const images: ImageFile[] = [];
  
  // Extensões de imagem suportadas
  const imageExtensions = ['.jpeg', '.jpg', '.png', '.webp'];
  
  // Para BRINQUEDOTECA com subfolders
  if (folder === "BRINQUEDOTECA" && subfolder) {
    const counts = {
      "CLEAN": 0,
      "COLORIDA": 22, 
      "PRINCESAS": 3
    };
    
    const count = counts[subfolder as keyof typeof counts] || 0;
    
    for (let i = 1; i <= count; i++) {
      // Tentar diferentes extensões
      for (const ext of imageExtensions) {
        const imagePath = `${basePath}/${i}${ext}`;
        
        try {
          // Verificar se a imagem existe fazendo uma requisição HEAD
          const response = await fetch(imagePath, { method: 'HEAD' });
          if (response.ok) {
            images.push({
              name: `${i}${ext}`,
              path: imagePath,
              folder,
              subfolder
            });
            break; // Parar quando encontrar a primeira extensão válida
          }
        } catch (error) {
          continue;
        }
      }
    }
  } else {
    // Para outras pastas
    const estimatedCounts: Record<string, number> = {
      "AQUÁRIO": 3,
      "ARCO DISNEY": 2,
      "ASA DE BORBOLETA": 2,
      "BELEZA": 3,
      // Adicionar outras conforme necessário
    };
    
    const count = estimatedCounts[folder] || 1;
    
    for (let i = 1; i <= count; i++) {
      for (const ext of imageExtensions) {
        const imagePath = `${basePath}/${i}${ext}`;
        
        try {
          const response = await fetch(imagePath, { method: 'HEAD' });
          if (response.ok) {
            images.push({
              name: `${i}${ext}`,
              path: imagePath,
              folder,
              subfolder
            });
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }
  }
  
  return images;
};

// Função para obter todas as imagens de uma oficina (incluindo subpastas)
export const getAllImagesFromWorkshop = async (folder: string): Promise<ImageFile[]> => {
  let allImages: ImageFile[] = [];
  
  if (folder === "BRINQUEDOTECA") {
    const subfolders = ["CLEAN", "COLORIDA", "PRINCESAS"];
    
    for (const subfolder of subfolders) {
      const images = await getImagesFromFolder(folder, subfolder);
      allImages = [...allImages, ...images];
    }
  } else {
    allImages = await getImagesFromFolder(folder);
  }
  
  return allImages;
};

// Função simplificada que não faz requisições HTTP - usa estrutura conhecida
export const getKnownImages = (folder: string, subfolder?: string): ImageFile[] => {
  const images: ImageFile[] = [];
  const basePath = subfolder ? `/images/workshops/${folder}/${subfolder}` : `/images/workshops/${folder}`;
  
  if (folder === "BRINQUEDOTECA" && subfolder) {
    const counts = {
      "CLEAN": 0,
      "COLORIDA": 22, 
      "PRINCESAS": 3
    };
    
    const count = counts[subfolder as keyof typeof counts] || 0;
    
    for (let i = 1; i <= count; i++) {
      // Usar nome genérico, o SmartImage vai encontrar o formato correto
      images.push({
        name: `${i}`,
        path: `${basePath}/${i}`,
        folder,
        subfolder
      });
    }
  } else {
    const estimatedCounts: Record<string, number> = {
      "AQUÁRIO": 3,
      "ARCO DISNEY": 2,
      "ASA DE BORBOLETA": 2,
      "BELEZA": 3,
      "BIJU COM CHAVEIROS": 1,
      "BISCOITOS DECORADOS": 1,
      "BISCUIT": 1,
      "BODYS": 1,
      "BOLHAS DE SABAO": 1,
      "BOLSAS DE PALHA": 1,
      "BONE": 1,
      "BRINCADEIRAS RAIZ": 1,
      "BUCKET": 1,
      "CADERNINHOS": 1,
      "CAIXA DE FADA": 1,
      "CAMISAS": 1,
      "CAPA HARRY POTTER": 1,
      "CAPAS HEROIS": 1,
      "CARMED": 1,
      "CARTINHAS": 1,
      "CARTOLA": 1,
      "CASAMENTO": 1,
      "CHAPEU DE PALHA": 1,
      "CIENTISTA": 1,
      "COLAGEM E CRIATIVIDADE": 1,
      "CUPCAKE": 1,
      "ESMALTAÇAO": 1,
      "ESPAÇO SONINHO": 1,
      "ESTOJO": 1,
      "FANTOCHES": 1,
      "JARDINAGEM": 1,
      "MAQUIAGEM ARTÍSTICA": 1,
      "MASCARA": 1,
      "PINTURA EM BOBBIE GOODS": 1,
      "PINTURA EM TELA": 1,
      "PINTURA NO CAVALETE": 1,
      "RECICLAGEM": 1,
      "RECREAÇOES": 1,
      "SLIME": 1,
      "SLIME NEON": 1,
      "SPA": 1,
      "TOTEM MDF": 1,
      "VARINHA E COROA": 1,
      "VARINHA HARRY POTTER": 1,
      "VISEIRA": 1
    };
    
    const count = estimatedCounts[folder] || 1;
    
    for (let i = 1; i <= count; i++) {
      // Usar nome genérico, o SmartImage vai encontrar o formato correto
      images.push({
        name: `${i}`,
        path: `${basePath}/${i}`,
        folder,
        subfolder
      });
    }
  }
  
  return images;
};

// Função para obter todas as imagens conhecidas
export const getAllKnownImages = (): ImageFile[] => {
  const allImages: ImageFile[] = [];
  
  // Oficinas normais
  const workshops = [
    "AQUÁRIO", "ARCO DISNEY", "ASA DE BORBOLETA", "BELEZA", "BIJU COM CHAVEIROS",
    "BISCOITOS DECORADOS", "BISCUIT", "BODYS", "BOLHAS DE SABAO", "BOLSAS DE PALHA",
    "BONE", "BRINCADEIRAS RAIZ", "BUCKET", "CADERNINHOS", "CAIXA DE FADA",
    "CAMISAS", "CAPA HARRY POTTER", "CAPAS HEROIS", "CARMED", "CARTINHAS",
    "CARTOLA", "CASAMENTO", "CHAPEU DE PALHA", "CIENTISTA", "COLAGEM E CRIATIVIDADE",
    "CUPCAKE", "ESMALTAÇAO", "ESPAÇO SONINHO", "ESTOJO", "FANTOCHES",
    "JARDINAGEM", "MAQUIAGEM ARTÍSTICA", "MASCARA", "PINTURA EM BOBBIE GOODS",
    "PINTURA EM TELA", "PINTURA NO CAVALETE", "RECICLAGEM", "RECREAÇOES",
    "SLIME", "SLIME NEON", "SPA", "TOTEM MDF", "VARINHA E COROA",
    "VARINHA HARRY POTTER", "VISEIRA"
  ];
  
  workshops.forEach(workshop => {
    if (workshop !== "BRINQUEDOTECA") {
      const images = getKnownImages(workshop);
      allImages.push(...images);
    }
  });
  
  // BRINQUEDOTECA com subpastas
  const subfolders = ["CLEAN", "COLORIDA", "PRINCESAS"];
  subfolders.forEach(subfolder => {
    const images = getKnownImages("BRINQUEDOTECA", subfolder);
    allImages.push(...images);
  });
  
  return allImages;
};