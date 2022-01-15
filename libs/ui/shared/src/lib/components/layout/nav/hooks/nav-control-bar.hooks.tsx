import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {MediaQueryWrapper} from "@frontend/shared-ui";
import styles from "../nav.module.scss";
import {NavLinks} from "../nav-links";
import {SidePanToggle} from "../nav-control-bar";
import {NavbarStore} from "../store";

export function useNavControlBarState() {
  const {push} = useRouter();
  const {openPanel} = useContext(NavbarStore).dispatchers;
  const {isSmallScreen} = useContext(MediaQueryWrapper);
  const [sidePanToggle, setSidePanToggle] = useState(<></>)
  const [navLinks, setNavLinks] = useState(<></>)
  const [classes, setClasses] = useState({
    controlBar: styles['nav__control-bar'],
    logo: styles['nav__control-bar__logo']
  })

  useEffect(() => {
    if (isSmallScreen) {
      setClasses({
        controlBar: styles['nav__control-bar'],
        logo: styles['nav__control-bar__logo']
      })
      setNavLinks(<></>);
      setSidePanToggle(<SidePanToggle openPanel={openPanel}/>)
    } else {
      setClasses({
        controlBar: styles['nav__control-bar-small-screen'],
        logo: styles['nav__control-bar-small-screen__logo']
      })
      setNavLinks(<NavLinks/>)
      setSidePanToggle(<></>);
    }

  }, [isSmallScreen])

  return {push, classes, sidePanToggle, navLinks}
}
