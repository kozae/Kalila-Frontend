import React, {useContext, useEffect, useState} from "react";
import {Panel, PanelType} from "@fluentui/react";
import {NavbarContext} from "@frontend/shared-ui";
import styles from "./nav.module.scss";
import Link from "next/link";


export const SidePanel: React.FC = ()=> {
  const {isPanelOpen, dismissPanel, links, activeLink} = useContext(NavbarContext);
  const [classes, setClassesState] = useState<string[]>([])

  useEffect(() => setClassesState(
    links.map(l => l.Ref === activeLink ? styles['nav__side-panel__links__active-item'] : styles['nav__side-panel__links__item'])
  ), [activeLink, links])
  return (
    <Panel
      isLightDismiss
      type={PanelType.smallFixedNear}
      isOpen={isPanelOpen}
      onDismiss={dismissPanel}
      closeButtonAriaLabel="Close"
    >
      <div className={styles['nav__side-panel__links']}>
        {
          links.map((link, i) => (
            <Link href={link.Ref} key={i}>
              <a  className={classes[i]}> {link.Name} </a>
            </Link>
          ))
        }
      </div>
    </Panel>
  )
}
