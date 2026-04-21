import { desc } from 'drizzle-orm';

import { db, contactMessages } from '@/db';
import { MessageStatusSelect } from './_components/message-status-select';

export const dynamic = 'force-dynamic';

const STATUSES = ['nouveau', 'traité', 'archivé'] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default async function AdminMessagesPage() {
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-6">
        <div>
          <span className="mono-label text-terracotta">Messages</span>
          <h1 className="mt-3 font-display text-[2.25rem] font-light leading-none tracking-editorial text-ink sm:text-[2.75rem]">
            {rows.length.toString().padStart(2, '0')} message{rows.length > 1 ? 's' : ''}
          </h1>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-ink/55">Aucun message reçu pour le moment.</p>
      ) : (
        <ul className="mt-10 divide-y divide-ink/10 border border-ink/15 bg-white">
          {rows.map((message) => (
            <li key={message.id} className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-ink/55">
                    #{message.id.toString().padStart(4, '0')}
                  </span>
                  <span className="mono-tag text-ink/50">{formatDate(message.createdAt)}</span>
                </div>
                <p className="mt-3 font-display text-2xl font-light leading-tight tracking-editorial text-ink">
                  {message.name}
                </p>
                <a
                  href={`mailto:${message.email}`}
                  className="mono-tag link-underline text-terracotta"
                >
                  {message.email}
                </a>
                <p className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-[1.7] text-ink/75">
                  {message.message}
                </p>
              </div>
              <div className="shrink-0 sm:pl-8">
                <MessageStatusSelect
                  messageId={message.id}
                  current={message.status}
                  options={[...STATUSES]}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
