import React, {useContext} from "react";
import styles from "./navbar.module.scss";
import {KalilaLogo, NavbarContext} from "@frontend/shared-ui";
import {NavUserControls} from "./user-controls";
import {useRouter} from "next/router";


export const NavControlBar: React.FC = () => {
  const {push} = useRouter();
  const {links} = useContext(NavbarContext);
  return (
    <div className={styles['nav__control-bar']}>
      <div className={styles['nav__control-bar__logo']} onClick={() => push('/')}>
        <KalilaLogo/>
      </div>
      <NavUserControls/>
    </div>
  )
}
