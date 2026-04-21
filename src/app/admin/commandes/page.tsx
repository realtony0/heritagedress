import { desc } from 'drizzle-orm';

import { db, orders } from '@/db';
import { formatPrice } from '@/lib/utils';
import { OrderStatusSelect } from './_components/order-status-select';

export const dynamic = 'force-dynamic';

const STATUSES = ['nouveau', 'en cours', 'livrée', 'annulée'] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default async function AdminOrdersPage() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));

  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-6">
        <div>
          <span className="mono-label text-terracotta">Commandes</span>
          <h1 className="mt-3 font-display text-[2.25rem] font-light leading-none tracking-editorial text-ink sm:text-[2.75rem]">
            {rows.length.toString().padStart(2, '0')} commande{rows.length > 1 ? 's' : ''}
          </h1>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-ink/55">Aucune commande pour le moment.</p>
      ) : (
        <div className="mt-10 overflow-hidden border border-ink/15 bg-white">
          <table className="w-full border-collapse text-left text-[0.92rem]">
            <thead>
              <tr className="border-b border-ink/15 bg-bone/60">
                <th className="px-5 py-4 mono-tag text-ink/60">#</th>
                <th className="px-5 py-4 mono-tag text-ink/60">Date</th>
                <th className="px-5 py-4 mono-tag text-ink/60">Client</th>
                <th className="px-5 py-4 mono-tag text-ink/60">Pièces</th>
                <th className="px-5 py-4 mono-tag text-ink/60">Total</th>
                <th className="px-5 py-4 mono-tag text-ink/60">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => {
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <tr key={order.id} className="border-b border-ink/10 last:border-b-0 align-top">
                    <td className="px-5 py-5 font-mono text-ink/65">
                      {order.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-5 py-5 text-ink/70 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-display text-lg text-ink">
                        {order.customerName ?? '—'}
                      </p>
                      {order.customerContact ? (
                        <p className="mono-tag mt-1 text-ink/50">{order.customerContact}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-5 text-ink/80">
                      <p className="font-mono text-sm">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
                      <ul className="mt-2 space-y-1 text-[0.85rem] text-ink/55">
                        {order.items.map((item) => (
                          <li key={item.reference}>
                            {item.quantity}× {item.productName}{' '}
                            <span className="text-ink/40">({item.collectionName})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-5 whitespace-nowrap font-display text-lg text-ink">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-5">
                      <OrderStatusSelect
                        orderId={order.id}
                        current={order.status}
                        options={[...STATUSES]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
