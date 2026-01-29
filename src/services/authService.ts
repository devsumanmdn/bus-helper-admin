import { User } from './userService';

const API_URL = 'http://localhost:8080/api/auth';

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Important: Include credentials to receive HttpOnly cookies
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();

    // Store refresh token in localStorage
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data;
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Google Login failed');
    }

    const data = await response.json();

    // Store refresh token in localStorage
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data;
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // Clear invalid refresh token
      localStorage.removeItem('refresh_token');
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    // Store new refresh token
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data;
  },

  async logout(): Promise<void> {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    // Clear refresh token from storage
    localStorage.removeItem('refresh_token');
  },

  async me(token?: string): Promise<User> {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/me`, {
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  },

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
};
