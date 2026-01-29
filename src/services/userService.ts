import { http } from '@/lib/httpClient';

const API_URL = 'http://localhost:8080/api';

export interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    console.log('[UserService] Fetching users');
    const response = await http.get(`${API_URL}/users`);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },
};
