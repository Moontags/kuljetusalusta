import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const roleBadge: Record<string, string> = {
  carrier_admin: 'Kuljetusyritys (admin)',
  carrier_driver: 'Kuljettaja',
  customer: 'Asiakas',
  superadmin: 'Ylläpitäjä',
};

const planBadge: Record<string, { label: string; color: string }> = {
  starter: { label: 'Starter', color: 'bg-gray-100 text-gray-700' },
  pro: { label: 'Pro', color: 'bg-blue-100 text-blue-700' },
  business: { label: 'Business', color: 'bg-purple-100 text-purple-700' },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!userData) {
    return (
      <div>
        <p className="text-gray-500">Käyttäjätietoja ei löytynyt.</p>
        <p className="text-xs text-gray-400 mt-1">ID: {user.id} — {userError?.message}</p>
      </div>
    );
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', userData.tenant_id)
    .single();

  const plan = planBadge[tenant?.plan ?? ''] ?? {
    label: tenant?.plan ?? 'Tuntematon',
    color: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {tenant?.company_name ?? 'Yritys'}
      </h1>
      <p className="text-gray-500 text-sm mb-8">{user.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Roolisi</p>
          <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
            {roleBadge[userData.role] ?? userData.role}
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Tilaus</p>
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${plan.color}`}>
            {plan.label}
          </span>
        </div>
      </div>
    </div>
  );
}
