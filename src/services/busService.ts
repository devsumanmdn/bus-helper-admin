import { http } from '@/lib/httpClient';

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
    const response = await http.get(`${API_URL}/buses`);

    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    return response.json();
  },

  async updateBusStatus(id: string, status: string): Promise<Bus> {
    const response = await http.put(`${API_URL}/buses/${id}`, { status });

    if (!response.ok) {
      throw new Error('Failed to update bus status');
    }

    return response.json();
  }
};
