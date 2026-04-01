/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-d50114600aa44bf0a236f33f64195f03.r2.dev';
const USE_R2 = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

/**
 * Fallback: Retorna URLs de imagens do R2 quando Supabase está bloqueado
 */
function getR2ImageFallback(page: string): { [key: string]: string } {
  console.warn(`[Image Loader] Using R2 fallback for page "${page}"`);

  // Mapeamento básico de imagens conhecidas
  const commonImages: { [key: string]: string } = {
    'banner1': `${R2_PUBLIC_URL}/images/banner_01.jpeg`,
    'banner2': `${R2_PUBLIC_URL}/images/banner_02.jpeg`,
    'carousel1': `${R2_PUBLIC_URL}/images/carousel-image.jpeg`,
    'carousel2': `${R2_PUBLIC_URL}/images/carousel-image2.jpeg`,
    'carousel3': `${R2_PUBLIC_URL}/images/carousel-image3.jpeg`,
    'carousel4': `${R2_PUBLIC_URL}/images/carousel-image4.jpeg`,
    'about': `${R2_PUBLIC_URL}/images/about.jpeg`,
    'mission': `${R2_PUBLIC_URL}/images/mission-bg2.jpeg`,
    'who-we-are': `${R2_PUBLIC_URL}/images/who-we-are.jpeg`,
  };

  return commonImages;
}

/**
 * Carrega e valida URLs de imagens
 * Usa R2 como fallback quando Supabase está bloqueado
 */
export async function loadPageImages(page: string) {
  // Se R2 está ativado, usar diretamente
  if (USE_R2) {
    return getR2ImageFallback(page);
  }

  try {
    const { data, error } = await supabase
      .from("page_images")
      .select("*")
      .eq("page", page)
      .order("position");

    // Se erro 402 (Supabase bloqueado), usar R2
    if (error && (error as any).code === '402') {
      console.warn(`[Image Loader] Supabase blocked (402), using R2 fallback`);
      return getR2ImageFallback(page);
    }

    if (error) {
      console.error(`[Image Loader] Error loading images for page "${page}":`, error);
      // Qualquer erro: usar R2 como fallback
      return getR2ImageFallback(page);
    }

    if (!data || data.length === 0) {
      console.warn(`[Image Loader] No images found for page "${page}", using R2 fallback`);
      return getR2ImageFallback(page);
    }

    const imageMap: { [key: string]: string } = {};

    data.forEach((img: any) => {
      const url = img.image_url;

      if (!url || url.trim() === '') {
        return;
      }

      imageMap[img.key] = url;
    });

    console.log(`[Image Loader] Successfully loaded ${Object.keys(imageMap).length} images for page "${page}"`);
    return imageMap;

  } catch (error) {
    console.error(`[Image Loader] Fatal error loading images for page "${page}":`, error);
    return getR2ImageFallback(page);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fixSupabaseUrl(url: string, _key: string): string | null {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      console.error('[Image Loader] NEXT_PUBLIC_SUPABASE_URL not defined');
      return null;
    }

    // Se a URL já é válida, retornar
    if (url.startsWith('https://') && url.includes('supabase.co')) {
      return url;
    }

    // Extrair o path do arquivo
    let filePath = url;

    // Remover prefixos inválidos
    if (url.includes('/storage/v1/object/public/')) {
      filePath = url.split('/storage/v1/object/public/')[1];
    }

    // Reconstruir URL correta
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;

  } catch (error) {
    console.error('[Image Loader] Error fixing URL:', error);
    return null;
  }
}

/**
 * Valida se uma URL de imagem está acessível
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('[Image Loader] Error validating URL:', url, error);
    return false;
  }
}

/**
 * Log de debug para URLs de imagens
 */
export function debugImageUrls(imageMap: { [key: string]: string }, page: string) {
  console.group(`[Image URLs Debug] Page: ${page}`);
  Object.entries(imageMap).forEach(([key, url]) => {
    const isValid = /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(url);
    console.log(`${isValid ? '✅' : '❌'} ${key}:`, url);
  });
  console.groupEnd();
}
