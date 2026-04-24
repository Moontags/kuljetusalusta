export type TilausVahvistusProps = {
  shipmentId: string;
  senderName: string;
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm: number;
  priceTotalInclVat: number;
  scheduledAt?: string | null;
};

function fmt(n: number) {
  return n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function shortId(id: string) {
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

export function tilausVahvistusHtml(p: TilausVahvistusProps): string {
  const tilausnro = shortId(p.shipmentId);
  const ajankohta = p.scheduledAt
    ? new Date(p.scheduledAt).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  return `<!DOCTYPE html>
<html lang="fi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:560px;">
      <tr>
        <td style="background:#2563eb;padding:32px 40px;">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:bold;">Kuljetusalusta</p>
          <p style="margin:4px 0 0;color:#bfdbfe;font-size:14px;">Tilausvahvistus</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 40px;">
          <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hei ${p.senderName},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
            Kiitos tilauksestasi! Olemme vastaanottaneet kuljetuspyyntösi ja kuljettaja ottaa sinuun yhteyttä pian.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:8px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Tilausnumero</p>
              <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#1d4ed8;letter-spacing:.1em;">#${tilausnro}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Reitti</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid #2563eb;margin-bottom:24px;">
            <tr><td style="padding-left:16px;padding-bottom:12px;">
              <p style="margin:0;font-size:12px;color:#6b7280;">Nouto</p>
              <p style="margin:2px 0 0;font-size:15px;color:#111827;font-weight:500;">${p.pickupAddress}</p>
            </td></tr>
            <tr><td style="padding-left:16px;">
              <p style="margin:0;font-size:12px;color:#6b7280;">Toimitus</p>
              <p style="margin:2px 0 0;font-size:15px;color:#111827;font-weight:500;">${p.deliveryAddress}</p>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;font-size:14px;color:#6b7280;">Etäisyys</td>
              <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;">${p.distanceKm} km</td>
            </tr>
            ${ajankohta ? `
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;font-size:14px;color:#6b7280;">Ajankohta</td>
              <td style="padding:10px 0;font-size:14px;color:#111827;text-align:right;">${ajankohta}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;font-size:15px;font-weight:bold;color:#111827;">Hinta (sis. ALV)</td>
              <td style="padding:10px 0;font-size:15px;font-weight:bold;color:#2563eb;text-align:right;">${fmt(p.priceTotalInclVat)}</td>
            </tr>
          </table>

          <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
            Hinta on arvio. Lopullinen hinta vahvistetaan ennen kuljetusta.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            Kuljetusalusta &mdash; kuljetukset helposti ja luotettavasti
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
