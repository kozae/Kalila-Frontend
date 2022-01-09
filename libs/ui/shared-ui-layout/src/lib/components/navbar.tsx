import styles from './navbar.module.scss';
import React, {useContext, useEffect, useState} from "react";
import {useKalilaSession} from "../util/kalila-session-hook";
import {MediaQueryContext} from "../util/media-query-context";
import {INavbarLink, NavbarState} from "../constants/navbar-state";
import {verifyAdmin} from "../util/verify-admin";
import {useRouter} from "next/router";
import {determinePathParameters} from "../util/determine-path-parameters";
import {KalilaLogo} from "./kalila-logo";
import {DefaultButton, Persona, PersonaInitialsColor, PersonaSize, PrimaryButton} from "@fluentui/react";
import {signIn, signOut} from "next-auth/react";

const logOutButton = (loggedUser: string) => (
  <div className={styles['nav__top-row__user-controls']}>
    <Persona  imageInitials={'MK'}
              secondaryText={'Admin'}
              initialsColor={PersonaInitialsColor.green}
              text={loggedUser}
              size={PersonaSize.size40}/>
    <DefaultButton onClick={() => signOut()} iconProps={{iconName: 'UserRemove'}} text="Sign Out"/>
  </div>
);

const logInButton = () => (
  <div className={styles['nav__top-row__user-controls']}>
    <DefaultButton onClick={() => signIn()} iconProps={{iconName: 'AddFriend'}} text="Sign In"/>
  </div>
)

export const Navbar: React.FC = (props) => {
  // todo split into multiple components
  const {session, status} = useKalilaSession();
  const [links, setLinks] = useState<INavbarLink[]>([]);
  const [loggedUser, setLoggedUser] = useState<string | undefined | null>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>('');
  const [banner, setBanner] = useState<string[]>([]);
  const [userControlsElement, setUserControlsElement] = useState<JSX.Element | null>(null);
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
          setLinks([...NavbarState.UserLinks, ...NavbarState.AdminLinks])
        } else {
          setIsAdmin(false)
          setLinks(NavbarState.UserLinks)
        }
        break;
      default:
        setLoggedUser(undefined);
        setLinks([])
        break;
    }
  }, [status]);

  useEffect(() => setUserControlsElement(loggedUser ? logOutButton(loggedUser) : logInButton()), [loggedUser])

  useEffect(() => setCollapse(
    breakpoints.s as boolean
    || breakpoints.m as boolean
    || breakpoints.l as boolean
  ), [breakpoints.s, breakpoints.m, breakpoints.l]);

  return (
    <nav className={styles['nav']}>
      <div className={styles['nav__top-row']}>
        <div>
          <KalilaLogo/>
        </div>
        {userControlsElement}
      </div>
      <div className={styles['nav__bottom-row']}><p> Banner</p>
      </div>
    </nav>
  );
}


