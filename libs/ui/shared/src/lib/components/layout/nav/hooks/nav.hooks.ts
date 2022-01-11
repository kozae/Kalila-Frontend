import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {
  determinePathParameters,
  INavbarLink,
  INavbarState,
  navbarInitialState, NavbarLinksConfiguration,
  useKalilaSession, verifyAdmin
} from "@frontend/shared-ui";

export function useRouteState(init: INavbarState, sideEffects: Array<() => void>) {
  const [activeLink, setActiveLink] = useState<string>(navbarInitialState.activeLink);
  const [messages, setMessages] = useState<[string | undefined, string | undefined]>(navbarInitialState.messages);

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      setMessages([undefined, undefined]);
      const pathParams = determinePathParameters(router);
      setTimeout(() => {
        setMessages(pathParams.messages);
        setActiveLink(pathParams.activeLink);
      }, 1000)
      sideEffects.forEach(effect => effect())
    }
  }, [router.isReady, router.pathname])
  return {activeLink, messages}
}

export function useSessionState(init: INavbarState) {
  const {session, status} = useKalilaSession();
  const [links, setLinks] = useState<INavbarLink[]>(navbarInitialState.links);
  const [loggedUser, setLoggedUser] = useState<string | undefined | null>(navbarInitialState.loggedUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(navbarInitialState.isAdmin);
  useEffect(() => {
    switch (status) {
      case "authenticated":
        setLoggedUser(session?.user?.name);
        if (verifyAdmin(session)) {
          setIsAdmin(true)
          setLinks([...NavbarLinksConfiguration.UserLinks, ...NavbarLinksConfiguration.AdminLinks])
        } else {
          setIsAdmin(false)
          setLinks(NavbarLinksConfiguration.UserLinks)
        }
        break;
      default:
        setLoggedUser(undefined);
        setLinks([])
        break;
    }
  }, [status]);

  return {links, loggedUser, isAdmin}
}
