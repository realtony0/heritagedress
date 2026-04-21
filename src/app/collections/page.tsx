import Image from 'next/image';
import Link from 'next/link';

import { Reveal, Stagger, StaggerItem } from '@/components/reveal';
import { SchemaScript } from '@/components/schema-script';
import { DEFAULT_PRICE } from '@/config/site';
import { getCollections } from '@/lib/catalog';
import { buildPageMetadata } from '@/lib/metadata';
import { getLocalBusinessSchema } from '@/lib/schema';
import { formatCollectionPath, formatPrice } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata() {
  const collections = await getCollections();

  return buildPageMetadata({
    title: 'Toutes les collections',
    description:
      'Retrouvez les collections Heritage Dresses by Hady et decouvrez les pieces disponibles.',
    pathname: '/collections',
    images: collections
      .map((collection) => collection.coverImage?.src)
      .filter((image): image is string => Boolean(image))
      .slice(0, 4),
  });
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <SchemaScript
        id="collections-local-business"
        schema={getLocalBusinessSchema(collections[0]?.coverImage?.src)}
      />

      <section className="border-b border-ink/15 pt-36 pb-12 sm:pt-40 lg:pt-44">
        <div className="container-shell">
          <Reveal>
            <div className="flex items-end justify-between gap-8">
              <h1 className="font-display text-[3rem] font-light leading-[0.9] tracking-editorial-tight text-ink sm:text-[4.5rem] lg:text-[6rem]">
                Collections
              </h1>
              <span className="mono-tag pb-4 text-ink/50">
                {collections.length.toString().padStart(2, '0')} collections
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <Stagger className="flex flex-col">
            {collections.map((collection, index) => {
              const isEven = index % 2 === 0;

              return (
                <StaggerItem key={collection.slug}>
                  <Link
                    href={formatCollectionPath(collection.slug)}
                    className="group block border-b border-ink/15 py-10 first:border-t sm:py-14 lg:py-16"
                  >
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                      <div
                        className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-bone">
                          {collection.coverImage ? (
                            <Image
                              src={collection.coverImage.src}
                              alt={collection.coverImage.alt}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="image-treatment object-cover"
                            />
                          ) : null}
                          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                            <span className="mono-tag bg-ivory/92 px-2.5 py-1 text-ink">
                              N° {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="mono-tag bg-noir/60 px-2.5 py-1 text-ivory backdrop-blur-sm">
                              {collection.products.length} pièces
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`flex flex-col lg:col-span-6 ${
                          isEven ? 'lg:order-2 lg:pl-16' : 'lg:order-1 lg:pr-16'
                        }`}
                      >
                        <h2 className="font-display text-[3.5rem] font-light leading-[0.88] tracking-editorial-tight text-ink sm:text-[5rem] lg:text-[6rem]">
                          {collection.name}
                        </h2>
                        <p className="mt-8 max-w-md text-[1.02rem] leading-[1.8] text-ink/70">
                          {collection.description}
                        </p>
                        <div className="mt-10 flex items-end justify-between gap-6 border-t border-ink/15 pt-6">
                          <div>
                            <span className="mono-tag text-ink/45">Dès</span>
                            <p className="mt-1 font-display text-2xl font-light text-ink">
                              {formatPrice(DEFAULT_PRICE)}
                            </p>
                          </div>
                          <span className="mono-label text-ink transition-colors group-hover:text-terracotta">
                            Voir la collection →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
