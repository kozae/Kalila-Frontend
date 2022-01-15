import styles from './layout.module.scss';
import React from "react";
import {Nav} from "./nav";
import {useKeycloakStore} from "../../stores/keycloak.store/hooks";


export const Layout: React.FC = ({children}) => {

  return (
    <>
      <Nav/>
      <div className={styles['kalila']}>
        <main className={styles['main']}>
          {children}
        </main>
      </div>

    </>
  );
}

