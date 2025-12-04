import { supabase } from '@/lib/supabase';

/**
 * Garante que a URL do storage seja válida e pública
 * Supabase storage público usa o formato:
 * https://[PROJECT_REF].supabase.co/storage/v1/object/public/[BUCKET]/[PATH]
 */
export function getPublicStorageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Valida se uma URL é do formato correto do Supabase Storage
 */
export function isValidStorageUrl(url: string): boolean {
  if (!url) return false;

  const supabasePattern = /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\//;
  return supabasePattern.test(url);
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
