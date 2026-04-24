'use server';

import { createClient } from '@/utils/supabase/admin';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export async function submitShipmentRequest(formData: FormData) {
  console.log('ACTION CALLED');
  const supabase = createClient();

  const n = (key: string) => {
    const v = formData.get(key);
    return v && v !== '' ? Number(v) : null;
  };

  const totalInclVat = n('price_total_incl_vat');

  const { data, error } = await supabase
    .from('shipment_requests')
    .insert({
      sender_name: formData.get('sender_name') as string,
      sender_email: formData.get('sender_email') as string,
      sender_phone: (formData.get('sender_phone') as string) || null,
      pickup_address: formData.get('pickup_address') as string,
      delivery_address: formData.get('delivery_address') as string,
      distance_km: Number(formData.get('distance_km')),
      cargo_description: (formData.get('cargo_description') as string) || null,
      cargo_weight_kg: n('cargo_weight_kg'),
      cargo_volume_m3: n('cargo_volume_m3'),
      needs_lift: formData.get('needs_lift') === 'on',
      is_hazardous: formData.get('is_hazardous') === 'on',
      helpers_count: Number(formData.get('helpers_count') ?? 0),
      scheduled_at: (formData.get('scheduled_at') as string) || null,
      price_total_excl_vat: n('price_total_excl_vat'),
      price_total_incl_vat: totalInclVat,
      pricing_rule_id: (formData.get('pricing_rule_id') as string) || null,
      status: 'awaiting_payment',
    })
    .select('id')
    .single();

  if (error || !data) {
    redirect('/tilaa?error=' + encodeURIComponent(error?.message ?? 'Tuntematon virhe'));
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const amountCents = Math.round((totalInclVat ?? 0) * 100);

  const pickupCity = (formData.get('pickup_address') as string).split(',').pop()?.trim() ?? '';
  const deliveryCity = (formData.get('delivery_address') as string).split(',').pop()?.trim() ?? '';
  const description = `Kuljetus: ${pickupCity} → ${deliveryCity}`;

  console.log('CREATING STRIPE SESSION, amount:', amountCents);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: description },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: { shipment_id: data.id },
    success_url: `${origin}/tilaa/kiitos?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tilaa`,
  });

  console.log('SESSION URL:', session.url);
  redirect(session.url!);
}
