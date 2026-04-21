import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { siteConfig } from '@/config/site';

export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET(
  _: Request,
  { params }: { params: { segments: string[] } },
) {
  const { segments } = params;

  if (!segments || segments.length < 2) {
    return new Response('Missing image path.', { status: 400 });
  }

  const decodedSegments = segments.map((segment) => decodeURIComponent(segment));
  const [rawCollectionSlug, ...fileSegments] = decodedSegments;
  const collectionSlug = rawCollectionSlug.toLowerCase();

  if (!siteConfig.collections.some((collection) => collection.slug.toLowerCase() === collectionSlug)) {
    return new Response('Unknown collection.', { status: 404 });
  }

  const collectionDirectory = path.join(process.cwd(), collectionSlug);
  const resolvedPath = path.resolve(collectionDirectory, ...fileSegments);
  const safePrefix = `${collectionDirectory}${path.sep}`;

  if (!resolvedPath.startsWith(safePrefix)) {
    return new Response('Invalid path.', { status: 403 });
  }

  const extension = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[extension];

  if (!contentType) {
    return new Response('Unsupported file.', { status: 404 });
  }

  try {
    const buffer = await readFile(resolvedPath);

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Image not found.', { status: 404 });
  }
}
