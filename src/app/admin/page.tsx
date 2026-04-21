import Link from 'next/link';
import { count, desc, eq } from 'drizzle-orm';

import { db, contactMessages, orders } from '@/db';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [ordersTotal, ordersNew, messagesTotal, messagesNew, lastOrder, lastMessage] = await Promise.all([
    db.select({ value: count() }).from(orders).then((r) => r[0]?.value ?? 0),
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, 'nouveau'))
      .then((r) => r[0]?.value ?? 0),
    db.select({ value: count() }).from(contactMessages).then((r) => r[0]?.value ?? 0),
    db
      .select({ value: count() })
      .from(contactMessages)
      .where(eq(contactMessages.status, 'nouveau'))
      .then((r) => r[0]?.value ?? 0),
    db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(1)
      .then((rows) => rows[0] ?? null),
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(1)
      .then((rows) => rows[0] ?? null),
  ]);

  return { ordersTotal, ordersNew, messagesTotal, messagesNew, lastOrder, lastMessage };
}

function formatDate(date: Date | null) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: 'Commandes',
      href: '/admin/commandes',
      total: stats.ordersTotal,
      nouveau: stats.ordersNew,
      lastAt: stats.lastOrder?.createdAt ?? null,
    },
    {
      label: 'Messages',
      href: '/admin/messages',
      total: stats.messagesTotal,
      nouveau: stats.messagesNew,
      lastAt: stats.lastMessage?.createdAt ?? null,
    },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-6">
        <div>
          <span className="mono-label text-terracotta">Vue d’ensemble</span>
          <h1 className="mt-3 font-display text-[2.25rem] font-light leading-none tracking-editorial text-ink sm:text-[2.75rem]">
            Bonjour Hady <em className="italic">—</em>
          </h1>
        </div>
        <Link
          href="/admin/produits"
          className="mono-label link-underline hidden text-ink/70 hover:text-ink md:inline-block"
        >
          Gérer les produits →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col gap-6 border border-ink/15 bg-white p-8 transition hover:border-ink"
          >
            <div className="flex items-start justify-between">
              <span className="mono-label text-ink/55">{card.label}</span>
              {card.nouveau > 0 ? (
                <span className="mono-tag bg-terracotta px-2 py-1 text-ivory">
                  {card.nouveau} nouveau{card.nouveau > 1 ? 'x' : ''}
                </span>
              ) : (
                <span className="mono-tag text-ink/40">À jour</span>
              )}
            </div>
            <p className="font-display text-[3.5rem] font-light leading-none tracking-editorial text-ink">
              {card.total.toString().padStart(2, '0')}
            </p>
            <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-4">
              <span className="mono-tag text-ink/50">
                Dernier · {formatDate(card.lastAt)}
              </span>
              <span className="mono-label text-ink/60 transition group-hover:text-terracotta">
                Ouvrir →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
