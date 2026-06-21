import { supabase } from '@/lib/supabase';
import { getPublicUrl as getR2PublicUrl, deleteFromR2 } from '@/lib/r2-client';

/**
 * Garante que a URL do storage seja válida e pública
 * Agora usa Cloudflare R2 ao invés de Supabase Storage
 */
export function getPublicStorageUrl(bucket: string, path: string): string {
  // Se estiver migrando, ainda suporta Supabase
  const useR2 = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

  if (useR2) {
    // R2 usa path direto sem bucket separado
    const fullPath = bucket ? `${bucket}/${path}` : path;
    return getR2PublicUrl(fullPath);
  }

  // Fallback para Supabase durante migração
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Valida se uma URL é do formato correto do Storage (Supabase ou R2)
 */
export function isValidStorageUrl(url: string): boolean {
  if (!url) return false;

  const supabasePattern = /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\//;
  const r2Pattern = /^https:\/\/[a-z0-9-]+\.r2\.dev\//;
  const customDomainPattern = process.env.R2_PUBLIC_URL
    ? new RegExp(`^${process.env.R2_PUBLIC_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
    : null;

  return supabasePattern.test(url) ||
         r2Pattern.test(url) ||
         (customDomainPattern ? customDomainPattern.test(url) : false);
}

/**
 * Extrai o path do arquivo de uma URL do storage
 */
export function getPathFromStorageUrl(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Debug helper - loga informações sobre a URL do storage
 */
export function debugStorageUrl(url: string, context?: string): void {
  console.log(`[Storage URL Debug${context ? ` - ${context}` : ''}]`, {
    url,
    isValid: isValidStorageUrl(url),
    path: getPathFromStorageUrl(url),
  });
}

/**
 * Extrai o path do storage a partir de uma URL
 * Funciona tanto para Supabase quanto R2
 */
export function extractStoragePath(imageUrl: string, folder: string): string {
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  return `images/${folder}/${filename}`;
}

/**
 * Deleta uma imagem do storage (R2 ou Supabase)
 * Usa feature flag para determinar qual storage usar
 */
export async function deleteImageFromStorage(imageUrl: string, folder: string): Promise<void> {
  const useR2 = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

  if (useR2) {
    // Deletar do R2
    const path = extractStoragePath(imageUrl, folder);
    await deleteFromR2(path);
  } else {
    // Deletar do Supabase
    if (imageUrl.includes(`/${folder}/`)) {
      const path = imageUrl.split(`/${folder}/`)[1];
      await supabase.storage.from("images").remove([`${folder}/${path}`]);
    }
  }
}
