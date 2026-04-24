export type UusiTilausAdminProps = {
  shipmentId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string | null;
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm: number;
  cargoDescription?: string | null;
  cargoWeightKg?: number | null;
  cargoVolumeM3?: number | null;
  needsLift: boolean;
  isHazardous: boolean;
  helpersCount: number;
  scheduledAt?: string | null;
  priceTotalExclVat?: number | null;
  priceTotalInclVat?: number | null;
  createdAt: string;
};

function fmt(n: number) {
  return n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function shortId(id: string) {
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

function row(label: string, value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === '' || value === false) return '';
  const display = typeof value === 'boolean' ? 'Kyllä' : String(value);
  return `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:9px 0;font-size:14px;color:#6b7280;width:40%;">${label}</td>
      <td style="padding:9px 0;font-size:14px;color:#111827;font-weight:500;">${display}</td>
    </tr>`;
}

export function uusiTilausAdminHtml(p: UusiTilausAdminProps): string {
  const tilausnro = shortId(p.shipmentId);
  const luotu = new Date(p.createdAt).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' });
  const ajankohta = p.scheduledAt
    ? new Date(p.scheduledAt).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  return `<!DOCTYPE html>
<html lang="fi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
      <tr>
        <td style="background:#111827;padding:28px 40px;">
          <p style="margin:0;color:#fff;font-size:18px;font-weight:bold;">Kuljetusalusta — Uusi tilaus</p>
          <p style="margin:4px 0 0;color:#9ca3af;font-size:13px;">Saapui ${luotu}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 40px;">

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-radius:8px;margin-bottom:28px;">
            <tr><td style="padding:14px 20px;">
              <p style="margin:0;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">Tilausnumero</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#78350f;">#${tilausnro}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#92400e;">${p.shipmentId}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Asiakastiedot</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${row('Nimi', p.senderName)}
            ${row('Sähköposti', p.senderEmail)}
            ${row('Puhelin', p.senderPhone)}
          </table>

          <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Reitti</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${row('Nouto-osoite', p.pickupAddress)}
            ${row('Toimitusosoite', p.deliveryAddress)}
            ${row('Etäisyys', p.distanceKm + ' km')}
            ${ajankohta ? row('Ajankohta', ajankohta) : ''}
          </table>

          <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Lasti</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${row('Kuvaus', p.cargoDescription)}
            ${row('Paino', p.cargoWeightKg ? p.cargoWeightKg + ' kg' : null)}
            ${row('Tilavuus', p.cargoVolumeM3 ? p.cargoVolumeM3 + ' m³' : null)}
            ${row('Nostolaite', p.needsLift)}
            ${row('Vaarallinen / ADR', p.isHazardous)}
            ${row('Apumiehiä', p.helpersCount > 0 ? p.helpersCount : null)}
          </table>

          <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Hinta-arvio</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
            ${row('Veroton hinta', p.priceTotalExclVat ? fmt(p.priceTotalExclVat) : null)}
            ${row('Hinta sis. ALV', p.priceTotalInclVat ? fmt(p.priceTotalInclVat) : null)}
          </table>

        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Kuljetusalusta &mdash; hallintapaneeli
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
