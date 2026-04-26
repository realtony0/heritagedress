'use client';

import { ShoppingBag } from 'lucide-react';

import { useCart } from '@/components/cart-provider';

export function StickyCartBar({ collectionName }: { collectionName: string }) {
  const { itemCount, openCart } = useCart();

  if (itemCount === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openCart}
      className="btn-editorial btn-solid fixed bottom-6 right-6 z-40 shadow-soft"
      aria-label={`Ouvrir le panier — ${itemCount} pièce${itemCount > 1 ? 's' : ''}`}
    >
      <ShoppingBag className="h-4 w-4" />
      Panier ({itemCount})
      <span className="sr-only"> — {collectionName}</span>
    </button>
  );
}
