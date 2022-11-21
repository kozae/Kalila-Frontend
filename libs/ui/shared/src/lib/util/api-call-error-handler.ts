import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { signOut, signIn } from 'next-auth/react';

export function useApiCallErrorHandler() {
  const { pathname } = useRouter();
  return useCallback(apiCallErrorHandler(pathname), [pathname]);
}

function apiCallErrorHandler(pathname: string) {
  return async (err: AxiosError) => {
    if (err.response?.status === 401) {
      if (pathname === '/') {
        await signOut({ redirect: false });
      } else {
        await signIn('keycloak', { redirect: true });
      }
    } else {
      throw err;
    }
  };
}
