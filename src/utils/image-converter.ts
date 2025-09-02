/* eslint-disable @typescript-eslint/no-unused-vars */
// Utilitário para trabalhar com diferentes formatos de imagem, incluindo HEIC

export const imageExtensions = ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.HEIC'];

// Função para verificar se uma imagem existe e retornar o formato correto
export const findAvailableImage = async (basePath: string, imageName: string): Promise<string | null> => {
  // Remove extensão se já houver
  const nameWithoutExt = imageName.replace(/\.[^/.]+$/, "");
  
  // Testar diferentes formatos
  const formats = ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.HEIC'];
  
  for (const format of formats) {
    const fullPath = `${basePath}/${nameWithoutExt}${format}`;
    
    try {
      // Tentar fazer uma requisição HEAD para verificar se existe
      const response = await fetch(fullPath, { method: 'HEAD' });
      if (response.ok) {
        return fullPath;
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
};

// Função para gerar múltiplos caminhos possíveis para uma imagem
export const getImageVariants = (basePath: string, imageName: string): string[] => {
  const nameWithoutExt = imageName.replace(/\.[^/.]+$/, "");
  const formats = ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.HEIC'];
  
  return formats.map(format => `${basePath}/${nameWithoutExt}${format}`);
};

// Componente React para renderizar imagens com fallback automático
export const getImageWithFallback = (basePath: string, imageName: string): string => {
  const nameWithoutExt = imageName.replace(/\.[^/.]+$/, "");
  
  // Priorizar formatos mais compatíveis primeiro
  const priorityFormats = ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.HEIC'];
  
  // Retornar o primeiro formato (será testado pelo componente)
  return `${basePath}/${nameWithoutExt}${priorityFormats[0]}`;
};

// Lista de possíveis formatos para uma imagem
export const getAllPossiblePaths = (basePath: string, imageName: string): string[] => {
  const nameWithoutExt = imageName.replace(/\.[^/.]+$/, "");
  
  return [
    `${basePath}/${nameWithoutExt}.jpeg`,
    `${basePath}/${nameWithoutExt}.jpg`, 
    `${basePath}/${nameWithoutExt}.png`,
    `${basePath}/${nameWithoutExt}.webp`,
    `${basePath}/${nameWithoutExt}.heic`,
    `${basePath}/${nameWithoutExt}.HEIC`
  ];
};