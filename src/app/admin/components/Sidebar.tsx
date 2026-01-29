'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Buses', href: '/admin/buses' },
  { name: 'Users', href: '/admin/users' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white shadow-xl">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider">BUS ADMIN</h1>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.full_name || 'Admin'}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
