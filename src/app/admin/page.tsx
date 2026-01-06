'use client';

import BusMap from './components/BusMap';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { busService } from '@/services/busService';
import { userService } from '@/services/userService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBuses: 0,
    approvedBuses: 0,
    totalUsers: 0,
    drivers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Buses
        const buses = await busService.getBuses();
        
        // Fetch Users (only if user is logged in, which they should be)
        let users: import('@/services/userService').User[] = [];
        if (user) {
          try {
            users = await userService.getUsers();
          } catch (e) {
            console.error("Failed to fetch users for stats", e);
          }
        }

        setStats({
          totalBuses: buses.length,
          approvedBuses: buses.filter(b => b.status === 'approved').length,
          totalUsers: users.length,
          drivers: users.filter(u => u.role === 'driver').length
        });
      } catch (error) {
        console.error("Error loading stats", error);
      }
    };

    if (user) {
        fetchStats();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Buses</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.totalBuses}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Fleet</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{stats.approvedBuses}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Users</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.totalUsers}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Drivers</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{stats.drivers}</dd>
        </div>
      </div>

      {/* Realtime Map Integration */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Real-time Bus Tracking (Preview)</h2>
        <BusMap busId="55" />
      </div>
    </div>
  );
}
