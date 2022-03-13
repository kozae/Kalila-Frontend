import { useSession, UseSessionOptions } from 'next-auth/react';
import { transformSession } from '@frontend/util';
import { useAppDispatch } from '@frontend/shared-ui';
import { useEffect } from 'react';
import { loadSession } from './slice';

export function useKalilaSession<R extends boolean>(
  options?: UseSessionOptions<R>
) {
  const { data, status } = useSession(options);
  const session = transformSession(data, status);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadSession(session));
  }, [session]);
}
