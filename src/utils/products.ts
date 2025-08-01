import type { Product } from "@/types/product";

const images = [
  "/images/wedding-intimate.png",
  "/images/corporate-event.png",
  "/images/kids-party.png",
  "/images/wedding-navy.png",
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

export const products_mock: Product[] = [
  {
    id: "1",
    name: "Pintura Facial Mágica",
    description:
      "Transforme as crianças em seus personagens favoritos com nossa pintura facial profissional e segura.",
    image: getRandomImage(),
    category: "essentials",
    duration: "2-3 horas",
    ageRange: "3-12 anos",
    highlights: [
      "Tintas atóxicas",
      "Designs personalizados",
      "Profissional experiente",
    ],
    isPopular: true,
  },
  {
    id: "2",
    name: "Oficina de Slime Colorido",
    description:
      "Diversão garantida criando slimes coloridos e brilhantes com texturas incríveis.",
    image: getRandomImage(),
    category: "essentials",
    duration: "1-2 horas",
    ageRange: "5-14 anos",
    highlights: ["Materiais seguros", "Cores vibrantes", "Leva para casa"],
    isPopular: true,
  },
  {
    id: "3",
    name: "Caça ao Tesouro Aventureira",
    description:
      "Uma aventura emocionante com pistas, enigmas e surpresas para todas as idades.",
    image: getRandomImage(),
    category: "essentials",
    duration: "1-1.5 horas",
    ageRange: "4-12 anos",
    highlights: [
      "Pistas personalizadas",
      "Prêmios inclusos",
      "Trabalho em equipe",
    ],
  },
  {
    id: "4",
    name: "Oficina de Cupcakes Decorados",
    description:
      "Aprenda a decorar cupcakes deliciosos com técnicas profissionais de confeitaria.",
    image: getRandomImage(),
    category: "essentials",
    duration: "2 horas",
    ageRange: "6-16 anos",
    highlights: [
      "Ingredientes inclusos",
      "Técnicas profissionais",
      "Degustação",
    ],
  },

  // As Queridinhas
  {
    id: "5",
    name: "Spa das Princesas",
    description:
      "Um momento de relaxamento e beleza com máscaras faciais, esmaltes e muito mimo.",
    image: getRandomImage(),
    category: "favorites",
    duration: "2-3 horas",
    ageRange: "5-14 anos",
    highlights: [
      "Produtos naturais",
      "Esmaltes coloridos",
      "Ambiente relaxante",
    ],
    isPopular: true,
  },
  {
    id: "6",
    name: "Oficina de Bijuterias Criativas",
    description:
      "Crie pulseiras, colares e brincos únicos com miçangas, fitas e materiais especiais.",
    image: getRandomImage(),
    category: "favorites",
    duration: "1.5-2 horas",
    ageRange: "6-16 anos",
    highlights: ["Materiais variados", "Designs únicos", "Kit para levar"],
    isPopular: true,
  },
  {
    id: "7",
    name: "Teatro de Fantoches Interativo",
    description:
      "Espetáculo interativo onde as crianças participam da história e criam seus próprios fantoches.",
    image: getRandomImage(),
    category: "favorites",
    duration: "1 hora",
    ageRange: "3-10 anos",
    highlights: [
      "História personalizada",
      "Participação ativa",
      "Fantoche de lembrança",
    ],
  },
  {
    id: "8",
    name: "Oficina de Sabonetes Artesanais",
    description:
      "Aprenda a fazer sabonetes coloridos e perfumados com formas divertidas.",
    image: getRandomImage(),
    category: "favorites",
    duration: "1.5 horas",
    ageRange: "7-15 anos",
    highlights: ["Essências naturais", "Formas variadas", "Embalagem especial"],
  },

  // Casamentos e Afins
  {
    id: "9",
    name: "Oficina de Arranjos Florais",
    description:
      "Crie lindos arranjos florais com flores naturais e artificiais para decorar o evento.",
    image: getRandomImage(),
    category: "weddings",
    duration: "2 horas",
    ageRange: "8-16 anos",
    highlights: [
      "Flores frescas",
      "Técnicas profissionais",
      "Arranjo personalizado",
    ],
  },
  {
    id: "10",
    name: "Atelier de Porta-Retratos Decorados",
    description:
      "Decore porta-retratos únicos com técnicas de scrapbook e materiais especiais.",
    image: getRandomImage(),
    category: "weddings",
    duration: "1.5 horas",
    ageRange: "6-14 anos",
    highlights: [
      "Materiais premium",
      "Técnicas variadas",
      "Lembrança especial",
    ],
  },
  {
    id: "11",
    name: "Oficina de Velas Aromáticas",
    description:
      "Crie velas perfumadas personalizadas com cores e aromas especiais.",
    image: getRandomImage(),
    category: "weddings",
    duration: "2 horas",
    ageRange: "10-16 anos",
    highlights: [
      "Aromas exclusivos",
      "Cores personalizadas",
      "Embalagem elegante",
    ],
  },
  {
    id: "12",
    name: "Workshop de Origami Avançado",
    description:
      "Aprenda técnicas avançadas de origami para criar peças decorativas sofisticadas.",
    image: getRandomImage(),
    category: "weddings",
    duration: "1.5-2 horas",
    ageRange: "8-16 anos",
    highlights: ["Papéis especiais", "Técnicas japonesas", "Peças decorativas"],
  },
];
