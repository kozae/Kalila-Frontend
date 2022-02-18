import React, { useContext, useEffect, useState } from 'react';
import styles from './nav.module.scss';
import Link from 'next/link';
import { NavbarStore } from './store';
import Drawer from '@mui/material/Drawer';

export const SidePanel: React.FC = () => {
  const { data, methods } = useContext(NavbarStore);
  const { isPanelOpen, links, activeLink } = data;
  const { dismissPanel } = methods;
  const [classes, setClassesState] = useState<string[]>([]);

  useEffect(
    () =>
      setClassesState(
        links.map((l) =>
          l.Ref === activeLink
            ? styles['nav__side-panel__links__active-item']
            : styles['nav__side-panel__links__item']
        )
      ),
    [activeLink, links]
  );
  return (
    <Drawer anchor={'left'} open={isPanelOpen} onClose={dismissPanel}>
      <div className={styles['nav__side-panel__links']}>
        {links.map((link, i) => (
          <Link href={link.Ref} key={i}>
            <a className={classes[i]}> {link.Name} </a>
          </Link>
        ))}
      </div>
    </Drawer>
  );
};
