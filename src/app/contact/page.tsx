import { Camera, MessageCircle, Phone, MessageSquare } from 'lucide-react';

import { ContactForm } from '@/components/contact-form';
import { Reveal } from '@/components/reveal';
import { SchemaScript } from '@/components/schema-script';
import { siteConfig } from '@/config/site';
import { getCollections } from '@/lib/catalog';
import { buildPageMetadata } from '@/lib/metadata';
import { getLocalBusinessSchema } from '@/lib/schema';

export const revalidate = 3600;

export async function generateMetadata() {
  const collections = await getCollections();

  return buildPageMetadata({
    title: 'Contact',
    description:
      'Pour une commande, une disponibilite ou une question, contactez Heritage Dresses by Hady.',
    pathname: '/contact',
    images: collections[0]?.coverImage ? [collections[0].coverImage.src] : ['/icon.svg'],
  });
}

const CONTACT_CHANNELS = [
  {
    label: 'WhatsApp',
    href: siteConfig.social.whatsapp,
    value: siteConfig.phone,
    Icon: MessageCircle,
    external: true,
  },
  {
    label: 'Instagram',
    href: siteConfig.social.instagram,
    value: `@${siteConfig.instagram}`,
    Icon: Camera,
    external: true,
  },
  {
    label: 'Snapchat',
    href: siteConfig.social.snapchat,
    value: `@${siteConfig.snapchat}`,
    Icon: MessageSquare,
    external: true,
  },
  {
    label: 'Téléphone',
    href: `tel:${siteConfig.phone}`,
    value: siteConfig.phone,
    Icon: Phone,
    external: false,
  },
];

export default async function ContactPage() {
  const collections = await getCollections();

  return (
    <>
      <SchemaScript
        id="contact-local-business"
        schema={getLocalBusinessSchema(collections[0]?.coverImage?.src)}
      />

      <section className="border-b border-ink/15 pt-36 pb-12 sm:pt-40 lg:pt-44">
        <div className="container-shell">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <h1 className="font-display text-[3rem] font-light leading-[0.9] tracking-editorial-tight text-ink sm:text-[4.5rem] lg:col-span-8 lg:text-[6rem]">
                Contact
              </h1>
              <p className="max-w-md text-[1rem] leading-[1.75] text-ink/65 lg:col-span-4">
                Une question, une commande, une disponibilité — nous vous
                répondons en 24h.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6">
            <ul className="divide-y divide-ink/15 border-y border-ink/15">
              {CONTACT_CHANNELS.map((channel) => {
                const { Icon } = channel;
                return (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      target={channel.external ? '_blank' : undefined}
                      rel={channel.external ? 'noreferrer' : undefined}
                      className="group flex items-center justify-between gap-6 py-6 transition-colors hover:text-terracotta"
                    >
                      <div className="flex items-center gap-5">
                        <Icon className="h-5 w-5 text-ink/50 transition-colors group-hover:text-terracotta" strokeWidth={1.4} />
                        <span className="font-display text-2xl font-light leading-tight tracking-editorial">
                          {channel.label}
                        </span>
                      </div>
                      <span className="font-body text-[0.95rem] text-ink/70">
                        {channel.value}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal delay={0.08}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
