// Estrutura das oficinas baseada diretamente nas pastas
export const workshopFolders = [
  "AQUÁRIO",
  "ARCO DISNEY", 
  "ASA DE BORBOLETA",
  "BELEZA",
  "BIJU COM CHAVEIROS",
  "BISCOITOS DECORADOS",
  "BISCUIT", 
  "BODYS",
  "BOLHAS DE SABAO",
  "BOLSAS DE PALHA",
  "BONE",
  "BRINCADEIRAS RAIZ",
  "BRINQUEDOTECA",
  "BUCKET",
  "CADERNINHOS",
  "CAIXA DE FADA",
  "CAMISAS",
  "CAPA HARRY POTTER",
  "CAPAS HEROIS", 
  "CARMED",
  "CARTINHAS",
  "CARTOLA",
  "CASAMENTO",
  "CHAPEU DE PALHA",
  "CIENTISTA",
  "COLAGEM E CRIATIVIDADE",
  "CUPCAKE",
  "ESMALTAÇAO",
  "ESPAÇO SONINHO",
  "ESTOJO",
  "FANTOCHES",
  "JARDINAGEM", 
  "MAQUIAGEM ARTÍSTICA",
  "MASCARA",
  "PINTURA EM BOBBIE GOODS",
  "PINTURA EM TELA",
  "PINTURA NO CAVALETE",
  "RECICLAGEM",
  "RECREAÇOES", 
  "SLIME",
  "SLIME NEON",
  "SPA",
  "TOTEM MDF",
  "VARINHA E COROA",
  "VARINHA HARRY POTTER",
  "VISEIRA"
];

// Pastas que possuem subpastas
export const foldersWithSubfolders = {
  "BRINQUEDOTECA": [
    "CLEAN",
    "COLORIDA", 
    "PRINCESAS"
  ]
};

// Sistema de categorias simplificado - apenas para organizar os filtros em uma estrutura plana
export const workshopCategories = workshopFolders.reduce((acc, folder) => {
  acc["Oficinas"] = acc["Oficinas"] || [];
  acc["Oficinas"].push(folder);
  return acc;
}, {} as Record<string, string[]>);

// Função para obter todas as oficinas em formato plano
export const getAllWorkshops = () => {
  const workshops: string[] = [];
  
  Object.values(workshopCategories).forEach(categoryWorkshops => {
    workshops.push(...categoryWorkshops);
  });
  
  return [...new Set(workshops)]; // Remove duplicatas
};

// Função para obter categoria de uma oficina
export const getWorkshopCategory = (workshop: string) => {
  for (const [category, workshops] of Object.entries(workshopCategories)) {
    if (workshops.includes(workshop)) {
      return category;
    }
  }
  return null;
};

// Função para obter path da imagem de uma oficina
export const getWorkshopImagePath = (workshop: string, subcategory?: string) => {
  if (workshop === "BRINQUEDOTECA" && subcategory) {
    return `/images/workshops/BRINQUEDOTECA/${subcategory}`;
  }
  return `/images/workshops/${workshop}`;
};

// Contagem estimada de imagens por pasta (baseado na verificação manual)
export const folderImageCounts: Record<string, number> = {
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
  "BRINQUEDOTECA": 25, // Total das subpastas
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

// Contagem específica para subpastas
export const subfolderImageCounts: Record<string, number> = {
  "BRINQUEDOTECA-CLEAN": 0,
  "BRINQUEDOTECA-COLORIDA": 22,
  "BRINQUEDOTECA-PRINCESAS": 3
};

// Lista completa de oficinas baseada na estrutura de pastas
export const workshopsList = [
  "AQUÁRIO",
  "ARCO DISNEY", 
  "ASA DE BORBOLETA",
  "BELEZA",
  "BIJU COM CHAVEIROS",
  "BISCOITOS DECORADOS",
  "BISCUIT", 
  "BODYS",
  "BOLHAS DE SABAO",
  "BOLSAS DE PALHA",
  "BONE",
  "BRINCADEIRAS RAIZ",
  "BRINQUEDOTECA",
  "BUCKET",
  "CADERNINHOS",
  "CAIXA DE FADA",
  "CAMISAS",
  "CAPA HARRY POTTER",
  "CAPAS HEROIS", 
  "CARMED",
  "CARTINHAS",
  "CARTOLA",
  "CASAMENTO",
  "CHAPEU DE PALHA",
  "CIENTISTA",
  "COLAGEM E CRIATIVIDADE",
  "CUPCAKE",
  "ESMALTAÇAO",
  "ESPAÇO SONINHO",
  "ESTOJO",
  "FANTOCHES",
  "JARDINAGEM", 
  "MAQUIAGEM ARTÍSTICA",
  "MASCARA",
  "PINTURA EM BOBBIE GOODS",
  "PINTURA EM TELA",
  "PINTURA NO CAVALETE",
  "RECICLAGEM",
  "RECREAÇOES", 
  "SLIME",
  "SLIME NEON",
  "SPA",
  "TOTEM MDF",
  "VARINHA E COROA",
  "VARINHA HARRY POTTER",
  "VISEIRA"
];