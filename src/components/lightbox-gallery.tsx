'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useCart } from '@/components/cart-provider';
import type { CatalogProduct } from '@/lib/catalog';
import { cn, formatPrice } from '@/lib/utils';

type LightboxGalleryProps = {
  products: CatalogProduct[];
  columnsClassName?: string;
  showCollectionName?: boolean;
  priorityCount?: number;
  enableKindFilter?: boolean;
};

function getKindLabel(kind?: CatalogProduct['kind']) {
  if (kind === 'robe') {
    return 'Robe';
  }

  if (kind === 'ensemble') {
    return 'Ensemble';
  }

  return null;
}

export function LightboxGallery({
  products,
  columnsClassName = 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  showCollectionName = false,
  priorityCount = 0,
  enableKindFilter = false,
}: LightboxGalleryProps) {
  const { addItem } = useCart();
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const availableKinds = useMemo(
    () => Array.from(new Set(products.map((product) => product.kind).filter(Boolean))),
    [products],
  );
  const [selectedKind, setSelectedKind] = useState<'all' | 'robe' | 'ensemble'>('all');

  const filteredProducts = useMemo(() => {
    if (!enableKindFilter || selectedKind === 'all') {
      return products;
    }

    return products.filter((product) => product.kind === selectedKind);
  }, [enableKindFilter, products, selectedKind]);

  useEffect(() => {
    setActiveProductId(null);
    setActiveImageIndex(0);
  }, [selectedKind]);

  const activeProduct = filteredProducts.find((product) => product.id === activeProductId) ?? null;
  const currentImage = activeProduct ? activeProduct.images[activeImageIndex] : null;

  useEffect(() => {
    if (!activeProduct) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProductId(null);
      }

      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((currentIndex) =>
          (currentIndex - 1 + activeProduct.images.length) % activeProduct.images.length,
        );
      }

      if (event.key === 'ArrowRight') {
        setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeProduct.images.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProduct]);

  return (
    <>
      {enableKindFilter && availableKinds.length > 1 ? (
        <div className="mb-10 flex flex-wrap items-center gap-6 border-y border-ink/10 py-4">
          <span className="mono-tag text-ink/50">Filtrer</span>
          {[
            { value: 'all', label: 'Tout' },
            { value: 'robe', label: 'Robes' },
            { value: 'ensemble', label: 'Ensembles' },
          ]
            .filter(
              (item) =>
                item.value === 'all' ||
                availableKinds.includes(item.value as 'robe' | 'ensemble'),
            )
            .map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedKind(item.value as 'all' | 'robe' | 'ensemble')}
                className={cn(
                  'mono-label link-underline',
                  selectedKind === item.value
                    ? 'is-active text-terracotta'
                    : 'text-ink/60 hover:text-ink',
                )}
              >
                {item.label}
              </button>
            ))}
        </div>
      ) : null}

      <div className={cn('grid gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16', columnsClassName)}>
        {filteredProducts.map((product, index) => {
          const kindLabel = getKindLabel(product.kind);

          return (
            <article key={product.id} className="group flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setActiveProductId(product.id);
                  setActiveImageIndex(0);
                }}
                className="relative block aspect-[3/4] w-full overflow-hidden bg-bone text-left"
              >
                <Image
                  src={product.coverImage.src}
                  alt={product.coverImage.alt}
                  fill
                  priority={index < priorityCount}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="image-treatment object-cover"
                />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-noir/10" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-ivory/60 bg-noir/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ivory backdrop-blur-sm">
                    Agrandir +
                  </span>
                </div>
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                  {showCollectionName ? (
                    <span className="mono-tag bg-ivory/92 px-2.5 py-1 text-ink">
                      {product.collectionName}
                    </span>
                  ) : (
                    <span />
                  )}
                  {kindLabel ? (
                    <span className="mono-tag bg-noir/70 px-2.5 py-1 text-ivory backdrop-blur-sm">
                      {kindLabel}
                    </span>
                  ) : null}
                </div>
              </button>

              <div className="flex flex-col gap-4 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="mono-tag text-ink/45">
                      {product.reference}
                    </span>
                    <h3 className="mt-1 font-display text-[1.6rem] font-light leading-tight tracking-editorial text-ink sm:text-[1.85rem]">
                      {product.productName}
                    </h3>
                  </div>
                  <div className="whitespace-nowrap pt-1 text-right">
                    <span className="font-display text-xl text-ink">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="mono-label group/btn flex flex-1 items-center justify-between border-b border-ink/30 pb-3 text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Ajouter
                    </span>
                    <span className="transition-transform group-hover/btn:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {activeProduct && currentImage ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-noir/95 px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProductId(null)}
          >
            <button
              type="button"
              onClick={() => setActiveProductId(null)}
              className="absolute right-4 top-4 flex items-center gap-2 border border-ivory/20 px-4 py-3 text-ivory transition hover:border-ivory"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
              <span className="mono-tag">Fermer</span>
            </button>

            <div className="absolute left-4 top-4 mono-tag text-ivory/60">
              {activeProduct.reference}
            </div>

            {activeProduct.images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImageIndex((currentIndex) =>
                      (currentIndex - 1 + activeProduct.images.length) % activeProduct.images.length,
                    );
                  }}
                  className="absolute left-6 top-1/2 hidden -translate-y-1/2 border border-ivory/20 p-4 text-ivory transition hover:border-ivory md:block"
                  aria-label="Vue precedente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImageIndex((currentIndex) => (currentIndex + 1) % activeProduct.images.length);
                  }}
                  className="absolute right-6 top-1/2 hidden -translate-y-1/2 border border-ivory/20 p-4 text-ivory transition hover:border-ivory md:block"
                  aria-label="Vue suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <motion.div
              key={`${activeProduct.id}-${currentImage.id}`}
              className="relative flex w-full max-w-[420px] flex-col sm:max-w-[500px] md:max-w-[680px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-[3/4] w-full bg-noir">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-5 bg-ivory px-6 py-6 text-ink">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="mono-tag text-ink/45">
                      Collection {activeProduct.collectionName}
                      {activeProduct.kind ? ` — ${getKindLabel(activeProduct.kind)}` : ''}
                    </span>
                    <h3 className="mt-2 font-display text-[2.25rem] font-light leading-none tracking-editorial">
                      {activeProduct.productName}
                    </h3>
                  </div>
                  <span className="whitespace-nowrap font-display text-2xl">
                    {formatPrice(activeProduct.price)}
                  </span>
                </div>

                {activeProduct.images.length > 1 ? (
                  <div className="flex items-center gap-3 border-t border-ink/10 pt-4">
                    <span className="mono-tag text-ink/50">
                      {(activeImageIndex + 1).toString().padStart(2, '0')}
                      {' / '}
                      {activeProduct.images.length.toString().padStart(2, '0')}
                    </span>
                    <div className="flex flex-1 flex-wrap gap-2">
                      {activeProduct.images.map((image, imageIndex) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setActiveImageIndex(imageIndex)}
                          className={cn(
                            'h-14 w-12 overflow-hidden border transition',
                            imageIndex === activeImageIndex
                              ? 'border-ink'
                              : 'border-ink/15 hover:border-ink/50',
                          )}
                        >
                          <div className="relative h-full w-full">
                            <Image src={image.src} alt={image.alt} fill sizes="48px" className="object-cover" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => addItem(activeProduct)}
                  className="btn-editorial btn-solid w-full"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Ajouter au panier
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
