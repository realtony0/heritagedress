import clsx, { type ClassValue } from 'clsx';
import type { CatalogProduct } from '@/lib/catalog';

import { siteConfig } from '@/config/site';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export function buildWhatsAppLink(message: string) {
  return `${siteConfig.social.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildCollectionInquiry(collectionName: string) {
  return buildWhatsAppLink(
    `Bonjour, je souhaiterais en savoir plus sur la collection ${collectionName}. Pouvez-vous me confirmer les disponibilites ?`,
  );
}

export function buildContactInquiry(name: string, email: string, message: string) {
  return buildWhatsAppLink(
    `Bonjour, je vous contacte depuis le site Heritage Dresses by Hady.\n\nNom : ${name}\nEmail : ${email}\n\nMessage : ${message}`,
  );
}

export function buildCartInquiry(
  items: Array<Pick<CatalogProduct, 'productName' | 'reference' | 'collectionName' | 'price'> & { quantity: number }>,
) {
  const lines = items
    .map(
      (item) =>
        `- ${item.collectionName} | ${item.productName} | ${formatPrice(item.price)} x${item.quantity} | Ref. ${item.reference}`,
    )
    .join('\n');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return buildWhatsAppLink(
    `Bonjour, je souhaiterais commander les pieces suivantes :\n\n${lines}\n\nTotal : ${formatPrice(total)}\n\nPouvez-vous me confirmer la disponibilite et la suite ?`,
  );
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatCollectionPath(slug: string) {
  return `/collections/${slug.toLowerCase()}`;
}

export function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}
