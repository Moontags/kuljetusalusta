'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
    >
      Kirjaudu ulos
    </button>
  );
}
