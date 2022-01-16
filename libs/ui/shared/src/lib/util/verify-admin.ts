import {IKalilaSession} from "../hooks";


export const verifyAdmin = (session: IKalilaSession | null): boolean => {
  if (session && session.user && session.user.roles) {
    return session.user.roles.has("admin");
  }
  return false;
}
