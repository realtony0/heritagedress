'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCart } from '@/components/cart-provider';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  const isHome = pathname === '/';
  const transparent = isHome && !isScrolled && !menuOpen;
  const tone = transparent ? 'light' : 'dark';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        transparent
          ? 'bg-transparent'
          : 'border-b border-ink/10 bg-ivory/95 backdrop-blur-xl',
      )}
    >
      <nav className="container-shell grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-8">
          <button
            type="button"
            aria-label="Ouvrir le menu"
            className={cn(
              'flex items-center gap-2 md:hidden',
              tone === 'light' ? 'text-ivory' : 'text-ink',
            )}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="mono-tag">Menu</span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {siteConfig.navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mono-label link-underline',
                    isActive && 'is-active',
                    tone === 'light'
                      ? 'text-ivory/90 hover:text-ivory'
                      : 'text-ink/80 hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href="/"
          className={cn(
            'flex flex-col items-center text-center leading-none transition-colors',
            tone === 'light' ? 'text-ivory' : 'text-ink',
          )}
          aria-label={siteConfig.name}
        >
          <span className="font-display text-xl font-medium tracking-editorial sm:text-[1.6rem]">
            Heritage <em className="italic font-normal">Dresses</em>
          </span>
          <span
            className={cn(
              'mono-tag mt-1',
              tone === 'light' ? 'text-sand' : 'text-terracotta',
            )}
          >
            by Hady
          </span>
        </Link>

        <div className="flex items-center justify-end gap-6">
          <button
            type="button"
            onClick={openCart}
            aria-label="Ouvrir le panier"
            className={cn(
              'mono-label flex items-center gap-2 transition-colors',
              tone === 'light'
                ? 'text-ivory/90 hover:text-ivory'
                : 'text-ink/80 hover:text-ink',
            )}
          >
            <span className="hidden sm:inline">Panier</span>
            <span
              className={cn(
                'inline-flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-[10px]',
                tone === 'light'
                  ? 'border-ivory/40 text-ivory'
                  : 'border-ink/25 text-ink',
              )}
            >
              {itemCount.toString().padStart(2, '0')}
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="overflow-hidden border-t border-ink/10 bg-ivory md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-shell flex flex-col divide-y divide-ink/10 py-2">
              {siteConfig.navigation.map((item, index) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between py-5',
                      isActive ? 'text-terracotta' : 'text-ink',
                    )}
                  >
                    <span className="font-display text-3xl font-light tracking-editorial">
                      {item.label}
                    </span>
                    <span className="mono-tag text-ink/40">
                      0{index + 1}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
