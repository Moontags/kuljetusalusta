import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { addPricingRule } from './actions';

const modelLabels: Record<string, string> = {
  fixed: 'Kiinteä hinta',
  per_km: 'Per km',
  per_hour: 'Per tunti',
  combo_base_km: 'Combo (perus + km)',
  combo_base_h: 'Combo (perus + h)',
  combo_full: 'Combo (täysi)',
};

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; error?: string }>;
}) {
  const { add, error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: rules } = await supabase
    .from('pricing_rules')
    .select('*')
    .order('created_at', { ascending: false });

  const fmt = (v: number | null, suffix = '') =>
    v != null ? `${v}${suffix}` : '–';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hinnoittelu</h1>
        {add !== 'true' && (
          <Link
            href="/dashboard/pricing?add=true"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Lisää hinnoittelusääntö
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {decodeURIComponent(error)}
        </div>
      )}

      {add === 'true' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Uusi hinnoittelusääntö</h2>
          <form action={addPricingRule} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nimi *</label>
              <input name="name" type="text" required className={inputCls} placeholder="esim. Peruskuljetus" />
            </div>
            <div>
              <label className={labelCls}>Malli *</label>
              <select name="pricing_model" required className={inputCls}>
                {Object.entries(modelLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Perusmaksu (€)</label>
              <input name="base_price" type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>Km-hinta (€/km)</label>
              <input name="price_per_km" type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>Tuntihinta (€/h)</label>
              <input name="price_per_hour" type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>ALV (%)</label>
              <input name="vat_rate" type="number" min="0" max="100" step="0.1" className={inputCls} placeholder="25.5" />
            </div>
            <div>
              <label className={labelCls}>Min. km</label>
              <input name="min_km" type="number" min="0" step="0.1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Min. tunnit</label>
              <input name="min_hours" type="number" min="0" step="0.5" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Valuutta</label>
              <input name="currency" type="text" className={inputCls} defaultValue="EUR" maxLength={3} />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                Tallenna
              </button>
              <Link
                href="/dashboard/pricing"
                className="text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                Peruuta
              </Link>
            </div>
          </form>
        </div>
      )}

      {!rules || rules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Ei hinnoittelusääntöjä vielä. Lisää ensimmäinen sääntö.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nimi</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Malli</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Perusmaksu</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">€/km</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">€/h</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">ALV</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Tila</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-600">{modelLabels[r.pricing_model] ?? r.pricing_model}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(r.base_price, ' €')}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(r.price_per_km, ' €')}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(r.price_per_hour, ' €')}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(r.vat_rate, ' %')}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${r.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.active ? 'Aktiivinen' : 'Ei aktiivinen'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
