import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ISession, IUser, transformKeycloakUsers } from '@frontend/util';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import useSWRImmutable from 'swr/immutable';

export interface ISessionData {
  session: ISession | null;
  authenticated: boolean;
  users: IUser[];
}

export interface ISessionMethods {
  loadSession: (session: ISession) => void;
  clearSession: () => void;
  setAuthenticated: (v: boolean) => void;
  loadUsers: (users: IUser[]) => void;
  clearUsers: () => void;
}

const KalilaSessionDataContext = createContext<ISessionData>({
  session: null,
  authenticated: false,
  users: [],
});

export const useKalilaSession = () => useContext(KalilaSessionDataContext);

const KalilaSessionMethodsContext = createContext<ISessionMethods>({
  loadSession: (session: ISession) => {},
  clearSession: () => {},
  setAuthenticated: (v: boolean) => {},
  loadUsers: (users: IUser[]) => {},
  clearUsers: () => {},
});

export const useKalilaSessionMethods = () =>
  useContext(KalilaSessionMethodsContext);

export const KalilaSessionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<ISession | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const data = useMemo(
    () => ({ session, users, authenticated }),
    [session, users, authenticated]
  );
  const methods = useMemo(
    () => ({
      loadSession: (session: ISession) => setSession(session),
      clearSession: () => setSession(null),
      loadUsers: (users: IUser[]) => setUsers(users),
      clearUsers: () => setUsers([]),
      setAuthenticated,
    }),
    [setSession, setUsers, setAuthenticated]
  );

  const { data: usersData } = useSWRImmutable('KeycloakUsers', () =>
    axios.get('/api/keycloak').then((r) => r.data)
  );

  useEffect(() => {
    if (usersData) {
      setUsers(transformKeycloakUsers(usersData));
    }
  }, [usersData]);

  const _session = useSession();
  useEffect(() => {
    if (_session) {
      setSession(transform(_session));
      setAuthenticated(true);
    } else {
      setSession(null);
      setAuthenticated(false);
    }
  }, [_session]);

  return (
    <KalilaSessionMethodsContext.Provider value={methods}>
      <KalilaSessionDataContext.Provider value={data}>
        {children}
      </KalilaSessionDataContext.Provider>
    </KalilaSessionMethodsContext.Provider>
  );
};

function transform(session: any): ISession {
  return {
    Username: session?.data?.user?.username,
    Name: session?.data?.user?.name,
    Picture: session?.data?.user?.picture,
    Email: session?.data?.user?.email,
    Roles: session?.data?.user?.roles,
  };
}
