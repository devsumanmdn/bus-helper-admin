import { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { usePrevious } from './usePrevious';

interface BusLocation {
  bus_id: string;
  lat: number;
  lng: number;
}

export function useRealtimeBus(busId: string | null, token: string) {
  const [location, setLocation] = useState<BusLocation | null>(null);
  
  // Initialize status based on props to ensure correct initial state
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>(
    (busId && token) ? 'connecting' : 'disconnected'
  );

  const prevBusId = usePrevious(busId);
  const prevToken = usePrevious(token);

  useEffect(() => {
    // Reset status if props change (and it's not the first render)
    if ((prevBusId && busId !== prevBusId) || (prevToken && token !== prevToken)) {
      // eslint-disable-next-line
      setStatus('connecting');
      setLocation(null);
    }
  }, [busId, token, prevBusId, prevToken]);

  useEffect(() => {
    if (!busId || !token) {
      return;
    }

    // Use localhost for web, or your remote URL
    const url = `http://localhost:8080/api/stream?bus_id=${busId}`;
    
    // Pass JWT in headers using the Polyfill
    const evtSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    evtSource.onopen = () => {
      console.log(`[SSE] Connected to stream for Bus ${busId}`);
      setStatus('connected');
    };

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] Update:', data);
        setLocation(data);
      } catch (err) {
        console.error('[SSE] Failed to parse data', err);
      }
    };

    evtSource.onerror = (err) => {
      console.error('[SSE] Error:', err);
      setStatus('error');
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, [busId, token]);

  return { location, status };
}
