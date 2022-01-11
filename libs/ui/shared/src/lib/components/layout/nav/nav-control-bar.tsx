import React from "react";
import styles from "./nav.module.scss";
import {KalilaLogo} from "@frontend/shared-ui";
import {NavUserControls} from "./user-controls";

import {IconButton} from "@fluentui/react";
import {useNavControlBarState} from "./hooks/nav-control-bar.hooks";

export const SidePanToggle: React.FC<{ openPanel: () => void }> = ({openPanel}) => {
  const CollapseMenuIconProps = {
    iconName: 'CollapseMenu',
    styles: {
      root: {
        fontSize: '1.5rem'
      }
    }
  };
  return (
    <div className={styles['nav__control-bar-small-screen__pan-toggle']}>
      <IconButton onClick={openPanel} iconProps={CollapseMenuIconProps} title="SidePanToggle"
                  ariaLabel="SidePanToggle"/>
    </div>
  )
}

export const NavControlBar: React.FC = () => {
  const {push, classes, sidePanToggle, navLinks} = useNavControlBarState();
  return (
    <div className={classes.controlBar}>
      {sidePanToggle}
      <div className={classes.logo} onClick={() => push('/')}>
        <KalilaLogo/>
      </div>
      {navLinks}
      <NavUserControls/>
    </div>
  )
}
