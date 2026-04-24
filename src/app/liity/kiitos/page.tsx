import Link from 'next/link';

export default function LiityKiitosPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '100%',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#dcfce7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '28px',
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 12px', letterSpacing: '-0.3px' }}>
          Hakemuksesi on vastaanotettu!
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px', lineHeight: 1.6 }}>
          Otamme sinuun yhteyttä 1–2 arkipäivän kuluessa sähköpostitse.
        </p>

        <Link href="/" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '15px',
          padding: '12px 28px',
          borderRadius: '10px',
          textDecoration: 'none',
        }}>
          Takaisin etusivulle
        </Link>
      </div>
    </div>
  );
}
