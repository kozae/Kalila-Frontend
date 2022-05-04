import { clearSession, useAppDispatch } from '@frontend/shared-ui';
import { useEffect } from 'react';
import { loadSession } from './slice';
import useSWR from 'swr';
import axios from 'axios';

export function useKalilaSession() {
  const { data: session } = useSWR(
    'SessionData',
    () => axios.get('/server/web/Session').then(({ data }) => data),
    {
      refreshInterval: 300000,
    }
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (session) {
      dispatch(
        loadSession({
          session: session,
          authenticated: !!session.Username,
        })
      );
    } else {
      dispatch(clearSession);
    }
  }, [session]);
}
