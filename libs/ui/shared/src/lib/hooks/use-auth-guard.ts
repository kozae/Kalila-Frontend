import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

export function useAuthGuard() {
  const { data, status } = useSession();
  useEffect(() => {
    if (status !== 'loading' && !data) {
      signIn('keycloak', { redirect: true });
    } else if (data && data['error'] === 'RefreshAccessTokenError') {
      signIn('keycloak', { redirect: true });
    }
  }, [data, status]);
}
