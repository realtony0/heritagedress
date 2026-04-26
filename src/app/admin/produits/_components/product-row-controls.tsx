'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  reference: string;
  collectionSlug: string;
  defaultPrice: number;
  currentPrice: number;
  available: boolean;
};

export function ProductRowControls({
  reference,
  collectionSlug,
  defaultPrice,
  currentPrice,
  available,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(currentPrice));
  const [isAvailable, setIsAvailable] = useState(available);
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resynchronise l'état local quand les props changent (après router.refresh())
  useEffect(() => {
    setPrice(String(currentPrice));
  }, [currentPrice]);

  useEffect(() => {
    setIsAvailable(available);
  }, [available]);

  const save = async (nextPrice: number | null, nextAvailable: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionSlug,
          price: nextPrice,
          available: nextAvailable,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Erreur.' }));
        setError(data.error ?? 'Erreur.');
        return false;
      }
      startTransition(() => router.refresh());
      return true;
    } catch {
      setError('Connexion impossible.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePriceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number.parseInt(price, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setError('Prix invalide.');
      return;
    }
    const nextPrice = parsed === defaultPrice ? null : parsed;
    const ok = await save(nextPrice, isAvailable);
    if (ok) setEditing(false);
  };

  const toggleAvailability = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    const ok = await save(Number.parseInt(price, 10), next);
    if (!ok) setIsAvailable(!next);
  };

  return (
    <div className="flex flex-col items-end gap-2 sm:items-start">
      {editing ? (
        <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
          <input
            autoFocus
            type="number"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-24 border border-ink/25 bg-white px-3 py-2 text-center font-mono text-sm text-ink focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="mono-tag border border-ink bg-ink px-3 py-2 text-ivory disabled:opacity-50"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setPrice(String(currentPrice));
              setError(null);
            }}
            className="mono-tag px-2 py-2 text-ink/60 hover:text-ink"
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mono-label link-underline text-ink/70 hover:text-ink"
        >
          Modifier prix
        </button>
      )}
      <button
        type="button"
        disabled={loading || pending}
        onClick={toggleAvailability}
        className={cn(
          'mono-tag border px-3 py-1.5 transition disabled:opacity-50',
          isAvailable
            ? 'border-ink/20 bg-white text-ink hover:border-ink'
            : 'border-terracotta bg-terracotta text-ivory',
        )}
      >
        {isAvailable ? 'Disponible' : 'En rupture'}
      </button>
      {error ? <span className="mono-tag text-terracotta">{error}</span> : null}
    </div>
  );
}
