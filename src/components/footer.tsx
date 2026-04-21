'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera } from 'lucide-react';

import { siteConfig } from '@/config/site';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden bg-noir text-ivory">
      <div className="container-shell pt-24 pb-10 sm:pt-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="mono-label text-sand">La maison</span>
            <h2 className="mt-5 font-display text-[3rem] font-light leading-[0.95] tracking-editorial-tight sm:text-[4rem] lg:text-[5rem]">
              Heritage
              <br />
              <em className="italic text-sand">Dresses</em>
            </h2>
            <p className="mt-8 max-w-md text-[0.95rem] leading-[1.8] text-ivory/65">
              Créations exclusives, confection artisanale, diffusion
              confidentielle depuis la France. Chaque pièce est numérotée et
              livrée dans son écrin signature.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-editorial btn-light"
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn-editorial btn-light-solid"
              >
                <Camera className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-12 sm:grid-cols-3">
              <div>
                <span className="mono-label text-ivory/50">Navigation</span>
                <ul className="mt-6 space-y-4">
                  {siteConfig.navigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="font-display text-2xl font-light tracking-editorial text-ivory transition-colors hover:text-sand"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="mono-label text-ivory/50">Collections</span>
                <ul className="mt-6 space-y-3">
                  {siteConfig.collections.map((collection) => (
                    <li key={collection.slug}>
                      <Link
                        href={`/collections/${collection.slug}`}
                        className="font-display text-xl font-light tracking-editorial text-ivory/85 transition-colors hover:text-sand"
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="mono-label text-ivory/50">Contact</span>
                <ul className="mt-6 space-y-4 text-[0.95rem] text-ivory/75">
                  <li>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="link-underline hover:text-ivory"
                    >
                      {siteConfig.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline hover:text-ivory"
                    >
                      @{siteConfig.instagram}
                    </a>
                  </li>
                  <li>
                    <a
                      href={siteConfig.social.snapchat}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline hover:text-ivory"
                    >
                      Snapchat · {siteConfig.snapchat}
                    </a>
                  </li>
                  <li className="pt-2">
                    <span className="mono-tag text-ivory/55">
                      {siteConfig.location}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-ivory/15 pt-6">
          <div className="flex flex-col gap-3 text-[11px] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
            <span className="mono-tag">
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
            <span className="mono-tag">
              Créations exclusives · livraison France
            </span>
            <span className="mono-tag">
              Édition Printemps 2026
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
