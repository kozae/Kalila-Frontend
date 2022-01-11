import styles from "./nav.module.scss";
import React, {useContext, useEffect, useState} from "react";
import {NavbarContext} from "@frontend/shared-ui";
import Link from "next/link";


export const NavLinks: React.FC = () => {
  const {links, activeLink} = useContext(NavbarContext);
  const [classes, setClassesState] = useState<string[]>([])

  useEffect(() => setClassesState(
    links.map(l => l.Ref === activeLink ? styles['nav__control-bar__links__active-item'] : styles['nav__control-bar__links__item'])
  ), [activeLink, links])


  return <div className={styles['nav__control-bar__links']}>
    {
      links.map((link, i) => (
        <Link href={link.Ref} key={i}>
          <a className={classes[i]}> {link.Name} </a>
        </Link>
      ))
    }
  </div>
}
