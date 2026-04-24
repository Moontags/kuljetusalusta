'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function addVehicle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single();
  if (!userData) redirect('/login');

  const payload_raw = formData.get('max_payload_kg');
  const volume_raw = formData.get('max_volume_m3');

  const { error } = await supabase.from('vehicles').insert({
    tenant_id: userData.tenant_id,
    name: formData.get('name') as string,
    vehicle_class: formData.get('vehicle_class') as string,
    reg_number: (formData.get('reg_number') as string) || null,
    max_payload_kg: payload_raw ? Number(payload_raw) : null,
    max_volume_m3: volume_raw ? Number(volume_raw) : null,
    has_lift: formData.get('has_lift') === 'on',
    has_cooling: formData.get('has_cooling') === 'on',
    is_adr_certified: formData.get('is_adr_certified') === 'on',
    active: true,
  });

  if (error) {
    redirect('/dashboard/vehicles?error=' + encodeURIComponent(error.message));
  }
  redirect('/dashboard/vehicles');
}
