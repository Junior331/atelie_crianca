/**
 * Helpers para upload de arquivos
 * Suporta tanto Supabase quanto Cloudflare R2
 */

import { supabase } from '@/lib/supabase';
import { uploadToR2 } from '@/lib/r2-client';

const USE_R2 = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

/**
 * Upload de arquivo para o storage (R2 ou Supabase)
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string; path: string; error?: string }> {
  try {
    if (USE_R2) {
      // Upload para R2
      const fullPath = `${bucket}/${path}`;
      const url = await uploadToR2(file, fullPath, file.type);

      return {
        url,
        path: fullPath,
      };
    } else {
      // Upload para Supabase (fallback)
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (uploadError) {
        return {
          url: '',
          path: '',
          error: uploadError.message,
        };
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      return {
        url: data.publicUrl,
        path,
      };
    }
  } catch (error) {
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Gera um nome único para o arquivo
 */
export function generateFileName(originalName: string): string {
  const fileExt = originalName.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  return `${timestamp}-${random}.${fileExt}`;
}

/**
 * Valida o tipo de arquivo
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const baseType = type.replace('/*', '');
      return file.type.startsWith(baseType);
    }
    return file.type === type;
  });
}

/**
 * Valida o tamanho do arquivo (em MB)
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Tipos de imagem permitidos
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/**
 * Tamanho máximo padrão (5MB)
 */
export const MAX_FILE_SIZE_MB = 5;
