import React, {useContext} from "react";
import styles from "./nav.module.scss";
import {NavbarContext} from "@frontend/shared-ui";
import {motion} from "framer-motion";

export const NavMessageBar: React.FC = () => {
  const {messages} = useContext(NavbarContext);

  return (
    <div className={styles['nav__message-bar']}>
      {messages[0] && (<motion.p
          className={styles['nav__message-bar__main']}
          key={0}
          initial={{x: 100, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{x: -100, opacity: 0}}>{messages[0]}</motion.p>
      )}
      {messages[1] && (<motion.p
        className={styles['nav__message-bar__secondary']}
        key={1}
        initial={{x: -100, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: 100, opacity: 0}}> {messages[1]}</motion.p>)}

    </div>

  )
}
