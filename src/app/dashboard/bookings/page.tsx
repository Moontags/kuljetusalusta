import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { acceptBooking } from './actions';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Odottaa',     color: 'bg-amber-100 text-amber-700' },
  confirmed:   { label: 'Vahvistettu', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Matkalla',    color: 'bg-purple-100 text-purple-700' },
  completed:   { label: 'Toimitettu',  color: 'bg-green-100 text-green-700' },
  cancelled:   { label: 'Peruutettu',  color: 'bg-gray-100 text-gray-500' },
};

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { createClient: adminClient } = await import('@/utils/supabase/admin');
  const admin = adminClient();

  const { data: bookings } = await admin
    .from('shipment_requests')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Varaukset</h1>
        <span className="text-sm text-gray-500">
          {bookings?.length ?? 0} tilausta
        </span>
      </div>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Ei tilauksia vielä. Tilaukset näkyvät tässä kun asiakkaat lähettävät niitä.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => {
            const st = statusLabels[b.status] ?? { label: b.status, color: 'bg-gray-100 text-gray-500' };
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(b.created_at).toLocaleDateString('fi-FI', {
                          day: 'numeric', month: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">{b.sender_name}</p>
                    <p className="text-sm text-gray-500">{b.sender_email} · {b.sender_phone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">
                      {Number(b.price_total_incl_vat).toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €
                    </p>
                    <p className="text-xs text-gray-400">
                      alv 0%: {Number(b.price_total_excl_vat).toLocaleString('fi-FI', { minimumFractionDigits: 2 })} €
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">Nouto</p>
                    <p className="text-gray-800">{b.pickup_address}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">Toimitus</p>
                    <p className="text-gray-800">{b.delivery_address}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  {b.distance_km && <span>📍 {b.distance_km} km</span>}
                  {b.cargo_weight_kg && <span>⚖️ {b.cargo_weight_kg} kg</span>}
                  {b.cargo_volume_m3 && <span>📦 {b.cargo_volume_m3} m³</span>}
                  {b.helpers_count > 0 && <span>👷 {b.helpers_count} apumies</span>}
                  {b.needs_lift && <span>🏗️ Nostolaite</span>}
                  {b.is_hazardous && <span>⚠️ Vaarallinen lasti</span>}
                  {b.cargo_description && <span>💬 {b.cargo_description}</span>}
                  {b.scheduled_at && (
                    <span>🕐 {new Date(b.scheduled_at).toLocaleDateString('fi-FI', {
                      day: 'numeric', month: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}</span>
                  )}
                </div>

                {b.status === 'pending' && (
                  <form action={acceptBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                    >
                      Hyväksy keikka
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
