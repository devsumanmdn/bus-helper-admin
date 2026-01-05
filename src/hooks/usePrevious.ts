import { useState, useEffect } from 'react';

/**
 * Hook to store the previous value of a state or prop.
 */
export function usePrevious<T>(value: T): T | undefined {
  const [prev, setPrev] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrev(value);
  }, [value]);

  return prev;
}
