import {useSession} from "next-auth/react";
import {UseSessionOptions} from "next-auth/react/types";
import {ISODateString} from "next-auth/core/types";
import {transformSession} from "@frontend/util";

export interface IKalilaSession extends Record<string, unknown> {
  user?: {
    name?: string | null;
    username?: string | null;
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
  return transformSession(data, status)
}
