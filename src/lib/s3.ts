import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
}

/**
 * Sube un archivo a S3
 * @param file - El archivo a subir (Buffer o Uint8Array)
 * @param filename - Nombre del archivo
 * @param folder - Carpeta donde guardar (planta, contabilidad, aguas, ambiental-acopio)
 * @param contentType - Tipo MIME del archivo
 */
export async function uploadToS3(
  file: Buffer | Uint8Array,
  filename: string,
  folder: string,
  contentType: string
): Promise<UploadResult> {
  // Generar nombre único con timestamp
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${timestamp}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // URL pública del archivo
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    url,
    key,
    filename: sanitizedFilename,
  };
}

export { s3Client, BUCKET_NAME };
