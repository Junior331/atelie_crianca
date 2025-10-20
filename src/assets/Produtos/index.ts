// Fallback image
import fallback from "../images/placeholder.svg";

// Acessorios imports
import acessorios_bucket_disney from "./acessorios/Bucket Disney.jpg";
import acessorios_bucket_halloween from "./acessorios/Bucket Halloween.jpg";
import acessorios_bucket_safari from "./acessorios/Bucket Safari.jpg";
import acessorios_bucket_stitch from "./acessorios/Bucket Stitch.jpg";
import acessorios_chape_de_palaha from "./acessorios/Chapé de Palaha.jpg";
import acessorios_coroa_brilhosa from "./acessorios/Coroa Brilhosa.jpg";
import acessorios_sache_cheirinho from "./acessorios/Sachê Cheirinho.jpg";
import acessorios_coroa_tecido from "./acessorios/Coroa Tecido.jpg";
import acessorios_frutinhas from "./acessorios/Frutinhas.jpg";
import acessorios_perixinhos from "./acessorios/Perixinhos.jpg";
import acessorios_varinha_de_condao from "./acessorios/Varinha de Condão.jpg";

// Arcos imports
import arcos_arco_disney_personalizado from "./arcos/Arco Disney Personalizado.png";
import arcos_arco_halloween from "./arcos/Arco Halloween.jpg";
import arcos_arco_mickey_magico from "./arcos/Arco Mickey Mágico.jpg";
import arcos_arco_mickey from "./arcos/Arco Mickey.png";
import arcos_arco_minnie_bolinhas from "./arcos/Arco Minnie Bolinhas.jpg";
import arcos_arco_minnie_magica from "./arcos/Arco Minnie Mágica.jpg";
import arcos_arco_minnie from "./arcos/Arco Minnie.jpg";
import arcos_arco_pascoa from "./arcos/Arco Páscoa.png";
import arcos_arco_prata from "./arcos/Arco Prata.jpg";
import arcos_arco_rose from "./arcos/Arco Rosé.jpg";
import arcos_arco_sereia from "./arcos/Arco Sereia.jpg";
import arcos_arcos_unicornio from "./arcos/Arcos Unicórnio.png";

// Brindes imports
import brindes_adote_um_bichinho from "./brindes/Adote um Bichinho.jpg";
import brindes_cachepo from "./brindes/Cachepô.jpg";
import brindes_centro_de_mesa_chapeu from "./brindes/Centro de Mesa chapéu.jpg";
import brindes_centro_de_mesa from "./brindes/Centro de mesa.jpg";
import brindes_dedoche_personalizado from "./brindes/Dedoche Personalizado.jpg";
import brindes_dedoches from "./brindes/Dedoches.jpg";
import brindes_jardinagem from "./brindes/Jardinagem.jpg";
import brindes_jogo_da_memoria from "./brindes/Jogo da Memória.jpg";
import brindes_jogo_da_velha_fazendinha from "./brindes/Jogo da Velha Fazendinha.jpg";
import brindes_jogo_da_velha_tematico from "./brindes/Jogo da Velha Temático.jpg";
import brindes_quebra_cabeca from "./brindes/Quebra Cabeça.jpg";
import brindes_unicornio from "./brindes/Unicórnio.jpg";

// Fantasias imports
import fantasias_capa_colorida from "./fantasias/Capa colorida.jpg";
import fantasias_capa_de_herois from "./fantasias/Capa de heróis.jpg";
import fantasias_capa_de_princesa from "./fantasias/Capa de Princesa.jpg";
import fantasias_capa_frozen from "./fantasias/Capa Frozen.jpg";
import fantasias_capas_brilhosas from "./fantasias/Capas brilhosas.jpg";
import fantasias_chapeu_peter_pan from "./fantasias/Chapéu Peter Pan.jpg";
import fantasias_fantasia_de_bombeiro from "./fantasias/Fantasia de bombeiro.jpg";
import fantasias_fantasia_de_construtor from "./fantasias/Fantasia de construtor.jpg";
import fantasias_fantasia_de_policial from "./fantasias/Fantasia de policial.jpg";
import fantasias_fantasia_de_princesa from "./fantasias/Fantasia de princesa.jpg";
import fantasias_mascara_bichinho from "./fantasias/Máscara Bichinho.jpg";
import fantasias_mascara from "./fantasias/Máscara.jpg";

// Export organized products object
export const produtos = {
  acessorios: {
    acessorios_bucket_disney,
    acessorios_bucket_halloween,
    acessorios_bucket_safari,
    acessorios_bucket_stitch,
    acessorios_chape_de_palaha,
    acessorios_coroa_brilhosa,
    acessorios_coroa_tecido,
    acessorios_sache_cheirinho,
    acessorios_frutinhas,
    acessorios_perixinhos,
    acessorios_varinha_de_condao,
  },
  arcos: {
    arcos_arco_disney_personalizado,
    arcos_arco_halloween,
    arcos_arco_mickey_magico,
    arcos_arco_mickey,
    arcos_arco_minnie_bolinhas,
    arcos_arco_minnie_magica,
    arcos_arco_minnie,
    arcos_arco_pascoa,
    arcos_arco_prata,
    arcos_arco_rose,
    arcos_arco_sereia,
    arcos_arcos_unicornio,
  },
  brindes: {
    brindes_adote_um_bichinho,
    brindes_cachepo,
    brindes_centro_de_mesa_chapeu,
    brindes_centro_de_mesa,
    brindes_dedoche_personalizado,
    brindes_dedoches,
    brindes_jardinagem,
    brindes_jogo_da_memoria,
    brindes_jogo_da_velha_fazendinha,
    brindes_jogo_da_velha_tematico,
    brindes_quebra_cabeca,
    brindes_unicornio,
  },
  fantasias: {
    fantasias_capa_colorida,
    fantasias_capa_de_herois,
    fantasias_capa_de_princesa,
    fantasias_capa_frozen,
    fantasias_capas_brilhosas,
    fantasias_chapeu_peter_pan,
    fantasias_fantasia_de_bombeiro,
    fantasias_fantasia_de_construtor,
    fantasias_fantasia_de_policial,
    fantasias_fantasia_de_princesa,
    fantasias_mascara_bichinho,
    fantasias_mascara,
  },
  fallback,
};

// Helper function to get a product by folder and id
export const getProduto = (folder: string, id: string) => {
  const key = `${folder}_${id}`;
  return produtos[folder as keyof typeof produtos]?.[key as never] ?? produtos.fallback;
};

// Helper function to get a product image by folder and image name
export const getProductImage = (folder: string, imageName: string) => {
  const cleanName = imageName.replace(/\.(jpg|png)$/i, '');
  const key = `${folder}_${cleanName}`;
  return produtos[folder as keyof typeof produtos]?.[key as never] ?? produtos.fallback;
};
