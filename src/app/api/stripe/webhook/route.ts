import { stripe } from '@/lib/stripe';
import { resend } from '@/lib/resend';
import { createClient } from '@/utils/supabase/admin';
import { tilausVahvistusHtml } from '@/emails/TilausVahvistus';
import { uusiTilausAdminHtml } from '@/emails/UusiTilausAdmin';
import { NextRequest, NextResponse } from 'next/server';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
const ADMIN_EMAIL = 'info@mediasata.fi';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const shipmentId = session.metadata?.shipment_id;

    if (!shipmentId) {
      return NextResponse.json({ received: true });
    }

    const supabase = createClient();

    const { data: shipment } = await supabase
      .from('shipment_requests')
      .update({ status: 'pending', stripe_session_id: session.id })
      .eq('id', shipmentId)
      .select()
      .single();

    if (shipment) {
      await Promise.allSettled([
        resend.emails.send({
          from: FROM,
          to: shipment.sender_email,
          subject: 'Tilauksesi on vastaanotettu — Kuljetusalusta',
          html: tilausVahvistusHtml({
            shipmentId: shipment.id,
            senderName: shipment.sender_name,
            pickupAddress: shipment.pickup_address,
            deliveryAddress: shipment.delivery_address,
            distanceKm: shipment.distance_km,
            priceTotalInclVat: shipment.price_total_incl_vat ?? 0,
            scheduledAt: shipment.scheduled_at,
          }),
        }),

        resend.emails.send({
          from: FROM,
          to: ADMIN_EMAIL,
          subject: `Uusi kuljetustilaus — ${shipment.sender_name}`,
          html: uusiTilausAdminHtml({
            shipmentId: shipment.id,
            senderName: shipment.sender_name,
            senderEmail: shipment.sender_email,
            senderPhone: shipment.sender_phone,
            pickupAddress: shipment.pickup_address,
            deliveryAddress: shipment.delivery_address,
            distanceKm: shipment.distance_km,
            cargoDescription: shipment.cargo_description,
            cargoWeightKg: shipment.cargo_weight_kg,
            cargoVolumeM3: shipment.cargo_volume_m3,
            needsLift: shipment.needs_lift ?? false,
            isHazardous: shipment.is_hazardous ?? false,
            helpersCount: shipment.helpers_count ?? 0,
            scheduledAt: shipment.scheduled_at,
            priceTotalExclVat: shipment.price_total_excl_vat,
            priceTotalInclVat: shipment.price_total_incl_vat,
            createdAt: shipment.created_at,
          }),
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
