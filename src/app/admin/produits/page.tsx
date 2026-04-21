import Image from 'next/image';

import { db, productOverrides } from '@/db';
import { getCollections } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';
import { ProductRowControls } from './_components/product-row-controls';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [collections, overrideRows] = await Promise.all([
    getCollections(),
    db.select().from(productOverrides),
  ]);

  const overridesByRef = new Map(overrideRows.map((row) => [row.reference, row]));
  const allProducts = collections.flatMap((collection) => collection.products);
  const totalAvailable = allProducts.filter(
    (p) => overridesByRef.get(p.reference)?.available !== false,
  ).length;

  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-6">
        <div>
          <span className="mono-label text-terracotta">Produits</span>
          <h1 className="mt-3 font-display text-[2.25rem] font-light leading-none tracking-editorial text-ink sm:text-[2.75rem]">
            {allProducts.length.toString().padStart(2, '0')} pièces
          </h1>
          <p className="mono-tag mt-2 text-ink/50">
            {totalAvailable.toString().padStart(2, '0')} disponibles ·{' '}
            {(allProducts.length - totalAvailable).toString().padStart(2, '0')} en rupture
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {collections.map((collection) => (
          <section key={collection.slug}>
            <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 pb-4">
              <h2 className="font-display text-[1.75rem] font-light leading-none tracking-editorial text-ink">
                {collection.name}
              </h2>
              <span className="mono-tag text-ink/45">
                {collection.products.length.toString().padStart(2, '0')} pièces
              </span>
            </div>

            <ul className="mt-4 divide-y divide-ink/10 border border-ink/15 bg-white">
              {collection.products.map((product) => {
                const override = overridesByRef.get(product.reference);
                const displayPrice = override?.price ?? product.price;
                const available = override?.available ?? true;

                return (
                  <li
                    key={product.reference}
                    className="grid grid-cols-[72px_1fr_auto] items-center gap-5 px-4 py-4 sm:grid-cols-[80px_1fr_160px_180px] sm:gap-6"
                  >
                    <div className="relative h-24 w-[72px] shrink-0 overflow-hidden bg-bone sm:w-20">
                      <Image
                        src={product.coverImage.src}
                        alt={product.coverImage.alt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="mono-tag text-ink/45">{product.reference}</p>
                      <p className="mt-1 font-display text-lg font-light leading-tight tracking-editorial text-ink">
                        {product.productName}
                      </p>
                      <p className="mono-tag mt-1 text-ink/50">
                        {product.kind === 'robe' ? 'Robe' : product.kind === 'ensemble' ? 'Ensemble' : 'Pièce'}
                        {override?.price != null ? ' · prix modifié' : ''}
                      </p>
                    </div>
                    <div className="font-display text-lg text-ink whitespace-nowrap text-right sm:text-left">
                      {formatPrice(displayPrice)}
                    </div>
                    <ProductRowControls
                      reference={product.reference}
                      collectionSlug={collection.slug}
                      defaultPrice={product.price}
                      currentPrice={displayPrice}
                      available={available}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
