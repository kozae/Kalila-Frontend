import {stringHasValue} from "@frontend/util";

export interface IKalilaSession extends Record<string, unknown> {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string | null;
    roles?: Set<string> | null;
  };
  expires: string;
}

export type KalilaSessionContextValue =
  { session: null; status: "loading" | "unauthenticated" }
  |
  { session: IKalilaSession; status: "authenticated" | "loading" | "unauthenticated" }

export function useKalilaSession<R extends boolean>(): KalilaSessionContextValue {
  // return {
  //   session: {
  //     user: {
  //       name: 'Mahmoud Kozae',
  //       roles: new Set<string>(['admin']),
  //     },
  //     expires: ''
  //   },
  //   status: "authenticated"
  // }
  return {
    session: null,
    status: "unauthenticated"
  }
}
