import React, {useContext, useEffect} from "react";
import styles from "./navbar.module.scss";
import {NavbarContext} from "@frontend/shared-ui";

export const NavMessageBar: React.FC = () => {
  const {messages} = useContext(NavbarContext);


  return (
    <div className={styles['nav__message-bar']}>{
      messages.map((m, i) => <p key={i}>{m}</p>)
    }</div>

  )
}
