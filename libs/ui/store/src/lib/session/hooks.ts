import { useSession, UseSessionOptions } from 'next-auth/react';
import { transformSession } from '@frontend/util';
import { useEffect } from 'react';
import { loadSession } from './slice';
import { useAppDispatch } from '../hooks';

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
