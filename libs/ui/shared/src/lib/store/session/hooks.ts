import { clearSession, useAppDispatch } from '@frontend/shared-ui';
import { useEffect } from 'react';
import { loadSession } from './slice';
import useSWR from 'swr';
import { ISession } from '@frontend/util';
import axios from 'axios';

export function useKalilaSession() {
  const { data: session } = useSWR(
    'SessionData',
    () => axios.get('/api/auth/kalila-session').then((res) => res.data),
    {
      refreshInterval: 300000,
    }
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (session) {
      const transformed = transform(session);
      dispatch(
        loadSession({
          session: transformed,
          authenticated: !!transformed?.Username,
        })
      );
    } else {
      dispatch(clearSession);
    }
  }, [session]);
}

function transform(session: any): ISession {
  return {
    Username: session?.user?.nickname,
    Name: session?.user?.nickname,
    Picture: session?.user?.picture,
    Email: session?.user?.email,
    Roles:
      session?.user !== undefined
        ? session?.user['https://kalila-dev.kozae.de/roles']
        : [],
    AccessToken: session.accessToken,
  };
}
