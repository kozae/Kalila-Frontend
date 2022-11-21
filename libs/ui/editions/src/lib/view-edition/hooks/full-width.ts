import { useEffect } from 'react';

export function useFullWidth(
  enableMaxWidth: () => void,
  disableMaxWidth: () => void
) {
  useEffect(() => {
    enableMaxWidth();
    return () => {
      disableMaxWidth();
    };
  }, []);
}
