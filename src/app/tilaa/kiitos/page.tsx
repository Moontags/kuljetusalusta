import Link from 'next/link';

export default function KiitosPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Tilauksesi on vastaanotettu!
        </h1>
        <p className="text-gray-500 mb-8">
          Kuljettaja ottaa sinuun yhteyttä pian vahvistuksen kera.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Takaisin etusivulle
        </Link>
      </div>
    </div>
  );
}
