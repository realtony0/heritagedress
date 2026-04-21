import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db, contactMessages } from '@/db';

export const runtime = 'nodejs';

const ALLOWED = new Set(['nouveau', 'traité', 'archivé']);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 });
  }

  if (!body.status || !ALLOWED.has(body.status)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }

  await db.update(contactMessages).set({ status: body.status }).where(eq(contactMessages.id, id));

  return NextResponse.json({ ok: true });
}
