import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_PRICE } from '@/config/site';
import type { CatalogCollection } from '@/lib/catalog';
import { cn, formatCollectionPath, formatPrice } from '@/lib/utils';

type CollectionCardProps = {
  collection: CatalogCollection;
  index?: number;
  layout?: 'standard' | 'wide' | 'tall';
  className?: string;
};

export function CollectionCard({
  collection,
  index,
  layout = 'standard',
  className,
}: CollectionCardProps) {
  const aspectClass =
    layout === 'wide'
      ? 'aspect-[4/5] sm:aspect-[5/6]'
      : layout === 'tall'
        ? 'aspect-[3/4]'
        : 'aspect-[3/4]';

  return (
    <Link
      href={formatCollectionPath(collection.slug)}
      className={cn('group block', className)}
    >
      <article className="flex flex-col">
        <div className={cn('relative overflow-hidden bg-bone', aspectClass)}>
          {collection.coverImage ? (
            <Image
              src={collection.coverImage.src}
              alt={collection.coverImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="image-treatment object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-noir/55 via-noir/5 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
            {typeof index === 'number' ? (
              <span className="mono-tag text-ivory/90">
                N° {index.toString().padStart(2, '0')}
              </span>
            ) : (
              <span />
            )}
            <span className="mono-tag text-ivory/90">
              {collection.products.length.toString().padStart(2, '0')} pièces
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <h3 className="font-display text-[2.75rem] font-light leading-[0.92] tracking-editorial-tight text-ivory sm:text-[3.5rem]">
              {collection.name}
            </h3>
          </div>
        </div>

        <div className="flex items-start justify-between gap-6 pt-5">
          <p className="max-w-[22rem] text-[0.95rem] leading-[1.65] text-ink/70">
            {collection.shortDescription}
          </p>
          <div className="flex flex-col items-end text-right">
            <span className="mono-tag text-ink/45">Dès</span>
            <span className="mt-1 font-display text-xl text-ink">
              {formatPrice(DEFAULT_PRICE)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="editorial-rule flex-1" />
          <span className="mono-label text-ink/70 transition-colors group-hover:text-terracotta">
            Voir la collection →
          </span>
        </div>
      </article>
    </Link>
  );
}
