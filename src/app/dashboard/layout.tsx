import LogoutButton from '@/components/LogoutButton';
import SidebarNav from '@/components/dashboard/SidebarNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">Kuljetusalusta</span>
        <LogoutButton />
      </header>

      <div className="sm:hidden bg-white border-b border-gray-200 px-3 py-2">
        <SidebarNav />
      </div>

      <div className="flex">
        <aside className="hidden sm:block w-56 shrink-0 min-h-[calc(100vh-65px)] bg-white border-r border-gray-200 p-3">
          <SidebarNav />
        </aside>
        <main className="flex-1 px-6 py-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
