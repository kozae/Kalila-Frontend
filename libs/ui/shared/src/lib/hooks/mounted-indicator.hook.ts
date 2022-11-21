import { useBoolean } from '@frontend/shared-ui';
import { useEffect } from 'react';

export function useMountedIndicator() {
  const [mounted, { setTrue: setMounted }] = useBoolean(false);
  useEffect(() => {
    setMounted();
  }, []);
  return mounted;
}
