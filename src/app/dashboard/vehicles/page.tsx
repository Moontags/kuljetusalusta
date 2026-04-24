import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { addVehicle } from './actions';

const classLabels: Record<string, string> = {
  moped: 'Mopo',
  car: 'Henkilöauto',
  van_small: 'Pakettiauto (S)',
  van_large: 'Pakettiauto (L)',
  truck_3t5: 'Kuorma-auto 3,5t',
  truck_7t5: 'Kuorma-auto 7,5t',
  truck_12t: 'Kuorma-auto 12t',
  semi_trailer: 'Puoliperävaunu',
};

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; error?: string }>;
}) {
  const { add, error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  const check = (v: boolean) => (v ? '✓' : '–');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kalusto</h1>
        {add !== 'true' && (
          <Link
            href="/dashboard/vehicles?add=true"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Lisää ajoneuvo
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
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Uusi ajoneuvo</h2>
          <form action={addVehicle} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nimi *</label>
              <input name="name" type="text" required className={inputCls} placeholder="esim. Volvo FH" />
            </div>
            <div>
              <label className={labelCls}>Rekisterinumero</label>
              <input name="reg_number" type="text" className={inputCls} placeholder="ABC-123" />
            </div>
            <div>
              <label className={labelCls}>Luokka *</label>
              <select name="vehicle_class" required className={inputCls}>
                {Object.entries(classLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Kantavuus (kg)</label>
              <input name="max_payload_kg" type="number" min="0" step="0.1" className={inputCls} placeholder="1500" />
            </div>
            <div>
              <label className={labelCls}>Tilavuus (m³)</label>
              <input name="max_volume_m3" type="number" min="0" step="0.1" className={inputCls} placeholder="10" />
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input name="has_lift" type="checkbox" className="rounded" />
                Nostolaite
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input name="has_cooling" type="checkbox" className="rounded" />
                Kylmäkuljetus
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input name="is_adr_certified" type="checkbox" className="rounded" />
                ADR-sertifioitu
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                Tallenna
              </button>
              <Link
                href="/dashboard/vehicles"
                className="text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                Peruuta
              </Link>
            </div>
          </form>
        </div>
      )}

      {!vehicles || vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Ei ajoneuvoja vielä. Lisää ensimmäinen ajoneuvo.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nimi</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Luokka</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Rekisteri</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Kantavuus</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Tilavuus</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Nostolaite</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Kylmä</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">ADR</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Tila</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                    <td className="px-4 py-3 text-gray-600">{classLabels[v.vehicle_class] ?? v.vehicle_class}</td>
                    <td className="px-4 py-3 text-gray-600">{v.reg_number ?? '–'}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{v.max_payload_kg ? `${v.max_payload_kg} kg` : '–'}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{v.max_volume_m3 ? `${v.max_volume_m3} m³` : '–'}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{check(v.has_lift)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{check(v.has_cooling)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{check(v.is_adr_certified)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${v.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {v.active ? 'Aktiivinen' : 'Ei aktiivinen'}
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
