import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LightboxGallery } from '@/components/lightbox-gallery';
import { Reveal } from '@/components/reveal';
import { SchemaScript } from '@/components/schema-script';
import { StickyCartBar } from '@/components/sticky-cart-bar';
import { getCollectionBySlug, getCollections } from '@/lib/catalog';
import { buildPageMetadata } from '@/lib/metadata';
import { getCollectionProductSchema, getLocalBusinessSchema } from '@/lib/schema';

export const revalidate = 3600;

export async function generateStaticParams() {
  const collections = await getCollections();

  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return buildPageMetadata({
      title: 'Collection introuvable',
      description: 'La collection demandee est introuvable.',
      pathname: `/collections/${slug}`,
    });
  }

  return buildPageMetadata({
    title: `${collection.name} - collection`,
    description: `Decouvrez la collection ${collection.name} de Heritage Dresses by Hady et contactez-nous pour commander.`,
    pathname: `/collections/${collection.slug}`,
    images: collection.coverImage ? [collection.coverImage.src] : ['/icon.svg'],
    keywords: [
      `collection ${collection.name}`,
      `robe africaine ${collection.name}`,
      `tenue africaine ${collection.name} France`,
    ],
  });
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const robes = collection.products.filter((product) => product.kind === 'robe');
  const ensembles = collection.products.filter((product) => product.kind === 'ensemble');
  const hasSeparatedSections = robes.length > 0 && ensembles.length > 0;

  return (
    <>
      <SchemaScript
        id={`collection-local-business-${collection.slug}`}
        schema={getLocalBusinessSchema(collection.coverImage?.src)}
      />
      <SchemaScript
        id={`collection-product-${collection.slug}`}
        schema={getCollectionProductSchema(collection)}
      />

      <section className="relative min-h-[70vh] overflow-hidden bg-noir text-ivory">
        {collection.coverImage ? (
          <Image
            src={collection.coverImage.src}
            alt={collection.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="image-treatment object-cover opacity-75"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/30 via-noir/40 to-noir/90" />

        <div className="container-shell relative z-10 flex min-h-[70vh] flex-col pt-36 pb-14 sm:pt-40">
          <Link
            href="/collections"
            className="mono-label link-underline text-ivory/80 hover:text-ivory"
          >
            ← Collections
          </Link>

          <Reveal className="mt-auto pt-20">
            <h1 className="font-display font-light leading-[0.85] tracking-editorial-tight text-[4rem] sm:text-[6.5rem] lg:text-[9rem]">
              {collection.name}
            </h1>

            <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
              <p className="max-w-2xl text-[1rem] leading-[1.75] text-ivory/80 lg:col-span-8">
                {collection.description}
              </p>
              <div className="flex flex-wrap items-end gap-8 lg:col-span-4 lg:justify-end">
                <div>
                  <span className="mono-tag text-ivory/55">Pièces</span>
                  <p className="mt-1 font-display text-2xl font-light tracking-editorial text-ivory">
                    {collection.products.length.toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space pb-32 md:pb-36">
        <div className="container-shell">
          {hasSeparatedSections ? (
            <div className="space-y-20">
              <Reveal>
                <div className="flex items-baseline gap-6 border-b border-ink/15 pb-8">
                  <h2 className="font-display text-[2.5rem] font-light leading-none tracking-editorial text-ink sm:text-[3.5rem]">
                    Robes
                  </h2>
                  <span className="mono-tag text-ink/45">
                    {robes.length.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-12">
                  <LightboxGallery
                    products={robes}
                    columnsClassName="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    priorityCount={4}
                  />
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="flex items-baseline gap-6 border-b border-ink/15 pb-8">
                  <h2 className="font-display text-[2.5rem] italic font-light leading-none tracking-editorial text-ink sm:text-[3.5rem]">
                    Ensembles
                  </h2>
                  <span className="mono-tag text-ink/45">
                    {ensembles.length.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-12">
                  <LightboxGallery
                    products={ensembles}
                    columnsClassName="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    priorityCount={2}
                  />
                </div>
              </Reveal>
            </div>
          ) : (
            <Reveal>
              <LightboxGallery
                products={collection.products}
                columnsClassName="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                priorityCount={6}
              />
            </Reveal>
          )}
        </div>
      </section>

      <StickyCartBar collectionName={collection.name} />
    </>
  );
}
