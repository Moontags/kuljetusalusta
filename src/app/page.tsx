import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* Hero — täyttää tilan footerin yläpuolella */}
      <section style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Taustakuva */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)' }} />

        {/* Sisältökolumni */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Navigaatio */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: '64px',
            flexShrink: 0,
          }}>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#fff', letterSpacing: '-0.3px' }}>
              Kuljetusalusta
            </span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link href="/kirjaudu" style={{
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}>
                Kirjaudu
              </Link>
              <Link href="/tilaa" style={{
                background: 'rgba(255,255,255,0.75)',
                color: '#1d4ed8',
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 700,
              }}>
                Tilaa kuljetus
              </Link>
            </div>
          </nav>

          {/* Hero-teksti — kasvaa täyttämään tilan */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            color: '#fff',
          }}>
            <div style={{ maxWidth: '700px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '24px',
                backdropFilter: 'blur(8px)',
                color: '#e2e8f0',
              }}>
                Suomen nopein kuljetuspalvelu
              </div>

              <h1 style={{
                fontSize: 'clamp(34px, 5.5vw, 66px)',
                fontWeight: 800,
                lineHeight: 1.08,
                margin: '0 0 18px',
                letterSpacing: '-1.5px',
                color: '#fff',
              }}>
                Kuljetus tilattu,<br />tavarat perillä.
              </h1>

              <p style={{
                fontSize: 'clamp(14px, 1.8vw, 18px)',
                color: '#cbd5e1',
                maxWidth: '480px',
                margin: '0 auto 28px',
                lineHeight: 1.65,
              }}>
                Syötä osoitteet, saat hinnan sekunnissa. Maksa verkossa, kuljettaja hoitaa loput.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                <Link href="/tilaa" style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.75)',
                  color: '#1d4ed8',
                  fontWeight: 700,
                  fontSize: '17px',
                  padding: '14px 42px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                }}>
                  Tilaa kuljetus →
                </Link>
                <Link href="/liity" style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '17px',
                  padding: '14px 42px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '2px solid rgba(255,255,255,0.7)',
                }}>
                  Liity kuljettajaksi
                </Link>
              </div>

              <p style={{ marginTop: '14px', fontSize: '13px', color: '#94a3b8' }}>
                Ei rekisteröitymistä &bull; Hinta-arvio heti &bull; Turvallinen maksu
              </p>
            </div>
          </div>

          {/* Features-palkki hero:n alareunassa */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            padding: '20px 24px',
            flexShrink: 0,
          }}>
            <div style={{
              maxWidth: '880px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              textAlign: 'center',
              color: '#fff',
            }}>
              {[
                { title: 'Täytä tilaus', sub: '2 min' },
                { title: 'Saat hinnan', sub: 'heti' },
                { title: 'Vahvista & maksa', sub: 'turvallisesti' },
                { title: 'Kuljetus hoidetaan', sub: 'sovittuna aikana' },
              ].map(({ title, sub }) => (
                <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{title}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: '#64748b',
        padding: '12px 24px',
        fontSize: '13px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px 12px',
        flexShrink: 0,
      }}>
        <span>© 2026 Kuljetusalusta</span>
        <span>|</span>
        <Link href="/tilaa" style={{ color: '#64748b', textDecoration: 'none' }}>Tilaa kuljetus</Link>
        <span>|</span>
        <Link href="/kirjaudu" style={{ color: '#64748b', textDecoration: 'none' }}>Kirjaudu</Link>
        <span>|</span>
        <a href="mailto:info@mediasata.fi" style={{ color: '#64748b', textDecoration: 'none' }}>info@mediasata.fi</a>
      </footer>

    </div>
  );
}
