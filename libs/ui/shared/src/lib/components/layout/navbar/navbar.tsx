import styles from './navbar.module.scss';
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {KalilaLogo} from "../../kalila-logo";
import {MediaQueryContext, useKalilaSession} from "../../../util";
import {INavbarLink, NavbarLinksConfiguration} from "../../../constants";
import {determinePathParameters} from "../../../util";
import {verifyAdmin} from "../../../util";
import {NavUserControls} from "./user-controls";
import {NavControlBar} from "./nav-control-bar";
import {NavMessageBar} from "./nav-message-bar";

export interface INavbarState {
  loggedUser?: string | null,
  isAdmin: boolean,
  activeLink: string,
  showSidePan: boolean,
  links: INavbarLink[],
  banner: string[],
}

export const navbarInitialState: INavbarState = {
  isAdmin: false,
  activeLink: '/',
  showSidePan: false,
  links: [],
  banner: [],
}

export const NavbarContext = React.createContext<INavbarState>(navbarInitialState)

export const Navbar: React.FC = () => {
  const {session, status} = useKalilaSession();
  const [links, setLinks] = useState<INavbarLink[]>(navbarInitialState.links);
  const [loggedUser, setLoggedUser] = useState<string | undefined | null>(navbarInitialState.loggedUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(navbarInitialState.isAdmin);
  const [showSidePan, setShowSidePan] = useState<boolean>(navbarInitialState.showSidePan);
  const [activeLink, setActiveLink] = useState<string>(navbarInitialState.activeLink);
  const [banner, setBanner] = useState<string[]>(navbarInitialState.banner);
  const router = useRouter()

  const breakpoints = useContext(MediaQueryContext);

  useEffect(() => {
    if (router.isReady) {
      const pathParams = determinePathParameters(router);
      setBanner(pathParams.banner);
      setActiveLink(pathParams.activeLink);
    }
  }, [router.isReady])


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


  useEffect(() => setShowSidePan(
    breakpoints.s as boolean
    || breakpoints.m as boolean
    || breakpoints.l as boolean
  ), [breakpoints.s, breakpoints.m, breakpoints.l]);

  return (
    <NavbarContext.Provider value={{
      loggedUser,
      isAdmin,
      links,
      showSidePan,
      activeLink,
      banner
    }}>
      <nav className={styles['nav']}>
        <NavControlBar/>
        <NavMessageBar/>
      </nav>
    </NavbarContext.Provider>
  );
}


