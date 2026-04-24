import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Hero */}
      <section className="bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Nopea ja luotettava<br className="hidden sm:block" /> kuljetus
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tilaa kuljetus helposti — saat hinta-arvion reaaliajassa ja maksat turvallisesti verkossa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tilaa"
              className="bg-white text-blue-800 font-semibold px-8 py-4 rounded-xl text-base hover:bg-blue-50 transition-colors shadow-lg"
            >
              Tilaa kuljetus →
            </Link>
            <Link
              href="/liity"
              className="border border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors"
            >
              Oletko kuljettaja? Liity alustalle
            </Link>
          </div>
        </div>
      </section>

      {/* Miten se toimii */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Miten se toimii?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: '📋', step: '1', title: 'Täytä tilaus', desc: 'Syötä nouto- ja toimitusosoite sekä tavaratiedot lomakkeelle.' },
              { icon: '💰', step: '2', title: 'Saat hinta-arvion', desc: 'Hinta lasketaan automaattisesti osoitteiden ja tavaroiden perusteella.' },
              { icon: '🚚', step: '3', title: 'Kuljetus hoidetaan', desc: 'Kuljettaja noutaa tavarat sovittuna aikana ja toimittaa perille.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="relative bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow">
                  {step}
                </span>
                <div className="text-4xl mb-4 mt-2">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Miksi Kuljetusalusta */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Miksi Kuljetusalusta?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Nopea tilaus', desc: 'Tilaus onnistuu minuuteissa — ei puhelinsoittoja, ei odottelua.' },
              { icon: '🔒', title: 'Turvallinen maksu', desc: 'Maksat verkossa Strepen kautta. Korttitieto ei tallennu meille.' },
              { icon: '📍', title: 'Reaaliaikainen seuranta', desc: 'Seuraa kuljetuksen etenemistä reaaliajassa. (Tulossa)' },
              { icon: '⭐', title: 'Luotettavat kuljettajat', desc: 'Kaikki kuljettajat ovat tarkistettuja ammattilaisia.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Valmis tilaamaan?
          </h2>
          <p className="text-blue-100 mb-8 text-base">
            Tilaa kuljetus nyt ja saa hinta-arvio heti.
          </p>
          <Link
            href="/tilaa"
            className="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-xl text-base hover:bg-blue-50 transition-colors shadow-lg"
          >
            Tilaa kuljetus nyt
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Kuljetusalusta</p>
          <nav className="flex gap-6">
            <Link href="/tilaa" className="hover:text-white transition-colors">Tilaa kuljetus</Link>
            <Link href="/kirjaudu" className="hover:text-white transition-colors">Kirjaudu</Link>
            <Link href="/yhteystiedot" className="hover:text-white transition-colors">Ota yhteyttä</Link>
          </nav>
        </div>
      </footer>

    </div>
  );
}
