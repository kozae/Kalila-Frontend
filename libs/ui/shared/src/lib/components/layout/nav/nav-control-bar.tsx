import React from "react";
import styles from "./nav.module.scss";
import {KalilaLogo} from "@frontend/shared-ui";
import {NavUserControls} from "./user-controls";
import {useNavControlBarState} from "./hooks/nav-control-bar.hooks";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


export const SidePanToggle: React.FC<{ openPanel: () => void }> = ({openPanel}) => {

  return (
    <div className={styles['nav__control-bar-small-screen__pan-toggle']}>

      <IconButton onClick={openPanel} color="primary" aria-label="SidePanToggle">
        <MenuIcon />
      </IconButton>
    </div>
  )
}

export const NavControlBar: React.FC = () => {
  const {push, classes, sidePanToggle, navLinks} = useNavControlBarState();
  return (
    <div className={classes.controlBar}>
      <div className={styles['nav__control-bar__contents']}>
        {sidePanToggle}
        <div className={classes.logo} onClick={() => push('/')}>
          <KalilaLogo/>
        </div>
        {navLinks}
        <NavUserControls/>
      </div>

    </div>
  )
}
