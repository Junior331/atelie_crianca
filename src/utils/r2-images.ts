/**
 * Helper para usar imagens direto do R2
 * Não depende do banco de dados Supabase
 */

const R2_URL = 'https://pub-d50114600aa44bf0a236f33f64195f03.r2.dev/images';

/**
 * Retorna URL completa de uma imagem no R2
 */
export function getR2Image(filename: string): string {
  return `${R2_URL}/${filename}`;
}

/**
 * Imagens disponíveis no R2
 */
export const R2_IMAGES = {
  // Banners e Hero
  banner1: getR2Image('banner_01.jpeg'),
  banner2: getR2Image('banner_02.jpeg'),
  banner2png: getR2Image('banner_02.png'),

  // Carousel
  carousel1: getR2Image('carousel-image.jpeg'),
  carousel2: getR2Image('carousel-image2.jpeg'),
  carousel3: getR2Image('carousel-image3.jpeg'),
  carousel4: getR2Image('carousel-image4.jpeg'),

  // About
  about: getR2Image('about.jpeg'),
  whoWeAre: getR2Image('who-we-are.jpeg'),
  mission: getR2Image('mission-bg2.jpeg'),

  // Atelie
  atelie1: getR2Image('atelie-1.jpeg'),
  atelie2: getR2Image('atelie-2.jpeg'),
  atelie3: getR2Image('atelie-3.jpeg'),

  // Brinquedoteca
  brinquedoteca1: getR2Image('brinquedoteca-1.jpeg'),
  brinquedoteca2: getR2Image('brinquedoteca-2.jpeg'),
  brinquedoteca3: getR2Image('brinquedoteca-3.jpeg'),

  // Casamentos
  casamentos1: getR2Image('casamentos-1.jpeg'),
  casamentos2: getR2Image('casamentos-2.jpeg'),
  casamentos3: getR2Image('casamentos-3.jpeg'),
  wedding: getR2Image('wedding.jpeg'),
  outdoorWedding: getR2Image('outdoor-wedding-ceremony.jpg'),
  weddingCover: getR2Image('wedding-cover.png'),
  weddingElegant: getR2Image('wedding-elegant.png'),
  weddingIntimate: getR2Image('wedding-intimate.png'),
  weddingNavy: getR2Image('wedding-navy.png'),

  // Playroom
  playroom1: getR2Image('playroom_01.jpg'),
  playroom2: getR2Image('playroom_02.jpg'),
  playroom3: getR2Image('playroom_03.jpg'),
  playroom4: getR2Image('playroom_04.jpg'),
  playroom5: getR2Image('playroom_05.jpg'),
  playroom6: getR2Image('playroom_06.jpg'),
  playroomCover: getR2Image('playroom-cover.png'),
  childrenPlayArea: getR2Image('children-play-area.jpg'),

  // Toy Library
  toyLibrary: getR2Image('toy-library.jpeg'),
  toyLibrary1: getR2Image('toyLibrary_01.jpg'),
  toyLibrary2: getR2Image('toyLibrary_02.jpg'),
  toyLibrary3: getR2Image('toyLibrary_03.jpg'),
  toyLibrary4: getR2Image('toyLibrary_04.jpg'),
  toyLibrary5: getR2Image('toyLibrary_05.jpg'),
  toyLibrary6: getR2Image('toyLibrary_06.jpg'),

  // Snacks
  snackTable: getR2Image('snack-table.jpeg'),
  snack1: getR2Image('snack_01.jpg'),
  snack2: getR2Image('snack_02.jpg'),
  snack3: getR2Image('snack_03.jpg'),
  snack4: getR2Image('snack_04.jpg'),
  snack5: getR2Image('snack_05.jpg'),
  snack6: getR2Image('snack_06.jpg'),
  tableCoverSnack: getR2Image('table-cover-snack.png'),

  // Customized
  customized1: getR2Image('customized_01.jpg'),
  customized2: getR2Image('customized_02.jpg'),
  customized3: getR2Image('customized_03.jpg'),

  // Workshops
  oficinas: getR2Image('oficinas.jpeg'),

  // Icons e Logos
  logoAtelie: getR2Image('logo-atelie.png'),
  logoBrinquedoteca: getR2Image('logo-brinquedoteca.png'),
  logoCasamentos: getR2Image('logo-casamentos.png'),
  logoProdutos: getR2Image('logo-produtos.png'),
  logoCinza: getR2Image('logo_cinza.png'),
  logoDark: getR2Image('logo_dark.png'),
  logoLight: getR2Image('logo_light.png'),
  favicon: getR2Image('favicon.png'),

  // Icons
  bilingue: getR2Image('bilingue.png'),
  coracao: getR2Image('coracao.png'),
  coracaoSolid: getR2Image('coracao_solid.png'),
  corporateEvent: getR2Image('corporate-event.png'),
  entertainment: getR2Image('entertainment.png'),
  kidsParty: getR2Image('kids-party.png'),
  lamp: getR2Image('lamp.png'),
  lupa: getR2Image('lupa.png'),
  menu: getR2Image('menu.png'),
  napSpace: getR2Image('nap-space.png'),
  sacola: getR2Image('sacola.png'),
  sacolaBranca: getR2Image('sacola branca.png'),
  trainedTeam: getR2Image('trained-team.png'),
  turtle: getR2Image('turtle.png'),
  birthdayParty: getR2Image('birthday-party-pink.jpg'),
  iconLoading: getR2Image('icon_loading.png'),
};

/**
 * Lista todas as imagens disponíveis
 */
export function listR2Images() {
  return Object.keys(R2_IMAGES);
}

/**
 * Busca imagem por nome (case insensitive)
 */
export function findR2Image(searchTerm: string): string | undefined {
  const key = Object.keys(R2_IMAGES).find(k =>
    k.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return key ? R2_IMAGES[key as keyof typeof R2_IMAGES] : undefined;
}
