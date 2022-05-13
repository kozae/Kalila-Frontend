import useSWR from 'swr';
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export function useAuthGuard() {
  const { data: isLoggedIn, isValidating } = useSWR<boolean>(
    'IsAuthenticated',
    () =>
      axios.get('/server/web/Session/IsAuthenticated').then(({ data }) => data)
  );
  const router = useRouter();
  useEffect(() => {
    if (!isValidating && !isLoggedIn) {
      router.push({
        pathname: '/server/web/Login',
        query: {
          redirectUrl: router.asPath,
        },
      });
    }
  }, [isLoggedIn, isValidating, router.asPath]);
}
