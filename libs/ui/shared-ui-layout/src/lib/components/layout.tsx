import styles from './layout.module.scss';
import React from "react";
import {Navbar} from "./navbar";



export const Layout: React.FC = ({children })=> {
  return (
    <>
      <Navbar />
      <main className={styles['main']}>{children}</main>
    </>
  );
}

