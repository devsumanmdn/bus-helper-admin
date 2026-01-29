'use client';

import { useRealtimeBus } from '@/hooks/useRealtimeBus';
import { Bus } from '@/services/busService';

// TODO: Replace with real Google Maps integration
export default function BusMap({ bus }: { bus: Bus }) {

  const { location, status } = useRealtimeBus(bus.id);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mt-4">
      <h3 className="font-semibold mb-2">Realtime Tracker ({bus.name})</h3>
      <div className="text-sm text-gray-600 mb-2">
        Status: <span className={`font-mono ${getStatusColor()}`}>{getStatusMessage()}</span>
      </div>

      {location ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="block text-xs uppercase text-gray-400">Latitude</span>
            <span className="font-mono text-lg">{location.lat.toFixed(6)}</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="block text-xs uppercase text-gray-400">Longitude</span>
            <span className="font-mono text-lg">{location.lng.toFixed(6)}</span>
          </div>
          <div className="text-xs text-gray-400 col-span-2">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="text-gray-400 italic">Waiting for location updates...</div>
      )}
    </div>
  );
}
