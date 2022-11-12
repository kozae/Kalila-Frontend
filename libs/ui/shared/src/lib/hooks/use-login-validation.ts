import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { clearSession, useAppDispatch } from '../store';

export function useLoginValidation() {
  const { data, status } = useSession();
  useEffect(() => {
    if (status !== 'loading' && !data) {
      signIn('keycloak', { redirect: true });
    } else if (data && data['error'] === 'RefreshAccessTokenError') {
      signIn('keycloak', { redirect: true });
    }
  }, [data, status]);
}

export function useAccessTokenValidation(accessToken: string | undefined) {
  const { error } = useSWR(
    accessToken && 'LoginValidation',
    () =>
      axios.get(`${process.env['NEXT_PUBLIC_API_URL']}Auth`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      shouldRetryOnError: false,
      refreshInterval: 600000, // 10 minutes
    }
  );
  const { pathname } = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (error?.response?.status === 401 && pathname !== '/') {
      signIn('keycloak', { redirect: true });
    } else {
      dispatch(clearSession);
    }
  }, [error, pathname]);
}
