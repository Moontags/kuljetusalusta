'use server';

import { createClient } from '@/utils/supabase/admin';
import { resend } from '@/lib/resend';
import { redirect } from 'next/navigation';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

export async function submitDriverApplication(formData: FormData) {
  const supabase = createClient();

  const firstName = (formData.get('first_name') as string).trim();
  const lastName = (formData.get('last_name') as string).trim();
  const fullName = `${firstName} ${lastName}`;

  const { error } = await supabase.from('driver_applications').insert({
    full_name: fullName,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || null,
    license_class: formData.get('license_class') as string,
    vehicle_type: formData.get('vehicle_type') as string,
    city: (formData.get('city') as string) || null,
    notes: (formData.get('notes') as string) || null,
    status: 'pending',
  });

  if (error) {
    redirect('/liity?error=' + encodeURIComponent(error.message));
  }

  await resend.emails.send({
    from: FROM,
    to: 'info@mediasata.fi',
    subject: `Uusi kuljettajahakemus: ${fullName}`,
    html: `
      <p><strong>Nimi:</strong> ${fullName}</p>
      <p><strong>Sähköposti:</strong> ${formData.get('email')}</p>
      <p><strong>Puhelin:</strong> ${formData.get('phone') || '—'}</p>
      <p><strong>Ajokortti:</strong> ${formData.get('license_class')}</p>
      <p><strong>Ajoneuvo:</strong> ${formData.get('vehicle_type')}</p>
      <p><strong>Paikkakunta:</strong> ${formData.get('city') || '—'}</p>
      <p><strong>Lisätiedot:</strong> ${formData.get('notes') || '—'}</p>
    `,
  });

  redirect('/liity/kiitos');
}
