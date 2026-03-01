import { useEffect, useState, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { usePrevious } from './usePrevious';

interface BusLocation {
  bus_id: string;
  lat: number;
  lng: number;
  status_text?: string;
}

export function useRealtimeBus(busId: string | null) {
  const [location, setLocation] = useState<BusLocation | null>(null);

  // Initialize status based on props to ensure correct initial state
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>(
    (busId) ? 'connecting' : 'disconnected'
  );

  const prevBusId = usePrevious(busId);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const evtSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    // Reset status if props change (and it's not the first render)
    if ((prevBusId && busId !== prevBusId)) {
      // eslint-disable-next-line
      setStatus('connecting');
      setLocation(null);
    }
  }, [busId, prevBusId,]);

  useEffect(() => {
    if (!busId) {
      return;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const connectSSE = () => {
      // Use localhost for web, or your remote URL
      const url = `http://localhost:8080/api/stream?bus_id=${busId}`;

      // Pass JWT in headers using the Polyfill
      const evtSource = new EventSourcePolyfill(url, {
        withCredentials: true,
        heartbeatTimeout: 60000, // 60 seconds before considering connection dead
      });

      evtSourceRef.current = evtSource;

      evtSource.onopen = () => {
        console.log(`[SSE] Connected to stream for Bus ${busId}`);
        setStatus('connected');
      };

      evtSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[SSE] Update:', data);
          setLocation(data);
          // Reset to connected status if we receive data
          setStatus('connected');
        } catch (err) {
          console.error('[SSE] Failed to parse data', err);
        }
      };

      evtSource.onerror = (err: any) => {
        console.log('[SSE] Connection interrupted, will reconnect...', err);

        // Close the current connection
        evtSource.close();

        // Only set error status if it's an actual error (not a timeout/reconnection)
        // The event-source-polyfill throws errors on timeout, but these are expected
        if (err?.status && err.status >= 400) {
          // Actual HTTP error
          console.error('[SSE] HTTP Error:', err.status);
          setStatus('error');
        } else {
          // Timeout or network issue - stay in connecting state
          setStatus('connecting');

          // Attempt to reconnect after 2 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('[SSE] Reconnecting...');
            connectSSE();
          }, 2000);
        }
      };
    };

    // Initial connection
    connectSSE();

    return () => {
      // Cleanup on unmount or busId change
      if (evtSourceRef.current) {
        evtSourceRef.current.close();
        evtSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [busId]);

  return { location, status };
}
