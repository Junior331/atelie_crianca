/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

/**
 * Carrega e valida URLs de imagens do Supabase Storage
 * Trata erros e fornece fallback automático
 */
export async function loadPageImages(page: string) {
  try {
    const { data, error } = await supabase
      .from("page_images")
      .select("*")
      .eq("page", page)
      .order("position");

    if (error) {
      console.error(`[Image Loader] Error loading images for page "${page}":`, error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`[Image Loader] No images found for page "${page}"`);
      return {};
    }

    const imageMap: { [key: string]: string } = {};

    data.forEach((img: any) => {
      const url = img.image_url;

      // Validar URL
      if (!url || url.trim() === '') {
        console.warn(`[Image Loader] Empty URL for key "${img.key}"`);
        return;
      }

      // Verificar se é uma URL válida do Supabase
      const isValidSupabaseUrl = /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(url);

      if (!isValidSupabaseUrl) {
        console.warn(`[Image Loader] Invalid Supabase URL for key "${img.key}":`, url);
        // Tentar reconstruir a URL correta
        const fixedUrl = fixSupabaseUrl(url, img.key);
        if (fixedUrl) {
          imageMap[img.key] = fixedUrl;
          console.log(`[Image Loader] Fixed URL for key "${img.key}":`, fixedUrl);
        }
        return;
      }

      imageMap[img.key] = url;
    });

    console.log(`[Image Loader] Successfully loaded ${Object.keys(imageMap).length} images for page "${page}"`);
    return imageMap;

  } catch (error) {
    console.error(`[Image Loader] Fatal error loading images for page "${page}":`, error);
    return {};
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
