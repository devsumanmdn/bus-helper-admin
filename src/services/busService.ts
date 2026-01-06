const API_URL = 'http://localhost:8080/api';

export interface Bus {
  id: string;
  name: string;
  vehicle_number: string;
  status: 'approved' | 'pending' | 'rejected';
  operator_id: string;
}

export const busService = {
  async getBuses(): Promise<Bus[]> {
    const response = await fetch(`${API_URL}/buses`, {
      credentials: 'include'
    }); // Public or cookie-based if strictly protected
    
    // Note: If backend allows public access for getBuses, credentials might not be strictly needed unless identifying user.
    // Based on previous conv, getBuses might be public, but let's include credentials just in case backend checks user role.
    
    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    return response.json();
  },

  async updateBusStatus(id: string, status: string): Promise<Bus> {
    const response = await fetch(`${API_URL}/buses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update bus status');
    }

    return response.json();
  }
};
