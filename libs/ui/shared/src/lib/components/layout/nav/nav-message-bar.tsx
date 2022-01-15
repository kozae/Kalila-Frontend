import React, {useContext} from "react";
import styles from "./nav.module.scss";
import {motion} from "framer-motion";
import {ProgressIndicator} from "@fluentui/react";
import {NavbarStore} from "./store";

export const NavMessageBar: React.FC = () => {
  const {messages} = useContext(NavbarStore).state;

  return (
    <div className={styles['nav__message-bar']}>
      <div className={styles['nav__message-bar__contents']}>
        {
          !messages[0] && (
            <div className={styles['nav__message-bar__progress-indicator']}>
              <ProgressIndicator barHeight={4}/>
            </div>
          )
        }
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

    </div>

  )
}
