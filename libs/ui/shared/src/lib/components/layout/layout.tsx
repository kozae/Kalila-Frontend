import styles from './layout.module.scss';
import React from "react";
import {Navbar} from "./nav";
import {AnimatePresence, motion} from "framer-motion";

export const withTransition = (OriginalComponent: React.JSXElementConstructor<any>) => {
  return () => (
    <>
      <OriginalComponent/>
      <motion.div
        className="slide-in"
        initial={{scaleX: 0}}
        animate={{scaleX: 0}}
        exit={{scaleX: 1}}
        transition={{duration: 1, ease: "easeInOut"}}
      />
      <motion.div
        className="slide-out"
        initial={{scaleX: 1}}
        animate={{scaleX: 0}}
        exit={{scaleX: 0}}
        transition={{duration: 1, ease: "easeInOut"}}
      />
    </>
  );
};

export const Layout: React.FC = ({children}) => {
  return (
    <>
      <Navbar/>
      <main className={styles['main']}>{children}</main>
    </>
  );
}

