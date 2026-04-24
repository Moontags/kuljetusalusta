import { createClient } from '@/utils/supabase/admin';
import TilausLomake from './TilausLomake';

export default async function TilaaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = createClient();
  const { data: rules } = await supabase
    .from('pricing_rules')
    .select('id, name, pricing_model, base_price, price_per_km, price_per_hour, vat_rate')
    .eq('active', true)
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <span className="text-lg font-bold text-gray-900">Kuljetusalusta</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tilaa kuljetus</h1>
          <p className="text-gray-500">Täytä lomake ja saat hinta-arvion reaaliajassa.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {decodeURIComponent(error)}
          </div>
        )}

        <TilausLomake rules={rules ?? []} />
      </main>
    </div>
  );
}
