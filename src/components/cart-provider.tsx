'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
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
import { buildCartInquiry, cn, formatPrice } from '@/lib/utils';

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

    const whatsappUrl = buildCartInquiry(items);

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
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="border-t border-ink/10 bg-bone/50 px-6 py-6">
      <div className="flex items-baseline justify-between border-b border-ink/15 pb-4">
        <span className="mono-label text-ink/60">Total</span>
        <span className="font-display text-[2rem] font-light tracking-editorial text-ink">
          {formatPrice(total)}
        </span>
      </div>
      <p className="mt-4 text-[0.9rem] leading-[1.7] text-ink/60">
        Votre commande est enregistrée puis finalisée par WhatsApp.
      </p>
      {error ? (
        <p className="mt-2 text-[0.85rem] text-terracotta">{error}</p>
      ) : null}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="btn-editorial btn-solid mt-5 w-full disabled:opacity-60"
      >
        <MessageCircle className="h-4 w-4" />
        {loading ? 'Envoi…' : 'Finaliser ma commande'}
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
            <div className="flex items-start justify-between border-b border-ink/10 px-6 py-6">
              <div>
                <p className="mono-label text-terracotta">Votre sélection</p>
                <h2 className="mt-4 font-display text-[2.5rem] font-light leading-none tracking-editorial text-ink">
                  {itemCount.toString().padStart(2, '0')}
                  <span className="ml-2 text-lg text-ink/50">
                    {itemCount > 1 ? 'pièces' : 'pièce'}
                  </span>
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCart}
                className="flex items-center gap-2 border border-ink/20 px-3 py-2 text-ink transition hover:border-ink"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
                <span className="mono-tag">Fermer</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag className="h-8 w-8 text-terracotta" strokeWidth={1.2} />
                <h3 className="mt-8 font-display text-[2.5rem] font-light leading-none tracking-editorial text-ink">
                  Panier
                  <br />
                  <em className="italic text-terracotta">vide</em>
                </h3>
                <p className="mt-6 max-w-xs text-[0.95rem] leading-[1.75] text-ink/65">
                  Composez votre tenue idéale en parcourant nos collections.
                </p>
                <Link
                  href="/collections"
                  onClick={closeCart}
                  className="btn-editorial btn-solid mt-10"
                >
                  Voir les collections →
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-ink/10 overflow-y-auto">
                  {items.map((item) => (
                    <article key={item.id} className="flex gap-5 px-6 py-6">
                      <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-bone">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="mono-tag text-ink/45">
                              {item.collectionName}
                            </p>
                            <h3 className="mt-1 font-display text-xl font-light leading-tight tracking-editorial text-ink">
                              {item.productName}
                            </h3>
                          </div>
                          <span className="whitespace-nowrap font-display text-lg text-ink">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                          <div className="inline-flex items-center border border-ink/20">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 text-ink transition hover:text-terracotta"
                              aria-label={`Retirer une unite de ${item.productName}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-8 text-center font-mono text-xs font-medium text-ink">
                              {item.quantity.toString().padStart(2, '0')}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-ink transition hover:text-terracotta"
                              aria-label={`Ajouter une unite de ${item.productName}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mono-tag flex items-center gap-1.5 text-ink/55 transition hover:text-terracotta"
                          >
                            <Trash2 className="h-3 w-3" />
                            Retirer
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
