import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

type MetadataInput = {
  title: string;
  description: string;
  pathname: string;
  images?: string[];
  keywords?: string[];
};

export function buildPageMetadata({
  title,
  description,
  pathname,
  images = ['/icon.svg'],
  keywords = [],
}: MetadataInput): Metadata {
  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: siteConfig.name,
      locale: 'fr_FR',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}
