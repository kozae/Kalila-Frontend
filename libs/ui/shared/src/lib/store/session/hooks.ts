import { clearSession, loadSession, useAppDispatch } from '@frontend/shared-ui';
import { useEffect } from 'react';

import { ISession } from '@frontend/util';
import { useSession } from 'next-auth/react';

export function useKalilaSession() {
  const session = useSession();
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
    Username: session?.data?.user?.username,
    Name: session?.data?.user?.name,
    Picture: session?.data?.user?.picture,
    Email: session?.data?.user?.email,
    Roles: session?.data?.user?.roles,
    AccessToken: session?.data?.access,
  };
}
