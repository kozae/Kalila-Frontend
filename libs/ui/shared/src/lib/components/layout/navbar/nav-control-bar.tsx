import React, {useContext, useEffect, useState} from "react";
import styles from "./navbar.module.scss";
import {KalilaLogo, NavbarContext} from "@frontend/shared-ui";
import {NavUserControls} from "./user-controls";
import {useRouter} from "next/router";
import {NavLinks} from "./nav-links";
import {getIconClassName, IconButton} from "@fluentui/react";


export const NavControlBar: React.FC = () => {
  const {push} = useRouter();
  const {isSmallScreen} = useContext(NavbarContext)
  const [classes, setClasses] = useState({
    controlBar: styles['nav__control-bar'],
    logo: styles['nav__control-bar__logo']
  })
  useEffect(() => {
    const state = isSmallScreen ? {
      controlBar: styles['nav__control-bar'],
      logo: styles['nav__control-bar__logo']
    } : {
      controlBar: styles['nav__control-bar-small-screen'],
      logo: styles['nav__control-bar-small-screen__logo']
    };
    setClasses(state);
  }, [isSmallScreen])

  const CollapseMenuIconProps = {
    iconName: 'CollapseMenu',
    styles: {
      root: {
        fontSize: '1.5rem'
      }
    }
  };

  return (
    <div className={styles['nav__control-bar']}>
      {isSmallScreen ? <div className={styles['nav__control-bar-small-screen__pan-toggle']}>
        <IconButton iconProps={CollapseMenuIconProps} title="SidePan" ariaLabel="SidePan"/>
      </div> : null}

      <div className={styles['nav__control-bar__logo']} onClick={() => push('/')}>
        <KalilaLogo/>
      </div>
      {!isSmallScreen ? <NavLinks/> : null}
      <NavUserControls/>
    </div>
  )
}
