'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { CatalogProduct } from '@/lib/catalog';
import { buildCartInquiry, formatPrice } from '@/lib/utils';

const STORAGE_KEY = 'heritage-dresses-cart';

export type CartItem = Pick<
  CatalogProduct,
  'id' | 'src' | 'alt' | 'collectionName' | 'collectionSlug' | 'productName' | 'reference' | 'price'
> & {
  quantity: number;
};

function CartCheckoutFooter({ items }: { items: CartItem[] }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const whatsappUrl = buildCartInquiry(items);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    const payload = {
      items: items.map((item) => ({
        reference: item.reference,
        productName: item.productName,
        collectionName: item.collectionName,
        collectionSlug: item.collectionSlug,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      setError('Commande non enregistrée, mais vous pouvez continuer sur WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-ink/10 bg-ivory px-6 py-5">
      <div className="flex items-baseline justify-between pb-4">
        <span className="text-ink/60">Total</span>
        <span className="font-display text-xl font-light text-ink">
          {formatPrice(total)}
        </span>
      </div>
      {error ? (
        <p className="mb-2 text-[0.85rem] text-terracotta">{error}</p>
      ) : null}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="btn-editorial btn-solid w-full disabled:opacity-60"
      >
        <MessageCircle className="h-4 w-4" />
        {loading ? 'Envoi…' : 'Commander sur WhatsApp'}
      </button>
    </div>
  );
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  addItem: (product: CatalogProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function CartDrawer({
  items,
  itemCount,
  isOpen,
  closeCart,
  removeItem,
  updateQuantity,
}: {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  closeCart: () => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Fermer le panier"
            className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            className="fixed inset-y-0 right-0 z-[96] flex w-full max-w-[460px] flex-col border-l border-ink/10 bg-ivory shadow-soft"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-2xl font-light tracking-editorial text-ink">
                Panier
                {itemCount > 0 ? (
                  <span className="ml-2 text-ink/50">({itemCount})</span>
                ) : null}
              </h2>

              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-ink/70 transition hover:text-ink"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="font-display text-2xl font-light tracking-editorial text-ink">
                  Votre panier est vide
                </p>
                <Link
                  href="/collections"
                  onClick={closeCart}
                  className="btn-editorial btn-solid mt-8"
                >
                  Voir les collections
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-ink/10 overflow-y-auto">
                  {items.map((item) => (
                    <article key={item.id} className="flex gap-4 px-6 py-5">
                      <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-bone">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg font-light leading-tight tracking-editorial text-ink">
                            {item.productName}
                          </h3>
                          <span className="whitespace-nowrap font-display text-base text-ink">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                          <div className="inline-flex items-center border border-ink/20">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-1.5 text-ink transition hover:text-terracotta"
                              aria-label="Retirer une unité"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-7 text-center font-mono text-xs text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1.5 text-ink transition hover:text-terracotta"
                              aria-label="Ajouter une unité"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-ink/50 transition hover:text-terracotta"
                            aria-label="Retirer du panier"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <CartCheckoutFooter items={items} />
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(STORAGE_KEY);

      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const addItem = (product: CatalogProduct) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          src: product.coverImage.src,
          alt: product.coverImage.alt,
          collectionName: product.collectionName,
          collectionSlug: product.collectionSlug,
          productName: product.productName,
          reference: product.reference,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
      <CartDrawer
        items={items}
        itemCount={itemCount}
        isOpen={isOpen}
        closeCart={() => setIsOpen(false)}
        removeItem={removeItem}
        updateQuantity={updateQuantity}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
