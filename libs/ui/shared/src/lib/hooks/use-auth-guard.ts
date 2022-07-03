import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

export function useAuthGuard() {
  const { user, isLoading } = useUser();
  const { push } = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      push('/api/auth/login');
    }
  }, [user, isLoading]);
}
