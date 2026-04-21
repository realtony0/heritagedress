import { NextResponse } from 'next/server';

import { db, orders, type OrderItem } from '@/db';

export const runtime = 'nodejs';

type Body = {
  customerName?: string;
  customerContact?: string;
  items?: OrderItem[];
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 });
  }
  if (body.items.length > 100) {
    return NextResponse.json({ error: 'Panier trop volumineux.' }, { status: 400 });
  }

  const items: OrderItem[] = body.items
    .filter(
      (item) =>
        item &&
        typeof item.reference === 'string' &&
        typeof item.productName === 'string' &&
        typeof item.collectionName === 'string' &&
        typeof item.collectionSlug === 'string' &&
        Number.isFinite(item.price) &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    )
    .map((item) => ({
      reference: item.reference,
      productName: item.productName,
      collectionName: item.collectionName,
      collectionSlug: item.collectionSlug,
      price: Math.round(item.price),
      quantity: Math.min(99, Math.round(item.quantity)),
    }));

  if (items.length === 0) {
    return NextResponse.json({ error: 'Articles invalides.' }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [row] = await db
    .insert(orders)
    .values({
      customerName: body.customerName?.trim() || null,
      customerContact: body.customerContact?.trim() || null,
      items,
      total,
    })
    .returning({ id: orders.id });

  return NextResponse.json({ ok: true, id: row.id });
}
