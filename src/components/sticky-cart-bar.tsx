'use client';

import { ShoppingBag } from 'lucide-react';

import { useCart } from '@/components/cart-provider';

export function StickyCartBar({ collectionName }: { collectionName: string }) {
  const { itemCount, openCart } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ivory/95 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
          <span className="mono-label text-terracotta">
            Sélection — {collectionName}
          </span>
          <span className="hidden h-8 w-px bg-ink/15 sm:block" />
          <span className="hidden text-[0.95rem] text-ink/65 sm:block">
            {itemCount > 0
              ? `${itemCount} pièce${itemCount > 1 ? 's' : ''} dans votre panier`
              : 'Ajoutez vos coups de cœur pour les retrouver ici.'}
          </span>
        </div>

        <button
          type="button"
          onClick={openCart}
          className="btn-editorial btn-solid"
        >
          <ShoppingBag className="h-4 w-4" />
          {itemCount > 0 ? `Panier (${itemCount})` : 'Ouvrir le panier'}
        </button>
      </div>
    </div>
  );
}
