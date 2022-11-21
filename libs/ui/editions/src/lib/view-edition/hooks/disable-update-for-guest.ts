import { useBehaviorOptionsMethods } from '../contexts';
import { useEffect } from 'react';

export function useDisableUpdateForGuest(username: string | undefined) {
  const { setEnableRealTimeUpdates } = useBehaviorOptionsMethods();
  useEffect(() => {
    if (username && username.includes('guest')) {
      setEnableRealTimeUpdates(false);
    }
  }, [username]);
}
