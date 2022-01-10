import styles from './navbar.module.scss';
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {
  DefaultButton, HighContrastSelector, IButtonStyles,
  IconButton,
  IContextualMenuProps,
  Persona,
  PersonaInitialsColor,
  PersonaSize,
} from "@fluentui/react";
import {signIn, signOut} from "next-auth/react";
import {KalilaLogo} from "../../kalila-logo";
import {MediaQueryContext, useKalilaSession} from "../../../util";
import {INavbarLink, NavbarState} from "../../../constants";
import {determinePathParameters} from "../../../util";
import {verifyAdmin} from "../../../util";

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: 'signOut',
      text: 'Sign Out',
      iconProps: { iconName: 'UserRemove' },
    },
    {
      key: 'accountSettings',
      text: 'Account Settings',
      iconProps: { iconName: 'Settings' },
    },
  ],
};

const customSplitButtonStyles: IButtonStyles = {
  splitButtonMenuButton: { backgroundColor: 'white', width: 28, border: 'none' },
  splitButtonMenuIcon: { fontSize: '10px' },
  splitButtonDivider: { backgroundColor: '#c8c8c8', width: 2, right: 26, position: 'absolute', top: 4, bottom: 4 },
  splitButtonContainer: {
    selectors: {
      [HighContrastSelector]: { border: 'none' },
    },
  },
};

const logOutButton = (loggedUser: string) => (
  <div className={styles['nav__top-row__user-controls']}>
    <Persona  imageInitials={'MK'}
              secondaryText={'Admin'}
              initialsColor={PersonaInitialsColor.green}
              text={loggedUser}
              size={PersonaSize.size40}/>
    <IconButton
      split
      iconProps={{iconName: 'Settings'}}
      splitButtonAriaLabel="See 2 options"
      aria-roledescription="split button"
      styles={customSplitButtonStyles}
      menuProps={menuProps}
      ariaLabel="New item"
      onClick={() => signOut()}
    />
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


