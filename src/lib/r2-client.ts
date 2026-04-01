import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuração do cliente R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!; // URL pública do domínio customizado ou R2.dev

/**
 * Faz upload de um arquivo para o R2
 */
export async function uploadToR2(
  file: File | Buffer,
  path: string,
  contentType?: string
): Promise<string> {
  const buffer = file instanceof File ? await file.arrayBuffer() : file;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: Buffer.from(buffer),
    ContentType: contentType || (file instanceof File ? file.type : 'application/octet-stream'),
  });

  await r2Client.send(command);

  return getPublicUrl(path);
}

/**
 * Retorna a URL pública de um arquivo no R2
 */
export function getPublicUrl(path: string): string {
  // Remove barra inicial se existir
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${PUBLIC_URL}/${cleanPath}`;
}

/**
 * Deleta um arquivo do R2
 */
export async function deleteFromR2(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await r2Client.send(command);
}

/**
 * Gera URL assinada temporária (útil para arquivos privados)
 */
export async function getSignedUrlR2(path: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Lista arquivos em um diretório específico do R2
 */
export async function listFilesR2(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await r2Client.send(command);
  return response.Contents?.map((item) => item.Key!) || [];
}

/**
 * Copia arquivo do Supabase para R2
 */
export async function copyFromSupabaseToR2(
  supabaseUrl: string,
  r2Path: string
): Promise<string> {
  try {
    // Faz download do arquivo do Supabase
    const response = await fetch(supabaseUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from Supabase: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Upload para R2
    return await uploadToR2(Buffer.from(buffer), r2Path, contentType);
  } catch (error) {
    console.error('Error copying from Supabase to R2:', error);
    throw error;
  }
}

export { r2Client };
