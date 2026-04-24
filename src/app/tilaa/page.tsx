import Link from 'next/link';
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Navigaatio */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: '64px',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '18px', color: '#fff', textDecoration: 'none', letterSpacing: '-0.3px' }}>
          Kuljetusalusta
        </Link>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/kirjaudu" style={{
            color: '#fff',
            padding: '8px 18px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            Kirjaudu
          </Link>
          <Link href="/" style={{
            background: '#fff',
            color: '#1d4ed8',
            padding: '8px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
          }}>
            ← Etusivu
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Tilaa kuljetus
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            Täytä lomake ja saat hinta-arvion reaaliajassa.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '14px',
          }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <TilausLomake rules={rules ?? []} />
      </main>
    </div>
  );
}
