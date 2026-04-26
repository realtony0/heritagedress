import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { db, productOverrides } from '@/db';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

type Body = {
  collectionSlug?: string;
  price?: number | null;
  available?: boolean;
};

export async function PATCH(
  request: Request,
  { params }: { params: { reference: string } },
) {
  const reference = params.reference;

  if (!reference) {
    return NextResponse.json({ error: 'Référence manquante.' }, { status: 400 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 });
  }

  if (!body.collectionSlug) {
    return NextResponse.json({ error: 'Collection manquante.' }, { status: 400 });
  }

  const available = body.available ?? true;
  const price =
    body.price == null || Number.isNaN(body.price) ? null : Math.max(0, Math.round(body.price));

  await db
    .insert(productOverrides)
    .values({
      reference,
      collectionSlug: body.collectionSlug,
      price,
      available,
    })
    .onConflictDoUpdate({
      target: productOverrides.reference,
      set: {
        collectionSlug: body.collectionSlug,
        price,
        available,
        updatedAt: sql`now()`,
      },
    });

  // Invalide les pages publiques qui affichent les prix
  revalidatePath('/');
  revalidatePath('/collections');
  revalidatePath(`/collections/${body.collectionSlug}`);
  revalidatePath('/admin/produits');

  return NextResponse.json({ ok: true });
}
