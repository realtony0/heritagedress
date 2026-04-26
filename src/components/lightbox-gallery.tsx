'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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

export function LightboxGallery({
  products,
  columnsClassName = 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
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

      <div className={cn('grid gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-14', columnsClassName)}>
        {filteredProducts.map((product, index) => (
          <article key={product.id} className="group flex flex-col">
            <button
              type="button"
              onClick={() => {
                setActiveProductId(product.id);
                setActiveImageIndex(0);
              }}
              className="relative block aspect-[3/4] w-full overflow-hidden bg-bone text-left"
              aria-label={`Voir ${product.productName}`}
            >
              <Image
                src={product.coverImage.src}
                alt={product.coverImage.alt}
                fill
                priority={index < priorityCount}
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="image-treatment object-cover"
              />
            </button>

            <div className="flex items-start justify-between gap-4 pt-4">
              <h3 className="font-display text-[1.4rem] font-light leading-tight tracking-editorial text-ink sm:text-[1.6rem]">
                {product.productName}
              </h3>
              <span className="whitespace-nowrap pt-1 font-display text-lg text-ink">
                {formatPrice(product.price)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => addItem(product)}
              className="mono-label mt-3 flex items-center justify-between border-b border-ink/25 pb-2 text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              <span>Ajouter au panier</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {activeProduct && currentImage ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-noir/95 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProductId(null)}
          >
            <button
              type="button"
              onClick={() => setActiveProductId(null)}
              className="absolute right-4 top-4 border border-ivory/20 p-3 text-ivory transition hover:border-ivory"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

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
                  aria-label="Vue précédente"
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
              className="relative flex w-full max-w-[420px] flex-col sm:max-w-[500px] md:max-w-[640px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
                  <h3 className="font-display text-[1.85rem] font-light leading-none tracking-editorial">
                    {activeProduct.productName}
                  </h3>
                  <span className="whitespace-nowrap font-display text-2xl">
                    {formatPrice(activeProduct.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addItem(activeProduct);
                    setActiveProductId(null);
                  }}
                  className="btn-editorial btn-solid w-full"
                >
                  Ajouter au panier →
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
