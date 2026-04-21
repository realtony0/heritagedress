import type { CatalogCollection } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export function getLocalBusinessSchema(image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: siteConfig.countryCode,
      addressLocality: siteConfig.location,
    },
    areaServed: siteConfig.location,
    image: image ? [absoluteUrl(image)] : undefined,
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.snapchat,
      siteConfig.social.whatsapp,
    ],
  };
}

export function getCollectionProductSchema(collection: CatalogCollection) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${collection.name} | ${siteConfig.name}`,
    description: collection.description,
    url: absoluteUrl(`/collections/${collection.slug}`),
    numberOfItems: collection.products.length,
    itemListElement: collection.products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.productName,
        sku: product.reference,
        category:
          product.kind === 'ensemble'
            ? 'Ensemble africain femme'
            : product.kind === 'robe'
              ? 'Robe africaine femme'
              : 'Tenue africaine femme',
        image: product.images.map((image) => absoluteUrl(image.src)),
        url: absoluteUrl(`/collections/${collection.slug}`),
        brand: {
          '@type': 'Brand',
          name: siteConfig.name,
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl(`/collections/${collection.slug}`),
          seller: {
            '@type': 'Organization',
            name: siteConfig.name,
          },
          areaServed: siteConfig.location,
          eligibleRegion: siteConfig.countryCode,
        },
      },
    })),
  };
}
