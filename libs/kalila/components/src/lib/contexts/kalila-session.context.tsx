import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ISession, IUser } from '@frontend/util';
import useSWRImmutable from 'swr/immutable';
import { Collection, User, useRealmApp } from '@frontend/kalila/real-app';

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

  const { app } = useRealmApp();

  const { data: usersData } = useSWRImmutable(
    app && app.currentUser && 'RealmUsers',
    async () => {
      const mongo = app!.currentUser!.mongoClient('mongodb-atlas');
      return await mongo
        .db('MuhaqiqDB')
        .collection<User>(Collection.Users)
        .find({});
    }
  );

  useEffect(() => {
    if (usersData) {
      setUsers(transformRealmUsers(usersData));
    }
  }, [usersData]);

  useEffect(() => {
    const _session = app?.currentUser;
    if (_session) {
      setSession(transformRealUser(_session));
      setAuthenticated(true);
    } else {
      setSession(null);
      setAuthenticated(false);
    }
  }, [app?.currentUser]);

  return (
    <KalilaSessionMethodsContext.Provider value={methods}>
      <KalilaSessionDataContext.Provider value={data}>
        {children}
      </KalilaSessionDataContext.Provider>
    </KalilaSessionMethodsContext.Provider>
  );
};

export function transformRealUser(
  session: Realm.User<
    Realm.DefaultFunctionsFactory & Realm.BaseFunctionsFactory,
    any,
    Realm.DefaultUserProfileData
  >
): ISession {
  return {
    Username: session.customData.username,
    Name: `${session.customData.firstName} ${session.customData.lastName}`,
    Picture: session.customData.picture,
    Email: session.profile.email,
    Roles: session.customData.roles,
  };
}

export function transformRealmUsers(data: User[]): IUser[] {
  return data.map((u) => ({
    firstName: u.firstName,
    lastName: u.lastName,
    username: u.username,
    roles: u.roles,
    picture: u.picture,
  }));
}
