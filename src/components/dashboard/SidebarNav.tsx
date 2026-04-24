'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Yhteenveto' },
  { href: '/dashboard/vehicles', label: 'Kalusto' },
  { href: '/dashboard/pricing', label: 'Hinnoittelu' },
  { href: '/dashboard/bookings', label: 'Varaukset' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-row sm:flex-col gap-1 overflow-x-auto">
      {navItems.map(({ href, label }) => {
        const isActive =
          href === '/dashboard' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
