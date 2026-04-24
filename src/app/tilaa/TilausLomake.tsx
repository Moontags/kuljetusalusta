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

const VEHICLES = [
  { name: 'Henkilöauto',             desc: 'Pienet paketit, max 200 kg' },
  { name: 'Henkilöauto + peräkärry', desc: 'Muuttolaatikot, max 500 kg' },
  { name: 'Pakettiauto (S)',          desc: 'Huonekalut, max 800 kg' },
  { name: 'Pakettiauto (L)',          desc: 'Isommat kuormat, max 1500 kg' },
];

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  padding: '28px',
};

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  letterSpacing: '0.3px',
  marginBottom: '6px',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#111827',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '12px',
  margin: '0 0 20px',
};

const priceRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px',
  color: '#6b7280',
  padding: '8px 0',
  borderBottom: '1px solid #f9fafb',
};

export default function TilausLomake({ rules }: Props) {
  const defaultVehicle = rules.some(r => r.name === 'Pakettiauto (S)')
    ? 'Pakettiauto (S)'
    : (rules[0]?.name ?? 'Pakettiauto (S)');

  const [selectedVehicle, setSelectedVehicle] = useState(defaultVehicle);
  const rule = useMemo(
    () => rules.find(r => r.name === selectedVehicle) ?? rules[0] ?? null,
    [rules, selectedVehicle],
  );

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

    return { base: rule.base_price ?? 0, kmPart, hPart, extras, subtotal, vat, vatRate: rule.vat_rate ?? 25.5, total };
  }, [rule, distance, durationH, needsLift, isHazardous, helpers, scheduledAt]);

  const fmt = (n: number) =>
    n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  void distanceAuto;

  return (
    <>
      <style>{`
        .t-input {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 15px;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .t-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .t-input:disabled {
          background: #f9fafb;
          color: #9ca3af;
        }
        .t-submit {
          width: 100%;
          height: 56px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          font-family: inherit;
          letter-spacing: -0.2px;
        }
        .t-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.4);
        }
        .t-submit:active {
          transform: translateY(0);
          box-shadow: none;
        }
        .t-form-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        .t-fields-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .t-price-col {
          position: sticky;
          top: 84px;
        }
        .t-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .t-submit-wrap {
          margin-top: 4px;
        }
        .t-vehicle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .t-vehicle-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: left;
        }
        .t-vehicle-card:hover {
          border-color: #94a3b8;
        }
        @media (max-width: 768px) {
          .t-vehicle-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .t-form-grid {
            grid-template-columns: 1fr;
          }
          .t-price-col {
            position: static;
          }
          .t-row-2 {
            grid-template-columns: 1fr;
          }
          .t-submit-wrap {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            z-index: 40;
            margin: 0;
          }
          .t-fields-col {
            padding-bottom: 88px;
          }
        }
      `}</style>

      <form action={submitShipmentRequest} className="t-form-grid">
        <input type="hidden" name="price_total_excl_vat" value={price?.subtotal?.toFixed(2) ?? ''} />
        <input type="hidden" name="price_total_incl_vat" value={price?.total?.toFixed(2) ?? ''} />
        <input type="hidden" name="pricing_rule_id" value={rule?.id ?? ''} />
        <input type="hidden" name="vehicle_type" value={selectedVehicle} />

        {/* Vasen sarake */}
        <div className="t-fields-col">

          {/* Ajoneuvovalinta */}
          <div style={card}>
            <h2 style={sectionTitle}>Valitse ajoneuvotyyppi</h2>
            <div className="t-vehicle-grid">
              {VEHICLES.map(v => (
                <button
                  key={v.name}
                  type="button"
                  className="t-vehicle-card"
                  onClick={() => setSelectedVehicle(v.name)}
                  style={selectedVehicle === v.name
                    ? { borderColor: '#2563eb', background: '#eff6ff' }
                    : undefined}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, color: selectedVehicle === v.name ? '#1d4ed8' : '#111827' }}>
                    {v.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.4 }}>{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reitti */}
          <div style={card}>
            <h2 style={sectionTitle}>Reitti</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={lbl}>Lähtöosoite *</label>
                <input
                  className="t-input"
                  name="pickup_address"
                  type="text"
                  required
                  placeholder="Mannerheimintie 1, Helsinki"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  onBlur={() => calculateDistance(origin, destination)}
                />
              </div>
              <div>
                <label style={lbl}>Kohdeosoite *</label>
                <input
                  className="t-input"
                  name="delivery_address"
                  type="text"
                  required
                  placeholder="Aleksanterinkatu 5, Helsinki"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  onBlur={() => calculateDistance(origin, destination)}
                />
              </div>
              <div className="t-row-2">
                <div>
                  <label style={lbl}>Etäisyys (km) *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="t-input"
                      name="distance_km"
                      type="number"
                      min="0"
                      step="0.1"
                      required
                      placeholder={distanceLoading ? '' : '25'}
                      value={distance}
                      onChange={e => { setDistance(e.target.value); setDistanceAuto(false); }}
                      disabled={distanceLoading}
                      style={distanceLoading ? { color: 'transparent' } : undefined}
                    />
                    {distanceLoading && (
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '16px', fontSize: '14px', color: '#9ca3af', pointerEvents: 'none' }}>
                        Lasketaan etäisyyttä...
                      </span>
                    )}
                  </div>
                  {distanceError && (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#d97706' }}>{distanceError}</p>
                  )}
                </div>
                <div>
                  <label style={lbl}>Kesto (h)</label>
                  <input
                    className="t-input"
                    name="duration_hours"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="1.5"
                    value={durationH}
                    onChange={e => setDurationH(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label style={lbl}>Ajankohta</label>
                <input
                  className="t-input"
                  name="scheduled_at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Lasti */}
          <div style={card}>
            <h2 style={sectionTitle}>Lasti</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={lbl}>Tavaran kuvaus</label>
                <input className="t-input" name="cargo_description" type="text" placeholder="esim. Huonekaluja, 3 pakettia" />
              </div>
              <div className="t-row-2">
                <div>
                  <label style={lbl}>Paino (kg)</label>
                  <input className="t-input" name="cargo_weight_kg" type="number" min="0" step="0.1" placeholder="500" />
                </div>
                <div>
                  <label style={lbl}>Tilavuus (m³)</label>
                  <input className="t-input" name="cargo_volume_m3" type="number" min="0" step="0.01" placeholder="2.5" />
                </div>
              </div>
              <div>
                <label style={lbl}>Apumiehiä</label>
                <select className="t-input" name="helpers_count" value={helpers} onChange={e => setHelpers(e.target.value)}>
                  <option value="0">Ei apumiestä</option>
                  <option value="1">1 apumies (+20 €)</option>
                  <option value="2">2 apumiestä (+40 €)</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    name="needs_lift"
                    type="checkbox"
                    checked={needsLift}
                    onChange={e => setNeedsLift(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer', flexShrink: 0 }}
                  />
                  Nostolaite tarvitaan <span style={{ color: '#9ca3af' }}>(+20 €)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    name="is_hazardous"
                    type="checkbox"
                    checked={isHazardous}
                    onChange={e => setIsHazardous(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer', flexShrink: 0 }}
                  />
                  Vaarallinen lasti / ADR <span style={{ color: '#9ca3af' }}>(+50 €)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Yhteystiedot */}
          <div style={card}>
            <h2 style={sectionTitle}>Yhteystiedot</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="t-row-2">
                <div>
                  <label style={lbl}>Nimi *</label>
                  <input className="t-input" name="sender_name" type="text" required placeholder="Matti Meikäläinen" />
                </div>
                <div>
                  <label style={lbl}>Sähköposti *</label>
                  <input className="t-input" name="sender_email" type="email" required placeholder="matti@esimerkki.fi" />
                </div>
              </div>
              <div>
                <label style={lbl}>Puhelin</label>
                <input className="t-input" name="sender_phone" type="tel" placeholder="+358 40 123 4567" />
              </div>
            </div>
          </div>

          <div className="t-submit-wrap">
            <button type="submit" className="t-submit">
              Lähetä tilaus ja siirry maksuun →
            </button>
          </div>
        </div>

        {/* Hinta-arvio */}
        <div className="t-price-col">
          <div style={{ ...card, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            <h2 style={sectionTitle}>Hinta-arvio</h2>

            {!rule ? (
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Ei aktiivisia hinnoittelusääntöjä.</p>
            ) : price ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                  <div style={priceRow}>
                    <span>Perusmaksu</span>
                    <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(price.base)}</span>
                  </div>
                  {price.kmPart > 0 && (
                    <div style={priceRow}>
                      <span>Km-osuus</span>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(price.kmPart)}</span>
                    </div>
                  )}
                  {price.hPart > 0 && (
                    <div style={priceRow}>
                      <span>Tuntiosuus</span>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(price.hPart)}</span>
                    </div>
                  )}
                  {price.extras > 0 && (
                    <div style={priceRow}>
                      <span>Lisät</span>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(price.extras)}</span>
                    </div>
                  )}
                  <div style={{ ...priceRow, borderBottom: 'none', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '2px' }}>
                    <span>ALV ({price.vatRate} %)</span>
                    <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(price.vat)}</span>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}>
                  <span style={{ fontWeight: 600, color: '#1e40af', fontSize: '14px' }}>Yhteensä</span>
                  <span style={{ fontSize: '26px', fontWeight: 800, color: '#1d4ed8', letterSpacing: '-0.5px' }}>
                    {fmt(price.total)}
                  </span>
                </div>

                {scheduledAt && (() => {
                  const dt = new Date(scheduledAt);
                  const hour = dt.getHours();
                  const day = dt.getDay();
                  const isEvening = hour >= 18 || hour < 7;
                  const isWeekend = day === 0 || day === 6;
                  return (isEvening || isWeekend) ? (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                      {isEvening && <p style={{ margin: 0 }}>+15 % iltalisä (klo 18–07)</p>}
                      {isWeekend && <p style={{ margin: 0 }}>+20 % viikonloppulisä</p>}
                    </div>
                  ) : null;
                })()}

                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.5 }}>
                  Hinta-arvio. Lopullinen hinta vahvistetaan tilauksen yhteydessä.
                </p>
              </>
            ) : (
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Syötä etäisyys nähdäksesi arvion.</p>
            )}
          </div>
        </div>

      </form>
    </>
  );
}
