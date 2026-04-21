'use client';

import { FormEvent, useState } from 'react';

import { buildContactInquiry } from '@/lib/utils';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Envoi impossible.' }));
        setError(data.error ?? 'Envoi impossible.');
        return;
      }

      const href = buildContactInquiry(formData.name, formData.email, formData.message);
      window.open(href, '_blank', 'noopener,noreferrer');
      setSubmitted(true);
    } catch {
      setError('Connexion impossible. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border-b border-ink/25 bg-transparent py-4 text-[1.05rem] text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-b border-ink/15 pb-6">
        <span className="mono-label text-terracotta">Formulaire</span>
        <h2 className="mt-4 font-display text-[2.5rem] font-light leading-none tracking-editorial sm:text-[3rem]">
          Écrivez-nous <em className="italic">—</em>
        </h2>
      </div>

      <div className="mt-8 space-y-2">
        <label htmlFor="name" className="mono-tag text-ink/55">
          01 · Nom
        </label>
        <input
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
          className={inputClass}
          placeholder="Votre nom"
        />
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="email" className="mono-tag text-ink/55">
          02 · Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          className={inputClass}
          placeholder="vous@example.com"
        />
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="message" className="mono-tag text-ink/55">
          03 · Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
          className={`${inputClass} resize-none`}
          placeholder="Précisez la collection ou la pièce qui vous intéresse."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-editorial btn-solid mt-10 self-start disabled:opacity-60"
      >
        {submitting ? 'Envoi…' : 'Envoyer via WhatsApp →'}
      </button>

      {error ? (
        <p className="mt-4 text-[0.9rem] leading-[1.7] text-terracotta">{error}</p>
      ) : null}

      <p className="mt-6 text-[0.9rem] leading-[1.7] text-ink/60">
        {submitted
          ? 'Votre message est enregistré et WhatsApp vient de s’ouvrir dans un nouvel onglet.'
          : 'Votre message est enregistré puis préparé dans WhatsApp pour une réponse rapide.'}
      </p>
    </form>
  );
}
