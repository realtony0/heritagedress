import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, createAdminSession, verifyPin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { pin?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const pin = body.pin?.trim();

  if (!pin) {
    return NextResponse.json({ error: 'Code PIN manquant.' }, { status: 400 });
  }

  if (!verifyPin(pin)) {
    return NextResponse.json({ error: 'Code PIN invalide.' }, { status: 401 });
  }

  const token = await createAdminSession();
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
