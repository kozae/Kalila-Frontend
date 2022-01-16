import {ISODateString, Session} from "next-auth/core/types";
import {stringHasValue} from "@frontend/util";
import {KalilaSessionContextValue} from "@frontend/shared-ui";

export function transformSession(data: Session | null | undefined, status?: "authenticated" | "loading" | "unauthenticated"): KalilaSessionContextValue{
  if (data) {
    const {user, expires, access} = data as { user: any, expires: ISODateString, access: string }
    if (user) {
      const roles = stringHasValue(user.roles) ? new Set<string>(user.roles.split(',').map((r: string) => r.trim())) : null;
      return {
        session: {
          user: {
            name: user.name as string | null,
            username: user.username as string | null,
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
