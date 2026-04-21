import { NextResponse } from 'next/server';

import { db, contactMessages } from '@/db';

export const runtime = 'nodejs';

type Body = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
  }
  if (name.length > 160 || email.length > 160 || message.length > 4000) {
    return NextResponse.json({ error: 'Longueur excessive.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
  }

  const [row] = await db
    .insert(contactMessages)
    .values({ name, email, message })
    .returning({ id: contactMessages.id });

  return NextResponse.json({ ok: true, id: row.id });
}
