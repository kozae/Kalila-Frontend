import {KalilaSession} from "@frontend/shared-ui-layout";


export const verifyAdmin = (session: KalilaSession | null): boolean => {
  if (session && session.user && session.user.roles) {
    return session.user.roles.has("admin");
  }
  return false;
}
