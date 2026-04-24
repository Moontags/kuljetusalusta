import { createClient } from '@/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId, companyName, businessId, phone } = await req.json();

  const supabase = createClient();

  const slug = companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      slug,
      company_name: companyName,
      business_id: businessId,
      contact_email: '',
      phone,
      plan: 'starter',
      locale: 'fi',
    })
    .select()
    .single();

  if (tenantError) {
    return NextResponse.json({ error: tenantError.message }, { status: 500 });
  }

  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: userId,
      tenant_id: tenant.id,
      role: 'carrier_admin',
      phone,
    });

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
