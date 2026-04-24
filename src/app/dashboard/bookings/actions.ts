'use server';

import { createClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function acceptBooking(formData: FormData) {
  const id = formData.get('id') as string;
  const admin = createClient();

  await admin
    .from('shipment_requests')
    .update({ status: 'confirmed' })
    .eq('id', id);

  revalidatePath('/dashboard/bookings');
}
