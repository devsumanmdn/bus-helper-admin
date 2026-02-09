import { http } from '@/lib/httpClient';

const API_URL = 'http://localhost:8080/api';

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface RouteStop {
  stop_id: string;
  sequence_order: number;
  arrival_offset_minutes: number;
  distance_from_prev: number;
  stop?: Stop;
}

export interface Route {
  id: string;
  name: string;
  distance_meters: number;
  overview_polyline: string;
  stops?: RouteStop[];
}

export interface Trip {
  id: string;
  bus_id: string;
  route_id: string;
  start_time: string;
  end_time: string; // Arrival time at last stop
  days: string[];
}

export interface Bus {
  id: string;
  name: string;
  vehicle_number: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  operator_id: string;
  operator_name?: string;
  operator_email?: string;
  current_route_id?: string;
  current_route?: Route;
}

export const busService = {
  async getBuses(): Promise<Bus[]> {
    const response = await http.get(`${API_URL}/buses`);

    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    return response.json();
  },

  async getBus(id: string): Promise<Bus> {
    const response = await http.get(`${API_URL}/buses/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch bus details');
    }
    return response.json();
  },

  async getTrips(busId: string): Promise<Trip[]> {
    const response = await http.get(`${API_URL}/trips?bus_id=${busId}`);

    if (!response.ok) {
      // Retrieve empty list if 404 or just empty
      // Backend returns 200 [] usually, but good to be safe if 404
      if (response.status === 404) return [];
      throw new Error('Failed to fetch trips');
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
