'use client';

import { useState, useMemo } from 'react';
import { submitShipmentRequest } from './actions';

type PricingRule = {
  id: string;
  name: string;
  pricing_model: string;
  base_price: number | null;
  price_per_km: number | null;
  price_per_hour: number | null;
  vat_rate: number | null;
};

type Props = { rules: PricingRule[] };

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const sectionCls = 'bg-white rounded-2xl border border-gray-200 p-6';

export default function TilausLomake({ rules }: Props) {
  const rule = rules[0] ?? null;

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [distanceAuto, setDistanceAuto] = useState(false);

  const [distance, setDistance] = useState('');
  const [durationH, setDurationH] = useState('');
  const [needsLift, setNeedsLift] = useState(false);
  const [isHazardous, setIsHazardous] = useState(false);
  const [helpers, setHelpers] = useState('0');
  const [scheduledAt, setScheduledAt] = useState('');

  async function calculateDistance(o: string, d: string) {
    if (!o.trim() || !d.trim()) return;
    setDistanceLoading(true);
    setDistanceError(null);
    try {
      const res = await fetch('/api/distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: o, destination: d }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDistanceError(data.error ?? 'Etäisyyden laskenta epäonnistui. Syötä km manuaalisesti.');
        setDistanceAuto(false);
      } else {
        setDistance(String(data.distance_km));
        setDistanceAuto(true);
        setDistanceError(null);
      }
    } catch {
      setDistanceError('Etäisyyden laskenta epäonnistui. Syötä km manuaalisesti.');
      setDistanceAuto(false);
    } finally {
      setDistanceLoading(false);
    }
  }

  const price = useMemo(() => {
    if (!rule) return null;

    const km = parseFloat(distance) || 0;
    const h = parseFloat(durationH) || 0;
    const vatRate = (rule.vat_rate ?? 25.5) / 100;

    let subtotal = rule.base_price ?? 0;
    if (km > 0 && rule.price_per_km) subtotal += km * rule.price_per_km;
    if (h > 0 && rule.price_per_hour) subtotal += h * rule.price_per_hour;
    if (needsLift) subtotal += 20;
    if (isHazardous) subtotal += 50;
    subtotal += parseInt(helpers) * 20;

    if (scheduledAt) {
      const dt = new Date(scheduledAt);
      const hour = dt.getHours();
      const day = dt.getDay();
      if (hour >= 18 || hour < 7) subtotal *= 1.15;
      if (day === 0 || day === 6) subtotal *= 1.20;
    }

    const kmPart = km > 0 && rule.price_per_km ? km * rule.price_per_km : 0;
    const hPart = h > 0 && rule.price_per_hour ? h * rule.price_per_hour : 0;
    const extras = (needsLift ? 20 : 0) + (isHazardous ? 50 : 0) + parseInt(helpers) * 20;
    const vat = subtotal * vatRate;
    const total = subtotal + vat;

    return {
      base: rule.base_price ?? 0,
      kmPart,
      hPart,
      extras,
      subtotal,
      vat,
      vatRate: rule.vat_rate ?? 25.5,
      total,
    };
  }, [rule, distance, durationH, needsLift, isHazardous, helpers, scheduledAt]);

  const fmt = (n: number) =>
    n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <form action={submitShipmentRequest} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Hintalaskurin piilotetut kentät */}
      <input type="hidden" name="price_total_excl_vat" value={price?.subtotal?.toFixed(2) ?? ''} />
      <input type="hidden" name="price_total_incl_vat" value={price?.total?.toFixed(2) ?? ''} />
      <input type="hidden" name="pricing_rule_id" value={rule?.id ?? ''} />

      {/* Lomake — 2/3 leveydestä */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Osoitetiedot */}
        <div className={sectionCls}>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Reitti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Lähtöosoite *</label>
              <input
                name="pickup_address"
                type="text"
                required
                className={inputCls}
                placeholder="Mannerheimintie 1, Helsinki"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                onBlur={() => calculateDistance(origin, destination)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Kohdeosoite *</label>
              <input
                name="delivery_address"
                type="text"
                required
                className={inputCls}
                placeholder="Aleksanterinkatu 5, Helsinki"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                onBlur={() => calculateDistance(origin, destination)}
              />
            </div>
            <div>
              <label className={labelCls}>Etäisyys (km) *</label>
              <div className="relative">
                <input
                  name="distance_km"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  className={`${inputCls} ${distanceLoading ? 'text-transparent' : ''}`}
                  placeholder="25"
                  value={distance}
                  onChange={e => { setDistance(e.target.value); setDistanceAuto(false); }}
                  disabled={distanceLoading}
                />
                {distanceLoading && (
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">
                    Lasketaan etäisyyttä...
                  </span>
                )}
              </div>
              {distanceError && (
                <p className="mt-1 text-xs text-amber-600">{distanceError}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Arvioitu kesto (h)</label>
              <input
                name="duration_hours"
                type="number"
                min="0"
                step="0.5"
                className={inputCls}
                placeholder="1.5"
                value={durationH}
                onChange={e => setDurationH(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Ajankohta</label>
              <input
                name="scheduled_at"
                type="datetime-local"
                className={inputCls}
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lasti */}
        <div className={sectionCls}>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Lasti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Tavaran kuvaus</label>
              <input name="cargo_description" type="text" className={inputCls} placeholder="esim. Huonekaluja, 3 pakettia" />
            </div>
            <div>
              <label className={labelCls}>Paino (kg)</label>
              <input name="cargo_weight_kg" type="number" min="0" step="0.1" className={inputCls} placeholder="500" />
            </div>
            <div>
              <label className={labelCls}>Tilavuus (m³)</label>
              <input name="cargo_volume_m3" type="number" min="0" step="0.01" className={inputCls} placeholder="2.5" />
            </div>
            <div>
              <label className={labelCls}>Apumiehiä</label>
              <select
                name="helpers_count"
                className={inputCls}
                value={helpers}
                onChange={e => setHelpers(e.target.value)}
              >
                <option value="0">Ei apumiestä</option>
                <option value="1">1 apumies (+20 €)</option>
                <option value="2">2 apumiestä (+40 €)</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  name="needs_lift"
                  type="checkbox"
                  className="rounded"
                  checked={needsLift}
                  onChange={e => setNeedsLift(e.target.checked)}
                />
                Nostolaite tarvitaan (+20 €)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  name="is_hazardous"
                  type="checkbox"
                  className="rounded"
                  checked={isHazardous}
                  onChange={e => setIsHazardous(e.target.checked)}
                />
                Vaarallinen lasti / ADR (+50 €)
              </label>
            </div>
          </div>
        </div>

        {/* Yhteystiedot */}
        <div className={sectionCls}>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Yhteystiedot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nimi *</label>
              <input name="sender_name" type="text" required className={inputCls} placeholder="Matti Meikäläinen" />
            </div>
            <div>
              <label className={labelCls}>Sähköposti *</label>
              <input name="sender_email" type="email" required className={inputCls} placeholder="matti@esimerkki.fi" />
            </div>
            <div>
              <label className={labelCls}>Puhelin</label>
              <input name="sender_phone" type="tel" className={inputCls} placeholder="+358 40 123 4567" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-base"
        >
          Lähetä tilaus
        </button>
      </div>

      {/* Hintalaskuri — oikealla */}
      <div className="lg:sticky lg:top-6">
        <div className={`${sectionCls} flex flex-col gap-3`}>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Hinta-arvio</h2>

          {!rule ? (
            <p className="text-sm text-gray-400">Ei aktiivisia hinnoittelusääntöjä.</p>
          ) : price ? (
            <>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Perusmaksu</span>
                  <span>{fmt(price.base)}</span>
                </div>
                {price.kmPart > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Km-osuus</span>
                    <span>{fmt(price.kmPart)}</span>
                  </div>
                )}
                {price.hPart > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tuntiosuus</span>
                    <span>{fmt(price.hPart)}</span>
                  </div>
                )}
                {price.extras > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Lisät</span>
                    <span>{fmt(price.extras)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between text-gray-600">
                  <span>ALV ({price.vatRate} %)</span>
                  <span>{fmt(price.vat)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl px-4 py-3 flex justify-between items-center mt-1">
                <span className="font-semibold text-gray-800">Yhteensä</span>
                <span className="text-2xl font-bold text-blue-700">{fmt(price.total)}</span>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Hinta-arvio. Lopullinen hinta vahvistetaan tilauksen yhteydessä.
              </p>

              {scheduledAt && (() => {
                const dt = new Date(scheduledAt);
                const hour = dt.getHours();
                const day = dt.getDay();
                const isEvening = hour >= 18 || hour < 7;
                const isWeekend = day === 0 || day === 6;
                return (isEvening || isWeekend) ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                    {isEvening && <p>+15 % iltalisä (klo 18–07)</p>}
                    {isWeekend && <p>+20 % viikonloppulisä</p>}
                  </div>
                ) : null;
              })()}
            </>
          ) : (
            <p className="text-sm text-gray-400">Syötä etäisyys nähdäksesi arvion.</p>
          )}
        </div>
      </div>
    </form>
  );
}
