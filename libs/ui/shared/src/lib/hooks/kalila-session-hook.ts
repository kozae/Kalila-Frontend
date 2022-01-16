import {useSession} from "next-auth/react";
import {UseSessionOptions} from "next-auth/react/types";
import {ISODateString} from "next-auth/core/types";
import {stringHasValue} from "@frontend/util";

export interface IKalilaSession extends Record<string, unknown> {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string | null;
    roles?: Set<string> | null;
  };
  expires: ISODateString;
}

export type KalilaSessionContextValue =
  { session: null; status: "authenticated" | "loading" | "unauthenticated", accessToken: null }
  |
  { session: IKalilaSession; status: "authenticated" | "loading" | "unauthenticated"; accessToken: string }

export function useKalilaSession<R extends boolean>(options?: UseSessionOptions<R>): KalilaSessionContextValue {
  const {data, status} = useSession(options)
  if (data) {
    const {user, expires, access} = data as { user: any, expires: ISODateString, access: string }
    if (user) {
      const roles = stringHasValue(user.roles) ? new Set<string>(user.roles.split(',').map((r: string) => r.trim())) : null;
      return {
        session: {
          user: {
            name: user.name as string | null,
            email: user.email as string | null,
            image: user.image as string | null,
            token: user.token as string | null,
            roles: roles as Set<string> | null,
          },
          expires
        },
        status,
        accessToken: access
      }
    }
    return {session: null, status, accessToken: null}
  } else {
    return {session: null, status, accessToken: null}
  }
}
