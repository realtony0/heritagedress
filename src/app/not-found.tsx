import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="text-xs uppercase tracking-[0.35em] text-terracotta/80">Introuvable</span>
      <h1 className="mt-5 font-display text-5xl text-ink sm:text-6xl">Cette page n existe pas</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-ink/68 sm:text-lg">
        La page demandee est introuvable, mais les collections Heritage Dresses vous attendent juste ici.
      </p>
      <Link
        href="/collections"
        className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm uppercase tracking-[0.24em] text-ivory transition hover:bg-terracotta"
      >
        Voir les collections
      </Link>
    </section>
  );
}
