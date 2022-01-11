import styles from "./nav.module.scss";
import {
  DefaultButton,
  HighContrastSelector,
  IButtonStyles, IconButton,
  IContextualMenuProps,
  Persona,
  PersonaInitialsColor, PersonaSize
} from "@fluentui/react";
import {signIn, signOut} from "next-auth/react";
import React, {useContext, useEffect, useState} from "react";
import {stringHasValue} from "@frontend/util";
import {MediaQueryContext, NavbarContext} from "@frontend/shared-ui";
import {useRouter} from "next/router";


const customSplitButtonStyles: IButtonStyles = {
  splitButtonMenuButton: {backgroundColor: 'white', width: 28, border: 'none'},
  splitButtonMenuIcon: {fontSize: '10px'},
  splitButtonDivider: {backgroundColor: '#c8c8c8', width: 2, right: 26, position: 'absolute', top: 4, bottom: 4},
  splitButtonContainer: {
    selectors: {
      [HighContrastSelector]: {border: 'none'},
    },
  },
};


const LogOutButton: React.FC<{ loggedUser: string }> = ({loggedUser}) => {
  const {isNotXLScreen} = useContext(MediaQueryContext);

  const {push} = useRouter();

  // todo determine initials and secondary text

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'signOut',
        text: 'Sign Out',
        iconProps: {iconName: 'UserRemove'},
        onClick: () => {
          signOut().catch()
        }
      },
      {
        key: 'accountSettings',
        text: 'Account Settings',
        iconProps: {iconName: 'Settings'},
        onClick: () => {
          push('/account').catch()
        }
      },
    ],
  };

  return (
    <div className={styles['nav__control-bar__user-controls']}>
      <Persona imageInitials={'MK'}
               secondaryText={'Admin'}
               initialsColor={PersonaInitialsColor.green}
               text={loggedUser}
               hidePersonaDetails={isNotXLScreen}
               size={PersonaSize.size40}/>
      <IconButton
        split
        iconProps={{iconName: 'Settings'}}
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        styles={customSplitButtonStyles}
        menuProps={menuProps}
        ariaLabel="New item"
        onClick={() => push('/account')}
      />
    </div>
  );

}

export const NavUserControls: React.FC = () => {
  const {loggedUser} = useContext(NavbarContext);
  const [element, setElement] = useState<JSX.Element>(<></>)

  const logInButton = () => (
    <div className={styles['nav__control-bar__user-controls']}>
      <DefaultButton onClick={() => signIn()} iconProps={{iconName: 'AddFriend'}} text="Sign In"/>
    </div>
  )


  useEffect(() =>
      setElement(stringHasValue(loggedUser) ? <LogOutButton loggedUser={loggedUser as string}/> : logInButton())
    , [loggedUser]);

  return element

}
