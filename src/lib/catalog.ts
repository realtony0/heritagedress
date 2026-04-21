import { readdir } from 'node:fs/promises';
import path from 'node:path';

import type { ProductConfig, ProductKind } from '@/config/site';
import { collectionSlugMap, DEFAULT_PRICE, siteConfig } from '@/config/site';
import { hashString } from '@/lib/utils';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ROOT_DIR = process.cwd();

export type CatalogImage = {
  id: string;
  src: string;
  alt: string;
  filename: string;
  collectionName: string;
  collectionSlug: string;
  order: number;
};

export type CatalogProduct = {
  id: string;
  reference: string;
  productName: string;
  collectionName: string;
  collectionSlug: string;
  kind?: ProductKind;
  price: number;
  available: boolean;
  src: string;
  alt: string;
  coverImage: CatalogImage;
  images: CatalogImage[];
  productIndex: number;
};

type ProductOverride = {
  reference: string;
  price: number | null;
  available: boolean;
};

export type CatalogCollection = {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  coverImage?: CatalogImage;
  images: CatalogImage[];
  products: CatalogProduct[];
};

function isImageFile(fileName: string) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function encodeMediaPath(collectionSlug: string, fileName: string) {
  return `/api/media/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(fileName)}`;
}

function buildStableReference(collectionSlug: string, value: string) {
  const shortHash = hashString(`${collectionSlug}/${value}`)
    .toString(36)
    .toUpperCase()
    .padStart(5, '0')
    .slice(0, 5);

  return `${collectionSlug.toUpperCase()}-${shortHash}`;
}

function buildDefaultProductName(kind: ProductKind | undefined, position: number) {
  const formattedIndex = String(position).padStart(2, '0');

  if (kind === 'robe') {
    return `Robe ${formattedIndex}`;
  }

  if (kind === 'ensemble') {
    return `Ensemble ${formattedIndex}`;
  }

  return `Modele ${formattedIndex}`;
}

function buildProducts(
  collectionSlug: string,
  collectionName: string,
  images: CatalogImage[],
  overrides: Map<string, ProductOverride>,
) {
  const collectionConfig = collectionSlugMap.get(collectionSlug);
  const kindCounters: Record<ProductKind, number> = {
    robe: 0,
    ensemble: 0,
  };
  let modelCounter = 0;

  return images.map((image) => {
    const curatedProduct = collectionConfig?.products?.find(
      (product) => product.order === image.order,
    ) as ProductConfig | undefined;
    const kind = curatedProduct?.kind;

    let titleIndex = 0;

    if (kind) {
      kindCounters[kind] += 1;
      titleIndex = kindCounters[kind];
    } else {
      modelCounter += 1;
      titleIndex = modelCounter;
    }

    const productName = curatedProduct?.title ?? buildDefaultProductName(kind, titleIndex);
    const alt = `${productName} de la collection ${collectionName} | Heritage Dresses by Hady`;
    const coverImage = {
      ...image,
      alt,
    };
    const reference = buildStableReference(collectionSlug, image.filename);
    const override = overrides.get(reference);
    const basePrice = curatedProduct?.price ?? DEFAULT_PRICE;

    return {
      id: reference.toLowerCase(),
      reference,
      productName,
      collectionName,
      collectionSlug,
      kind,
      price: override?.price ?? basePrice,
      available: override?.available ?? true,
      src: coverImage.src,
      alt: coverImage.alt,
      coverImage,
      images: [coverImage],
      productIndex: image.order,
    };
  });
}

async function loadOverrides(): Promise<Map<string, ProductOverride>> {
  try {
    const { db, productOverrides } = await import('@/db');
    const rows = await db.select().from(productOverrides);
    return new Map(
      rows.map((row) => [row.reference, { reference: row.reference, price: row.price, available: row.available }]),
    );
  } catch (error) {
    console.warn('[catalog] Unable to load product overrides:', error);
    return new Map();
  }
}

async function readCollectionImages(collectionSlug: string, collectionName: string) {
  const directoryPath = path.join(ROOT_DIR, collectionSlug);

  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && isImageFile(entry.name))
      .sort((left, right) =>
        left.name.localeCompare(right.name, 'fr', {
          numeric: true,
          sensitivity: 'base',
        }),
      )
      .map((entry, index) => {
        const stableReference = buildStableReference(collectionSlug, entry.name);

        return {
          id: stableReference.toLowerCase(),
          src: encodeMediaPath(collectionSlug, entry.name),
          alt: `${collectionName} | Heritage Dresses by Hady`,
          filename: entry.name,
          collectionName,
          collectionSlug,
          order: index + 1,
        };
      });
  } catch {
    return [];
  }
}

export async function getCollections(): Promise<CatalogCollection[]> {
  const overrides = await loadOverrides();

  const collections = await Promise.all(
    siteConfig.collections.map(async (collectionConfig) => {
      const normalizedSlug = collectionConfig.slug.toLowerCase();
      const resolvedConfig =
        collectionSlugMap.get(normalizedSlug) ?? collectionConfig;
      const images = await readCollectionImages(normalizedSlug, resolvedConfig.name);
      const products = buildProducts(normalizedSlug, resolvedConfig.name, images, overrides);

      return {
        slug: normalizedSlug,
        name: resolvedConfig.name,
        description: resolvedConfig.description,
        shortDescription: resolvedConfig.shortDescription,
        coverImage: products[0]?.coverImage,
        images: products.map((product) => product.coverImage),
        products,
      };
    }),
  );

  return collections.filter((collection) => collection.products.length > 0);
}

export async function getCollectionBySlug(slug: string) {
  const collections = await getCollections();
  return collections.find((collection) => collection.slug === slug.toLowerCase());
}

export function getHeroImage(collections: CatalogCollection[]) {
  return collections.find((collection) => collection.coverImage)?.coverImage;
}

export function getFeaturedProducts(collections: CatalogCollection[], limit = 8) {
  const seed = new Date().toISOString().slice(0, 10);
  const products = collections.flatMap((collection) => collection.products);

  return [...products]
    .sort(
      (left, right) =>
        hashString(`${seed}-${left.id}`) - hashString(`${seed}-${right.id}`),
    )
    .slice(0, Math.min(limit, products.length));
}
