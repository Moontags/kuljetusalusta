import Link from 'next/link';
import { submitDriverApplication } from './actions';

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  letterSpacing: '0.3px',
  marginBottom: '6px',
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  padding: '28px',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#111827',
  borderBottom: '1px solid #f1f5f9',
  paddingBottom: '12px',
  margin: '0 0 20px',
};

export default async function LiityPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .l-input {
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
        .l-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .l-submit {
          width: 100%;
          height: 56px;
          background: transparent;
          color: #0f172a;
          border: 1.5px solid #0f172a;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .l-submit:hover {
          background: #0f172a;
          color: #fff;
        }
        .l-submit:active {
          background: #1e293b;
        }
        .l-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .l-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

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
          <Link href="/tilaa" style={{
            background: '#fff',
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

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        paddingTop: '100px',
        paddingBottom: '40px',
        paddingLeft: '24px',
        paddingRight: '24px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
          Liity kuljettajaksi
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          Ota keikkoja omaan tahtiin. Sinä päätät milloin ajat.
        </p>
      </div>

      {/* Lomake */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 80px' }}>

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

        <form action={submitDriverApplication} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Perustiedot */}
          <div style={card}>
            <h2 style={sectionTitle}>Perustiedot</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="l-row-2">
                <div>
                  <label style={lbl}>Etunimi *</label>
                  <input className="l-input" name="first_name" type="text" required placeholder="Matti" />
                </div>
                <div>
                  <label style={lbl}>Sukunimi *</label>
                  <input className="l-input" name="last_name" type="text" required placeholder="Meikäläinen" />
                </div>
              </div>
              <div className="l-row-2">
                <div>
                  <label style={lbl}>Sähköposti *</label>
                  <input className="l-input" name="email" type="email" required placeholder="matti@esimerkki.fi" />
                </div>
                <div>
                  <label style={lbl}>Puhelin *</label>
                  <input className="l-input" name="phone" type="tel" required placeholder="+358 40 123 4567" />
                </div>
              </div>
              <div>
                <label style={lbl}>Paikkakunta</label>
                <input className="l-input" name="city" type="text" placeholder="Helsinki" />
              </div>
            </div>
          </div>

          {/* Kalusto */}
          <div style={card}>
            <h2 style={sectionTitle}>Kalusto</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={lbl}>Ajokortin luokka *</label>
                <select className="l-input" name="license_class" required>
                  <option value="">Valitse luokka</option>
                  <option value="B">B</option>
                  <option value="B+peräkärry">B + peräkärry</option>
                  <option value="C1">C1</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Ajoneuvon tyyppi *</label>
                <select className="l-input" name="vehicle_type" required>
                  <option value="">Valitse ajoneuvo</option>
                  <option value="Henkilöauto">Henkilöauto</option>
                  <option value="Henkilöauto + peräkärry">Henkilöauto + peräkärry</option>
                  <option value="Pakettiauto (S)">Pakettiauto (S)</option>
                  <option value="Pakettiauto (L)">Pakettiauto (L)</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Lisätiedot</label>
                <textarea
                  className="l-input"
                  name="notes"
                  rows={3}
                  placeholder="Kerro lisää itsestäsi tai kalustostasi..."
                  style={{ resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>
          </div>

          {/* Käyttöehdot */}
          <div style={card}>
            <h2 style={sectionTitle}>Käyttöehdot</h2>
            <label style={{ display: 'flex', gap: '14px', cursor: 'pointer' }}>
              <input
                name="terms"
                type="checkbox"
                required
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#2563eb', flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65 }}>
                Olen lukenut ja hyväksyn käyttöehdot. Ymmärrän että:
                <ul style={{ margin: '10px 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#6b7280', fontSize: '13px' }}>
                  <li>Vastaan itse kuljetettavasta tavarasta kuljetuksen aikana</li>
                  <li>Minulla on voimassa oleva ajokortti ja tarvittavat luvat</li>
                  <li>Kuljetusalusta toimii välitysalustana eikä vastaa kuljetusvaurioista</li>
                  <li>Sitoudun noudattamaan tieliikennelakia ja ajamaan turvallisesti</li>
                </ul>
              </span>
            </label>
          </div>

          <button type="submit" className="l-submit">
            Lähetä hakemus
          </button>
        </form>
      </main>
    </div>
  );
}

