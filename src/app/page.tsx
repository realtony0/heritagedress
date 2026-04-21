import Image from 'next/image';
import Link from 'next/link';

import { CollectionCard } from '@/components/collection-card';
import { Reveal, Stagger, StaggerItem } from '@/components/reveal';
import { SchemaScript } from '@/components/schema-script';
import { getCollections, getHeroImage } from '@/lib/catalog';
import { buildPageMetadata } from '@/lib/metadata';
import { getLocalBusinessSchema } from '@/lib/schema';

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: 'Robes et ensembles africains en France',
  description:
    'Heritage Dresses by Hady — pieces exclusives de robes et ensembles africains. Tissus premium, petites series, livraison en France.',
  pathname: '/',
  keywords: ['robe africaine France', 'tenue africaine femme France', 'mode africaine premium'],
});

export default async function HomePage() {
  const collections = await getCollections();
  const heroImage = getHeroImage(collections);

  return (
    <>
      <SchemaScript id="home-local-business" schema={getLocalBusinessSchema(heroImage?.src)} />

      <section className="relative min-h-[100svh] overflow-hidden bg-noir text-ivory">
        {heroImage ? (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="image-treatment object-cover opacity-75"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/50 to-noir/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-noir/25 to-noir/35" />

        <div className="container-shell relative z-10 flex min-h-[100svh] flex-col justify-end pt-36 pb-16 sm:pt-44 lg:pb-20">
          <Reveal>
            <h1 className="font-display font-light leading-[0.84] tracking-editorial-tight">
              <span className="block text-[3.25rem] sm:text-[4.75rem] lg:text-[7.5rem]">
                L’élégance
              </span>
              <span className="block text-[3.25rem] italic text-sand sm:text-[4.75rem] lg:text-[7.5rem]">
                africaine,
              </span>
              <span className="block text-[3.25rem] sm:text-[4.75rem] lg:text-[7.5rem]">
                magnifiée.
              </span>
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="#collections" className="btn-editorial btn-light-solid">
                Voir les collections
              </Link>
              <Link href="/contact" className="btn-editorial btn-light">
                Nous contacter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="collections" className="section-space">
        <div className="container-shell">
          <Reveal>
            <div className="flex items-end justify-between gap-8 border-b border-ink/15 pb-8">
              <h2 className="font-display text-[2.5rem] font-light leading-none tracking-editorial text-ink sm:text-[3.5rem]">
                Collections
              </h2>
              <span className="mono-tag text-ink/50">
                {collections.length.toString().padStart(2, '0')} collections
              </span>
            </div>
          </Reveal>

          <Stagger className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <StaggerItem
                key={collection.slug}
                className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
              >
                <CollectionCard
                  collection={collection}
                  index={index + 1}
                  layout={index === 0 ? 'wide' : 'standard'}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-ink/15 bg-bone py-20 sm:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[2.25rem] font-light leading-[0.95] tracking-editorial text-balance text-ink sm:text-[3rem] lg:text-[3.5rem]">
              Une question,
              <em className="italic"> une pièce en tête ?</em>
            </h2>
          </div>
          <div className="flex lg:col-span-5 lg:justify-end">
            <Link href="/contact" className="btn-editorial btn-solid">
              Nous écrire →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
