import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount, description, shipment_id } = await req.json();

  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: description || 'Kuljetustilaus' },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      },
    ],
    metadata: { shipment_id },
    success_url: `${origin}/tilaa/kiitos?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tilaa`,
  });

  return NextResponse.json({ url: session.url });
}
