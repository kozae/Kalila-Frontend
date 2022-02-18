import { ISODateString, Session } from 'next-auth/core/types';
import { stringHasValue } from '@frontend/util';

export interface IKalilaUser {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string | null;
  roles?: Array<string> | null;
}

export interface IKalilaSession extends Record<string, unknown> {
  user?: IKalilaUser;
  expires: ISODateString;
}

export type KalilaSessionContextValue =
  | {
      session: null;
      status?: 'authenticated' | 'loading' | 'unauthenticated';
      accessToken: null;
    }
  | {
      session: IKalilaSession;
      status?: 'authenticated' | 'loading' | 'unauthenticated';
      accessToken: string;
    };

export function transformSession(
  data: Session | null | undefined,
  status?: 'authenticated' | 'loading' | 'unauthenticated'
): KalilaSessionContextValue {
  if (data) {
    const { user, expires, access } = data as {
      user: any;
      expires: ISODateString;
      access: string;
    };
    if (user) {
      const roles = stringHasValue(user.roles)
        ? user.roles.split(',').map((r: string) => r.trim())
        : null;
      return {
        session: {
          user: {
            name: user.name as string | null,
            username: user.username as string | null,
            email: user.email as string | null,
            image: user.image as string | null,
            token: user.token as string | null,
            roles: roles as Array<string> | null,
          },
          expires,
        },
        status: status ?? 'unauthenticated',
        accessToken: access,
      };
    }
    return { session: null, status, accessToken: null };
  } else {
    return { session: null, status, accessToken: null };
  }
}
