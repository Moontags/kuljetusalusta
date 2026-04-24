import { loginAction } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kuljetusalusta</h1>
          <p className="text-gray-500 mt-2">Kirjaudu tilillesi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Kirjaudu sisään</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sähköposti
              </label>
              <input
                type="email"
                name="email"
                placeholder="yritys@esimerkki.fi"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salasana
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              Kirjaudu sisään
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ei vielä tiliä?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Rekisteröidy tänne
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
