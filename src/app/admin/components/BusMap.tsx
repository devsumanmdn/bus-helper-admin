'use client';

import { useRealtimeBus } from '@/hooks/useRealtimeBus';

interface BusMapProps {
  busId: string;
}

// TODO: Replace with real Google Maps integration
export default function BusMap({ busId }: BusMapProps) {
  // HARDCODED TOKEN for Dev Phase - In prod, fetch from your auth system
  // Run `go run scripts/gen_token.go` to generate a fresh one if this expires (72h)
  const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNzY3Nzg0NDk1LCJuYW1lIjoiSm9obiBEb2UifQ.YhtKVBuKTakUbuuh3DwzGds9qvC4T2rxe-48WfPLMHk";

  const { location, status } = useRealtimeBus(busId, DEV_TOKEN);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mt-4">
      <h3 className="font-semibold mb-2">Realtime Tracker (Bus {busId})</h3>
      <div className="text-sm text-gray-600 mb-2">
        Status: <span className={`font-mono ${status === 'connected' ? 'text-green-600' : 'text-amber-600'}`}>{status}</span>
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
