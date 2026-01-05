const API_URL = 'http://localhost:8080/api';

export interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
}

export const userService = {
  async getUsers(token: string): Promise<User[]> {
    console.log('[UserService] Fetching users with token:', token.substring(0, 10) + '...');
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },
};
