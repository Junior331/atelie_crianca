import { produtos } from "@/assets/Produtos";

// Estrutura dos produtos baseada nas pastas reais
export const productFolders = ["acessorios", "arcos", "brindes", "fantasias"];

// Categorias de produtos (mapeia para as pastas reais)
export const productCategories = {
  "Acessórios": "acessorios",
  "Arcos": "arcos",
  "Brindes": "brindes",
  "Fantasias": "fantasias",
  "Todos": "all",
};

// Mapeamento reverso: pasta -> categoria
export const folderToCategoryMap: Record<string, string> = {
  acessorios: "Acessórios",
  arcos: "Arcos",
  brindes: "Brindes",
  fantasias: "Fantasias",
};

// Descrições específicas para cada categoria
export const categoryDescriptions: Record<string, string> = {
  Acessórios: "Acessórios decorativos e personalizados",
  Arcos: "Arcos decorativos para festas",
  Brindes: "Brindes personalizados para eventos",
  Fantasias: "Fantasias criativas para festas",
};

// Contagens de produtos por pasta (calculadas dinamicamente)
export const folderProductCounts: Record<string, number> = {
  acessorios: Object.keys(produtos.acessorios || {}).length,
  arcos: Object.keys(produtos.arcos || {}).length,
  brindes: Object.keys(produtos.brindes || {}).length,
  fantasias: Object.keys(produtos.fantasias || {}).length,
};

// Função para obter categoria de um produto (baseado na pasta)
export const getProductCategory = (folder: string): string => {
  return folderToCategoryMap[folder] || "Acessórios";
};

// Função para obter todos os produtos por categoria
export const getAllProductsByCategory = () => {
  return productCategories;
};

// Função para obter pasta pela categoria
export const getFolderByCategory = (category: string): string | null => {
  return productCategories[category as keyof typeof productCategories] || null;
};

// Função para obter total de produtos
export const getTotalProducts = (): number => {
  return Object.values(folderProductCounts).reduce((sum, count) => sum + count, 0);
};
