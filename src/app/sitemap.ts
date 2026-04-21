import type { MetadataRoute } from 'next';

import { getCollections } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getCollections();
  const collectionEntries: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: absoluteUrl(`/collections/${collection.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
    images: collection.coverImage ? [absoluteUrl(collection.coverImage.src)] : undefined,
  }));

  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/collections'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    ...collectionEntries,
  ];
}
