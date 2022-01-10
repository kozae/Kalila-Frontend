import styles from './layout.module.scss';
import React from "react";
import {Navbar} from "./navbar";
import {AnimatePresence} from "framer-motion";


export const Layout: React.FC = ({children}) => {
  return (
    <>
      <Navbar/>
      <AnimatePresence exitBeforeEnter>
        <main className={styles['main']}>{children}</main>
      </AnimatePresence>
    </>
  );
}

