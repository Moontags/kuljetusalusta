'use server';

import { createClient } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';

export async function submitShipmentRequest(formData: FormData) {
  const supabase = createClient();

  const n = (key: string) => {
    const v = formData.get(key);
    return v && v !== '' ? Number(v) : null;
  };

  const { error } = await supabase.from('shipment_requests').insert({
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
    price_total_incl_vat: n('price_total_incl_vat'),
    pricing_rule_id: (formData.get('pricing_rule_id') as string) || null,
    status: 'pending',
  });

  if (error) {
    redirect('/tilaa?error=' + encodeURIComponent(error.message));
  }

  redirect('/tilaa/kiitos');
}
