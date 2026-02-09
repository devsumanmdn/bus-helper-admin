'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { busService, Bus } from '@/services/busService';
import Link from 'next/link';

export default function BusesPage() {
  const { user } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await busService.getBuses();
      setBuses(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (busId: string, status: string) => {
    if (!user) return;
    try {
      setProcessingId(busId);

      const updatedBus = await busService.updateBusStatus(busId, status);

      // Update local state
      setBuses(buses.map(b => b.id === busId ? { ...b, status: updatedBus.status } : b));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to update status: ${err.message}`);
      } else {
        alert('Failed to update status: Unknown error');
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && buses.length === 0) return <div className="p-4">Loading buses...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bus Fleet Management</h1>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <Link href={`/admin/buses/${bus.id}`} className="text-indigo-600 hover:text-indigo-900 hover:underline">
                        {bus.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{bus.vehicle_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bus.operator_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{bus.operator_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bus.status === 'approved' ? 'bg-green-100 text-green-800' :
                        bus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          bus.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/buses/${bus.id}`} className="text-gray-600 hover:text-gray-900 mr-2">
                      View
                    </Link>
                    {bus.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(bus.id, 'approved')}
                          disabled={processingId === bus.id}
                          className="text-green-600 hover:text-green-900 font-bold disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(bus.id, 'rejected')}
                          disabled={processingId === bus.id}
                          className="text-red-600 hover:text-red-900 font-bold disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {bus.status === 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(bus.id, 'rejected')}
                        disabled={processingId === bus.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    )}
                    {bus.status === 'rejected' && (
                      <button
                        onClick={() => handleStatusUpdate(bus.id, 'approved')}
                        disabled={processingId === bus.id}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        Re-Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
