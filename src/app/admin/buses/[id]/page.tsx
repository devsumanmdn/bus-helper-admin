'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { busService, Bus, Trip } from '@/services/busService';
import Link from 'next/link';

export default function BusDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [bus, setBus] = useState<Bus | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const [busData, tripsData] = await Promise.all([
                busService.getBus(id),
                busService.getTrips(id)
            ]);
            setBus(busData);
            setTrips(tripsData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to load details');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!bus) return <div className="p-8 text-center text-gray-500">Bus not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Bus Details</h1>
                <Link
                    href="/admin/buses"
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    &larr; Back to Fleet
                </Link>
            </div>

            <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium text-lg">{bus.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Vehicle Number</p>
                            <p className="font-medium text-lg">{bus.vehicle_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${bus.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    bus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        bus.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                                {bus.status.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div>
                                <p className="text-sm text-gray-500">Operator</p>
                                <p className="font-medium text-md">{bus.operator_name || 'Unknown'}</p>
                                <p className="text-sm text-gray-500">{bus.operator_email}</p>
                                <p className="text-xs text-gray-400 font-mono mt-1">ID: {bus.operator_id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route Details */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Route</h2>
                    {bus.current_route ? (
                        <div>
                            <p className="font-medium text-lg mb-2">{bus.current_route.name}</p>
                            <div className="flex space-x-4 text-sm text-gray-500 mb-4">
                                <span>Distance: {(bus.current_route.distance_meters / 1000).toFixed(2)} km</span>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-md font-medium text-gray-700 mb-2">Stops</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seq</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stop Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Offset (min)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bus.current_route.stops?.map((stopArg) => (
                                                <tr key={stopArg.stop_id}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{stopArg.sequence_order}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{stopArg.stop?.name || 'Unknown'}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{stopArg.arrival_offset_minutes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No route assigned.</p>
                    )}
                </div>

                {/* Schedules */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Schedules (Trips)</h2>
                    {trips.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trips.map((trip) => (
                                <div key={trip.id} className="border border-gray-200 rounded p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-lg">{trip.start_time} - {trip.end_time}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Days: <span className="font-medium text-gray-700">{trip.days.join(', ')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No schedules found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
