import { RealmApp } from './realm-app-provider';
import { useEffect } from 'react';
import { setCookie } from 'nookies';

export function useAuthCookie(app: RealmApp | null) {
  useEffect(() => {
    const user = app?.currentUser;
    if (user && user !== null) {
      setCookie(null, 'accessToken', user.accessToken ?? '');
      // Refresh token before session expires
      const TWENTY_MIN_MS = 1200000;
      const resetAccessToken = setInterval(async () => {
        await app?.currentUser?.refreshCustomData();
        setCookie(null, 'accessToken', user.accessToken ?? '');
      }, TWENTY_MIN_MS);
      // Clear interval setting access token whenever component unmounts or
      // there's a change in user.
      return () => clearInterval(resetAccessToken);
    }
  }, [app?.currentUser]);
}
