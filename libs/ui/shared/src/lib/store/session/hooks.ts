import {
  clearSession,
  loadSession,
  loadUsers,
  useAppDispatch,
} from '@frontend/shared-ui';
import { useEffect } from 'react';

import { ISession, transformKeycloakUsers } from '@frontend/util';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import useSWRImmutable from 'swr/immutable';

export function useKalilaSession() {
  const session = useSession();
  const dispatch = useAppDispatch();
  const { data } = useSWRImmutable('KeycloakUsers', () =>
    axios.get('/api/keycloak').then((r) => r.data)
  );

  useEffect(() => {
    if (data) {
      dispatch(loadUsers(transformKeycloakUsers(data)));
    }
  }, [data]);

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
    Username: session?.data?.user?.username,
    Name: session?.data?.user?.name,
    Picture: session?.data?.user?.picture,
    Email: session?.data?.user?.email,
    Roles: session?.data?.user?.roles,
  };
}
