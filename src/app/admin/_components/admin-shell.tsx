'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Vue d’ensemble' },
  { href: '/admin/commandes', label: 'Commandes' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/produits', label: 'Produits' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-[100svh] bg-ivory">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between gap-8">
          <Link href="/admin" className="flex items-baseline gap-3">
            <span className="font-display text-xl font-medium tracking-editorial text-ink">
              Heritage <em className="italic font-normal">Admin</em>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mono-label link-underline',
                    isActive ? 'is-active text-terracotta' : 'text-ink/70 hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="mono-label hidden text-ink/60 hover:text-ink sm:inline-block"
            >
              Voir le site ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 border border-ink/20 px-3 py-2 text-ink transition hover:border-ink disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="mono-tag">Sortir</span>
            </button>
          </div>
        </div>

        <nav className="md:hidden border-t border-ink/10">
          <div className="container-shell flex gap-6 overflow-x-auto py-3">
            {NAV.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'mono-label whitespace-nowrap',
                    isActive ? 'text-terracotta' : 'text-ink/65',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="container-shell py-10 sm:py-14">{children}</main>
    </div>
  );
}
