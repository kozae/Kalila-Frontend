import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { getApp } from 'realm-web';
import { useAuthCookie } from './use-auth-cookie';

export type RealmApp = Realm.App<
  globalThis.Realm.DefaultFunctionsFactory &
    globalThis.Realm.BaseFunctionsFactory,
  any
>;

const RealmAppContext = createContext<{ app: RealmApp | null }>({ app: null });

export const useRealmApp = () => useContext(RealmAppContext);

export function RealmAppProvider({ children }: { children?: ReactNode }) {
  const [app, setApp] = useState<RealmApp | null>(null);

  useEffect(() => {
    setApp(getApp(process?.env?.['NEXT_PUBLIC_APP_ID'] as string));
  }, []);

  useAuthCookie(app);

  const value = useMemo(
    () => ({
      app,
    }),
    [app]
  );

  return (
    <RealmAppContext.Provider value={value}>
      {children}
    </RealmAppContext.Provider>
  );
}
