'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const PIN_LENGTH = 8;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pin.length < 4) {
      setError('Code PIN trop court.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Erreur.' }));
        setError(data.error ?? 'Code PIN invalide.');
        setPin('');
        inputRef.current?.focus();
        return;
      }

      const target = fromParam && fromParam.startsWith('/admin') ? fromParam : '/admin';
      router.replace(target);
      router.refresh();
    } catch {
      setError('Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-ivory px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-ink/15 bg-white px-8 py-12 sm:px-12 sm:py-14"
      >
        <div className="border-b border-ink/15 pb-6">
          <span className="mono-label text-terracotta">Accès protégé</span>
          <h1 className="mt-4 font-display text-[2.5rem] font-light leading-none tracking-editorial text-ink">
            Admin <em className="italic">—</em>
          </h1>
        </div>

        <div className="mt-8 space-y-3">
          <label htmlFor="pin" className="mono-tag text-ink/60">
            Code PIN
          </label>
          <input
            ref={inputRef}
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={PIN_LENGTH}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/[^0-9]/g, ''))}
            className={cn(
              'w-full border-b bg-transparent py-4 text-center font-mono text-[1.8rem] tracking-[0.55em] text-ink outline-none transition-colors',
              error ? 'border-terracotta' : 'border-ink/25 focus:border-ink',
            )}
            placeholder="••••••••"
          />
          {error ? (
            <p className="mono-tag text-terracotta">{error}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-editorial btn-solid mt-10 w-full disabled:opacity-60"
        >
          {loading ? 'Vérification…' : 'Entrer →'}
        </button>
      </form>
    </div>
  );
}
