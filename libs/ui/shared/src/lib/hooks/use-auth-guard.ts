import useSWR from 'swr';
import { useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';

export function useAuthGuard() {
  const { data: isLoggedIn, isValidating } = useSWR<boolean>(
    'IsAuthenticated',
    () =>
      axios.get('/server/web/Session/IsAuthenticated').then(({ data }) => data)
  );
  useEffect(() => {
    if (!isValidating && !isLoggedIn) {
      Router.push('/server/web/Login');
    }
  }, [isLoggedIn, isValidating]);
}
