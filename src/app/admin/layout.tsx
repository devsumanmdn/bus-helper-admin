'use client';

import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from '@/components/ProtectedRoute';
import { usePathname } from 'next/navigation';

import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID  ?? ""}>
      <AuthProvider>
        {isLoginPage ? (
          children
        ) : (
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-gray-100">
              <aside className="hidden w-64 md:block">
                {/* Sidebar Component */}
                <div className="h-full">
                   <Sidebar />
                </div>
              </aside>
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
          </ProtectedRoute>
        )}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
