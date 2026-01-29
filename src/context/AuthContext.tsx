'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/services/userService';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { },
  googleLogin: async () => { },
  logout: async () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    // Set up periodic token refresh (every 10 minutes)
    // Access token expires in 15 minutes, so refresh at 10 minutes to be safe
    const refreshInterval = setInterval(async () => {
      const refreshToken = authService.getStoredRefreshToken();

      if (refreshToken) {
        try {
          console.log('[AuthContext] Refreshing token...');
          await authService.refresh();
          console.log('[AuthContext] Token refreshed successfully');
        } catch (error) {
          console.error('[AuthContext] Failed to refresh token:', error);
          // If refresh fails, log out the user
          setUser(null);
          router.push('/admin/login');
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const checkUser = async () => {
    try {
      const user = await authService.me();
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    await authService.login(email, pass);
    await checkUser();
    router.push('/admin');
  };

  const googleLogin = async (idToken: string) => {
    await authService.googleLogin(idToken);
    await checkUser();
    router.push('/admin');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
