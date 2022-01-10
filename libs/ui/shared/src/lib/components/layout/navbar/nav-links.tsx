import styles from "./navbar.module.scss";
import React, {useContext} from "react";
import {NavbarContext} from "@frontend/shared-ui";
import Link from "next/link";


export const NavLinks: React.FC = () => {
  const {links} = useContext(NavbarContext);
  return <div className={styles['nav__control-bar__links']}>
    {
      links.map((link, i) => (
        <Link href={link.Ref} key={i}>
          <a  className={styles['nav__control-bar__links__item']}> {link.Name} </a>
        </Link>
      ))
    }
  </div>
}
