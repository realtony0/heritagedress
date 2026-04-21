import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CartProvider } from '@/components/cart-provider';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { siteConfig } from '@/config/site';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | Tenues africaines en France`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  category: 'fashion',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="overflow-x-hidden">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
