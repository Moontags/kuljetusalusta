'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function addPricingRule(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single();
  if (!userData) redirect('/login');

  const n = (key: string) => {
    const v = formData.get(key);
    return v ? Number(v) : null;
  };

  const { error } = await supabase.from('pricing_rules').insert({
    tenant_id: userData.tenant_id,
    name: formData.get('name') as string,
    pricing_model: formData.get('pricing_model') as string,
    base_price: n('base_price'),
    price_per_km: n('price_per_km'),
    price_per_hour: n('price_per_hour'),
    min_km: n('min_km'),
    min_hours: n('min_hours'),
    free_km: n('free_km'),
    vat_rate: n('vat_rate'),
    currency: (formData.get('currency') as string) || 'EUR',
    active: true,
  });

  if (error) {
    redirect('/dashboard/pricing?error=' + encodeURIComponent(error.message));
  }
  redirect('/dashboard/pricing');
}
